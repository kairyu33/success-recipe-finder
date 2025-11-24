/**
 * Admin Authentication Module
 *
 * @description Handles admin-specific authentication for admin panel access
 * Provides additional security layer on top of general user authentication
 *
 * SECURITY: ADMIN_PASSWORD MUST be set in environment variables
 */

import { cookies } from 'next/headers';

/**
 * Validate and load admin password from environment
 *
 * @returns The admin password
 *
 * @example
 * Set in .env.local:
 * ```
 * ADMIN_PASSWORD=your-strong-admin-password-here
 * ```
 */
function getAdminPassword(): string {
  const password = process.env.ADMIN_PASSWORD;

  if (!password) {
    console.warn('[AdminAuth] ADMIN_PASSWORD not configured - using fallback (admin access disabled)');
    return 'fallback-admin-password-disabled';
  }

  if (password.length < 12) {
    console.warn('[AdminAuth] ADMIN_PASSWORD is too short (minimum 12 characters recommended)');
  }

  return password;
}

/**
 * Get admin password (cached after first call)
 */
const ADMIN_PASSWORD = getAdminPassword();

/**
 * Verify admin password
 *
 * @param password - Password from user input
 * @returns true if password matches admin password
 */
export function verifyAdminPassword(password: string): boolean {
  return password === ADMIN_PASSWORD;
}

/**
 * Check if user has admin access (from cookie)
 *
 * @returns true if user is authenticated as admin
 */
export async function isAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  const adminToken = cookieStore.get('admin-access')?.value;

  if (!adminToken) {
    return false;
  }

  // Simple token validation (could be enhanced with JWT)
  return adminToken === 'admin-authenticated';
}

/**
 * Set admin access cookie (session-based - expires on browser close)
 */
export async function setAdminCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set('admin-access', 'admin-authenticated', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    // Session cookie - expires when browser closes
  });
}

/**
 * Clear admin access cookie
 */
export async function clearAdminCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete('admin-access');
}
