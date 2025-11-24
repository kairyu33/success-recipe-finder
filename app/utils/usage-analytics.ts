/**
 * Usage Analytics Utility
 *
 * @description Tracks API usage, token consumption, and costs for monitoring
 * and optimization purposes. Provides insights into API usage patterns.
 */

/**
 * Usage record for a single API call
 */
export interface UsageRecord {
  timestamp: number;
  endpoint: string;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  cost: number;
  requestId?: string;
  userId?: string;
  success: boolean;
  errorMessage?: string;
}

/**
 * Aggregated usage statistics
 */
export interface UsageStats {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  totalInputTokens: number;
  totalOutputTokens: number;
  totalTokens: number;
  totalCost: number;
  averageCostPerRequest: number;
  averageTokensPerRequest: number;
  periodStart: number;
  periodEnd: number;
  byEndpoint: {
    [endpoint: string]: {
      requests: number;
      tokens: number;
      cost: number;
    };
  };
}

/**
 * In-memory storage for usage records
 * In production, this should be replaced with a persistent database
 */
const usageRecords: UsageRecord[] = [];

/**
 * Maximum number of records to keep in memory
 */
const MAX_RECORDS = 10000;

/**
 * Log an API usage record
 *
 * @param record - Usage record to log
 *
 * @example
 * ```typescript
 * logUsage({
 *   timestamp: Date.now(),
 *   endpoint: "/api/generate-hashtags",
 *   inputTokens: 1500,
 *   outputTokens: 200,
 *   totalTokens: 1700,
 *   cost: 0.0075,
 *   success: true,
 * });
 * ```
 */
export function logUsage(record: UsageRecord): void {
  usageRecords.push(record);

  // Keep only the most recent records to prevent memory issues
  if (usageRecords.length > MAX_RECORDS) {
    usageRecords.shift();
  }

  // Log to console in development
  if (process.env.NODE_ENV === "development") {
    console.log("[Usage Analytics]", {
      endpoint: record.endpoint,
      tokens: record.totalTokens,
      cost: `$${record.cost.toFixed(4)}`,
      success: record.success,
    });
  }
}

/**
 * Get usage statistics for a time period
 *
 * @param startTime - Start of period (timestamp in ms)
 * @param endTime - End of period (timestamp in ms, defaults to now)
 * @returns Aggregated usage statistics
 *
 * @example
 * ```typescript
 * // Get last 24 hours of usage
 * const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
 * const stats = getUsageStats(oneDayAgo);
 * console.log(`Total cost: $${stats.totalCost.toFixed(2)}`);
 * ```
 */
export function getUsageStats(
  startTime: number,
  endTime: number = Date.now()
): UsageStats {
  const filteredRecords = usageRecords.filter(
    (r) => r.timestamp >= startTime && r.timestamp <= endTime
  );

  const byEndpoint: { [endpoint: string]: { requests: number; tokens: number; cost: number } } = {};

  let totalInputTokens = 0;
  let totalOutputTokens = 0;
  let totalCost = 0;
  let successfulRequests = 0;
  let failedRequests = 0;

  for (const record of filteredRecords) {
    totalInputTokens += record.inputTokens;
    totalOutputTokens += record.outputTokens;
    totalCost += record.cost;

    if (record.success) {
      successfulRequests++;
    } else {
      failedRequests++;
    }

    // Aggregate by endpoint
    if (!byEndpoint[record.endpoint]) {
      byEndpoint[record.endpoint] = { requests: 0, tokens: 0, cost: 0 };
    }
    byEndpoint[record.endpoint].requests++;
    byEndpoint[record.endpoint].tokens += record.totalTokens;
    byEndpoint[record.endpoint].cost += record.cost;
  }

  const totalRequests = filteredRecords.length;
  const totalTokens = totalInputTokens + totalOutputTokens;

  return {
    totalRequests,
    successfulRequests,
    failedRequests,
    totalInputTokens,
    totalOutputTokens,
    totalTokens,
    totalCost,
    averageCostPerRequest: totalRequests > 0 ? totalCost / totalRequests : 0,
    averageTokensPerRequest: totalRequests > 0 ? totalTokens / totalRequests : 0,
    periodStart: startTime,
    periodEnd: endTime,
    byEndpoint,
  };
}

/**
 * Get recent usage records
 *
 * @param limit - Maximum number of records to return
 * @returns Array of recent usage records
 *
 * @example
 * ```typescript
 * const recent = getRecentUsage(10);
 * recent.forEach(record => {
 *   console.log(`${record.endpoint}: ${record.cost}`);
 * });
 * ```
 */
