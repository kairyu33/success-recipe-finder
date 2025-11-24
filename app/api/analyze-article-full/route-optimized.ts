/**
 * OPTIMIZED API Route with Cost Control Features
 *
 * This is an enhanced version of route.ts with integrated cost optimizations:
 * - Rate limiting
 * - Request deduplication
 * - Caching
 * - Usage analytics
 * - Cost estimation
 *
 * To use this version:
 * 1. Backup your current route.ts
 * 2. Replace route.ts with this file's contents
 * 3. Configure environment variables in .env.local
 */

import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, checkDuplicateRequest, cacheRequestResult } from "@/app/utils/rate-limiter";
import { getCachedResponse, cacheResponse } from "@/app/utils/cache";
import { logUsage } from "@/app/utils/usage-analytics";
import { estimateAnalysisCost } from "@/app/utils/cost-estimator";

/**
 * Full article analysis response interface
 */
export interface AnalysisResponse {
  suggestedTitles: string[];
  insights: {
    whatYouLearn: string[];
    benefits: string[];
    recommendedFor: string[];
    oneLiner: string;
  };
  eyeCatchImage: {
    mainPrompt: string;
    compositionIdeas: string[];
    colorPalette: string[];
    mood: string;
    style: string;
    summary: string;
  };
  hashtags: string[];
  error?: string;
  _metadata?: {
    cached?: boolean;
    estimatedCost?: number;
    actualCost?: number;
    tokensUsed?: number;
  };
}

/**
 * Get client identifier from request
 */
function getClientIdentifier(request: NextRequest): string {
  // Use IP address or a session ID
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0] : "unknown";
  return ip;
}

