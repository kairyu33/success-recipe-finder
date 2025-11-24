# Migration Guide: Refactored Architecture

This guide walks you through migrating the note-hashtag-ai-generator codebase to use the new service layer architecture.

## Overview

The refactored architecture separates concerns into distinct layers:
- **API Routes** - Thin controllers handling HTTP
- **Services** - Business logic and AI interactions
- **Config** - Centralized configuration
- **Infrastructure** - Cache, middleware, utilities

## Migration Steps

### Step 1: Install and Verify Structure

1. Verify all new service files are in place:
```bash
ls app/services/ai/
ls app/services/analysis/
ls app/services/cache/
ls app/services/config/
```

2. Check that TypeScript compiles without errors:
```bash
npm run type-check
```

### Step 2: Migrate API Routes (One at a Time)

We'll migrate each API route individually to minimize risk.

#### Example: Migrate `/api/generate-hashtags`

**Before** (Original route):
```typescript
// app/api/generate-hashtags/route.ts
import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500 });
    }

    const { articleText } = await request.json();

    // Validation
    if (!articleText || typeof articleText !== "string") {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    // Create client
    const anthropic = new Anthropic({ apiKey });

    // Call API with hardcoded prompt
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 500,
      system: [{ type: "text", text: "あなたは..." }],
      messages: [{ role: "user", content: `記事テキスト：\n${articleText}` }],
    });

    // Parse response
    const hashtags = message.content[0].text
      .split("\n")
      .filter(line => line.startsWith("#"))
      .slice(0, 20);

    return NextResponse.json({ hashtags });
  } catch (error) {
    return NextResponse.json({ error: "Error occurred" }, { status: 500 });
  }
}
```

**After** (Refactored route):
```typescript
// app/api/generate-hashtags/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { HashtagService, createAIService } from '@/app/services';
import { AnalysisValidationError, AIServiceConfigurationError } from '@/app/services';

export async function POST(request: NextRequest) {
  try {
    // Parse request
    const { articleText, count, language, options } = await request.json();

    // Create services (dependency injection)
    const aiService = createAIService();
    const hashtagService = new HashtagService(aiService);

    // Generate hashtags (business logic in service)
    const result = await hashtagService.generateHashtags({
      articleText,
      count: count || 20,
      language: language || 'ja',
      options: options || { useCache: true },
    });

    // Return response
    return NextResponse.json({
      hashtags: result.hashtags,
      usage: result.usage,
    });
  } catch (error) {
    // Structured error handling
    if (error instanceof AnalysisValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    if (error instanceof AIServiceConfigurationError) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
```

**Migration Checklist for Each Route**:
- [ ] Backup original route file
- [ ] Remove direct Anthropic SDK usage
- [ ] Import services from `@/app/services`
- [ ] Use service methods instead of direct API calls
- [ ] Update error handling to use service error types
- [ ] Test the endpoint thoroughly
- [ ] Verify cost tracking still works

### Step 3: Update Environment Variables

Add new configuration options to `.env.local`:

```bash
# AI Configuration
ANTHROPIC_API_KEY=sk-ant-...
DEFAULT_AI_PROVIDER=anthropic
DEFAULT_AI_MODEL=claude-sonnet-4-20250514

# Cache Configuration
CACHE_PROVIDER=memory
CACHE_TTL_SECONDS=1800
ENABLE_CACHING=true

# Feature Flags
ENABLE_COST_TRACKING=true
```

### Step 4: Implement Remaining Services

The following services need to be implemented:

#### EyeCatchService

