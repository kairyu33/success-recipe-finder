/**
 * Prompt Registry
 *
 * @description Central registry for all prompt templates with version management,
 * language selection, and experiment support
 */

import type {
  PromptTemplate,
  PromptCategory,
  PromptLanguage,
  PromptVersion,
  GetPromptOptions,
  PromptSelection,
  RegistryConfig,
} from './types';
import { hashtagPrompts, defaultHashtagPrompt } from './templates/hashtag.prompts';
import { eyecatchPrompts, defaultEyecatchPrompt } from './templates/eyecatch.prompts';
import { analysisPrompts, defaultAnalysisPrompt } from './templates/analysis.prompts';
import { titlePrompts, defaultTitlePrompt } from './templates/titles.prompts';
import { promptConfig } from './prompt.config';

/**
 * PromptRegistry class for managing all prompt templates
 *
 * @description Provides centralized access to prompts with support for:
 * - Version management
 * - Language selection
 * - A/B testing experiments
 * - Performance tracking
 *
 * @example
 * ```typescript
 * const registry = PromptRegistry.getInstance();
 * const prompt = registry.get('hashtag', {
 *   version: 'v1',
 *   language: 'ja'
 * });
 * ```
 */
export class PromptRegistry {
  private static instance: PromptRegistry;
  private config: RegistryConfig;
  private templates: Map<string, PromptTemplate>;

  private constructor(config?: Partial<RegistryConfig>) {
    this.config = { ...promptConfig, ...config };
    this.templates = new Map();
    this.loadTemplates();
  }

  /**
   * Get singleton instance of PromptRegistry
   *
   * @param config - Optional configuration overrides
   * @returns PromptRegistry instance
   */
  static getInstance(config?: Partial<RegistryConfig>): PromptRegistry {
    if (!PromptRegistry.instance) {
      PromptRegistry.instance = new PromptRegistry(config);
    }
    return PromptRegistry.instance;
  }

  /**
   * Load all prompt templates into the registry
   *
   * @description Loads templates from all categories and versions
   */
  private loadTemplates(): void {
    // Load hashtag prompts
    this.registerTemplate(hashtagPrompts.v1.ja);
    this.registerTemplate(hashtagPrompts.v1.en);
    this.registerTemplate(hashtagPrompts.v2.ja);
    this.registerTemplate(hashtagPrompts.v2.json);

    // Load eyecatch prompts
    this.registerTemplate(eyecatchPrompts.v1.ja);
    this.registerTemplate(eyecatchPrompts.v2.json);
    this.registerTemplate(eyecatchPrompts.v2.multiStyle);

    // Load analysis prompts
    this.registerTemplate(analysisPrompts.v1.ja);
    this.registerTemplate(analysisPrompts.v2.light);
    this.registerTemplate(analysisPrompts.v2.seo);

    // Load title prompts
    this.registerTemplate(titlePrompts.v1.ja);
    this.registerTemplate(titlePrompts.v2.json);
    this.registerTemplate(titlePrompts.v2.abTest);
  }

  /**
   * Register a prompt template in the registry
   *
   * @param template - Template to register
   */
  registerTemplate(template: PromptTemplate): void {
    this.templates.set(template.id, template);
  }

  /**
   * Get a prompt template by category with optional version and language
   *
   * @param category - Prompt category (hashtag, eyecatch, analysis, titles)
   * @param options - Options for version, language, etc.
   * @returns Selected prompt template
   * @throws {Error} If prompt not found
   *
   * @example
   * ```typescript
   * // Get default version and language
   * const prompt = registry.get('hashtag');
   *
   * // Get specific version
   * const promptV2 = registry.get('hashtag', { version: 'v2' });
   *
   * // Get English version
   * const promptEn = registry.get('hashtag', { language: 'en' });
   * ```
   */
  get(
    category: PromptCategory,
    options?: GetPromptOptions
  ): PromptTemplate {
    const selection = this.select(category, options);
    return selection.template;
  }

  /**
   * Select a prompt with experiment support
   *
   * @description Returns prompt selection with metadata about experiments
   *
   * @param category - Prompt category
   * @param options - Selection options
   * @returns Prompt selection with experiment metadata
   */
  select(
    category: PromptCategory,
    options?: GetPromptOptions
  ): PromptSelection {
    const version = options?.version || this.config.defaultVersion;
    const language = options?.language || this.config.defaultLanguage;

    // Build prompt ID pattern
    const idPattern = `${category}-`;

    // Find matching templates
    const matches = Array.from(this.templates.values()).filter(
      (t) =>
        t.id.startsWith(idPattern) &&
        t.version === version &&
        (t.language === language || !options?.language)
    );

    if (matches.length === 0) {
      // Fallback to default for category
      const defaultPrompt = this.getDefaultForCategory(category);
      if (!defaultPrompt) {
        throw new Error(
          `No prompt found for category: ${category}, version: ${version}, language: ${language}`
        );
      }
      return {
        template: defaultPrompt,
        fromExperiment: false,
      };
    }

    // Return first match (TODO: add experiment selection logic)
    return {
      template: matches[0],
      fromExperiment: false,
    };
  }

