/**
 * Response-Level Caching Utility
 *
 * @description Implements comprehensive caching for API responses using content hashing.
 * Caches complete analysis results to avoid redundant AI calls for identical content.
 *
 * Cost Impact: 80-95% savings for repeat analyses (cache hits)
 *
 * Features:
 * - SHA-256 content hashing for deterministic keys
 * - Configurable TTL (default 24 hours)
 * - Cache statistics and monitoring
 * - Integration with existing MemoryCacheService
 *
 * @example
 * ```typescript
 * const cached = await getCachedAnalysis(articleText, '/api/analyze-article');
 * if (cached) {
 *   return cached; // 95% cost savings!
 * }
 * const result = await performAnalysis();
 * await cacheAnalysis(articleText, '/api/analyze-article', result);
 * ```
 */

import { MemoryCacheService } from '@/app/services/cache/MemoryCacheService';
import { generateCacheKey, hashObject } from '@/app/services/cache/CacheService.interface';
import crypto from 'crypto';

/**
 * Cache configuration
 */
const CACHE_CONFIG = {
  /** Default TTL: 24 hours (can be overridden via env) */
  DEFAULT_TTL: parseInt(process.env.API_CACHE_TTL || '86400', 10),
  /** Max cache size: 5000 entries */
  MAX_SIZE: parseInt(process.env.API_CACHE_MAX_SIZE || '5000', 10),
  /** Cleanup interval: 10 minutes */
  CLEANUP_INTERVAL: 10 * 60 * 1000,
};

/**
 * Global cache instance for API responses
 */
const responseCache = new MemoryCacheService({
  maxSize: CACHE_CONFIG.MAX_SIZE,
  defaultTTL: CACHE_CONFIG.DEFAULT_TTL,
  cleanupInterval: CACHE_CONFIG.CLEANUP_INTERVAL,
});

/**
 * Cached analysis response metadata
 */
export interface CachedAnalysisMetadata {
  /** When the response was cached */
  cachedAt: string;
  /** Original request hash */
  requestHash: string;
  /** Cache hit or miss */
  cacheStatus: 'hit' | 'miss';
  /** Time saved by cache hit (in ms) */
  timeSaved?: number;
  /** Estimated cost savings */
  costSavings?: string;
}

/**
 * Generate a deterministic hash of article content
 *
 * @description Uses SHA-256 to create a unique, deterministic hash of the article text.
 * This ensures identical content always produces the same cache key.
 *
 * @param articleText - Article content to hash
 * @returns SHA-256 hash (first 16 chars for brevity)
 *
 * @example
 * ```typescript
 * const hash1 = hashArticleContent('same text');
 * const hash2 = hashArticleContent('same text');
 * // hash1 === hash2 (deterministic)
 * ```
 */
export function hashArticleContent(articleText: string): string {
  return crypto
    .createHash('sha256')
    .update(articleText.trim())
    .digest('hex')
    .substring(0, 16); // Use first 16 chars for readability
}

/**
 * Generate cache key for API response
 *
 * @param articleText - Article content
 * @param endpoint - API endpoint
 * @param additionalParams - Optional additional parameters to include in hash
 * @returns Cache key string
 *
 * @example
 * ```typescript
 * const key = generateResponseCacheKey(text, '/api/analyze-article');
 * // Returns: 'api-response:/api/analyze-article:a1b2c3d4e5f6g7h8'
 * ```
 */
export function generateResponseCacheKey(
  articleText: string,
  endpoint: string,
  additionalParams?: Record<string, any>
): string {
  const contentHash = hashArticleContent(articleText);

  // Include additional params in hash if provided
  const paramsHash = additionalParams
    ? hashObject(additionalParams)
    : '';

  const key = paramsHash
    ? `api-response:${endpoint}:${contentHash}:${paramsHash}`
    : `api-response:${endpoint}:${contentHash}`;

  return key;
}

/**
 * Get cached analysis response
 *
 * @param articleText - Article content
 * @param endpoint - API endpoint
 * @param additionalParams - Optional additional parameters
 * @returns Cached response or null if not found
 *
 * @example
 * ```typescript
 * const cached = await getCachedAnalysis(articleText, '/api/analyze-article-full');
 * if (cached) {
 *   console.log('Cache hit! Returning cached result.');
 *   return NextResponse.json(cached);
 * }
 * ```
 */
export async function getCachedAnalysis<T = any>(
  articleText: string,
  endpoint: string,
  additionalParams?: Record<string, any>
): Promise<T | null> {
  try {
    const key = generateResponseCacheKey(articleText, endpoint, additionalParams);
    const cached = await responseCache.get<T>(key);

    if (cached) {
      console.log(`[ResponseCache] Cache HIT for ${endpoint}`, {
        content_hash: hashArticleContent(articleText),
        cache_key: key,
      });
    }

    return cached;
  } catch (error) {
    console.error('[ResponseCache] Error reading from cache:', error);
    return null;
  }
}

/**
 * Cache analysis response
 *
 * @param articleText - Article content
 * @param endpoint - API endpoint
 * @param response - Response to cache
 * @param ttl - Time-to-live in seconds (optional, defaults to 24h)
 * @param additionalParams - Optional additional parameters
 *
 * @example
 * ```typescript
 * const result = await performAnalysis(articleText);
 * await cacheAnalysis(articleText, '/api/analyze-article', result, 86400);
 * ```
 */
