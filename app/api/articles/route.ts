/**
 * Articles CRUD API Endpoints - File-based storage
 *
 * @description Handles article operations using JSON file storage: list, create, update, delete
 */

import { NextRequest, NextResponse } from 'next/server';
import { getArticles } from '@/lib/stores/articlesStore';

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
 * - membershipIds: Filter by membership IDs (comma-separated, optional)
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
    const membershipIdsParam = searchParams.get('membershipIds') || '';
    const sortBy = searchParams.get('sortBy') || 'publishedAt';
    const sortOrder = (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc';
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Parse comma-separated filter values
    const genres = genresParam ? genresParam.split(',').filter(Boolean) : [];
    const targetAudiences = targetAudiencesParam ? targetAudiencesParam.split(',').filter(Boolean) : [];
    const recommendationLevels = recommendationLevelsParam ? recommendationLevelsParam.split(',').filter(Boolean) : [];
    const membershipIds = membershipIdsParam ? membershipIdsParam.split(',').filter(Boolean) : [];

    // Fetch articles from storage
    const { articles, total } = await getArticles({
      search: search || undefined,
      genres: genres.length > 0 ? genres : undefined,
      targetAudiences: targetAudiences.length > 0 ? targetAudiences : undefined,
      recommendationLevels: recommendationLevels.length > 0 ? recommendationLevels : undefined,
      membershipIds: membershipIds.length > 0 ? membershipIds : undefined,
      sortBy,
      sortOrder,
      limit,
      offset
    });

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
