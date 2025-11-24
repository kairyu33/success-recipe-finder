import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/admin/articles
 * 記事一覧を取得
 */
export async function GET() {
  try {
    const articles = await prisma.article.findMany({
      include: {
        memberships: {
          include: {
            membership: true,
          },
        },
      },
      orderBy: {
        publishedAt: 'desc',
      },
    });

    return NextResponse.json({ articles });
  } catch (error) {
    console.error('記事一覧取得エラー:', error);
    return NextResponse.json(
      { error: '記事一覧の取得に失敗しました' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/articles
 * 新しい記事を作成
 */
export async function POST(request: NextRequest) {
  try {
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

    // 必須フィールドのバリデーション
    if (!title || !noteLink || !publishedAt) {
      return NextResponse.json(
        { error: 'タイトル、noteリンク、投稿日時は必須です' },
        { status: 400 }
      );
    }

    // 記事を作成
    const article = await prisma.article.create({
      data: {
        rowNumber: 0, // 一時的に0を設定
        title,
        noteLink,
        publishedAt: new Date(publishedAt),
        characterCount: characterCount || 0,
        estimatedReadTime: estimatedReadTime || 0,
        genre: genre || '',
        targetAudience: targetAudience || '',
        benefit: benefit || '',
        recommendationLevel: recommendationLevel || '',
      },
    });

    // 行番号を設定（IDをベースに）
    await prisma.article.update({
      where: { id: article.id },
      data: { rowNumber: parseInt(article.id.slice(-8), 36) % 1000000 },
    });

    // メンバーシップとの紐づけ
    if (membershipIds.length > 0) {
      await prisma.articleMembership.createMany({
        data: membershipIds.map((membershipId: string) => ({
          articleId: article.id,
          membershipId,
        })),
      });
    }

    // 作成した記事を再取得（メンバーシップ情報を含む）
    const createdArticle = await prisma.article.findUnique({
      where: { id: article.id },
      include: {
        memberships: {
          include: {
            membership: true,
          },
        },
      },
    });

    return NextResponse.json({ article: createdArticle }, { status: 201 });
  } catch (error: any) {
    console.error('記事作成エラー:', error);

    // ユニーク制約違反のエラー処理
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'このnoteリンクは既に登録されています' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: '記事の作成に失敗しました' },
      { status: 500 }
    );
  }
}
