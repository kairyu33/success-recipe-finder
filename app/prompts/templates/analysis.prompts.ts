/**
 * Article analysis prompt templates
 *
 * @description Contains versioned prompts for comprehensive article analysis
 * including insights, learning points, benefits, and target audience
 */

import type { PromptTemplate } from '../types';

/**
 * Version 1: Current production prompt
 * - Comprehensive JSON output
 * - Includes all analysis components
 * - Optimized for cost
 */
export const analysisV1Ja: PromptTemplate = {
  id: 'analysis-full-v1-ja',
  version: 'v1',
  language: 'ja',
  category: 'analysis',
  systemPrompt: `あなたはnote.com記事の総合分析エキスパートです。記事を分析し、以下のJSON形式で返してください。JSON以外の説明は一切含めないでください。

出力JSON構造：
{
  "suggestedTitles": ["タイトル案1〜5（キャッチーでSEO最適化）"],
  "insights": {
    "whatYouLearn": ["学習ポイント1〜5（具体的で実践的）"],
    "benefits": ["メリット1〜5（読者が得られる価値）"],
    "recommendedFor": ["おすすめ読者1〜5（具体的なペルソナ）"],
    "oneLiner": "記事の本質を1文で（30-50文字）"
  },
  "eyeCatchImage": {
    "mainPrompt": "詳細な英語画像生成プロンプト（DALL-E/Midjourney用、構図・スタイル・色・雰囲気を具体的に記述）",
    "compositionIdeas": ["構図アイデア1〜3（日本語）"],
    "colorPalette": ["#HEX色1〜4"],
    "mood": "雰囲気を表す言葉",
    "style": "アートスタイル",
    "summary": "100文字以内の要約"
  },
  "hashtags": ["#タグ1〜20（日本語、note.comで検索されやすいタグ）"]
}

重要：
- 必ず有効なJSONフォーマットで出力
- マークダウンやコードブロックは使用しない
- 配列の要素数を厳守（タイトル5個、学習5個、メリット5個、読者5個、構図3個、色4個、ハッシュタグ20個）`,
  userPromptTemplate: `記事テキスト：\n{{articleText}}`,
  variables: ['articleText'],
  examples: [
    {
      description: 'Productivity article analysis',
      input: {
        articleText: '時間管理術を使って仕事の効率を2倍にする方法を解説します。'
      },
      expectedOutput: `{
  "suggestedTitles": [
    "仕事効率2倍！誰でもできる時間管理術の極意",
    "【保存版】生産性を劇的に向上させる時間管理テクニック",
    "1日の時間を最大化する実践的タイムマネジメント法",
    "時間に追われない！効率的な仕事術5つのステップ",
    "残業ゼロを実現する科学的時間管理メソッド"
  ],
  "insights": {
    "whatYouLearn": [
      "タスクの優先順位付けの科学的アプローチ",
      "集中力を最大化する時間ブロック法",
      "時間の無駄を削減する具体的テクニック",
      "効率的な1日のスケジュール設計方法",
      "実績のある時間管理ツールの活用法"
    ],
    "benefits": [
      "残業時間を削減し、プライベート時間が増える",
      "ストレスが減り、仕事の質が向上する",
      "重要なタスクに集中できるようになる",
      "キャリアアップにつながる成果を出せる",
      "ワークライフバランスが改善される"
    ],
    "recommendedFor": [
      "毎日残業が多いビジネスパーソン",
      "タスクに追われて優先順位がつけられない人",
      "もっと効率的に働きたいと思っている若手社員",
      "チーム管理をしているマネージャー",
      "フリーランスで時間管理に悩んでいる人"
    ],
    "oneLiner": "科学的な時間管理術で仕事効率を2倍にする実践メソッド"
  },
  "eyeCatchImage": {
    "mainPrompt": "A modern productivity dashboard with time management tools, clean minimalist interface, floating calendar and task icons, vibrant blue and green color scheme, professional and organized mood, 3D rendered style with soft shadows",
    "compositionIdeas": [
      "時計とタスクリストが融合したデジタルインターフェース（ブルーグリーン、効率的）",
      "時間軸上に配置された仕事のブロック図（ミニマル、整理された印象）",
      "上昇するグラフと時計のシンボル（モダン、成長を示唆）"
    ],
    "colorPalette": ["#4A90E2", "#50E3C2", "#34495E", "#ECF0F1"],
    "mood": "プロフェッショナルで効率的",
    "style": "3Dミニマリズム",
    "summary": "時間管理術を活用して仕事効率を2倍にする実践的メソッドを紹介。科学的アプローチで成果を最大化。"
  },
  "hashtags": [
    "#時間管理", "#生産性", "#仕事効率化", "#タイムマネジメント",
    "#ビジネススキル", "#自己啓発", "#キャリアアップ", "#働き方改革",
    "#残業削減", "#ワークライフバランス", "#仕事術", "#集中力",
    "#タスク管理", "#スケジュール管理", "#効率化", "#ビジネスハック",
    "#時短テクニック", "#生産性向上", "#仕事のコツ", "#成長マインド"
  ]
}`,
      tags: ['productivity', 'business']
    }
  ],
  metadata: {
    author: 'System',
    createdAt: '2025-01-15T00:00:00Z',
    updatedAt: '2025-01-20T00:00:00Z',
    description: 'Comprehensive article analysis with all components',
    tags: ['production', 'comprehensive', 'optimized'],
    performance: {
      avgInputTokens: 550,
      avgOutputTokens: 480,
      successRate: 0.96,
      qualityScore: 4.7,
      usageCount: 680,
      avgResponseTime: 2200,
      lastUpdated: '2025-01-20T00:00:00Z'
    }
  },
  outputFormat: {
    type: 'json',
    schema: '{"suggestedTitles": string[], "insights": {"whatYouLearn": string[], "benefits": string[], "recommendedFor": string[], "oneLiner": string}, "eyeCatchImage": {"mainPrompt": string, "compositionIdeas": string[], "colorPalette": string[], "mood": string, "style": string, "summary": string}, "hashtags": string[]}',
    fields: ['suggestedTitles', 'insights', 'eyeCatchImage', 'hashtags'],
    validation: {
      required: ['suggestedTitles', 'insights', 'hashtags'],
      minLength: {
        suggestedTitles: 5,
        'insights.whatYouLearn': 5,
        'insights.benefits': 5,
        'insights.recommendedFor': 5,
        hashtags: 20
      },
      maxLength: {
        suggestedTitles: 5,
        'insights.whatYouLearn': 5,
        'insights.benefits': 5,
        'insights.recommendedFor': 5,
        'eyeCatchImage.summary': 100,
        hashtags: 20
      }
    }
  },
  caching: {
    enabled: true,
    ttl: 300,
    strategy: 'static'
  },
  maxTokens: 2000,
  temperature: 0.7
};

