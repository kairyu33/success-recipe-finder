/**
 * Individual Article CRUD API Endpoints - File-based storage
 *
 * @description Handles single article operations using JSON file storage: get, update, delete
 */

import { NextRequest, NextResponse } from 'next/server';
import { getArticleById, updateArticle, deleteArticle } from '@/lib/stores/articlesStore';
import { getAuthSession } from '@/lib/simpleAuth';

/**
 * GET /api/articles/[id]
 *
 * @description Fetch a single article by ID
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const article = await getArticleById(params.id);

    if (!article) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ article });

  } catch (error) {
    console.error('Error fetching article:', error);

    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'Failed to fetch article' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to fetch article', details: String(error) },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/articles/[id]
 *
 * @description Update an article (requires authentication)
 */
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // SECURITY: Require authentication for update operations
    const session = await getAuthSession();

    if (!session || !session.authenticated) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const params = await context.params;
    const body = await request.json();

    const existing = await getArticleById(params.id);

    if (!existing) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }

    try {
      const updatedArticle = await updateArticle(params.id, body);
      return NextResponse.json({ article: updatedArticle });
    } catch (error) {
      if (error instanceof Error && error.message.includes('already exists')) {
        return NextResponse.json(
          { error: 'Article with this noteLink already exists' },
          { status: 409 }
        );
      }
      throw error;
    }

  } catch (error) {
    console.error('Error updating article:', error);

    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'Failed to update article' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update article', details: String(error) },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/articles/[id]
 *
 * @description Delete an article (requires authentication)
 */
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // SECURITY: Require authentication for delete operations
    const session = await getAuthSession();

    if (!session || !session.authenticated) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const params = await context.params;
    const deleted = await deleteArticle(params.id);

    if (!deleted) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error deleting article:', error);

    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'Failed to delete article' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to delete article', details: String(error) },
      { status: 500 }
    );
  }
}
