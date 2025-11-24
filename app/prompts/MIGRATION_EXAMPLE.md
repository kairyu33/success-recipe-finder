# Migration Example: Using the Prompt System

This guide shows how to migrate existing API routes to use the new prompt management system.

## Example: Hashtag Generation Route

### Original Code (`app/api/generate-hashtags/route.ts`)

```typescript
import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "API key is not configured" },
        { status: 500 }
      );
    }

    const { articleText } = await request.json();

    // Validation...

    const anthropic = new Anthropic({ apiKey });

    // OLD WAY: Hardcoded prompt
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 500,
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

    // Response processing...
    const content = message.content[0];
    const responseText = content.text;
    const hashtags = responseText
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.startsWith("#"))
      .slice(0, 20);

    return NextResponse.json({ hashtags });
  } catch (error) {
    // Error handling...
  }
}
```

### Migrated Code (Using Prompt System)

```typescript
import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { getPromptRegistry, PromptBuilder } from "@/app/prompts";

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "API key is not configured" },
        { status: 500 }
      );
    }

    const { articleText } = await request.json();

    // Validation...

    const anthropic = new Anthropic({ apiKey });

    // NEW WAY: Use prompt system
    const registry = getPromptRegistry();
    const builder = new PromptBuilder();

    // Get prompt template (version and language from config)
    const template = registry.get('hashtag', {
      version: 'v1',  // Optional: defaults to config
      language: 'ja'  // Optional: defaults to config
    });

    // Build prompt with variables
    const prompt = builder.build(template, {
      articleText: articleText
    });

    // Use built prompt (same API, cleaner code)
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: prompt.max_tokens,
      temperature: prompt.temperature,
      system: prompt.system,
      messages: prompt.messages
    });

    // Log performance for tracking
    console.log("[Hashtag Generation] Prompt metadata:", {
      promptId: prompt.metadata.promptId,
      version: prompt.metadata.version,
      category: prompt.metadata.category
    });

    // Response processing (same as before)...
    const content = message.content[0];
    const responseText = content.text;
    const hashtags = responseText
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.startsWith("#"))
      .slice(0, 20);

    return NextResponse.json({ hashtags });
  } catch (error) {
    // Error handling...
  }
}
```

## Even Simpler with Quick Start Helper

```typescript
import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { quickStart } from "@/app/prompts";

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "API key is not configured" },
        { status: 500 }
      );
    }

    const { articleText } = await request.json();

    // Validation...

    const anthropic = new Anthropic({ apiKey });

    // SIMPLEST WAY: One-liner to get and build prompt
    const prompt = quickStart.buildPrompt('hashtag', {
      articleText: articleText
    });

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      ...prompt  // Spread operator includes all needed fields
    });

    // Response processing...
    const content = message.content[0];
    const responseText = content.text;
    const hashtags = responseText
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.startsWith("#"))
      .slice(0, 20);

    return NextResponse.json({ hashtags });
  } catch (error) {
    // Error handling...
  }
}
```

## Benefits of Migration

### 1. Centralized Prompts
- All prompts in one place (`app/prompts/templates/`)
- Easy to find and update
- No hunting through code for prompt strings

### 2. Version Control
```typescript
// Test new version without changing production
const testPrompt = quickStart.buildPrompt('hashtag',
  { articleText },
  { version: 'v2' }  // Try experimental version
);
```

### 3. A/B Testing
```typescript
import { createExperimentManager } from '@/app/prompts';

const manager = createExperimentManager();

// Create experiment
manager.createExperiment({
  id: 'hashtag-v1-vs-v2',
  name: 'Test categorized hashtags',
  category: 'hashtag',
  active: true,
  variants: [
    { id: 'control', prompt: hashtagV1, trafficPercentage: 50 },
    { id: 'test', prompt: hashtagV2, trafficPercentage: 50 }
  ]
});

// Select variant based on user
const variant = manager.selectVariant('hashtag-v1-vs-v2', userId);
const prompt = builder.build(variant.prompt, { articleText });
```

### 4. Validation & Testing
```typescript
import { validatePrompt, estimateTokens } from '@/app/prompts';

// Validate prompt structure before use
const template = registry.get('hashtag');
const validation = validatePrompt(template);

if (!validation.valid) {
  console.error('Invalid prompt:', validation.errors);
}

// Estimate cost before API call
const preview = builder.preview(template, { articleText });
console.log(`Estimated tokens: ${preview.metadata.estimatedInputTokens}`);
```

### 5. Performance Tracking
```typescript
// After API call, update metrics
registry.updatePerformance('hashtag-generation-v1-ja', {
  avgInputTokens: message.usage.input_tokens,
  avgOutputTokens: message.usage.output_tokens,
  successRate: 0.98,
  usageCount: 1
});
```

## Migration Checklist

- [ ] Install prompt system (already done)
- [ ] Import prompt utilities in route
- [ ] Replace hardcoded prompts with `quickStart.buildPrompt()`
- [ ] Remove hardcoded prompt strings
- [ ] Add performance tracking
- [ ] Test with existing functionality
- [ ] Deploy

## Testing the Migration

```typescript
// Test file: app/api/generate-hashtags/route.test.ts
import { quickStart } from '@/app/prompts';

describe('Hashtag Generation with Prompt System', () => {
  it('should build valid prompt', () => {
    const prompt = quickStart.buildPrompt('hashtag', {
      articleText: 'Test article about AI and machine learning'
    });

    expect(prompt.system).toBeDefined();
    expect(prompt.messages).toHaveLength(1);
    expect(prompt.max_tokens).toBe(500);
    expect(prompt.temperature).toBe(0.7);

    // Check caching is enabled
    expect(prompt.system[0].cache_control).toEqual({ type: 'ephemeral' });
  });

  it('should inject article text correctly', () => {
    const articleText = 'My test article';
    const prompt = quickStart.buildPrompt('hashtag', { articleText });

    expect(prompt.messages[0].content).toContain(articleText);
  });
});
```

## Rollback Plan

If issues occur, easy rollback:

1. Keep old code commented:
```typescript
// OLD: Direct prompt
/*
const message = await anthropic.messages.create({
  model: "claude-sonnet-4-20250514",
  max_tokens: 500,
  system: [{ type: "text", text: `...` }],
  messages: [{ role: "user", content: `...` }]
});
*/

// NEW: Prompt system
const prompt = quickStart.buildPrompt('hashtag', { articleText });
const message = await anthropic.messages.create({
  model: "claude-sonnet-4-20250514",
  ...prompt
});
```

2. Uncomment old code and remove new code
3. No database changes needed
4. Instant rollback

## Next Steps

After migration:

1. **Create experiments** to test prompt variations
2. **Track performance** to find optimal versions
3. **Add new prompts** for new features
4. **Monitor metrics** in production
5. **Iterate and improve** based on data

## Questions?

See:
- `app/prompts/README.md` - Full documentation
- `app/prompts/templates/` - Example prompts
- `app/prompts/index.ts` - Public API
