/**
 * API Cost Optimization Test Script
 *
 * Tests all three optimization strategies:
 * 1. Dynamic token allocation
 * 2. Response-level caching
 * 3. Cost monitoring
 *
 * Usage: node test-optimization.js
 */

const BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

// Test articles of different lengths
const TEST_ARTICLES = {
  short: {
    length: 500,
    text: 'AI技術を活用したnote記事の最適化について解説します。'.repeat(20)
  },
  medium: {
    length: 1500,
    text: 'Claude AIを使って、効果的なハッシュタグを自動生成する方法を紹介します。note.comでの記事投稿を最適化し、より多くの読者にリーチするためのテクニックを詳しく説明します。'.repeat(15)
  },
  long: {
    length: 3500,
    text: 'この記事では、最新のAI技術を活用して、note.comでの記事作成を効率化する方法について、詳しく解説していきます。特に、ハッシュタグの自動生成や、記事の分析機能について、実践的なアプローチを紹介します。'.repeat(25)
  }
};

// Test endpoints
const ENDPOINTS = [
  '/api/generate-hashtags',
  '/api/analyze-article',
  '/api/analyze-article-full'
];

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  console.log('\n' + '='.repeat(80));
  log(title, 'bright');
  console.log('='.repeat(80) + '\n');
}

async function makeRequest(endpoint, articleText) {
  const startTime = Date.now();

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ articleText })
    });

    const responseTime = Date.now() - startTime;
    const data = await response.json();

    return {
      success: response.ok,
      status: response.status,
      data,
      responseTime
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      responseTime: Date.now() - startTime
    };
  }
}

async function getCostDashboard(action = 'summary') {
  try {
    const response = await fetch(`${BASE_URL}/api/cost-dashboard?action=${action}`);
    return await response.json();
  } catch (error) {
    log(`Error fetching dashboard: ${error.message}`, 'red');
    return null;
  }
}

async function testDynamicTokenAllocation() {
  logSection('TEST 1: Dynamic Token Allocation');

  for (const [size, article] of Object.entries(TEST_ARTICLES)) {
    log(`Testing ${size} article (${article.length} chars)...`, 'cyan');

    const result = await makeRequest('/api/generate-hashtags', article.text);

    if (result.success) {
      const cacheMetadata = result.data._cache;
      log(`  ✓ Status: ${result.status}`, 'green');
      log(`  ✓ Response time: ${result.responseTime}ms`, 'green');
      log(`  ✓ Cache status: ${cacheMetadata?.cacheStatus || 'N/A'}`, 'green');

      if (result.data.hashtags) {
        log(`  ✓ Hashtags generated: ${result.data.hashtags.length}`, 'green');
      }
    } else {
      log(`  ✗ Failed: ${result.error || result.status}`, 'red');
    }

    console.log('');
  }

  log('Dynamic token allocation test complete!', 'bright');
  log('Check server logs for token allocation details.', 'yellow');
}

async function testResponseCaching() {
  logSection('TEST 2: Response-Level Caching');

  const testArticle = TEST_ARTICLES.medium.text;
  const endpoint = '/api/generate-hashtags';

  log('Making FIRST request (should be cache MISS)...', 'cyan');
  const firstRequest = await makeRequest(endpoint, testArticle);

  if (firstRequest.success) {
    const firstCache = firstRequest.data._cache;
    log(`  ✓ Status: ${firstRequest.status}`, 'green');
    log(`  ✓ Response time: ${firstRequest.responseTime}ms`, 'green');
    log(`  ✓ Cache status: ${firstCache?.cacheStatus || 'N/A'}`, firstCache?.cacheStatus === 'miss' ? 'green' : 'yellow');
  } else {
    log(`  ✗ First request failed`, 'red');
    return;
  }

  console.log('');
  log('Waiting 2 seconds before second request...', 'yellow');
  await new Promise(resolve => setTimeout(resolve, 2000));
  console.log('');

  log('Making SECOND request (should be cache HIT)...', 'cyan');
  const secondRequest = await makeRequest(endpoint, testArticle);

  if (secondRequest.success) {
    const secondCache = secondRequest.data._cache;
    log(`  ✓ Status: ${secondRequest.status}`, 'green');
    log(`  ✓ Response time: ${secondRequest.responseTime}ms`, 'green');
    log(`  ✓ Cache status: ${secondCache?.cacheStatus || 'N/A'}`, secondCache?.cacheStatus === 'hit' ? 'green' : 'red');

    if (secondCache?.timeSaved) {
      log(`  ✓ Time saved: ${secondCache.timeSaved}ms`, 'green');
    }

    if (secondCache?.costSavings) {
      log(`  ✓ Estimated cost savings: ${secondCache.costSavings}`, 'green');
    }

    // Verify responses are identical
    if (JSON.stringify(firstRequest.data.hashtags) === JSON.stringify(secondRequest.data.hashtags)) {
      log(`  ✓ Cached response matches original`, 'green');
    } else {
      log(`  ✗ Cached response differs from original!`, 'red');
    }

    // Performance comparison
    const speedup = ((firstRequest.responseTime - secondRequest.responseTime) / firstRequest.responseTime * 100).toFixed(1);
    log(`  ✓ Cache speedup: ${speedup}% faster`, 'green');
  } else {
    log(`  ✗ Second request failed`, 'red');
  }

  console.log('');
  log('Response caching test complete!', 'bright');
}

