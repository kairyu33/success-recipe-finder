/**
 * Rate Limiting Utility for API Calls
 *
 * @description Provides simple rate limiting to prevent excessive API calls
 * and reduce costs. Implements both in-memory throttling and request deduplication.
 */

/**
 * In-memory store for tracking request timestamps and hashes
 */
interface RequestRecord {
  timestamp: number;
  hash?: string;
}

const requestHistory: Map<string, RequestRecord[]> = new Map();
const requestCache: Map<string, { result: any; timestamp: number }> = new Map();

/**
 * Configuration for rate limiting
 */
export interface RateLimitConfig {
  /**
   * Maximum number of requests allowed per time window
   */
  maxRequests: number;

  /**
   * Time window in milliseconds
   */
  windowMs: number;

  /**
   * Whether to enable request deduplication
   */
  enableDeduplication: boolean;

  /**
   * Time window for deduplication in milliseconds
   */
  deduplicationWindowMs: number;
}

/**
 * Default rate limit configuration
 * - 10 requests per minute
 * - Deduplication enabled for 30 seconds
 */
export const DEFAULT_RATE_LIMIT_CONFIG: RateLimitConfig = {
  maxRequests: 10,
  windowMs: 60 * 1000, // 1 minute
  enableDeduplication: true,
  deduplicationWindowMs: 30 * 1000, // 30 seconds
};

/**
 * Get rate limit configuration from environment variables
 *
 * @returns Rate limit configuration
 */
export function getRateLimitConfig(): RateLimitConfig {
  const maxRequests = process.env.API_RATE_LIMIT_MAX_REQUESTS
    ? parseInt(process.env.API_RATE_LIMIT_MAX_REQUESTS, 10)
    : DEFAULT_RATE_LIMIT_CONFIG.maxRequests;

  const windowMs = process.env.API_RATE_LIMIT_WINDOW_MS
    ? parseInt(process.env.API_RATE_LIMIT_WINDOW_MS, 10)
    : DEFAULT_RATE_LIMIT_CONFIG.windowMs;

  const enableDeduplication =
    process.env.ENABLE_REQUEST_DEDUPLICATION !== "false";

  const deduplicationWindowMs = process.env.DEDUPLICATION_WINDOW_MS
    ? parseInt(process.env.DEDUPLICATION_WINDOW_MS, 10)
    : DEFAULT_RATE_LIMIT_CONFIG.deduplicationWindowMs;

  return {
    maxRequests,
    windowMs,
    enableDeduplication,
    deduplicationWindowMs,
  };
}

/**
 * Create a simple hash of a string for deduplication
 *
 * @param str - String to hash
 * @returns Hash string
 */
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return hash.toString(36);
}

/**
 * Check if a request should be rate limited
 *
 * @param identifier - Unique identifier for the client (e.g., IP address, user ID)
 * @param config - Rate limit configuration
 * @returns Object indicating if rate limited and remaining requests
 *
 * @example
 * ```typescript
 * const result = checkRateLimit("user-123");
 * if (result.isRateLimited) {
 *   return new Response("Too many requests", { status: 429 });
 * }
 * ```
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig = DEFAULT_RATE_LIMIT_CONFIG
): {
  isRateLimited: boolean;
  remaining: number;
  resetAt: number;
} {
  const now = Date.now();
  const windowStart = now - config.windowMs;

  // Get or create request history for this identifier
  let history = requestHistory.get(identifier) || [];

  // Remove expired records
  history = history.filter((record) => record.timestamp > windowStart);

  // Check if rate limited
  const isRateLimited = history.length >= config.maxRequests;
  const remaining = Math.max(0, config.maxRequests - history.length);
  const resetAt = history.length > 0 ? history[0].timestamp + config.windowMs : now;

  // Add current request to history if not rate limited
  if (!isRateLimited) {
    history.push({ timestamp: now });
    requestHistory.set(identifier, history);
  }

  return {
    isRateLimited,
    remaining,
    resetAt,
  };
}

/**
 * Check if a request is a duplicate within the deduplication window
 *
 * @param identifier - Unique identifier for the client
 * @param requestData - Request data to check for duplication
 * @param config - Rate limit configuration
 * @returns Object indicating if duplicate and cached result if available
 *
 * @example
 * ```typescript
 * const result = checkDuplicateRequest("user-123", { articleText: "..." });
 * if (result.isDuplicate && result.cachedResult) {
 *   return result.cachedResult;
 * }
 * ```
 */
