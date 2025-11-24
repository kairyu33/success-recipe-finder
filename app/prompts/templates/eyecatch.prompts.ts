/**
 * Eye-catch image generation prompt templates
 *
 * @description Contains versioned prompts for generating eye-catch image
 * suggestions with DALL-E/Midjourney-ready prompts and composition ideas
 */

import type { PromptTemplate } from '../types';

/**
 * Version 1: Current production prompt
 * - Structured output with delimiters
 * - DALL-E optimized prompts
 * - 3-5 composition ideas
 */
export const eyecatchV1Ja: PromptTemplate = {
  id: 'eyecatch-generation-v1-ja',
  version: 'v1',
  language: 'ja',
  category: 'eyecatch',
  systemPrompt: `あなたはnote.com記事のアイキャッチ画像提案エキスパートです。記事を分析し、以下の3つを生成してください：

1. IMAGE_PROMPT: DALL-E用の詳細な英語プロンプト（1-2文、具体的な視覚要素・色・スタイル・雰囲気を含む）
2. COMPOSITION_IDEAS: 代替構成案（日本語、3-5個、各1文、色・ムード・スタイルを含む）
3. SUMMARY: 記事要約（日本語、100文字以内）

出力形式：
---IMAGE_PROMPT---
[英語プロンプト]
---COMPOSITION_IDEAS---
[構成案1]
[構成案2]
[構成案3]
---SUMMARY---
[要約]`,
  userPromptTemplate: `記事テキスト：\n{{articleText}}`,
  variables: ['articleText'],
  examples: [
    {
      description: 'Technology article about AI tools',
      input: {
        articleText: 'ChatGPTを使った効率的な仕事術について解説します。'
      },
      expectedOutput: `---IMAGE_PROMPT---
A modern digital illustration showing AI interface with glowing neural networks, vibrant blue and purple gradient background, minimalist tech style, futuristic and professional mood
---COMPOSITION_IDEAS---
未来的なAIネットワークを背景に、仕事をする人物のシルエット（青紫グラデーション、クール＆プロフェッショナル）
チャットインターフェースと脳のイラストの融合（ネオンブルー、革新的）
デジタル空間に浮かぶタスク管理のアイコン群（ミニマルモダン、効率的な印象）
---SUMMARY---
ChatGPTを活用した仕事効率化の実践的なテクニックを紹介。AIツールで業務改善を実現する方法を解説。`,
      tags: ['technology', 'ai']
    }
  ],
  metadata: {
    author: 'System',
    createdAt: '2025-01-15T00:00:00Z',
    updatedAt: '2025-01-20T00:00:00Z',
    description: 'Production eye-catch generation with structured output',
    tags: ['production', 'optimized', 'cached'],
    performance: {
      avgInputTokens: 380,
      avgOutputTokens: 180,
      successRate: 0.97,
      qualityScore: 4.6,
      usageCount: 850,
      avgResponseTime: 1400,
      lastUpdated: '2025-01-20T00:00:00Z'
    }
  },
  outputFormat: {
    type: 'structured',
    fields: ['imagePrompt', 'compositionIdeas', 'summary'],
    validation: {
      required: ['imagePrompt', 'compositionIdeas', 'summary'],
      minLength: {
        imagePrompt: 50,
        summary: 30
      },
      maxLength: {
        summary: 100
      }
    }
  },
  caching: {
    enabled: true,
    ttl: 300,
    strategy: 'static'
  },
  maxTokens: 800,
  temperature: 0.7
};

/**
 * Version 2: Enhanced JSON format
 * - More detailed image specifications
 * - Color palette with hex codes
 * - Mood and style metadata
 */
