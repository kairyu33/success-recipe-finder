/**
 * Token Estimation
 *
 * @description Estimates token count for prompts using simple heuristics
 * Useful for cost estimation and validation before API calls
 */

/**
 * Estimate token count for text
 *
 * @description Uses simple heuristics to estimate tokens:
 * - English: ~4 characters per token
 * - Japanese: ~2-3 characters per token (more dense)
 * - Code/JSON: ~3.5 characters per token
 *
 * This is a rough estimate. For exact counts, use the actual API's token counter.
 *
 * @param text - Text to estimate tokens for
 * @returns Estimated token count
 *
 * @example
 * ```typescript
 * const tokens = estimateTokens('Hello world, this is a test.');
 * console.log(tokens); // ~7-8 tokens
 * ```
 */
export function estimateTokens(text: string): number {
  if (!text || text.length === 0) {
    return 0;
  }

  // Count different character types
  const japaneseChars = (text.match(/[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf]/g) || []).length;
  const englishChars = (text.match(/[a-zA-Z]/g) || []).length;
  const numbers = (text.match(/[0-9]/g) || []).length;
  const whitespace = (text.match(/\s/g) || []).length;
  const otherChars = text.length - japaneseChars - englishChars - numbers - whitespace;

  // Token estimation factors
  const japaneseTokens = japaneseChars / 2.5; // Japanese is more token-dense
  const englishTokens = englishChars / 4; // English ~4 chars per token
  const numberTokens = numbers / 3; // Numbers are usually efficient
  const otherTokens = otherChars / 3.5; // Punctuation, symbols, etc.
  const whitespaceTokens = whitespace * 0.2; // Whitespace contributes minimally

  const totalEstimate = Math.ceil(
    japaneseTokens + englishTokens + numberTokens + otherTokens + whitespaceTokens
  );

  // Add overhead for special tokens and formatting
  const overhead = Math.ceil(totalEstimate * 0.05); // 5% overhead

  return totalEstimate + overhead;
}

/**
 * Estimate tokens for a prompt template with variables
 *
 * @description Estimates tokens including both system and user prompts
 *
 * @param systemPrompt - System prompt text
 * @param userPrompt - User prompt text
 * @returns Object with input and total estimates
 */
export function estimatePromptTokens(
  systemPrompt: string,
  userPrompt: string
): {
  system: number;
  user: number;
  total: number;
} {
  const systemTokens = estimateTokens(systemPrompt);
  const userTokens = estimateTokens(userPrompt);

  return {
    system: systemTokens,
    user: userTokens,
    total: systemTokens + userTokens,
  };
}

/**
 * Estimate cost for a prompt
 *
 * @description Estimates cost based on Claude Sonnet 4.5 pricing:
 * - Input: $3 per million tokens
 * - Output: $15 per million tokens
 * - Cached input: $0.30 per million tokens (90% discount)
 *
 * @param inputTokens - Estimated input tokens
 * @param outputTokens - Estimated output tokens
 * @param cached - Whether input is cached
 * @returns Estimated cost in USD
 *
 * @example
 * ```typescript
 * const cost = estimateCost(1000, 500, false);
 * console.log(`Estimated cost: $${cost.toFixed(4)}`);
 * ```
 */
export function estimateCost(
  inputTokens: number,
  outputTokens: number,
  cached = false
): number {
  // Claude Sonnet 4.5 pricing (per million tokens)
  const INPUT_COST_PER_MILLION = 3.0;
  const OUTPUT_COST_PER_MILLION = 15.0;
  const CACHED_INPUT_COST_PER_MILLION = 0.3;

  const inputCost = cached
    ? (inputTokens / 1_000_000) * CACHED_INPUT_COST_PER_MILLION
    : (inputTokens / 1_000_000) * INPUT_COST_PER_MILLION;

  const outputCost = (outputTokens / 1_000_000) * OUTPUT_COST_PER_MILLION;

  return inputCost + outputCost;
}

/**
 * Estimate cost range for a prompt with caching
 *
 * @description Returns cost estimates for first call (cache creation)
 * and subsequent calls (cache hit)
 *
 * @param inputTokens - Estimated input tokens
 * @param outputTokens - Estimated output tokens
 * @returns Cost range object
 */
export function estimateCostRange(
  inputTokens: number,
  outputTokens: number
): {
  firstCall: number;
  cachedCall: number;
  savings: number;
  savingsPercent: number;
} {
  const firstCall = estimateCost(inputTokens, outputTokens, false);
  const cachedCall = estimateCost(inputTokens, outputTokens, true);
  const savings = firstCall - cachedCall;
  const savingsPercent = (savings / firstCall) * 100;

  return {
    firstCall,
    cachedCall,
    savings,
    savingsPercent,
  };
}

/**
 * Check if text is within token budget
 *
 * @param text - Text to check
 * @param maxTokens - Maximum allowed tokens
 * @returns Object with result and details
 */
export function isWithinBudget(
  text: string,
  maxTokens: number
): {
  withinBudget: boolean;
  estimated: number;
  max: number;
  remaining: number;
  percentUsed: number;
} {
  const estimated = estimateTokens(text);
  const withinBudget = estimated <= maxTokens;
  const remaining = maxTokens - estimated;
  const percentUsed = (estimated / maxTokens) * 100;

  return {
    withinBudget,
    estimated,
    max: maxTokens,
    remaining,
    percentUsed,
  };
}

/**
 * Truncate text to fit within token budget
 *
 * @description Truncates text to approximately fit within token limit
 * Note: This is approximate and may still exceed slightly
 *
 * @param text - Text to truncate
 * @param maxTokens - Maximum tokens allowed
 * @returns Truncated text
 */
export function truncateToTokens(text: string, maxTokens: number): string {
  const currentTokens = estimateTokens(text);

  if (currentTokens <= maxTokens) {
    return text;
  }

  // Calculate approximate character count to keep
  const ratio = maxTokens / currentTokens;
  const targetLength = Math.floor(text.length * ratio);

  // Truncate at nearest word boundary
  const truncated = text.slice(0, targetLength);
  const lastSpace = truncated.lastIndexOf(' ');

  if (lastSpace > 0) {
    return truncated.slice(0, lastSpace) + '...';
  }

  return truncated + '...';
}

/**
 * Format token count for display
 *
 * @param tokens - Token count
 * @returns Formatted string
 *
 * @example
 * ```typescript
 * formatTokenCount(1500); // "1.5K tokens"
 * formatTokenCount(250); // "250 tokens"
 * ```
 */
export function formatTokenCount(tokens: number): string {
  if (tokens >= 1_000_000) {
    return `${(tokens / 1_000_000).toFixed(2)}M tokens`;
  }
  if (tokens >= 1_000) {
    return `${(tokens / 1_000).toFixed(1)}K tokens`;
  }
  return `${tokens} tokens`;
}

/**
 * Format cost for display
 *
 * @param cost - Cost in USD
 * @returns Formatted string
 *
 * @example
 * ```typescript
 * formatCost(0.00123); // "$0.0012"
 * formatCost(1.5); // "$1.50"
 * ```
 */
export function formatCost(cost: number): string {
  if (cost < 0.0001) {
    return '<$0.0001';
  }
  if (cost < 1) {
    return `$${cost.toFixed(4)}`;
  }
  return `$${cost.toFixed(2)}`;
}
