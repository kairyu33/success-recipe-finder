# Note Hashtag AI Generator - Architecture Documentation

## Overview

This document describes the refactored architecture of the note-hashtag-ai-generator application. The new architecture follows SOLID principles and is designed for extensibility, maintainability, and testability.

## Architecture Layers

```
┌─────────────────────────────────────────────────────────────┐
│                      API Routes (Thin)                       │
│  /api/generate-hashtags  /api/generate-eyecatch  etc.        │
└────────────────┬────────────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────────────┐
│                    Analysis Services                         │
│  HashtagService  EyeCatchService  ArticleAnalysisService     │
└────────────────┬────────────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────────────┐
│                      AI Services                             │
│  AnthropicService  (OpenAIService)  (GoogleService)          │
└────────────────┬────────────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────────────┐
│                   Infrastructure                             │
│  Cache Service  Config Service  Middleware                   │
└─────────────────────────────────────────────────────────────┘
```

## Directory Structure

```
app/
├── api/                           # HTTP endpoints (thin controllers)
│   ├── generate-hashtags/
│   │   └── route.ts              # Refactored to use services
│   ├── generate-eyecatch/
│   │   └── route.ts
│   └── analyze-article-full/
│       └── route.ts
│
├── services/                      # Business logic layer
│   ├── ai/                       # AI provider abstraction
│   │   ├── AIService.interface.ts    # Abstract AI service interface
│   │   ├── AnthropicService.ts       # Anthropic Claude implementation
│   │   ├── AIServiceFactory.ts       # Factory for creating AI services
│   │   └── types.ts                  # AI service types
│   │
│   ├── analysis/                 # Analysis services
│   │   ├── BaseAnalysisService.ts    # Shared analysis logic
│   │   ├── HashtagService.ts         # Hashtag generation
│   │   ├── EyeCatchService.ts        # Eye-catch generation
│   │   ├── ArticleAnalysisService.ts # Full analysis
│   │   └── types.ts                  # Analysis types
│   │
│   ├── cache/                    # Caching layer
│   │   ├── CacheService.interface.ts # Cache abstraction
│   │   ├── MemoryCacheService.ts     # In-memory implementation
│   │   ├── RedisCacheService.ts      # Redis implementation (future)
│   │   └── CacheServiceFactory.ts    # Cache factory
│   │
│   └── config/                   # Configuration
│       ├── PromptTemplates.ts        # Externalized AI prompts
│       ├── ModelConfig.ts            # Model settings and pricing
│       └── AppConfig.ts              # Application config
│
├── domain/                        # Domain models
│   ├── Article.ts                # Article entity
│   ├── AnalysisResult.ts        # Analysis result value objects
│   └── HashtagSet.ts            # Hashtag collection
│
├── middleware/                    # HTTP middleware
│   ├── errorHandler.ts          # Centralized error handling
│   ├── rateLimiter.ts           # Request rate limiting
│   ├── validator.ts             # Request validation
│   └── logger.ts                # Request logging
│
├── utils/                        # Utility functions
│   ├── errors/                  # Custom error classes
│   ├── validators/              # Input validation
│   ├── formatters/              # Response formatting
│   └── logger/                  # Logging utilities
│
├── types/                        # Shared TypeScript types
│   ├── api.ts                   # API request/response types
│   └── common.ts                # Common types
│
└── config/                       # Configuration files
    ├── ai-models.config.ts      # AI model configurations
    ├── cache.config.ts          # Cache settings
    ├── rate-limit.config.ts     # Rate limiting config
    └── app.config.ts            # App-wide configuration
```

## Key Design Patterns

### 1. Strategy Pattern (AI Services)

Different AI providers (Anthropic, OpenAI, Google) implement the same interface:

```typescript
interface IAIService {
  generateCompletion(request: AICompletionRequest): Promise<AICompletionResponse>;
  estimateCost(inputTokens: number, outputTokens: number): number;
  // ...
}
```

Usage:
```typescript
// Easy to swap providers
const service = AIServiceFactory.create('anthropic');
// const service = AIServiceFactory.create('openai');
```

### 2. Factory Pattern (Service Creation)

Centralized service creation for consistency:

