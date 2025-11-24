import { NextRequest, NextResponse } from "next/server";
import {
  getDailySummary,
  getDateRangeSummary,
  generateCostReport,
  getAllLogs,
  checkBudgetAlert,
  exportLogsToJSON,
} from "@/app/utils/costMonitor";
import { getResponseCacheStats } from "@/app/lib/responseCache";
import { getAuthSession } from "@/lib/simpleAuth";

/**
 * Cost Dashboard API
 *
 * @description Provides comprehensive cost monitoring and analytics data
 * for the API optimization dashboard.
 *
 * Endpoints:
 * - GET /api/cost-dashboard?action=summary - Daily summary
 * - GET /api/cost-dashboard?action=report - Full cost report
 * - GET /api/cost-dashboard?action=range&start=YYYY-MM-DD&end=YYYY-MM-DD - Date range
 * - GET /api/cost-dashboard?action=logs&limit=100 - Recent logs
 * - GET /api/cost-dashboard?action=cache-stats - Cache statistics
 * - GET /api/cost-dashboard?action=export - Export logs as JSON
 *
 * @example
 * ```typescript
 * // Get today's summary
 * const response = await fetch('/api/cost-dashboard?action=summary');
 * const data = await response.json();
 * console.log(`Total cost: $${data.totalCost.toFixed(4)}`);
 * ```
 */
export async function GET(request: NextRequest) {
  try {
    // SECURITY: Check authentication
    const session = await getAuthSession();
    if (!session || !session.authenticated) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'summary';

    switch (action) {
      case 'summary': {
        // Get daily summary for today
        const date = searchParams.get('date') || undefined;
        const summary = getDailySummary(date);

        // Check budget alerts
        const dailyBudget = parseFloat(process.env.DAILY_BUDGET || '10.0');
        const budgetExceeded = checkBudgetAlert(dailyBudget);

        return NextResponse.json({
          summary,
          budgetAlert: budgetExceeded
            ? {
                exceeded: true,
                limit: dailyBudget,
                current: summary.totalCost,
                message: `Daily budget of $${dailyBudget} exceeded!`,
              }
            : {
                exceeded: false,
                limit: dailyBudget,
                current: summary.totalCost,
                remaining: dailyBudget - summary.totalCost,
              },
        });
      }

      case 'report': {
        // Generate full cost report
        const report = generateCostReport();
        return NextResponse.json({
          report,
          generated_at: new Date().toISOString(),
        });
      }

      case 'range': {
        // Get date range summary
        const startDate = searchParams.get('start');
        const endDate = searchParams.get('end');

        if (!startDate || !endDate) {
          return NextResponse.json(
            { error: 'Both start and end dates are required (YYYY-MM-DD format)' },
            { status: 400 }
          );
        }

        const summaries = getDateRangeSummary(startDate, endDate);

        // Calculate aggregates
        const totalCost = summaries.reduce((sum, day) => sum + day.totalCost, 0);
        const totalRequests = summaries.reduce((sum, day) => sum + day.totalRequests, 0);
        const totalCacheHits = summaries.reduce((sum, day) => sum + day.cacheHits, 0);
        const averageCacheHitRate =
          totalRequests > 0 ? totalCacheHits / totalRequests : 0;

        return NextResponse.json({
          range: { start: startDate, end: endDate },
          daily_summaries: summaries,
          aggregates: {
            total_cost: totalCost,
            total_requests: totalRequests,
            total_cache_hits: totalCacheHits,
            average_cache_hit_rate: averageCacheHitRate,
            average_cost_per_request:
              totalRequests > 0 ? totalCost / totalRequests : 0,
          },
        });
      }

      case 'logs': {
        // Get recent logs
        const limit = parseInt(searchParams.get('limit') || '100', 10);
        const logs = getAllLogs(limit);

        return NextResponse.json({
          logs,
          count: logs.length,
          limit,
        });
      }

      case 'cache-stats': {
        // Get cache statistics
        const cacheStats = await getResponseCacheStats();

        return NextResponse.json({
          cache_stats: cacheStats,
          cache_enabled: process.env.ENABLE_API_RESPONSE_CACHE !== 'false',
        });
      }

      case 'export': {
        // Export all logs as JSON
        const jsonData = exportLogsToJSON();

        return new NextResponse(jsonData, {
          headers: {
            'Content-Type': 'application/json',
            'Content-Disposition': `attachment; filename="api-cost-logs-${new Date().toISOString().split('T')[0]}.json"`,
          },
        });
      }

      case 'optimize-recommendations': {
        // Provide optimization recommendations based on usage patterns
        const summary = getDailySummary();
        const cacheStats = await getResponseCacheStats();

        const recommendations: Array<{
          priority: 'high' | 'medium' | 'low';
          title: string;
          description: string;
          potentialSavings: string;
        }> = [];

        // Check cache hit rate
        if (cacheStats.hitRate < 0.3 && summary.totalRequests > 10) {
          recommendations.push({
            priority: 'high',
            title: 'Low Cache Hit Rate',
            description: `Cache hit rate is ${(cacheStats.hitRate * 100).toFixed(1)}%. Consider increasing cache TTL or analyzing content patterns.`,
            potentialSavings: `Up to $${(summary.totalCost * 0.5).toFixed(2)}/day`,
          });
        }

        // Check if caching is disabled
        if (process.env.ENABLE_API_RESPONSE_CACHE === 'false') {
          recommendations.push({
            priority: 'high',
            title: 'Response Caching Disabled',
            description: 'Enable ENABLE_API_RESPONSE_CACHE=true to save 80-95% on repeat requests.',
            potentialSavings: `Up to $${(summary.totalCost * 0.8).toFixed(2)}/day`,
          });
        }

        // Check endpoint usage patterns
        const endpointCosts = Object.entries(summary.endpoints)
          .sort(([, a], [, b]) => b.cost - a.cost);

        if (endpointCosts.length > 0) {
          const [topEndpoint, topData] = endpointCosts[0];
          if (topData.cost > summary.totalCost * 0.7) {
            recommendations.push({
              priority: 'medium',
              title: 'Endpoint Cost Concentration',
              description: `${topEndpoint} accounts for ${((topData.cost / summary.totalCost) * 100).toFixed(1)}% of costs. Consider optimizing this endpoint specifically.`,
              potentialSavings: `Up to $${(topData.cost * 0.3).toFixed(2)}/day`,
            });
          }
        }

        // Check average response time
        const avgResponseTime = Object.values(summary.endpoints)
          .reduce((sum, data) => sum + data.avgResponseTime, 0) / Object.keys(summary.endpoints).length;

        if (avgResponseTime > 5000) {
          recommendations.push({
            priority: 'low',
            title: 'High Response Times',
            description: `Average response time is ${Math.round(avgResponseTime)}ms. Consider implementing request batching or reducing token counts.`,
            potentialSavings: 'Improved user experience',
          });
        }

        return NextResponse.json({
          summary: {
            total_cost: summary.totalCost,
            total_requests: summary.totalRequests,
            cache_hit_rate: summary.cacheHitRate,
          },
          recommendations,
          generated_at: new Date().toISOString(),
        });
      }

      default: {
        return NextResponse.json(
          {
            error: 'Invalid action',
            valid_actions: [
              'summary',
              'report',
              'range',
              'logs',
              'cache-stats',
              'export',
              'optimize-recommendations',
            ],
          },
          { status: 400 }
        );
      }
    }
  } catch (error) {
    console.error('Cost dashboard error:', error);
    return NextResponse.json(
      {
        error: 'Failed to retrieve cost data',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
