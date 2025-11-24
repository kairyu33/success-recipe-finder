import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

/**
 * API route for generating hashtags using Claude AI
 *
 * @description This endpoint accepts article text and returns 20 optimized hashtags
 * for note.com platform using Claude's natural language understanding
 *
 * Cost optimizations implemented:
 * - Upgraded to Claude Sonnet 4.5 for better performance
 * - Reduced max_tokens to 500 (40% reduction from 1024)
 * - Optimized prompt for conciseness (removed verbose explanations)
 * - Implemented prompt caching for static instructions (90% cost reduction on repeat calls)
 *
 * @param request - Next.js request object containing article text
 * @returns JSON response with generated hashtags array
 * @throws {Error} When API key is missing or Claude API fails
 *
 * @example
 * ```typescript
 * const response = await fetch('/api/generate-hashtags', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({ articleText: '記事の内容...' })
 * });
 * const data = await response.json();
 * console.log(data.hashtags); // ['#テクノロジー', '#AI', ...]
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

    if (articleText.length > 30000) {
      return NextResponse.json(
        { error: "Article text is too long. Maximum 30,000 characters allowed." },
        { status: 400 }
      );
    }

    // Initialize Anthropic client
    const anthropic = new Anthropic({
      apiKey: apiKey,
    });

    // Call Claude API with prompt caching for cost optimization
    // The system prompt with cache_control will be cached for 5 minutes,
    // reducing costs by 90% on subsequent calls with the same instructions
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-5-20250929", // Upgraded to Claude Sonnet 4.5
      max_tokens: 500, // Optimized: reduced from 1024 (40% reduction)
      system: [
        {
          type: "text",
          text: `あなたはnote.com記事のハッシュタグ生成エキスパートです。以下のルールに従って正確に20個のハッシュタグを生成してください：

1. 必ず「#」で始める
2. 日本語を優先
3. note.comで検索されやすいタグを選ぶ
4. 一般的なタグと具体的なタグをバランスよく含める
5. 1行に1つずつ記載
6. 必ず20個生成

出力形式：
#タグ1
#タグ2
...
#タグ20`,
          cache_control: { type: "ephemeral" } // Cache this system prompt for cost savings
        }
      ],
      messages: [
        {
          role: "user",
          content: `記事テキスト：\n${articleText}\n\n20個のハッシュタグを生成してください。`,
        },
      ],
    });

    // Log token usage for cost tracking
    console.log("[Hashtag Generation] Token usage:", {
      input_tokens: message.usage.input_tokens,
      output_tokens: message.usage.output_tokens,
      cache_creation_input_tokens: message.usage.cache_creation_input_tokens || 0,
      cache_read_input_tokens: message.usage.cache_read_input_tokens || 0,
    });

    // Extract hashtags from Claude's response
    const content = message.content[0];
    if (content.type !== "text") {
      throw new Error("Unexpected response type from Claude");
    }

    const responseText = content.text;
    const hashtags = responseText
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.startsWith("#"))
      .slice(0, 20); // Ensure we only return 20 hashtags

    // Validate response
    if (hashtags.length === 0) {
      return NextResponse.json(
        { error: "Failed to generate hashtags. Please try again." },
        { status: 500 }
      );
    }

    if (hashtags.length < 20) {
      console.warn(`Only ${hashtags.length} hashtags generated (expected 20)`);
    }

    return NextResponse.json({ hashtags });
  } catch (error) {
    console.error("Error generating hashtags:", error);

    // Handle specific error types
    if (error instanceof Anthropic.APIError) {
      return NextResponse.json(
        {
          error: `API Error: ${error.message}`,
        },
        { status: error.status || 500 }
      );
    }

    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
