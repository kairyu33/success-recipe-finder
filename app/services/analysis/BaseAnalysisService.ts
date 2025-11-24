/**
 * Base Analysis Service
 *
 * @description Abstract base class providing common functionality for all analysis services.
 * Implements shared validation, error handling, and utility methods following the
 * Template Method pattern.
 */

import type { IAIService } from '../ai/AIService.interface';
import type { BaseAnalysisRequest, AnalysisOptions } from './types';
import { AnalysisValidationError } from './types';

/**
 * Base Analysis Service
 *
 * @description Provides common functionality for all analysis services including:
 * - Request validation
 * - Text preprocessing
 * - Error handling
 * - Token estimation
 */
export abstract class BaseAnalysisService {
  /**
   * Service name for error reporting
   */
  protected abstract readonly serviceName: string;

  /**
   * Default maximum article length in characters
   */
  protected readonly MAX_ARTICLE_LENGTH = 30000;

  /**
   * Default minimum article length in characters
   */
  protected readonly MIN_ARTICLE_LENGTH = 10;

  constructor(protected readonly aiService: IAIService) {}

  /**
   * Validate base analysis request
   *
   * @param request - Analysis request to validate
   * @throws {AnalysisValidationError} When validation fails
   *
   * @example
   * ```typescript
   * this.validateRequest({ articleText: 'Some text...' });
   * ```
   */
  protected validateRequest(request: BaseAnalysisRequest): void {
    if (!request.articleText) {
      throw new AnalysisValidationError(
        this.serviceName,
        'Article text is required'
      );
    }

    if (typeof request.articleText !== 'string') {
      throw new AnalysisValidationError(
        this.serviceName,
        'Article text must be a string'
      );
    }

    const trimmedText = request.articleText.trim();

    if (trimmedText.length < this.MIN_ARTICLE_LENGTH) {
      throw new AnalysisValidationError(
        this.serviceName,
        `Article text is too short. Minimum ${this.MIN_ARTICLE_LENGTH} characters required.`
      );
    }

    if (trimmedText.length > this.MAX_ARTICLE_LENGTH) {
      throw new AnalysisValidationError(
        this.serviceName,
        `Article text is too long. Maximum ${this.MAX_ARTICLE_LENGTH} characters allowed.`
      );
    }
  }

  /**
   * Preprocess article text
   *
   * @description Cleans and normalizes article text:
   * - Trims whitespace
   * - Normalizes line breaks
   * - Removes excessive whitespace
   *
   * @param text - Raw article text
   * @returns Preprocessed text
   *
   * @example
   * ```typescript
   * const cleaned = this.preprocessText('  Some   text\n\n\n  ');
   * // Returns: 'Some text\n'
   * ```
   */
  protected preprocessText(text: string): string {
    return (
      text
        .trim()
        // Normalize line breaks
        .replace(/\r\n/g, '\n')
        // Remove excessive whitespace
        .replace(/[ \t]+/g, ' ')
        // Limit consecutive line breaks to 2
        .replace(/\n{3,}/g, '\n\n')
    );
  }

  /**
   * Estimate input tokens for article text
   *
   * @description Uses a simple heuristic:
   * - ~2.5 characters per token for Japanese
   * - ~4 characters per token for English
   * - ~3 characters per token for mixed content
   *
   * @param text - Text to estimate tokens for
   * @returns Estimated token count
   *
   * @example
   * ```typescript
   * const tokens = this.estimateInputTokens('記事テキスト');
   * console.log(`Estimated: ${tokens} tokens`);
   * ```
   */
  protected estimateInputTokens(text: string): number {
    const CHARS_PER_TOKEN = 3;
    return Math.ceil(text.length / CHARS_PER_TOKEN);
  }

  /**
   * Merge default options with provided options
   *
   * @param options - User-provided options
   * @param defaults - Default options
   * @returns Merged options
   *
   * @example
   * ```typescript
   * const opts = this.mergeOptions(
   *   { temperature: 0.8 },
   *   { temperature: 0.7, maxTokens: 500 }
   * );
   * // Returns: { temperature: 0.8, maxTokens: 500 }
   * ```
   */
  protected mergeOptions(
    options?: AnalysisOptions,
    defaults?: AnalysisOptions
  ): AnalysisOptions {
    return {
      useCache: true,
      temperature: 0.7,
      ...defaults,
      ...options,
    };
  }

