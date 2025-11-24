# Prompt Management System

> Extensible, version-controlled prompt management for note-hashtag-ai-generator

## Overview

This system externalizes all AI prompts from code, making them:
- **Easily customizable** - Edit prompts without touching code
- **Version controlled** - Test new prompts while keeping stable versions
- **Testable** - Validate prompts before deployment
- **Multi-language** - Support Japanese and English
- **A/B testable** - Run experiments to find optimal prompts
- **Cost optimized** - Built-in caching and token estimation

## Quick Start

### Basic Usage

```typescript
import { getPromptRegistry, PromptBuilder } from '@/app/prompts';

// 1. Get a prompt template
const registry = getPromptRegistry();
const template = registry.get('hashtag', {
  version: 'v1',
  language: 'ja'
});

// 2. Build prompt with variables
const builder = new PromptBuilder();
const prompt = builder.build(template, {
  articleText: 'My article content...'
});

// 3. Use with Anthropic API
const message = await anthropic.messages.create({
  model: 'claude-sonnet-4-20250514',
  max_tokens: prompt.max_tokens,
  temperature: prompt.temperature,
  system: prompt.system,
  messages: prompt.messages
});
```

### Even Simpler with Quick Start Helper

```typescript
import { quickStart } from '@/app/prompts';

// Get and build in one call
const prompt = quickStart.buildPrompt('hashtag', {
  articleText: 'My article content...'
});
```

## Directory Structure

```
app/prompts/
├── types.ts                    # TypeScript types
├── PromptBuilder.ts           # Builds prompts from templates
├── PromptRegistry.ts          # Central prompt registry
├── prompt.config.ts           # Configuration
├── index.ts                   # Public API
├── templates/
│   ├── hashtag.prompts.ts    # Hashtag generation prompts
│   ├── eyecatch.prompts.ts   # Eye-catch image prompts
│   ├── analysis.prompts.ts   # Article analysis prompts
│   └── titles.prompts.ts     # Title generation prompts
├── validation/
│   ├── validatePrompt.ts     # Prompt validation
│   └── estimateTokens.ts     # Token estimation
└── experiments/
    └── ExperimentManager.ts  # A/B testing
```

## Features

### 1. Version Management

Different versions for production and experimentation:

```typescript
// Use production-stable v1
const v1 = registry.get('hashtag', { version: 'v1' });

// Try experimental v2
const v2 = registry.get('hashtag', { version: 'v2' });
```

### 2. Multi-Language Support

```typescript
// Japanese (default)
const ja = registry.get('hashtag', { language: 'ja' });

// English
const en = registry.get('hashtag', { language: 'en' });
```

### 3. Prompt Validation

```typescript
import { validatePrompt, formatValidationResult } from '@/app/prompts';

const template = registry.get('hashtag');
const result = validatePrompt(template);

if (!result.valid) {
  console.error('Validation failed:', result.errors);
}

console.log(formatValidationResult(result));
```

### 4. Token Estimation

```typescript
import { estimateTokens, estimateCost } from '@/app/prompts';

const tokens = estimateTokens('Your prompt text here');
const cost = estimateCost(tokens, 500, false); // input, output, cached

console.log(`Estimated: ${tokens} tokens, $${cost.toFixed(4)}`);
```

### 5. A/B Testing

```typescript
import { createExperimentManager } from '@/app/prompts';

const manager = createExperimentManager();

// Create experiment
manager.createExperiment({
  id: 'hashtag-v1-vs-v2',
  name: 'Hashtag Generation: V1 vs V2',
  description: 'Test categorized hashtags vs simple list',
  category: 'hashtag',
  active: true,
  variants: [
    {
      id: 'control',
      prompt: hashtagV1,
      trafficPercentage: 50,
      active: true
    },
    {
      id: 'variant-a',
      prompt: hashtagV2,
      trafficPercentage: 50,
      active: true
    }
  ],
  startDate: new Date().toISOString()
});

// Select variant for user (consistent hashing)
const variant = manager.selectVariant('hashtag-v1-vs-v2', userId);
const prompt = builder.build(variant.prompt, variables);
```

