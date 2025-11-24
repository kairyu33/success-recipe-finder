/**
 * SEO Configuration
 *
 * @description Configuration settings for SEO analysis feature.
 * Centralizes SEO-related constants and thresholds.
 */

/**
 * SEO Feature Configuration
 */
export const seoConfig = {
  /**
   * Enable/disable SEO analysis feature globally
   */
  enabled: true,

  /**
   * Include SEO analysis in full article analysis by default
   */
  includeInFullAnalysis: false, // Set to true to enable by default

  /**
   * Meta Description Settings
   */
  metaDescription: {
    /** Minimum length for meta description */
    minLength: 150,
    /** Maximum length for meta description */
    maxLength: 160,
    /** Ideal length for meta description */
    idealLength: 155,
  },

  /**
   * Title Settings
   */
  title: {
    /** Minimum length for article title */
    minLength: 20,
    /** Maximum length for article title */
    maxLength: 60,
    /** Ideal length for article title */
    idealLength: 50,
  },

  /**
   * Content Length Settings
   */
  content: {
    /** Minimum word count for good SEO */
    minWordCount: 300,
    /** Ideal word count for comprehensive content */
    idealWordCount: 1000,
    /** Maximum recommended word count */
    maxWordCount: 5000,
  },

  /**
   * Readability Settings
   */
  readability: {
    /** Minimum readability score (0-100) */
    minScore: 40,
    /** Target readability score */
    targetScore: 60,
    /** Ideal readability score */
    idealScore: 80,
  },

  /**
   * Keyword Density Settings (percentage)
   */
  keywordDensity: {
    /** Minimum keyword density */
    min: 0.5,
    /** Maximum keyword density */
    max: 2.5,
    /** Ideal keyword density */
    ideal: 1.5,
  },

  /**
   * Structure Settings
   */
  structure: {
    /** Minimum number of headings */
    minHeadings: 2,
    /** Ideal number of headings for long content */
    idealHeadings: 5,
    /** Minimum number of paragraphs */
    minParagraphs: 3,
    /** Maximum recommended paragraph length */
    maxParagraphLength: 300,
  },

  /**
   * Image Optimization Settings
   */
  images: {
    /** Recommended minimum number of images */
    minCount: 1,
    /** Recommended ideal number of images */
    idealCount: 3,
    /** Recommended maximum number of images */
    maxCount: 10,
  },

  /**
   * Score Thresholds for Letter Grades
   */
  gradeThresholds: {
    A: 80, // 80-100
    B: 60, // 60-79
    C: 40, // 40-59
    D: 20, // 20-39
    F: 0, // 0-19
  },

  /**
   * Analysis Options
   */
  analysis: {
    /** Use caching by default */
    useCache: true,
    /** Temperature for AI model (lower = more consistent) */
    temperature: 0.3,
    /** Maximum tokens for SEO analysis */
    maxTokens: 2000,
  },

  /**
   * note.com Specific Settings
   */
  noteCom: {
    /** Popular categories on note.com */
    popularCategories: [
      'テクノロジー',
      'ビジネス',
      'エンタメ',
      'ライフスタイル',
      'デザイン',
      'マーケティング',
      'プログラミング',
      '起業',
      '働き方',
      'クリエイター',
    ],
    /** Recommended hashtag count for note.com */
    recommendedHashtagCount: 20,
    /** Platform-specific SEO tips */
    platformTips: [
      'note.comは記事タイトルがURLに含まれるため、キーワードを含めることが重要',
      'ハッシュタグは検索とカテゴリ分類の両方に使用される',
      'アイキャッチ画像はSNSシェア時に表示されるため必須',
      '最初の100文字がSNSプレビューに表示されるため、魅力的な導入を',
      'note.com内検索とGoogle検索の両方を意識したキーワード選定を',
    ],
  },

  /**
   * Validation Rules
   */
  validation: {
    /** Minimum article text length */
    minArticleLength: 50,
    /** Maximum article text length */
    maxArticleLength: 50000,
    /** Minimum title length */
    minTitleLength: 10,
    /** Maximum title length */
    maxTitleLength: 100,
    /** Minimum keyword length */
    minKeywordLength: 2,
    /** Maximum keyword length */
    maxKeywordLength: 50,
  },

  /**
   * Cost Estimation
   */
  cost: {
    /** Estimated prompt tokens for SEO analysis */
    estimatedPromptTokens: 500,
    /** Estimated output tokens for SEO analysis */
    estimatedOutputTokens: 800,
  },
} as const;

