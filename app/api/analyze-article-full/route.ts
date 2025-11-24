import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rateLimit";
import { validateArticleInput } from "@/lib/validation";
import { getAuthSession } from "@/lib/simpleAuth";

/**
 * Full article analysis response interface
 *
 * @description Contains all analysis results including titles, insights, hashtags, and image suggestions
 * Enhanced with viral prediction, reading time, rewrite suggestions, series ideas, monetization, and emotional analysis
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

  // 📚 Series Ideas
  seriesIdeas: Array<{
    title: string;
    description: string;
    targetAudience: string;
  }>;

  error?: string;
}

/**
 * API route for comprehensive article analysis using Claude AI
 *
 * @description This endpoint accepts article text and returns comprehensive analysis including:
 * - 5 compelling title suggestions
 * - Learning points, benefits, and target audience
 * - One-liner summary
 * - Eye-catch image generation suggestions with prompts
 * - 20 optimized hashtags for note.com
 *
 * Security features:
 * - Authentication: Only logged-in users can access
 * - Rate limiting: 5 requests per minute per IP (configurable via env)
 * - Input validation: Sanitizes HTML/script tags, checks length limits
 * - XSS prevention: Removes dangerous event handlers and data URIs
 * - Injection protection: Validates and cleans all user input
 *
 * Cost optimizations implemented:
 * - Upgraded to Claude Sonnet 4.5 for better performance
 * - Reduced max_tokens to 1500 (optimized based on actual usage patterns - typical responses are 800-1200 tokens)
 * - Expanded system prompt to 2000+ tokens to enable prompt caching (1024+ required)
 * - Implemented prompt caching for static instructions (90% cost reduction on repeat calls)
 * - Request JSON-only output (no markdown formatting)
 *
 * Expected cost savings with prompt caching:
 * - First request: ~2000 input tokens (creates cache) + ~1000 output tokens = ~$0.023
 * - Subsequent requests (within 5 min): ~200 input tokens (cache hit) + ~1000 output tokens = ~$0.016 (30% overall savings)
 *
 * @param request - Next.js request object containing article text
 * @returns JSON response with comprehensive article analysis
 * @throws {Error} When API key is missing, rate limit exceeded, or Claude API fails
 *
 * @example
 * ```typescript
 * const response = await fetch('/api/analyze-article-full', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({ articleText: '記事の内容...' })
 * });
 * if (response.status === 429) {
 *   console.error('Rate limit exceeded');
 *   return;
 * }
 * const data = await response.json();
 * console.log(data.suggestedTitles); // ['タイトル1', 'タイトル2', ...]
 * ```
 */
