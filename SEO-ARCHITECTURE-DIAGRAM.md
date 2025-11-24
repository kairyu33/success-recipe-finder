# SEO Feature Architecture Diagram

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        User Interface                            │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │         AnalysisResults Component (React)                 │   │
│  │  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────────────────┐    │   │
│  │  │Title│ │Insig│ │Image│ │Hash │ │   SEO Tab       │    │   │
│  │  │ Tab │ │ Tab │ │ Tab │ │ Tab │ │  (NEW FEATURE)  │    │   │
│  │  └─────┘ └─────┘ └─────┘ └─────┘ └─────────────────┘    │   │
│  └──────────────────────────────────────────────────────────┘   │
└──────────────────────┬───────────────────────────────────────────┘
                       │
                       │ HTTP POST /api/seo-analysis
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API Layer (Next.js)                         │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  /api/seo-analysis/route.ts                              │   │
│  │  ┌────────────────────────────────────────────────────┐  │   │
│  │  │ 1. Validate Request                                 │  │   │
│  │  │    - Article text (50-50k chars)                   │  │   │
│  │  │    - Title (optional)                              │  │   │
│  │  │    - Target keyword (optional)                     │  │   │
│  │  └────────────────────────────────────────────────────┘  │   │
│  │  ┌────────────────────────────────────────────────────┐  │   │
│  │  │ 2. Create Services                                  │  │   │
│  │  │    - AIService (via Factory)                       │  │   │
│  │  │    - SEOService (Dependency Injection)             │  │   │
│  │  └────────────────────────────────────────────────────┘  │   │
│  │  ┌────────────────────────────────────────────────────┐  │   │
│  │  │ 3. Execute Analysis                                 │  │   │
│  │  │    - await seoService.analyzeSEO()                 │  │   │
│  │  └────────────────────────────────────────────────────┘  │   │
│  │  ┌────────────────────────────────────────────────────┐  │   │
│  │  │ 4. Format Response                                  │  │   │
│  │  │    - Success/error handling                        │  │   │
│  │  │    - Add metadata (timing, cost)                   │  │   │
│  │  └────────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────────┘   │
└──────────────────────┬───────────────────────────────────────────┘
                       │
                       │ Create and inject dependencies
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Service Layer (Business Logic)                │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  SEOService                                              │   │
│  │  (app/services/analysis/SEOService.ts)                  │   │
│  │                                                          │   │
│  │  analyzeSEO(request) {                                  │   │
│  │    ┌────────────────────────────────────────────────┐   │   │
│  │    │ 1. Local Analysis (No AI)                      │   │   │
│  │    │    • analyzeStructure()                        │   │   │
│  │    │      - Word/character count                    │   │   │
│  │    │      - Paragraph/heading count                 │   │   │
│  │    │      - Reading time estimation                 │   │   │
│  │    │    • calculateReadability()                    │   │   │
│  │    │      - Sentence length                         │   │   │
│  │    │      - Paragraph length                        │   │   │
│  │    │      - Kanji ratio (Japanese)                  │   │   │
│  │    └────────────────────────────────────────────────┘   │   │
│  │    ┌────────────────────────────────────────────────┐   │   │
│  │    │ 2. Get Prompt Template                         │   │   │
│  │    │    • getPromptTemplate('seo', 'DEFAULT_JA')    │   │   │
│  │    │    • Build user prompt with context            │   │   │
│  │    └────────────────────────────────────────────────┘   │   │
│  │    ┌────────────────────────────────────────────────┐   │   │
│  │    │ 3. AI Analysis (via AnthropicService)          │   │   │
│  │    │    • Keywords extraction                       │   │   │
│  │    │    • Meta description generation               │   │   │
│  │    │    • Improvements identification               │   │   │
│  │    │    • Image/linking suggestions                 │   │   │
│  │    └────────────────────────────────────────────────┘   │   │
│  │    ┌────────────────────────────────────────────────┐   │   │
│  │    │ 4. Combine Results                             │   │   │
│  │    │    • Calculate SEO score (0-100)               │   │   │
│  │    │    • Assign grade (A/B/C/D/F)                  │   │   │
│  │    │    • Generate optimized slug                   │   │   │
│  │    │    • Merge AI + local analysis                 │   │   │
│  │    └────────────────────────────────────────────────┘   │   │
│  │    ┌────────────────────────────────────────────────┐   │   │
│  │    │ 5. Return SEOAnalysisResult                    │   │   │
│  │    │    • score, grade, metaDescription             │   │   │
│  │    │    • keywords, readability, structure          │   │   │
│  │    │    • improvements, usage stats                 │   │   │
│  │    └────────────────────────────────────────────────┘   │   │
│  │  }                                                       │   │
│  └──────────────────────────────────────────────────────────┘   │
└──────────────────────┬───────────────────────────────────────────┘
                       │
                       │ AI completion request
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                    AI Service Layer (Provider)                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  AnthropicService                                        │   │
│  │  (app/services/ai/AnthropicService.ts)                  │   │
│  │                                                          │   │
│  │  generateCompletion(request) {                          │   │
│  │    ┌────────────────────────────────────────────────┐   │   │
│  │    │ 1. Format Request                              │   │   │
│  │    │    • System prompt (with cache control)        │   │   │
│  │    │    • User message                              │   │   │
│  │    │    • Model config (temperature, maxTokens)     │   │   │
│  │    └────────────────────────────────────────────────┘   │   │
│  │    ┌────────────────────────────────────────────────┐   │   │
│  │    │ 2. Call Anthropic API                          │   │   │
│  │    │    • Model: claude-sonnet-4-20250514           │   │   │
│  │    │    • Temperature: 0.3 (consistent)             │   │   │
│  │    │    • Max tokens: 2000                          │   │   │
│  │    │    • Prompt caching: enabled                   │   │   │
│  │    └────────────────────────────────────────────────┘   │   │
│  │    ┌────────────────────────────────────────────────┐   │   │
│  │    │ 3. Parse Response                              │   │   │
│  │    │    • Extract content                           │   │   │
│  │    │    • Calculate token usage                     │   │   │
│  │    │    • Calculate cost                            │   │   │
│  │    └────────────────────────────────────────────────┘   │   │
│  │    ┌────────────────────────────────────────────────┐   │   │
│  │    │ 4. Return AICompletionResponse                 │   │   │
│  │    └────────────────────────────────────────────────┘   │   │
│  │  }                                                       │   │
│  └──────────────────────────────────────────────────────────┘   │
└──────────────────────┬───────────────────────────────────────────┘
                       │
                       │ API call
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                  External API (Anthropic Claude)                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Claude Sonnet 4.5                                       │   │
│  │  • SEO expert persona                                    │   │
│  │  • JSON output generation                               │   │
│  │  • Keyword extraction & analysis                        │   │
│  │  • Meta description optimization                        │   │
│  │  • Improvement recommendations                          │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## Component Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         SEOTab Component                         │
│                  (app/components/features/                       │
│                   AnalysisResults/SEOTab.tsx)                    │
├─────────────────────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  SEOScoreCard                                             │  │
│  │  ┌─────────────────────┐  ┌───────────────────────────┐  │  │
│  │  │ Circular Progress   │  │  Grade & Description      │  │  │
│  │  │ • Animated ring     │  │  • Letter grade (A-F)     │  │  │
│  │  │ • Color coded       │  │  • Color coded badge      │  │  │
│  │  │ • Score display     │  │  • Interpretation text    │  │  │
│  │  └─────────────────────┘  └───────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  MetaDescriptionCard                                      │  │
│  │  • Optimized meta description (150-160 chars)             │  │
│  │  • Character count indicator                              │  │
│  │  • Copy to clipboard button                               │  │
│  │  • Search result preview                                  │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  ImprovementsSection                                      │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │ Critical (Red Badge)                                │  │  │
│  │  │ • Must fix issues                                   │  │  │
│  │  │ • Warning icons                                     │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │ Important (Yellow Badge)                            │  │  │
│  │  │ • Should fix issues                                 │  │  │
│  │  │ • Info icons                                        │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │ Optional (Blue Badge)                               │  │  │
│  │  │ • Nice to have                                      │  │  │
│  │  │ • Check icons                                       │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  KeywordsSection                                          │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │ Primary Keywords (Blue badges)                      │  │  │
│  │  │ • Click to copy                                     │  │  │
│  │  │ • Density percentage                                │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │ Secondary Keywords (Green badges)                   │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │ Long-tail Keywords (Purple badges)                  │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  ReadabilityStructureSection (2-column grid)              │  │
│  │  ┌────────────────────┐  ┌───────────────────────────┐   │  │
│  │  │ Readability        │  │ Content Structure         │   │  │
│  │  │ • Score (0-100)    │  │ • Character count         │   │  │
│  │  │ • Level            │  │ • Paragraph count         │   │  │
│  │  │ • Avg sentence     │  │ • Heading count           │   │  │
│  │  │ • Kanji ratio      │  │ • Reading time            │   │  │
│  │  └────────────────────┘  └───────────────────────────┘   │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Technical Details (Tabbed)                               │  │
│  │  • Optimized URL slug                                     │  │
│  │  • Image optimization suggestions                         │  │
│  │  • Internal linking opportunities                         │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagram

```
User Input
    │
    ├─> Article Text (required, 50-50k chars)
    ├─> Title (optional)
    ├─> Target Keyword (optional)
    └─> Options (cache, temperature, model)
    │
    ▼
Validation Layer
    │
    ├─> Check required fields
    ├─> Validate text length
    ├─> Validate title length (if provided)
    └─> Validate keyword length (if provided)
    │
    ▼
Service Creation
    │
    ├─> AIServiceFactory.create()
    │   └─> AnthropicService instance
    │
    └─> new SEOService(aiService)
    │
    ▼
SEO Analysis Process
    │
    ├─> Local Analysis (Fast, No AI)
    │   ├─> analyzeStructure()
    │   │   ├─> Count words/characters
    │   │   ├─> Count paragraphs/headings
    │   │   └─> Estimate reading time
    │   │
    │   └─> calculateReadability()
    │       ├─> Sentence length
    │       ├─> Paragraph length
    │       └─> Kanji ratio (Japanese)
    │
    ├─> AI Analysis (Slow, Uses API)
    │   ├─> Get prompt template
    │   ├─> Build context
    │   ├─> Call Anthropic API
    │   └─> Parse JSON response
    │       ├─> Keywords (primary, secondary, long-tail)
    │       ├─> Meta description
    │       ├─> Improvements (critical, important, optional)
    │       ├─> Image optimization
    │       └─> Internal linking
    │
    └─> Combine & Score
        ├─> Calculate SEO score (0-100)
        │   ├─> Content length (20 points)
        │   ├─> Readability (20 points)
        │   ├─> Meta description (15 points)
        │   ├─> Title (15 points)
        │   ├─> Structure (15 points)
        │   └─> Keywords (15 points)
        │
        ├─> Assign grade (A/B/C/D/F)
        ├─> Generate URL slug
        └─> Merge all results
    │
    ▼
Response
    │
    ├─> Success Response (200)
    │   ├─> SEOAnalysisResult
    │   ├─> Usage statistics
    │   └─> Processing metadata
    │
    └─> Error Response (400/500)
        ├─> Error type
        ├─> Error message
        └─> Service name
```

