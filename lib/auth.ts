/**
 * Authentication Utilities
 *
 * @description JWT-based authentication for access code system
 * Handles token generation, verification, and session management
 */

import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'default-secret-change-in-production'
);

export interface SessionPayload {
  userId: string;
  accessCodeId: string;
  plan: string;
  expiresAt?: Date;
}

/**
 * Create a new JWT token
 *
 * @param payload - Session data to encode in the token
 * @returns JWT token string
 */
export async function createToken(payload: SessionPayload): Promise<string> {
  const token = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d') // Token expires in 30 days
    .sign(JWT_SECRET);

  return token;
}

/**
 * Verify and decode a JWT token
 *
 * @param token - JWT token string
 * @returns Decoded session payload or null if invalid
 */
export async function verifyToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as SessionPayload;
  } catch (error) {
    console.error('[Auth] Token verification failed:', error);
    return null;
  }
}

/**
 * Get the current session from cookies
 *
 * @returns Session payload or null if not authenticated
 */
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('session')?.value;

  if (!token) {
    return null;
  }

  return await verifyToken(token);
}

/**
 * Set the session cookie
 *
 * @param token - JWT token to store in cookie
 */
export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: '/',
  });
}

/**
 * Clear the session cookie (logout)
 */
export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete('session');
}

/**
 * Generate a random access code
 *
 * @param prefix - Prefix for the code (default: 'NOTE')
 * @returns Generated access code (e.g., 'NOTE-ABC123-XYZ789')
 */
export function generateAccessCode(prefix: string = 'NOTE'): string {
  const part1 = Math.random().toString(36).substring(2, 8).toUpperCase();
  const part2 = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}-${part1}-${part2}`;
}
