# Prompt System Quick Reference

One-page reference for the most common operations.

## Import

```typescript
import { quickStart } from '@/app/prompts';
// or
import { getPromptRegistry, PromptBuilder } from '@/app/prompts';
```

## Basic Usage (Quick Start)

```typescript
// Hashtags
const hashtagPrompt = quickStart.buildPrompt('hashtag', {
  articleText: 'Your article...'
});

// Eye-catch
const eyecatchPrompt = quickStart.buildPrompt('eyecatch', {
  articleText: 'Your article...'
});

// Full analysis
const analysisPrompt = quickStart.buildPrompt('analysis', {
  articleText: 'Your article...'
});

// Titles
const titlesPrompt = quickStart.buildPrompt('titles', {
  articleText: 'Your article...'
});

// Use with Anthropic
const message = await anthropic.messages.create({
  model: 'claude-sonnet-4-20250514',
  ...prompt  // Spread includes all needed fields
});
```

## Version Selection

```typescript
// Production stable (v1)
const v1Prompt = quickStart.buildPrompt('hashtag',
  { articleText: '...' },
  { version: 'v1' }
);

// Experimental (v2)
const v2Prompt = quickStart.buildPrompt('hashtag',
  { articleText: '...' },
  { version: 'v2' }
);
```

## Language Selection

```typescript
// Japanese (default)
const jaPrompt = quickStart.buildPrompt('hashtag',
  { articleText: '...' },
  { language: 'ja' }
);

// English
const enPrompt = quickStart.buildPrompt('hashtag',
  { articleText: '...' },
  { language: 'en' }
);
```

## Advanced Usage

```typescript
import { getPromptRegistry, PromptBuilder } from '@/app/prompts';

const registry = getPromptRegistry();
const builder = new PromptBuilder();

// Get template
const template = registry.get('hashtag', {
  version: 'v1',
  language: 'ja'
});

// Build prompt
const prompt = builder.build(template, {
  articleText: 'Content...'
});

// Preview (debug)
const preview = builder.preview(template, {
  articleText: 'Content...'
});
console.log(preview.system);
console.log(preview.user);
console.log(preview.metadata);
```

## Validation

```typescript
import { validatePrompt, formatValidationResult } from '@/app/prompts';

const registry = getPromptRegistry();
const template = registry.get('hashtag');

const result = validatePrompt(template);
if (!result.valid) {
  console.error(formatValidationResult(result));
}
```

## Token Estimation

```typescript
import { estimateTokens, estimateCost, formatCost } from '@/app/prompts';

const tokens = estimateTokens('Your text...');
const cost = estimateCost(450, 500, true); // input, output, cached

console.log(`Tokens: ${tokens}`);
console.log(`Cost: ${formatCost(cost)}`);
```

## A/B Testing

```typescript
import { createExperimentManager } from '@/app/prompts';
import { hashtagPrompts } from '@/app/prompts';

const manager = createExperimentManager();

// Create experiment
manager.createExperiment({
  id: 'hashtag-test',
  name: 'V1 vs V2',
  description: 'Test categorized hashtags',
  category: 'hashtag',
  active: true,
  variants: [
    {
      id: 'control',
      prompt: hashtagPrompts.v1.ja,
      trafficPercentage: 50,
      active: true
    },
    {
      id: 'test',
      prompt: hashtagPrompts.v2.ja,
      trafficPercentage: 50,
      active: true
    }
  ]
});

// Select variant (consistent per user)
const variant = manager.selectVariant('hashtag-test', userId);
const prompt = builder.build(variant.prompt, { articleText });
```

## Performance Tracking

```typescript
import { getPromptRegistry } from '@/app/prompts';

const registry = getPromptRegistry();

// Update metrics after API call
registry.updatePerformance('hashtag-generation-v1-ja', {
  avgInputTokens: message.usage.input_tokens,
  avgOutputTokens: message.usage.output_tokens,
  successRate: 0.98,
  usageCount: 1
});

// Get metrics
const perf = registry.getPerformance('hashtag-generation-v1-ja');
console.log(`Success rate: ${perf.successRate * 100}%`);
```

## Registry Management

