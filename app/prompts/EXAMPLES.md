# Prompt System Examples

Practical examples for common use cases.

## Table of Contents

1. [Basic Usage](#basic-usage)
2. [Version Management](#version-management)
3. [Multi-Language](#multi-language)
4. [A/B Testing](#ab-testing)
5. [Validation](#validation)
6. [Performance Tracking](#performance-tracking)
7. [Custom Prompts](#custom-prompts)
8. [Token Estimation](#token-estimation)

---

## Basic Usage

### Simple Hashtag Generation

```typescript
import { quickStart } from '@/app/prompts';

// Simplest way - uses default version and language
const prompt = quickStart.buildPrompt('hashtag', {
  articleText: 'AIを使った効率的な仕事術について解説します。'
});

// Use with Anthropic API
const message = await anthropic.messages.create({
  model: 'claude-sonnet-4-20250514',
  ...prompt
});
```

### Full Article Analysis

```typescript
import { quickStart } from '@/app/prompts';

const prompt = quickStart.buildPrompt('analysis', {
  articleText: 'Your full article text here...'
});

const message = await anthropic.messages.create({
  model: 'claude-sonnet-4-20250514',
  ...prompt
});

// Parse JSON response
const response = JSON.parse(message.content[0].text);
console.log('Titles:', response.suggestedTitles);
console.log('Hashtags:', response.hashtags);
console.log('Insights:', response.insights);
```

### Eye-catch Image Generation

```typescript
import { quickStart } from '@/app/prompts';

const prompt = quickStart.buildPrompt('eyecatch', {
  articleText: 'デザインに関する記事...'
});

const message = await anthropic.messages.create({
  model: 'claude-sonnet-4-20250514',
  ...prompt
});
```

---

## Version Management

### Using Different Versions

```typescript
import { getPromptRegistry, PromptBuilder } from '@/app/prompts';

const registry = getPromptRegistry();
const builder = new PromptBuilder();

// Production version (v1)
const prodTemplate = registry.get('hashtag', { version: 'v1' });
const prodPrompt = builder.build(prodTemplate, { articleText });

// Experimental version (v2)
const expTemplate = registry.get('hashtag', { version: 'v2' });
const expPrompt = builder.build(expTemplate, { articleText });

// Compare versions
console.log('V1 uses:', prodTemplate.maxTokens, 'max tokens');
console.log('V2 uses:', expTemplate.maxTokens, 'max tokens');
```

### Quick Start with Versions

```typescript
import { quickStart } from '@/app/prompts';

// Try experimental version
const prompt = quickStart.buildPrompt('hashtag',
  { articleText: '...' },
  { version: 'v2' }
);
```

---

## Multi-Language

### Japanese (Default)

```typescript
import { quickStart } from '@/app/prompts';

const jaPrompt = quickStart.buildPrompt('hashtag', {
  articleText: '日本語の記事内容...'
});
```

### English

```typescript
import { quickStart } from '@/app/prompts';

const enPrompt = quickStart.buildPrompt('hashtag',
  { articleText: 'English article content...' },
  { language: 'en' }
);
```

### Dynamic Language Selection

```typescript
import { quickStart } from '@/app/prompts';

function generateHashtags(articleText: string, userLanguage: 'ja' | 'en') {
  const prompt = quickStart.buildPrompt('hashtag',
    { articleText },
    { language: userLanguage }
  );

  return anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    ...prompt
  });
}
```

---

## A/B Testing

### Setting Up an Experiment

```typescript
import { createExperimentManager } from '@/app/prompts';
import { hashtagPrompts } from '@/app/prompts';

const manager = createExperimentManager();

manager.createExperiment({
  id: 'hashtag-simple-vs-categorized',
  name: 'Simple List vs Categorized Hashtags',
  description: 'Test which format generates better engagement',
  category: 'hashtag',
  active: true,
  startDate: new Date().toISOString(),
  variants: [
    {
      id: 'control',
      prompt: hashtagPrompts.v1.ja,
      trafficPercentage: 50,
      active: true
    },
    {
      id: 'categorized',
      prompt: hashtagPrompts.v2.ja,
      trafficPercentage: 50,
      active: true
    }
  ],
  hypothesis: 'Categorized hashtags will improve click-through rate',
  successMetrics: ['engagement', 'clickRate', 'qualityScore']
});
```

### Using Experiment in Production

```typescript
import { createExperimentManager, PromptBuilder } from '@/app/prompts';

async function generateHashtagsWithExperiment(
  articleText: string,
  userId: string
) {
  const manager = createExperimentManager();
  const builder = new PromptBuilder();

  // Select variant based on user (consistent hashing)
  const variant = manager.selectVariant(
    'hashtag-simple-vs-categorized',
    userId
  );

  // Build prompt with selected variant
  const prompt = builder.build(variant.prompt, { articleText });

  // Track which variant was used
  console.log(`User ${userId} got variant: ${variant.id}`);

  return anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    ...prompt
  });
}
```

### Experiment Management

```typescript
import { createExperimentManager } from '@/app/prompts';

const manager = createExperimentManager();

// List all experiments
const experiments = manager.listExperiments();
console.log('Active experiments:', experiments.filter(e => e.active));

// Update traffic split (90/10 instead of 50/50)
manager.updateTraffic('hashtag-simple-vs-categorized', {
  control: 90,
  categorized: 10
});

// Deactivate experiment
manager.deactivate('hashtag-simple-vs-categorized');

// Delete experiment
manager.deleteExperiment('hashtag-simple-vs-categorized');
```

---

## Validation

### Validate Before Use

```typescript
import { validatePrompt, formatValidationResult } from '@/app/prompts';
import { getPromptRegistry } from '@/app/prompts';

const registry = getPromptRegistry();
const template = registry.get('hashtag');

const result = validatePrompt(template);

if (!result.valid) {
  console.error('Validation failed!');
  console.error(formatValidationResult(result));
} else {
  console.log('Prompt is valid!');
  if (result.warnings.length > 0) {
    console.warn('Warnings:', result.warnings);
  }
}
```

### Validate Custom Prompt

```typescript
import { validatePrompt } from '@/app/prompts';

const customPrompt = {
  id: 'my-custom-prompt',
  version: 'v1',
  language: 'ja',
  category: 'hashtag',
  systemPrompt: 'You are an expert...',
  userPromptTemplate: 'Process: {{input}}',
  variables: ['input'],
  metadata: {
    author: 'Me',
    createdAt: new Date().toISOString(),
    description: 'My custom prompt'
  }
};

const result = validatePrompt(customPrompt);
console.log(formatValidationResult(result));
```

### Validate All Prompts

```typescript
import { getPromptRegistry, validatePrompts } from '@/app/prompts';

const registry = getPromptRegistry();
const allPrompts = registry.listAll();
const results = validatePrompts(allPrompts);

// Check for issues
results.forEach((result, id) => {
  if (!result.valid) {
    console.error(`❌ ${id}: ${result.errors.join(', ')}`);
  } else if (result.warnings.length > 0) {
    console.warn(`⚠️  ${id}: ${result.warnings.join(', ')}`);
  } else {
    console.log(`✅ ${id}: OK`);
  }
});
```

---

## Performance Tracking

### Update Metrics After API Call

```typescript
import { getPromptRegistry } from '@/app/prompts';

// After making API call
const message = await anthropic.messages.create({...});

// Update performance metrics
const registry = getPromptRegistry();
registry.updatePerformance('hashtag-generation-v1-ja', {
  avgInputTokens: message.usage.input_tokens,
  avgOutputTokens: message.usage.output_tokens,
  successRate: 0.98,
  usageCount: 1  // Increment by 1
});
```

### Get Performance Data

```typescript
import { getPromptRegistry } from '@/app/prompts';

const registry = getPromptRegistry();
const perf = registry.getPerformance('hashtag-generation-v1-ja');

if (perf) {
  console.log(`Success Rate: ${perf.successRate * 100}%`);
  console.log(`Avg Input Tokens: ${perf.avgInputTokens}`);
  console.log(`Avg Output Tokens: ${perf.avgOutputTokens}`);
  console.log(`Quality Score: ${perf.qualityScore}/5`);
  console.log(`Usage Count: ${perf.usageCount}`);
  console.log(`Last Updated: ${perf.lastUpdated}`);
}
```

### Compare Prompt Versions

```typescript
import { getPromptRegistry } from '@/app/prompts';

const registry = getPromptRegistry();

const v1Perf = registry.getPerformance('hashtag-generation-v1-ja');
const v2Perf = registry.getPerformance('hashtag-generation-v2-ja');

console.log('Version Comparison:');
console.log('V1 Success Rate:', v1Perf?.successRate);
console.log('V2 Success Rate:', v2Perf?.successRate);
console.log('V1 Avg Tokens:', v1Perf?.avgInputTokens + v1Perf?.avgOutputTokens);
console.log('V2 Avg Tokens:', v2Perf?.avgInputTokens + v2Perf?.avgOutputTokens);
```

---

## Custom Prompts

### Create Custom Prompt Template

```typescript
import type { PromptTemplate } from '@/app/prompts';

export const mySummaryPrompt: PromptTemplate = {
  id: 'summary-generation-v1-ja',
  version: 'v1',
  language: 'ja',
  category: 'analysis',  // Reuse existing category
  systemPrompt: `あなたは記事要約のエキスパートです。
記事を読み、3文で要約してください。

要件：
1. 各文は30-50文字
2. 重要なポイントのみ
3. 読者にとって価値のある情報`,
  userPromptTemplate: `記事：\n{{articleText}}\n\n3文で要約してください。`,
  variables: ['articleText'],
  metadata: {
    author: 'Your Name',
    createdAt: new Date().toISOString(),
    description: '記事を3文で要約する'
  },
  caching: {
    enabled: true,
    ttl: 300
  },
  maxTokens: 300,
  temperature: 0.6
};
```

### Use Custom Prompt

```typescript
import { PromptBuilder } from '@/app/prompts';
import { mySummaryPrompt } from './myPrompts';

const builder = new PromptBuilder();
const prompt = builder.build(mySummaryPrompt, {
  articleText: 'Your article here...'
});

const message = await anthropic.messages.create({
  model: 'claude-sonnet-4-20250514',
  ...prompt
});
```

### Register Custom Prompt

```typescript
import { getPromptRegistry } from '@/app/prompts';
import { mySummaryPrompt } from './myPrompts';

const registry = getPromptRegistry();
registry.registerTemplate(mySummaryPrompt);

// Now you can get it like built-in prompts
const template = registry.getById('summary-generation-v1-ja');
```

---

## Token Estimation

### Estimate Before API Call

```typescript
import { estimateTokens, estimateCost } from '@/app/prompts';

const articleText = 'Your article content...';
const inputTokens = estimateTokens(articleText);
const outputTokens = 500;  // Expected output

console.log(`Estimated input: ${inputTokens} tokens`);
console.log(`Estimated output: ${outputTokens} tokens`);

const cost = estimateCost(inputTokens, outputTokens, false);
console.log(`Estimated cost: $${cost.toFixed(4)}`);
```

### Check Cache Savings

```typescript
import { estimateCostRange, formatCost } from '@/app/prompts';

const inputTokens = 450;
const outputTokens = 500;

const costRange = estimateCostRange(inputTokens, outputTokens);

console.log('First call:', formatCost(costRange.firstCall));
console.log('Cached call:', formatCost(costRange.cachedCall));
console.log('Savings:', formatCost(costRange.savings));
console.log('Savings %:', costRange.savingsPercent.toFixed(1) + '%');
```

### Check Token Budget

```typescript
import { isWithinBudget, truncateToTokens } from '@/app/prompts';

const articleText = 'Very long article...';
const maxTokens = 1000;

const budget = isWithinBudget(articleText, maxTokens);

if (budget.withinBudget) {
  console.log(`✅ Within budget: ${budget.percentUsed.toFixed(1)}% used`);
} else {
  console.log(`❌ Exceeds budget by ${-budget.remaining} tokens`);

  // Truncate to fit
  const truncated = truncateToTokens(articleText, maxTokens);
  console.log('Using truncated text:', truncated);
}
```

### Preview Prompt with Estimates

```typescript
import { quickStart } from '@/app/prompts';

const preview = quickStart.previewPrompt('hashtag', {
  articleText: 'Your article...'
});

console.log('System Prompt:', preview.system);
console.log('User Prompt:', preview.user);
console.log('Metadata:', preview.metadata);
console.log('Estimated Input Tokens:', preview.metadata.estimatedInputTokens);
console.log('Estimated Output Tokens:', preview.metadata.estimatedOutputTokens);
```

---

## Advanced: Building Custom Workflows

### Multi-Step Analysis

```typescript
import { quickStart } from '@/app/prompts';

async function analyzeArticle(articleText: string) {
  // Step 1: Generate titles
  const titlePrompt = quickStart.buildPrompt('titles', { articleText });
  const titlesMsg = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    ...titlePrompt
  });

  // Step 2: Generate hashtags
  const hashtagPrompt = quickStart.buildPrompt('hashtag', { articleText });
  const hashtagsMsg = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    ...hashtagPrompt
  });

  // Step 3: Generate eye-catch
  const eyecatchPrompt = quickStart.buildPrompt('eyecatch', { articleText });
  const eyecatchMsg = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    ...eyecatchPrompt
  });

  return {
    titles: parseTitles(titlesMsg.content[0].text),
    hashtags: parseHashtags(hashtagsMsg.content[0].text),
    eyecatch: parseEyecatch(eyecatchMsg.content[0].text)
  };
}
```

### Batch Processing with Different Prompts

```typescript
import { quickStart } from '@/app/prompts';

async function processArticles(articles: string[]) {
  const results = await Promise.all(
    articles.map(async (articleText) => {
      const prompt = quickStart.buildPrompt('hashtag', { articleText });

      const message = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        ...prompt
      });

      return parseHashtags(message.content[0].text);
    })
  );

  return results;
}
```

---

## Tips & Best Practices

1. **Always use caching** for system prompts (90% cost reduction)
2. **Validate prompts** in development and testing
3. **Track performance** to optimize over time
4. **Use experiments** to test improvements
5. **Estimate costs** before expensive operations
6. **Version carefully** (v1 = stable, v2 = experimental)
7. **Add examples** to prompt templates for documentation
8. **Monitor metrics** in production

## Need Help?

- See `app/prompts/README.md` for full documentation
- See `app/prompts/MIGRATION_EXAMPLE.md` for migration guide
- Check `app/prompts/templates/` for example prompts