async function testCostMonitoring() {
  logSection('TEST 3: Cost Monitoring & Analytics');

  log('Fetching cost dashboard summary...', 'cyan');
  const summary = await getCostDashboard('summary');

  if (summary) {
    log(`  ✓ Total requests today: ${summary.summary.totalRequests}`, 'green');
    log(`  ✓ Total cost today: $${summary.summary.totalCost.toFixed(6)}`, 'green');
    log(`  ✓ Avg cost per request: $${summary.summary.averageCostPerRequest.toFixed(6)}`, 'green');
    log(`  ✓ Cache hit rate: ${(summary.summary.cacheHitRate * 100).toFixed(1)}%`, 'green');
    log(`  ✓ Est. savings from cache: $${summary.summary.costSavingsFromCache.toFixed(6)}`, 'green');

    if (summary.budgetAlert) {
      const alert = summary.budgetAlert;
      if (alert.exceeded) {
        log(`  ⚠ Budget exceeded! $${alert.current.toFixed(2)} / $${alert.limit.toFixed(2)}`, 'red');
      } else {
        log(`  ✓ Budget OK: $${alert.current.toFixed(2)} / $${alert.limit.toFixed(2)} (${alert.remaining.toFixed(2)} remaining)`, 'green');
      }
    }
  }

  console.log('');
  log('Fetching cache statistics...', 'cyan');
  const cacheStats = await getCostDashboard('cache-stats');

  if (cacheStats && cacheStats.cache_stats) {
    const stats = cacheStats.cache_stats;
    log(`  ✓ Cache hits: ${stats.hits}`, 'green');
    log(`  ✓ Cache misses: ${stats.misses}`, 'green');
    log(`  ✓ Cache size: ${stats.size} entries`, 'green');
    log(`  ✓ Hit rate: ${(stats.hitRate * 100).toFixed(1)}%`, 'green');

    if (stats.estimatedCostSavings) {
      log(`  ✓ Total savings: $${stats.estimatedCostSavings.total.toFixed(4)}`, 'green');
    }
  }

  console.log('');
  log('Fetching optimization recommendations...', 'cyan');
  const recommendations = await getCostDashboard('optimize-recommendations');

  if (recommendations && recommendations.recommendations) {
    if (recommendations.recommendations.length === 0) {
      log(`  ✓ No optimization recommendations (system is optimized!)`, 'green');
    } else {
      log(`  Found ${recommendations.recommendations.length} recommendations:`, 'yellow');
      recommendations.recommendations.forEach((rec, idx) => {
        log(`  ${idx + 1}. [${rec.priority.toUpperCase()}] ${rec.title}`, rec.priority === 'high' ? 'red' : 'yellow');
        log(`     ${rec.description}`, 'reset');
        log(`     Potential savings: ${rec.potentialSavings}`, 'cyan');
      });
    }
  }

  console.log('');
  log('Cost monitoring test complete!', 'bright');
}

async function generateReport() {
  logSection('OPTIMIZATION TEST REPORT');

  const summary = await getCostDashboard('summary');
  const cacheStats = await getCostDashboard('cache-stats');

  if (summary && cacheStats) {
    const totalRequests = summary.summary.totalRequests;
    const cacheHitRate = summary.summary.cacheHitRate;
    const totalCost = summary.summary.totalCost;
    const cacheSavings = summary.summary.costSavingsFromCache;

    log('Performance Summary:', 'bright');
    console.log('');
    log(`  Total API Requests: ${totalRequests}`, 'cyan');
    log(`  Total Cost: $${totalCost.toFixed(6)}`, 'cyan');
    log(`  Average Cost/Request: $${summary.summary.averageCostPerRequest.toFixed(6)}`, 'cyan');
    console.log('');
    log(`  Cache Hit Rate: ${(cacheHitRate * 100).toFixed(1)}%`, cacheHitRate > 0.3 ? 'green' : 'yellow');
    log(`  Estimated Savings: $${cacheSavings.toFixed(6)}`, 'green');
    console.log('');

    // Calculate optimization effectiveness
    const effectivenessPct = cacheHitRate > 0 ?
      ((cacheSavings / (totalCost + cacheSavings)) * 100).toFixed(1) : 0;

    log(`  Optimization Effectiveness: ${effectivenessPct}%`,
        effectivenessPct > 50 ? 'green' : effectivenessPct > 30 ? 'yellow' : 'red');

    console.log('');
    log('Recommendations:', 'bright');
    console.log('');

    if (cacheHitRate < 0.3 && totalRequests > 10) {
      log('  • Consider increasing API_CACHE_TTL for higher cache hit rate', 'yellow');
    }

    if (cacheStats.cache_enabled === false) {
      log('  • Enable caching: ENABLE_API_RESPONSE_CACHE=true', 'red');
    }

    if (totalRequests > 0) {
      log('  • Monitor costs daily using /api/cost-dashboard', 'cyan');
      log('  • Review optimization recommendations regularly', 'cyan');
    }

    console.log('');
    log('Next Steps:', 'bright');
    console.log('');
    log('  1. Monitor cache hit rate over 24 hours (target: >30%)', 'reset');
    log('  2. Deploy optimized routes to production', 'reset');
    log('  3. Set up daily cost monitoring alerts', 'reset');
    log('  4. Review and adjust cache TTL based on usage patterns', 'reset');
  }

  console.log('');
  console.log('='.repeat(80));
}

async function runAllTests() {
  log('Starting API Cost Optimization Tests...', 'bright');
  log(`Target API: ${BASE_URL}`, 'cyan');
  console.log('');

  try {
    await testDynamicTokenAllocation();
    await testResponseCaching();
    await testCostMonitoring();
    await generateReport();

    console.log('');
    log('All tests completed successfully!', 'green');
    console.log('');
    log('View detailed cost report:', 'yellow');
    log(`  curl ${BASE_URL}/api/cost-dashboard?action=report`, 'cyan');
    console.log('');
  } catch (error) {
    log(`Test suite failed: ${error.message}`, 'red');
    console.error(error);
    process.exit(1);
  }
}

// Run tests
runAllTests();