export const eyecatchV2Json: PromptTemplate = {
  id: 'eyecatch-generation-v2-json',
  version: 'v2',
  language: 'ja',
  category: 'eyecatch',
  systemPrompt: `あなたはnote.com記事のアイキャッチ画像提案エキスパートです。記事を分析し、以下のJSON形式で画像提案を返してください。

出力形式（JSON）：
{
  "mainPrompt": "詳細な英語画像生成プロンプト（DALL-E/Midjourney用）",
  "compositionIdeas": ["構図案1", "構図案2", "構図案3"],
  "colorPalette": ["#HEX1", "#HEX2", "#HEX3", "#HEX4"],
  "mood": "雰囲気を表す言葉",
  "style": "アートスタイル（例：ミニマルモダン、水彩画風、3Dレンダリング）",
  "summary": "記事要約（100文字以内）"
}

重要：
- JSON以外の説明は含めない
- mainPromptは50文字以上の詳細な英語で
- colorPaletteは必ず4色のHEXコードで
- summaryは100文字以内`,
  userPromptTemplate: `記事テキスト：\n{{articleText}}`,
  variables: ['articleText'],
  examples: [
    {
      description: 'Design article with color palette',
      input: {
        articleText: 'UIデザインにおける色彩理論の基礎を解説します。'
      },
      expectedOutput: `{
  "mainPrompt": "A modern UI design workspace with color swatches and digital color wheel, clean minimalist layout, vibrant gradient background with blue and purple tones, professional designer aesthetic, bright and inspiring mood",
  "compositionIdeas": [
    "カラーパレットと画面デザインが並ぶワークスペース（明るいグラデーション、モダン）",
    "色相環を中心に配置したデザイン理論の図解（幾何学的、教育的）",
    "デジタルデバイス上に表示される色彩豊かなUIデザイン（鮮やか、未来的）"
  ],
  "colorPalette": ["#4A90E2", "#7B68EE", "#50E3C2", "#F5A623"],
  "mood": "プロフェッショナルで創造的",
  "style": "ミニマルモダン",
  "summary": "UIデザインにおける効果的な色彩の使い方と、色彩理論の基礎知識を実例とともに解説。"
}`,
      tags: ['design', 'ui']
    }
  ],
  metadata: {
    author: 'System',
    createdAt: '2025-01-20T00:00:00Z',
    description: 'Enhanced JSON format with color palette and metadata',
    tags: ['experimental', 'json', 'enhanced'],
    performance: {
      avgInputTokens: 420,
      avgOutputTokens: 220,
      successRate: 0.94,
      qualityScore: 4.8,
      usageCount: 120,
      avgResponseTime: 1500,
      lastUpdated: '2025-01-20T00:00:00Z'
    }
  },
  outputFormat: {
    type: 'json',
    schema: '{"mainPrompt": string, "compositionIdeas": string[], "colorPalette": string[], "mood": string, "style": string, "summary": string}',
    fields: ['mainPrompt', 'compositionIdeas', 'colorPalette', 'mood', 'style', 'summary'],
    validation: {
      required: ['mainPrompt', 'compositionIdeas', 'colorPalette', 'summary'],
      minLength: {
        mainPrompt: 50,
        summary: 30
      },
      maxLength: {
        summary: 100
      }
    }
  },
  caching: {
    enabled: true,
    ttl: 300,
    strategy: 'static'
  },
  maxTokens: 900,
  temperature: 0.8
};

/**
 * Version 2: Multi-style variant
 * - Generates multiple style variations
 * - For different image generation tools
 */
export const eyecatchV2MultiStyle: PromptTemplate = {
  id: 'eyecatch-generation-v2-multistyle',
  version: 'v2',
  language: 'ja',
  category: 'eyecatch',
  systemPrompt: `あなたはnote.com記事のアイキャッチ画像提案エキスパートです。記事を分析し、異なるスタイルで3種類の画像提案を生成してください。

各スタイル：
1. フォトリアル系：写真のような質感
2. イラスト系：手描き風・アニメ風
3. アブストラクト系：抽象的・幾何学的

出力形式（JSON）：
{
  "photorealistic": {
    "prompt": "英語プロンプト",
    "description": "日本語説明",
    "tools": ["DALL-E 3", "Midjourney"]
  },
  "illustration": {
    "prompt": "英語プロンプト",
    "description": "日本語説明",
    "tools": ["Stable Diffusion", "DALL-E 3"]
  },
  "abstract": {
    "prompt": "英語プロンプト",
    "description": "日本語説明",
    "tools": ["Midjourney", "Stable Diffusion"]
  },
  "colorPalette": ["#HEX1", "#HEX2", "#HEX3", "#HEX4"],
  "summary": "記事要約（100文字以内）"
}`,
  userPromptTemplate: `記事テキスト：\n{{articleText}}`,
  variables: ['articleText'],
  metadata: {
    author: 'System',
    createdAt: '2025-01-20T00:00:00Z',
    description: 'Multi-style variant for diverse image generation',
    tags: ['experimental', 'multi-style', 'v2']
  },
  outputFormat: {
    type: 'json',
    fields: ['photorealistic', 'illustration', 'abstract', 'colorPalette', 'summary']
  },
  caching: {
    enabled: true,
    ttl: 300,
    strategy: 'static'
  },
  maxTokens: 1000,
  temperature: 0.8
};

/**
 * All eye-catch prompt templates organized by version
 */
export const eyecatchPrompts = {
  v1: {
    ja: eyecatchV1Ja
  },
  v2: {
    json: eyecatchV2Json,
    multiStyle: eyecatchV2MultiStyle
  }
};

/**
 * Default eye-catch prompt (production version)
 */
export const defaultEyecatchPrompt = eyecatchV1Ja;