export async function cacheAnalysis<T = any>(
  articleText: string,
  endpoint: string,
  response: T,
  ttl?: number,
  additionalParams?: Record<string, any>
): Promise<void> {
  try {
    const key = generateResponseCacheKey(articleText, endpoint, additionalParams);

    await responseCache.set(key, response, {
      ttl: ttl || CACHE_CONFIG.DEFAULT_TTL,
      tags: [endpoint, 'api-response'],
    });

    console.log(`[ResponseCache] Cached response for ${endpoint}`, {
      content_hash: hashArticleContent(articleText),
      cache_key: key,
      ttl_seconds: ttl || CACHE_CONFIG.DEFAULT_TTL,
    });
  } catch (error) {
    console.error('[ResponseCache] Error writing to cache:', error);
    // Don't throw - caching failure shouldn't break the API
  }
}

/**
 * Invalidate cache for a specific endpoint or pattern
 *
 * @param pattern - Pattern to match (e.g., 'api-response:/api/analyze-article:*')
 * @returns Number of keys deleted
 *
 * @example
 * ```typescript
 * // Invalidate all cached responses for an endpoint
 * await invalidateResponseCache('api-response:/api/analyze-article:*');
 *
 * // Invalidate all API responses
 * await invalidateResponseCache('api-response:*');
 * ```
 */
export async function invalidateResponseCache(pattern: string): Promise<number> {
  try {
    const deleted = await responseCache.deletePattern(pattern);
    console.log(`[ResponseCache] Invalidated ${deleted} entries matching: ${pattern}`);
    return deleted;
  } catch (error) {
    console.error('[ResponseCache] Error invalidating cache:', error);
    return 0;
  }
}

/**
 * Get cache statistics
 *
 * @returns Promise resolving to cache statistics
 *
 * @example
 * ```typescript
 * const stats = await getResponseCacheStats();
 * console.log(`Cache hit rate: ${(stats.hitRate * 100).toFixed(1)}%`);
 * console.log(`Total cached: ${stats.size} responses`);
 * ```
 */
export async function getResponseCacheStats() {
  try {
    const stats = await responseCache.getStats();
    const costSavings = estimateCacheCostSavings(stats.hits);

    return {
      ...stats,
      estimatedCostSavings: costSavings,
    };
  } catch (error) {
    console.error('[ResponseCache] Error getting stats:', error);
    return {
      hits: 0,
      misses: 0,
      size: 0,
      hitRate: 0,
      estimatedCostSavings: { total: 0, perHit: 0 },
    };
  }
}

/**
 * Estimate cost savings from cache hits
 *
 * @description Calculates estimated cost savings based on cache hits.
 * Assumes average API call cost of $0.02 (conservative estimate).
 *
 * @param hits - Number of cache hits
 * @returns Estimated cost savings
 *
 * @example
 * ```typescript
 * const savings = estimateCacheCostSavings(1000);
 * console.log(`Saved approximately $${savings.total.toFixed(2)}`);
 * ```
 */
export function estimateCacheCostSavings(hits: number): {
  total: number;
  perHit: number;
} {
  // Conservative estimate: $0.02 per full analysis API call
  // (2000 input tokens + 1000 output tokens at Sonnet 4.5 pricing)
  const AVERAGE_API_COST = 0.02;

  return {
    total: hits * AVERAGE_API_COST,
    perHit: AVERAGE_API_COST,
  };
}

/**
 * Add cache metadata to response
 *
 * @param response - Original response object
 * @param isCacheHit - Whether this was a cache hit
 * @param requestHash - Request hash
 * @returns Response with cache metadata
 *
 * @example
 * ```typescript
 * const response = { hashtags: [...] };
 * const enhanced = addCacheMetadata(response, true, 'abc123');
 * // Returns: { hashtags: [...], _cache: { cacheStatus: 'hit', ... } }
 * ```
 */
export function addCacheMetadata<T extends Record<string, any>>(
  response: T,
  isCacheHit: boolean,
  requestHash: string,
  timeSaved?: number
): T & { _cache: CachedAnalysisMetadata } {
  const metadata: CachedAnalysisMetadata = {
    cachedAt: new Date().toISOString(),
    requestHash,
    cacheStatus: isCacheHit ? 'hit' : 'miss',
    timeSaved: isCacheHit ? timeSaved : undefined,
    costSavings: isCacheHit ? '$0.016-0.020' : undefined,
  };

  return {
    ...response,
    _cache: metadata,
  };
}

/**
 * Clear all cached responses
 *
 * @example
 * ```typescript
 * await clearResponseCache();
 * console.log('All cached responses cleared');
 * ```
 */
export async function clearResponseCache(): Promise<void> {
  try {
    await responseCache.clear();
    console.log('[ResponseCache] All cached responses cleared');
  } catch (error) {
    console.error('[ResponseCache] Error clearing cache:', error);
  }
}

/**
 * Check if caching is enabled
 *
 * @returns True if caching is enabled via environment variable
 */
export function isResponseCachingEnabled(): boolean {
  return process.env.ENABLE_API_RESPONSE_CACHE !== 'false';
}
