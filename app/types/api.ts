/**
 * Type definitions for API responses and requests
 *
 * @description This file contains all TypeScript types used across the application
 * for type-safe communication between frontend and API endpoints
 */

/**
 * Eye-catch image generation data
 */
export interface EyeCatchData {
  /** DALL-E-ready English prompt for image generation */
  imagePrompt: string;
  /** Alternative visual composition suggestions (3-5 items) */
  compositionIdeas: string[];
  /** 100-character Japanese summary of the article */
  summary: string;
}

/**
 * Complete article analysis response
 */
export interface ArticleAnalysisResponse {
  /** Array of 20 generated hashtags with # prefix */
  hashtags: string[];
  /** Eye-catch image generation data */
  eyeCatch: EyeCatchData;
  /** Error message if request failed */
  error?: string;
}

/**
 * Hashtag generation response (legacy endpoint)
 */
export interface HashtagResponse {
  /** Array of generated hashtags */
  hashtags: string[];
  /** Error message if request failed */
  error?: string;
}

/**
 * Eye-catch generation response
 */
export interface EyeCatchResponse {
  /** Eye-catch image generation data */
  eyeCatch: EyeCatchData;
  /** Error message if request failed */
  error?: string;
}

/**
 * Request body for article analysis
 */
export interface ArticleAnalysisRequest {
  /** Article text content to analyze */
  articleText: string;
}
