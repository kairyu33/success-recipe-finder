const { list, put } = require('@vercel/blob');
require('dotenv').config();

async function main() {
    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (!token) {
        console.error('Error: BLOB_READ_WRITE_TOKEN is not set in .env');
        process.exit(1);
    }

    console.log('Checking Vercel Blob connection...');

    try {
        // Try to list first
        const { blobs } = await list({ token });
        console.log(`Successfully connected! Found ${blobs.length} blobs.`);

        if (blobs.length > 0) {
            const url = blobs[0].url;
            console.log('Sample Blob URL:', url);
            // Extract prefix
            const prefix = url.substring(0, url.lastIndexOf('/'));
            console.log('\nSuggested BLOB_URL_PREFIX:', prefix);
        } else {
            console.log('No blobs found. Uploading a test blob to determine URL prefix...');
            const { url } = await put('test-connection.txt', 'Hello Vercel Blob', {
                access: 'public',
                token,
                addRandomSuffix: false
            });
            console.log('Test blob uploaded to:', url);
            const prefix = url.substring(0, url.lastIndexOf('/'));
            console.log('\nSuggested BLOB_URL_PREFIX:', prefix);
        }

    } catch (error) {
        console.error('Error connecting to Vercel Blob:', error.message);
    }
}

main();
