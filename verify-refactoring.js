#!/usr/bin/env node

/**
 * Verification Script for Refactored Architecture
 *
 * @description Checks that all refactored files are in place and properly structured.
 * Run this after pulling the refactored code to ensure everything is set up correctly.
 *
 * Usage:
 *   node verify-refactoring.js
 */

const fs = require('fs');
const path = require('path');

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkFile(filePath, description) {
  const fullPath = path.join(__dirname, filePath);
  const exists = fs.existsSync(fullPath);

  if (exists) {
    log(`  ✓ ${description}`, 'green');
    return true;
  } else {
    log(`  ✗ ${description}`, 'red');
    log(`    Missing: ${filePath}`, 'yellow');
    return false;
  }
}

function checkDirectory(dirPath, description) {
  const fullPath = path.join(__dirname, dirPath);
  const exists = fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory();

  if (exists) {
    log(`  ✓ ${description}`, 'green');
    return true;
  } else {
    log(`  ✗ ${description}`, 'red');
    log(`    Missing directory: ${dirPath}`, 'yellow');
    return false;
  }
}

async function main() {
  log('\n🔍 Verifying Refactored Architecture...\n', 'cyan');

  let allGood = true;

  // Check AI Services
  log('📦 AI Services:', 'blue');
  allGood &= checkFile('app/services/ai/AIService.interface.ts', 'AI Service Interface');
  allGood &= checkFile('app/services/ai/AnthropicService.ts', 'Anthropic Service Implementation');
  allGood &= checkFile('app/services/ai/AIServiceFactory.ts', 'AI Service Factory');

  // Check Analysis Services
  log('\n📊 Analysis Services:', 'blue');
  allGood &= checkFile('app/services/analysis/types.ts', 'Analysis Types');
  allGood &= checkFile('app/services/analysis/BaseAnalysisService.ts', 'Base Analysis Service');
  allGood &= checkFile('app/services/analysis/HashtagService.ts', 'Hashtag Service');

  // Check Cache Services
  log('\n💾 Cache Services:', 'blue');
  allGood &= checkFile('app/services/cache/CacheService.interface.ts', 'Cache Service Interface');
  allGood &= checkFile('app/services/cache/MemoryCacheService.ts', 'Memory Cache Service');

  // Check Configuration
  log('\n⚙️  Configuration:', 'blue');
  allGood &= checkFile('app/services/config/PromptTemplates.ts', 'Prompt Templates');
  allGood &= checkFile('app/services/config/ModelConfig.ts', 'Model Configuration');

  // Check Service Index
  log('\n📚 Exports:', 'blue');
  allGood &= checkFile('app/services/index.ts', 'Service Index (convenient imports)');

  // Check Examples and Documentation
  log('\n📖 Documentation:', 'blue');
  allGood &= checkFile('ARCHITECTURE.md', 'Architecture Documentation');
  allGood &= checkFile('MIGRATION_GUIDE.md', 'Migration Guide');
  allGood &= checkFile('REFACTORING_SUMMARY.md', 'Refactoring Summary');
  allGood &= checkFile('app/api/generate-hashtags/route.refactored.ts', 'Example Refactored Route');

  // Check TypeScript Configuration
  log('\n🔧 TypeScript Configuration:', 'blue');
  const tsconfigPath = path.join(__dirname, 'tsconfig.json');
  if (fs.existsSync(tsconfigPath)) {
    const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
    const hasPathAlias = tsconfig.compilerOptions?.paths?.['@/*'];

    if (hasPathAlias) {
      log('  ✓ Path alias @/* configured', 'green');
    } else {
      log('  ✗ Path alias @/* not configured', 'red');
      log('    Add to tsconfig.json: "paths": { "@/*": ["./*"] }', 'yellow');
      allGood = false;
    }
  } else {
    log('  ✗ tsconfig.json not found', 'red');
    allGood = false;
  }

  // Check Environment Variables
  log('\n🔐 Environment Variables:', 'blue');
  const envPath = path.join(__dirname, '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');

    const checks = [
      { key: 'ANTHROPIC_API_KEY', required: true },
      { key: 'DEFAULT_AI_PROVIDER', required: false },
      { key: 'DEFAULT_AI_MODEL', required: false },
      { key: 'CACHE_PROVIDER', required: false },
      { key: 'ENABLE_CACHING', required: false },
    ];

    checks.forEach(({ key, required }) => {
      const hasKey = envContent.includes(key);
      if (hasKey) {
        log(`  ✓ ${key} configured`, 'green');
      } else if (required) {
        log(`  ✗ ${key} missing (required)`, 'red');
        allGood = false;
      } else {
        log(`  ⚠ ${key} missing (optional)`, 'yellow');
      }
    });
  } else {
    log('  ✗ .env.local not found', 'red');
    log('    Copy .env.example to .env.local and add your API keys', 'yellow');
    allGood = false;
  }

  // Summary
  log('\n' + '='.repeat(60), 'cyan');
  if (allGood) {
    log('✅ All checks passed! Refactoring is properly set up.', 'green');
    log('\nNext steps:', 'cyan');
    log('  1. Review ARCHITECTURE.md for detailed documentation', 'reset');
    log('  2. Review MIGRATION_GUIDE.md for migration steps', 'reset');
    log('  3. Run: npm run type-check', 'reset');
    log('  4. Run: npm run dev', 'reset');
    log('  5. Test the refactored endpoint', 'reset');
  } else {
    log('❌ Some checks failed. Please fix the issues above.', 'red');
    log('\nCommon fixes:', 'cyan');
    log('  • Ensure all service files are created', 'reset');
    log('  • Check tsconfig.json path aliases', 'reset');
    log('  • Set up .env.local with API keys', 'reset');
    log('  • Run: npm install (if dependencies are missing)', 'reset');
  }
  log('='.repeat(60) + '\n', 'cyan');

  process.exit(allGood ? 0 : 1);
}

// Run verification
main().catch((error) => {
  log(`\n❌ Error during verification: ${error.message}`, 'red');
  console.error(error);
  process.exit(1);
});
