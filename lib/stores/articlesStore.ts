/**
 * Articles Store - Prisma Database Storage
 *
 * @description Manages article data using Prisma ORM with PostgreSQL
 */

import { prisma } from '@/lib/prisma';
import type { Article, ArticleFormData } from '@/types';

/**
 * Get all articles with optional filtering
 */
export async function getArticles(options?: {
  search?: string;
  genres?: string[];
  targetAudiences?: string[];
  recommendationLevels?: string[];
  membershipIds?: string[];
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}): Promise<{ articles: Article[]; total: number }> {
  const where: any = {};

  // Apply search filter
  if (options?.search) {
    where.OR = [
      { title: { contains: options.search, mode: 'insensitive' } },
      { genre: { contains: options.search, mode: 'insensitive' } },
      { benefit: { contains: options.search, mode: 'insensitive' } },
    ];
  }

  // Apply genre filter
  if (options?.genres && options.genres.length > 0) {
    where.genre = { in: options.genres };
  }

  // Apply target audience filter
  if (options?.targetAudiences && options.targetAudiences.length > 0) {
    where.targetAudience = { in: options.targetAudiences };
  }

  // Apply recommendation level filter
  if (options?.recommendationLevels && options.recommendationLevels.length > 0) {
    where.recommendationLevel = { in: options.recommendationLevels };
  }

  // Apply membership filter
  if (options?.membershipIds && options.membershipIds.length > 0) {
    where.memberships = {
      some: {
        membershipId: { in: options.membershipIds },
      },
    };
  }

  // Get total count
  const total = await prisma.article.count({ where });

  // Sort configuration
  const sortBy = options?.sortBy || 'publishedAt';
  const sortOrder = options?.sortOrder || 'desc';

  // Get paginated articles
  const offset = options?.offset || 0;
  const limit = options?.limit || 100;

  const dbArticles = await prisma.article.findMany({
    where,
    include: {
      memberships: {
        include: {
          membership: true,
        },
      },
    },
    orderBy: { [sortBy]: sortOrder },
    skip: offset,
    take: limit,
  });

  // Transform to Article type
  const articles: Article[] = dbArticles.map((article) => ({
    id: article.id,
    rowNumber: article.rowNumber,
    title: article.title,
    noteLink: article.noteLink,
    publishedAt: article.publishedAt.toISOString(),
    characterCount: article.characterCount,
    estimatedReadTime: article.estimatedReadTime,
    genre: article.genre,
    targetAudience: article.targetAudience,
    benefit: article.benefit,
    recommendationLevel: article.recommendationLevel,
    createdAt: article.createdAt.toISOString(),
    updatedAt: article.updatedAt.toISOString(),
    memberships: article.memberships.map((am) => ({
      membership: {
        id: am.membership.id,
        name: am.membership.name,
        description: am.membership.description,
        color: am.membership.color,
        sortOrder: am.membership.sortOrder,
        isActive: am.membership.isActive,
        createdAt: am.membership.createdAt.toISOString(),
        updatedAt: am.membership.updatedAt.toISOString(),
      },
    })),
  }));

  return { articles, total };
}

/**
 * Get a single article by ID
 */
export async function getArticleById(id: string): Promise<Article | null> {
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

  if (!article) return null;

  return {
    id: article.id,
    rowNumber: article.rowNumber,
    title: article.title,
    noteLink: article.noteLink,
    publishedAt: article.publishedAt.toISOString(),
    characterCount: article.characterCount,
    estimatedReadTime: article.estimatedReadTime,
    genre: article.genre,
    targetAudience: article.targetAudience,
    benefit: article.benefit,
    recommendationLevel: article.recommendationLevel,
    createdAt: article.createdAt.toISOString(),
    updatedAt: article.updatedAt.toISOString(),
    memberships: article.memberships.map((am) => ({
      membership: {
        id: am.membership.id,
        name: am.membership.name,
        description: am.membership.description,
        color: am.membership.color,
        sortOrder: am.membership.sortOrder,
        isActive: am.membership.isActive,
        createdAt: am.membership.createdAt.toISOString(),
        updatedAt: am.membership.updatedAt.toISOString(),
      },
    })),
  };
}

