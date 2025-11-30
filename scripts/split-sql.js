const fs = require('fs');
const path = require('path');

console.log('📦 Splitting SQL file into batches...\n');

const sqlContent = fs.readFileSync(path.join(__dirname, 'import.sql'), 'utf-8');
const lines = sqlContent.split('\n');

// Group by INSERT statements
const batches = [];
let currentBatch = [];
let batchSize = 0;
const MAX_BATCH_SIZE = 100; // 100 statements per batch

lines.forEach(line => {
    if (line.trim().startsWith('--') || line.trim() === '') {
        // Keep comments and empty lines
        currentBatch.push(line);
    } else if (line.trim().startsWith('INSERT')) {
        if (batchSize >= MAX_BATCH_SIZE) {
            // Start new batch
            batches.push(currentBatch.join('\n'));
            currentBatch = [];
            batchSize = 0;
        }
        currentBatch.push(line);
        batchSize++;
    } else {
        currentBatch.push(line);
    }
});

// Add remaining batch
if (currentBatch.length > 0) {
    batches.push(currentBatch.join('\n'));
}

// Write batch files
const batchDir = path.join(__dirname, 'sql-batches');
if (!fs.existsSync(batchDir)) {
    fs.mkdirSync(batchDir);
}

batches.forEach((batch, index) => {
    const filename = `batch-${String(index + 1).padStart(2, '0')}.sql`;
    fs.writeFileSync(path.join(batchDir, filename), batch);
    console.log(`✅ Created ${filename} (${batch.split('\n').filter(l => l.includes('INSERT')).length} statements)`);
});

console.log(`\n🎉 Created ${batches.length} batch files in scripts/sql-batches/`);
console.log('\n📋 Instructions:');
console.log('1. Open Neon Console SQL Editor');
console.log('2. Execute each batch file in order (batch-01.sql, batch-02.sql, etc.)');
console.log('3. Wait for each batch to complete before running the next one');
console.log('\nOr use the automated execution script: node scripts/execute-batches.js');
