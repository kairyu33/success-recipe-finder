/**
 * SEO Analysis Service
 *
 * @description Service for comprehensive SEO optimization analysis of note.com articles.
 * Provides SEO scoring, keyword optimization, readability analysis, and actionable
 * improvement recommendations.
 *
 * @example
 * ```typescript
 * const service = new SEOService(aiService);
 * const result = await service.analyzeSEO({
 *   articleText: '記事の内容...',
 *   title: '記事タイトル',
 *   options: { useCache: true }
 * });
 * console.log(result.score); // 85
 * console.log(result.grade); // 'A'
 * ```
 */

import type { IAIService } from '../ai/AIService.interface';
import { BaseAnalysisService } from './BaseAnalysisService';
import { AnalysisServiceError, AnalysisValidationError } from './types';
import { getPromptTemplate } from '../config/PromptTemplates';
import { getRecommendedModel } from '../config/ModelConfig';
import type { AnalysisOptions, BaseAnalysisRequest } from './types';

/**
 * SEO Analysis Request
 */
export interface SEOAnalysisRequest extends BaseAnalysisRequest {
  /** Optional article title */
  title?: string;
  /** Optional existing meta description */
  existingMetaDescription?: string;
  /** Target keyword (optional) */
  targetKeyword?: string;
  /** Analysis options */
  options?: AnalysisOptions;
}

/**
 * Keyword Analysis
 */
export interface KeywordAnalysis {
  /** Primary keywords (most important) */
  primary: string[];
  /** Secondary keywords (supporting) */
  secondary: string[];
  /** Long-tail keywords */
  longTail: string[];
  /** Keyword density map (keyword -> percentage) */
  density: Record<string, number>;
}

/**
 * Readability Metrics
 */
export interface ReadabilityMetrics {
  /** Overall readability score (0-100) */
  score: number;
  /** Reading level (e.g., "中学生レベル", "大学生レベル") */
  level: string;
  /** Average sentence length in characters */
  averageSentenceLength: number;
  /** Average paragraph length in characters */
  averageParagraphLength: number;
  /** Kanji ratio (for Japanese text) */
  kanjiRatio?: number;
}

/**
 * Content Structure Analysis
 */
export interface ContentStructure {
  /** Total word count */
  wordCount: number;
  /** Total character count */
  characterCount: number;
  /** Number of paragraphs */
  paragraphCount: number;
  /** Number of headings */
  headingCount: number;
  /** Estimated reading time in minutes */
  readingTimeMinutes: number;
  /** Structural recommendations */
  recommendations: string[];
}

/**
 * SEO Improvements categorized by priority
 */
export interface SEOImprovements {
  /** Critical issues (must fix) */
  critical: string[];
  /** Important issues (should fix) */
  important: string[];
  /** Optional enhancements (nice to have) */
  optional: string[];
}

/**
 * SEO Analysis Result
 */
export interface SEOAnalysisResult {
  /** Overall SEO score (0-100) */
  score: number;
  /** Letter grade (A/B/C/D/F) */
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  /** Optimized meta description (150-160 characters) */
  metaDescription: string;
  /** Optimized URL slug */
  optimizedSlug: string;
  /** Keyword analysis */
  keywords: KeywordAnalysis;
  /** Readability metrics */
  readability: ReadabilityMetrics;
  /** Content structure analysis */
  structure: ContentStructure;
  /** Categorized improvement suggestions */
  improvements: SEOImprovements;
  /** Image optimization suggestions */
  imageOptimization: {
    /** Suggested alt texts */
    altTextSuggestions: string[];
    /** Recommended image count */
    recommendedImageCount: number;
  };
  /** Internal linking opportunities */
  internalLinking: {
    /** Suggested anchor texts */
    suggestedAnchors: string[];
    /** Related topics to link */
    relatedTopics: string[];
  };
  /** Token usage for cost tracking */
  usage?: {
    inputTokens: number;
    outputTokens: number;
    totalCost: number;
    cacheReadInputTokens?: number;
  };
}

/**
 * SEO Service
 *
 * @description Analyzes articles for SEO optimization and provides actionable recommendations.
 * Features:
 * - Comprehensive SEO scoring
 * - Keyword density analysis
 * - Readability assessment (Japanese-specific)
 * - Meta description optimization
 * - URL slug optimization
 * - Content structure analysis
 * - Prioritized improvement recommendations
 */
export class SEOService extends BaseAnalysisService {
  protected readonly serviceName = 'SEOService';

  /**
   * Target meta description length
   */
  private readonly META_DESCRIPTION_MIN = 150;
  private readonly META_DESCRIPTION_MAX = 160;

  /**
   * Ideal content metrics
   */
  private readonly IDEAL_WORD_COUNT_MIN = 300;
  private readonly IDEAL_WORD_COUNT_IDEAL = 1000;
  private readonly IDEAL_READABILITY_SCORE = 60;

