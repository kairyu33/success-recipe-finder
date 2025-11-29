/**
 * Articles Store - Hybrid storage system (Local JSON + Vercel Blob)
 *
 * @description Manages article data using:
 * - Local: JSON file storage for development
 * - Production: Vercel Blob for persistent cloud storage
 */

import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { put } from '@vercel/blob';
import type { Article, ArticleFormData } from '@/types';

/**
 * Data structure for storage
 */
interface ArticlesData {
  articles: (Article & { membershipIds?: string[] })[];
  lastModified: string;
}

// Storage configuration
const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;
const IS_PRODUCTION = process.env.VERCEL === '1';
const BLOB_FILENAME = 'articles.json';
const DISABLE_BLOB = process.env.DISABLE_BLOB === 'true';

// Local storage paths
const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'articles.json');

/**
 * Check if we should use Vercel Blob storage
 */
function shouldUseBlob(): boolean {
  // Allow disabling Blob storage via environment variable
  if (DISABLE_BLOB) {
    return false;
  }
  return IS_PRODUCTION && !!BLOB_TOKEN;
}

/**
 * Ensure local data directory and file exist
 */
async function ensureLocalDataFile(): Promise<void> {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }

  try {
    await fs.access(DATA_FILE);
  } catch {
    const initialData: ArticlesData = {
      articles: [],
      lastModified: new Date().toISOString()
    };
    await fs.writeFile(DATA_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
  }
}

/**
 * Read articles from storage
 */
async function readArticles(): Promise<(Article & { membershipIds?: string[] })[]> {
  if (shouldUseBlob()) {
    try {
      const blobUrl = `${process.env.BLOB_URL_PREFIX}/${BLOB_FILENAME}`;
      const response = await fetch(blobUrl);

      if (!response.ok) {
        console.log('Blob not found, initializing empty data');
        return [];
      }

      const data: ArticlesData = await response.json();
      return data.articles || [];
    } catch (error) {
      console.error('Error reading from Blob:', error);
      return [];
    }
  } else {
    await ensureLocalDataFile();
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    const parsed: ArticlesData = JSON.parse(data);
    return parsed.articles || [];
  }
}

/**
 * Write articles to storage
 */