```typescript
// app/services/analysis/EyeCatchService.ts
import type { IAIService } from '../ai/AIService.interface';
import { BaseAnalysisService } from './BaseAnalysisService';
import type { EyeCatchRequest, EyeCatchResult } from './types';
import { getPromptTemplate } from '../config/PromptTemplates';
import { getRecommendedModel } from '../config/ModelConfig';

export class EyeCatchService extends BaseAnalysisService {
  protected readonly serviceName = 'EyeCatchService';

  constructor(aiService: IAIService) {
    super(aiService);
  }

  async generateEyeCatch(request: EyeCatchRequest): Promise<EyeCatchResult> {
    const startTime = Date.now();

    try {
      // Validate and preprocess
      this.validateRequest(request);
      const processedText = this.preprocessText(request.articleText);

      // Get configuration
      const modelConfig = getRecommendedModel('eyecatch-generation');
      const options = this.mergeOptions(request.options, {
        maxTokens: modelConfig.maxTokens,
        temperature: modelConfig.temperature,
      });

      // Get prompt
      const language = request.language || 'ja';
      const promptVariant = request.includeColorPalette
        ? 'DETAILED_WITH_COLORS_JA'
        : 'DEFAULT_JA';
      const prompt = getPromptTemplate('eyecatch', promptVariant);

      // Call AI service
      const response = await this.aiService.generateCompletion({
        systemPrompt: [
          {
            role: 'system',
            content: prompt.content,
            ...(options.useCache && { cacheControl: { type: 'ephemeral' as const } }),
          },
        ],
        messages: [{ role: 'user', content: `記事テキスト：\n${processedText}` }],
        config: {
          model: options.model || modelConfig.config.model,
          maxTokens: options.maxTokens || modelConfig.maxTokens,
          temperature: options.temperature,
          useCache: options.useCache,
        },
      });

      // Parse response
      const result = this.parseEyeCatchResponse(response.content, request);

      // Log performance
      this.logPerformance('generateEyeCatch', startTime, response.usage);

      return {
        ...result,
        usage: response.usage,
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private parseEyeCatchResponse(
    responseText: string,
    request: EyeCatchRequest
  ): Omit<EyeCatchResult, 'usage'> {
    // Parse structured response
    const imagePromptMatch = responseText.match(/---IMAGE_PROMPT---\s*([\s\S]*?)(?=---COMPOSITION_IDEAS---|$)/);
    const compositionMatch = responseText.match(/---COMPOSITION_IDEAS---\s*([\s\S]*?)(?=---SUMMARY---|$)/);
    const summaryMatch = responseText.match(/---SUMMARY---\s*([\s\S]*?)$/);

    if (!imagePromptMatch || !compositionMatch || !summaryMatch) {
      throw new Error('Failed to parse eye-catch response');
    }

    const imagePrompt = imagePromptMatch[1].trim();
    const compositionIdeas = this.extractArrayItems(
      compositionMatch[1],
      undefined,
      request.compositionCount || 5
    );
    const summary = summaryMatch[1].trim().substring(0, 100);

    // Parse color palette if included
    let colorPalette: string[] | undefined;
    let mood: string | undefined;
    let style: string | undefined;

    if (request.includeColorPalette) {
      const colorMatch = responseText.match(/---COLOR_PALETTE---\s*([\s\S]*?)(?=---MOOD---|$)/);
      const moodMatch = responseText.match(/---MOOD---\s*([\s\S]*?)(?=---STYLE---|$)/);
      const styleMatch = responseText.match(/---STYLE---\s*([\s\S]*?)(?=---SUMMARY---|$)/);

      if (colorMatch) {
        colorPalette = colorMatch[1]
          .split(',')
          .map(c => c.trim())
          .filter(c => c.startsWith('#'));
      }
      if (moodMatch) mood = moodMatch[1].trim();
      if (styleMatch) style = styleMatch[1].trim();
    }

    return {
      imagePrompt,
      compositionIdeas,
      summary,
      colorPalette,
      mood,
      style,
    };
  }

  private handleError(error: unknown): Error {
    // Error handling logic
    if (error instanceof Error) {
      return error;
    }
    return new Error('Unknown error in EyeCatchService');
  }
}
```

#### ArticleAnalysisService (Full Analysis)

