/**
 * Admin Memberships API - File-based storage
 *
 * @description Handles membership management for admin panel using JSON file storage
 */

import { NextRequest, NextResponse } from 'next/server';
import { getMemberships, createMembership } from '@/lib/stores/membershipsStore';
import { isAdmin } from '@/lib/adminAuth';

/**
 * GET /api/admin/memberships
 *
 * @description Fetch all memberships for admin management
 */
export async function GET() {
  try {
    // SECURITY: Require authentication for admin operations
    if (!(await isAdmin())) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const memberships = await getMemberships({
      sortBy: 'sortOrder',
      sortOrder: 'asc',
    });

    return NextResponse.json({ memberships });
  } catch (error) {
    console.error('メンバーシップ一覧取得エラー:', error);
    return NextResponse.json(
      { error: 'メンバーシップ一覧の取得に失敗しました' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/memberships
 *
 * @description Create a new membership (requires authentication)
 */
export async function POST(request: NextRequest) {
  try {
    // SECURITY: Require authentication for membership creation
    if (!(await isAdmin())) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, description, color, sortOrder, isActive = true } = body;

    // 必須フィールドのバリデーション
    if (!name) {
      return NextResponse.json(
        { error: 'メンバーシップ名は必須です' },
        { status: 400 }
      );
    }

    try {
      // メンバーシップを作成
      const membership = await createMembership({
        name,
        description: description || '',
        color: color || '',
        sortOrder: sortOrder ?? 0,
        isActive,
      });

      return NextResponse.json({ membership }, { status: 201 });
    } catch (error) {
      if (error instanceof Error && error.message.includes('already exists')) {
        return NextResponse.json(
          { error: 'このメンバーシップ名は既に登録されています' },
          { status: 409 }
        );
      }
      throw error;
    }
  } catch (error: any) {
    console.error('メンバーシップ作成エラー:', error);

    return NextResponse.json(
      { error: 'メンバーシップの作成に失敗しました' },
      { status: 500 }
    );
  }
}
