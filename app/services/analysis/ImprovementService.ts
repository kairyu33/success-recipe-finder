/**
 * Article Improvement Service
 *
 * @description Service for generating AI-powered article improvement suggestions.
 * Analyzes article structure, content quality, engagement, clarity, and SEO.
 * Provides actionable recommendations with priority scoring.
 *
 * @example
 * ```typescript
 * const service = new ImprovementService(aiService);
 * const result = await service.analyzeImprovement({
 *   articleText: '記事の内容...',
 *   options: { useCache: true }
 * });
 * console.log(result.actionItems);
 * ```
 */

import type { IAIService } from '../ai/AIService.interface';
import { BaseAnalysisService } from './BaseAnalysisService';
import type { ImprovementRequest, ImprovementResult } from './types';
import { AnalysisServiceError, AnalysisValidationError, AnalysisParsingError } from './types';
import { getPromptTemplate } from '../config/PromptTemplates';
import { getRecommendedModel } from '../config/ModelConfig';

/**
 * Improvement Service
 *
 * @description Analyzes articles and provides comprehensive improvement suggestions.
 * Features:
 * - Structure analysis (introduction, body, conclusion)
 * - Content quality evaluation
 * - Engagement optimization
 * - Clarity improvements
 * - SEO recommendations
 * - Priority-based action items
 */
export class ImprovementService extends BaseAnalysisService {
  protected readonly serviceName = 'ImprovementService';

  /**
   * Score thresholds for categorization
   */
  private readonly SCORE_THRESHOLDS = {
    excellent: 80,
    good: 60,
    needsWork: 40,
  } as const;

  constructor(aiService: IAIService) {
    super(aiService);
  }

  /**
   * Analyze article and generate improvement suggestions
   *
   * @param request - Improvement analysis request
   * @returns Promise resolving to improvement result
   * @throws {AnalysisServiceError} When analysis fails
   *
   * @example
   * ```typescript
   * const result = await service.analyzeImprovement({
   *   articleText: '記事の内容...',
   *   options: { temperature: 0.7, useCache: true }
   * });
   * console.log(result.overall.score); // 72
   * console.log(result.actionItems); // Priority-sorted suggestions
   * ```
   */
  async analyzeImprovement(request: ImprovementRequest): Promise<ImprovementResult> {
    const startTime = Date.now();

    try {
      // Validate request
      this.validateRequest(request);

      // Preprocess text
      const processedText = this.preprocessText(request.articleText);

      // Get model configuration
      const modelConfig = getRecommendedModel('article-improvement');

      // Merge options
      const options = this.mergeOptions(request.options, {
        maxTokens: modelConfig.maxTokens,
        temperature: modelConfig.temperature,
        model: modelConfig.config.model,
      });

      // Get prompt template
      const language = request.language || 'ja';
      const promptVariant = language === 'ja' ? 'DEFAULT_JA' : 'DEFAULT_EN';
      const promptTemplate = getPromptTemplate('improvement', promptVariant);

      // Prepare request
      const userPrompt = this.buildUserPrompt(processedText);

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

      // Parse and validate improvement data
      const improvement = this.parseImprovement(response.content);

      // Log performance
      this.logPerformance('analyzeImprovement', startTime, response.usage);

      return {
        ...improvement,
        usage: response.usage,
      };
    } catch (error) {
      if (
        error instanceof AnalysisServiceError ||
        error instanceof AnalysisValidationError ||
        error instanceof AnalysisParsingError
      ) {
        throw error;
      }

      throw new AnalysisServiceError(
        'Failed to analyze article improvements',
        this.serviceName,
        error as Error
      );
    }
  }

  /**
   * Build user prompt for improvement analysis
   *
   * @param articleText - Preprocessed article text
   * @returns Formatted user prompt
   */
  private buildUserPrompt(articleText: string): string {
    return `記事テキスト：\n${articleText}`;
  }

  /**
   * Parse improvement data from AI response
   *
   * @param responseText - AI response text
   * @returns Parsed improvement result
   * @throws {AnalysisParsingError} When parsing fails
   */
  private parseImprovement(responseText: string): Omit<ImprovementResult, 'usage'> {
    try {
      // Extract JSON from response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new AnalysisParsingError(
          this.serviceName,
          'No JSON found in AI response',
          responseText
        );
      }

      const parsed = JSON.parse(jsonMatch[0]);

      // Validate structure
      this.validateImprovementStructure(parsed);

      // Sort action items by priority
      parsed.actionItems = this.sortActionItemsByPriority(parsed.actionItems);

      return parsed;
    } catch (error) {
      if (error instanceof AnalysisParsingError) {
        throw error;
      }

      throw new AnalysisParsingError(
        this.serviceName,
        `Failed to parse improvement response: ${(error as Error).message}`,
        responseText
      );
    }
  }

  /**
   * Validate improvement data structure
   *
   * @param data - Parsed improvement data
   * @throws {AnalysisParsingError} When validation fails
   */
  private validateImprovementStructure(data: any): void {
    const requiredFields = [
      'overall',
      'structure',
      'content',
      'engagement',
      'clarity',
      'seoOptimizations',
      'actionItems',
    ];

    for (const field of requiredFields) {
      if (!data[field]) {
        throw new AnalysisParsingError(
          this.serviceName,
          `Missing required field: ${field}`
        );
      }
    }

    // Validate overall
    if (typeof data.overall.score !== 'number' || data.overall.score < 0 || data.overall.score > 100) {
      throw new AnalysisParsingError(
        this.serviceName,
        'overall.score must be a number between 0 and 100'
      );
    }

    // Validate action items
    if (!Array.isArray(data.actionItems) || data.actionItems.length === 0) {
      throw new AnalysisParsingError(
        this.serviceName,
        'actionItems must be a non-empty array'
      );
    }

    // Validate each action item
    for (const item of data.actionItems) {
      if (!item.priority || !['high', 'medium', 'low'].includes(item.priority)) {
        throw new AnalysisParsingError(
          this.serviceName,
          'Each action item must have a valid priority (high, medium, low)'
        );
      }
    }
  }

  /**
   * Sort action items by priority (high -> medium -> low)
   *
   * @param items - Array of action items
   * @returns Sorted array
   */
  private sortActionItemsByPriority<T extends { priority: 'high' | 'medium' | 'low' }>(items: T[]): T[] {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return [...items].sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  }

  /**
   * Calculate score category
   *
   * @param score - Numeric score (0-100)
   * @returns Category label
   */
  getScoreCategory(score: number): 'excellent' | 'good' | 'needsWork' | 'poor' {
    if (score >= this.SCORE_THRESHOLDS.excellent) return 'excellent';
    if (score >= this.SCORE_THRESHOLDS.good) return 'good';
    if (score >= this.SCORE_THRESHOLDS.needsWork) return 'needsWork';
    return 'poor';
  }

  /**
   * Get score color for UI display
   *
   * @param score - Numeric score (0-100)
   * @returns Tailwind color class
   */
  getScoreColor(score: number): string {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  }

  /**
   * Estimate cost for improvement analysis
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
    const promptTokens = 500; // Approximate prompt size
    const inputTokens = articleTokens + promptTokens;
    const outputTokens = 800; // Approximate for comprehensive analysis

    const modelConfig = getRecommendedModel('article-improvement');
    const total = this.aiService.estimateCost(inputTokens, outputTokens);

    return {
      inputTokens,
      outputTokens,
      total,
    };
  }
}