### 6. Performance Tracking

```typescript
// Update performance metrics
registry.updatePerformance('hashtag-generation-v1-ja', {
  avgInputTokens: 450,
  avgOutputTokens: 120,
  successRate: 0.98,
  qualityScore: 4.5,
  usageCount: 1250
});

// Get performance data
const perf = registry.getPerformance('hashtag-generation-v1-ja');
console.log(`Success rate: ${perf.successRate * 100}%`);
```

## Creating New Prompts

### 1. Define Template

```typescript
// app/prompts/templates/myfeature.prompts.ts
import type { PromptTemplate } from '../types';

export const myFeatureV1: PromptTemplate = {
  id: 'myfeature-v1-ja',
  version: 'v1',
  language: 'ja',
  category: 'myfeature', // Add to PromptCategory type
  systemPrompt: `You are an expert at...`,
  userPromptTemplate: `Process this: {{input}}`,
  variables: ['input'],
  metadata: {
    author: 'Your Name',
    createdAt: new Date().toISOString(),
    description: 'What this prompt does'
  },
  caching: {
    enabled: true,
    ttl: 300
  },
  maxTokens: 1000,
  temperature: 0.7
};
```

### 2. Register in Registry

```typescript
// app/prompts/PromptRegistry.ts (in loadTemplates method)
import { myFeatureV1 } from './templates/myfeature.prompts';

private loadTemplates(): void {
  // ... existing templates ...
  this.registerTemplate(myFeatureV1);
}
```

### 3. Export in Index

```typescript
// app/prompts/index.ts
export { myFeatureV1 } from './templates/myfeature.prompts';
```

## Migrating Existing API Routes

### Before

```typescript
// app/api/generate-hashtags/route.ts
const message = await anthropic.messages.create({
  model: "claude-sonnet-4-20250514",
  max_tokens: 500,
  system: [
    {
      type: "text",
      text: `あなたはハッシュタグ生成エキスパートです...`,
      cache_control: { type: "ephemeral" }
    }
  ],
  messages: [
    {
      role: "user",
      content: `記事テキスト：\n${articleText}\n\n20個のハッシュタグを生成してください。`
    }
  ]
});
```

### After

```typescript
// app/api/generate-hashtags/route.ts
import { getPromptRegistry, PromptBuilder } from '@/app/prompts';

const registry = getPromptRegistry();
const builder = new PromptBuilder();

const template = registry.get('hashtag');
const prompt = builder.build(template, { articleText });

const message = await anthropic.messages.create({
  model: "claude-sonnet-4-20250514",
  ...prompt
});
```

### Benefits
- Prompts are externalized and versioned
- Easy to test different versions
- Automatic validation and token estimation
- Reusable across multiple routes
- Centralized performance tracking

## Configuration

### `app/prompts/prompt.config.ts`

```typescript
export const promptConfig: RegistryConfig = {
  defaultVersion: 'v1',        // Default to stable v1
  defaultLanguage: 'ja',       // Japanese for note.com
  enableExperiments: false,    // Disable A/B testing in prod
  cachingEnabled: true,        // Enable 90% cost savings
  validationEnabled: true,     // Validate before use
  performanceTracking: true,   // Track metrics
  loggingEnabled: false        // Disable in production
};
```

## Testing

### Unit Tests

```typescript
import { validatePrompt, PromptBuilder } from '@/app/prompts';

describe('PromptBuilder', () => {
  it('should inject variables correctly', () => {
    const template = {
      // ... template definition
      userPromptTemplate: 'Process {{input}} with {{count}} items'
    };

    const builder = new PromptBuilder();
    const result = builder.injectVariables(
      template.userPromptTemplate,
      { input: 'data', count: 5 }
    );

    expect(result).toBe('Process data with 5 items');
  });
});
```

