/**
 * Admin Articles API - File-based storage
 *
 * @description Handles article management for admin panel using JSON file storage
 */

import { NextRequest, NextResponse } from 'next/server';
import { getArticles, createArticle } from '@/lib/stores/articlesStore';
import { isAdmin } from '@/lib/adminAuth';

/**
 * GET /api/admin/articles
 *
 * @description Fetch all articles for admin management
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

    const { articles } = await getArticles({
      sortBy: 'publishedAt',
      sortOrder: 'desc',
      limit: 1000,
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
 *
 * @description Create a new article (requires authentication)
 */
export async function POST(request: NextRequest) {
  try {
    // SECURITY: Require authentication for article creation
    if (!(await isAdmin())) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

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

    try {
      // 記事を作成
      const article = await createArticle({
        title,
        noteLink,
        publishedAt: new Date(publishedAt).toISOString(),
        characterCount: characterCount || 0,
        estimatedReadTime: estimatedReadTime || 0,
        genre: genre || '',
        targetAudience: targetAudience || '',
        benefit: benefit || '',
        recommendationLevel: recommendationLevel || '',
        membershipIds: membershipIds || [],
      });

      return NextResponse.json({ article }, { status: 201 });
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
    console.error('記事作成エラー:', error);

    return NextResponse.json(
      { error: '記事の作成に失敗しました' },
      { status: 500 }
    );
  }
}
