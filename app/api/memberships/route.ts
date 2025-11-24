import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/memberships
 * メンバーシップ一覧を取得（有効なものだけ）
 */
export async function GET() {
  try {
    const memberships = await prisma.membership.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        sortOrder: 'asc',
      },
    });

    return NextResponse.json({ memberships });
  } catch (error) {
    console.error('メンバーシップ取得エラー:', error);
    return NextResponse.json(
      { error: 'メンバーシップの取得に失敗しました' },
      { status: 500 }
    );
  }
}
