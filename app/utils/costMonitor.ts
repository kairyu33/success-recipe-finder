/**
 * Cost Monitoring and Analytics Utility
 *
 * @description Tracks all API requests, token usage, and costs for monitoring and optimization.
 * Provides daily summaries and insights into API spending patterns.
 *
 * Features:
 * - Real-time cost tracking per API call
 * - Daily/weekly/monthly aggregation
 * - Cache hit rate monitoring
 * - Cost trend analysis
 * - Budget alerts
 *
 * @example
 * ```typescript
 * logAPIRequest({
 *   endpoint: '/api/analyze-article',
 *   inputTokens: 2000,
 *   outputTokens: 1000,
 *   cacheHit: false,
 *   articleLength: 3000
 * });
 * ```
 */

/**
 * API request cost data
 */
export interface APIRequestLog {
  /** Timestamp of the request */
  timestamp: string;
  /** API endpoint called */
  endpoint: string;
  /** Input tokens used */
  inputTokens: number;
  /** Output tokens generated */
  outputTokens: number;
  /** Cache creation tokens (for prompt caching) */
  cacheCreationTokens?: number;
  /** Cache read tokens (cached prompt) */
  cacheReadTokens?: number;
  /** Total cost in USD */
  totalCost: number;
  /** Whether this was a cache hit */
  cacheHit?: boolean;
  /** Article length in characters */
  articleLength?: number;
  /** Response time in milliseconds */
  responseTime?: number;
  /** Error occurred */
  error?: boolean;
}

/**
 * Daily cost summary
 */
export interface DailyCostSummary {
  date: string;
  totalRequests: number;
  totalCost: number;
  totalInputTokens: number;
  totalOutputTokens: number;
  cacheHits: number;
  cacheMisses: number;
  cacheHitRate: number;
  averageCostPerRequest: number;
  costSavingsFromCache: number;
  endpoints: Record<string, {
    requests: number;
    cost: number;
    avgResponseTime: number;
  }>;
}

/**
 * In-memory request log storage
 * In production, persist to database (Prisma, MongoDB, etc.)
 */
const requestLogs: APIRequestLog[] = [];

/**
 * Anthropic Claude Sonnet 4.5 pricing (as of 2025)
 */
const PRICING = {
  INPUT_PER_MILLION: 3.0,
  OUTPUT_PER_MILLION: 15.0,
  CACHE_CREATION_PER_MILLION: 3.75,
  CACHE_READ_PER_MILLION: 0.3,
} as const;

/**
 * Calculate cost from token usage
 *
 * @param usage - Token usage breakdown
 * @returns Total cost in USD
 *
 * @example
 * ```typescript
 * const cost = calculateCost({
 *   inputTokens: 2000,
 *   outputTokens: 1000,
 *   cacheReadTokens: 500
 * });
 * // Returns: 0.0216
 * ```
 */
export function calculateCost(usage: {
  inputTokens: number;
  outputTokens: number;
  cacheCreationTokens?: number;
  cacheReadTokens?: number;
}): number {
  const inputCost = (usage.inputTokens / 1_000_000) * PRICING.INPUT_PER_MILLION;
  const outputCost = (usage.outputTokens / 1_000_000) * PRICING.OUTPUT_PER_MILLION;

  let cacheCreationCost = 0;
  if (usage.cacheCreationTokens) {
    cacheCreationCost =
      (usage.cacheCreationTokens / 1_000_000) * PRICING.CACHE_CREATION_PER_MILLION;
  }

  let cacheReadCost = 0;
  if (usage.cacheReadTokens) {
    cacheReadCost =
      (usage.cacheReadTokens / 1_000_000) * PRICING.CACHE_READ_PER_MILLION;
  }

  return inputCost + outputCost + cacheCreationCost + cacheReadCost;
}

/**
 * Log an API request
 *
 * @param data - Request data to log
 *
 * @example
 * ```typescript
 * logAPIRequest({
 *   endpoint: '/api/analyze-article-full',
 *   inputTokens: 2000,
 *   outputTokens: 3500,
 *   cacheReadTokens: 1800,
 *   cacheHit: false,
 *   articleLength: 2500,
 *   responseTime: 3500
 * });
 * ```
 */
