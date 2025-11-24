/**
 * AI Service Factory
 *
 * @description Factory for creating AI service instances based on provider name.
 * Implements the Factory pattern to abstract away service instantiation details.
 * Makes it easy to add new AI providers without modifying consumer code.
 *
 * @example
 * ```typescript
 * // Create default provider
 * const service = AIServiceFactory.create();
 *
 * // Create specific provider
 * const anthropicService = AIServiceFactory.create('anthropic');
 * const openaiService = AIServiceFactory.create('openai');
 *
 * // Get available providers
 * const providers = AIServiceFactory.getAvailableProviders();
 * ```
 */

import type { IAIService } from './AIService.interface';
import { AnthropicService } from './AnthropicService';
// Future imports:
// import { OpenAIService } from './OpenAIService';
// import { GoogleService } from './GoogleService';

/**
 * Supported AI provider types
 */
export type AIProvider = 'anthropic' | 'openai' | 'google';

/**
 * Default provider configuration
 */
const DEFAULT_PROVIDER: AIProvider = 'anthropic';

/**
 * AI Service Factory
 *
 * @description Centralized factory for creating AI service instances.
 * Provides a single point of control for AI provider instantiation.
 */
export class AIServiceFactory {
  /**
   * Registry of available providers
   */
  private static providers: Map<AIProvider, () => IAIService> = new Map([
    ['anthropic', () => new AnthropicService()],
    // Future providers:
    // ['openai', () => new OpenAIService()],
    // ['google', () => new GoogleService()],
  ]);

  /**
   * Create an AI service instance
   *
   * @param provider - Provider name (defaults to configured or 'anthropic')
   * @param apiKey - Optional API key override
   * @returns AI service instance
   * @throws {Error} When provider is not supported
   *
   * @example
   * ```typescript
   * // Use default provider
   * const service = AIServiceFactory.create();
   *
   * // Use specific provider
   * const anthropic = AIServiceFactory.create('anthropic');
   *
   * // Use with custom API key
   * const service = AIServiceFactory.create('anthropic', 'sk-...');
   * ```
   */
  static create(provider?: AIProvider, apiKey?: string): IAIService {
    const selectedProvider = provider || this.getDefaultProvider();

    const factory = this.providers.get(selectedProvider);

    if (!factory) {
      throw new Error(
        `Unsupported AI provider: ${selectedProvider}. Available providers: ${this.getAvailableProviders().join(', ')}`
      );
    }

    const service = factory();

    // If API key is provided, recreate service with that key
    if (apiKey && selectedProvider === 'anthropic') {
      return new AnthropicService(apiKey);
    }

    return service;
  }

  /**
   * Get the default AI provider from environment or fallback
   *
   * @returns Default provider name
   *
   * @example
   * ```typescript
   * const defaultProvider = AIServiceFactory.getDefaultProvider();
   * console.log(`Using provider: ${defaultProvider}`);
   * ```
   */
  static getDefaultProvider(): AIProvider {
    const envProvider = process.env.DEFAULT_AI_PROVIDER?.toLowerCase();

    if (envProvider && this.providers.has(envProvider as AIProvider)) {
      return envProvider as AIProvider;
    }

    return DEFAULT_PROVIDER;
  }

  /**
   * Get list of available AI providers
   *
   * @returns Array of provider names
   *
   * @example
   * ```typescript
   * const providers = AIServiceFactory.getAvailableProviders();
   * console.log('Available providers:', providers); // ['anthropic', 'openai', 'google']
   * ```
   */
  static getAvailableProviders(): AIProvider[] {
    return Array.from(this.providers.keys());
  }

  /**
   * Check if a provider is supported
   *
   * @param provider - Provider name to check
   * @returns True if provider is supported
   *
   * @example
   * ```typescript
   * if (AIServiceFactory.isProviderSupported('anthropic')) {
   *   // Use Anthropic
   * }
   * ```
   */
  static isProviderSupported(provider: string): boolean {
    return this.providers.has(provider as AIProvider);
  }

  /**
   * Register a new AI provider
   *
   * @description Allows dynamic registration of custom AI providers.
   * Useful for testing or adding proprietary AI services.
   *
   * @param provider - Provider name
   * @param factory - Factory function to create service instance
   *
   * @example
   * ```typescript
   * // Register a custom provider
   * AIServiceFactory.registerProvider('custom', () => new CustomAIService());
   *
   * // Use the custom provider
   * const service = AIServiceFactory.create('custom');
   * ```
   */
  static registerProvider(provider: AIProvider, factory: () => IAIService): void {
    this.providers.set(provider, factory);
  }

  /**
   * Create a service instance with automatic provider selection
   *
   * @description Attempts to create a service based on available API keys
   * in environment variables. Falls back to default provider.
   *
   * @returns AI service instance
   *
   * @example
   * ```typescript
   * // Automatically selects provider based on available API keys
   * const service = AIServiceFactory.createAuto();
   * ```
   */
  static createAuto(): IAIService {
    // Check which API keys are available
    if (process.env.ANTHROPIC_API_KEY) {
      return this.create('anthropic');
    }

    // Future: Check for other providers
    // if (process.env.OPENAI_API_KEY) {
    //   return this.create('openai');
    // }
    //
    // if (process.env.GOOGLE_AI_KEY) {
    //   return this.create('google');
    // }

    // Fallback to default
    return this.create();
  }
}

/**
 * Convenience function to create AI service
 *
 * @param provider - Optional provider name
 * @returns AI service instance
 *
 * @example
 * ```typescript
 * import { createAIService } from './AIServiceFactory';
 *
 * const service = createAIService();
 * const response = await service.generateCompletion(...);
 * ```
 */
export function createAIService(provider?: AIProvider): IAIService {
  return AIServiceFactory.create(provider);
}

/**
 * Convenience function to create AI service with auto-detection
 *
 * @returns AI service instance
 *
 * @example
 * ```typescript
 * import { createAutoAIService } from './AIServiceFactory';
 *
 * const service = createAutoAIService();
 * ```
 */
export function createAutoAIService(): IAIService {
  return AIServiceFactory.createAuto();
}