export async function POST(request: NextRequest) {
  try {
    // Validate API key
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "API key is not configured. Please set ANTHROPIC_API_KEY in .env.local" },
        { status: 500 }
      );
    }

    // Rate limiting: Extract client identifier (IP address)
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
               request.headers.get("x-real-ip") ||
               "anonymous";

    // SECURITY: Check authentication
    // Only authenticated users can use the API
    const session = await getAuthSession();
    if (!session || !session.authenticated) {
      console.warn(`[Auth Failed] Unauthorized API access attempt from IP: ${ip}`);
      return NextResponse.json(
        {
          error: "認証が必要です。ログインしてください。(Authentication required. Please log in.)",
          requiresAuth: true
        },
        { status: 401 }
      );
    }

    console.log(`[Auth Success] Authenticated user accessing API. Login date: ${session.loginDate}`);

    // Check rate limit: 10 requests per minute per IP
    const maxRequests = parseInt(process.env.API_RATE_LIMIT_MAX_REQUESTS || "5", 10); // Reduced from 10 to 5 for better security
    const windowMs = parseInt(process.env.API_RATE_LIMIT_WINDOW_MS || "60000", 10);
    const rateLimit = checkRateLimit(ip, maxRequests, windowMs);

    if (!rateLimit.allowed) {
      console.warn(`[Rate Limit] IP ${ip} exceeded limit: ${maxRequests} requests per ${windowMs}ms`);
      return NextResponse.json(
        {
          error: `リクエストが多すぎます。${rateLimit.resetIn}秒後に再試行してください。（Too many requests. Please try again in ${rateLimit.resetIn} seconds）`,
          retryAfter: rateLimit.resetIn
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimit.resetIn),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": String(rateLimit.resetIn)
          }
        }
      );
    }

    // Parse request body
    const { articleText } = await request.json();

    // Comprehensive input validation and sanitization
    const validation = validateArticleInput(articleText);

    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    // Use sanitized text for API call (prevents injection attacks)
    const cleanText = validation.sanitized!;

    console.log(`[Request] IP: ${ip}, Rate limit remaining: ${rateLimit.remaining}/${maxRequests}, Article length: ${cleanText.length} chars`);

    // Initialize Anthropic client
    const anthropic = new Anthropic({
      apiKey: apiKey,
    });

    // Call Claude API with optimized settings and prompt caching
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-5-20250929", // Upgraded to Claude Sonnet 4.5
      max_tokens: 2400, // Optimized: set to 2400 to ensure complete JSON output while reducing costs
      temperature: 0.7, // Balanced creativity and consistency
      system: [
        {
          type: "text",
          text: `あなたはnote.com記事の総合分析エキスパートです。記事を分析し、以下のJSON形式で返してください。

重要：
- 純粋なJSONのみを返してください
- マークダウンのコードブロック（\`\`\`json）は使用しないでください
- JSON以外の説明や前置きは一切含めないでください
- 最初の文字は必ず{で、最後の文字は必ず}にしてください

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
    "mainPrompt": "英語画像生成プロンプト（50単語以内、簡潔に）",
    "compositionIdeas": ["構図アイデア1〜3（各30文字以内）"],
    "colorPalette": ["#HEX色1〜4"],
    "mood": "雰囲気（10文字以内）",
    "style": "アートスタイル（10文字以内）",
    "summary": "50文字以内の要約"
  },
  "hashtags": ["#タグ1〜20（日本語、note.comで検索されやすいタグ）"],

  "seriesIdeas": [
    {
      "title": "【実践編】〇〇完全ガイド",
      "description": "今回の記事の内容を深掘りし、より実践的なノウハウを提供",
      "targetAudience": "すでに基礎を理解している中級者"
    },
    {
      "title": "〇〇ツール比較：最新おすすめTOP5",
      "description": "記事で紹介したツールの詳細比較レビュー",
      "targetAudience": "ツール選びで悩んでいる初心者〜中級者"
    },
    {
      "title": "失敗から学ぶ：〇〇で陥りやすい3つの罠",
      "description": "実際の失敗事例とその回避方法を解説",
      "targetAudience": "これから始める初心者"
    }
  ]
}

## 🚀 分析ガイドライン

### 1. シリーズ記事提案の戦略（seriesIdeas）

現在の記事を起点に、読者が次に読みたくなる関連記事を3つ提案：

#### 1.1 シリーズ展開の5パターン

**パターン1: 深掘り型（Vertical Expansion）**
元記事が概要 → 各要素を詳細解説
- 元：「副業の始め方」
- シリーズ：「副業1：ライティングで月5万円稼ぐ完全ガイド」
           「副業2：プログラミング案件の取り方【実例付き】」

**パターン2: 段階展開型（Progressive）**
初級 → 中級 → 上級と段階的に発展
- 元：「プログラミング入門」
- シリーズ：「【初級編】HTML/CSS完全マスター｜30日間ロードマップ」
           「【中級編】JavaScriptで作る実用Webアプリ5選」
           「【上級編】React + TypeScriptで構築するSPA開発」

**パターン3: 切り口変更型（Multi-Angle）**
同じテーマを異なる視点で解説
- 元：「時間管理術」
- シリーズ：「朝型人間の時間管理｜5時起きで人生が変わった話」
           「夜型人間のための時間管理｜深夜の生産性を最大化」
           「子育て中の時間管理｜スキマ時間活用術【実例12個】」

**パターン4: ケーススタディ型（Case Studies）**
理論記事 → 実践事例の紹介
- 元：「マーケティング戦略の基本」
- シリーズ：「【事例1】売上0→月商500万のSNS戦略｜全手法公開」
           「【事例2】Instagram運用で1年で1万フォロワー達成した方法」

**パターン5: Q&A・トラブルシューティング型**
基本記事 → よくある質問・トラブル解決
- 元：「ブログの始め方」
- シリーズ：「ブログ初心者が陥る10の失敗｜回避策と対処法」
           「アクセスが増えない時の診断チェックリスト50」

各提案には以下を含める：
- **title**: 30-50文字
- **description**: 50-80文字（簡潔に）
- **targetAudience**: 20-30文字

---

## 詳細分析ガイドライン

### タイトル生成の原則
1. **SEO最適化**: 検索されやすいキーワードを自然に含める
2. **感情フック**: 読者の興味を引く心理的トリガーを使用
3. **具体性**: 数字や具体的なメリットを明示
4. **適切な文字数**: 20-35文字が最も効果的
5. **ターゲット明確化**: 誰のための記事かを示す

効果的なパターン：
- 【完全ガイド】【実体験】【保存版】などの括弧
- 数字を使った具体性（3ステップ、5つの方法）
- 問題提起型（〇〇がうまくいかない人の共通点）

### ハッシュタグ選定
記事内容に合わせて以下から選択：
- 汎用タグ：#note #エッセイ #ブログ #日記 #暮らし
- ビジネス：#副業 #起業 #フリーランス #キャリア #働き方
- IT：#プログラミング #AI #Web制作 #エンジニア
- クリエイティブ：#ライティング #デザイン #イラスト #写真
- ライフスタイル：#料理 #旅行 #健康 #育児
- お金：#投資 #節約 #貯金 #副収入

### 画像生成プロンプトの作成原則
簡潔に50単語以内で記述：
- 主要な被写体とスタイル
- 色調と雰囲気
- 構図の特徴

色彩パレット：
- テクノロジー系: #0066FF, #6C63FF, #00D4FF, #FFFFFF
- ビジネス系: #2C3E50, #3498DB, #E74C3C, #ECF0F1
- 自然系: #27AE60, #8BC34A, #E8F5E9, #F39C12
- クリエイティブ系: #FF6B6B, #4ECDC4, #FFE66D, #A8E6CF

### 記事分析のコツ
- 学べること：具体的な数字・手法を明示
- メリット：定量的な効果を示す
- おすすめ読者：具体的なペルソナを描く
- 一文要約：30-50文字で核心的価値を伝える

重要事項：
- 有効なJSONのみ出力（マークダウン不可）
- 配列要素数厳守：タイトル5、学習5、メリット5、読者5、構図3、色4、ハッシュタグ20、シリーズ3
- ハッシュタグと色コードは必ず「#」を含める
- 日本語は自然で具体的に
- 簡潔さを重視（不要な装飾を避ける）`,
          cache_control: { type: "ephemeral" } // Cache this system prompt for 90% cost savings on subsequent requests
        }
      ],
      messages: [
        {
          role: "user",
          content: `記事テキスト：\n${cleanText}`,
        },
      ],
    });

    // Enhanced token usage logging with cost breakdown and cache efficiency
    const usage = message.usage;
    const cacheCreation = usage.cache_creation_input_tokens || 0;
    const cacheRead = usage.cache_read_input_tokens || 0;
    const regularInput = usage.input_tokens || 0;
    const output = usage.output_tokens || 0;

    // Anthropic pricing (as of 2025):
    // - Input: $3 per million tokens
    // - Cache write: $3.75 per million tokens (25% premium)
    // - Cache read: $0.30 per million tokens (90% discount)
    // - Output: $15 per million tokens
    const inputCost = (regularInput * 3) / 1_000_000;
    const cacheWriteCost = (cacheCreation * 3.75) / 1_000_000;
    const cacheReadCost = (cacheRead * 0.30) / 1_000_000;
    const outputCost = (output * 15) / 1_000_000;
    const totalCost = inputCost + cacheWriteCost + cacheReadCost + outputCost;

    // Calculate cache efficiency
    const cacheHitRate = cacheRead > 0 ? (cacheRead / (cacheRead + regularInput)) * 100 : 0;
    const cacheSavings = cacheRead > 0 ? ((cacheRead * 3) - (cacheRead * 0.30)) / 1_000_000 : 0;

    console.log("[Full Article Analysis] Token usage:", {
      input_tokens: regularInput,
      output_tokens: output,
      cache_creation_input_tokens: cacheCreation,
      cache_read_input_tokens: cacheRead,
      total_input_tokens: regularInput + cacheCreation + cacheRead,
    });

    console.log("[Full Article Analysis] Cost breakdown:", {
      regular_input_cost: `$${inputCost.toFixed(6)}`,
      cache_write_cost: `$${cacheWriteCost.toFixed(6)}`,
      cache_read_cost: `$${cacheReadCost.toFixed(6)}`,
      output_cost: `$${outputCost.toFixed(6)}`,
      total_cost: `$${totalCost.toFixed(6)}`,
      cache_hit_rate: `${cacheHitRate.toFixed(1)}%`,
      cache_savings: `$${cacheSavings.toFixed(6)}`,
      cache_status: cacheCreation > 0 ? "CACHE_CREATED" : cacheRead > 0 ? "CACHE_HIT" : "NO_CACHE",
    });

    // Extract and parse Claude's response
    const content = message.content[0];
    if (content.type !== "text") {
      throw new Error("Unexpected response type from Claude");
    }

    const responseText = content.text.trim();

    // Parse JSON response with improved error handling
    let analysisData: AnalysisResponse;
    try {
      // Extract JSON from markdown code blocks more robustly
      let jsonText = responseText.trim();

      // Remove markdown code blocks if present
      if (jsonText.includes("```")) {
        // Try to extract JSON from code blocks
        const codeBlockMatch = jsonText.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (codeBlockMatch && codeBlockMatch[1]) {
          jsonText = codeBlockMatch[1].trim();
        } else {
          // If closing ``` is missing, remove opening marker
          jsonText = jsonText.replace(/```(?:json)?\s*/g, "").trim();
        }
      }

      // Find the first { and last }
      const firstBrace = jsonText.indexOf("{");
      const lastBrace = jsonText.lastIndexOf("}");

      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        jsonText = jsonText.substring(firstBrace, lastBrace + 1);
      }

      // Try to parse the JSON
      analysisData = JSON.parse(jsonText);
    } catch (parseError) {
      console.error("JSON Parse Error Details:", {
        error: parseError instanceof Error ? parseError.message : String(parseError),
        responseLength: responseText.length,
        responseStart: responseText.substring(0, 300),
        responseMiddle: responseText.substring(Math.floor(responseText.length / 2) - 150, Math.floor(responseText.length / 2) + 150),
        responseEnd: responseText.substring(Math.max(0, responseText.length - 300)),
      });

      // Try to salvage partial data with a more lenient approach
      try {
        console.log("[Recovery Attempt] Trying to extract partial JSON data...");

        // Extract everything that looks like JSON
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const possibleJson = jsonMatch[0];

          // Try to fix common issues
          let fixedJson = possibleJson
            .replace(/,(\s*[}\]])/g, "$1") // Remove trailing commas
            .replace(/([{,]\s*)(\w+):/g, '$1"$2":') // Quote unquoted keys
            .trim();

          // Ensure JSON is properly closed
          const openBraces = (fixedJson.match(/\{/g) || []).length;
          const closeBraces = (fixedJson.match(/\}/g) || []).length;
          const openBrackets = (fixedJson.match(/\[/g) || []).length;
          const closeBrackets = (fixedJson.match(/\]/g) || []).length;

          // Add missing closing braces/brackets
          fixedJson += "]".repeat(Math.max(0, openBrackets - closeBrackets));
          fixedJson += "}".repeat(Math.max(0, openBraces - closeBraces));

          analysisData = JSON.parse(fixedJson);
          console.log("[Recovery Success] Partial data extracted successfully");
        } else {
          throw new Error("Could not extract any JSON structure from response");
        }
      } catch (recoveryError) {
        console.error("[Recovery Failed]", recoveryError);
        throw new Error("Failed to parse analysis data from Claude response");
      }
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
      analysisData.eyeCatchImage.summary = (analysisData.eyeCatchImage.summary || "").substring(0, 50);
    }

    // Log warnings if we didn't get enough data
    if (analysisData.hashtags.length < 20) {
      console.warn(`Only ${analysisData.hashtags.length} hashtags generated (expected 20)`);
    }
    if (analysisData.suggestedTitles.length < 5) {
      console.warn(`Only ${analysisData.suggestedTitles.length} titles generated (expected 5)`);
    }

    return NextResponse.json(analysisData);
  } catch (error) {
    console.error("Error analyzing article:", error);

    // Handle specific error types
    if (error instanceof Anthropic.APIError) {
      return NextResponse.json(
        {
          error: `API Error: ${error.message}`,
        },
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
