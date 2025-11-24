/**
 * Cache Service Interface
 *
 * @description Abstract interface for cache implementations.
 * Allows easy swapping between memory cache, Redis, or other cache backends
 * following the Strategy pattern.
 *
 * @example
 * ```typescript
 * const cache: ICacheService = CacheServiceFactory.create('memory');
 * await cache.set('key', { data: 'value' }, 300);
 * const value = await cache.get('key');
 * ```
 */

/**
 * Cache options for set operations
 */
export interface CacheSetOptions {
  /** Time-to-live in seconds */
  ttl?: number;
  /** Tags for cache invalidation */
  tags?: string[];
}

/**
 * Cache statistics
 */
export interface CacheStats {
  /** Total cache hits */
  hits: number;
  /** Total cache misses */
  misses: number;
  /** Current number of cached items */
  size: number;
  /** Hit rate (0-1) */
  hitRate: number;
  /** Additional provider-specific stats */
  [key: string]: any;
}

/**
 * Cache Service Interface
 *
 * @description Defines the contract for all cache implementations
 */
export interface ICacheService {
  /**
   * Cache provider name
   */
  readonly provider: string;

  /**
   * Get a value from cache
   *
   * @param key - Cache key
   * @returns Promise resolving to cached value or null if not found
   *
   * @example
   * ```typescript
   * const value = await cache.get<User>('user:123');
   * if (value) {
   *   console.log('Cache hit:', value);
   * }
   * ```
   */
  get<T = any>(key: string): Promise<T | null>;

  /**
   * Set a value in cache
   *
   * @param key - Cache key
   * @param value - Value to cache
   * @param options - Cache options (TTL, tags, etc.)
   * @returns Promise resolving when value is cached
   *
   * @example
   * ```typescript
   * await cache.set('user:123', userData, { ttl: 300, tags: ['user'] });
   * ```
   */
  set<T = any>(key: string, value: T, options?: CacheSetOptions): Promise<void>;

  /**
   * Check if a key exists in cache
   *
   * @param key - Cache key
   * @returns Promise resolving to true if key exists
   *
   * @example
   * ```typescript
   * if (await cache.has('key')) {
   *   console.log('Key exists');
   * }
   * ```
   */
  has(key: string): Promise<boolean>;

  /**
   * Delete a key from cache
   *
   * @param key - Cache key
   * @returns Promise resolving when key is deleted
   *
   * @example
   * ```typescript
   * await cache.delete('user:123');
   * ```
   */
  delete(key: string): Promise<void>;

  /**
   * Delete multiple keys matching a pattern
   *
   * @param pattern - Pattern to match (e.g., 'user:*')
   * @returns Promise resolving to number of keys deleted
   *
   * @example
   * ```typescript
   * const deleted = await cache.deletePattern('user:*');
   * console.log(`Deleted ${deleted} keys`);
   * ```
   */
  deletePattern(pattern: string): Promise<number>;

  /**
   * Clear all cached values
   *
   * @returns Promise resolving when cache is cleared
   *
   * @example
   * ```typescript
   * await cache.clear();
   * ```
   */
  clear(): Promise<void>;

  /**
   * Get cache statistics
   *
   * @returns Promise resolving to cache stats
   *
   * @example
   * ```typescript
   * const stats = await cache.getStats();
   * console.log(`Hit rate: ${(stats.hitRate * 100).toFixed(1)}%`);
   * ```
   */
  getStats(): Promise<CacheStats>;

  /**
   * Check if cache service is healthy and connected
   *
   * @returns Promise resolving to true if healthy
   *
   * @example
   * ```typescript
   * if (await cache.isHealthy()) {
   *   console.log('Cache is healthy');
   * }
   * ```
   */
  isHealthy(): Promise<boolean>;
}

/**
 * Cache service error
 */
export class CacheServiceError extends Error {
  constructor(
    message: string,
    public readonly provider: string,
    public readonly originalError?: Error
  ) {
    super(message);
    this.name = 'CacheServiceError';
    Object.setPrototypeOf(this, CacheServiceError.prototype);
  }
}

/**
 * Helper function to generate cache keys
 *
 * @param parts - Key parts to join
 * @returns Cache key string
 *
 * @example
 * ```typescript
 * const key = generateCacheKey('api', 'hashtags', articleId);
 * // Returns: 'api:hashtags:123'
 * ```
 */
export function generateCacheKey(...parts: Array<string | number>): string {
  return parts.map((part) => String(part)).join(':');
}

/**
 * Helper function to create a deterministic hash of an object
 *
 * @param obj - Object to hash
 * @returns Hash string
 *
 * @example
 * ```typescript
 * const hash = hashObject({ articleText: '...', count: 20 });
 * const key = generateCacheKey('api', 'hashtags', hash);
 * ```
 */
export function hashObject(obj: any): string {
  const str = JSON.stringify(obj);
  let hash = 0;

  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  return Math.abs(hash).toString(36);
}
