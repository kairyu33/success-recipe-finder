/**
 * Hashtag Generation Service
 *
 * @description Service for generating optimized hashtags for note.com articles.
 * Implements hashtag-specific logic including validation, deduplication,
 * and format checking.
 *
 * @example
 * ```typescript
 * const service = new HashtagService(aiService);
 * const result = await service.generateHashtags({
 *   articleText: '記事の内容...',
 *   count: 20,
 *   options: { useCache: true }
 * });
 * console.log(result.hashtags);
 * ```
 */

import type { IAIService } from '../ai/AIService.interface';
import { BaseAnalysisService } from './BaseAnalysisService';
import type { HashtagRequest, HashtagResult } from './types';
import { AnalysisServiceError, AnalysisValidationError } from './types';
import { getPromptTemplate } from '../config/PromptTemplates';
import { getRecommendedModel } from '../config/ModelConfig';

/**
 * Hashtag Service
 *
 * @description Generates optimized hashtags for note.com articles using AI.
 * Features:
 * - Configurable hashtag count
 * - Format validation (# prefix)
 * - Deduplication
 * - Length limits
 * - Cost tracking
 */
export class HashtagService extends BaseAnalysisService {
  protected readonly serviceName = 'HashtagService';

  /**
   * Default number of hashtags to generate
   */
  private readonly DEFAULT_HASHTAG_COUNT = 20;

  /**
   * Maximum hashtag length in characters
   */
  private readonly MAX_HASHTAG_LENGTH = 50;

  /**
   * Minimum hashtag length in characters (including #)
   */
  private readonly MIN_HASHTAG_LENGTH = 2;

  constructor(aiService: IAIService) {
    super(aiService);
  }

  /**
   * Generate hashtags for an article
   *
   * @param request - Hashtag generation request
   * @returns Promise resolving to hashtag result
   * @throws {AnalysisServiceError} When generation fails
   *
   * @example
   * ```typescript
   * const result = await service.generateHashtags({
   *   articleText: '最新のAI技術について...',
   *   count: 20,
   *   options: { temperature: 0.7, useCache: true }
   * });
   * console.log(result.hashtags); // ['#AI', '#技術', ...]
   * ```
   */
  async generateHashtags(request: HashtagRequest): Promise<HashtagResult> {
    const startTime = Date.now();

    try {
      // Validate request
      this.validateRequest(request);
      this.validateHashtagRequest(request);

      // Preprocess text
      const processedText = this.preprocessText(request.articleText);

      // Get model configuration
      const modelConfig = getRecommendedModel('hashtag-generation');

      // Merge options
      const options = this.mergeOptions(request.options, {
        maxTokens: modelConfig.maxTokens,
        temperature: modelConfig.temperature,
        model: modelConfig.config.model,
      });

      // Get prompt template
      const language = request.language || 'ja';
      const promptVariant = language === 'ja' ? 'DEFAULT_JA' : 'DEFAULT_EN';
      const promptTemplate = getPromptTemplate('hashtag', promptVariant);

      // Prepare request
      const hashtagCount = request.count || this.DEFAULT_HASHTAG_COUNT;
      const userPrompt = this.buildUserPrompt(processedText, hashtagCount);

      // Call AI service
      const response = await this.aiService.generateCompletion({
        systemPrompt: [
          {
            role: 'system',
            content: promptTemplate.content,
            ...(options.useCache && { cacheControl: { type: 'ephemeral' as const } }),
          },
        ],
        messages: [
          {
            role: 'user',
            content: userPrompt,
          },
        ],
        config: {
          model: options.model || modelConfig.config.model,
          maxTokens: options.maxTokens || modelConfig.maxTokens,
          temperature: options.temperature,
          useCache: options.useCache,
        },
      });

      // Parse and validate hashtags
      const hashtags = this.parseHashtags(response.content, hashtagCount);

      // Log performance
      this.logPerformance('generateHashtags', startTime, response.usage);

      return {
        hashtags,
        usage: response.usage,
      };
    } catch (error) {
      if (
        error instanceof AnalysisServiceError ||
        error instanceof AnalysisValidationError
      ) {
        throw error;
      }

      throw new AnalysisServiceError(
        'Failed to generate hashtags',
        this.serviceName,
        error as Error
      );
    }
  }

