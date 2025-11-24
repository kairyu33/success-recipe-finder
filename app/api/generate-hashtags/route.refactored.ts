/**
 * Refactored Hashtag Generation API Route
 *
 * @description This is a refactored version showing how to use the new service layer architecture.
 * The route is now a thin controller that delegates business logic to services.
 *
 * To use this refactored version:
 * 1. Rename this file to route.ts (backup the original first)
 * 2. Ensure all service dependencies are installed
 * 3. Test the endpoint
 *
 * Benefits of this approach:
 * - Cleaner, more maintainable code
 * - Easier to test (mock services)
 * - Reusable business logic
 * - Consistent error handling
 * - Built-in caching support
 * - Better cost tracking
 */

import { NextRequest, NextResponse } from 'next/server';
import { HashtagService } from '@/app/services/analysis/HashtagService';
import { createAIService } from '@/app/services/ai/AIServiceFactory';
import {
  AnalysisServiceError,
  AnalysisValidationError,
} from '@/app/services/analysis/types';
import {
  AIServiceConfigurationError,
  AIServiceRateLimitError,
} from '@/app/services/ai/AIService.interface';

/**
 * POST /api/generate-hashtags
 *
 * @description Generate optimized hashtags for note.com articles
 *
 * Request body:
 * {
 *   "articleText": string,      // Required: Article text to analyze
 *   "count": number,             // Optional: Number of hashtags (default: 20)
 *   "language": "ja" | "en",     // Optional: Language preference (default: "ja")
 *   "options": {                 // Optional: Generation options
 *     "useCache": boolean,       // Enable caching (default: true)
 *     "temperature": number      // AI temperature 0-1 (default: 0.7)
 *   }
 * }
 *
 * Response:
 * {
 *   "hashtags": string[],        // Array of generated hashtags
 *   "usage": {                   // Token usage and cost info
 *     "inputTokens": number,
 *     "outputTokens": number,
 *     "totalCost": number
 *   }
 * }
 *
 * @example
 * ```typescript
 * const response = await fetch('/api/generate-hashtags', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({
 *     articleText: '最新のAI技術について...',
 *     count: 20
 *   })
 * });
 * const data = await response.json();
 * console.log(data.hashtags);
 * ```
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { articleText, count, language, options } = body;

    // Create AI service (automatically selects configured provider)
    const aiService = createAIService();

    // Create hashtag service with AI service dependency
    const hashtagService = new HashtagService(aiService);

    // Generate hashtags using service layer
    const result = await hashtagService.generateHashtags({
      articleText,
      count: count || 20,
      language: language || 'ja',
      options: {
        useCache: options?.useCache ?? true,
        temperature: options?.temperature,
        // Additional options can be passed through
      },
    });

    // Return successful response
    return NextResponse.json(
      {
        hashtags: result.hashtags,
        usage: result.usage
          ? {
              inputTokens: result.usage.inputTokens,
              outputTokens: result.usage.outputTokens,
              totalCost: result.usage.totalCost,
              cacheHit: result.usage.cacheReadInputTokens
                ? result.usage.cacheReadInputTokens > 0
                : false,
            }
          : undefined,
      },
      { status: 200 }
    );
  } catch (error) {
    // Handle specific error types with appropriate responses
    return handleError(error);
  }
}

/**
 * Handle errors with appropriate HTTP responses
 *
 * @param error - Error object
 * @returns NextResponse with error details
 */
function handleError(error: unknown): NextResponse {
  console.error('[API Error] /api/generate-hashtags:', error);

  // Validation errors (400 Bad Request)
  if (error instanceof AnalysisValidationError) {
    return NextResponse.json(
      {
        error: error.message,
        type: 'validation_error',
      },
      { status: 400 }
    );
  }

  // Configuration errors (500 Internal Server Error)
  if (error instanceof AIServiceConfigurationError) {
    return NextResponse.json(
      {
        error: 'AI service is not properly configured. Please contact support.',
        type: 'configuration_error',
      },
      { status: 500 }
    );
  }

  // Rate limit errors (429 Too Many Requests)
  if (error instanceof AIServiceRateLimitError) {
    return NextResponse.json(
      {
        error: 'Rate limit exceeded. Please try again later.',
        type: 'rate_limit_error',
        retryAfter: error.retryAfter,
      },
      {
        status: 429,
        headers: error.retryAfter
          ? { 'Retry-After': String(error.retryAfter) }
          : {},
      }
    );
  }

  // Analysis service errors (500 Internal Server Error)
  if (error instanceof AnalysisServiceError) {
    return NextResponse.json(
      {
        error: 'Failed to generate hashtags. Please try again.',
        type: 'analysis_error',
      },
      { status: 500 }
    );
  }

  // Generic errors (500 Internal Server Error)
  return NextResponse.json(
    {
      error: 'An unexpected error occurred. Please try again.',
      type: 'unknown_error',
    },
    { status: 500 }
  );
}

/**
 * GET /api/generate-hashtags
 *
 * @description Get endpoint information and cost estimates
 *
 * @example
 * ```typescript
 * const response = await fetch('/api/generate-hashtags');
 * const info = await response.json();
 * console.log(info.estimatedCost);
 * ```
 */
export async function GET() {
  return NextResponse.json({
    endpoint: '/api/generate-hashtags',
    method: 'POST',
    description: 'Generate optimized hashtags for note.com articles',
    parameters: {
      articleText: {
        type: 'string',
        required: true,
        description: 'Article text to analyze (max 10,000 characters)',
      },
      count: {
        type: 'number',
        required: false,
        default: 20,
        description: 'Number of hashtags to generate (1-50)',
      },
      language: {
        type: 'string',
        required: false,
        default: 'ja',
        enum: ['ja', 'en'],
        description: 'Language preference',
      },
      options: {
        type: 'object',
        required: false,
        properties: {
          useCache: {
            type: 'boolean',
            default: true,
            description: 'Enable prompt caching for cost savings',
          },
          temperature: {
            type: 'number',
            default: 0.7,
            description: 'AI temperature (0-1)',
          },
        },
      },
    },
    estimatedCost: {
      shortArticle: '$0.001 - $0.002',
      mediumArticle: '$0.003 - $0.005',
      longArticle: '$0.006 - $0.010',
      withCache: '90% cost reduction on subsequent calls',
    },
    rateLimit: {
      maxRequests: 10,
      windowMs: 60000,
      description: '10 requests per minute',
    },
  });
}
