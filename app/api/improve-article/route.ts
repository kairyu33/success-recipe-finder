import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

/**
 * API route for article improvement suggestions using Claude AI
 *
 * @description This endpoint accepts article text and returns comprehensive
 * improvement suggestions including structure, content, engagement, clarity,
 * and SEO optimizations with priority-based action items.
 *
 * @param request - Next.js request object containing article text
 * @returns JSON response with improvement suggestions
 * @throws {Error} When API key is missing or Claude API fails
 *
 * @example
 * ```typescript
 * const response = await fetch('/api/improve-article', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({ articleText: '記事の内容...' })
 * });
 * const data = await response.json();
 * console.log(data.overall.score); // 72
 * console.log(data.actionItems); // Priority-sorted suggestions
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

    // Parse request body
    const { articleText } = await request.json();

    if (!articleText || typeof articleText !== "string") {
      return NextResponse.json(
        { error: "Article text is required and must be a string" },
        { status: 400 }
      );
    }

    if (articleText.length < 100) {
      return NextResponse.json(
        { error: "Article text is too short. Minimum 100 characters required for meaningful analysis." },
        { status: 400 }
      );
    }

    if (articleText.length > 20000) {
      return NextResponse.json(
        { error: "Article text is too long. Maximum 20,000 characters allowed." },
        { status: 400 }
      );
    }

    // Initialize Anthropic client
    const anthropic = new Anthropic({
      apiKey: apiKey,
    });

    // Call Claude API with prompt caching
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-5-20250929", // Claude Sonnet 4.5 for sophisticated analysis
      max_tokens: 3000,
      temperature: 0.7,
      system: [
        {
          type: "text",
          text: `あなたはnote.com記事の改善提案エキスパートです。記事を分析し、具体的な改善提案を以下のJSON形式で返してください。JSON以外の説明は一切含めないでください。

出力JSON構造：
{
  "overall": {
    "score": 0-100の総合評価点,
    "strengths": ["強み1〜3（具体的な良い点）"],
    "weaknesses": ["弱点1〜3（改善が必要な点）"]
  },
  "structure": {
    "score": 0-100の構成評価点,
    "suggestions": ["構成改善提案1〜3（導入部・本文・結論の改善）"],
    "examples": ["具体例（任意）"]
  },
  "content": {
    "score": 0-100のコンテンツ評価点,
    "hooks": ["より魅力的な導入フック1〜3"],
    "transitions": ["段落間の接続改善案1〜3"],
    "conclusions": ["より強力な結論の締め方1〜3"]
  },
  "engagement": {
    "score": 0-100のエンゲージメント評価点,
    "addEmotionalAppeal": ["感情に訴える要素1〜3"],
    "addStorytelling": ["ストーリーテリング要素1〜3"],
    "addExamples": ["追加すべき具体例1〜3"],
    "addQuestions": ["読者を引き込む質問1〜3"]
  },
  "clarity": {
    "score": 0-100の明瞭さ評価点,
    "simplifyPhrases": [
      {
        "original": "複雑な表現",
        "suggested": "簡潔な表現",
        "reason": "理由"
      }
    ],
    "splitSentences": ["分割すべき長い文章1〜3"]
  },
  "seoOptimizations": {
    "addKeywords": ["追加すべきキーワード3〜5"],
    "improveHeadings": ["見出し改善案3個"],
    "addInternalLinks": ["内部リンク提案2〜3"]
  },
  "actionItems": [
    {
      "priority": "high" | "medium" | "low",
      "category": "カテゴリ名",
      "suggestion": "具体的な改善提案",
      "impact": "期待される効果"
    }
  ]
}

評価基準：
- **構成 (structure)**: 導入の強さ、論理展開、結論の明確さ
- **コンテンツ (content)**: 価値提供、独自性、実践性
- **エンゲージメント (engagement)**: 感情的つながり、ストーリー性、読者参加
- **明瞭さ (clarity)**: 読みやすさ、文章の簡潔さ、専門用語の使い方
- **SEO (seoOptimizations)**: キーワード最適化、見出し構造、検索意図への対応

重要：
- スコアは客観的に評価（80+:優秀、60-79:良好、40-59:要改善、40未満:大幅改善必要）
- 提案は具体的かつ実践可能なものに
- actionItemsは優先度順に並べる（high -> medium -> low）
- note.comのプラットフォーム特性を考慮`,
          cache_control: { type: "ephemeral" } // Cache for cost savings
        }
      ],
      messages: [
        {
          role: "user",
          content: `記事テキスト：\n${articleText}`,
        },
      ],
    });

    // Extract response text
    const responseText = message.content[0].type === "text"
      ? message.content[0].text
      : "";

    // Log token usage
    console.log("[Article Improvement] Token usage:", {
      input_tokens: message.usage.input_tokens,
      output_tokens: message.usage.output_tokens,
      cache_creation_input_tokens: message.usage.cache_creation_input_tokens || 0,
      cache_read_input_tokens: message.usage.cache_read_input_tokens || 0,
    });

    // Parse JSON response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("[Article Improvement] Failed to extract JSON from response");
      return NextResponse.json(
        { error: "Failed to parse AI response. Please try again." },
        { status: 500 }
      );
    }

    let improvementData;
    try {
      improvementData = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error("[Article Improvement] JSON parse error:", parseError);
      return NextResponse.json(
        { error: "Failed to parse improvement suggestions. Please try again." },
        { status: 500 }
      );
    }

    // Validate response structure
    if (!improvementData.overall ||
        !improvementData.structure ||
        !improvementData.content ||
        !improvementData.engagement ||
        !improvementData.clarity ||
        !improvementData.actionItems) {
      console.error("[Article Improvement] Invalid response structure");
      return NextResponse.json(
        { error: "Received invalid response structure from AI" },
        { status: 500 }
      );
    }

    // Calculate estimated cost
    const inputCost = (message.usage.input_tokens / 1_000_000) * 3.0;
    const outputCost = (message.usage.output_tokens / 1_000_000) * 15.0;
    const cacheReadCost = ((message.usage.cache_read_input_tokens || 0) / 1_000_000) * 0.3;
    const totalCost = inputCost + outputCost + cacheReadCost;

    // Return complete improvement data with usage metadata
    return NextResponse.json({
      ...improvementData,
      usage: {
        inputTokens: message.usage.input_tokens,
        outputTokens: message.usage.output_tokens,
        totalCost: parseFloat(totalCost.toFixed(6)),
      }
    });

  } catch (error: any) {
    console.error("[Article Improvement] Error:", error);

    // Handle rate limiting
    if (error?.status === 429) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please try again in a moment." },
        { status: 429 }
      );
    }

    // Handle API errors
    if (error?.status) {
      return NextResponse.json(
        { error: `AI service error: ${error.message}` },
        { status: error.status }
      );
    }

    // Generic error
    return NextResponse.json(
      { error: "An unexpected error occurred while analyzing the article" },
      { status: 500 }
    );
  }
}

/**
 * GET handler for API documentation
 */