```typescript
// AI Service Factory
const aiService = AIServiceFactory.create('anthropic');
const autoService = AIServiceFactory.createAuto(); // Auto-selects based on API keys

// Cache Service Factory
const cache = CacheServiceFactory.create('memory');
// const cache = CacheServiceFactory.create('redis'); // For production
```

### 3. Template Method Pattern (Analysis Services)

Base class provides common functionality, subclasses implement specifics:

```typescript
abstract class BaseAnalysisService {
  protected validateRequest(request: BaseAnalysisRequest): void { /* ... */ }
  protected preprocessText(text: string): string { /* ... */ }
  // Common utilities
}

class HashtagService extends BaseAnalysisService {
  async generateHashtags(request: HashtagRequest): Promise<HashtagResult> {
    // Uses base class utilities
  }
}
```

### 4. Dependency Injection

Services receive dependencies via constructor:

```typescript
class HashtagService {
  constructor(private readonly aiService: IAIService) {}

  async generateHashtags(request: HashtagRequest) {
    // Use injected AI service
    const response = await this.aiService.generateCompletion(...);
  }
}

// Easy to test with mocks
const mockAI = new MockAIService();
const service = new HashtagService(mockAI);
```

## Service Layer Details

### AI Service Layer

**Purpose**: Abstract AI provider interactions

**Key Features**:
- Provider-agnostic interface
- Automatic error handling and retry logic
- Cost tracking and estimation
- Token usage monitoring
- Prompt caching support

**Example Usage**:
```typescript
import { createAIService } from '@/app/services/ai/AIServiceFactory';

const aiService = createAIService('anthropic');

const response = await aiService.generateCompletion({
  systemPrompt: 'You are a helpful assistant',
  messages: [{ role: 'user', content: 'Hello!' }],
  config: {
    model: 'claude-sonnet-4-20250514',
    maxTokens: 1000,
    temperature: 0.7,
    useCache: true
  }
});

console.log(response.content);
console.log(`Cost: $${response.usage.totalCost}`);
```

### Analysis Service Layer

**Purpose**: Implement business logic for different analysis types

**Key Services**:

1. **HashtagService** - Generate optimized hashtags
2. **EyeCatchService** - Create image prompts and suggestions
3. **ArticleAnalysisService** - Comprehensive article analysis

**Example Usage**:
```typescript
import { HashtagService } from '@/app/services/analysis/HashtagService';
import { createAIService } from '@/app/services/ai/AIServiceFactory';

const aiService = createAIService();
const hashtagService = new HashtagService(aiService);

const result = await hashtagService.generateHashtags({
  articleText: '記事の内容...',
  count: 20,
  options: {
    useCache: true,
    temperature: 0.7
  }
});

console.log(result.hashtags); // ['#AI', '#技術', ...]
console.log(`Cost: $${result.usage?.totalCost}`);
```

### Cache Service Layer

**Purpose**: Provide caching abstraction with multiple backends

**Implementations**:
- `MemoryCacheService` - In-memory (development, single instance)
- `RedisCacheService` - Redis (production, distributed) [Future]

**Example Usage**:
```typescript
import { CacheServiceFactory } from '@/app/services/cache/CacheServiceFactory';
import { generateCacheKey, hashObject } from '@/app/services/cache/CacheService.interface';

const cache = CacheServiceFactory.create('memory');

// Generate deterministic cache key
const params = { articleText: '...', count: 20 };
const key = generateCacheKey('hashtags', hashObject(params));

// Check cache
const cached = await cache.get(key);
if (cached) {
  return cached;
}

// Generate and cache result
const result = await hashtagService.generateHashtags(params);
await cache.set(key, result, { ttl: 1800 }); // 30 minutes

return result;
```

### Configuration Service

**Purpose**: Centralize and externalize configuration

**Key Files**:

1. **PromptTemplates.ts** - AI prompt templates
   - Easy A/B testing of prompts
   - Version tracking
   - Multi-language support

2. **ModelConfig.ts** - Model settings
   - Token limits and pricing
   - Task-specific recommendations
   - Cost estimation

