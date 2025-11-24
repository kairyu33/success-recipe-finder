/**
 * Services Index
 *
 * @description Central export point for all services.
 * Provides convenient imports for consumers.
 *
 * @example
 * ```typescript
 * // Instead of:
 * import { HashtagService } from '@/app/services/analysis/HashtagService';
 * import { createAIService } from '@/app/services/ai/AIServiceFactory';
 *
 * // You can use:
 * import { HashtagService, createAIService } from '@/app/services';
 * ```
 */

// AI Services
export { AIServiceFactory, createAIService, createAutoAIService } from './ai/AIServiceFactory';
export { AnthropicService } from './ai/AnthropicService';
export type {
  IAIService,
  AIModelConfig,
  AIMessage,
  AICompletionRequest,
  AICompletionResponse,
  TokenUsage,
} from './ai/AIService.interface';
export {
  AIServiceError,
  AIServiceConfigurationError,
  AIServiceRateLimitError,
  AIServiceValidationError,
} from './ai/AIService.interface';

// Analysis Services
export { BaseAnalysisService } from './analysis/BaseAnalysisService';
export { HashtagService } from './analysis/HashtagService';
// export { EyeCatchService } from './analysis/EyeCatchService';  // To be implemented
// export { ArticleAnalysisService } from './analysis/ArticleAnalysisService';  // To be implemented

export type {
  BaseAnalysisRequest,
  HashtagRequest,
  HashtagResult,
  EyeCatchRequest,
  EyeCatchResult,
  FullAnalysisRequest,
  FullAnalysisResult,
  AnalysisOptions,
} from './analysis/types';
export {
  AnalysisServiceError,
  AnalysisValidationError,
  AnalysisParsingError,
} from './analysis/types';

// Cache Services
// export { CacheServiceFactory, createCacheService } from './cache/CacheServiceFactory';
export { MemoryCacheService } from './cache/MemoryCacheService';
export type {
  ICacheService,
  CacheSetOptions,
  CacheStats,
} from './cache/CacheService.interface';
export {
  CacheServiceError,
  generateCacheKey,
  hashObject,
} from './cache/CacheService.interface';

// Configuration
export {
  HASHTAG_PROMPTS,
  EYECATCH_PROMPTS,
  FULL_ANALYSIS_PROMPTS,
  TITLE_PROMPTS,
  getPromptTemplate,
  listPromptVariants,
} from './config/PromptTemplates';
export type { PromptTemplate } from './config/PromptTemplates';

export {
  MODEL_CONFIGS,
  TASK_MODEL_RECOMMENDATIONS,
  getModelConfig,
  getRecommendedModel,
  listAvailableModels,
  estimateTaskCost,
  getDefaultModel,
  validateModelFeatures,
} from './config/ModelConfig';
export type { ModelConfiguration } from './config/ModelConfig';
