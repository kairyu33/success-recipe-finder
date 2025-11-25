/**
 * Admin Individual Membership API - File-based storage
 *
 * @description Handles individual membership management for admin panel using JSON file storage
 */

import { NextRequest, NextResponse } from 'next/server';
import { getMembershipById, updateMembership, deleteMembership } from '@/lib/stores/membershipsStore';
import { getAuthSession } from '@/lib/simpleAuth';

/**
 * GET /api/admin/memberships/[id]
 *
 * @description Get a single membership by ID (requires authentication)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // SECURITY: Require authentication for admin operations
    const session = await getAuthSession();

    if (!session || !session.authenticated) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const membership = await getMembershipById(id);

    if (!membership) {
      return NextResponse.json(
        { error: 'メンバーシップが見つかりません' },
        { status: 404 }
      );
    }

    return NextResponse.json({ membership });
  } catch (error) {
    console.error('メンバーシップ取得エラー:', error);
    return NextResponse.json(
      { error: 'メンバーシップの取得に失敗しました' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/memberships/[id]
 *
 * @description Update a membership (requires authentication)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // SECURITY: Require authentication for membership updates
    const session = await getAuthSession();

    if (!session || !session.authenticated) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { name, description, color, sortOrder, isActive } = body;

    // メンバーシップの存在確認
    const existingMembership = await getMembershipById(id);

    if (!existingMembership) {
      return NextResponse.json(
        { error: 'メンバーシップが見つかりません' },
        { status: 404 }
      );
    }

    try {
      // メンバーシップを更新
      const membership = await updateMembership(id, {
        name,
        description,
        color,
        sortOrder,
        isActive,
      });

      return NextResponse.json({ membership });
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
    console.error('メンバーシップ更新エラー:', error);

    return NextResponse.json(
      { error: 'メンバーシップの更新に失敗しました' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/memberships/[id]
 *
 * @description Delete a membership (requires authentication)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // SECURITY: Require authentication for membership deletion
    const session = await getAuthSession();

    if (!session || !session.authenticated) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { id } = await params;

    // メンバーシップの存在確認
    const existingMembership = await getMembershipById(id);

    if (!existingMembership) {
      return NextResponse.json(
        { error: 'メンバーシップが見つかりません' },
        { status: 404 }
      );
    }

    // メンバーシップを削除
    const deleted = await deleteMembership(id);

    if (!deleted) {
      return NextResponse.json(
        { error: 'メンバーシップの削除に失敗しました' },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: 'メンバーシップを削除しました' });
  } catch (error) {
    console.error('メンバーシップ削除エラー:', error);
    return NextResponse.json(
      { error: 'メンバーシップの削除に失敗しました' },
      { status: 500 }
    );
  }
}
