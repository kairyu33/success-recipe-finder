/**
 * Prompt System Configuration
 *
 * @description Central configuration for the prompt management system
 * Controls versioning, caching, validation, and feature flags
 */

import type { RegistryConfig } from './types';

/**
 * Default prompt system configuration
 *
 * @description Controls behavior of the prompt management system:
 * - defaultVersion: Which prompt version to use when not specified
 * - defaultLanguage: Which language to use when not specified
 * - enableExperiments: Whether to enable A/B testing experiments
 * - cachingEnabled: Whether to use prompt caching for cost optimization
 * - validationEnabled: Whether to validate prompts before use
 * - performanceTracking: Whether to track prompt performance metrics
 * - loggingEnabled: Whether to log prompt usage for analytics
 */
export const promptConfig: RegistryConfig = {
  /**
   * Default prompt version
   * - v1: Production-stable prompts
   * - v2: Experimental/testing prompts
   * - v3: Future versions
   */
  defaultVersion: 'v1',

  /**
   * Default language for prompts
   * - ja: Japanese (primary language for note.com)
   * - en: English
   */
  defaultLanguage: 'ja',

  /**
   * Enable A/B testing experiments
   * Set to false in production until experiments are ready
   */
  enableExperiments: false,

  /**
   * Enable prompt caching
   * Reduces costs by 90% on repeat calls with same system prompts
   * Should be enabled in production
   */
  cachingEnabled: true,

  /**
   * Enable prompt validation
   * Validates prompts before use to catch errors early
   * Can be disabled in production for performance if needed
   */
  validationEnabled: true,

  /**
   * Enable performance tracking
   * Tracks token usage, response times, success rates
   * Useful for optimization but adds slight overhead
   */
  performanceTracking: true,

  /**
   * Enable prompt usage logging
   * Logs which prompts are used for analytics
   * Can be disabled for privacy or performance
   */
  loggingEnabled: process.env.NODE_ENV === 'development',
};

/**
 * Environment-specific configuration overrides
 *
 * @description Automatically applies based on NODE_ENV
 */
export const environmentConfig = {
  development: {
    validationEnabled: true,
    loggingEnabled: true,
    enableExperiments: false,
  },
  production: {
    validationEnabled: true,
    loggingEnabled: false,
    enableExperiments: false,
  },
  test: {
    validationEnabled: true,
    loggingEnabled: false,
    enableExperiments: true,
    cachingEnabled: false, // Disable caching in tests for consistency
  },
} as const;

/**
 * Get configuration for current environment
 *
 * @returns Configuration object for current NODE_ENV
 */
export function getEnvironmentConfig(): Partial<RegistryConfig> {
  const env = process.env.NODE_ENV as keyof typeof environmentConfig;
  return environmentConfig[env] || environmentConfig.development;
}

/**
 * Merge default config with environment overrides
 *
 * @returns Final configuration with environment overrides applied
 */
export function getFinalConfig(): RegistryConfig {
  return {
    ...promptConfig,
    ...getEnvironmentConfig(),
  };
}