export function getRecentUsage(limit: number = 100): UsageRecord[] {
  return usageRecords.slice(-limit);
}

/**
 * Get usage summary for display
 *
 * @returns Formatted usage summary
 *
 * @example
 * ```typescript
 * const summary = getUsageSummary();
 * console.log(summary.today);
 * console.log(summary.thisWeek);
 * ```
 */
export function getUsageSummary(): {
  today: UsageStats;
  thisWeek: UsageStats;
  thisMonth: UsageStats;
  allTime: UsageStats;
} {
  const now = Date.now();
  const oneDayAgo = now - 24 * 60 * 60 * 1000;
  const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000;
  const oneMonthAgo = now - 30 * 24 * 60 * 60 * 1000;
  const allTimeStart = usageRecords.length > 0 ? usageRecords[0].timestamp : now;

  return {
    today: getUsageStats(oneDayAgo),
    thisWeek: getUsageStats(oneWeekAgo),
    thisMonth: getUsageStats(oneMonthAgo),
    allTime: getUsageStats(allTimeStart),
  };
}

/**
 * Generate a usage report in markdown format
 *
 * @param stats - Usage statistics to format
 * @returns Markdown formatted report
 *
 * @example
 * ```typescript
 * const stats = getUsageStats(Date.now() - 24*60*60*1000);
 * const report = generateUsageReport(stats);
 * console.log(report);
 * ```
 */
export function generateUsageReport(stats: UsageStats): string {
  const period = new Date(stats.periodStart).toLocaleString() + " - " + new Date(stats.periodEnd).toLocaleString();

  let report = `# API Usage Report\n\n`;
  report += `**Period:** ${period}\n\n`;
  report += `## Summary\n\n`;
  report += `- Total Requests: ${stats.totalRequests}\n`;
  report += `- Successful: ${stats.successfulRequests} (${((stats.successfulRequests / stats.totalRequests) * 100).toFixed(1)}%)\n`;
  report += `- Failed: ${stats.failedRequests} (${((stats.failedRequests / stats.totalRequests) * 100).toFixed(1)}%)\n`;
  report += `- Total Tokens: ${stats.totalTokens.toLocaleString()}\n`;
  report += `  - Input: ${stats.totalInputTokens.toLocaleString()}\n`;
  report += `  - Output: ${stats.totalOutputTokens.toLocaleString()}\n`;
  report += `- Total Cost: $${stats.totalCost.toFixed(4)}\n`;
  report += `- Average Cost/Request: $${stats.averageCostPerRequest.toFixed(4)}\n`;
  report += `- Average Tokens/Request: ${Math.round(stats.averageTokensPerRequest)}\n\n`;

  report += `## By Endpoint\n\n`;
  report += `| Endpoint | Requests | Tokens | Cost |\n`;
  report += `|----------|----------|--------|------|\n`;

  for (const [endpoint, data] of Object.entries(stats.byEndpoint)) {
    report += `| ${endpoint} | ${data.requests} | ${data.tokens.toLocaleString()} | $${data.cost.toFixed(4)} |\n`;
  }

  return report;
}

/**
 * Export usage data as JSON
 *
 * @param startTime - Start of period (optional)
 * @param endTime - End of period (optional)
 * @returns JSON string of usage records
 *
 * @example
 * ```typescript
 * const json = exportUsageData();
 * fs.writeFileSync("usage-export.json", json);
 * ```
 */
export function exportUsageData(
  startTime?: number,
  endTime: number = Date.now()
): string {
  let records = usageRecords;

  if (startTime !== undefined) {
    records = usageRecords.filter(
      (r) => r.timestamp >= startTime && r.timestamp <= endTime
    );
  }

  return JSON.stringify(records, null, 2);
}

/**
 * Clear all usage records
 *
 * @description Use with caution - this will delete all usage history
 */
export function clearUsageHistory(): void {
  usageRecords.length = 0;
}

/**
 * Get peak usage times
 *
 * @param stats - Usage statistics
 * @returns Array of peak hours with request counts
 */
export function analyzePeakUsage(stats: UsageStats): {
  hour: number;
  requests: number;
}[] {
  const hourlyRequests: { [hour: number]: number } = {};

  // This is a simplified version - would need actual records to get hourly data
  // For now, return empty array as placeholder
  return [];
}
