/**
 * Analysis Service Types
 *
 * @description Type definitions for all analysis services including
 * hashtag generation, eye-catch creation, full article analysis, and SEO optimization.
 */

/**
 * Base analysis request
 */
export interface BaseAnalysisRequest {
  /** Article text to analyze */
  articleText: string;
  /** Optional language hint (defaults to 'ja') */
  language?: 'ja' | 'en';
  /** Optional metadata */
  metadata?: {
    title?: string;
    author?: string;
    tags?: string[];
    [key: string]: any;
  };
}

/**
 * Hashtag generation result
 */
export interface HashtagResult {
  /** Array of generated hashtags with # prefix */
  hashtags: string[];
  /** Token usage for cost tracking */
  usage?: {
    inputTokens: number;
    outputTokens: number;
    totalCost: number;
    cacheReadInputTokens?: number;
  };
}

/**
 * Eye-catch image generation result
 */
export interface EyeCatchResult {
  /** DALL-E/Midjourney-ready English prompt */
  imagePrompt: string;
  /** Alternative composition ideas (3-5 items) */
  compositionIdeas: string[];
  /** 100-character summary */
  summary: string;
  /** Optional color palette */
  colorPalette?: string[];
  /** Optional mood/style descriptors */
  mood?: string;
  style?: string;
  /** Token usage for cost tracking */
  usage?: {
    inputTokens: number;
    outputTokens: number;
    totalCost: number;
    cacheReadInputTokens?: number;
  };
}

/**
 * Article insights result
 */
export interface ArticleInsights {
  /** What readers will learn (3-5 points) */
  whatYouLearn: string[];
  /** Benefits of reading (3-5 points) */
  benefits: string[];
  /** Recommended target audience (3-5 personas) */
  recommendedFor: string[];
  /** One-liner summary (30-50 characters) */
  oneLiner: string;
}

/**
 * Full article analysis result
 */
export interface FullAnalysisResult {
  /** 5 suggested titles */
  suggestedTitles: string[];
  /** Article insights */
  insights: ArticleInsights;
  /** Eye-catch image data */
  eyeCatchImage: {
    mainPrompt: string;
    compositionIdeas: string[];
    colorPalette: string[];
    mood: string;
    style: string;
    summary: string;
  };
  /** 20 hashtags */
  hashtags: string[];
  /** Token usage for cost tracking */
  usage?: {
    inputTokens: number;
    outputTokens: number;
    totalCost: number;
    cacheReadInputTokens?: number;
  };
}

/**
 * Analysis options
 */
export interface AnalysisOptions {
  /** Whether to use caching */
  useCache?: boolean;
  /** Custom temperature for AI model */
  temperature?: number;
  /** Maximum tokens for output */
  maxTokens?: number;
  /** AI model to use */
  model?: string;
  /** Custom prompt template */
  customPrompt?: string;
}

/**
 * Hashtag generation request
 */
export interface HashtagRequest extends BaseAnalysisRequest {
  /** Number of hashtags to generate (default: 20) */
  count?: number;
  /** Analysis options */
  options?: AnalysisOptions;
}

/**
 * Eye-catch generation request
 */
export interface EyeCatchRequest extends BaseAnalysisRequest {
  /** Number of composition ideas (default: 3-5) */
  compositionCount?: number;
  /** Whether to include color palette */
  includeColorPalette?: boolean;
  /** Analysis options */
  options?: AnalysisOptions;
}

/**
 * Full analysis request
 */
export interface FullAnalysisRequest extends BaseAnalysisRequest {
  /** Number of title suggestions (default: 5) */
  titleCount?: number;
  /** Number of hashtags (default: 20) */
  hashtagCount?: number;
  /** Analysis options */
  options?: AnalysisOptions;
}

/**
 * Analysis service error
 */
export class AnalysisServiceError extends Error {
  constructor(
    message: string,
    public readonly serviceName: string,
    public readonly originalError?: Error
  ) {
    super(message);
    this.name = 'AnalysisServiceError';
    Object.setPrototypeOf(this, AnalysisServiceError.prototype);
  }
}

/**
 * Validation error for analysis requests
 */
export class AnalysisValidationError extends AnalysisServiceError {
  constructor(serviceName: string, message: string) {
    super(message, serviceName);
    this.name = 'AnalysisValidationError';
    Object.setPrototypeOf(this, AnalysisValidationError.prototype);
  }
}

/**
 * Error when analysis parsing fails
 */
export class AnalysisParsingError extends AnalysisServiceError {
  constructor(
    serviceName: string,
    message: string,
    public readonly rawResponse?: string
  ) {
    super(message, serviceName);
    this.name = 'AnalysisParsingError';
    Object.setPrototypeOf(this, AnalysisParsingError.prototype);
  }
}

/**
 * Improvement analysis request
 */
export interface ImprovementRequest extends BaseAnalysisRequest {
  /** Analysis options */
  options?: AnalysisOptions;
}

/**
 * Clarity improvement suggestion
 */
export interface ClarityImprovement {
  /** Original complex phrase */
  original: string;
  /** Suggested simplified phrase */
  suggested: string;
  /** Reason for the improvement */
  reason: string;
}

/**
 * Action item for improvement
 */
export interface ActionItem {
  /** Priority level */
  priority: 'high' | 'medium' | 'low';
  /** Category of the improvement */
  category: string;
  /** Specific suggestion */
  suggestion: string;
  /** Expected impact */
  impact: string;
}

/**
 * Improvement analysis result
 */
export interface ImprovementResult {
  /** Overall evaluation */
  overall: {
    /** Overall score (0-100) */
    score: number;
    /** Article strengths */
    strengths: string[];
    /** Article weaknesses */
    weaknesses: string[];
  };
  /** Structure analysis */
  structure: {
    /** Structure score (0-100) */
    score: number;
    /** Structure improvement suggestions */
    suggestions: string[];
    /** Optional examples */
    examples?: string[];
  };
  /** Content analysis */
  content: {
    /** Content score (0-100) */
    score: number;
    /** More engaging hooks */
    hooks: string[];
    /** Better paragraph transitions */
    transitions: string[];
    /** Stronger conclusions */
    conclusions: string[];
  };
  /** Engagement analysis */
  engagement: {
    /** Engagement score (0-100) */
    score: number;
    /** Emotional appeal elements */
    addEmotionalAppeal: string[];
    /** Storytelling elements */
    addStorytelling: string[];
    /** Concrete examples to add */
    addExamples: string[];
    /** Engaging questions */
    addQuestions: string[];
  };
  /** Clarity analysis */
  clarity: {
    /** Clarity score (0-100) */
    score: number;
    /** Phrases to simplify */
    simplifyPhrases: ClarityImprovement[];
    /** Long sentences to split */
    splitSentences: string[];
  };
  /** SEO optimizations */
  seoOptimizations: {
    /** Keywords to add */
    addKeywords: string[];
    /** Heading improvements */
    improveHeadings: string[];
    /** Internal link suggestions */
    addInternalLinks: string[];
  };
  /** Priority-ordered action items */
  actionItems: ActionItem[];
  /** Token usage for cost tracking */
  usage?: {
    inputTokens: number;
    outputTokens: number;
    totalCost: number;
    cacheReadInputTokens?: number;
  };
}

// Re-export SEO types from SEOService for convenience
export type {
  SEOAnalysisRequest,
  SEOAnalysisResult,
  KeywordAnalysis,
  ReadabilityMetrics,
  ContentStructure,
  SEOImprovements,
} from './SEOService';