## Configuration & Dependencies

```
┌─────────────────────────────────────────────────────────────────┐
│                      Configuration Layer                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐     │
│  │  seo.config.ts                                         │     │
│  │  • Feature flags                                       │     │
│  │  • Threshold settings                                  │     │
│  │  • Validation rules                                    │     │
│  │  • Helper functions                                    │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐     │
│  │  PromptTemplates.ts                                    │     │
│  │  • SEO_PROMPTS.DEFAULT_JA                             │     │
│  │  • SEO_PROMPTS.DEFAULT_EN                             │     │
│  │  • SEO_PROMPTS.ADVANCED_JA                            │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐     │
│  │  ModelConfig.ts                                        │     │
│  │  • Model settings                                      │     │
│  │  • Token limits                                        │     │
│  │  • Pricing information                                 │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                        Type Definitions                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  SEOAnalysisRequest                                             │
│  SEOAnalysisResult                                              │
│  KeywordAnalysis                                                │
│  ReadabilityMetrics                                             │
│  ContentStructure                                               │
│  SEOImprovements                                                │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Token Flow & Caching

```
First Request (No Cache)
─────────────────────────────────────────────────────────
Input:  [Article Text] + [SEO System Prompt]
        │                         │
        │                         └─> Cached ✓
        │
        ├─> Input tokens:    ~1000 ($0.003)
        └─> Output tokens:   ~800  ($0.012)
                                    ──────────
                            Total:  $0.015

