/**
 * Article improvement prompt templates
 *
 * @description Contains versioned prompts for article improvement analysis
 * including structure, content, engagement, clarity, and SEO optimization
 */

import type { PromptTemplate } from '../types';

/**
 * Version 1: Comprehensive improvement analysis
 * - Detailed scoring across 5 categories
 * - Actionable suggestions with priority
 * - Before/after examples for clarity
 * - Optimized for note.com platform
 */
export const improvementV1Ja: PromptTemplate = {
  id: 'improvement-full-v1-ja',
  version: 'v1',
  language: 'ja',
  category: 'improvement',
  systemPrompt: `あなたはnote.com記事の改善提案エキスパートです。記事を分析し、具体的な改善提案を以下のJSON形式で返してください。JSON以外の説明は一切含めないでください。

出力JSON構造：
{
  "overall": {
    "score": 0-100の総合評価点,
    "strengths": ["強み1〜3（具体的な良い点）"],
    "weaknesses": ["弱点1〜3（改善が必要な点）"]
  },
  "structure": {
    "score": 0-100の構成評価点,
    "suggestions": ["構成改善提案1〜3（導入部・本文・結論の改善）"],
    "examples": ["具体例（任意）"]
  },
  "content": {
    "score": 0-100のコンテンツ評価点,
    "hooks": ["より魅力的な導入フック1〜3"],
    "transitions": ["段落間の接続改善案1〜3"],
    "conclusions": ["より強力な結論の締め方1〜3"]
  },
  "engagement": {
    "score": 0-100のエンゲージメント評価点,
    "addEmotionalAppeal": ["感情に訴える要素1〜3"],
    "addStorytelling": ["ストーリーテリング要素1〜3"],
    "addExamples": ["追加すべき具体例1〜3"],
    "addQuestions": ["読者を引き込む質問1〜3"]
  },
  "clarity": {
    "score": 0-100の明瞭さ評価点,
    "simplifyPhrases": [
      {
        "original": "複雑な表現",
        "suggested": "簡潔な表現",
        "reason": "理由"
      }
    ],
    "splitSentences": ["分割すべき長い文章1〜3"]
  },
  "seoOptimizations": {
    "addKeywords": ["追加すべきキーワード3〜5"],
    "improveHeadings": ["見出し改善案3個"],
    "addInternalLinks": ["内部リンク提案2〜3"]
  },
  "actionItems": [
    {
      "priority": "high" | "medium" | "low",
      "category": "カテゴリ名",
      "suggestion": "具体的な改善提案",
      "impact": "期待される効果"
    }
  ]
}

評価基準：
- **構成 (structure)**: 導入の強さ、論理展開、結論の明確さ
- **コンテンツ (content)**: 価値提供、独自性、実践性
- **エンゲージメント (engagement)**: 感情的つながり、ストーリー性、読者参加
- **明瞭さ (clarity)**: 読みやすさ、文章の簡潔さ、専門用語の使い方
- **SEO (seoOptimizations)**: キーワード最適化、見出し構造、検索意図への対応

重要：
- スコアは客観的に評価（80+:優秀、60-79:良好、40-59:要改善、40未満:大幅改善必要）
- 提案は具体的かつ実践可能なものに
- actionItemsは優先度順に並べる（high -> medium -> low）
- note.comのプラットフォーム特性を考慮`,
  userPromptTemplate: `記事テキスト：\n{{articleText}}`,
  variables: ['articleText'],
  examples: [
    {
      description: 'Tech article improvement',
      input: {
        articleText: 'AI技術が進化しています。機械学習やディープラーニングなどの技術が注目されています。これらの技術を活用することで、様々な分野で効率化が進んでいます。'
      },
      expectedOutput: `{
  "overall": {
    "score": 45,
    "strengths": [
      "トレンドのトピックを扱っている",
      "技術用語が正確"
    ],
    "weaknesses": [
      "導入部が弱く、読者の関心を引けていない",
      "具体例や実例が不足",
      "結論や行動喚起がない"
    ]
  },
  "structure": {
    "score": 40,
    "suggestions": [
      "問題提起から始めて読者の興味を引く（例：「あなたの仕事、AIに奪われるかもしれません」）",
      "本文を「現状→課題→解決策」の3部構成に",
      "明確な行動喚起で締めくくる"
    ],
    "examples": [
      "導入例：「2025年、AI技術は私たちの生活を根本から変えようとしています。あなたは準備ができていますか？」"
    ]
  },
  "content": {
    "score": 50,
    "hooks": [
      "「AIが変える未来」ではなく「あなたの明日を変えるAI技術」",
      "統計データで衝撃を与える：「2030年までに職業の47%がAIで代替可能に」",
      "ストーリーから始める：「田中さん（仮名）の仕事は、AIによって劇的に変わった」"
    ],
    "transitions": [
      "各技術の説明後に「では、これがあなたにどう影響するのか？」と問いかける",
      "「機械学習の話はここまでです。次は、さらに強力なディープラーニングについて」",
      "「理論は理解できた。では実際にどう活用するのか？」"
    ],
    "conclusions": [
      "「今日から始められる3つのアクション」を提示",
      "「AIを味方につけるか、取り残されるか。選択はあなた次第です」",
      "「次回は、具体的な導入事例を紹介します。お楽しみに」"
    ]
  },
  "engagement": {
    "score": 35,
    "addEmotionalAppeal": [
      "「不安」を刺激：「あなたのスキル、5年後も通用しますか？」",
      "「希望」を提示：「AIを使いこなせば、生産性が3倍に」",
      "「緊急性」を演出：「今動かなければ、手遅れになるかもしれません」"
    ],
    "addStorytelling": [
      "成功事例：「スタートアップ企業がAIで売上10倍に」",
      "失敗事例：「AI導入を先延ばしにして倒産した企業」",
      "個人の変革：「文系出身の私がAIエンジニアになるまで」"
    ],
    "addExamples": [
      "ChatGPTを使った業務効率化の具体例",
      "画像生成AIで作成したマーケティング素材",
      "AI分析で見つけた意外なビジネスチャンス"
    ],
    "addQuestions": [
      "「あなたの業界で、AIはどう活用できると思いますか？」",
      "「もし明日からAIアシスタントが使えるとしたら、何をさせますか？」",
      "「AIに奪われたくない仕事は何ですか？その理由は？」"
    ]
  },
  "clarity": {
    "score": 55,
    "simplifyPhrases": [
      {
        "original": "機械学習やディープラーニングなどの技術が注目されています",
        "suggested": "AI技術、特に機械学習が注目されています",
        "reason": "専門用語を減らし、焦点を絞る"
      },
      {
        "original": "様々な分野で効率化が進んでいます",
        "suggested": "医療、金融、製造業などで業務が効率化されています",
        "reason": "具体的な分野を示すことで理解しやすく"
      }
    ],
    "splitSentences": [
      "「AI技術が進化しています。機械学習やディープラーニングなどの技術が注目されています。」→ 各技術を別の段落で詳しく説明"
    ]
  },
  "seoOptimizations": {
    "addKeywords": [
      "AI活用事例",
      "業務効率化",
      "機械学習 初心者",
      "AI導入メリット",
      "2025年 AI トレンド"
    ],
    "improveHeadings": [
      "「AI技術とは？」→「5分でわかる！ビジネスを変えるAI技術」",
      "「機械学習の説明」→「機械学習で業務効率3倍！実例と始め方」",
      "「まとめ」→「今日から始める！AI活用3ステップ」"
    ],
    "addInternalLinks": [
      "「AI導入の失敗事例」への関連記事リンク",
      "「初心者向けPython入門」への導線",
      "「業界別AI活用ガイド」のシリーズ記事"
    ]
  },
  "actionItems": [
    {
      "priority": "high",
      "category": "導入部",
      "suggestion": "最初の3文で読者の問題意識を喚起する。統計データや衝撃的な事実から始める",
      "impact": "直帰率を30%削減、読了率を25%向上"
    },
    {
      "priority": "high",
      "category": "具体例",
      "suggestion": "各技術説明に具体的な活用事例を1つ以上追加",
      "impact": "理解度が向上し、SNSシェア率が40%アップ"
    },
    {
      "priority": "high",
      "category": "CTA",
      "suggestion": "記事の最後に「今日からできる3つのアクション」を明示",
      "impact": "エンゲージメント率が35%向上"
    },
    {
      "priority": "medium",
      "category": "見出し",
      "suggestion": "各見出しに数字とベネフィットを含める（例：「3つの方法」「5分で理解」）",
      "impact": "クリック率が20%向上"
    },
    {
      "priority": "medium",
      "category": "ストーリー",
      "suggestion": "冒頭に成功事例または失敗事例のミニストーリーを追加",
      "impact": "感情的つながりが生まれ、滞在時間が15%増加"
    },
    {
      "priority": "medium",
      "category": "質問",
      "suggestion": "各セクションに読者への問いかけを1つ追加",
      "impact": "コメント数が25%増加"
    },
    {
      "priority": "low",
      "category": "キーワード",
      "suggestion": "「AI活用事例」「業務効率化」などのキーワードを自然に散りばめる",
      "impact": "検索流入が10-15%増加"
    },
    {
      "priority": "low",
      "category": "内部リンク",
      "suggestion": "関連記事へのリンクを2-3箇所に追加",
      "impact": "サイト滞在時間が延び、回遊率向上"
    }
  ]
}`,
      tags: ['tech', 'ai', 'improvement']
    }
  ],
  metadata: {
    author: 'System',
    createdAt: '2025-01-25T00:00:00Z',
    updatedAt: '2025-01-25T00:00:00Z',
    description: 'Comprehensive article improvement analysis with actionable suggestions',
    tags: ['production', 'improvement', 'comprehensive'],
    performance: {
      avgInputTokens: 650,
      avgOutputTokens: 950,
      successRate: 0.94,
      qualityScore: 4.6,
      usageCount: 0,
      avgResponseTime: 3200,
      lastUpdated: '2025-01-25T00:00:00Z'
    }
  },
  outputFormat: {
    type: 'json',
    schema: '{"overall": {"score": number, "strengths": string[], "weaknesses": string[]}, "structure": {"score": number, "suggestions": string[], "examples": string[]}, "content": {"score": number, "hooks": string[], "transitions": string[], "conclusions": string[]}, "engagement": {"score": number, "addEmotionalAppeal": string[], "addStorytelling": string[], "addExamples": string[], "addQuestions": string[]}, "clarity": {"score": number, "simplifyPhrases": Array<{original: string, suggested: string, reason: string}>, "splitSentences": string[]}, "seoOptimizations": {"addKeywords": string[], "improveHeadings": string[], "addInternalLinks": string[]}, "actionItems": Array<{priority: string, category: string, suggestion: string, impact: string}>}',
    fields: ['overall', 'structure', 'content', 'engagement', 'clarity', 'seoOptimizations', 'actionItems'],
    validation: {
      required: ['overall', 'structure', 'content', 'engagement', 'clarity', 'actionItems'],
      minLength: {
        'overall.strengths': 2,
        'overall.weaknesses': 2,
        'structure.suggestions': 2,
        'content.hooks': 2,
        'engagement.addEmotionalAppeal': 2,
        actionItems: 3
      }
    }
  },
  caching: {
    enabled: true,
    ttl: 300,
    strategy: 'static'
  },
  maxTokens: 3000,
  temperature: 0.7
};

