/**
 * Prompt Management System
 *
 * @description Centralized prompt management with version control, A/B testing,
 * and performance tracking
 *
 * @example
 * ```typescript
 * import { getPromptRegistry, PromptBuilder } from '@/app/prompts';
 *
 * // Get a prompt
 * const registry = getPromptRegistry();
 * const template = registry.get('hashtag', { version: 'v1', language: 'ja' });
 *
 * // Build prompt with variables
 * const builder = new PromptBuilder();
 * const prompt = builder.build(template, {
 *   articleText: 'My article content...'
 * });
 *
 * // Use with Anthropic API
 * const message = await anthropic.messages.create({
 *   model: 'claude-sonnet-4-20250514',
 *   ...prompt
 * });
 * ```
 */

// Core types
export type {
  PromptTemplate,
  PromptVariables,
  BuiltPrompt,
  PromptLanguage,
  PromptVersion,
  PromptCategory,
  ValidationResult,
  Experiment,
  ExperimentVariant,
  RegistryConfig,
  GetPromptOptions,
  PromptSelection,
  PerformanceMetrics,
  OutputFormat,
  CacheConfig,
} from './types';

// Core classes
export { PromptBuilder, createPromptBuilder } from './PromptBuilder';
export { PromptRegistry, getPromptRegistry } from './PromptRegistry';
export { ExperimentManager, createExperimentManager } from './experiments/ExperimentManager';

// Configuration
export { promptConfig, getFinalConfig, getEnvironmentConfig } from './prompt.config';

// Validation utilities
export {
  validatePrompt,
  validatePrompts,
  hasIssues,
  formatValidationResult,
} from './validation/validatePrompt';

export {
  estimateTokens,
  estimatePromptTokens,
  estimateCost,
  estimateCostRange,
  isWithinBudget,
  truncateToTokens,
  formatTokenCount,
  formatCost,
} from './validation/estimateTokens';

// Templates (for direct access if needed)
export {
  hashtagPrompts,
  defaultHashtagPrompt,
} from './templates/hashtag.prompts';

export {
  eyecatchPrompts,
  defaultEyecatchPrompt,
} from './templates/eyecatch.prompts';

export {
  analysisPrompts,
  defaultAnalysisPrompt,
} from './templates/analysis.prompts';

export {
  titlePrompts,
  defaultTitlePrompt,
} from './templates/titles.prompts';

// Import for quickStart helper
import { PromptRegistry } from './PromptRegistry';
import { PromptBuilder } from './PromptBuilder';
import type { PromptCategory } from './types';

/**
 * Quick start helper for common use cases
 *
 * @example
 * ```typescript
 * import { quickStart } from '@/app/prompts';
 *
 * // Get and build a prompt in one call
 * const prompt = quickStart.buildPrompt('hashtag', {
 *   articleText: 'My article...'
 * });
 * ```
 */
export const quickStart = {
  /**
   * Get and build a prompt in one call
   */
  buildPrompt(
    category: PromptCategory,
    variables: Record<string, string | number | boolean | string[]>,
    options?: {
      version?: 'v1' | 'v2' | 'v3';
      language?: 'ja' | 'en';
    }
  ) {
    const registry = PromptRegistry.getInstance();
    const template = registry.get(category, options);
    const builder = new PromptBuilder();
    return builder.build(template, variables);
  },

  /**
   * Preview a prompt without building
   */
  previewPrompt(
    category: PromptCategory,
    variables: Record<string, string | number | boolean | string[]>,
    options?: {
      version?: 'v1' | 'v2' | 'v3';
      language?: 'ja' | 'en';
    }
  ) {
    const registry = PromptRegistry.getInstance();
    const template = registry.get(category, options);
    const builder = new PromptBuilder();
    return builder.preview(template, variables);
  },

  /**
   * Get registry statistics
   */
  getStats() {
    const registry = PromptRegistry.getInstance();
    return registry.getStats();
  },
};
