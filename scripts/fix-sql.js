const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

console.log('🔧 Fixing ArticleMembership SQL statements...\n');

const sqlContent = fs.readFileSync(path.join(__dirname, 'import.sql'), 'utf-8');
const lines = sqlContent.split('\n');

const fixedLines = lines.map(line => {
    if (line.includes('INSERT INTO "ArticleMembership"') && !line.includes('"id"')) {
        // Add id field with UUID
        const match = line.match(/VALUES \('([^']+)', '([^']+)'\)/);
        if (match) {
            const articleId = match[1];
            const membershipId = match[2];
            const id = uuidv4();
            return `INSERT INTO "ArticleMembership" (id, "articleId", "membershipId") VALUES ('${id}', '${articleId}', '${membershipId}') ON CONFLICT ("articleId", "membershipId") DO NOTHING;`;
        }
    }
    return line;
});

const fixedSql = fixedLines.join('\n');
fs.writeFileSync(path.join(__dirname, 'import-fixed.sql'), fixedSql);

console.log('✅ Fixed SQL file created: scripts/import-fixed.sql');
console.log('\nNow re-splitting into batches...');

// Re-split the fixed SQL
const batches = [];
let currentBatch = [];
let batchSize = 0;
const MAX_BATCH_SIZE = 100;

fixedLines.forEach(line => {
    if (line.trim().startsWith('--') || line.trim() === '') {
        currentBatch.push(line);
    } else if (line.trim().startsWith('INSERT')) {
        if (batchSize >= MAX_BATCH_SIZE) {
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

if (currentBatch.length > 0) {
    batches.push(currentBatch.join('\n'));
}

// Write fixed batch files
const batchDir = path.join(__dirname, 'sql-batches-fixed');
if (!fs.existsSync(batchDir)) {
    fs.mkdirSync(batchDir);
}

batches.forEach((batch, index) => {
    const filename = `batch-${String(index + 1).padStart(2, '0')}.sql`;
    fs.writeFileSync(path.join(batchDir, filename), batch);
});

console.log(`✅ Created ${batches.length} fixed batch files in scripts/sql-batches-fixed/`);
console.log('\nRun: node scripts/execute-fixed-batches.js');
