/**
 * Experiment Manager
 *
 * @description Manages A/B testing experiments for prompts
 * Supports traffic splitting, variant selection, and performance tracking
 */

import type {
  Experiment,
  ExperimentVariant,
  PromptCategory,
  PromptTemplate,
} from '../types';

/**
 * ExperimentManager class for A/B testing prompts
 *
 * @description Enables testing different prompt variations to find optimal versions
 *
 * @example
 * ```typescript
 * const manager = new ExperimentManager();
 *
 * // Create experiment
 * manager.createExperiment({
 *   id: 'hashtag-v1-vs-v2',
 *   name: 'Hashtag Generation: V1 vs V2',
 *   description: 'Test categorized hashtags vs simple list',
 *   category: 'hashtag',
 *   variants: [
 *     { id: 'control', prompt: hashtagV1, trafficPercentage: 50, active: true },
 *     { id: 'variant-a', prompt: hashtagV2, trafficPercentage: 50, active: true }
 *   ]
 * });
 *
 * // Select variant for user
 * const variant = manager.selectVariant('hashtag-v1-vs-v2', userId);
 * ```
 */
export class ExperimentManager {
  private experiments: Map<string, Experiment>;

  constructor() {
    this.experiments = new Map();
  }

  /**
   * Create a new experiment
   *
   * @param experiment - Experiment configuration
   * @throws {Error} If experiment ID already exists or invalid configuration
   */
  createExperiment(experiment: Experiment): void {
    // Validate experiment
    this.validateExperiment(experiment);

    if (this.experiments.has(experiment.id)) {
      throw new Error(`Experiment already exists: ${experiment.id}`);
    }

    this.experiments.set(experiment.id, experiment);
  }

  /**
   * Validate experiment configuration
   *
   * @param experiment - Experiment to validate
   * @throws {Error} If validation fails
   */
  private validateExperiment(experiment: Experiment): void {
    if (!experiment.id || !experiment.name || !experiment.category) {
      throw new Error('Experiment must have id, name, and category');
    }

    if (!experiment.variants || experiment.variants.length < 2) {
      throw new Error('Experiment must have at least 2 variants');
    }

    // Validate traffic percentages sum to 100
    const totalTraffic = experiment.variants.reduce(
      (sum, v) => sum + v.trafficPercentage,
      0
    );
    if (Math.abs(totalTraffic - 100) > 0.01) {
      throw new Error(
        `Traffic percentages must sum to 100, got ${totalTraffic}`
      );
    }

    // Validate all variants are for same category
    for (const variant of experiment.variants) {
      if (variant.prompt.category !== experiment.category) {
        throw new Error(
          `Variant ${variant.id} category mismatch: expected ${experiment.category}, got ${variant.prompt.category}`
        );
      }
    }
  }

  /**
   * Select a variant for a user
   *
   * @description Uses consistent hashing to ensure same user always gets same variant
   *
   * @param experimentId - Experiment ID
   * @param userId - User identifier (for consistent assignment)
   * @returns Selected variant
   * @throws {Error} If experiment not found or not active
   */
  selectVariant(experimentId: string, userId: string): ExperimentVariant {
    const experiment = this.experiments.get(experimentId);

    if (!experiment) {
      throw new Error(`Experiment not found: ${experimentId}`);
    }

    if (!experiment.active) {
      throw new Error(`Experiment not active: ${experimentId}`);
    }

    // Get only active variants
    const activeVariants = experiment.variants.filter((v) => v.active);
    if (activeVariants.length === 0) {
      throw new Error(`No active variants in experiment: ${experimentId}`);
    }

    // Use consistent hashing for variant selection
    const hash = this.hashString(userId + experimentId);
    const bucket = hash % 100;

    // Select variant based on traffic percentage
    let cumulative = 0;
    for (const variant of activeVariants) {
      cumulative += variant.trafficPercentage;
      if (bucket < cumulative) {
        return variant;
      }
    }

    // Fallback to first variant (shouldn't happen if percentages sum to 100)
    return activeVariants[0];
  }

