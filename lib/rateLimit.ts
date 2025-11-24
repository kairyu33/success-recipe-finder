/**
 * Rate Limiting Utility
 *
 * @description Simple in-memory rate limiting to prevent API abuse
 * Tracks requests by IP address and enforces configurable limits
 */

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

// In-memory storage for rate limit tracking
const rateLimitMap = new Map<string, RateLimitRecord>();

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitMap.entries()) {
    if (now > record.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}, 5 * 60 * 1000);

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetIn?: number;
}

/**
 * Check if a request should be rate limited
 *
 * @param identifier - Unique identifier (typically IP address)
 * @param maxRequests - Maximum requests allowed in the time window (default: 10)
 * @param windowMs - Time window in milliseconds (default: 60000 = 1 minute)
 * @returns Rate limit result with allowed status and remaining count
 *
 * @example
 * ```typescript
 * const result = checkRateLimit(ipAddress, 10, 60000);
 * if (!result.allowed) {
 *   return NextResponse.json(
 *     { error: 'Rate limit exceeded' },
 *     { status: 429 }
 *   );
 * }
 * ```
 */
export function checkRateLimit(
  identifier: string,
  maxRequests: number = 10,
  windowMs: number = 60000
): RateLimitResult {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);

  // No existing record or window has expired - start fresh
  if (!record || now > record.resetTime) {
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    });
    return {
      allowed: true,
      remaining: maxRequests - 1,
    };
  }

  // Limit exceeded
  if (record.count >= maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetIn: Math.ceil((record.resetTime - now) / 1000),
    };
  }

  // Increment count and allow
  record.count++;
  return {
    allowed: true,
    remaining: maxRequests - record.count,
  };
}

/**
 * Reset rate limit for a specific identifier
 * Useful for testing or administrative purposes
 */
export function resetRateLimit(identifier: string): void {
  rateLimitMap.delete(identifier);
}

/**
 * Get current rate limit stats for monitoring
 */
export function getRateLimitStats() {
  return {
    totalTracked: rateLimitMap.size,
    activeIdentifiers: Array.from(rateLimitMap.keys()),
  };
}
