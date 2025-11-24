/**
 * API Route for Usage Statistics
 *
 * @description Provides usage analytics and cost tracking information
 * Supports different time periods: today, week, month, all-time
 */

import { NextRequest, NextResponse } from "next/server";
import { getUsageStats, getUsageSummary, generateUsageReport } from "@/app/utils/usage-analytics";
import { getCacheStats } from "@/app/utils/cache";

/**
 * GET /api/usage-stats
 *
 * Query parameters:
 * - period: "today" | "week" | "month" | "all" (default: "today")
 * - format: "json" | "markdown" (default: "json")
 *
 * @example
 * ```
 * GET /api/usage-stats?period=week&format=json
 * GET /api/usage-stats?period=today&format=markdown
 * ```
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const period = searchParams.get("period") || "today";
    const format = searchParams.get("format") || "json";

    // Calculate time window
    const now = Date.now();
    let startTime: number;

    switch (period) {
      case "today":
        startTime = now - 24 * 60 * 60 * 1000;
        break;
      case "week":
        startTime = now - 7 * 24 * 60 * 60 * 1000;
        break;
      case "month":
        startTime = now - 30 * 24 * 60 * 60 * 1000;
        break;
      case "all":
        startTime = 0;
        break;
      default:
        return NextResponse.json(
          { error: "Invalid period. Use: today, week, month, or all" },
          { status: 400 }
        );
    }

    const stats = getUsageStats(startTime, now);
    const cacheStats = getCacheStats();

    // Add cache stats to response
    const enrichedStats = {
      ...stats,
      cache: {
        hits: cacheStats.hits,
        misses: cacheStats.misses,
        hitRate: (cacheStats.hitRate * 100).toFixed(1) + "%",
        size: cacheStats.size,
      },
    };

    // Return markdown report if requested
    if (format === "markdown") {
      const report = generateUsageReport(stats);
      return new NextResponse(report, {
        headers: {
          "Content-Type": "text/markdown; charset=utf-8",
          "Content-Disposition": `attachment; filename="usage-report-${period}.md"`,
        },
      });
    }

    // Return JSON by default
    return NextResponse.json(enrichedStats);

  } catch (error) {
    console.error("Error fetching usage stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch usage statistics" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/usage-stats/summary
 *
 * Get summary for all time periods
 */
export async function POST(request: NextRequest) {
  try {
    const summary = getUsageSummary();
    const cacheStats = getCacheStats();

    return NextResponse.json({
      ...summary,
      cache: {
        hits: cacheStats.hits,
        misses: cacheStats.misses,
        hitRate: (cacheStats.hitRate * 100).toFixed(1) + "%",
        size: cacheStats.size,
      },
    });

  } catch (error) {
    console.error("Error fetching usage summary:", error);
    return NextResponse.json(
      { error: "Failed to fetch usage summary" },
      { status: 500 }
    );
  }
}
