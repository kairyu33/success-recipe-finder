/**
 * Hashtag generation prompt templates
 *
 * @description Contains versioned prompts for generating optimized hashtags
 * for note.com articles with different strategies and approaches
 */

import type { PromptTemplate } from '../types';

/**
 * Version 1: Current production prompt
 * - Optimized for cost with prompt caching
 * - Focus on Japanese hashtags
 * - 20 hashtags per request
 */
export const hashtagV1Ja: PromptTemplate = {
  id: 'hashtag-generation-v1-ja',
  version: 'v1',
  language: 'ja',
  category: 'hashtag',
  systemPrompt: `あなたはnote.com記事のハッシュタグ生成エキスパートです。以下のルールに従って正確に20個のハッシュタグを生成してください：

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
  userPromptTemplate: `記事テキスト：\n{{articleText}}\n\n20個のハッシュタグを生成してください。`,
  variables: ['articleText'],
  examples: [
    {
      description: 'Technology article about AI',
      input: {
        articleText: 'ChatGPTを使った効率的な仕事術について解説します。AIツールを活用することで、日々の業務が劇的に改善されます。'
      },
      expectedOutput: '#AI\n#ChatGPT\n#仕事術\n#効率化\n#生産性向上\n...',
      tags: ['technology', 'ai']
    },
    {
      description: 'Lifestyle article about cooking',
      input: {
        articleText: '忙しい朝でも簡単に作れる時短レシピを紹介します。栄養バランスも考えた健康的な朝食メニューです。'
      },
      expectedOutput: '#料理\n#レシピ\n#時短\n#朝食\n#健康\n...',
      tags: ['lifestyle', 'cooking']
    }
  ],
  metadata: {
    author: 'System',
    createdAt: '2025-01-15T00:00:00Z',
    updatedAt: '2025-01-20T00:00:00Z',
    description: 'Production hashtag generation prompt with cost optimization',
    tags: ['production', 'optimized', 'cached'],
    performance: {
      avgInputTokens: 450,
      avgOutputTokens: 120,
      successRate: 0.98,
      qualityScore: 4.5,
      usageCount: 1250,
      avgResponseTime: 1200,
      lastUpdated: '2025-01-20T00:00:00Z'
    }
  },
  outputFormat: {
    type: 'text',
    validation: {
      required: ['hashtags'],
      minLength: { hashtags: 20 },
      maxLength: { hashtags: 20 }
    }
  },
  caching: {
    enabled: true,
    ttl: 300,
    strategy: 'static'
  },
  maxTokens: 500,
  temperature: 0.7
};

/**
 * Version 1: English variant
 * - Same strategy as Japanese but for English content
 */
export const hashtagV1En: PromptTemplate = {
  id: 'hashtag-generation-v1-en',
  version: 'v1',
  language: 'en',
  category: 'hashtag',
  systemPrompt: `You are a hashtag generation expert for note.com articles. Generate exactly 20 hashtags following these rules:

1. Always start with "#"
2. Prioritize Japanese hashtags (even for English content)
3. Choose tags that are searchable on note.com
4. Balance general and specific tags
5. One tag per line
6. Generate exactly 20 tags

Output format:
#tag1
#tag2
...
#tag20`,
  userPromptTemplate: `Article text:\n{{articleText}}\n\nGenerate 20 hashtags.`,
  variables: ['articleText'],
  metadata: {
    author: 'System',
    createdAt: '2025-01-15T00:00:00Z',
    description: 'English variant of hashtag generation prompt',
    tags: ['english', 'production']
  },
  caching: {
    enabled: true,
    ttl: 300,
    strategy: 'static'
  },
  maxTokens: 500,
  temperature: 0.7
};

/**
 * Version 2: Experimental - Category-focused approach
 * - Organizes hashtags by category (trending, niche, general)
 * - More structured output for better targeting
 */
