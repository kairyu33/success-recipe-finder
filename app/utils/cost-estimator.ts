/**
 * Cost Estimation Utility for Claude API
 *
 * @description Provides functions to estimate API costs based on token usage
 * for Claude Sonnet 4.5 model pricing
 *
 * @see https://www.anthropic.com/pricing for latest pricing
 */

/**
 * Claude Sonnet 4.5 pricing as of 2025
 * Input: $3 per million tokens
 * Output: $15 per million tokens
 */
const PRICING = {
  INPUT_PER_MILLION: 3.0,
  OUTPUT_PER_MILLION: 15.0,
} as const;

/**
 * Estimate the approximate number of input tokens for a given text
 *
 * @description Uses a simple heuristic: ~4 characters per token for English,
 * ~2-3 characters per token for Japanese. This is a rough estimate.
 *
 * @param text - The input text to estimate tokens for
 * @returns Approximate number of tokens
 *
 * @example
 * ```typescript
 * const tokens = estimateInputTokens("Hello world");
 * console.log(tokens); // ~3
 * ```
 */
export function estimateInputTokens(text: string): number {
  // Japanese text tends to use ~2.5 chars per token
  // English text tends to use ~4 chars per token
  // We'll use 3 as a reasonable average for mixed content
  const CHARS_PER_TOKEN = 3;
  return Math.ceil(text.length / CHARS_PER_TOKEN);
}

/**
 * Estimate the cost of an API call based on input and output tokens
 *
 * @description Calculates the total cost in USD based on Claude Sonnet 4.5 pricing:
 * - Input: $3 per million tokens
 * - Output: $15 per million tokens
 *
 * @param inputTokens - Number of input tokens
 * @param outputTokens - Number of expected output tokens
 * @returns Estimated cost in USD
 *
 * @example
 * ```typescript
 * const cost = estimateCost(1000, 500);
 * console.log(cost); // ~0.0105 USD
 * ```
 */
export function estimateCost(inputTokens: number, outputTokens: number): number {
  const inputCost = (inputTokens / 1_000_000) * PRICING.INPUT_PER_MILLION;
  const outputCost = (outputTokens / 1_000_000) * PRICING.OUTPUT_PER_MILLION;
  return inputCost + outputCost;
}

/**
 * Estimate the cost for generating hashtags
 *
 * @description Estimates the cost for the hashtag generation API endpoint
 * which typically uses:
 * - Input: article text + prompt (~200-3000 tokens)
 * - Output: 20 hashtags (~100-200 tokens)
 *
 * @param articleText - The article text to analyze
 * @returns Estimated cost object with breakdown
 *
 * @example
 * ```typescript
 * const estimate = estimateHashtagCost("Long article text...");
 * console.log(`Cost: $${estimate.total.toFixed(4)}`);
 * ```
 */
export function estimateHashtagCost(articleText: string): {
  inputTokens: number;
  outputTokens: number;
  total: number;
  breakdown: {
    input: number;
    output: number;
  };
} {
  // Estimate input tokens: article + prompt (~200 tokens)
  const articleTokens = estimateInputTokens(articleText);
  const promptTokens = 200; // Approximate prompt size
  const inputTokens = articleTokens + promptTokens;

  // Estimate output tokens: 20 hashtags (~150 tokens)
  const outputTokens = 150;

  const inputCost = (inputTokens / 1_000_000) * PRICING.INPUT_PER_MILLION;
  const outputCost = (outputTokens / 1_000_000) * PRICING.OUTPUT_PER_MILLION;
  const total = inputCost + outputCost;

  return {
    inputTokens,
    outputTokens,
    total,
    breakdown: {
      input: inputCost,
      output: outputCost,
    },
  };
}

/**
 * Estimate the cost for comprehensive article analysis
 *
 * @description Estimates the cost for the full analysis API endpoint
 * which typically uses:
 * - Input: article text + comprehensive prompt (~300-3500 tokens)
 * - Output: titles, insights, image ideas, hashtags (~1500-3000 tokens)
 *
 * @param articleText - The article text to analyze
 * @returns Estimated cost object with breakdown
 *
 * @example
 * ```typescript
 * const estimate = estimateAnalysisCost("Long article text...");
 * console.log(`Cost: $${estimate.total.toFixed(4)}`);
 * console.log(`Est. ${estimate.inputTokens} input + ${estimate.outputTokens} output tokens`);
 * ```
 */
export function estimateAnalysisCost(articleText: string): {
  inputTokens: number;
  outputTokens: number;
  total: number;
  breakdown: {
    input: number;
    output: number;
  };
} {
  // Estimate input tokens: article + comprehensive prompt (~400-500 tokens)
  const articleTokens = estimateInputTokens(articleText);
  const promptTokens = 450; // Approximate comprehensive prompt size
  const inputTokens = articleTokens + promptTokens;

  // Estimate output tokens: titles + insights + image + hashtags (~2000 tokens)
  const outputTokens = 2000;

  const inputCost = (inputTokens / 1_000_000) * PRICING.INPUT_PER_MILLION;
  const outputCost = (outputTokens / 1_000_000) * PRICING.OUTPUT_PER_MILLION;
  const total = inputCost + outputCost;

  return {
    inputTokens,
    outputTokens,
    total,
    breakdown: {
      input: inputCost,
      output: outputCost,
    },
  };
}

/**
 * Format cost as a user-friendly string
 *
 * @param cost - Cost in USD
 * @returns Formatted cost string
 *
 * @example
 * ```typescript
 * formatCost(0.0123); // "$0.0123"
 * formatCost(0.0001); // "$0.0001"
 * formatCost(1.234); // "$1.23"
 * ```
 */
export function formatCost(cost: number): string {
  if (cost < 0.01) {
    return `$${cost.toFixed(4)}`;
  } else if (cost < 1) {
    return `$${cost.toFixed(3)}`;
  } else {
    return `$${cost.toFixed(2)}`;
  }
}

/**
 * Calculate cost savings from using batch analysis vs separate calls
 *
 * @param articleText - The article text
 * @returns Savings information
 *
 * @example
 * ```typescript
 * const savings = calculateBatchSavings("Article text...");
 * console.log(`Save ${savings.percentage.toFixed(1)}% by using batch analysis`);
 * ```
 */
export function calculateBatchSavings(articleText: string): {
  batchCost: number;
  separateCost: number;
  savings: number;
  percentage: number;
} {
  // Batch analysis: single comprehensive call
  const batchEstimate = estimateAnalysisCost(articleText);
  const batchCost = batchEstimate.total;

  // Separate calls: multiple API calls
  // Simplified: estimate as 2x the input cost due to repeated article text
  const hashtagEstimate = estimateHashtagCost(articleText);
  const separateCost = hashtagEstimate.total * 3; // Approximate for multiple endpoints

  const savings = separateCost - batchCost;
  const percentage = (savings / separateCost) * 100;

  return {
    batchCost,
    separateCost,
    savings,
    percentage,
  };
}
