import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import type { ArticleAnalysisResponse, EyeCatchData } from "@/app/types/api";

/**
 * Comprehensive API route for analyzing articles using Claude AI
 *
 * @description This endpoint accepts article text and returns:
 * - 20 optimized hashtags for note.com
 * - Eye-catch image generation data (DALL-E prompt, composition ideas, summary)
 *
 * This endpoint combines the functionality of /api/generate-hashtags and
 * /api/generate-eyecatch for a single, efficient API call.
 *
 * Cost optimizations implemented:
 * - Upgraded to Claude Sonnet 4.5 for better performance
 * - Reduced max_tokens to 1000 (67% reduction from 3072)
 * - Optimized prompt for conciseness (removed verbose explanations)
 * - Implemented prompt caching for static instructions (90% cost reduction on repeat calls)
 * - Simplified output format for faster parsing
 *
 * @param request - Next.js request object containing article text
 * @returns JSON response with hashtags and eye-catch data
 * @throws {Error} When API key is missing or Claude API fails
 *
 * @example
 * ```typescript
 * const response = await fetch('/api/analyze-article', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({ articleText: '記事の内容...' })
 * });
 * const data = await response.json();
 * console.log(data.hashtags); // ['#テクノロジー', '#AI', ...]
 * console.log(data.eyeCatch.imagePrompt); // 'A modern tech conference...'
 * console.log(data.eyeCatch.compositionIdeas); // ['青と白のグラデーション...', ...]
 * console.log(data.eyeCatch.summary); // '記事の要約...'
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
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-5-20250929", // Upgraded to Claude Sonnet 4.5
      max_tokens: 1000, // Optimized: reduced from 3072 (67% reduction)
      temperature: 0.7,
      system: [
        {
          type: "text",
          text: `あなたはnote.com記事の包括的分析エキスパートです。記事を分析し、以下の4つを生成してください：

1. HASHTAGS: note.comで検索されやすい日本語のハッシュタグ20個（#付き、1行に1つ）
2. IMAGE_PROMPT: DALL-E用の詳細な英語プロンプト（1-2文）
3. COMPOSITION_IDEAS: 代替構成案（日本語、3-5個、各1文）
4. SUMMARY: 記事要約（日本語、100文字以内）

出力形式：
---HASHTAGS---
#タグ1
#タグ2
...
#タグ20
---IMAGE_PROMPT---
[英語プロンプト]
---COMPOSITION_IDEAS---
[構成案1]
[構成案2]
[構成案3]
---SUMMARY---
[要約]`,
          cache_control: { type: "ephemeral" } // Cache this system prompt for cost savings
        }
      ],
      messages: [
        {
          role: "user",
          content: `記事テキスト：\n${articleText}`,
        },
      ],
    });

    // Log token usage for cost tracking
    console.log("[Article Analysis] Token usage:", {
      input_tokens: message.usage.input_tokens,
      output_tokens: message.usage.output_tokens,
      cache_creation_input_tokens: message.usage.cache_creation_input_tokens || 0,
      cache_read_input_tokens: message.usage.cache_read_input_tokens || 0,
    });

    // Extract response from Claude
    const content = message.content[0];
    if (content.type !== "text") {
      throw new Error("Unexpected response type from Claude");
    }

    const responseText = content.text;

    // Parse the structured response
    const hashtagsMatch = responseText.match(/---HASHTAGS---\s*([\s\S]*?)(?=---IMAGE_PROMPT---|$)/);
    const imagePromptMatch = responseText.match(/---IMAGE_PROMPT---\s*([\s\S]*?)(?=---COMPOSITION_IDEAS---|$)/);
    const compositionMatch = responseText.match(/---COMPOSITION_IDEAS---\s*([\s\S]*?)(?=---SUMMARY---|$)/);
    const summaryMatch = responseText.match(/---SUMMARY---\s*([\s\S]*?)$/);

    if (!hashtagsMatch || !imagePromptMatch || !compositionMatch || !summaryMatch) {
      console.error("Failed to parse Claude response:", responseText);
      return NextResponse.json(
        { error: "Failed to parse AI response. Please try again." },
        { status: 500 }
      );
    }

    // Extract and process hashtags
    const hashtags = hashtagsMatch[1]
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.startsWith("#"))
      .slice(0, 20); // Ensure exactly 20 hashtags

    // Extract eye-catch data
    const imagePrompt = imagePromptMatch[1].trim();
    const compositionIdeas = compositionMatch[1]
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0 && !line.startsWith("---"))
      .slice(0, 5); // Limit to 5 ideas

    const summary = summaryMatch[1].trim().substring(0, 100); // Ensure 100 chars max

    // Validate parsed data
    if (hashtags.length === 0) {
      return NextResponse.json(
        { error: "Failed to generate hashtags. Please try again." },
        { status: 500 }
      );
    }

    if (!imagePrompt || compositionIdeas.length === 0 || !summary) {
      console.error("Incomplete eye-catch data:", { imagePrompt, compositionIdeas, summary });
      return NextResponse.json(
        { error: "Failed to generate complete analysis. Please try again." },
        { status: 500 }
      );
    }

    if (hashtags.length < 20) {
      console.warn(`Only ${hashtags.length} hashtags generated (expected 20)`);
    }

    const eyeCatch: EyeCatchData = {
      imagePrompt,
      compositionIdeas,
      summary,
    };

    const response: ArticleAnalysisResponse = {
      hashtags,
      eyeCatch,
    };

    return NextResponse.json(response);

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

    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