async function writeArticles(articles: (Article & { membershipIds?: string[] })[]): Promise<void> {
  const data: ArticlesData = {
    articles,
    lastModified: new Date().toISOString()
  };

  const jsonContent = JSON.stringify(data, null, 2);

  if (shouldUseBlob()) {
    try {
      await put(BLOB_FILENAME, jsonContent, {
        access: 'public',
        contentType: 'application/json',
        addRandomSuffix: false,
      });
      console.log('Successfully wrote to Vercel Blob');
    } catch (error) {
      console.error('Error writing to Blob:', error);
      throw new Error('Failed to write to Blob storage');
    }
  } else {
    await ensureLocalDataFile();
    await fs.writeFile(DATA_FILE, jsonContent, 'utf-8');
  }
}

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
  let articles = await readArticles();

  // Apply search filter
  if (options?.search) {
    const searchLower = options.search.toLowerCase();
    articles = articles.filter(article =>
      article.title.toLowerCase().includes(searchLower) ||
      article.genre.toLowerCase().includes(searchLower) ||
      article.benefit.toLowerCase().includes(searchLower)
    );
  }

  // Apply genre filter
  if (options?.genres && options.genres.length > 0) {
    articles = articles.filter(article => options.genres!.includes(article.genre));
  }

  // Apply target audience filter
  if (options?.targetAudiences && options.targetAudiences.length > 0) {
    articles = articles.filter(article => options.targetAudiences!.includes(article.targetAudience));
  }

  // Apply recommendation level filter
  if (options?.recommendationLevels && options.recommendationLevels.length > 0) {
    articles = articles.filter(article => options.recommendationLevels!.includes(article.recommendationLevel));
  }

  // Apply membership filter
  if (options?.membershipIds && options.membershipIds.length > 0) {
    articles = articles.filter(article => {
      const articleMembershipIds = article.membershipIds || [];
      return options.membershipIds!.some(id => articleMembershipIds.includes(id));
    });
  }

  // Sort articles
  const sortBy = options?.sortBy || 'publishedAt';
  const sortOrder = options?.sortOrder || 'desc';

  articles.sort((a, b) => {
    let aValue: any = (a as any)[sortBy];
    let bValue: any = (b as any)[sortBy];

    if (sortBy === 'publishedAt' || sortBy === 'createdAt' || sortBy === 'updatedAt') {
      aValue = new Date(aValue).getTime();
      bValue = new Date(bValue).getTime();
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const total = articles.length;

  // Apply pagination
  const offset = options?.offset || 0;
  const limit = options?.limit || 100;
  const paginatedArticles = articles.slice(offset, offset + limit);

  // Get actual membership data
  const { getMemberships } = await import('./membershipsStore');
  const allMemberships = await getMemberships();
  const membershipMap = new Map(allMemberships.map(m => [m.id, m]));

  // Convert to Article type (convert membershipIds to memberships structure)
  const result = paginatedArticles.map(article => {
    const { membershipIds, ...rest } = article;
    return {
      ...rest,
      memberships: (membershipIds || [])
        .map(id => {
          const membership = membershipMap.get(id);
          return membership ? { membership } : null;
        })
        .filter((m): m is { membership: typeof allMemberships[0] } => m !== null)
    } as Article;
  });

  return { articles: result, total };
}

/**
 * Get a single article by ID
 */
export async function getArticleById(id: string): Promise<Article | null> {
  const articles = await readArticles();
  const article = articles.find(a => a.id === id);

  if (!article) return null;

  // Get actual membership data
  const { getMemberships } = await import('./membershipsStore');
  const allMemberships = await getMemberships();
  const membershipMap = new Map(allMemberships.map(m => [m.id, m]));

  const { membershipIds, ...rest } = article;
  return {
    ...rest,
    memberships: (membershipIds || [])
      .map(id => {
        const membership = membershipMap.get(id);
        return membership ? { membership } : null;
      })
      .filter((m): m is { membership: typeof allMemberships[0] } => m !== null)
  } as Article;
}

/**
 * Create a new article
 */
export async function createArticle(
  data: ArticleFormData & { rowNumber?: number }
): Promise<Article> {
  const articles = await readArticles();

  // Check for duplicate noteLink
  const existing = articles.find(article => article.noteLink === data.noteLink);
  if (existing) {
    throw new Error('Article with this noteLink already exists');
  }

  const now = new Date().toISOString();
  const newArticle = {
    id: uuidv4(),
    rowNumber: data.rowNumber || articles.length + 1,
    title: data.title,
    noteLink: data.noteLink,
    publishedAt: data.publishedAt,
    characterCount: data.characterCount,
    estimatedReadTime: data.estimatedReadTime,
    genre: data.genre,
    targetAudience: data.targetAudience,
    benefit: data.benefit,
    recommendationLevel: data.recommendationLevel,
    createdAt: now,
    updatedAt: now,
    membershipIds: data.membershipIds || [],
    memberships: []
  };

  articles.push(newArticle);
  await writeArticles(articles);

  // Get actual membership data
  const { getMemberships } = await import('./membershipsStore');
  const allMemberships = await getMemberships();
  const membershipMap = new Map(allMemberships.map(m => [m.id, m]));

  const { membershipIds, ...rest } = newArticle;
  return {
    ...rest,
    memberships: (membershipIds || [])
      .map(id => {
        const membership = membershipMap.get(id);
        return membership ? { membership } : null;
      })
      .filter((m): m is { membership: typeof allMemberships[0] } => m !== null)
  } as Article;
}

/**
 * Update an existing article
 */
export async function updateArticle(
  id: string,
  data: Partial<ArticleFormData>
): Promise<Article> {
  const articles = await readArticles();
  const index = articles.findIndex(article => article.id === id);

  if (index === -1) {
    throw new Error('Article not found');
  }

  // Check for duplicate noteLink if being updated
  if (data.noteLink && data.noteLink !== articles[index].noteLink) {
    const duplicate = articles.find(article => article.noteLink === data.noteLink);
    if (duplicate) {
      throw new Error('Article with this noteLink already exists');
    }
  }

  const updatedArticle = {
    ...articles[index],
    ...(data.title !== undefined && { title: data.title }),
    ...(data.noteLink !== undefined && { noteLink: data.noteLink }),
    ...(data.publishedAt !== undefined && { publishedAt: data.publishedAt }),
    ...(data.characterCount !== undefined && { characterCount: data.characterCount }),
    ...(data.estimatedReadTime !== undefined && { estimatedReadTime: data.estimatedReadTime }),
    ...(data.genre !== undefined && { genre: data.genre }),
    ...(data.targetAudience !== undefined && { targetAudience: data.targetAudience }),
    ...(data.benefit !== undefined && { benefit: data.benefit }),
    ...(data.recommendationLevel !== undefined && { recommendationLevel: data.recommendationLevel }),
    ...(data.membershipIds !== undefined && { membershipIds: data.membershipIds }),
    updatedAt: new Date().toISOString()
  };

  articles[index] = updatedArticle;
  await writeArticles(articles);

  // Get actual membership data
  const { getMemberships } = await import('./membershipsStore');
  const allMemberships = await getMemberships();
  const membershipMap = new Map(allMemberships.map(m => [m.id, m]));

  const { membershipIds, ...rest } = updatedArticle;
  return {
    ...rest,
    memberships: (membershipIds || [])
      .map(id => {
        const membership = membershipMap.get(id);
        return membership ? { membership } : null;
      })
      .filter((m): m is { membership: typeof allMemberships[0] } => m !== null)
  } as Article;
}

/**
 * Delete an article by ID
 */
export async function deleteArticle(id: string): Promise<boolean> {
  const articles = await readArticles();
  const index = articles.findIndex(article => article.id === id);

  if (index === -1) {
    return false;
  }

  articles.splice(index, 1);
  await writeArticles(articles);

  return true;
}

/**
 * Delete all articles
 */
export async function deleteAllArticles(): Promise<number> {
  const articles = await readArticles();
  const count = articles.length;
  await writeArticles([]);
  return count;
}

/**
 * Bulk create articles (used for CSV import)
 */
export async function bulkCreateArticles(
  articlesData: Array<Omit<Article, 'id' | 'createdAt' | 'updatedAt' | 'memberships'> & { membershipIds?: string[] }>
): Promise<{
  imported: number;
  skipped: number;
  errors: string[];
}> {
  const articles = await readArticles();
  const existingLinks = new Set(articles.map(a => a.noteLink));

  let imported = 0;
  let skipped = 0;
  const errors: string[] = [];
  const now = new Date().toISOString();

  for (const data of articlesData) {
    try {
      // Skip if duplicate
      if (existingLinks.has(data.noteLink)) {
        skipped++;
        continue;
      }

      const newArticle = {
        ...data,
        id: uuidv4(),
        createdAt: now,
        updatedAt: now,
        membershipIds: data.membershipIds || [],
        memberships: []
      };

      articles.push(newArticle);
      existingLinks.add(data.noteLink);
      imported++;
    } catch (error) {
      errors.push(`Failed to import: ${data.title} - ${error}`);
      skipped++;
    }
  }

  if (imported > 0) {
    await writeArticles(articles);
  }

  return { imported, skipped, errors };
}

/**
 * Get storage info for debugging
 */
export function getStorageInfo(): { type: 'blob' | 'local'; production: boolean } {
  return {
    type: shouldUseBlob() ? 'blob' : 'local',
    production: IS_PRODUCTION
  };
}
