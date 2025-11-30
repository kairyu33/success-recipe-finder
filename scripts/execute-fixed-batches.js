require('dotenv').config();
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const DATABASE_URL = process.env.POSTGRES_PRISMA_URL || process.env.POSTGRES_URL;

if (!DATABASE_URL) {
    console.error('❌ Error: POSTGRES_PRISMA_URL or POSTGRES_URL environment variable not set');
    process.exit(1);
}

async function executeBatches() {
    const client = new Client({
        connectionString: DATABASE_URL,
    });

    try {
        console.log('🔌 Connecting to database...');
        await client.connect();
        console.log('✅ Connected!\n');

        const batchDir = path.join(__dirname, 'sql-batches-fixed');

        if (!fs.existsSync(batchDir)) {
            console.error('❌ Error: sql-batches-fixed directory not found');
            process.exit(1);
        }

        const batchFiles = fs.readdirSync(batchDir)
            .filter(f => f.endsWith('.sql'))
            .sort();

        console.log(`📦 Found ${batchFiles.length} batch files\n`);

        for (const file of batchFiles) {
            console.log(`⏳ Executing ${file}...`);
            const sql = fs.readFileSync(path.join(batchDir, file), 'utf-8');

            try {
                await client.query(sql);
                console.log(`✅ ${file} completed\n`);
            } catch (error) {
                console.error(`❌ Error in ${file}:`, error.message);
                console.log('Continuing with next batch...\n');
            }
        }

        // Verify results
        console.log('📊 Verifying data...');
        const membershipCount = await client.query('SELECT COUNT(*) FROM "Membership"');
        const articleCount = await client.query('SELECT COUNT(*) FROM "Article"');
        const linkCount = await client.query('SELECT COUNT(*) FROM "ArticleMembership"');

        console.log(`\n🎉 Migration completed!`);
        console.log(`   - Memberships: ${membershipCount.rows[0].count}`);
        console.log(`   - Articles: ${articleCount.rows[0].count}`);
        console.log(`   - Links: ${linkCount.rows[0].count}`);

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    } finally {
        await client.end();
    }
}

executeBatches();
