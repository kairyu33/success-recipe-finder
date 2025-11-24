import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/admin/memberships/[id]
 * 個別メンバーシップを取得
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const membership = await prisma.membership.findUnique({
      where: { id },
      include: {
        articles: {
          include: {
            article: true,
          },
        },
      },
    });

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
 * メンバーシップを更新
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, description, color, sortOrder, isActive } = body;

    // メンバーシップの存在確認
    const existingMembership = await prisma.membership.findUnique({
      where: { id: id },
    });

    if (!existingMembership) {
      return NextResponse.json(
        { error: 'メンバーシップが見つかりません' },
        { status: 404 }
      );
    }

    // メンバーシップを更新
    const membership = await prisma.membership.update({
      where: { id: id },
      data: {
        name,
        description,
        color,
        sortOrder,
        isActive,
      },
    });

    return NextResponse.json({ membership });
  } catch (error: any) {
    console.error('メンバーシップ更新エラー:', error);

    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'このメンバーシップ名は既に登録されています' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'メンバーシップの更新に失敗しました' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/memberships/[id]
 * メンバーシップを削除
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // メンバーシップの存在確認
    const existingMembership = await prisma.membership.findUnique({
      where: { id: id },
    });

    if (!existingMembership) {
      return NextResponse.json(
        { error: 'メンバーシップが見つかりません' },
        { status: 404 }
      );
    }

    // メンバーシップを削除（カスケードでArticleMembershipも削除される）
    await prisma.membership.delete({
      where: { id: id },
    });

    return NextResponse.json({ message: 'メンバーシップを削除しました' });
  } catch (error) {
    console.error('メンバーシップ削除エラー:', error);
    return NextResponse.json(
      { error: 'メンバーシップの削除に失敗しました' },
      { status: 500 }
    );
  }
}
