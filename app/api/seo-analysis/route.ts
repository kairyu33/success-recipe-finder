/**
 * SEO Analysis API Endpoint
 *
 * @description Provides comprehensive SEO optimization analysis for note.com articles.
 * Returns SEO score, meta description, keyword analysis, readability metrics,
 * and prioritized improvement recommendations.
 *
 * @route POST /api/seo-analysis
 */

import { NextRequest, NextResponse } from 'next/server';
import { SEOService } from '@/app/services/analysis/SEOService';
import { createAIService } from '@/app/services/ai/AIServiceFactory';
import { AnalysisServiceError, AnalysisValidationError } from '@/app/services/analysis/types';

/**
 * Request body interface
 */
interface SEOAnalysisRequestBody {
  /** Article text to analyze */
  articleText: string;
  /** Optional article title */
  title?: string;
  /** Optional existing meta description */
  existingMetaDescription?: string;
  /** Optional target keyword */
  targetKeyword?: string;
  /** Optional language (defaults to 'ja') */
  language?: 'ja' | 'en';
  /** Optional analysis options */
  options?: {
    useCache?: boolean;
    temperature?: number;
    model?: string;
  };
}

/**
 * POST /api/seo-analysis
 *
 * Analyze article for SEO optimization
 *
 * @param request - Next.js request object
 * @returns SEO analysis result with score, grade, and recommendations
 *
 * @example
 * ```typescript
 * const response = await fetch('/api/seo-analysis', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({
 *     articleText: '記事の内容...',
 *     title: '記事タイトル',
 *     options: { useCache: true }
 *   })
 * });
 * const data = await response.json();
 * console.log(`SEO Score: ${data.score}/100 (${data.grade})`);
 * ```
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    // Parse request body
    const body: SEOAnalysisRequestBody = await request.json();

    // Validate required fields
    if (!body.articleText || typeof body.articleText !== 'string') {
      return NextResponse.json(
        {
          error: 'Missing or invalid articleText field',
          message: 'articleText is required and must be a string',
        },
        { status: 400 }
      );
    }

    // Validate article text length
    if (body.articleText.trim().length < 50) {
      return NextResponse.json(
        {
          error: 'Article text too short',
          message: 'Article text must be at least 50 characters',
        },
        { status: 400 }
      );
    }

    if (body.articleText.length > 50000) {
      return NextResponse.json(
        {
          error: 'Article text too long',
          message: 'Article text must not exceed 50,000 characters',
        },
        { status: 400 }
      );
    }

    // Create AI service
    const aiService = createAIService();

    // Validate AI service configuration
    const isConfigured = await aiService.validateConfiguration();
    if (!isConfigured) {
      return NextResponse.json(
        {
          error: 'AI service not configured',
          message: 'Please configure ANTHROPIC_API_KEY environment variable',
        },
        { status: 500 }
      );
    }

    // Create SEO service
    const seoService = new SEOService(aiService);

    // Estimate cost (optional, for logging)
    const costEstimate = seoService.estimateCost(body.articleText);
    console.log('[SEO Analysis] Cost estimate:', {
      inputTokens: costEstimate.inputTokens,
      outputTokens: costEstimate.outputTokens,
      estimatedCost: `$${costEstimate.total.toFixed(4)}`,
    });

    // Perform SEO analysis
    const result = await seoService.analyzeSEO({
      articleText: body.articleText,
      title: body.title,
      existingMetaDescription: body.existingMetaDescription,
      targetKeyword: body.targetKeyword,
      language: body.language || 'ja',
      options: {
        useCache: body.options?.useCache ?? true,
        temperature: body.options?.temperature ?? 0.3,
        model: body.options?.model,
      },
    });

    // Calculate processing time
    const processingTime = Date.now() - startTime;

    // Log success
    console.log('[SEO Analysis] Success:', {
      score: result.score,
      grade: result.grade,
      processingTime: `${processingTime}ms`,
      usage: result.usage,
    });

    // Return successful response
    return NextResponse.json(
      {
        success: true,
        data: result,
        meta: {
          processingTime,
          timestamp: new Date().toISOString(),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    // Handle validation errors
    if (error instanceof AnalysisValidationError) {
      console.error('[SEO Analysis] Validation error:', error.message);
      return NextResponse.json(
        {
          error: 'Validation error',
          message: error.message,
          serviceName: error.serviceName,
        },
        { status: 400 }
      );
    }

    // Handle analysis errors
    if (error instanceof AnalysisServiceError) {
      console.error('[SEO Analysis] Service error:', error.message);
      return NextResponse.json(
        {
          error: 'Analysis failed',
          message: error.message,
          serviceName: error.serviceName,
        },
        { status: 500 }
      );
    }

    // Handle unexpected errors
    console.error('[SEO Analysis] Unexpected error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'An unexpected error occurred during SEO analysis',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/seo-analysis
 *
 * Get endpoint information
 *
 * @returns Endpoint documentation
 */
