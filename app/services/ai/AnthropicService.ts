/**
 * Anthropic AI Service Implementation
 *
 * @description Concrete implementation of IAIService for Anthropic's Claude models.
 * Handles all interactions with the Anthropic API including prompt caching,
 * error handling, and cost estimation.
 *
 * @see https://docs.anthropic.com/claude/reference/messages_post
 */

import Anthropic from '@anthropic-ai/sdk';
import type {
  IAIService,
  AICompletionRequest,
  AICompletionResponse,
  TokenUsage,
  AIMessage,
} from './AIService.interface';
import {
  AIServiceError,
  AIServiceConfigurationError,
  AIServiceRateLimitError,
  AIServiceValidationError,
} from './AIService.interface';

/**
 * Anthropic Claude pricing (as of 2025)
 * Input: $3 per million tokens
 * Output: $15 per million tokens
 * Cached input: $0.30 per million tokens (90% discount)
 */
const ANTHROPIC_PRICING = {
  INPUT_PER_MILLION: 3.0,
  OUTPUT_PER_MILLION: 15.0,
  CACHED_INPUT_PER_MILLION: 0.3,
} as const;

/**
 * Supported Claude models
 */
const SUPPORTED_MODELS = [
  'claude-sonnet-4-20250514',
  'claude-3-5-sonnet-20241022',
  'claude-3-opus-20240229',
  'claude-3-sonnet-20240229',
  'claude-3-haiku-20240307',
] as const;

/**
 * Anthropic AI Service
 *
 * @description Implements the IAIService interface for Anthropic's Claude API.
 * Provides features including:
 * - Prompt caching for cost optimization
 * - Comprehensive error handling
 * - Token usage tracking
 * - Cost estimation
 *
 * @example
 * ```typescript
 * const service = new AnthropicService();
 * const response = await service.generateCompletion({
 *   systemPrompt: 'You are a helpful assistant',
 *   messages: [{ role: 'user', content: 'Hello!' }],
 *   config: { model: 'claude-sonnet-4-20250514', maxTokens: 1000 }
 * });
 * ```
 */
export class AnthropicService implements IAIService {
  public readonly provider = 'anthropic';
  private client: Anthropic | null = null;
  private apiKey: string | undefined;

  /**
   * Initialize Anthropic service
   *
   * @param apiKey - Optional API key (defaults to ANTHROPIC_API_KEY env var)
   */
  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.ANTHROPIC_API_KEY;