/**
 * Create a new article
 */
export async function createArticle(
  data: ArticleFormData & { rowNumber?: number }
): Promise<Article> {
  // Check for duplicate noteLink
  const existing = await prisma.article.findUnique({
    where: { noteLink: data.noteLink },
  });

  if (existing) {
    throw new Error('Article with this noteLink already exists');
  }

  // Get next row number if not provided
  const rowNumber = data.rowNumber || (await prisma.article.count()) + 1;

  const article = await prisma.article.create({
    data: {
      rowNumber,
      title: data.title,
      noteLink: data.noteLink,
      publishedAt: new Date(data.publishedAt),
      characterCount: data.characterCount,
      estimatedReadTime: data.estimatedReadTime,
      genre: data.genre,
      targetAudience: data.targetAudience,
      benefit: data.benefit,
      recommendationLevel: data.recommendationLevel,
      memberships: data.membershipIds
        ? {
          create: data.membershipIds.map((membershipId) => ({
            membershipId,
          })),
        }
        : undefined,
    },
    include: {
      memberships: {
        include: {
          membership: true,
        },
      },
    },
  });

  return {
    id: article.id,
    rowNumber: article.rowNumber,
    title: article.title,
    noteLink: article.noteLink,
    publishedAt: article.publishedAt.toISOString(),
    characterCount: article.characterCount,
    estimatedReadTime: article.estimatedReadTime,
    genre: article.genre,
    targetAudience: article.targetAudience,
    benefit: article.benefit,
    recommendationLevel: article.recommendationLevel,
    createdAt: article.createdAt.toISOString(),
    updatedAt: article.updatedAt.toISOString(),
    memberships: article.memberships.map((am) => ({
      membership: {
        id: am.membership.id,
        name: am.membership.name,
        description: am.membership.description,
        color: am.membership.color,
        sortOrder: am.membership.sortOrder,
        isActive: am.membership.isActive,
        createdAt: am.membership.createdAt.toISOString(),
        updatedAt: am.membership.updatedAt.toISOString(),
      },
    })),
  };
}

/**
 * Update an existing article
 */
export async function updateArticle(
  id: string,
  data: Partial<ArticleFormData>
): Promise<Article> {
  // Check for duplicate noteLink if being updated
  if (data.noteLink) {
    const duplicate = await prisma.article.findFirst({
      where: {
        noteLink: data.noteLink,
        NOT: { id },
      },
    });

    if (duplicate) {
      throw new Error('Article with this noteLink already exists');
    }
  }

  // Update memberships if provided
  if (data.membershipIds !== undefined) {
    // Delete existing memberships
    await prisma.articleMembership.deleteMany({
      where: { articleId: id },
    });

    // Create new memberships
    if (data.membershipIds.length > 0) {
      await prisma.articleMembership.createMany({
        data: data.membershipIds.map((membershipId) => ({
          articleId: id,
          membershipId,
        })),
      });
    }
  }

  const article = await prisma.article.update({
    where: { id },
    data: {
      ...(data.title !== undefined && { title: data.title }),
      ...(data.noteLink !== undefined && { noteLink: data.noteLink }),
      ...(data.publishedAt !== undefined && {
        publishedAt: new Date(data.publishedAt),
      }),
      ...(data.characterCount !== undefined && {
        characterCount: data.characterCount,
      }),
      ...(data.estimatedReadTime !== undefined && {
        estimatedReadTime: data.estimatedReadTime,
      }),
      ...(data.genre !== undefined && { genre: data.genre }),
      ...(data.targetAudience !== undefined && {
        targetAudience: data.targetAudience,
      }),
      ...(data.benefit !== undefined && { benefit: data.benefit }),
      ...(data.recommendationLevel !== undefined && {
        recommendationLevel: data.recommendationLevel,
      }),
    },
    include: {
      memberships: {
        include: {
          membership: true,
        },
      },
    },
  });

  return {
    id: article.id,
    rowNumber: article.rowNumber,
    title: article.title,
    noteLink: article.noteLink,
    publishedAt: article.publishedAt.toISOString(),
    characterCount: article.characterCount,
    estimatedReadTime: article.estimatedReadTime,
    genre: article.genre,
    targetAudience: article.targetAudience,
    benefit: article.benefit,
    recommendationLevel: article.recommendationLevel,
    createdAt: article.createdAt.toISOString(),
    updatedAt: article.updatedAt.toISOString(),
    memberships: article.memberships.map((am) => ({
      membership: {
        id: am.membership.id,
        name: am.membership.name,
        description: am.membership.description,
        color: am.membership.color,
        sortOrder: am.membership.sortOrder,
        isActive: am.membership.isActive,
        createdAt: am.membership.createdAt.toISOString(),
        updatedAt: am.membership.updatedAt.toISOString(),
      },
    })),
  };
}

