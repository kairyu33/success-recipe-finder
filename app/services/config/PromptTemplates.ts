/**
 * Prompt Templates Configuration
 *
 * @description Centralized repository for all AI prompts used in analysis services.
 * Externalizing prompts makes them easy to:
 * - A/B test different variations
 * - Localize for different languages
 * - Update without code changes
 * - Version control separately
 */

/**
 * Prompt template interface
 */
export interface PromptTemplate {
  /** Template version for tracking */
  version: string;
  /** Template content */
  content: string;
  /** Optional tags for categorization */
  tags?: string[];
  /** Language of the template */
  language?: 'ja' | 'en';
}

/**
 * Hashtag generation prompts
 */
export const HASHTAG_PROMPTS: Record<string, PromptTemplate> = {
  /**
   * Default Japanese hashtag generation prompt
   */
  DEFAULT_JA: {
    version: '2.0',
    language: 'ja' as const,
    content: `あなたはnote.com記事のハッシュタグ生成エキスパートです。以下のルールに従って正確に20個のハッシュタグを生成してください：

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
    tags: ['hashtag', 'note.com', 'japanese'],
  },

  /**
   * English hashtag generation prompt
   */
  DEFAULT_EN: {
    version: '2.0',
    language: 'en' as const,
    content: `You are a hashtag generation expert for note.com articles. Generate exactly 20 hashtags following these rules:

1. Must start with "#"
2. Prefer English tags
3. Choose tags that are searchable on note.com
4. Balance between general and specific tags
5. One hashtag per line
6. Must generate exactly 20 hashtags

Output format:
#tag1
#tag2
...
#tag20`,
    tags: ['hashtag', 'note.com', 'english'],
  },

  /**
   * SEO-optimized hashtag prompt
   */
  SEO_OPTIMIZED_JA: {
    version: '1.0',
    language: 'ja' as const,
    content: `あなたはSEOとソーシャルメディアの専門家です。note.com記事のハッシュタグを20個生成してください。

戦略的ルール：
1. トレンドキーワードを3-5個含める
2. ニッチな専門用語を5-7個含める
3. 一般的な人気タグを3-5個含める
4. ロングテールキーワードを5-7個含める
5. すべて「#」で始める

出力：20個のハッシュタグを1行に1つずつ`,
    tags: ['hashtag', 'seo', 'trending', 'japanese'],
  },
};

/**
 * Eye-catch image generation prompts
 */
