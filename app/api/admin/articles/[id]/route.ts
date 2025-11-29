/**
 * Admin Individual Article API - File-based storage
 *
 * @description Handles individual article management for admin panel using JSON file storage
 */

import { NextRequest, NextResponse } from 'next/server';
import { getArticleById, updateArticle, deleteArticle } from '@/lib/stores/articlesStore';
import { isAdmin } from '@/lib/adminAuth';

/**
 * GET /api/admin/articles/[id]
 *
 * @description Get a single article by ID (requires authentication)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // SECURITY: Require authentication for admin operations
    if (!(await isAdmin())) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const article = await getArticleById(id);

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
 *
 * @description Update an article (requires authentication)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // SECURITY: Require authentication for article updates
    if (!(await isAdmin())) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

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
    const existingArticle = await getArticleById(id);

    if (!existingArticle) {
      return NextResponse.json(
        { error: '記事が見つかりません' },
        { status: 404 }
      );
    }

    try {
      // 記事を更新（membershipIdsを含む）
      const updatedArticle = await updateArticle(id, {
        title,
        noteLink,
        publishedAt: new Date(publishedAt).toISOString(),
        characterCount,
        estimatedReadTime,
        genre,
        targetAudience,
        benefit,
        recommendationLevel,
        membershipIds,
      });

      return NextResponse.json({ article: updatedArticle });
    } catch (error) {
      if (error instanceof Error && error.message.includes('already exists')) {
        return NextResponse.json(
          { error: 'このnoteリンクは既に登録されています' },
          { status: 409 }
        );
      }
      throw error;
    }
  } catch (error: any) {
    console.error('記事更新エラー:', error);

    return NextResponse.json(
      { error: '記事の更新に失敗しました' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/articles/[id]
 *
 * @description Delete an article (requires authentication)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // SECURITY: Require authentication for article deletion
    if (!(await isAdmin())) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { id } = await params;

    // 記事の存在確認
    const existingArticle = await getArticleById(id);

    if (!existingArticle) {
      return NextResponse.json(
        { error: '記事が見つかりません' },
        { status: 404 }
      );
    }

    // 記事を削除
    const deleted = await deleteArticle(id);

    if (!deleted) {
      return NextResponse.json(
        { error: '記事の削除に失敗しました' },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: '記事を削除しました' });
  } catch (error) {
    console.error('記事削除エラー:', error);
    return NextResponse.json(
      { error: '記事の削除に失敗しました' },
      { status: 500 }
    );
  }
}
