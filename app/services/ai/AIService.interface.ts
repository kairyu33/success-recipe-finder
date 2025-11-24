/**
 * AI Service Interface
 *
 * @description Abstract interface defining the contract for all AI service providers.
 * This allows easy integration of multiple AI providers (Anthropic, OpenAI, Google, etc.)
 * following the Strategy pattern.
 *
 * @example
 * ```typescript
 * const aiService: IAIService = AIServiceFactory.create('anthropic');
 * const response = await aiService.generateCompletion({
 *   prompt: 'Generate hashtags for this article...',
 *   maxTokens: 500
 * });
 * ```
 */

/**
 * Model configuration for AI requests
 */
export interface AIModelConfig {
  /** Model identifier (e.g., 'claude-sonnet-4-20250514') */
  model: string;
  /** Maximum tokens to generate */
  maxTokens: number;
  /** Temperature for response randomness (0.0 - 1.0) */
  temperature?: number;
  /** Whether to use prompt caching if available */
  useCache?: boolean;
}

/**
 * Message structure for AI conversations
 */
export interface AIMessage {
  /** Role of the message sender */
  role: 'user' | 'assistant' | 'system';
  /** Content of the message */
  content: string;
  /** Optional cache control settings (for Anthropic) */
  cacheControl?: { type: 'ephemeral' };
}

/**
 * Token usage information for cost tracking
 */
export interface TokenUsage {
  /** Number of input tokens consumed */
  inputTokens: number;
  /** Number of output tokens generated */
  outputTokens: number;
  /** Tokens used to create cache (if applicable) */
  cacheCreationInputTokens?: number;
  /** Tokens read from cache (if applicable) */
  cacheReadInputTokens?: number;
  /** Total cost in USD */
  totalCost: number;
}

/**
 * AI completion request parameters
 */
export interface AICompletionRequest {
  /** System prompt for the AI */
  systemPrompt: string | AIMessage[];
  /** User message or conversation history */
  messages: AIMessage[];
  /** Model configuration */
  config: AIModelConfig;
}

/**
 * AI completion response
 */
export interface AICompletionResponse {
  /** Generated content from the AI */
  content: string;
  /** Token usage statistics */
  usage: TokenUsage;
  /** Response metadata */
  metadata?: {
    finishReason?: string;
    model?: string;
    [key: string]: any;
  };
}

/**
 * AI Service Interface
 *
 * @description Defines the contract that all AI service providers must implement.
 * This ensures consistent behavior across different AI providers and allows
 * for easy swapping of providers without changing consumer code.
 */
export interface IAIService {
  /**
   * Provider name (e.g., 'anthropic', 'openai', 'google')
   */
  readonly provider: string;

  /**
   * Generate a completion from the AI model
   *
   * @param request - Completion request parameters
   * @returns Promise resolving to completion response
   * @throws {AIServiceError} When the AI service encounters an error
   *
   * @example
   * ```typescript
   * const response = await aiService.generateCompletion({
   *   systemPrompt: 'You are a hashtag generator...',
   *   messages: [{ role: 'user', content: 'Article text...' }],
   *   config: { model: 'claude-sonnet-4', maxTokens: 500 }
   * });
   * ```
   */
  generateCompletion(request: AICompletionRequest): Promise<AICompletionResponse>;

  /**
   * Validate that the service is properly configured
   *
   * @returns Promise resolving to true if configured, false otherwise
   * @throws {AIServiceError} When configuration validation fails critically
   *
   * @example
   * ```typescript
   * if (!await aiService.validateConfiguration()) {
   *   throw new Error('AI service not configured');
   * }
   * ```
   */
  validateConfiguration(): Promise<boolean>;

  /**
   * Estimate the cost of a potential request
   *
   * @param estimatedInputTokens - Estimated input tokens
   * @param estimatedOutputTokens - Estimated output tokens
   * @returns Estimated cost in USD
   *
   * @example
   * ```typescript
   * const cost = aiService.estimateCost(1000, 500);
   * console.log(`Estimated cost: $${cost.toFixed(4)}`);
   * ```
   */
  estimateCost(estimatedInputTokens: number, estimatedOutputTokens: number): number;

  /**
   * Get the provider's supported models
   *
   * @returns Array of supported model identifiers
   *
   * @example
   * ```typescript
   * const models = aiService.getSupportedModels();
   * console.log('Available models:', models);
   * ```
   */
  getSupportedModels(): string[];
}

/**
 * Base error class for AI service errors
 *
 * @description Provides a consistent error interface across all AI providers
 */
export class AIServiceError extends Error {
  constructor(
    message: string,
    public readonly provider: string,
    public readonly statusCode?: number,
    public readonly originalError?: Error
  ) {
    super(message);
    this.name = 'AIServiceError';
    Object.setPrototypeOf(this, AIServiceError.prototype);
  }
}

/**
 * Error thrown when API key is missing or invalid
 */
export class AIServiceConfigurationError extends AIServiceError {
  constructor(provider: string, message: string = 'Service not properly configured') {
    super(message, provider);
    this.name = 'AIServiceConfigurationError';
    Object.setPrototypeOf(this, AIServiceConfigurationError.prototype);
  }
}

/**
 * Error thrown when rate limit is exceeded
 */
export class AIServiceRateLimitError extends AIServiceError {
  constructor(
    provider: string,
    message: string = 'Rate limit exceeded',
    public readonly retryAfter?: number
  ) {
    super(message, provider, 429);
    this.name = 'AIServiceRateLimitError';
    Object.setPrototypeOf(this, AIServiceRateLimitError.prototype);
  }
}

/**
 * Error thrown when request validation fails
 */
export class AIServiceValidationError extends AIServiceError {
  constructor(provider: string, message: string) {
    super(message, provider, 400);
    this.name = 'AIServiceValidationError';
    Object.setPrototypeOf(this, AIServiceValidationError.prototype);
  }
}
