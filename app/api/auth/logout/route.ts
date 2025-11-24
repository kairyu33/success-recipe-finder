import { NextResponse } from 'next/server';
import { clearAuthCookie } from '@/lib/simpleAuth';

/**
 * Logout API Endpoint
 *
 * @description Clears authentication cookie
 * @returns Success response
 */
export async function POST() {
  try {
    const response = NextResponse.json({
      success: true,
      message: 'ログアウトしました',
    });

    // Clear auth cookie
    response.cookies.delete('auth-token');

    console.log('[Auth] User logged out');

    return response;
  } catch (error) {
    console.error('[Auth] Logout error:', error);
    return NextResponse.json(
      { error: 'ログアウト処理中にエラーが発生しました' },
      { status: 500 }
    );
  }
}