  /**
   * Extract array items from AI response text
   *
   * @description Parses line-separated items from AI response.
   * Handles various formats including:
   * - Numbered lists (1. Item)
   * - Bullet points (- Item, * Item)
   * - Plain lines
   *
   * @param text - Response text to parse
   * @param prefix - Optional prefix to filter (e.g., '#' for hashtags)
   * @param maxCount - Maximum items to extract
   * @returns Array of extracted items
   *
   * @example
   * ```typescript
   * const items = this.extractArrayItems('1. Item A\n2. Item B\n3. Item C', '', 2);
   * // Returns: ['Item A', 'Item B']
   * ```
   */
  protected extractArrayItems(
    text: string,
    prefix?: string,
    maxCount?: number
  ): string[] {
    const lines = text
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    let items = lines
      .map((line) => {
        // Remove numbering (1. , 1) , etc.)
        line = line.replace(/^\d+[\.)]\s*/, '');
        // Remove bullet points
        line = line.replace(/^[-*•]\s*/, '');
        return line.trim();
      })
      .filter((line) => line.length > 0);

    // Filter by prefix if provided
    if (prefix) {
      items = items.filter((item) => item.startsWith(prefix));
    }

    // Limit count if specified
    if (maxCount) {
      items = items.slice(0, maxCount);
    }

    return items;
  }

  /**
   * Parse JSON from AI response
   *
   * @description Extracts and parses JSON from AI response text.
   * Handles markdown code blocks and other formatting.
   *
   * @param text - Response text containing JSON
   * @returns Parsed JSON object
   * @throws {SyntaxError} When JSON parsing fails
   *
   * @example
   * ```typescript
   * const data = this.parseJSON('```json\n{"key": "value"}\n```');
   * // Returns: { key: 'value' }
   * ```
   */
  protected parseJSON<T = any>(text: string): T {
    // Remove markdown code blocks
    const jsonText = text
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    return JSON.parse(jsonText);
  }

  /**
   * Validate array has expected count
   *
   * @param array - Array to validate
   * @param expectedCount - Expected number of items
   * @param itemName - Name of items for error message
   * @returns True if valid
   *
   * @example
   * ```typescript
   * this.validateArrayCount(['a', 'b'], 2, 'items'); // Returns true
   * this.validateArrayCount(['a'], 2, 'items'); // Logs warning
   * ```
   */
  protected validateArrayCount(
    array: any[],
    expectedCount: number,
    itemName: string
  ): boolean {
    if (array.length === 0) {
      console.error(
        `[${this.serviceName}] No ${itemName} generated`
      );
      return false;
    }

    if (array.length < expectedCount) {
      console.warn(
        `[${this.serviceName}] Only ${array.length} ${itemName} generated (expected ${expectedCount})`
      );
    }

    return true;
  }

  /**
   * Log analysis performance metrics
   *
   * @param operation - Operation name
   * @param startTime - Operation start timestamp
   * @param tokenUsage - Token usage data
   *
   * @example
   * ```typescript
   * const start = Date.now();
   * // ... perform analysis
   * this.logPerformance('hashtag-generation', start, { inputTokens: 100, outputTokens: 50 });
   * ```
   */
  protected logPerformance(
    operation: string,
    startTime: number,
    tokenUsage?: { inputTokens: number; outputTokens: number; totalCost?: number }
  ): void {
    const duration = Date.now() - startTime;

    console.log(`[${this.serviceName}] ${operation} completed:`, {
      duration_ms: duration,
      ...(tokenUsage && {
        input_tokens: tokenUsage.inputTokens,
        output_tokens: tokenUsage.outputTokens,
        total_cost: tokenUsage.totalCost
          ? `$${tokenUsage.totalCost.toFixed(6)}`
          : undefined,
      }),
    });
  }

  /**
   * Create structured prompt with sections
   *
   * @param sections - Map of section titles to content
   * @returns Formatted prompt string
   *
   * @example
   * ```typescript
   * const prompt = this.createStructuredPrompt({
   *   'Task': 'Generate hashtags',
   *   'Rules': '1. Use # prefix\n2. Japanese only'
   * });
   * ```
   */
  protected createStructuredPrompt(sections: Record<string, string>): string {
    return Object.entries(sections)
      .map(([title, content]) => `${title}:\n${content}`)
      .join('\n\n');
  }
}