```typescript
const registry = getPromptRegistry();

// List all prompts
const all = registry.listAll();

// List by category
const hashtagPrompts = registry.listByCategory('hashtag');

// List by version
const v2Prompts = registry.listByVersion('v2');

// Get statistics
const stats = registry.getStats();
console.log(`Total prompts: ${stats.total}`);
console.log(`With caching: ${stats.withCaching}`);
```

## Custom Prompts

```typescript
import type { PromptTemplate } from '@/app/prompts';

const myPrompt: PromptTemplate = {
  id: 'my-prompt-v1-ja',
  version: 'v1',
  language: 'ja',
  category: 'analysis',
  systemPrompt: 'You are an expert...',
  userPromptTemplate: 'Analyze: {{input}}',
  variables: ['input'],
  metadata: {
    author: 'Me',
    createdAt: new Date().toISOString(),
    description: 'My custom prompt'
  },
  caching: { enabled: true, ttl: 300 },
  maxTokens: 1000,
  temperature: 0.7
};

// Register
registry.registerTemplate(myPrompt);

// Use
const prompt = builder.build(myPrompt, { input: 'data' });
```

## Configuration

```typescript
// app/prompts/prompt.config.ts
export const promptConfig = {
  defaultVersion: 'v1',
  defaultLanguage: 'ja',
  enableExperiments: false,
  cachingEnabled: true,
  validationEnabled: true,
  performanceTracking: true,
  loggingEnabled: false
};
```

## Available Templates

### Hashtag Prompts
- `hashtag-generation-v1-ja` - Simple list (production)
- `hashtag-generation-v1-en` - English variant
- `hashtag-generation-v2-ja` - Categorized (experimental)
- `hashtag-generation-v2-json` - JSON output

### Eye-catch Prompts
- `eyecatch-generation-v1-ja` - Structured output (production)
- `eyecatch-generation-v2-json` - With color palette
- `eyecatch-generation-v2-multistyle` - Multiple styles

### Analysis Prompts
- `analysis-full-v1-ja` - Comprehensive (production)
- `analysis-light-v2-ja` - Lightweight/fast
- `analysis-seo-v2-ja` - SEO-focused

### Title Prompts
- `titles-generation-v1-ja` - Standard (production)
- `titles-generation-v2-json` - With scoring
- `titles-generation-v2-abtest` - A/B testing optimized

## Common Patterns

### Error Handling
```typescript
try {
  const prompt = quickStart.buildPrompt('hashtag', { articleText });
  const message = await anthropic.messages.create({ ...prompt });
} catch (error) {
  console.error('Prompt build failed:', error);
  // Fallback to default prompt
}
```

### Cost Estimation Before Call
```typescript
import { estimateCost, formatCost } from '@/app/prompts';

const preview = quickStart.previewPrompt('analysis', { articleText });
const estimatedCost = estimateCost(
  preview.metadata.estimatedInputTokens,
  preview.metadata.estimatedOutputTokens,
  true  // cached
);

if (estimatedCost > 0.01) {
  console.warn('High cost estimated:', formatCost(estimatedCost));
}
```

### Batch Processing
```typescript
const articles = ['Article 1...', 'Article 2...', 'Article 3...'];

const results = await Promise.all(
  articles.map(async (articleText) => {
    const prompt = quickStart.buildPrompt('hashtag', { articleText });
    return anthropic.messages.create({ ...prompt });
  })
);
```

## Tips

1. **Always use caching** - 90% cost savings
2. **Validate in dev** - Catch errors early
3. **Track performance** - Optimize over time
4. **Use v1 in production** - Stable and tested
5. **Test v2 with experiments** - Before promoting to production

## Troubleshooting

```typescript
// Check if prompt exists
try {
  const template = registry.get('hashtag');
} catch (error) {
  console.error('Prompt not found');
}

// Validate structure
const result = validatePrompt(template);
if (!result.valid) {
  console.error('Invalid:', result.errors);
}

// Check token budget
import { isWithinBudget } from '@/app/prompts';
const check = isWithinBudget(text, 1000);
if (!check.withinBudget) {
  console.warn('Exceeds budget by', -check.remaining, 'tokens');
}
```

## Documentation

- Full docs: `app/prompts/README.md`
- Examples: `app/prompts/EXAMPLES.md`
- Migration: `app/prompts/MIGRATION_EXAMPLE.md`
- Implementation: `PROMPT_SYSTEM_IMPLEMENTATION.md`
