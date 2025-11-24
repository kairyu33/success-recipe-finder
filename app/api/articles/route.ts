/**
 * Articles CRUD API Endpoints
 *
 * @description Handles article operations: list, create, update, delete
 */

import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { getAuthSession } from '@/lib/simpleAuth';

/**
 * GET /api/articles
 *
 * @description Fetch all articles with optional search and filters
 *
 * Query Parameters:
 * - search: Search in title, genre, benefit (optional)
 * - genres: Filter by genres (comma-separated, optional)
 * - targetAudiences: Filter by target audiences (comma-separated, optional)
 * - recommendationLevels: Filter by recommendation levels (comma-separated, optional)
 * - membershipId: Filter by membership ID (optional)
 * - sortBy: Sort field (publishedAt, characterCount, estimatedReadTime, default: publishedAt)
 * - sortOrder: Sort order (asc, desc, default: desc)
 * - limit: Number of results to return (default: 100)
 * - offset: Number of results to skip (default: 0)
 *
 * @returns JSON array of articles
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search') || '';
    const genresParam = searchParams.get('genres') || '';
    const targetAudiencesParam = searchParams.get('targetAudiences') || '';
    const recommendationLevelsParam = searchParams.get('recommendationLevels') || '';
    const membershipId = searchParams.get('membershipId') || '';
    const sortBy = searchParams.get('sortBy') || 'publishedAt';
    const sortOrder = (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc';
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Parse comma-separated filter values
    const genres = genresParam ? genresParam.split(',').filter(Boolean) : [];
    const targetAudiences = targetAudiencesParam ? targetAudiencesParam.split(',').filter(Boolean) : [];
    const recommendationLevels = recommendationLevelsParam ? recommendationLevelsParam.split(',').filter(Boolean) : [];

    // Build where clause with proper Prisma types
    const where: Prisma.ArticleWhereInput = {};

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { genre: { contains: search } },
        { benefit: { contains: search } },
        { targetAudience: { contains: search } },
      ];
    }

    // Multi-select filters
    if (genres.length > 0) {
      where.genre = { in: genres };
    }

    if (targetAudiences.length > 0) {
      where.targetAudience = { in: targetAudiences };
    }

    if (recommendationLevels.length > 0) {
      where.recommendationLevel = { in: recommendationLevels };
    }

    // メンバーシップフィルター
    if (membershipId) {
      where.memberships = {
        some: {
          membershipId,
        },
      };
    }

    // Determine sort field
    const validSortFields = ['publishedAt', 'characterCount', 'estimatedReadTime'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'publishedAt';

    // Fetch articles with membership information
    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        include: {
          memberships: {
            include: {
              membership: true,
            },
          },
        },
        orderBy: { [sortField]: sortOrder },
        take: limit,
        skip: offset,
      }),
      prisma.article.count({ where }),
    ]);

    return NextResponse.json({
      articles,
      total,
      limit,
      offset,
    });

  } catch (error) {
    console.error('Error fetching articles:', error);

    // Don't expose error details in production
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'Failed to fetch articles' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to fetch articles', details: String(error) },
      { status: 500 }
    );
  }
}

/**
 * POST /api/articles
 *
 * @description Create a new article
 *
 * @returns JSON response with created article
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      rowNumber,
      title,
      noteLink,
      publishedAt,
      characterCount,
      estimatedReadTime,
      genre,
      targetAudience,
      benefit,
      recommendationLevel,
    } = body;

    // Validate required fields
    if (!title || !noteLink) {
      return NextResponse.json(
        { error: 'Title and noteLink are required' },
        { status: 400 }
      );
    }

    // Check if article already exists
    const existing = await prisma.article.findUnique({
      where: { noteLink }
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Article with this noteLink already exists' },
        { status: 409 }
      );
    }

    // Create article
    const article = await prisma.article.create({
      data: {
        rowNumber: rowNumber || 0,
        title,
        noteLink,
        publishedAt: new Date(publishedAt || Date.now()),
        characterCount: characterCount || 0,
        estimatedReadTime: estimatedReadTime || 0,
        genre: genre || '',
        targetAudience: targetAudience || '',
        benefit: benefit || '',
        recommendationLevel: recommendationLevel || '',
      }
    });

    return NextResponse.json({ article }, { status: 201 });

  } catch (error) {
    console.error('Error creating article:', error);

    // Don't expose error details in production
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'Failed to create article' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create article', details: String(error) },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/articles
 *
 * @description Delete all articles (requires authentication)
 *
 * @returns JSON response with deletion count
 *
 * @security Requires valid authentication session
 */
export async function DELETE() {
  try {
    // SECURITY: Require authentication for destructive operations
    const session = await getAuthSession();

    if (!session || !session.authenticated) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const result = await prisma.article.deleteMany();

    return NextResponse.json({
      success: true,
      deleted: result.count
    });

  } catch (error) {
    console.error('Error deleting articles:', error);

    // Don't expose error details in production
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'Failed to delete articles' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to delete articles', details: String(error) },
      { status: 500 }
    );
  }
}