export async function GET() {
  return NextResponse.json({
    endpoint: '/api/seo-analysis',
    method: 'POST',
    description: 'Comprehensive SEO optimization analysis for note.com articles',
    features: [
      'SEO score (0-100) with letter grade (A-F)',
      'Optimized meta description (150-160 characters)',
      'URL slug optimization',
      'Keyword density analysis (primary, secondary, long-tail)',
      'Readability metrics (Japanese-specific)',
      'Content structure analysis',
      'Image optimization suggestions',
      'Internal linking opportunities',
      'Prioritized improvement recommendations (critical/important/optional)',
    ],
    requestBody: {
      articleText: 'string (required, 50-50000 characters)',
      title: 'string (optional, 10-100 characters)',
      existingMetaDescription: 'string (optional)',
      targetKeyword: 'string (optional, 2-50 characters)',
      language: "'ja' | 'en' (optional, defaults to 'ja')",
      options: {
        useCache: 'boolean (optional, defaults to true)',
        temperature: 'number (optional, 0.0-1.0, defaults to 0.3)',
        model: 'string (optional)',
      },
    },
    responseStructure: {
      success: 'boolean',
      data: {
        score: 'number (0-100)',
        grade: "'A' | 'B' | 'C' | 'D' | 'F'",
        metaDescription: 'string',
        optimizedSlug: 'string',
        keywords: {
          primary: 'string[]',
          secondary: 'string[]',
          longTail: 'string[]',
          density: 'Record<string, number>',
        },
        readability: {
          score: 'number',
          level: 'string',
          averageSentenceLength: 'number',
          averageParagraphLength: 'number',
          kanjiRatio: 'number (for Japanese)',
        },
        structure: {
          wordCount: 'number',
          characterCount: 'number',
          paragraphCount: 'number',
          headingCount: 'number',
          readingTimeMinutes: 'number',
          recommendations: 'string[]',
        },
        improvements: {
          critical: 'string[]',
          important: 'string[]',
          optional: 'string[]',
        },
        imageOptimization: {
          altTextSuggestions: 'string[]',
          recommendedImageCount: 'number',
        },
        internalLinking: {
          suggestedAnchors: 'string[]',
          relatedTopics: 'string[]',
        },
        usage: {
          inputTokens: 'number',
          outputTokens: 'number',
          totalCost: 'number',
        },
      },
      meta: {
        processingTime: 'number (milliseconds)',
        timestamp: 'string (ISO 8601)',
      },
    },
    examples: {
      curl: `curl -X POST https://your-domain.com/api/seo-analysis \\
  -H "Content-Type: application/json" \\
  -d '{
    "articleText": "AIを活用した最新のマーケティング手法について...",
    "title": "AI活用マーケティング完全ガイド",
    "options": { "useCache": true }
  }'`,
      javascript: `const response = await fetch('/api/seo-analysis', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    articleText: '記事の内容...',
    title: '記事タイトル',
    options: { useCache: true }
  })
});
const data = await response.json();
console.log(\`SEO Score: \${data.data.score}/100 (\${data.data.grade})\`);`,
    },
    version: '1.0.0',
    lastUpdated: '2025-01-25',
  });
}