**Example Usage**:
```typescript
import { getPromptTemplate } from '@/app/services/config/PromptTemplates';
import { getRecommendedModel } from '@/app/services/config/ModelConfig';

// Get prompt template
const prompt = getPromptTemplate('hashtag', 'DEFAULT_JA');
console.log(prompt.content);

// Get recommended model for task
const modelConfig = getRecommendedModel('hashtag-generation');
console.log(modelConfig.config.model); // 'claude-sonnet-4-20250514'
console.log(modelConfig.maxTokens);    // 500
console.log(modelConfig.temperature);   // 0.7
```

## API Route Pattern

API routes should be thin controllers that:
1. Validate input
2. Call service layer
3. Format response
4. Handle errors

**Example Refactored Route**:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { HashtagService } from '@/app/services/analysis/HashtagService';
import { createAIService } from '@/app/services/ai/AIServiceFactory';
import { AnalysisValidationError } from '@/app/services/analysis/types';

export async function POST(request: NextRequest) {
  try {
    // Parse request
    const { articleText } = await request.json();

    // Create services
    const aiService = createAIService();
    const hashtagService = new HashtagService(aiService);

    // Generate hashtags
    const result = await hashtagService.generateHashtags({
      articleText,
      count: 20,
      options: { useCache: true }
    });

    // Return response
    return NextResponse.json({
      hashtags: result.hashtags,
      usage: result.usage
    });

  } catch (error) {
    // Handle errors
    if (error instanceof AnalysisValidationError) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

## Error Handling

Structured error hierarchy:

```
Error
├── AIServiceError
│   ├── AIServiceConfigurationError
│   ├── AIServiceRateLimitError
│   └── AIServiceValidationError
├── AnalysisServiceError
│   ├── AnalysisValidationError
│   └── AnalysisParsingError
└── CacheServiceError
```

Each error includes:
- Descriptive message
- Service/provider name
- HTTP status code (where applicable)
- Original error (for debugging)

## Testing Strategy

### Unit Tests
- Mock AI services for testing analysis logic
- Test prompt generation
- Test result parsing
- Test validation logic

```typescript
const mockAI: IAIService = {
  provider: 'mock',
  generateCompletion: jest.fn().mockResolvedValue({
    content: '#Test1\n#Test2',
    usage: { inputTokens: 100, outputTokens: 50 }
  }),
  // ...
};

const service = new HashtagService(mockAI);
const result = await service.generateHashtags({ articleText: 'test' });
expect(result.hashtags).toHaveLength(2);
```

### Integration Tests
- Test actual AI provider interactions
- Test caching behavior
- Test error scenarios

### End-to-End Tests
- Test complete API flows
- Test rate limiting
- Test error responses

## Adding New Features

### Adding a New AI Provider

1. Create provider implementation:
```typescript
// app/services/ai/OpenAIService.ts
export class OpenAIService implements IAIService {
  readonly provider = 'openai';

  async generateCompletion(request: AICompletionRequest): Promise<AICompletionResponse> {
    // OpenAI implementation
  }

  // Implement other interface methods
}
```

2. Register in factory:
```typescript
// app/services/ai/AIServiceFactory.ts
AIServiceFactory.registerProvider('openai', () => new OpenAIService());
```

3. Use it:
```typescript
const service = AIServiceFactory.create('openai');
```

### Adding a New Analysis Type

1. Define types:
```typescript
// app/services/analysis/types.ts
export interface SummaryRequest extends BaseAnalysisRequest {
  maxLength?: number;
}

export interface SummaryResult {
  summary: string;
  wordCount: number;
}
```

2. Create service:
```typescript
// app/services/analysis/SummaryService.ts
export class SummaryService extends BaseAnalysisService {
  protected readonly serviceName = 'SummaryService';

  async generateSummary(request: SummaryRequest): Promise<SummaryResult> {
    // Implementation using this.aiService
  }
}
```

3. Create API route:
```typescript
// app/api/generate-summary/route.ts
export async function POST(request: NextRequest) {
  const aiService = createAIService();
  const summaryService = new SummaryService(aiService);
  // ...
}
```

### Adding Prompt Variants for A/B Testing

1. Add new prompt:
```typescript
// app/services/config/PromptTemplates.ts
export const HASHTAG_PROMPTS = {
  // ...existing prompts

  VIRAL_FOCUSED_JA: {
    version: '1.0',
    language: 'ja',
    content: `バイラル性を重視したハッシュタグ生成プロンプト...`,
    tags: ['hashtag', 'viral', 'japanese'],
  },
};
```

2. Use variant:
```typescript
const prompt = getPromptTemplate('hashtag', 'VIRAL_FOCUSED_JA');
```

3. A/B test:
```typescript
const variant = Math.random() < 0.5 ? 'DEFAULT_JA' : 'VIRAL_FOCUSED_JA';
const prompt = getPromptTemplate('hashtag', variant);
// Track which variant performed better
```

## Environment Variables

```bash
# AI Provider
ANTHROPIC_API_KEY=sk-ant-...
DEFAULT_AI_PROVIDER=anthropic
DEFAULT_AI_MODEL=claude-sonnet-4-20250514

# Cache
CACHE_PROVIDER=memory          # or 'redis'
CACHE_TTL_SECONDS=1800
REDIS_URL=redis://localhost:6379  # if using Redis

# Rate Limiting
API_RATE_LIMIT_MAX_REQUESTS=10
API_RATE_LIMIT_WINDOW_MS=60000
ENABLE_REQUEST_DEDUPLICATION=true

# Features
ENABLE_CACHING=true
ENABLE_COST_TRACKING=true
```

## Migration Guide

To migrate existing code to the new architecture:

1. **Replace direct Anthropic calls**:
```typescript
// Before
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const message = await anthropic.messages.create({ ... });

// After
const aiService = createAIService();
const response = await aiService.generateCompletion({ ... });
```

2. **Extract business logic to services**:
```typescript
// Before: Logic in route
export async function POST(request: NextRequest) {
  const { articleText } = await request.json();
  // ... lots of logic here
}

// After: Logic in service
export async function POST(request: NextRequest) {
  const { articleText } = await request.json();
  const service = new HashtagService(createAIService());
  const result = await service.generateHashtags({ articleText });
  return NextResponse.json(result);
}
```

3. **Use configuration files**:
```typescript
// Before: Hardcoded prompts
const systemPrompt = "あなたは...";

// After: Externalized prompts
const prompt = getPromptTemplate('hashtag', 'DEFAULT_JA');
const systemPrompt = prompt.content;
```

## Performance Considerations

1. **Prompt Caching**: Enabled by default, reduces costs by 90% on repeated calls
2. **Response Caching**: Cache analysis results for 30 minutes
3. **Connection Pooling**: Reuse AI service instances
4. **Batch Processing**: Future feature for processing multiple articles

## Security Considerations

1. **API Key Management**: Never expose keys, use environment variables
2. **Input Validation**: All requests validated before processing
3. **Rate Limiting**: Prevent abuse with configurable rate limits
4. **Error Messages**: Don't leak sensitive information in errors

## Monitoring and Observability

1. **Token Usage Tracking**: All AI calls log token usage
2. **Cost Tracking**: Calculate and log costs per request
3. **Cache Hit Rate**: Monitor cache effectiveness
4. **Error Rates**: Track error types and frequencies

```typescript
// Usage is automatically logged
console.log('[HashtagService] Token usage:', {
  input_tokens: 1000,
  output_tokens: 150,
  cache_read_tokens: 900,
  total_cost: '$0.0042'
});
```

## Future Enhancements

1. **Redis Cache**: Distributed caching for multi-instance deployments
2. **OpenAI Integration**: Add GPT-4 support
3. **Google AI Integration**: Add Gemini support
4. **Batch Processing**: Process multiple articles efficiently
5. **Streaming Responses**: Stream results for better UX
6. **Advanced Analytics**: Track which prompts perform best
7. **Multi-language Support**: Expand beyond Japanese and English

## Conclusion

This architecture provides:
- ✅ **Extensibility**: Easy to add new AI providers or analysis types
- ✅ **Maintainability**: Clear separation of concerns
- ✅ **Testability**: Services can be easily mocked
- ✅ **Scalability**: Ready for distributed deployment
- ✅ **Cost Optimization**: Built-in caching and cost tracking
- ✅ **Type Safety**: Comprehensive TypeScript types

For questions or contributions, refer to the inline documentation in each service file.