export function logAPIRequest(
  data: Omit<APIRequestLog, 'timestamp' | 'totalCost'>
): void {
  const totalCost = calculateCost({
    inputTokens: data.inputTokens,
    outputTokens: data.outputTokens,
    cacheCreationTokens: data.cacheCreationTokens,
    cacheReadTokens: data.cacheReadTokens,
  });

  const log: APIRequestLog = {
    timestamp: new Date().toISOString(),
    totalCost,
    ...data,
  };

  requestLogs.push(log);

  // Log to console for monitoring
  console.log('[CostMonitor] API Request:', {
    endpoint: log.endpoint,
    cost: `$${log.totalCost.toFixed(6)}`,
    tokens: {
      input: log.inputTokens,
      output: log.outputTokens,
      cache_read: log.cacheReadTokens || 0,
    },
    cache_hit: log.cacheHit || false,
    response_time: log.responseTime ? `${log.responseTime}ms` : 'N/A',
  });

  // Trim old logs (keep last 10000 to prevent memory issues)
  if (requestLogs.length > 10000) {
    requestLogs.splice(0, requestLogs.length - 10000);
  }
}

/**
 * Get daily cost summary
 *
 * @param date - Date to summarize (ISO string, defaults to today)
 * @returns Daily cost summary
 *
 * @example
 * ```typescript
 * const summary = getDailySummary('2025-01-15');
 * console.log(`Total cost: $${summary.totalCost.toFixed(2)}`);
 * console.log(`Cache hit rate: ${(summary.cacheHitRate * 100).toFixed(1)}%`);
 * ```
 */
export function getDailySummary(date?: string): DailyCostSummary {
  const targetDate = date || new Date().toISOString().split('T')[0];

  // Filter logs for the target date
  const dailyLogs = requestLogs.filter((log) =>
    log.timestamp.startsWith(targetDate)
  );

  if (dailyLogs.length === 0) {
    return {
      date: targetDate,
      totalRequests: 0,
      totalCost: 0,
      totalInputTokens: 0,
      totalOutputTokens: 0,
      cacheHits: 0,
      cacheMisses: 0,
      cacheHitRate: 0,
      averageCostPerRequest: 0,
      costSavingsFromCache: 0,
      endpoints: {},
    };
  }

  // Calculate aggregates
  const totalRequests = dailyLogs.length;
  const totalCost = dailyLogs.reduce((sum, log) => sum + log.totalCost, 0);
  const totalInputTokens = dailyLogs.reduce((sum, log) => sum + log.inputTokens, 0);
  const totalOutputTokens = dailyLogs.reduce((sum, log) => sum + log.outputTokens, 0);

  const cacheHits = dailyLogs.filter((log) => log.cacheHit).length;
  const cacheMisses = totalRequests - cacheHits;
  const cacheHitRate = totalRequests > 0 ? cacheHits / totalRequests : 0;

  // Estimate savings from cache hits (assuming ~$0.02 saved per hit)
  const costSavingsFromCache = cacheHits * 0.02;

  // Aggregate by endpoint
  const endpoints: Record<string, { requests: number; cost: number; avgResponseTime: number }> = {};

  dailyLogs.forEach((log) => {
    if (!endpoints[log.endpoint]) {
      endpoints[log.endpoint] = {
        requests: 0,
        cost: 0,
        avgResponseTime: 0,
      };
    }

    endpoints[log.endpoint].requests++;
    endpoints[log.endpoint].cost += log.totalCost;

    if (log.responseTime) {
      endpoints[log.endpoint].avgResponseTime += log.responseTime;
    }
  });

  // Calculate average response times
  Object.keys(endpoints).forEach((endpoint) => {
    const endpointData = endpoints[endpoint];
    if (endpointData.avgResponseTime > 0) {
      endpointData.avgResponseTime =
        endpointData.avgResponseTime / endpointData.requests;
    }
  });

  return {
    date: targetDate,
    totalRequests,
    totalCost,
    totalInputTokens,
    totalOutputTokens,
    cacheHits,
    cacheMisses,
    cacheHitRate,
    averageCostPerRequest: totalCost / totalRequests,
    costSavingsFromCache,
    endpoints,
  };
}

/**
 * Get cost summary for a date range
 *
 * @param startDate - Start date (ISO string)
 * @param endDate - End date (ISO string)
 * @returns Array of daily summaries
 *
 * @example
 * ```typescript
 * const weekSummary = getDateRangeSummary('2025-01-08', '2025-01-15');
 * const totalWeeklyCost = weekSummary.reduce((sum, day) => sum + day.totalCost, 0);
 * ```
 */