/**
 * Get SEO score color based on grade
 *
 * @param grade - Letter grade (A/B/C/D/F)
 * @returns Color class or hex code
 *
 * @example
 * ```typescript
 * const color = getScoreColor('A'); // 'green'
 * ```
 */
export function getScoreColor(grade: 'A' | 'B' | 'C' | 'D' | 'F'): string {
  const colorMap = {
    A: 'green',
    B: 'blue',
    C: 'yellow',
    D: 'orange',
    F: 'red',
  };
  return colorMap[grade];
}

/**
 * Get SEO score tailwind classes based on grade
 *
 * @param grade - Letter grade (A/B/C/D/F)
 * @returns Tailwind CSS classes
 *
 * @example
 * ```typescript
 * const classes = getScoreTailwindClasses('A'); // 'bg-green-100 text-green-800'
 * ```
 */
export function getScoreTailwindClasses(grade: 'A' | 'B' | 'C' | 'D' | 'F'): string {
  const classMap = {
    A: 'bg-green-100 text-green-800 border-green-300',
    B: 'bg-blue-100 text-blue-800 border-blue-300',
    C: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    D: 'bg-orange-100 text-orange-800 border-orange-300',
    F: 'bg-red-100 text-red-800 border-red-300',
  };
  return classMap[grade];
}

/**
 * Get improvement priority badge classes
 *
 * @param priority - Improvement priority (critical/important/optional)
 * @returns Tailwind CSS classes
 *
 * @example
 * ```typescript
 * const classes = getImprovementBadgeClasses('critical'); // 'bg-red-100 text-red-800'
 * ```
 */
export function getImprovementBadgeClasses(
  priority: 'critical' | 'important' | 'optional'
): string {
  const classMap = {
    critical: 'bg-red-100 text-red-800 border-red-300',
    important: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    optional: 'bg-blue-100 text-blue-800 border-blue-300',
  };
  return classMap[priority];
}

/**
 * Get improvement priority label
 *
 * @param priority - Improvement priority
 * @param language - Language for label (ja/en)
 * @returns Localized label
 */
export function getImprovementLabel(
  priority: 'critical' | 'important' | 'optional',
  language: 'ja' | 'en' = 'ja'
): string {
  const labels = {
    ja: {
      critical: '最優先',
      important: '重要',
      optional: '任意',
    },
    en: {
      critical: 'Critical',
      important: 'Important',
      optional: 'Optional',
    },
  };
  return labels[language][priority];
}

/**
 * Format SEO score for display
 *
 * @param score - SEO score (0-100)
 * @returns Formatted score string
 *
 * @example
 * ```typescript
 * const formatted = formatSEOScore(85); // "85/100"
 * ```
 */
export function formatSEOScore(score: number): string {
  return `${Math.round(score)}/100`;
}

/**
 * Check if SEO analysis is enabled
 *
 * @returns True if enabled
 */
export function isSEOAnalysisEnabled(): boolean {
  return seoConfig.enabled;
}

/**
 * Get recommended improvements based on score
 *
 * @param score - SEO score (0-100)
 * @param language - Language for recommendations
 * @returns Array of recommendation strings
 */
export function getScoreRecommendations(
  score: number,
  language: 'ja' | 'en' = 'ja'
): string[] {
  const recommendations = {
    ja: {
      excellent: [
        '素晴らしいSEO最適化です！',
        '現在のクオリティを維持してください。',
      ],
      good: [
        '良好なSEO状態です。',
        'さらなる改善の余地があります。',
      ],
      average: [
        'SEO改善の必要があります。',
        '提案された改善点に取り組んでください。',
      ],
      poor: [
        '重大なSEO問題があります。',
        '最優先項目から修正を始めてください。',
      ],
      veryPoor: [
        'SEOの全面的な見直しが必要です。',
        '構造、キーワード、コンテンツ品質を改善してください。',
      ],
    },
    en: {
      excellent: ['Excellent SEO optimization!', 'Keep up the great work.'],
      good: ['Good SEO status.', 'Room for further improvement.'],
      average: ['SEO improvements needed.', 'Address the suggested issues.'],
      poor: ['Critical SEO issues found.', 'Start with high-priority fixes.'],
      veryPoor: [
        'Comprehensive SEO overhaul needed.',
        'Improve structure, keywords, and content quality.',
      ],
    },
  };

  if (score >= 80) return recommendations[language].excellent;
  if (score >= 60) return recommendations[language].good;
  if (score >= 40) return recommendations[language].average;
  if (score >= 20) return recommendations[language].poor;
  return recommendations[language].veryPoor;
}
