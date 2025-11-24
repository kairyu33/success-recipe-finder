/**
 * AI Model Configuration
 *
 * @description Centralized configuration for AI model settings including
 * token limits, pricing, and recommended parameters for different use cases.
 */

/**
 * Model configuration interface
 */
export interface ModelConfiguration {
  /** Model identifier */
  model: string;
  /** Display name */
  displayName: string;
  /** Provider name */
  provider: 'anthropic' | 'openai' | 'google';
  /** Maximum context window in tokens */
  maxContextTokens: number;
  /** Recommended max output tokens */
  recommendedMaxTokens: number;
  /** Pricing per million tokens */
  pricing: {
    input: number;
    output: number;
    cachedInput?: number;
  };
  /** Whether model supports caching */
  supportsCache: boolean;
  /** Recommended use cases */
  useCases: string[];
  /** Performance tier */
  tier: 'fast' | 'balanced' | 'powerful';
}

/**
 * Available model configurations
 */
export const MODEL_CONFIGS: Record<string, ModelConfiguration> = {
  // Anthropic Claude Models
  'claude-sonnet-4-5-20250929': {
    model: 'claude-sonnet-4-5-20250929',
    displayName: 'Claude Sonnet 4.5',
    provider: 'anthropic',
    maxContextTokens: 200000,
    recommendedMaxTokens: 8192,
    pricing: {
      input: 3.0,
      output: 15.0,
      cachedInput: 0.3,
    },
    supportsCache: true,
    useCases: ['analysis', 'generation', 'translation'],
    tier: 'balanced',
  },

  'claude-3-5-sonnet-20241022': {
    model: 'claude-3-5-sonnet-20241022',
    displayName: 'Claude 3.5 Sonnet',
    provider: 'anthropic',
    maxContextTokens: 200000,
    recommendedMaxTokens: 8192,
    pricing: {
      input: 3.0,
      output: 15.0,
      cachedInput: 0.3,
    },
    supportsCache: true,
    useCases: ['analysis', 'coding', 'reasoning'],
    tier: 'balanced',
  },

  'claude-3-opus-20240229': {
    model: 'claude-3-opus-20240229',
    displayName: 'Claude 3 Opus',
    provider: 'anthropic',
    maxContextTokens: 200000,
    recommendedMaxTokens: 4096,
    pricing: {
      input: 15.0,
      output: 75.0,
      cachedInput: 1.5,
    },
    supportsCache: true,
    useCases: ['complex-reasoning', 'creative-writing'],
    tier: 'powerful',
  },

  'claude-3-haiku-20240307': {
    model: 'claude-3-haiku-20240307',
    displayName: 'Claude 3 Haiku',
    provider: 'anthropic',
    maxContextTokens: 200000,
    recommendedMaxTokens: 4096,
    pricing: {
      input: 0.25,
      output: 1.25,
      cachedInput: 0.03,
    },
    supportsCache: true,
    useCases: ['quick-tasks', 'high-volume'],
    tier: 'fast',
  },

  // Future: OpenAI Models
  // 'gpt-4-turbo': {
  //   model: 'gpt-4-turbo',
  //   displayName: 'GPT-4 Turbo',
  //   provider: 'openai',
  //   maxContextTokens: 128000,
  //   recommendedMaxTokens: 4096,
  //   pricing: {
  //     input: 10.0,
  //     output: 30.0,
  //   },
  //   supportsCache: false,
  //   useCases: ['analysis', 'reasoning'],
  //   tier: 'powerful',
  // },
} as const;

/**
 * Task-specific model recommendations
 */
export const TASK_MODEL_RECOMMENDATIONS = {
  /**
   * Hashtag generation: Fast, low-cost
   */
  'hashtag-generation': {
    primary: 'claude-sonnet-4-5-20250929',
    fallback: 'claude-3-haiku-20240307',
    recommendedMaxTokens: 500,
    recommendedTemperature: 0.7,
  },

  /**
   * Eye-catch generation: Balanced creativity and speed
   */
  'eyecatch-generation': {
    primary: 'claude-sonnet-4-5-20250929',
    fallback: 'claude-3-5-sonnet-20241022',
    recommendedMaxTokens: 800,
    recommendedTemperature: 0.8,
  },

  /**
   * Full article analysis: Comprehensive understanding
   */
  'full-analysis': {
    primary: 'claude-sonnet-4-5-20250929',
    fallback: 'claude-3-5-sonnet-20241022',
    recommendedMaxTokens: 2000,
    recommendedTemperature: 0.7,
  },

  /**
   * Title generation: Creative and engaging
   */
  'title-generation': {
    primary: 'claude-sonnet-4-5-20250929',
    fallback: 'claude-3-5-sonnet-20241022',
    recommendedMaxTokens: 300,
    recommendedTemperature: 0.8,
  },

  /**
   * Article improvement: Detailed analysis and suggestions
   */
  'article-improvement': {
    primary: 'claude-sonnet-4-5-20250929',
    fallback: 'claude-3-5-sonnet-20241022',
    recommendedMaxTokens: 3000,
    recommendedTemperature: 0.7,
  },
} as const;