    if (this.apiKey) {
      this.client = new Anthropic({ apiKey: this.apiKey });
    }
  }

  /**
   * Validate that the service is properly configured
   *
   * @returns Promise resolving to true if configured
   * @throws {AIServiceConfigurationError} When API key is missing
   */
  async validateConfiguration(): Promise<boolean> {
    if (!this.apiKey || !this.client) {
      throw new AIServiceConfigurationError(
        this.provider,
        'ANTHROPIC_API_KEY is not configured. Please set it in .env.local'
      );
    }
    return true;
  }

  /**
   * Generate a completion from Claude
   *
   * @param request - Completion request parameters
   * @returns Promise resolving to completion response
   * @throws {AIServiceError} When the API call fails
   *
   * @example
   * ```typescript
   * const response = await service.generateCompletion({
   *   systemPrompt: [
   *     { role: 'system', content: 'Instructions...', cacheControl: { type: 'ephemeral' } }
   *   ],
   *   messages: [{ role: 'user', content: 'User input...' }],
   *   config: {
   *     model: 'claude-sonnet-4-20250514',
   *     maxTokens: 500,
   *     temperature: 0.7,
   *     useCache: true
   *   }
   * });
   * ```
   */
  async generateCompletion(request: AICompletionRequest): Promise<AICompletionResponse> {
    await this.validateConfiguration();

    if (!this.client) {
      throw new AIServiceConfigurationError(this.provider, 'Client not initialized');
    }

    // Validate request
    this.validateRequest(request);

    try {
      // Prepare system prompt
      const systemPrompt = this.prepareSystemPrompt(request.systemPrompt, request.config.useCache);

      // Convert messages to Anthropic format
      const messages = request.messages.map((msg) => ({
        role: msg.role === 'user' ? 'user' as const : 'assistant' as const,
        content: msg.content,
      }));

      // Make API call
      const response = await this.client.messages.create({
        model: request.config.model,
        max_tokens: request.config.maxTokens,
        temperature: request.config.temperature ?? 0.7,
        system: systemPrompt,
        messages,
      });

      // Extract content
      const content = response.content[0];
      if (content.type !== 'text') {
        throw new AIServiceError(
          'Unexpected response type from Claude',
          this.provider
        );
      }

      // Calculate usage and cost
      const usage = this.calculateUsage(response.usage);

      // Log usage for monitoring
      this.logUsage(request.config.model, usage);

      return {
        content: content.text,
        usage,
        metadata: {
          finishReason: response.stop_reason || undefined,
          model: response.model,
          messageId: response.id,
        },
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Estimate the cost of a request
   *
   * @param estimatedInputTokens - Estimated input tokens
   * @param estimatedOutputTokens - Estimated output tokens
   * @returns Estimated cost in USD
   *
   * @example
   * ```typescript
   * const cost = service.estimateCost(1000, 500);
   * console.log(`Estimated: $${cost.toFixed(4)}`);
   * ```
   */
  estimateCost(estimatedInputTokens: number, estimatedOutputTokens: number): number {
    const inputCost = (estimatedInputTokens / 1_000_000) * ANTHROPIC_PRICING.INPUT_PER_MILLION;
    const outputCost = (estimatedOutputTokens / 1_000_000) * ANTHROPIC_PRICING.OUTPUT_PER_MILLION;
    return inputCost + outputCost;
  }

  /**
   * Get supported Claude models
   *
   * @returns Array of supported model identifiers
   */
  getSupportedModels(): string[] {
    return [...SUPPORTED_MODELS];
  }

  /**
   * Prepare system prompt with optional caching
   *
   * @param systemPrompt - System prompt string or messages
   * @param useCache - Whether to enable prompt caching
   * @returns Formatted system prompt
   */
  private prepareSystemPrompt(
    systemPrompt: string | AIMessage[],
    useCache?: boolean
  ): Array<{ type: 'text'; text: string; cache_control?: { type: 'ephemeral' } }> {
    if (typeof systemPrompt === 'string') {
      return [
        {
          type: 'text',
          text: systemPrompt,
          ...(useCache && { cache_control: { type: 'ephemeral' } }),
        },
      ];
    }

    return systemPrompt.map((msg) => ({
      type: 'text' as const,
      text: msg.content,
      ...(msg.cacheControl && { cache_control: msg.cacheControl }),
    }));
  }

  /**
   * Calculate token usage and cost
   *
   * @param usage - Raw usage data from Anthropic API
   * @returns Formatted token usage with cost
   */
  private calculateUsage(usage: Anthropic.Messages.Usage): TokenUsage {
    const inputCost =
      (usage.input_tokens / 1_000_000) * ANTHROPIC_PRICING.INPUT_PER_MILLION;
    const outputCost =
      (usage.output_tokens / 1_000_000) * ANTHROPIC_PRICING.OUTPUT_PER_MILLION;

    let cachedInputCost = 0;
    if (usage.cache_read_input_tokens) {
      cachedInputCost =
        (usage.cache_read_input_tokens / 1_000_000) * ANTHROPIC_PRICING.CACHED_INPUT_PER_MILLION;
    }

    const totalCost = inputCost + outputCost + cachedInputCost;

    return {
      inputTokens: usage.input_tokens,
      outputTokens: usage.output_tokens,
      cacheCreationInputTokens: usage.cache_creation_input_tokens || 0,
      cacheReadInputTokens: usage.cache_read_input_tokens || 0,
      totalCost,
    };
  }

  /**
   * Log token usage for monitoring
   *
   * @param model - Model identifier
   * @param usage - Token usage data
   */
  private logUsage(model: string, usage: TokenUsage): void {
    console.log(`[Anthropic - ${model}] Token usage:`, {
      input_tokens: usage.inputTokens,
      output_tokens: usage.outputTokens,
      cache_creation_input_tokens: usage.cacheCreationInputTokens,
      cache_read_input_tokens: usage.cacheReadInputTokens,
      total_cost: `$${usage.totalCost?.toFixed(6)}`,
    });
  }

  /**
   * Validate request parameters
   *
   * @param request - Completion request
   * @throws {AIServiceValidationError} When validation fails
   */
  private validateRequest(request: AICompletionRequest): void {
    if (!request.config.model) {
      throw new AIServiceValidationError(this.provider, 'Model is required');
    }

    if (!SUPPORTED_MODELS.includes(request.config.model as any)) {
      throw new AIServiceValidationError(
        this.provider,
        `Unsupported model: ${request.config.model}. Supported models: ${SUPPORTED_MODELS.join(', ')}`
      );
    }

    if (request.config.maxTokens <= 0 || request.config.maxTokens > 8192) {
      throw new AIServiceValidationError(
        this.provider,
        'maxTokens must be between 1 and 8192'
      );
    }

    if (
      request.config.temperature !== undefined &&
      (request.config.temperature < 0 || request.config.temperature > 1)
    ) {
      throw new AIServiceValidationError(
        this.provider,
        'temperature must be between 0 and 1'
      );
    }

    if (!request.messages || request.messages.length === 0) {
      throw new AIServiceValidationError(this.provider, 'At least one message is required');
    }
  }

  /**
   * Handle API errors and convert to AIServiceError
   *
   * @param error - Original error
   * @returns Formatted AIServiceError
   */
  private handleError(error: unknown): AIServiceError {
    if (error instanceof Anthropic.APIError) {
      // Rate limit error
      if (error.status === 429) {
        return new AIServiceRateLimitError(
          this.provider,
          error.message || 'Rate limit exceeded',
          this.extractRetryAfter(error)
        );
      }

      // Other API errors
      return new AIServiceError(
        error.message || 'Anthropic API error',
        this.provider,
        error.status,
        error
      );
    }

    // Unknown error
    if (error instanceof Error) {
      return new AIServiceError(
        error.message || 'Unknown error occurred',
        this.provider,
        undefined,
        error
      );
    }

    return new AIServiceError(
      'An unexpected error occurred',
      this.provider
    );
  }

  /**
   * Extract retry-after header from rate limit error
   *
   * @param error - API error
   * @returns Retry-after value in seconds, or undefined
   */
  private extractRetryAfter(error: InstanceType<typeof Anthropic.APIError>): number | undefined {
    // Anthropic may include retry-after in headers
    // This is a placeholder for actual implementation
    return undefined;
  }
}