export const hashtagV2Ja: PromptTemplate = {
  id: 'hashtag-generation-v2-ja',
  version: 'v2',
  language: 'ja',
  category: 'hashtag',
  systemPrompt: `あなたはnote.com記事のハッシュタグ生成エキスパートです。記事を分析し、以下のカテゴリーごとに合計20個のハッシュタグを生成してください：

【カテゴリー別配分】
- トレンド系（5個）: 今人気のあるハッシュタグ
- ニッチ系（8個）: 記事内容に特化したハッシュタグ
- 一般系（7個）: 幅広い読者にリーチする汎用ハッシュタグ

【ルール】
1. 必ず「#」で始める
2. 日本語優先
3. note.comで実際に検索されているタグを選ぶ
4. カテゴリーごとに改行で区切る

出力形式：
【トレンド】
#タグ1
#タグ2
...
【ニッチ】
#タグ6
#タグ7
...
【一般】
#タグ14
#タグ15
...`,
  userPromptTemplate: `記事テキスト：\n{{articleText}}\n\nカテゴリー別に20個のハッシュタグを生成してください。`,
  variables: ['articleText'],
  metadata: {
    author: 'System',
    createdAt: '2025-01-20T00:00:00Z',
    description: 'Experimental category-focused hashtag generation',
    tags: ['experimental', 'categorized', 'v2'],
    performance: {
      avgInputTokens: 480,
      avgOutputTokens: 150,
      successRate: 0.95,
      qualityScore: 4.7,
      usageCount: 50,
      avgResponseTime: 1300,
      lastUpdated: '2025-01-20T00:00:00Z'
    }
  },
  caching: {
    enabled: true,
    ttl: 300,
    strategy: 'static'
  },
  maxTokens: 600,
  temperature: 0.8
};

/**
 * Version 2: JSON output variant
 * - Returns structured JSON for easier parsing
 * - Better for programmatic usage
 */
export const hashtagV2Json: PromptTemplate = {
  id: 'hashtag-generation-v2-json',
  version: 'v2',
  language: 'ja',
  category: 'hashtag',
  systemPrompt: `あなたはnote.com記事のハッシュタグ生成エキスパートです。記事を分析し、以下のJSON形式で20個のハッシュタグを返してください。

出力形式（JSON）：
{
  "hashtags": ["#タグ1", "#タグ2", ..., "#タグ20"],
  "categories": {
    "trending": ["#トレンドタグ1", "#トレンドタグ2", ...],
    "niche": ["#ニッチタグ1", "#ニッチタグ2", ...],
    "general": ["#一般タグ1", "#一般タグ2", ...]
  },
  "confidence": 0.95
}

重要：
- JSON以外の説明は含めない
- 必ず有効なJSON形式で返す
- hashtagsには必ず20個のタグを含める`,
  userPromptTemplate: `記事テキスト：\n{{articleText}}\n\nJSON形式で20個のハッシュタグを生成してください。`,
  variables: ['articleText'],
  metadata: {
    author: 'System',
    createdAt: '2025-01-20T00:00:00Z',
    description: 'JSON output variant for structured data',
    tags: ['experimental', 'json', 'structured']
  },
  outputFormat: {
    type: 'json',
    schema: '{"hashtags": string[], "categories": {"trending": string[], "niche": string[], "general": string[]}, "confidence": number}',
    fields: ['hashtags', 'categories', 'confidence']
  },
  caching: {
    enabled: true,
    ttl: 300,
    strategy: 'static'
  },
  maxTokens: 600,
  temperature: 0.7
};

/**
 * All hashtag prompt templates organized by version and language
 */
export const hashtagPrompts = {
  v1: {
    ja: hashtagV1Ja,
    en: hashtagV1En
  },
  v2: {
    ja: hashtagV2Ja,
    json: hashtagV2Json
  }
};

/**
 * Default hashtag prompt (production version)
 */
export const defaultHashtagPrompt = hashtagV1Ja;
