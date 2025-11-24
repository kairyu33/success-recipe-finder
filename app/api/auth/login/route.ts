import { NextRequest, NextResponse } from 'next/server';
import { verifyPassword, createAuthToken, setAuthCookie } from '@/lib/simpleAuth';

/**
 * Login API Endpoint
 *
 * @description Authenticates user with membership password
 * Sets a 30-day authentication cookie on success
 *
 * @param request - POST request with { password: string }
 * @returns Success or error response
 */
export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    // Validate input
    if (!password || typeof password !== 'string') {
      return NextResponse.json(
        { error: 'パスワードを入力してください' },
        { status: 400 }
      );
    }

    // Verify password
    if (!verifyPassword(password)) {
      console.warn('[Auth] Failed login attempt');
      return NextResponse.json(
        { error: 'パスワードが正しくありません' },
        { status: 401 }
      );
    }

    // Create auth token (30 days validity)
    const token = await createAuthToken();

    // Set cookie
    const response = NextResponse.json({
      success: true,
      message: 'ログインに成功しました',
      expiresIn: '30日間',
    });

    // Set auth cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    });

    console.log('[Auth] Successful login');

    return response;
  } catch (error) {
    console.error('[Auth] Login error:', error);
    return NextResponse.json(
      { error: 'ログイン処理中にエラーが発生しました' },
      { status: 500 }
    );
  }
}