export async function GET() {
  return NextResponse.json({
    endpoint: "/api/improve-article",
    method: "POST",
    description: "Generate comprehensive article improvement suggestions using Claude AI",
    parameters: {
      articleText: {
        type: "string",
        required: true,
        minLength: 100,
        maxLength: 20000,
        description: "Article text to analyze"
      }
    },
    response: {
      overall: {
        score: "number (0-100)",
        strengths: "string[]",
        weaknesses: "string[]"
      },
      structure: { score: "number", suggestions: "string[]" },
      content: { score: "number", hooks: "string[]", transitions: "string[]", conclusions: "string[]" },
      engagement: { score: "number", addEmotionalAppeal: "string[]", addStorytelling: "string[]", addExamples: "string[]", addQuestions: "string[]" },
      clarity: { score: "number", simplifyPhrases: "Array<{original, suggested, reason}>", splitSentences: "string[]" },
      seoOptimizations: { addKeywords: "string[]", improveHeadings: "string[]", addInternalLinks: "string[]" },
      actionItems: "Array<{priority, category, suggestion, impact}>",
      usage: { inputTokens: "number", outputTokens: "number", totalCost: "number" }
    },
    example: {
      articleText: "AI技術が進化しています。機械学習やディープラーニングなどの技術が注目されています。"
    }
  });
}