/**
 * Get model configuration by ID
 *
 * @param modelId - Model identifier
 * @returns Model configuration
 * @throws {Error} When model is not found
 *
 * @example
 * ```typescript
 * const config = getModelConfig('claude-sonnet-4-20250514');
 * console.log(config.displayName); // 'Claude Sonnet 4.5'
 * ```
 */
export function getModelConfig(modelId: string): ModelConfiguration {
  const config = MODEL_CONFIGS[modelId];

  if (!config) {
    throw new Error(
      `Unknown model: ${modelId}. Available models: ${Object.keys(MODEL_CONFIGS).join(', ')}`
    );
  }

  return config;
}

/**
 * Get recommended model for a specific task
 *
 * @param taskType - Type of task
 * @returns Recommended model configuration
 *
 * @example
 * ```typescript
 * const model = getRecommendedModel('hashtag-generation');
 * console.log(model.model); // 'claude-sonnet-4-20250514'
 * ```
 */
export function getRecommendedModel(
  taskType: keyof typeof TASK_MODEL_RECOMMENDATIONS
): {
  config: ModelConfiguration;
  maxTokens: number;
  temperature: number;
} {
  const recommendation = TASK_MODEL_RECOMMENDATIONS[taskType];

  if (!recommendation) {
    throw new Error(`Unknown task type: ${taskType}`);
  }

  const config = getModelConfig(recommendation.primary);

  return {
    config,
    maxTokens: recommendation.recommendedMaxTokens,
    temperature: recommendation.recommendedTemperature,
  };
}

/**
 * List all available models
 *
 * @param provider - Optional provider filter
 * @returns Array of model configurations
 *
 * @example
 * ```typescript
 * const anthropicModels = listAvailableModels('anthropic');
 * console.log(anthropicModels.map(m => m.displayName));
 * ```
 */
export function listAvailableModels(
  provider?: 'anthropic' | 'openai' | 'google'
): ModelConfiguration[] {
  const allModels = Object.values(MODEL_CONFIGS);

  if (provider) {
    return allModels.filter((model) => model.provider === provider);
  }

  return allModels;
}

/**
 * Estimate cost for a task
 *
 * @param modelId - Model identifier
 * @param inputTokens - Estimated input tokens
 * @param outputTokens - Estimated output tokens
 * @param useCachedInput - Whether cached input is used
 * @returns Estimated cost in USD
 *
 * @example
 * ```typescript
 * const cost = estimateTaskCost('claude-sonnet-4-20250514', 1000, 500);
 * console.log(`Estimated cost: $${cost.toFixed(6)}`);
 * ```
 */
export function estimateTaskCost(
  modelId: string,
  inputTokens: number,
  outputTokens: number,
  useCachedInput: boolean = false
): number {
  const config = getModelConfig(modelId);

  const inputPrice = useCachedInput && config.pricing.cachedInput
    ? config.pricing.cachedInput
    : config.pricing.input;

  const inputCost = (inputTokens / 1_000_000) * inputPrice;
  const outputCost = (outputTokens / 1_000_000) * config.pricing.output;

  return inputCost + outputCost;
}

/**
 * Get default model from environment or fallback
 *
 * @returns Default model identifier
 *
 * @example
 * ```typescript
 * const defaultModel = getDefaultModel();
 * console.log(`Using model: ${defaultModel}`);
 * ```
 */
export function getDefaultModel(): string {
  return (
    process.env.DEFAULT_AI_MODEL || 'claude-sonnet-4-5-20250929'
  );
}

/**
 * Validate model supports required features
 *
 * @param modelId - Model identifier
 * @param requiredFeatures - Features to check
 * @returns True if all features are supported
 *
 * @example
 * ```typescript
 * const supportsCache = validateModelFeatures('claude-sonnet-4-20250514', ['cache']);
 * if (!supportsCache) {
 *   console.warn('Model does not support caching');
 * }
 * ```
 */
export function validateModelFeatures(
  modelId: string,
  requiredFeatures: Array<'cache'>
): boolean {
  const config = getModelConfig(modelId);

  for (const feature of requiredFeatures) {
    if (feature === 'cache' && !config.supportsCache) {
      return false;
    }
  }

  return true;
}
