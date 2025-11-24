import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/admin/articles/[id]
 * 個別記事を取得
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const article = await prisma.article.findUnique({
      where: { id },
      include: {
        memberships: {
          include: {
            membership: true,
          },
        },
      },
    });

    if (!article) {
      return NextResponse.json(
        { error: '記事が見つかりません' },
        { status: 404 }
      );
    }

    return NextResponse.json({ article });
  } catch (error) {
    console.error('記事取得エラー:', error);
    return NextResponse.json(
      { error: '記事の取得に失敗しました' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/articles/[id]
 * 記事を更新
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      title,
      noteLink,
      publishedAt,
      characterCount,
      estimatedReadTime,
      genre,
      targetAudience,
      benefit,
      recommendationLevel,
      membershipIds = [],
    } = body;

    // 記事の存在確認
    const existingArticle = await prisma.article.findUnique({
      where: { id: id },
    });

    if (!existingArticle) {
      return NextResponse.json(
        { error: '記事が見つかりません' },
        { status: 404 }
      );
    }

    // トランザクションで更新
    const updatedArticle = await prisma.$transaction(async (tx) => {
      // 記事を更新
      const article = await tx.article.update({
        where: { id: id },
        data: {
          title,
          noteLink,
          publishedAt: new Date(publishedAt),
          characterCount,
          estimatedReadTime,
          genre,
          targetAudience,
          benefit,
          recommendationLevel,
        },
      });

      // 既存のメンバーシップ紐づけを削除
      await tx.articleMembership.deleteMany({
        where: { articleId: id },
      });

      // 新しいメンバーシップ紐づけを作成
      if (membershipIds.length > 0) {
        await tx.articleMembership.createMany({
          data: membershipIds.map((membershipId: string) => ({
            articleId: id,
            membershipId,
          })),
        });
      }

      // 更新後の記事を取得
      return await tx.article.findUnique({
        where: { id: id },
        include: {
          memberships: {
            include: {
              membership: true,
            },
          },
        },
      });
    });

    return NextResponse.json({ article: updatedArticle });
  } catch (error: any) {
    console.error('記事更新エラー:', error);

    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'このnoteリンクは既に登録されています' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: '記事の更新に失敗しました' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/articles/[id]
 * 記事を削除
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // 記事の存在確認
    const existingArticle = await prisma.article.findUnique({
      where: { id: id },
    });

    if (!existingArticle) {
      return NextResponse.json(
        { error: '記事が見つかりません' },
        { status: 404 }
      );
    }

    // 記事を削除（カスケードでArticleMembershipも削除される）
    await prisma.article.delete({
      where: { id: id },
    });

    return NextResponse.json({ message: '記事を削除しました' });
  } catch (error) {
    console.error('記事削除エラー:', error);
    return NextResponse.json(
      { error: '記事の削除に失敗しました' },
      { status: 500 }
    );
  }
}
