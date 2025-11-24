/**
 * Type definitions for article analysis features
 *
 * @description Comprehensive types for the note.com article analysis system
 * including all analysis outputs and UI state management
 */

/**
 * Eye-catch image generation metadata
 *
 * @property imagePrompt - Detailed English prompt for AI image generation (DALL-E, Midjourney, etc.)
 * @property compositionIdeas - Array of composition suggestions in Japanese
 * @property colors - Array of color codes or names for the visual theme
 * @property mood - Overall mood/atmosphere description
 */
export interface EyeCatchData {
  imagePrompt: string;
  compositionIdeas: string[];
  colors: string[];
  mood: string;
}

/**
 * Complete article analysis response
 *
 * @description Contains all analysis outputs from Claude AI for optimizing note.com articles
 */
export interface ArticleAnalysisResponse {
  /** Array of 20 optimized hashtags with # prefix */
  hashtags: string[];

  /** 3-5 compelling title suggestions optimized for CTR and SEO */
  suggestedTitles: string[];

  /** 3-5 key learning points readers will gain */
  whatYouWillLearn: string[];

  /** 3-5 concrete benefits of reading the article */
  benefits: string[];

  /** 3-5 specific target audience personas */
  targetAudience: string[];

  /** Single sentence capturing the article's essence (30-50 chars) */
  oneLineSummary: string;

  /** Concise summary for eye-catch image overlay (max 100 chars) */
  summary: string;

  /** Eye-catch image generation metadata */
  eyeCatch: EyeCatchData;

  /** Optional error message if analysis partially failed */
  error?: string;
}

/**
 * API error response structure
 */
export interface ApiErrorResponse {
  error: string;
}

/**
 * Loading state for UI components
 */
export interface LoadingState {
  isLoading: boolean;
  stage?: "analyzing" | "generating" | "finalizing";
  progress?: number;
}

/**
 * Copy-to-clipboard state management
 */
export interface CopyState {
  copiedItem: string | null;
  copiedIndex: number | null;
  timestamp: number | null;
}

/**
 * Analysis mode selection
 */
export type AnalysisMode = "hashtags-only" | "full-analysis";

/**
 * UI display preferences
 */
export interface DisplayPreferences {
  showHashtags: boolean;
  showTitles: boolean;
  showLearning: boolean;
  showBenefits: boolean;
  showAudience: boolean;
  showSummary: boolean;
  showEyeCatch: boolean;
}