export function checkDuplicateRequest(
  identifier: string,
  requestData: any,
  config: RateLimitConfig = DEFAULT_RATE_LIMIT_CONFIG
): {
  isDuplicate: boolean;
  cachedResult?: any;
} {
  if (!config.enableDeduplication) {
    return { isDuplicate: false };
  }

  const now = Date.now();
  const requestHash = simpleHash(JSON.stringify(requestData));
  const cacheKey = `${identifier}:${requestHash}`;

  // Check if we have a cached result
  const cached = requestCache.get(cacheKey);
  if (cached && now - cached.timestamp < config.deduplicationWindowMs) {
    return {
      isDuplicate: true,
      cachedResult: cached.result,
    };
  }

  return { isDuplicate: false };
}

/**
 * Cache a request result for deduplication
 *
 * @param identifier - Unique identifier for the client
 * @param requestData - Request data
 * @param result - Result to cache
 *
 * @example
 * ```typescript
 * const result = await analyzeArticle(text);
 * cacheRequestResult("user-123", { articleText: text }, result);
 * ```
 */
export function cacheRequestResult(
  identifier: string,
  requestData: any,
  result: any
): void {
  const requestHash = simpleHash(JSON.stringify(requestData));
  const cacheKey = `${identifier}:${requestHash}`;

  requestCache.set(cacheKey, {
    result,
    timestamp: Date.now(),
  });
}

/**
 * Clean up expired cache entries and request history
 *
 * @description Should be called periodically to prevent memory leaks
 */
export function cleanupExpiredRecords(): void {
  const now = Date.now();
  const config = getRateLimitConfig();

  // Clean up request history
  for (const [identifier, history] of requestHistory.entries()) {
    const filtered = history.filter(
      (record) => now - record.timestamp < config.windowMs * 2
    );
    if (filtered.length === 0) {
      requestHistory.delete(identifier);
    } else {
      requestHistory.set(identifier, filtered);
    }
  }

  // Clean up request cache
  for (const [key, cached] of requestCache.entries()) {
    if (now - cached.timestamp > config.deduplicationWindowMs) {
      requestCache.delete(key);
    }
  }
}

/**
 * Client-side rate limiter for button clicks
 *
 * @description Prevents rapid button clicks on the frontend
 */
export class ClientRateLimiter {
  private lastRequestTime: number = 0;
  private cooldownMs: number;

  constructor(cooldownMs: number = 2000) {
    this.cooldownMs = cooldownMs;
  }

  /**
   * Check if a request can be made
   *
   * @returns True if request is allowed, false if still in cooldown
   */
  canMakeRequest(): boolean {
    const now = Date.now();
    if (now - this.lastRequestTime < this.cooldownMs) {
      return false;
    }
    this.lastRequestTime = now;
    return true;
  }

  /**
   * Get remaining cooldown time in milliseconds
   *
   * @returns Remaining cooldown time, or 0 if ready
   */
  getRemainingCooldown(): number {
    const now = Date.now();
    const remaining = this.cooldownMs - (now - this.lastRequestTime);
    return Math.max(0, remaining);
  }

  /**
   * Reset the rate limiter
   */
  reset(): void {
    this.lastRequestTime = 0;
  }
}

// Set up periodic cleanup (every 5 minutes)
if (typeof setInterval !== "undefined") {
  setInterval(cleanupExpiredRecords, 5 * 60 * 1000);
}
