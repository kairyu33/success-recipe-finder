import { NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/simpleAuth';

/**
 * Auth Status API Endpoint
 *
 * @description Returns current authentication status
 * @returns { authenticated: boolean, loginDate?: string }
 */
export async function GET() {
  try {
    const session = await getAuthSession();

    if (session) {
      return NextResponse.json({
        authenticated: true,
        loginDate: session.loginDate,
      });
    }

    return NextResponse.json({
      authenticated: false,
    });
  } catch (error) {
    console.error('[Auth] Status check error:', error);
    return NextResponse.json(
      { authenticated: false, error: '認証状態の確認に失敗しました' },
      { status: 500 }
    );
  }
}