export const EYECATCH_PROMPTS: Record<string, PromptTemplate> = {
  /**
   * Default eye-catch generation prompt
   */
  DEFAULT_JA: {
    version: '2.0',
    language: 'ja' as const,
    content: `あなたはnote.com記事のアイキャッチ画像提案エキスパートです。記事を分析し、以下の3つを生成してください：

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
    tags: ['eyecatch', 'image', 'japanese'],
  },

  /**
   * Detailed eye-catch prompt with color palette
   */
  DETAILED_WITH_COLORS_JA: {
    version: '1.0',
    language: 'ja' as const,
    content: `あなたはプロのビジュアルデザイナーです。note.com記事のアイキャッチ画像を提案してください。

生成項目：
1. IMAGE_PROMPT: DALL-E/Midjourney用の詳細な英語プロンプト（構図、ライティング、スタイル、雰囲気を含む）
2. COMPOSITION_IDEAS: 3-5個の代替構成案（日本語、各1-2文）
3. COLOR_PALETTE: 推奨カラーパレット（4色のHEXコード）
4. MOOD: 画像の雰囲気を表す言葉（1-2単語）
5. STYLE: アートスタイル（例：ミニマル、イラスト、写真風）
6. SUMMARY: 記事の100文字要約

出力形式：
---IMAGE_PROMPT---
[英語プロンプト]
---COMPOSITION_IDEAS---
[構成案]
---COLOR_PALETTE---
#HEXCODE1, #HEXCODE2, #HEXCODE3, #HEXCODE4
---MOOD---
[雰囲気]
---STYLE---
[スタイル]
---SUMMARY---
[要約]`,
    tags: ['eyecatch', 'detailed', 'colors', 'japanese'],
  },
};

/**
 * Full article analysis prompts
 */
export const FULL_ANALYSIS_PROMPTS: Record<string, PromptTemplate> = {
  /**
   * Default comprehensive analysis prompt
   */
  DEFAULT_JA: {
    version: '2.0',
    language: 'ja' as const,
    content: `あなたはnote.com記事の総合分析エキスパートです。記事を分析し、以下のJSON形式で返してください。JSON以外の説明は一切含めないでください。

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
    "mainPrompt": "詳細な英語画像生成プロンプト（DALL-E/Midjourney/Stable Diffusion用、構図・スタイル・色・雰囲気を具体的に記述）",
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
    tags: ['full-analysis', 'comprehensive', 'json', 'japanese'],
  },

  /**
   * Marketing-focused analysis prompt
   */
  MARKETING_FOCUSED_JA: {
    version: '1.0',
    language: 'ja' as const,
    content: `あなたはコンテンツマーケティングの専門家です。note.com記事をマーケティング視点で分析し、JSON形式で返してください。

JSON構造：
{
  "suggestedTitles": ["クリック率を最大化するタイトル5個"],
  "insights": {
    "whatYouLearn": ["具体的な学習成果5個"],
    "benefits": ["読者が得る具体的メリット5個"],
    "recommendedFor": ["ターゲットペルソナ5個（詳細な属性を含む）"],
    "oneLiner": "バイラル性のある一文要約（30-50文字）"
  },
  "eyeCatchImage": {
    "mainPrompt": "クリック率を最大化するビジュアルの英語プロンプト",
    "compositionIdeas": ["目を引く構図案3個"],
    "colorPalette": ["エンゲージメントを高める配色4色（HEX）"],
    "mood": "感情を動かす雰囲気",
    "style": "トレンドを意識したスタイル",
    "summary": "シェアしたくなる100文字要約"
  },
  "hashtags": ["#バイラル性の高いタグ20個（トレンド+ニッチのミックス）"]
}`,
    tags: ['full-analysis', 'marketing', 'viral', 'japanese'],
  },
};

/**
 * Title generation prompts
 */
export const TITLE_PROMPTS: Record<string, PromptTemplate> = {
  /**
   * Default title generation prompt
   */
  DEFAULT_JA: {
    version: '1.0',
    language: 'ja' as const,
    content: `記事のタイトル案を5個生成してください。以下の条件を満たすこと：

1. クリックしたくなるキャッチーな表現
2. SEOを意識したキーワード配置
3. 30-50文字の適切な長さ
4. 記事の内容を正確に反映
5. バラエティ豊かな5パターン

1行に1つずつ、番号なしで出力してください。`,
    tags: ['title', 'seo', 'japanese'],
  },
};

/**
 * Article improvement prompts
 */