/**
 * API route for comprehensive article analysis using Claude AI
 * Enhanced with cost optimization features
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();
  const clientId = getClientIdentifier(request);

  try {
    // Parse request body early for validation
    const { articleText } = await request.json();

    if (!articleText || typeof articleText !== "string") {
      return NextResponse.json(
        { error: "Article text is required and must be a string" },
        { status: 400 }
      );
    }

    // Validate article length (with environment variable support)
    const maxLength = parseInt(process.env.MAX_ARTICLE_LENGTH || "10000", 10);
    if (articleText.length > maxLength) {
      return NextResponse.json(
        { error: `Article text is too long. Maximum ${maxLength} characters allowed.` },
        { status: 400 }
      );
    }

    // === RATE LIMITING ===
    const rateLimit = checkRateLimit(clientId);
    if (rateLimit.isRateLimited) {
      const retryAfter = Math.ceil((rateLimit.resetAt - Date.now()) / 1000);
      return NextResponse.json(
        {
          error: "Too many requests. Please wait before trying again.",
          retryAfter: retryAfter,
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Remaining": rateLimit.remaining.toString(),
            "X-RateLimit-Reset": new Date(rateLimit.resetAt).toISOString(),
            "Retry-After": retryAfter.toString(),
          }
        }
      );
    }

    // === REQUEST DEDUPLICATION ===
    const duplicate = checkDuplicateRequest(clientId, { articleText });
    if (duplicate.isDuplicate && duplicate.cachedResult) {
      console.log("[Deduplication] Returning cached result for duplicate request");

      // Add metadata to indicate this was from deduplication
      const result = {
        ...duplicate.cachedResult,
        _metadata: {
          ...(duplicate.cachedResult._metadata || {}),
          cached: true,
          deduplication: true,
        }
      };

      return NextResponse.json(result);
    }

    // === CACHING CHECK ===
    const cached = getCachedResponse<AnalysisResponse>("/api/analyze-article-full", { articleText });
    if (cached) {
      console.log("[Cache] Returning cached response");

      // Add metadata to indicate this was cached
      const result = {
        ...cached,
        _metadata: {
          ...(cached._metadata || {}),
          cached: true,
        }
      };

      return NextResponse.json(result);
    }

    // === COST ESTIMATION ===
    const costEstimate = estimateAnalysisCost(articleText);
    console.log("[Cost Estimate]", {
      inputTokens: costEstimate.inputTokens,
      outputTokens: costEstimate.outputTokens,
      estimatedCost: `$${costEstimate.total.toFixed(4)}`,
    });

    // Validate API key
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "API key is not configured. Please set ANTHROPIC_API_KEY in .env.local" },
        { status: 500 }
      );
    }

    // Initialize Anthropic client
    const anthropic = new Anthropic({
      apiKey: apiKey,
    });

    // Get max tokens from environment or use default
    const maxTokens = parseInt(process.env.MAX_TOKENS_PER_REQUEST || "2000", 10);

    // === API CALL ===
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: maxTokens,
      temperature: 0.7,
      system: [
        {
          type: "text",
          text: `あなたはnote.com記事の総合分析エキスパートです。記事を分析し、以下のJSON形式で返してください。JSON以外の説明は一切含めないでください。

出力JSON構造：
{
  "suggestedTitles": ["タイトル案1〜5（キャッチーでSEO最適化）"],
  "insights": {
    "whatYouLearn": ["学習ポイント1〜5（具体的で実践的）"],
    "benefits": ["メリット1〜5（読者が得られる価値）"],
    "recommendedFor": ["おすすめ読者1〜5（具体的なペルソナ）"],
    "oneLiner": "記事の本質を1文で（30-50文字）"
  },
  "eyeCatchImage": {
    "mainPrompt": "詳細な英語画像生成プロンプト（DALL-E/Midjourney/Stable Diffusion用、構図・スタイル・色・雰囲気を具体的に記述）",
    "compositionIdeas": ["構図アイデア1〜3（日本語）"],
    "colorPalette": ["#HEX色1〜4"],
    "mood": "雰囲気を表す言葉",
    "style": "アートスタイル",
    "summary": "100文字以内の要約"
  },
  "hashtags": ["#タグ1〜20（日本語、note.comで検索されやすいタグ）"]
}

重要：
- 必ず有効なJSONフォーマットで出力
- マークダウンやコードブロックは使用しない
- 配列の要素数を厳守（タイトル5個、学習5個、メリット5個、読者5個、構図3個、色4個、ハッシュタグ20個）`,
          cache_control: { type: "ephemeral" }
        }
      ],
      messages: [
        {
          role: "user",
          content: `記事テキスト：\n${articleText}`,
        },
      ],
    });

    // === USAGE TRACKING ===
    const actualCost = (message.usage.input_tokens / 1_000_000) * 3.0 +
                       (message.usage.output_tokens / 1_000_000) * 15.0;

    console.log("[Token Usage]", {
      input: message.usage.input_tokens,
      output: message.usage.output_tokens,
      cacheCreation: message.usage.cache_creation_input_tokens || 0,
      cacheRead: message.usage.cache_read_input_tokens || 0,
      actualCost: `$${actualCost.toFixed(4)}`,
    });

    // Parse response
    const content = message.content[0];
    if (content.type !== "text") {
      throw new Error("Unexpected response type from Claude");
    }

    const responseText = content.text.trim();
    let analysisData: AnalysisResponse;

    try {
      const jsonText = responseText
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();

      analysisData = JSON.parse(jsonText);
    } catch (parseError) {
      console.error("Failed to parse Claude response:", responseText);
      throw new Error("Failed to parse analysis data from Claude response");
    }

    // Validate and sanitize response structure
    if (!analysisData.suggestedTitles || !Array.isArray(analysisData.suggestedTitles)) {
      analysisData.suggestedTitles = [];
    }

    if (!analysisData.insights) {
      analysisData.insights = {
        whatYouLearn: [],
        benefits: [],
        recommendedFor: [],
        oneLiner: "",
      };
    }

    if (!analysisData.eyeCatchImage) {
      analysisData.eyeCatchImage = {
        mainPrompt: "A modern, professional illustration representing the article's theme with clean composition and vibrant colors",
        compositionIdeas: ["シンプルな構図", "中央配置", "バランスの取れたレイアウト"],
        colorPalette: ["#4A90E2", "#50E3C2", "#F5A623", "#FFFFFF"],
        mood: "モダンでプロフェッショナル",
        style: "ミニマルモダン",
        summary: "記事の内容を視覚的に表現したイメージ",
      };
    }

    if (!analysisData.hashtags || !Array.isArray(analysisData.hashtags)) {
      analysisData.hashtags = [];
    }

    // Ensure hashtags have # prefix and limit to 20
    analysisData.hashtags = analysisData.hashtags
      .map((tag) => (tag.startsWith("#") ? tag : `#${tag}`))
      .slice(0, 20);

    // Limit arrays to reasonable sizes
    analysisData.suggestedTitles = analysisData.suggestedTitles.slice(0, 5);
    analysisData.insights.whatYouLearn = (analysisData.insights.whatYouLearn || []).slice(0, 5);
    analysisData.insights.benefits = (analysisData.insights.benefits || []).slice(0, 5);
    analysisData.insights.recommendedFor = (analysisData.insights.recommendedFor || []).slice(0, 5);

    if (analysisData.eyeCatchImage) {
      analysisData.eyeCatchImage.compositionIdeas = (analysisData.eyeCatchImage.compositionIdeas || []).slice(0, 3);
      analysisData.eyeCatchImage.colorPalette = (analysisData.eyeCatchImage.colorPalette || []).slice(0, 4);
      analysisData.eyeCatchImage.summary = (analysisData.eyeCatchImage.summary || "").substring(0, 100);
    }

    // Add metadata
    analysisData._metadata = {
      cached: false,
      estimatedCost: costEstimate.total,
      actualCost: actualCost,
      tokensUsed: message.usage.input_tokens + message.usage.output_tokens,
    };

    // === LOG USAGE ===
    if (process.env.ENABLE_USAGE_ANALYTICS !== "false") {
      logUsage({
        timestamp: Date.now(),
        endpoint: "/api/analyze-article-full",
        inputTokens: message.usage.input_tokens,
        outputTokens: message.usage.output_tokens,
        totalTokens: message.usage.input_tokens + message.usage.output_tokens,
        cost: actualCost,
        success: true,
      });
    }

    // === CACHE RESPONSE ===
    cacheResponse("/api/analyze-article-full", { articleText }, analysisData);

    // === CACHE FOR DEDUPLICATION ===
    cacheRequestResult(clientId, { articleText }, analysisData);

    // Log performance
    const duration = Date.now() - startTime;
    console.log(`[Performance] Request completed in ${duration}ms`);

    return NextResponse.json(analysisData, {
      headers: {
        "X-RateLimit-Remaining": rateLimit.remaining.toString(),
        "X-Response-Time": `${duration}ms`,
      }
    });

  } catch (error) {
    console.error("Error analyzing article:", error);

    // Log failed request
    if (process.env.ENABLE_USAGE_ANALYTICS !== "false") {
      logUsage({
        timestamp: Date.now(),
        endpoint: "/api/analyze-article-full",
        inputTokens: 0,
        outputTokens: 0,
        totalTokens: 0,
        cost: 0,
        success: false,
        errorMessage: error instanceof Error ? error.message : "Unknown error",
      });
    }

    // Handle specific error types
    if (error instanceof Anthropic.APIError) {
      return NextResponse.json(
        { error: `API Error: ${error.message}` },
        { status: error.status || 500 }
      );
    }

    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
