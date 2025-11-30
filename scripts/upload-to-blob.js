/**
 * Upload initial data to Vercel Blob
 * 
 * This script uploads articles.json and memberships.json to Vercel Blob
 * and displays the BLOB_URL_PREFIX that should be set in Vercel environment variables.
 */

const { put, list } = require('@vercel/blob');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function uploadData() {
    const token = process.env.BLOB_READ_WRITE_TOKEN;

    if (!token) {
        console.error('❌ Error: BLOB_READ_WRITE_TOKEN is not set in .env');
        console.error('Please add it to your .env file and try again.');
        process.exit(1);
    }

    console.log('🚀 Starting data upload to Vercel Blob...\n');

    try {
        // Upload articles.json
        const articlesPath = path.join(__dirname, '..', 'data', 'articles.json');
        if (fs.existsSync(articlesPath)) {
            console.log('📤 Uploading articles.json...');
            const articlesData = fs.readFileSync(articlesPath, 'utf-8');
            const articlesBlob = await put('articles.json', articlesData, {
                access: 'public',
                contentType: 'application/json',
                token,
                addRandomSuffix: false,
            });
            console.log('✅ articles.json uploaded successfully');
            console.log('   URL:', articlesBlob.url);

            // Extract and display BLOB_URL_PREFIX
            const prefix = articlesBlob.url.substring(0, articlesBlob.url.lastIndexOf('/'));
            console.log('\n📋 BLOB_URL_PREFIX (add this to Vercel environment variables):');
            console.log('   ' + prefix);
        } else {
            console.warn('⚠️  articles.json not found at:', articlesPath);
        }

        // Upload memberships.json
        const membershipsPath = path.join(__dirname, '..', 'data', 'memberships.json');
        if (fs.existsSync(membershipsPath)) {
            console.log('\n📤 Uploading memberships.json...');
            const membershipsData = fs.readFileSync(membershipsPath, 'utf-8');
            const membershipsBlob = await put('memberships.json', membershipsData, {
                access: 'public',
                contentType: 'application/json',
                token,
                addRandomSuffix: false,
            });
            console.log('✅ memberships.json uploaded successfully');
            console.log('   URL:', membershipsBlob.url);
        } else {
            console.warn('⚠️  memberships.json not found at:', membershipsPath);
        }

        // List all blobs to verify
        console.log('\n📦 Current blobs in storage:');
        const { blobs } = await list({ token });
        blobs.forEach(blob => {
            console.log(`   - ${blob.pathname} (${(blob.size / 1024).toFixed(2)} KB)`);
        });

        console.log('\n✅ Upload complete!');
        console.log('\n📝 Next steps:');
        console.log('1. Copy the BLOB_URL_PREFIX shown above');
        console.log('2. Go to Vercel Dashboard > Settings > Environment Variables');
        console.log('3. Add BLOB_URL_PREFIX with the value shown above');
        console.log('4. Redeploy your application');

    } catch (error) {
        console.error('❌ Error uploading to Blob:', error.message);
        if (error.message.includes('Access denied')) {
            console.error('\n💡 Tip: Make sure your BLOB_READ_WRITE_TOKEN is correct.');
            console.error('   Get it from: Vercel Dashboard > Storage > Your Blob Store > Settings');
        }
        process.exit(1);
    }
}

uploadData();