export const IMPROVEMENT_PROMPTS: Record<string, PromptTemplate> = {
  /**
   * Default comprehensive improvement analysis
   */
  DEFAULT_JA: {
    version: '1.0',
    language: 'ja' as const,
    content: `あなたはnote.com記事の改善提案エキスパートです。記事を分析し、具体的な改善提案を以下のJSON形式で返してください。JSON以外の説明は一切含めないでください。

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
    tags: ['improvement', 'comprehensive', 'json', 'japanese'],
  },
};

/**
 * SEO analysis prompts
 */
export const SEO_PROMPTS: Record<string, PromptTemplate> = {
  /**
   * Default Japanese SEO analysis prompt
   */
  DEFAULT_JA: {
    version: '1.0',
    language: 'ja' as const,
    content: `あなたはnote.comに特化したSEO専門家です。記事を総合的に分析し、以下のJSON形式で結果を返してください。JSON以外の説明は一切含めないでください。

出力JSON構造：
{
  "metaDescription": "150-160文字の最適化されたメタディスクリプション（記事の要点を含み、クリックを促す）",
  "keywords": {
    "primary": ["主要キーワード3-5個（最重要、検索ボリューム大）"],
    "secondary": ["関連キーワード5-7個（補助的、検索ボリューム中）"],
    "longTail": ["ロングテールキーワード5-7個（具体的、ニッチ）"],
    "density": {
      "キーワード1": 1.5,
      "キーワード2": 0.8
    }
  },
  "improvements": {
    "critical": ["最優先で修正すべき問題（0-3個）"],
    "important": ["重要な改善点（0-5個）"],
    "optional": ["あればより良い提案（0-5個）"]
  },
  "imageOptimization": {
    "altTextSuggestions": ["画像のalt属性候補3-5個（キーワード含む、説明的）"],
    "recommendedImageCount": 3
  },
  "internalLinking": {
    "suggestedAnchors": ["内部リンク用のアンカーテキスト3-5個"],
    "relatedTopics": ["関連トピック3-5個（リンク先候補）"]
  }
}

分析ポイント：
1. キーワード密度は0.5-2.5%が理想
2. メタディスクリプションは行動を促す文言を含める
3. note.comの特性を考慮（ソーシャル要素、クリエイター視点）
4. 日本語SEOのベストプラクティスを適用
5. 読者が実際に検索しそうなキーワードを選定

重要：
- 必ず有効なJSONフォーマットで出力
- マークダウンやコードブロックは使用しない
- すべての配列フィールドに適切な数の要素を含める`,
    tags: ['seo', 'optimization', 'note.com', 'japanese'],
  },

  /**
   * English SEO analysis prompt
   */
  DEFAULT_EN: {
    version: '1.0',
    language: 'en' as const,
    content: `You are an SEO expert specializing in note.com content optimization. Analyze the article comprehensively and return results in the following JSON format. Do not include any explanations outside the JSON.

Output JSON structure:
{
  "metaDescription": "Optimized 150-160 character meta description with key points and call-to-action",
  "keywords": {
    "primary": ["3-5 primary keywords (most important, high search volume)"],
    "secondary": ["5-7 secondary keywords (supporting, medium search volume)"],
    "longTail": ["5-7 long-tail keywords (specific, niche)"],
    "density": {
      "keyword1": 1.5,
      "keyword2": 0.8
    }
  },
  "improvements": {
    "critical": ["Critical issues to fix (0-3 items)"],
    "important": ["Important improvements (0-5 items)"],
    "optional": ["Optional enhancements (0-5 items)"]
  },
  "imageOptimization": {
    "altTextSuggestions": ["3-5 alt text suggestions (keyword-rich, descriptive)"],
    "recommendedImageCount": 3
  },
  "internalLinking": {
    "suggestedAnchors": ["3-5 anchor texts for internal links"],
    "relatedTopics": ["3-5 related topics for link targets"]
  }
}

Analysis criteria:
1. Target keyword density: 0.5-2.5%
2. Meta description should include call-to-action
3. Consider note.com platform characteristics
4. Apply SEO best practices
5. Focus on user search intent

Important:
- Output valid JSON only
- No markdown or code blocks
- Include appropriate number of elements in all arrays`,
    tags: ['seo', 'optimization', 'note.com', 'english'],
  },

  /**
   * Advanced SEO analysis with competitive analysis
   */
  ADVANCED_JA: {
    version: '1.0',
    language: 'ja' as const,
    content: `あなたは競合分析も行える上級SEO専門家です。記事を詳細に分析し、競合に勝つための戦略的提案を含めてください。

出力JSON構造：
{
  "metaDescription": "競合を上回る魅力的なメタディスクリプション（150-160文字）",
  "keywords": {
    "primary": ["主要キーワード3-5個（競争力分析含む）"],
    "secondary": ["関連キーワード5-7個"],
    "longTail": ["競争が少ないロングテールキーワード5-7個"],
    "density": {},
    "competitive": ["競合が見逃しているキーワード3-5個"]
  },
  "improvements": {
    "critical": ["即座に修正すべき致命的な問題"],
    "important": ["競合に勝つための重要改善"],
    "optional": ["差別化のための追加提案"]
  },
  "imageOptimization": {
    "altTextSuggestions": ["SEO最適化されたalt属性5個"],
    "recommendedImageCount": 5,
    "visualStrategyNotes": "視覚コンテンツ戦略メモ"
  },
  "internalLinking": {
    "suggestedAnchors": ["戦略的アンカーテキスト5個"],
    "relatedTopics": ["内部リンク先トピック5個"],
    "linkingStrategy": "リンク戦略の説明"
  },
  "contentGaps": ["競合が扱っているが本記事で不足しているトピック3-5個"],
  "uniqueValueProposition": "この記事の独自の価値提案（1-2文）"
}

戦略的分析：
1. 競合コンテンツとの差別化ポイント
2. 検索意図の深掘り
3. E-E-A-T（専門性・権威性・信頼性）の評価
4. コンテンツの網羅性評価
5. ユーザーエクスペリエンス最適化`,
    tags: ['seo', 'advanced', 'competitive', 'japanese'],
  },
};

/**
 * Get prompt template by key
 *
 * @param category - Prompt category ('hashtag', 'eyecatch', 'full-analysis', 'title', 'seo', 'improvement')
 * @param variant - Variant name (e.g., 'DEFAULT_JA', 'SEO_OPTIMIZED_JA')
 * @returns Prompt template
 *
 * @example
 * ```typescript
 * const prompt = getPromptTemplate('hashtag', 'DEFAULT_JA');
 * console.log(prompt.content);
 * ```
 */
export function getPromptTemplate(
  category: 'hashtag' | 'eyecatch' | 'full-analysis' | 'title' | 'seo' | 'improvement',
  variant: string = 'DEFAULT_JA'
): PromptTemplate {
  const promptMap: Record<string, Record<string, PromptTemplate>> = {
    hashtag: HASHTAG_PROMPTS,
    eyecatch: EYECATCH_PROMPTS,
    'full-analysis': FULL_ANALYSIS_PROMPTS,
    title: TITLE_PROMPTS,
    seo: SEO_PROMPTS,
    improvement: IMPROVEMENT_PROMPTS,
  };

  const categoryPrompts = promptMap[category];
  if (!categoryPrompts) {
    throw new Error(`Unknown prompt category: ${category}`);
  }

  const prompt = categoryPrompts[variant as keyof typeof categoryPrompts];
  if (!prompt) {
    throw new Error(
      `Unknown prompt variant: ${variant} for category: ${category}`
    );
  }

  return prompt;
}

/**
 * List available prompt variants for a category
 *
 * @param category - Prompt category
 * @returns Array of variant names
 *
 * @example
 * ```typescript
 * const variants = listPromptVariants('hashtag');
 * console.log(variants); // ['DEFAULT_JA', 'DEFAULT_EN', 'SEO_OPTIMIZED_JA']
 * ```
 */
export function listPromptVariants(
  category: 'hashtag' | 'eyecatch' | 'full-analysis' | 'title' | 'seo' | 'improvement'
): string[] {
  const promptMap: Record<string, Record<string, PromptTemplate>> = {
    hashtag: HASHTAG_PROMPTS,
    eyecatch: EYECATCH_PROMPTS,
    'full-analysis': FULL_ANALYSIS_PROMPTS,
    title: TITLE_PROMPTS,
    seo: SEO_PROMPTS,
    improvement: IMPROVEMENT_PROMPTS,
  };

  return Object.keys(promptMap[category] || {});
}