  /**
   * Simple string hashing function for consistent variant assignment
   *
   * @param str - String to hash
   * @returns Hash value
   */
  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  /**
   * Get experiment by ID
   *
   * @param id - Experiment ID
   * @returns Experiment or undefined
   */
  getExperiment(id: string): Experiment | undefined {
    return this.experiments.get(id);
  }

  /**
   * List all experiments
   *
   * @param activeOnly - Only return active experiments
   * @returns Array of experiments
   */
  listExperiments(activeOnly = false): Experiment[] {
    const experiments = Array.from(this.experiments.values());
    return activeOnly ? experiments.filter((e) => e.active) : experiments;
  }

  /**
   * List experiments by category
   *
   * @param category - Prompt category
   * @returns Array of experiments for that category
   */
  listByCategory(category: PromptCategory): Experiment[] {
    return Array.from(this.experiments.values()).filter(
      (e) => e.category === category
    );
  }

  /**
   * Update experiment configuration
   *
   * @param id - Experiment ID
   * @param updates - Partial experiment updates
   */
  updateExperiment(id: string, updates: Partial<Experiment>): void {
    const experiment = this.experiments.get(id);
    if (!experiment) {
      throw new Error(`Experiment not found: ${id}`);
    }

    const updated = { ...experiment, ...updates };
    this.validateExperiment(updated);
    this.experiments.set(id, updated);
  }

  /**
   * Activate an experiment
   *
   * @param id - Experiment ID
   */
  activate(id: string): void {
    const experiment = this.experiments.get(id);
    if (!experiment) {
      throw new Error(`Experiment not found: ${id}`);
    }
    experiment.active = true;
  }

  /**
   * Deactivate an experiment
   *
   * @param id - Experiment ID
   */
  deactivate(id: string): void {
    const experiment = this.experiments.get(id);
    if (!experiment) {
      throw new Error(`Experiment not found: ${id}`);
    }
    experiment.active = false;
  }

  /**
   * Delete an experiment
   *
   * @param id - Experiment ID
   */
  deleteExperiment(id: string): void {
    if (!this.experiments.has(id)) {
      throw new Error(`Experiment not found: ${id}`);
    }
    this.experiments.delete(id);
  }

  /**
   * Update variant traffic percentages
   *
   * @param experimentId - Experiment ID
   * @param trafficAllocation - Map of variant ID to traffic percentage
   */
  updateTraffic(
    experimentId: string,
    trafficAllocation: Record<string, number>
  ): void {
    const experiment = this.experiments.get(experimentId);
    if (!experiment) {
      throw new Error(`Experiment not found: ${experimentId}`);
    }

    // Update traffic percentages
    for (const variant of experiment.variants) {
      if (variant.id in trafficAllocation) {
        variant.trafficPercentage = trafficAllocation[variant.id];
      }
    }

    // Validate updated experiment
    this.validateExperiment(experiment);
  }

  /**
   * Get statistics about experiments
   *
   * @returns Statistics object
   */
  getStats() {
    const experiments = Array.from(this.experiments.values());

    return {
      total: experiments.length,
      active: experiments.filter((e) => e.active).length,
      inactive: experiments.filter((e) => !e.active).length,
      byCategory: experiments.reduce(
        (acc, e) => {
          acc[e.category] = (acc[e.category] || 0) + 1;
          return acc;
        },
        {} as Record<PromptCategory, number>
      ),
      totalVariants: experiments.reduce(
        (sum, e) => sum + e.variants.length,
        0
      ),
    };
  }

  /**
   * Clear all experiments
   *
   * @description Useful for testing
   */
  clear(): void {
    this.experiments.clear();
  }
}

/**
 * Create a new experiment manager instance
 *
 * @returns ExperimentManager instance
 */
export function createExperimentManager(): ExperimentManager {
  return new ExperimentManager();
}