/**
 * Version 2: Quick improvement suggestions
 * - Faster, lighter analysis
 * - Top 5 action items only
 * - Reduced token usage
 */
export const improvementV2Quick: PromptTemplate = {
  id: 'improvement-quick-v2-ja',
  version: 'v2',
  language: 'ja',
  category: 'improvement',
  systemPrompt: `あなたはnote.com記事の改善アドバイザーです。記事を簡潔に分析し、以下のJSON形式で返してください。

出力JSON構造：
{
  "overallScore": 0-100の総合評価,
  "topIssues": ["最重要課題3個"],
  "quickWins": ["すぐに改善できるポイント5個（具体的に）"],
  "impact": "改善後の期待効果（1文）"
}

重要：
- 最も効果的な改善点のみに絞る
- すぐ実践できる具体的な提案
- JSON形式のみ`,
  userPromptTemplate: `記事テキスト：\n{{articleText}}`,
  variables: ['articleText'],
  metadata: {
    author: 'System',
    createdAt: '2025-01-25T00:00:00Z',
    description: 'Quick improvement suggestions for faster results',
    tags: ['experimental', 'quick', 'lightweight']
  },
  outputFormat: {
    type: 'json',
    fields: ['overallScore', 'topIssues', 'quickWins', 'impact']
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
 * All improvement prompt templates organized by version
 */
export const improvementPrompts = {
  v1: {
    ja: improvementV1Ja
  },
  v2: {
    quick: improvementV2Quick
  }
};

/**
 * Default improvement prompt (production version)
 */
export const defaultImprovementPrompt = improvementV1Ja;
