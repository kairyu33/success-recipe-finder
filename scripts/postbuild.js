/**
 * Postbuild script to ensure Prisma binaries are correctly placed
 * This runs after Next.js build to verify and copy Prisma files
 */

const fs = require('fs');
const path = require('path');

const PRISMA_CLIENT_PATH = path.join(__dirname, '..', 'node_modules', '.prisma', 'client');
const STANDALONE_PATH = path.join(__dirname, '..', '.next', 'standalone', 'node_modules', '.prisma', 'client');

console.log('🔧 Postbuild: Checking Prisma binaries...');

// Check if Prisma client exists
if (fs.existsSync(PRISMA_CLIENT_PATH)) {
  console.log('✅ Prisma client found at:', PRISMA_CLIENT_PATH);
  
  // List all files in .prisma/client
  const files = fs.readdirSync(PRISMA_CLIENT_PATH);
  console.log('📦 Prisma client files:', files.length);
  
  // Check for query engine binary
  const queryEngineBinary = files.find(f => f.includes('libquery_engine') && f.includes('rhel-openssl-3.0.x'));
  if (queryEngineBinary) {
    console.log('✅ Query engine binary found:', queryEngineBinary);
  } else {
    console.warn('⚠️  Query engine binary for rhel-openssl-3.0.x not found!');
    console.log('Available files:', files);
  }
  
  // Copy to standalone if it exists
  if (fs.existsSync(path.join(__dirname, '..', '.next', 'standalone'))) {
    console.log('📦 Copying Prisma files to standalone...');
    const standalonePrismaDir = path.dirname(STANDALONE_PATH);
    
    if (!fs.existsSync(standalonePrismaDir)) {
      fs.mkdirSync(standalonePrismaDir, { recursive: true });
    }
    
    // Copy all files
    fs.cpSync(PRISMA_CLIENT_PATH, STANDALONE_PATH, { recursive: true });
    console.log('✅ Prisma files copied to standalone build');
  }
} else {
  console.error('❌ Prisma client not found at:', PRISMA_CLIENT_PATH);
  process.exit(1);
}

console.log('✅ Postbuild: Prisma setup complete');