export function getDateRangeSummary(
  startDate: string,
  endDate: string
): DailyCostSummary[] {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const summaries: DailyCostSummary[] = [];

  const current = new Date(start);
  while (current <= end) {
    const dateStr = current.toISOString().split('T')[0];
    summaries.push(getDailySummary(dateStr));
    current.setDate(current.getDate() + 1);
  }

  return summaries;
}

/**
 * Get all request logs
 *
 * @param limit - Maximum number of logs to return (default: 1000)
 * @returns Array of request logs (most recent first)
 *
 * @example
 * ```typescript
 * const recentLogs = getAllLogs(100);
 * console.log(`Retrieved ${recentLogs.length} recent API calls`);
 * ```
 */
export function getAllLogs(limit: number = 1000): APIRequestLog[] {
  return requestLogs.slice(-limit).reverse();
}

/**
 * Generate cost report
 *
 * @returns Formatted cost report string
 *
 * @example
 * ```typescript
 * const report = generateCostReport();
 * console.log(report);
 * ```
 */
export function generateCostReport(): string {
  const today = getDailySummary();
  const yesterday = getDailySummary(
    new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );

  const last7Days = getDateRangeSummary(
    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    new Date().toISOString().split('T')[0]
  );

  const weekTotal = last7Days.reduce((sum, day) => sum + day.totalCost, 0);
  const weekRequests = last7Days.reduce((sum, day) => sum + day.totalRequests, 0);
  const weekCacheHits = last7Days.reduce((sum, day) => sum + day.cacheHits, 0);
  const weekCacheHitRate = weekRequests > 0 ? weekCacheHits / weekRequests : 0;

  return `
📊 API Cost Report
==================

📅 Today (${today.date}):
  • Total Requests: ${today.totalRequests}
  • Total Cost: $${today.totalCost.toFixed(4)}
  • Avg Cost/Request: $${today.averageCostPerRequest.toFixed(6)}
  • Cache Hit Rate: ${(today.cacheHitRate * 100).toFixed(1)}%
  • Estimated Savings: $${today.costSavingsFromCache.toFixed(4)}

📅 Yesterday (${yesterday.date}):
  • Total Cost: $${yesterday.totalCost.toFixed(4)}
  • Requests: ${yesterday.totalRequests}

📈 Last 7 Days:
  • Total Cost: $${weekTotal.toFixed(4)}
  • Total Requests: ${weekRequests}
  • Avg Cost/Request: $${(weekTotal / weekRequests).toFixed(6)}
  • Cache Hit Rate: ${(weekCacheHitRate * 100).toFixed(1)}%
  • Projected Monthly: $${((weekTotal / 7) * 30).toFixed(2)}

🎯 Top Endpoints (Today):
${Object.entries(today.endpoints)
  .sort(([, a], [, b]) => b.cost - a.cost)
  .map(
    ([endpoint, data]) =>
      `  • ${endpoint}: ${data.requests} requests, $${data.cost.toFixed(6)} (avg ${Math.round(data.avgResponseTime)}ms)`
  )
  .join('\n') || '  (No data)'}
`;
}

/**
 * Check if daily budget is exceeded
 *
 * @param dailyBudget - Daily budget limit in USD
 * @returns True if budget is exceeded
 *
 * @example
 * ```typescript
 * if (checkBudgetAlert(5.0)) {
 *   console.warn('Daily budget of $5 exceeded!');
 * }
 * ```
 */
export function checkBudgetAlert(dailyBudget: number): boolean {
  const today = getDailySummary();
  return today.totalCost > dailyBudget;
}

/**
 * Export logs to JSON
 *
 * @returns JSON string of all logs
 *
 * @example
 * ```typescript
 * const jsonData = exportLogsToJSON();
 * fs.writeFileSync('api-costs.json', jsonData);
 * ```
 */
export function exportLogsToJSON(): string {
  return JSON.stringify(requestLogs, null, 2);
}

/**
 * Clear all logs (use with caution)
 *
 * @example
 * ```typescript
 * clearLogs();
 * console.log('All cost monitoring logs cleared');
 * ```
 */
export function clearLogs(): void {
  requestLogs.length = 0;
  console.log('[CostMonitor] All logs cleared');
}