  /**
   * Keyword density targets (percentage)
   */
  private readonly KEYWORD_DENSITY_MIN = 0.5;
  private readonly KEYWORD_DENSITY_MAX = 2.5;

  constructor(aiService: IAIService) {
    super(aiService);
  }

  /**
   * Analyze article for SEO optimization
   *
   * @param request - SEO analysis request
   * @returns Promise resolving to SEO analysis result
   * @throws {AnalysisServiceError} When analysis fails
   *
   * @example
   * ```typescript
   * const result = await service.analyzeSEO({
   *   articleText: 'AIを活用した最新のマーケティング手法...',
   *   title: 'AI活用マーケティング完全ガイド',
   *   options: { temperature: 0.3, useCache: true }
   * });
   * console.log(`SEO Score: ${result.score}/100 (${result.grade})`);
   * console.log(`Meta: ${result.metaDescription}`);
   * ```
   */
  async analyzeSEO(request: SEOAnalysisRequest): Promise<SEOAnalysisResult> {
    const startTime = Date.now();

    try {
      // Validate request
      this.validateRequest(request);
      this.validateSEORequest(request);

      // Preprocess text
      const processedText = this.preprocessText(request.articleText);

      // Get basic structure analysis first (local computation)
      const structure = this.analyzeStructure(processedText);

      // Get model configuration (lower temperature for consistent SEO analysis)
      const modelConfig = getRecommendedModel('hashtag-generation');

      // Merge options with SEO-specific defaults
      const options = this.mergeOptions(request.options, {
        maxTokens: 2000, // SEO analysis needs more tokens
        temperature: 0.3, // Lower temperature for consistent analysis
        model: modelConfig.config.model,
      });

      // Get prompt template
      const language = request.language || 'ja';
      const promptVariant = language === 'ja' ? 'DEFAULT_JA' : 'DEFAULT_EN';
      const promptTemplate = getPromptTemplate('seo', promptVariant);

      // Build user prompt
      const userPrompt = this.buildSEOPrompt(
        processedText,
        request.title,
        request.targetKeyword,
        structure
      );

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
          maxTokens: options.maxTokens || 2000,
          temperature: options.temperature,
          useCache: options.useCache,
        },
      });

      // Parse AI response
      const aiAnalysis = this.parseSEOResponse(response.content);

      // Combine with local analysis
      const result = this.buildSEOResult(
        aiAnalysis,
        structure,
        processedText,
        request.title
      );

      // Log performance
      this.logPerformance('analyzeSEO', startTime, response.usage);

      return {
        ...result,
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
        'Failed to analyze SEO',
        this.serviceName,
        error as Error
      );
    }
  }

  /**
   * Validate SEO-specific request parameters
   *
   * @param request - SEO analysis request
   * @throws {AnalysisValidationError} When validation fails
   */
  private validateSEORequest(request: SEOAnalysisRequest): void {
    // Title validation (if provided)
    if (request.title) {
      if (request.title.length < 10 || request.title.length > 100) {
        throw new AnalysisValidationError(
          this.serviceName,
          'Title must be between 10 and 100 characters'
        );
      }
    }

    // Target keyword validation (if provided)
    if (request.targetKeyword) {
      if (request.targetKeyword.length < 2 || request.targetKeyword.length > 50) {
        throw new AnalysisValidationError(
          this.serviceName,
          'Target keyword must be between 2 and 50 characters'
        );
      }
    }
  }

  /**
   * Build user prompt for SEO analysis
   *
   * @param articleText - Preprocessed article text
   * @param title - Optional article title
   * @param targetKeyword - Optional target keyword
   * @param structure - Pre-computed structure analysis
   * @returns Formatted user prompt
   */
  private buildSEOPrompt(
    articleText: string,
    title?: string,
    targetKeyword?: string,
    structure?: ContentStructure
  ): string {
    let prompt = `記事のSEO分析を実施してください。\n\n`;

    if (title) {
      prompt += `タイトル：${title}\n\n`;
    }

    if (targetKeyword) {
      prompt += `ターゲットキーワード：${targetKeyword}\n\n`;
    }

    prompt += `記事テキスト：\n${articleText}\n\n`;

    if (structure) {
      prompt += `基本統計：\n`;
      prompt += `- 文字数：${structure.characterCount}\n`;
      prompt += `- 段落数：${structure.paragraphCount}\n`;
      prompt += `- 見出し数：${structure.headingCount}\n\n`;
    }

    prompt += `以下の項目を含むJSON形式で分析結果を返してください（JSON以外の説明は含めないこと）。`;

    return prompt;
  }

  /**
   * Parse SEO analysis response from AI
   *
   * @param responseText - AI response text
   * @returns Parsed SEO data
   * @throws {AnalysisServiceError} When parsing fails
   */
  private parseSEOResponse(responseText: string): any {
    try {
      // Extract JSON from response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const parsed = JSON.parse(jsonMatch[0]);

      // Validate required fields
      if (!parsed.keywords || !parsed.metaDescription || !parsed.improvements) {
        throw new Error('Missing required SEO fields in response');
      }

      return parsed;
    } catch (error) {
      throw new AnalysisServiceError(
        'Failed to parse SEO analysis response',
        this.serviceName,
        error as Error
      );
    }
  }

  /**
   * Analyze content structure locally (without AI)
   *
   * @param text - Article text
   * @returns Content structure analysis
   */
  private analyzeStructure(text: string): ContentStructure {
    // Count characters
    const characterCount = text.length;

    // Count words (Japanese and English)
    const wordCount = this.countWords(text);

    // Count paragraphs
    const paragraphs = text.split(/\n\n+/).filter((p) => p.trim().length > 0);
    const paragraphCount = paragraphs.length;

    // Count headings (markdown style)
    const headingMatches = text.match(/^#{1,6}\s+.+$/gm);
    const headingCount = headingMatches ? headingMatches.length : 0;

    // Calculate reading time (Japanese: ~600 chars/min, English: ~250 words/min)
    const isJapanese = this.isJapaneseText(text);
    const readingTimeMinutes = isJapanese
      ? Math.ceil(characterCount / 600)
      : Math.ceil(wordCount / 250);

    // Generate recommendations
    const recommendations: string[] = [];

    if (wordCount < this.IDEAL_WORD_COUNT_MIN) {
      recommendations.push(
        `コンテンツが短すぎます。最低${this.IDEAL_WORD_COUNT_MIN}文字、理想的には${this.IDEAL_WORD_COUNT_IDEAL}文字以上を目指しましょう。`
      );
    }

    if (headingCount === 0) {
      recommendations.push(
        '見出しを追加して、コンテンツの構造を改善してください。'
      );
    } else if (headingCount < 3 && wordCount > 500) {
      recommendations.push(
        '長い記事には複数の見出しを使用して、読みやすさを向上させましょう。'
      );
    }

    if (paragraphCount < 3 && wordCount > 300) {
      recommendations.push(
        '段落を分割して、読みやすさを改善してください。'
      );
    }

    return {
      wordCount,
      characterCount,
      paragraphCount,
      headingCount,
      readingTimeMinutes,
      recommendations,
    };
  }

  /**
   * Build final SEO result combining AI and local analysis
   *
   * @param aiAnalysis - Analysis from AI
   * @param structure - Local structure analysis
   * @param text - Original text
   * @param title - Article title
   * @returns Complete SEO analysis result
   */
  private buildSEOResult(
    aiAnalysis: any,
    structure: ContentStructure,
    text: string,
    title?: string
  ): Omit<SEOAnalysisResult, 'usage'> {
    // Calculate readability locally
    const readability = this.calculateReadability(text);

    // Calculate SEO score
    const score = this.calculateSEOScore(
      aiAnalysis,
      structure,
      readability,
      title
    );

    // Determine grade
    const grade = this.scoreToGrade(score);

    // Generate optimized slug
    const optimizedSlug = this.generateSlug(
      title || aiAnalysis.suggestedTitle || text.slice(0, 50)
    );

    return {
      score,
      grade,
      metaDescription: aiAnalysis.metaDescription || '',
      optimizedSlug,
      keywords: aiAnalysis.keywords || {
        primary: [],
        secondary: [],
        longTail: [],
        density: {},
      },
      readability,
      structure,
      improvements: aiAnalysis.improvements || {
        critical: [],
        important: [],
        optional: [],
      },
      imageOptimization: aiAnalysis.imageOptimization || {
        altTextSuggestions: [],
        recommendedImageCount: 3,
      },
      internalLinking: aiAnalysis.internalLinking || {
        suggestedAnchors: [],
        relatedTopics: [],
      },
    };
  }

  /**
   * Calculate readability metrics
   *
   * @param text - Article text
   * @returns Readability metrics
   */
  private calculateReadability(text: string): ReadabilityMetrics {
    const isJapanese = this.isJapaneseText(text);

    // Split into sentences
    const sentences = text.split(/[。.!?]+/).filter((s) => s.trim().length > 0);
    const sentenceCount = sentences.length;

    // Calculate average sentence length
    const averageSentenceLength =
      sentenceCount > 0 ? text.length / sentenceCount : 0;

    // Split into paragraphs
    const paragraphs = text.split(/\n\n+/).filter((p) => p.trim().length > 0);
    const paragraphCount = paragraphs.length;

    // Calculate average paragraph length
    const averageParagraphLength =
      paragraphCount > 0 ? text.length / paragraphCount : 0;

    // Calculate readability score
    let score = 100;

    // Penalize for long sentences
    if (averageSentenceLength > 100) {
      score -= Math.min(30, (averageSentenceLength - 100) / 5);
    }

    // Penalize for long paragraphs
    if (averageParagraphLength > 300) {
      score -= Math.min(20, (averageParagraphLength - 300) / 20);
    }

    score = Math.max(0, Math.min(100, score));

    // Determine reading level
    let level = '読みやすい';
    if (score >= 80) {
      level = '小学生レベル';
    } else if (score >= 60) {
      level = '中学生レベル';
    } else if (score >= 40) {
      level = '高校生レベル';
    } else if (score >= 20) {
      level = '大学生レベル';
    } else {
      level = '専門的';
    }

    // Calculate kanji ratio for Japanese text
    let kanjiRatio: number | undefined;
    if (isJapanese) {
      const kanjiCount = (text.match(/[\u4e00-\u9faf]/g) || []).length;
      kanjiRatio = text.length > 0 ? (kanjiCount / text.length) * 100 : 0;
    }

    return {
      score,
      level,
      averageSentenceLength,
      averageParagraphLength,
      kanjiRatio,
    };
  }

  /**
   * Calculate overall SEO score
   *
   * @param aiAnalysis - AI analysis data
   * @param structure - Structure analysis
   * @param readability - Readability metrics
   * @param title - Article title
   * @returns SEO score (0-100)
   */
  private calculateSEOScore(
    aiAnalysis: any,
    structure: ContentStructure,
    readability: ReadabilityMetrics,
    title?: string
  ): number {
    let score = 100;

    // Content length (20 points)
    if (structure.wordCount < this.IDEAL_WORD_COUNT_MIN) {
      score -= 20;
    } else if (structure.wordCount < this.IDEAL_WORD_COUNT_IDEAL) {
      score -= 10;
    }

    // Readability (20 points)
    if (readability.score < this.IDEAL_READABILITY_SCORE) {
      score -= 20 * (1 - readability.score / this.IDEAL_READABILITY_SCORE);
    }

    // Meta description (15 points)
    if (!aiAnalysis.metaDescription) {
      score -= 15;
    } else {
      const metaLength = aiAnalysis.metaDescription.length;
      if (
        metaLength < this.META_DESCRIPTION_MIN ||
        metaLength > this.META_DESCRIPTION_MAX
      ) {
        score -= 10;
      }
    }

    // Title (15 points)
    if (!title) {
      score -= 15;
    } else if (title.length < 20 || title.length > 60) {
      score -= 10;
    }

    // Structure (15 points)
    if (structure.headingCount === 0) {
      score -= 15;
    } else if (structure.headingCount < 3 && structure.wordCount > 500) {
      score -= 10;
    }

    // Keywords (15 points)
    if (!aiAnalysis.keywords?.primary?.length) {
      score -= 15;
    } else if (aiAnalysis.keywords.primary.length < 3) {
      score -= 10;
    }

    return Math.max(0, Math.min(100, Math.round(score)));
  }

  /**
   * Convert score to letter grade
   *
   * @param score - SEO score (0-100)
   * @returns Letter grade
   */
  private scoreToGrade(score: number): 'A' | 'B' | 'C' | 'D' | 'F' {
    if (score >= 80) return 'A';
    if (score >= 60) return 'B';
    if (score >= 40) return 'C';
    if (score >= 20) return 'D';
    return 'F';
  }

  /**
   * Generate URL-friendly slug
   *
   * @param text - Text to convert to slug
   * @returns URL slug
   */
  private generateSlug(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/[\s_-]+/g, '-') // Replace spaces/underscores with hyphens
      .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
      .slice(0, 60); // Limit length
  }

  /**
   * Count words in text (handles Japanese and English)
   *
   * @param text - Text to count
   * @returns Word count
   */
  private countWords(text: string): number {
    const isJapanese = this.isJapaneseText(text);

    if (isJapanese) {
      // For Japanese, count characters as approximate word count
      return text.length;
    } else {
      // For English, count words separated by spaces
      return text.split(/\s+/).filter((word) => word.length > 0).length;
    }
  }

  /**
   * Check if text is primarily Japanese
   *
   * @param text - Text to check
   * @returns True if Japanese
   */
  private isJapaneseText(text: string): boolean {
    const japaneseChars = text.match(/[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf]/g);
    return japaneseChars ? japaneseChars.length / text.length > 0.3 : false;
  }

  /**
   * Estimate cost for SEO analysis
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
    const promptTokens = 500; // SEO prompt is larger
    const inputTokens = articleTokens + promptTokens;
    const outputTokens = 800; // SEO analysis needs more output

    const total = this.aiService.estimateCost(inputTokens, outputTokens);

    return {
      inputTokens,
      outputTokens,
      total,
    };
  }
}
