import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/admin/memberships
 * メンバーシップ一覧を取得
 */
export async function GET() {
  try {
    const memberships = await prisma.membership.findMany({
      include: {
        articles: {
          include: {
            article: true,
          },
        },
      },
      orderBy: {
        sortOrder: 'asc',
      },
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
 * 新しいメンバーシップを作成
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, color, sortOrder, isActive = true } = body;

    // 必須フィールドのバリデーション
    if (!name) {
      return NextResponse.json(
        { error: 'メンバーシップ名は必須です' },
        { status: 400 }
      );
    }

    // メンバーシップを作成
    const membership = await prisma.membership.create({
      data: {
        name,
        description,
        color,
        sortOrder: sortOrder ?? 0,
        isActive,
      },
    });

    return NextResponse.json({ membership }, { status: 201 });
  } catch (error: any) {
    console.error('メンバーシップ作成エラー:', error);

    // ユニーク制約違反のエラー処理
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'このメンバーシップ名は既に登録されています' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'メンバーシップの作成に失敗しました' },
      { status: 500 }
    );
  }
}