/**
 * Version 2: Lightweight analysis
 * - Faster, cheaper alternative
 * - Focuses on essential insights only
 * - Reduced token usage
 */
export const analysisV2Light: PromptTemplate = {
  id: 'analysis-light-v2-ja',
  version: 'v2',
  language: 'ja',
  category: 'analysis',
  systemPrompt: `あなたはnote.com記事の分析エキスパートです。記事を簡潔に分析し、以下のJSON形式で返してください。

出力JSON構造：
{
  "mainTitle": "最も魅力的なタイトル案",
  "insights": {
    "keyPoints": ["重要ポイント3個"],
    "targetAudience": "主な読者層（1文）",
    "oneLiner": "記事の本質（30-50文字）"
  },
  "hashtags": ["#タグ1〜10（厳選）"]
}

重要：
- JSON形式のみ
- 最小限の情報で最大の価値を
- タグは10個に厳選`,
  userPromptTemplate: `記事テキスト：\n{{articleText}}`,
  variables: ['articleText'],
  metadata: {
    author: 'System',
    createdAt: '2025-01-20T00:00:00Z',
    description: 'Lightweight analysis for faster, cheaper results',
    tags: ['experimental', 'lightweight', 'fast'],
    performance: {
      avgInputTokens: 320,
      avgOutputTokens: 180,
      successRate: 0.98,
      qualityScore: 4.3,
      usageCount: 200,
      avgResponseTime: 900,
      lastUpdated: '2025-01-20T00:00:00Z'
    }
  },
  outputFormat: {
    type: 'json',
    fields: ['mainTitle', 'insights', 'hashtags']
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
 * Version 2: SEO-focused analysis
 * - Emphasizes search optimization
 * - Includes keyword suggestions
 * - Meta description generation
 */
export const analysisV2Seo: PromptTemplate = {
  id: 'analysis-seo-v2-ja',
  version: 'v2',
  language: 'ja',
  category: 'analysis',
  systemPrompt: `あなたはnote.com記事のSEO分析エキスパートです。記事を分析し、検索最適化に焦点を当てた以下のJSON形式で返してください。

出力JSON構造：
{
  "seoTitle": "SEO最適化されたタイトル（60文字以内）",
  "metaDescription": "メタディスクリプション（120-160文字）",
  "keywords": {
    "primary": ["主要キーワード3個"],
    "secondary": ["関連キーワード5個"],
    "longTail": ["ロングテールキーワード5個"]
  },
  "hashtags": ["#SEOタグ20個"],
  "searchIntent": "検索意図の分類（情報、商業、ナビゲーション、トランザクション）",
  "contentGaps": ["競合との差別化ポイント3個"]
}

重要：
- タイトルは60文字以内（検索結果での表示最適化）
- メタディスクリプションは120-160文字（クリック率向上）
- キーワードは検索ボリュームを考慮`,
  userPromptTemplate: `記事テキスト：\n{{articleText}}`,
  variables: ['articleText'],
  metadata: {
    author: 'System',
    createdAt: '2025-01-20T00:00:00Z',
    description: 'SEO-focused analysis with keyword optimization',
    tags: ['experimental', 'seo', 'keywords']
  },
  outputFormat: {
    type: 'json',
    fields: ['seoTitle', 'metaDescription', 'keywords', 'hashtags', 'searchIntent', 'contentGaps']
  },
  caching: {
    enabled: true,
    ttl: 300,
    strategy: 'static'
  },
  maxTokens: 1200,
  temperature: 0.6
};

/**
 * All analysis prompt templates organized by version
 */
export const analysisPrompts = {
  v1: {
    ja: analysisV1Ja
  },
  v2: {
    light: analysisV2Light,
    seo: analysisV2Seo
  }
};

/**
 * Default analysis prompt (production version)
 */
export const defaultAnalysisPrompt = analysisV1Ja;
