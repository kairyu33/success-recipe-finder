import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminPassword, setAdminCookie } from '@/lib/adminAuth';

/**
 * Admin Login API Endpoint
 *
 * @description Authenticates admin with ADMIN_PASSWORD
 * Sets a session cookie on success
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
        if (!verifyAdminPassword(password)) {
            console.warn('[AdminAuth] Failed login attempt');
            return NextResponse.json(
                { error: 'パスワードが正しくありません' },
                { status: 401 }
            );
        }

        // Set cookie
        const response = NextResponse.json({
            success: true,
            message: 'ログインに成功しました',
        });

        // Set admin auth cookie
        response.cookies.set('admin-access', 'admin-authenticated', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            // Session cookie - expires when browser closes
        });

        console.log('[AdminAuth] Successful login');

        return response;
    } catch (error) {
        console.error('[AdminAuth] Login error:', error);
        return NextResponse.json(
            { error: 'ログイン処理中にエラーが発生しました' },
            { status: 500 }
        );
    }
}