  /**
   * Validate hashtag-specific request parameters
   *
   * @param request - Hashtag request
   * @throws {AnalysisValidationError} When validation fails
   */
  private validateHashtagRequest(request: HashtagRequest): void {
    if (request.count !== undefined) {
      if (request.count < 1 || request.count > 50) {
        throw new AnalysisValidationError(
          this.serviceName,
          'Hashtag count must be between 1 and 50'
        );
      }
    }
  }

  /**
   * Build user prompt for hashtag generation
   *
   * @param articleText - Preprocessed article text
   * @param count - Number of hashtags to generate
   * @returns Formatted user prompt
   */
  private buildUserPrompt(articleText: string, count: number): string {
    return `記事テキスト：\n${articleText}\n\n${count}個のハッシュタグを生成してください。`;
  }

  /**
   * Parse hashtags from AI response
   *
   * @param responseText - AI response text
   * @param expectedCount - Expected number of hashtags
   * @returns Array of validated hashtags
   * @throws {AnalysisServiceError} When parsing fails
   */
  private parseHashtags(responseText: string, expectedCount: number): string[] {
    // Extract lines starting with #
    let hashtags = this.extractArrayItems(responseText, '#');

    // Validate each hashtag
    hashtags = hashtags
      .map((tag) => this.normalizeHashtag(tag))
      .filter((tag) => this.isValidHashtag(tag));

    // Remove duplicates (case-insensitive)
    hashtags = this.deduplicateHashtags(hashtags);

    // Validate count
    if (hashtags.length === 0) {
      throw new AnalysisServiceError(
        'Failed to extract any valid hashtags from AI response',
        this.serviceName
      );
    }

    this.validateArrayCount(hashtags, expectedCount, 'hashtags');

    // Limit to expected count
    return hashtags.slice(0, expectedCount);
  }

  /**
   * Normalize hashtag format
   *
   * @param hashtag - Raw hashtag
   * @returns Normalized hashtag
   */
  private normalizeHashtag(hashtag: string): string {
    // Ensure it starts with #
    hashtag = hashtag.trim();
    if (!hashtag.startsWith('#')) {
      hashtag = `#${hashtag}`;
    }

    // Remove any whitespace within the hashtag
    hashtag = hashtag.replace(/\s+/g, '');

    return hashtag;
  }

  /**
   * Validate hashtag format and length
   *
   * @param hashtag - Hashtag to validate
   * @returns True if valid
   */
  private isValidHashtag(hashtag: string): boolean {
    // Must start with #
    if (!hashtag.startsWith('#')) {
      return false;
    }

    // Check length
    if (
      hashtag.length < this.MIN_HASHTAG_LENGTH ||
      hashtag.length > this.MAX_HASHTAG_LENGTH
    ) {
      return false;
    }

    // Must have content after #
    if (hashtag === '#') {
      return false;
    }

    // Should not contain special characters that break hashtags
    const invalidChars = /[<>{}[\]\\|`]/;
    if (invalidChars.test(hashtag)) {
      return false;
    }

    return true;
  }

  /**
   * Remove duplicate hashtags (case-insensitive)
   *
   * @param hashtags - Array of hashtags
   * @returns Deduplicated array
   */
  private deduplicateHashtags(hashtags: string[]): string[] {
    const seen = new Set<string>();
    const result: string[] = [];

    for (const tag of hashtags) {
      const normalized = tag.toLowerCase();
      if (!seen.has(normalized)) {
        seen.add(normalized);
        result.push(tag);
      }
    }

    return result;
  }

  /**
   * Estimate cost for hashtag generation
   *
   * @param articleText - Article text
   * @returns Estimated cost breakdown
   *
   * @example
   * ```typescript
   * const estimate = service.estimateCost('記事テキスト...');
   * console.log(`Estimated: $${estimate.total.toFixed(4)}`);
   * ```
   */
  estimateCost(articleText: string): {
    inputTokens: number;
    outputTokens: number;
    total: number;
  } {
    const articleTokens = this.estimateInputTokens(articleText);
    const promptTokens = 200; // Approximate prompt size
    const inputTokens = articleTokens + promptTokens;
    const outputTokens = 150; // Approximate for 20 hashtags

    const modelConfig = getRecommendedModel('hashtag-generation');
    const total = this.aiService.estimateCost(inputTokens, outputTokens);

    return {
      inputTokens,
      outputTokens,
      total,
    };
  }
}