  /**
   * Get default prompt for a category
   *
   * @param category - Prompt category
   * @returns Default prompt template or undefined
   */
  private getDefaultForCategory(
    category: PromptCategory
  ): PromptTemplate | undefined {
    switch (category) {
      case 'hashtag':
        return defaultHashtagPrompt;
      case 'eyecatch':
        return defaultEyecatchPrompt;
      case 'analysis':
        return defaultAnalysisPrompt;
      case 'titles':
        return defaultTitlePrompt;
      default:
        return undefined;
    }
  }

  /**
   * Get a prompt by its exact ID
   *
   * @param id - Prompt template ID
   * @returns Prompt template
   * @throws {Error} If prompt not found
   */
  getById(id: string): PromptTemplate {
    const template = this.templates.get(id);
    if (!template) {
      throw new Error(`Prompt not found with ID: ${id}`);
    }
    return template;
  }

  /**
   * List all prompts for a category
   *
   * @param category - Prompt category
   * @returns Array of prompt templates
   */
  listByCategory(category: PromptCategory): PromptTemplate[] {
    return Array.from(this.templates.values()).filter(
      (t) => t.category === category
    );
  }

  /**
   * List all prompts for a version
   *
   * @param version - Prompt version
   * @returns Array of prompt templates
   */
  listByVersion(version: PromptVersion): PromptTemplate[] {
    return Array.from(this.templates.values()).filter(
      (t) => t.version === version
    );
  }

  /**
   * List all available prompt templates
   *
   * @returns Array of all registered templates
   */
  listAll(): PromptTemplate[] {
    return Array.from(this.templates.values());
  }

  /**
   * Search prompts by tag
   *
   * @param tag - Tag to search for
   * @returns Array of matching prompt templates
   */
  searchByTag(tag: string): PromptTemplate[] {
    return Array.from(this.templates.values()).filter(
      (t) => t.metadata.tags?.includes(tag)
    );
  }

  /**
   * Get performance metrics for a prompt
   *
   * @param id - Prompt template ID
   * @returns Performance metrics or undefined
   */
  getPerformance(id: string) {
    const template = this.templates.get(id);
    return template?.metadata.performance;
  }

  /**
   * Update performance metrics for a prompt
   *
   * @param id - Prompt template ID
   * @param metrics - Performance metrics to update
   */
  updatePerformance(
    id: string,
    metrics: Partial<
      NonNullable<PromptTemplate['metadata']['performance']>
    >
  ): void {
    const template = this.templates.get(id);
    if (!template) {
      throw new Error(`Prompt not found with ID: ${id}`);
    }

    template.metadata.performance = {
      ...template.metadata.performance,
      ...metrics,
      lastUpdated: new Date().toISOString(),
    } as NonNullable<PromptTemplate['metadata']['performance']>;
  }

  /**
   * Get configuration
   *
   * @returns Current registry configuration
   */
  getConfig(): Readonly<RegistryConfig> {
    return { ...this.config };
  }

  /**
   * Update configuration
   *
   * @param config - Configuration updates
   */
  updateConfig(config: Partial<RegistryConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Clear all templates and reload
   *
   * @description Useful for testing or hot-reloading
   */
  reload(): void {
    this.templates.clear();
    this.loadTemplates();
  }

  /**
   * Get statistics about registered prompts
   *
   * @returns Statistics object
   */
  getStats() {
    const templates = Array.from(this.templates.values());

    const byCategory = templates.reduce(
      (acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + 1;
        return acc;
      },
      {} as Record<PromptCategory, number>
    );

    const byVersion = templates.reduce(
      (acc, t) => {
        acc[t.version] = (acc[t.version] || 0) + 1;
        return acc;
      },
      {} as Record<PromptVersion, number>
    );

    const byLanguage = templates.reduce(
      (acc, t) => {
        acc[t.language] = (acc[t.language] || 0) + 1;
        return acc;
      },
      {} as Record<PromptLanguage, number>
    );

    return {
      total: templates.length,
      byCategory,
      byVersion,
      byLanguage,
      withCaching: templates.filter((t) => t.caching?.enabled).length,
      withExamples: templates.filter((t) => t.examples && t.examples.length > 0)
        .length,
      withPerformance: templates.filter((t) => t.metadata.performance).length,
    };
  }
}

/**
 * Get the global prompt registry instance
 *
 * @returns PromptRegistry singleton
 *
 * @example
 * ```typescript
 * import { getPromptRegistry } from './PromptRegistry';
 *
 * const registry = getPromptRegistry();
 * const prompt = registry.get('hashtag');
 * ```
 */
export function getPromptRegistry(): PromptRegistry {
  return PromptRegistry.getInstance();
}