```typescript
// app/services/analysis/ArticleAnalysisService.ts
import type { IAIService } from '../ai/AIService.interface';
import { BaseAnalysisService } from './BaseAnalysisService';
import type { FullAnalysisRequest, FullAnalysisResult } from './types';
import { AnalysisServiceError, AnalysisParsingError } from './types';
import { getPromptTemplate } from '../config/PromptTemplates';
import { getRecommendedModel } from '../config/ModelConfig';

export class ArticleAnalysisService extends BaseAnalysisService {
  protected readonly serviceName = 'ArticleAnalysisService';

  constructor(aiService: IAIService) {
    super(aiService);
  }

  async analyzeArticleFull(request: FullAnalysisRequest): Promise<FullAnalysisResult> {
    const startTime = Date.now();

    try {
      // Validate
      this.validateRequest(request);
      const processedText = this.preprocessText(request.articleText);

      // Get configuration
      const modelConfig = getRecommendedModel('full-analysis');
      const options = this.mergeOptions(request.options, {
        maxTokens: modelConfig.maxTokens,
        temperature: modelConfig.temperature,
      });

      // Get prompt
      const prompt = getPromptTemplate('full-analysis', 'DEFAULT_JA');

      // Call AI service
      const response = await this.aiService.generateCompletion({
        systemPrompt: [
          {
            role: 'system',
            content: prompt.content,
            ...(options.useCache && { cacheControl: { type: 'ephemeral' as const } }),
          },
        ],
        messages: [{ role: 'user', content: `記事テキスト：\n${processedText}` }],
        config: {
          model: options.model || modelConfig.config.model,
          maxTokens: options.maxTokens || modelConfig.maxTokens,
          temperature: options.temperature,
          useCache: options.useCache,
        },
      });

      // Parse JSON response
      const analysisData = this.parseAnalysisJSON(response.content);

      // Validate and sanitize
      const result = this.validateAndSanitizeAnalysis(analysisData, request);

      // Log performance
      this.logPerformance('analyzeArticleFull', startTime, response.usage);

      return {
        ...result,
        usage: response.usage,
      };
    } catch (error) {
      if (error instanceof AnalysisServiceError) {
        throw error;
      }
      throw new AnalysisServiceError(
        'Failed to analyze article',
        this.serviceName,
        error as Error
      );
    }
  }

  private parseAnalysisJSON(responseText: string): any {
    try {
      return this.parseJSON(responseText);
    } catch (error) {
      throw new AnalysisParsingError(
        this.serviceName,
        'Failed to parse analysis response as JSON',
        responseText
      );
    }
  }

  private validateAndSanitizeAnalysis(
    data: any,
    request: FullAnalysisRequest
  ): Omit<FullAnalysisResult, 'usage'> {
    // Ensure all required fields exist with defaults
    const titleCount = request.titleCount || 5;
    const hashtagCount = request.hashtagCount || 20;

    return {
      suggestedTitles: (data.suggestedTitles || []).slice(0, titleCount),
      insights: {
        whatYouLearn: (data.insights?.whatYouLearn || []).slice(0, 5),
        benefits: (data.insights?.benefits || []).slice(0, 5),
        recommendedFor: (data.insights?.recommendedFor || []).slice(0, 5),
        oneLiner: data.insights?.oneLiner || '',
      },
      eyeCatchImage: {
        mainPrompt: data.eyeCatchImage?.mainPrompt || '',
        compositionIdeas: (data.eyeCatchImage?.compositionIdeas || []).slice(0, 3),
        colorPalette: (data.eyeCatchImage?.colorPalette || []).slice(0, 4),
        mood: data.eyeCatchImage?.mood || '',
        style: data.eyeCatchImage?.style || '',
        summary: (data.eyeCatchImage?.summary || '').substring(0, 100),
      },
      hashtags: (data.hashtags || [])
        .map((tag: string) => (tag.startsWith('#') ? tag : `#${tag}`))
        .slice(0, hashtagCount),
    };
  }
}
```

### Step 5: Create Cache Service Factory

```typescript
// app/services/cache/CacheServiceFactory.ts
import type { ICacheService } from './CacheService.interface';
import { MemoryCacheService } from './MemoryCacheService';
// import { RedisCacheService } from './RedisCacheService'; // Future

export type CacheProvider = 'memory' | 'redis';

export class CacheServiceFactory {
  private static providers: Map<CacheProvider, () => ICacheService> = new Map([
    ['memory', () => new MemoryCacheService()],
    // ['redis', () => new RedisCacheService()], // Future
  ]);

  static create(provider?: CacheProvider): ICacheService {
    const selectedProvider = provider || this.getDefaultProvider();
    const factory = this.providers.get(selectedProvider);

    if (!factory) {
      throw new Error(`Unsupported cache provider: ${selectedProvider}`);
    }

    return factory();
  }

  static getDefaultProvider(): CacheProvider {
    const envProvider = process.env.CACHE_PROVIDER?.toLowerCase();
    if (envProvider && this.providers.has(envProvider as CacheProvider)) {
      return envProvider as CacheProvider;
    }
    return 'memory';
  }
}

export function createCacheService(provider?: CacheProvider): ICacheService {
  return CacheServiceFactory.create(provider);
}
```

### Step 6: Add Caching to API Routes

Once cache service is ready, add caching to routes:

```typescript
import { createCacheService, generateCacheKey, hashObject } from '@/app/services';

export async function POST(request: NextRequest) {
  try {
    const { articleText, count } = await request.json();

    // Check cache
    const cache = createCacheService();
    const cacheKey = generateCacheKey('hashtags', hashObject({ articleText, count }));
    const cached = await cache.get(cacheKey);

    if (cached) {
      console.log('[Cache Hit] Returning cached result');
      return NextResponse.json(cached);
    }

    // Generate fresh result
    const aiService = createAIService();
    const hashtagService = new HashtagService(aiService);
    const result = await hashtagService.generateHashtags({ articleText, count });

    // Cache result
    await cache.set(cacheKey, result, { ttl: 1800 }); // 30 minutes

    return NextResponse.json(result);
  } catch (error) {
    // Error handling...
  }
}
```

### Step 7: Testing Strategy

#### Unit Tests

```typescript
// __tests__/services/HashtagService.test.ts
import { HashtagService } from '@/app/services/analysis/HashtagService';
import type { IAIService, AICompletionResponse } from '@/app/services/ai/AIService.interface';

