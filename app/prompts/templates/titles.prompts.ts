/**
 * Title generation prompt templates
 *
 * @description Contains versioned prompts for generating compelling,
 * SEO-optimized titles for note.com articles
 */

import type { PromptTemplate } from '../types';

/**
 * Version 1: Standard title generation
 * - 5 diverse title suggestions
 * - SEO-friendly approach
 * - Note.com best practices
 */
export const titlesV1Ja: PromptTemplate = {
  id: 'titles-generation-v1-ja',
  version: 'v1',
  language: 'ja',
  category: 'titles',
  systemPrompt: `あなたはnote.com記事のタイトル生成エキスパートです。記事を分析し、5個の魅力的なタイトル案を生成してください。

タイトルの基準：
1. キャッチーで読者の興味を引く
2. SEO最適化（重要キーワードを含む）
3. note.comで人気が出やすい表現を使用
4. 30-50文字が理想的（長すぎず短すぎず）
5. 数字や記号を効果的に使用（【】、！、？など）

出力形式：
1. [タイトル1]
2. [タイトル2]
3. [タイトル3]
4. [タイトル4]
5. [タイトル5]`,
  userPromptTemplate: `記事テキスト：\n{{articleText}}\n\n5個の魅力的なタイトル案を生成してください。`,
  variables: ['articleText'],
  examples: [
    {
      description: 'Productivity article titles',
      input: {
        articleText: '時間管理術について解説します。効率的な仕事の進め方とは。'
      },
      expectedOutput: `1. 【保存版】仕事効率2倍！時間管理術の極意
2. 残業ゼロを実現する科学的タイムマネジメント法
3. 1日の時間を最大化する5つの実践テクニック
4. 時間に追われない！プロが教える効率的仕事術
5. 生産性が劇的に向上する時間管理の新常識`,
      tags: ['productivity']
    }
  ],
  metadata: {
    author: 'System',
    createdAt: '2025-01-15T00:00:00Z',
    description: 'Standard title generation with SEO optimization',
    tags: ['production', 'seo', 'titles'],
    performance: {
      avgInputTokens: 280,
      avgOutputTokens: 120,
      successRate: 0.99,
      qualityScore: 4.6,
      usageCount: 420,
      avgResponseTime: 800,
      lastUpdated: '2025-01-20T00:00:00Z'
    }
  },
  outputFormat: {
    type: 'text',
    validation: {
      required: ['titles'],
      minLength: { titles: 5 },
      maxLength: { titles: 5 }
    }
  },
  caching: {
    enabled: true,
    ttl: 300,
    strategy: 'static'
  },
  maxTokens: 400,
  temperature: 0.8
};

/**
 * Version 2: Category-specific titles
 * - Different strategies per category
 * - Viral potential scoring
 * - JSON format with metadata
 */