/**
 * Delete an article by ID
 */
export async function deleteArticle(id: string): Promise<boolean> {
  try {
    await prisma.article.delete({
      where: { id },
    });
    return true;
  } catch {
    return false;
  }
}

/**
 * Delete all articles
 */
export async function deleteAllArticles(): Promise<number> {
  const result = await prisma.article.deleteMany();
  return result.count;
}

/**
 * Bulk create articles (used for CSV import)
 */
export async function bulkCreateArticles(
  articlesData: Array<
    Omit<Article, 'id' | 'createdAt' | 'updatedAt' | 'memberships'> & {
      membershipIds?: string[];
    }
  >
): Promise<{
  imported: number;
  skipped: number;
  errors: string[];
}> {
  let imported = 0;
  let skipped = 0;
  const errors: string[] = [];

  // Get all existing noteLinks in one query
  const existingArticles = await prisma.article.findMany({
    where: {
      noteLink: {
        in: articlesData.map((a) => a.noteLink),
      },
    },
    select: { noteLink: true },
  });

  const existingNoteLinks = new Set(
    existingArticles.map((a) => a.noteLink)
  );

  // Filter out duplicates
  const newArticles = articlesData.filter((data) => {
    if (existingNoteLinks.has(data.noteLink)) {
      skipped++;
      return false;
    }
    return true;
  });

  if (newArticles.length === 0) {
    return { imported, skipped, errors };
  }

  // Process in batches of 50 to avoid overwhelming the database
  const BATCH_SIZE = 50;

  for (let i = 0; i < newArticles.length; i += BATCH_SIZE) {
    const batch = newArticles.slice(i, i + BATCH_SIZE);

    try {
      // Use a transaction for each batch
      await prisma.$transaction(async (tx) => {
        for (const data of batch) {
          try {
            const article = await tx.article.create({
              data: {
                rowNumber: data.rowNumber,
                title: data.title,
                noteLink: data.noteLink,
                publishedAt: new Date(data.publishedAt),
                characterCount: data.characterCount,
                estimatedReadTime: data.estimatedReadTime,
                genre: data.genre,
                targetAudience: data.targetAudience,
                benefit: data.benefit,
                recommendationLevel: data.recommendationLevel,
              },
            });

            // Create memberships if any
            if (data.membershipIds && data.membershipIds.length > 0) {
              await tx.articleMembership.createMany({
                data: data.membershipIds.map((membershipId) => ({
                  articleId: article.id,
                  membershipId,
                })),
              });
            }

            imported++;
          } catch (error) {
            errors.push(`Failed to import: ${data.title} - ${error}`);
          }
        }
      });
    } catch (error) {
      errors.push(`Batch processing failed: ${error}`);
    }
  }

  return { imported, skipped, errors };
}

/**
 * Get storage info for debugging
 */
export function getStorageInfo(): { type: 'database'; production: boolean } {
  return {
    type: 'database',
    production: process.env.VERCEL === '1',
  };
}