describe('HashtagService', () => {
  let mockAIService: IAIService;
  let hashtagService: HashtagService;

  beforeEach(() => {
    // Create mock AI service
    mockAIService = {
      provider: 'mock',
      generateCompletion: jest.fn(),
      validateConfiguration: jest.fn().mockResolvedValue(true),
      estimateCost: jest.fn().mockReturnValue(0.01),
      getSupportedModels: jest.fn().mockReturnValue(['mock-model']),
    };

    hashtagService = new HashtagService(mockAIService);
  });

  it('should generate 20 hashtags', async () => {
    // Mock AI response
    const mockResponse: AICompletionResponse = {
      content: '#Test1\n#Test2\n#Test3\n' + '...' + '#Test20',
      usage: { inputTokens: 100, outputTokens: 50 },
    };

    (mockAIService.generateCompletion as jest.Mock).mockResolvedValue(mockResponse);

    // Test
    const result = await hashtagService.generateHashtags({
      articleText: 'Test article text',
      count: 20,
    });

    expect(result.hashtags).toHaveLength(20);
    expect(result.hashtags[0]).toMatch(/^#/);
  });

  it('should validate article text length', async () => {
    await expect(
      hashtagService.generateHashtags({
        articleText: 'x'.repeat(20000), // Too long
        count: 20,
      })
    ).rejects.toThrow('Article text is too long');
  });
});
```

#### Integration Tests

```typescript
// __tests__/integration/hashtags.test.ts
import { createAIService } from '@/app/services';
import { HashtagService } from '@/app/services';

describe('Hashtag Generation Integration', () => {
  it('should generate hashtags using real AI service', async () => {
    // Skip if no API key
    if (!process.env.ANTHROPIC_API_KEY) {
      console.log('Skipping: ANTHROPIC_API_KEY not set');
      return;
    }

    const aiService = createAIService();
    const hashtagService = new HashtagService(aiService);

    const result = await hashtagService.generateHashtags({
      articleText: 'テスト記事のテキスト...',
      count: 20,
    });

    expect(result.hashtags.length).toBeGreaterThan(0);
    expect(result.usage).toBeDefined();
    expect(result.usage?.totalCost).toBeGreaterThan(0);
  }, 30000); // 30 second timeout
});
```

### Step 8: Rollback Plan

If issues arise, rollback steps:

1. Restore original route files from backup:
```bash
cp app/api/generate-hashtags/route.ts.backup app/api/generate-hashtags/route.ts
```

2. Remove service layer imports:
```bash
git checkout app/api/generate-hashtags/route.ts
```

3. Restart the server:
```bash
npm run dev
```

## Common Issues and Solutions

### Issue 1: TypeScript Import Errors

**Problem**: `Cannot find module '@/app/services'`

**Solution**:
```bash
# Ensure TypeScript paths are configured
cat tsconfig.json | grep '"@/\*"'
# Should show: "@/*": ["./*"]

# Restart TypeScript server in VSCode
# Cmd/Ctrl + Shift + P -> "TypeScript: Restart TS Server"
```

### Issue 2: AI Service Configuration Error

**Problem**: "ANTHROPIC_API_KEY is not configured"

**Solution**:
```bash
# Verify .env.local exists
ls -la .env.local

# Ensure variable is set
grep ANTHROPIC_API_KEY .env.local

# Restart dev server
npm run dev
```

### Issue 3: Service Not Found at Runtime

**Problem**: Runtime error about missing service

**Solution**:
```bash
# Rebuild Next.js
rm -rf .next
npm run build
npm run dev
```

## Performance Checklist

After migration, verify:

- [ ] Prompt caching is working (check logs for `cache_read_input_tokens`)
- [ ] Response caching is enabled
- [ ] Token usage is being logged
- [ ] Cost tracking is accurate
- [ ] Error messages are user-friendly
- [ ] Response times are similar or better

## Next Steps

1. Monitor production metrics
2. Gather user feedback
3. Optimize prompt templates based on results
4. Consider adding Redis for distributed caching
5. Implement OpenAI provider for comparison
6. Add more comprehensive tests

## Support

For questions or issues:
1. Check ARCHITECTURE.md for detailed documentation
2. Review inline JSDoc comments in service files
3. Check example refactored route: `app/api/generate-hashtags/route.refactored.ts`

Happy migrating! 🚀