Cache Creation: 1000 tokens written to cache

Subsequent Requests (With Cache) - SAME ARTICLE
─────────────────────────────────────────────────────────
Input:  [Article Text] + [SEO System Prompt]
        │                         │
        │                         └─> Read from cache ✓ ($0.00015)
        │
        ├─> Cache read:      ~900  ($0.00015)
        ├─> New input:       ~100  ($0.0003)
        └─> Output tokens:   ~800  ($0.012)
                                    ──────────
                            Total:  $0.001 (93% savings!)

Response Caching: Additional 30-minute TTL
─────────────────────────────────────────────────────────
Same request within 30 minutes:
        └─> Instant response, $0.00 cost
```

## Error Handling Flow

```
Request
    │
    ▼
Try-Catch Block
    │
    ├─> AnalysisValidationError (400)
    │   • Invalid article text
    │   • Invalid title/keyword length
    │   • Missing required fields
    │
    ├─> AnalysisServiceError (500)
    │   • Parsing failed
    │   • AI response invalid
    │   • Service unavailable
    │
    ├─> AIServiceError (500)
    │   • API key missing
    │   • Rate limit exceeded
    │   • Network error
    │
    └─> Unexpected Error (500)
        • Unknown errors
        • Log for debugging
```

## Performance Characteristics

```
┌─────────────────────────────────────────────────────────────────┐
│                      Performance Metrics                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Processing Time:                                               │
│  ├─> Local analysis:     ~50-100ms                             │
│  ├─> AI analysis:        ~2-4 seconds                          │
│  └─> Total:              ~2-4 seconds                          │
│                                                                  │
│  Token Usage:                                                   │
│  ├─> Input (no cache):   ~1000-1500 tokens                     │
│  ├─> Input (with cache): ~100-200 tokens                       │
│  ├─> Output:             ~800 tokens                           │
│  └─> Total:              ~1300-2300 tokens                      │
│                                                                  │
│  Cost Per Request:                                              │
│  ├─> First request:      ~$0.003-0.007                         │
│  ├─> Cached request:     ~$0.001 (90% savings)                 │
│  └─> Response cached:    $0.00 (within 30min)                  │
│                                                                  │
│  Scalability:                                                   │
│  ├─> Concurrent users:   Limited by API rate                   │
│  ├─> Cache hit rate:     ~70-80% expected                      │
│  └─> Response time P95:  <5 seconds                            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

This architecture provides a solid foundation for SEO analysis while maintaining:
- **Separation of concerns** (UI, API, Service, AI layers)
- **Dependency injection** (testable, maintainable)
- **Performance optimization** (local + AI analysis, caching)
- **Cost efficiency** (prompt caching, response caching)
- **Scalability** (stateless services, horizontal scaling ready)