### Integration Tests

```typescript
import { quickStart } from '@/app/prompts';

describe('Hashtag Generation', () => {
  it('should generate valid prompt', () => {
    const prompt = quickStart.buildPrompt('hashtag', {
      articleText: 'Test article about AI'
    });

    expect(prompt.system).toBeDefined();
    expect(prompt.messages).toHaveLength(1);
    expect(prompt.max_tokens).toBeGreaterThan(0);
  });
});
```

## Best Practices

### 1. Always Use Caching

```typescript
caching: {
  enabled: true,
  ttl: 300  // 5 minutes
}
```

### 2. Provide Examples

```typescript
examples: [
  {
    description: 'Technology article',
    input: { articleText: '...' },
    expectedOutput: '#AI\n#Technology\n...',
    tags: ['technology']
  }
]
```

### 3. Validate Performance

```typescript
metadata: {
  performance: {
    avgInputTokens: 450,
    avgOutputTokens: 120,
    successRate: 0.98,
    qualityScore: 4.5,
    usageCount: 1250
  }
}
```

### 4. Version Carefully

- `v1`: Production-stable, well-tested
- `v2`: Experimental, being tested
- `v3`: Future development

### 5. Document Thoroughly

```typescript
metadata: {
  author: 'Your Name',
  description: 'Clear description of what this prompt does',
  tags: ['production', 'optimized', 'cached']
}
```

## Performance Optimization

### Token Reduction

```typescript
// Before: 1000 tokens
systemPrompt: `あなたはnote.com記事のハッシュタグ生成エキスパートです。
以下のルールに従って、読者の興味を引く魅力的なハッシュタグを20個生成してください。
各ハッシュタグは...`

// After: 450 tokens (55% reduction)
systemPrompt: `あなたはnote.com記事のハッシュタグ生成エキスパートです。
ルール：
1. 必ず「#」で始める
2. 日本語優先
3. note.comで検索されやすいタグ
...`
```

### Caching Benefits

```typescript
// First call: $0.0135
// Cached call: $0.00135 (90% savings)
const costRange = estimateCostRange(450, 500);
console.log(`Savings: ${costRange.savingsPercent}%`);
```

## Monitoring

### Registry Statistics

```typescript
const stats = registry.getStats();
console.log(`Total prompts: ${stats.total}`);
console.log(`By category:`, stats.byCategory);
console.log(`With caching: ${stats.withCaching}`);
```

### Performance Metrics

```typescript
const perf = registry.getPerformance('hashtag-generation-v1-ja');
console.log(`Success rate: ${perf.successRate * 100}%`);
console.log(`Avg tokens: ${perf.avgInputTokens + perf.avgOutputTokens}`);
console.log(`Usage count: ${perf.usageCount}`);
```

## Troubleshooting

### Prompt Not Found

```typescript
try {
  const template = registry.get('nonexistent');
} catch (error) {
  // Falls back to default if available
  // Otherwise throws error
}
```

### Validation Errors

```typescript
const result = validatePrompt(template);
if (!result.valid) {
  console.error('Errors:', result.errors);
  console.warn('Warnings:', result.warnings);
}
```

### Token Budget Exceeded

```typescript
const budget = isWithinBudget(text, 1000);
if (!budget.withinBudget) {
  const truncated = truncateToTokens(text, 1000);
  // Use truncated text
}
```

## Contributing

### Adding New Prompts

1. Create template file in `templates/`
2. Define prompt with all metadata
3. Register in `PromptRegistry.loadTemplates()`
4. Export in `index.ts`
5. Add tests
6. Update this README

### Adding New Categories

1. Add to `PromptCategory` type in `types.ts`
2. Create template file
3. Add default export
4. Update registry loading

## License

Part of note-hashtag-ai-generator project.
