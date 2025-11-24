/**
 * Individual Article CRUD API Endpoints
 *
 * @description Handles single article operations: get, update, delete
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthSession } from '@/lib/simpleAuth';

/**
 * GET /api/articles/[id]
 *
 * @description Fetch a single article by ID
 *
 * @param request - Next.js request object
 * @param context - Route context containing article ID
 * @returns JSON response with article data
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const article = await prisma.article.findUnique({
      where: { id: params.id }
    });

    if (!article) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ article });

  } catch (error) {
    console.error('Error fetching article:', error);

    // Don't expose error details in production
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
 *
 * @param request - Next.js request object
 * @param context - Route context containing article ID
 * @returns JSON response with updated article
 *
 * @security Requires valid authentication session
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

    // Check if article exists
    const existing = await prisma.article.findUnique({
      where: { id: params.id }
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }

    // If noteLink is being changed, check for duplicates
    if (body.noteLink && body.noteLink !== existing.noteLink) {
      const duplicate = await prisma.article.findUnique({
        where: { noteLink: body.noteLink }
      });

      if (duplicate) {
        return NextResponse.json(
          { error: 'Article with this noteLink already exists' },
          { status: 409 }
        );
      }
    }

    // Update article
    const updatedArticle = await prisma.article.update({
      where: { id: params.id },
      data: {
        ...(body.rowNumber !== undefined && { rowNumber: body.rowNumber }),
        ...(body.title && { title: body.title }),
        ...(body.noteLink && { noteLink: body.noteLink }),
        ...(body.publishedAt && { publishedAt: new Date(body.publishedAt) }),
        ...(body.characterCount !== undefined && { characterCount: body.characterCount }),
        ...(body.estimatedReadTime !== undefined && { estimatedReadTime: body.estimatedReadTime }),
        ...(body.genre !== undefined && { genre: body.genre }),
        ...(body.targetAudience !== undefined && { targetAudience: body.targetAudience }),
        ...(body.benefit !== undefined && { benefit: body.benefit }),
        ...(body.recommendationLevel !== undefined && { recommendationLevel: body.recommendationLevel }),
      }
    });

    return NextResponse.json({ article: updatedArticle });

  } catch (error) {
    console.error('Error updating article:', error);

    // Don't expose error details in production
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
 *
 * @param request - Next.js request object
 * @param context - Route context containing article ID
 * @returns JSON response with success status
 *
 * @security Requires valid authentication session
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

    // Check if article exists
    const existing = await prisma.article.findUnique({
      where: { id: params.id }
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }

    // Delete article
    await prisma.article.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error deleting article:', error);

    // Don't expose error details in production
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
