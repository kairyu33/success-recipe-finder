/**
 * Simple In-Memory Caching Layer
 *
 * @description Provides caching functionality to reduce duplicate API calls.
 * This is an in-memory implementation - for production, consider Redis or similar.
 *
 * @note Currently implemented for future use. Enable via ENABLE_CACHING=true
 */

/**
 * Cache entry structure
 */
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  hits: number;
}

/**
 * Cache statistics
 */
interface CacheStats {
  hits: number;
  misses: number;
  size: number;
  hitRate: number;
}

/**
 * In-memory cache storage
 */
class InMemoryCache<T = any> {
  private cache: Map<string, CacheEntry<T>> = new Map();
  private maxSize: number;
  private ttlMs: number;
  private hits: number = 0;
  private misses: number = 0;

  constructor(maxSize: number = 1000, ttlMs: number = 30 * 60 * 1000) {
    this.maxSize = maxSize;
    this.ttlMs = ttlMs;
  }

  /**
   * Get a value from cache
   *
   * @param key - Cache key
   * @returns Cached value or undefined if not found or expired
   */
  get(key: string): T | undefined {
    const entry = this.cache.get(key);

    if (!entry) {
      this.misses++;
      return undefined;
    }

    // Check if expired
    if (Date.now() - entry.timestamp > this.ttlMs) {
      this.cache.delete(key);
      this.misses++;
      return undefined;
    }

    // Update hit count
    entry.hits++;
    this.hits++;
    return entry.data;
  }

  /**
   * Set a value in cache
   *
   * @param key - Cache key
   * @param value - Value to cache
   */
  set(key: string, value: T): void {
    // Check cache size limit
    if (this.cache.size >= this.maxSize && !this.cache.has(key)) {
      // Remove oldest entry
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }

    this.cache.set(key, {
      data: value,
      timestamp: Date.now(),
      hits: 0,
    });
  }

  /**
   * Check if key exists in cache
   *
   * @param key - Cache key
   * @returns True if key exists and not expired
   */
  has(key: string): boolean {
    return this.get(key) !== undefined;
  }

  /**
   * Delete a key from cache
   *
   * @param key - Cache key
   */
  delete(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
    this.hits = 0;
    this.misses = 0;
  }

  /**
   * Get cache statistics
   *
   * @returns Cache statistics
   */
  getStats(): CacheStats {
    const total = this.hits + this.misses;
    return {
      hits: this.hits,
      misses: this.misses,
      size: this.cache.size,
      hitRate: total > 0 ? this.hits / total : 0,
    };
  }

  /**
   * Clean up expired entries
   */
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.ttlMs) {
        this.cache.delete(key);
      }
    }
  }
}

/**
 * Global cache instance for API responses
 */
const apiCache = new InMemoryCache<any>(1000, 30 * 60 * 1000); // 30 minutes TTL

/**
 * Generate a cache key from request parameters
 *
 * @param endpoint - API endpoint
 * @param params - Request parameters
 * @returns Cache key string
 *
 * @example
 * ```typescript
 * const key = generateCacheKey("/api/generate-hashtags", { articleText: "..." });
 * ```
 */
export function generateCacheKey(endpoint: string, params: any): string {
  // Create a deterministic hash of the parameters
  const paramsStr = JSON.stringify(params);
  let hash = 0;
  for (let i = 0; i < paramsStr.length; i++) {
    const char = paramsStr.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return `${endpoint}:${hash.toString(36)}`;
}

/**
 * Check if caching is enabled
 *
 * @returns True if caching is enabled via environment variable
 */
export function isCachingEnabled(): boolean {
  return process.env.ENABLE_CACHING === "true";
}

/**
 * Get a cached API response
 *
 * @param endpoint - API endpoint
 * @param params - Request parameters
 * @returns Cached response or undefined
 *
 * @example
 * ```typescript
 * const cached = getCachedResponse("/api/generate-hashtags", { articleText });
 * if (cached) {
 *   return cached;
 * }
 * ```
 */
export function getCachedResponse<T = any>(
  endpoint: string,
  params: any
): T | undefined {
  if (!isCachingEnabled()) {
    return undefined;
  }

  const key = generateCacheKey(endpoint, params);
  return apiCache.get(key);
}

/**
 * Cache an API response
 *
 * @param endpoint - API endpoint
 * @param params - Request parameters
 * @param response - Response to cache
 *
 * @example
 * ```typescript
 * const response = await generateHashtags(text);
 * cacheResponse("/api/generate-hashtags", { articleText: text }, response);
 * ```
 */
export function cacheResponse(
  endpoint: string,
  params: any,
  response: any
): void {
  if (!isCachingEnabled()) {
    return;
  }

  const key = generateCacheKey(endpoint, params);
  apiCache.set(key, response);
}

/**
 * Invalidate cache for a specific endpoint
 *
 * @param endpoint - API endpoint to invalidate
 *
 * @example
 * ```typescript
 * invalidateCache("/api/generate-hashtags");
 * ```
 */
export function invalidateCache(endpoint: string): void {
  // In a simple in-memory cache, we can't easily invalidate by prefix
  // For production, use Redis with pattern matching
  apiCache.clear();
}

/**
 * Get cache statistics
 *
 * @returns Cache statistics
 *
 * @example
 * ```typescript
 * const stats = getCacheStats();
 * console.log(`Cache hit rate: ${(stats.hitRate * 100).toFixed(1)}%`);
 * ```
 */
export function getCacheStats(): CacheStats {
  return apiCache.getStats();
}

/**
 * Clear all cached responses
 */
export function clearCache(): void {
  apiCache.clear();
}

/**
 * Set up periodic cache cleanup
 */
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    apiCache.cleanup();
  }, 10 * 60 * 1000); // Clean up every 10 minutes
}

/**
 * Redis cache adapter (for future implementation)
 *
 * @description Uncomment and configure when ready to use Redis
 */
/*
import { createClient } from 'redis';

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

// Connect to Redis
if (process.env.REDIS_URL) {
  redisClient.connect();
}

export async function getCachedResponseRedis<T = any>(
  endpoint: string,
  params: any
): Promise<T | undefined> {
  if (!isCachingEnabled() || !redisClient.isOpen) {
    return undefined;
  }

  const key = generateCacheKey(endpoint, params);
  const cached = await redisClient.get(key);

  if (cached) {
    return JSON.parse(cached);
  }

  return undefined;
}

export async function cacheResponseRedis(
  endpoint: string,
  params: any,
  response: any,
  ttlSeconds: number = 1800
): Promise<void> {
  if (!isCachingEnabled() || !redisClient.isOpen) {
    return;
  }

  const key = generateCacheKey(endpoint, params);
  await redisClient.setEx(key, ttlSeconds, JSON.stringify(response));
}
*/
