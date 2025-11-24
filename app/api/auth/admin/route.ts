/**
 * Admin Authentication API
 *
 * @description Handles admin password verification for admin panel access
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminPassword, setAdminCookie, clearAdminCookie } from '@/lib/adminAuth';

/**
 * POST /api/auth/admin
 *
 * @description Verify admin password and set admin cookie
 *
 * @returns JSON response with success status
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      );
    }

    // Verify admin password
    const isValid = verifyAdminPassword(password);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid admin password' },
        { status: 401 }
      );
    }

    // Set admin cookie
    await setAdminCookie();

    return NextResponse.json({
      success: true,
      message: 'Admin authentication successful'
    });

  } catch (error) {
    console.error('Admin authentication error:', error);

    // Don't expose error details in production
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'Authentication failed' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Authentication failed', details: String(error) },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/auth/admin
 *
 * @description Clear admin access (logout)
 *
 * @returns JSON response with success status
 */
export async function DELETE() {
  try {
    await clearAdminCookie();

    return NextResponse.json({
      success: true,
      message: 'Admin logout successful'
    });

  } catch (error) {
    console.error('Admin logout error:', error);

    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    );
  }
}