export const titlesV2Json: PromptTemplate = {
  id: 'titles-generation-v2-json',
  version: 'v2',
  language: 'ja',
  category: 'titles',
  systemPrompt: `あなたはnote.com記事のタイトル生成エキスパートです。記事を分析し、カテゴリー別に最適化された5個のタイトル案を生成してください。

出力形式（JSON）：
{
  "category": "記事カテゴリー（ビジネス/ライフスタイル/テクノロジー/クリエイティブ/自己啓発）",
  "titles": [
    {
      "text": "タイトル案",
      "viralScore": 0-10（バズる可能性スコア）,
      "seoScore": 0-10（SEOスコア）,
      "length": 文字数,
      "style": "スタイル（例：情報系、感情系、問いかけ系、数字系、保証系）"
    }
  ],
  "recommendedTitle": "最もおすすめのタイトル"
}

重要：
- タイトルは必ず5個
- viralScoreとseoScoreは客観的に評価
- recommendedTitleは総合評価が最も高いものを選択`,
  userPromptTemplate: `記事テキスト：\n{{articleText}}`,
  variables: ['articleText'],
  examples: [
    {
      description: 'JSON format with scoring',
      input: {
        articleText: 'AIツールを使った副業の始め方について解説します。'
      },
      expectedOutput: `{
  "category": "ビジネス",
  "titles": [
    {
      "text": "【2025年版】AIで稼ぐ！初心者から始める副業完全ガイド",
      "viralScore": 8,
      "seoScore": 9,
      "length": 30,
      "style": "数字系・保証系"
    },
    {
      "text": "月5万円稼げた！AIツールを活用した副業成功の秘訣",
      "viralScore": 9,
      "seoScore": 7,
      "length": 27,
      "style": "実績系・感情系"
    },
    {
      "text": "副業初心者必見！ChatGPTで収入を増やす実践テクニック",
      "viralScore": 7,
      "seoScore": 8,
      "length": 29,
      "style": "ターゲット系・情報系"
    },
    {
      "text": "AIで副業を始めたら人生が変わった話【体験談】",
      "viralScore": 8,
      "seoScore": 6,
      "length": 25,
      "style": "ストーリー系"
    },
    {
      "text": "会社員でもできる！AIを使った副業5つのステップ",
      "viralScore": 7,
      "seoScore": 8,
      "length": 26,
      "style": "ハウツー系・数字系"
    }
  ],
  "recommendedTitle": "【2025年版】AIで稼ぐ！初心者から始める副業完全ガイド"
}`,
      tags: ['business', 'ai']
    }
  ],
  metadata: {
    author: 'System',
    createdAt: '2025-01-20T00:00:00Z',
    description: 'Advanced title generation with viral potential scoring',
    tags: ['experimental', 'json', 'scoring'],
    performance: {
      avgInputTokens: 320,
      avgOutputTokens: 280,
      successRate: 0.96,
      qualityScore: 4.8,
      usageCount: 85,
      avgResponseTime: 1100,
      lastUpdated: '2025-01-20T00:00:00Z'
    }
  },
  outputFormat: {
    type: 'json',
    schema: '{"category": string, "titles": [{"text": string, "viralScore": number, "seoScore": number, "length": number, "style": string}], "recommendedTitle": string}',
    fields: ['category', 'titles', 'recommendedTitle']
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
 * Version 2: A/B testing optimized
 * - Generates title pairs for testing
 * - Hypothesis-driven variations
 */
export const titlesV2AbTest: PromptTemplate = {
  id: 'titles-generation-v2-abtest',
  version: 'v2',
  language: 'ja',
  category: 'titles',
  systemPrompt: `あなたはnote.com記事のタイトル最適化エキスパートです。A/Bテストに適した3組のタイトルペアを生成してください。

各ペアは異なる仮説に基づきます：
1. 感情的 vs 論理的
2. 短い vs 詳細
3. 疑問形 vs 断定形

出力形式（JSON）：
{
  "pairs": [
    {
      "hypothesis": "仮説の説明",
      "variantA": {
        "title": "タイトルA",
        "approach": "アプローチの説明",
        "expectedAudience": "想定読者層"
      },
      "variantB": {
        "title": "タイトルB",
        "approach": "アプローチの説明",
        "expectedAudience": "想定読者層"
      }
    }
  ]
}

重要：
- 各ペアは明確に異なる戦略を使用
- A/Bテストで有意差が出やすい組み合わせ
- 3組のペア（合計6タイトル）を生成`,
  userPromptTemplate: `記事テキスト：\n{{articleText}}`,
  variables: ['articleText'],
  metadata: {
    author: 'System',
    createdAt: '2025-01-20T00:00:00Z',
    description: 'A/B testing optimized title generation',
    tags: ['experimental', 'ab-testing', 'optimization']
  },
  outputFormat: {
    type: 'json',
    fields: ['pairs']
  },
  caching: {
    enabled: true,
    ttl: 300,
    strategy: 'static'
  },
  maxTokens: 700,
  temperature: 0.8
};

/**
 * All title prompt templates organized by version
 */
export const titlePrompts = {
  v1: {
    ja: titlesV1Ja
  },
  v2: {
    json: titlesV2Json,
    abTest: titlesV2AbTest
  }
};

/**
 * Default title prompt (production version)
 */
export const defaultTitlePrompt = titlesV1Ja;
