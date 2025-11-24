/**
 * In-Memory Cache Service
 *
 * @description In-memory cache implementation using Map.
 * Suitable for single-instance applications or development.
 * For production with multiple instances, use Redis or similar.
 *
 * Features:
 * - TTL support with automatic expiration
 * - LRU eviction when max size is reached
 * - Pattern matching for bulk deletion
 * - Statistics tracking
 *
 * @example
 * ```typescript
 * const cache = new MemoryCacheService({ maxSize: 1000, defaultTTL: 300 });
 * await cache.set('key', 'value', { ttl: 600 });
 * const value = await cache.get('key');
 * ```
 */

import type {
  ICacheService,
  CacheSetOptions,
  CacheStats,
} from './CacheService.interface';
import { CacheServiceError } from './CacheService.interface';

/**
 * Cache entry with metadata
 */
interface CacheEntry<T> {
  value: T;
  createdAt: number;
  expiresAt: number;
  hits: number;
  tags?: string[];
}

/**
 * Memory cache configuration
 */
export interface MemoryCacheConfig {
  /** Maximum number of entries (default: 1000) */
  maxSize?: number;
  /** Default TTL in seconds (default: 1800 = 30 minutes) */
  defaultTTL?: number;
  /** Cleanup interval in milliseconds (default: 60000 = 1 minute) */
  cleanupInterval?: number;
}

/**
 * In-Memory Cache Service
 *
 * @description Simple, fast in-memory cache for development or single-instance apps
 */
export class MemoryCacheService implements ICacheService {
  public readonly provider = 'memory';

  private cache: Map<string, CacheEntry<any>> = new Map();
  private maxSize: number;
  private defaultTTL: number;
  private cleanupInterval: number;
  private cleanupTimer?: NodeJS.Timeout;
  private stats = {
    hits: 0,
    misses: 0,
    sets: 0,
    deletes: 0,
  };

  constructor(config: MemoryCacheConfig = {}) {
    this.maxSize = config.maxSize || 1000;
    this.defaultTTL = config.defaultTTL || 1800; // 30 minutes default
    this.cleanupInterval = config.cleanupInterval || 60000; // 1 minute

    // Start automatic cleanup
    this.startCleanup();
  }

  /**
   * Get a value from cache
   *
   * @param key - Cache key
   * @returns Promise resolving to cached value or null
   */
  async get<T = any>(key: string): Promise<T | null> {
    const entry = this.cache.get(key);

    if (!entry) {
      this.stats.misses++;
      return null;
    }

    // Check expiration
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      this.stats.misses++;
      return null;
    }

    // Update hit count and stats
    entry.hits++;
    this.stats.hits++;

    return entry.value as T;
  }

  /**
   * Set a value in cache
   *
   * @param key - Cache key
   * @param value - Value to cache
   * @param options - Cache options
   */
  async set<T = any>(
    key: string,
    value: T,
    options: CacheSetOptions = {}
  ): Promise<void> {
    // Check size limit and evict if necessary
    if (this.cache.size >= this.maxSize && !this.cache.has(key)) {
      this.evictLRU();
    }

    const ttl = options.ttl || this.defaultTTL;
    const now = Date.now();

    const entry: CacheEntry<T> = {
      value,
      createdAt: now,
      expiresAt: now + ttl * 1000,
      hits: 0,
      tags: options.tags,
    };

    this.cache.set(key, entry);
    this.stats.sets++;
  }

  /**
   * Check if key exists
   *
   * @param key - Cache key
   * @returns Promise resolving to true if exists
   */
  async has(key: string): Promise<boolean> {
    const value = await this.get(key);
    return value !== null;
  }

  /**
   * Delete a key
   *
   * @param key - Cache key
   */
  async delete(key: string): Promise<void> {
    const deleted = this.cache.delete(key);
    if (deleted) {
      this.stats.deletes++;
    }
  }

  /**
   * Delete keys matching pattern
   *
   * @param pattern - Pattern to match (supports * wildcard)
   * @returns Promise resolving to number of deleted keys
   *
   * @example
   * ```typescript
   * await cache.deletePattern('user:*'); // Deletes all keys starting with 'user:'
   * ```
   */
  async deletePattern(pattern: string): Promise<number> {
    const regex = this.patternToRegex(pattern);
    let deleted = 0;

    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
        deleted++;
        this.stats.deletes++;
      }
    }

    return deleted;
  }

  /**
   * Clear all cache entries
   */
  async clear(): Promise<void> {
    this.cache.clear();
    this.stats.sets = 0;
    this.stats.deletes = 0;
    // Keep hit/miss stats for monitoring
  }

  /**
   * Get cache statistics
   *
   * @returns Promise resolving to cache stats
   */
  async getStats(): Promise<CacheStats> {
    const total = this.stats.hits + this.stats.misses;

    return {
      hits: this.stats.hits,
      misses: this.stats.misses,
      size: this.cache.size,
      hitRate: total > 0 ? this.stats.hits / total : 0,
      sets: this.stats.sets,
      deletes: this.stats.deletes,
      maxSize: this.maxSize,
    };
  }

  /**
   * Check if cache is healthy
   *
   * @returns Promise resolving to true (always healthy for memory cache)
   */
  async isHealthy(): Promise<boolean> {
    return true;
  }

  /**
   * Evict least recently used entry
   */
  private evictLRU(): void {
    let oldestKey: string | null = null;
    let oldestHits = Infinity;
    let oldestTime = Infinity;

    // Find entry with lowest hits and oldest creation time
    for (const [key, entry] of this.cache.entries()) {
      if (entry.hits < oldestHits || (entry.hits === oldestHits && entry.createdAt < oldestTime)) {
        oldestKey = key;
        oldestHits = entry.hits;
        oldestTime = entry.createdAt;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
      this.stats.deletes++;
    }
  }

  /**
   * Convert glob pattern to regex
   *
   * @param pattern - Glob pattern with * wildcard
   * @returns RegExp for matching
   */
  private patternToRegex(pattern: string): RegExp {
    const escaped = pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&');
    const regex = escaped.replace(/\*/g, '.*');
    return new RegExp(`^${regex}$`);
  }

  /**
   * Start automatic cleanup of expired entries
   */
  private startCleanup(): void {
    this.cleanupTimer = setInterval(() => {
      this.cleanupExpired();
    }, this.cleanupInterval);

    // Allow Node.js to exit even if timer is active
    if (this.cleanupTimer.unref) {
      this.cleanupTimer.unref();
    }
  }

  /**
   * Clean up expired entries
   */
  private cleanupExpired(): void {
    const now = Date.now();
    let cleaned = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      console.log(`[MemoryCacheService] Cleaned up ${cleaned} expired entries`);
    }
  }

  /**
   * Stop cleanup timer (for graceful shutdown)
   */
  destroy(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
    }
  }
}
