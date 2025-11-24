/**
 * 記事関連のAPI呼び出し関数
 */

import type { Article, ArticleFormData, ImportResult } from '@/types';

/**
 * 記事一覧を取得
 */
export async function fetchArticles(params?: {
  search?: string;
  membershipId?: string;
  genres?: string[];
  targetAudiences?: string[];
  recommendationLevels?: string[];
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  limit?: number;
}): Promise<Article[]> {
  const searchParams = new URLSearchParams();

  if (params?.search) searchParams.append('search', params.search);
  if (params?.membershipId) searchParams.append('membershipId', params.membershipId);
  if (params?.genres && params.genres.length > 0) {
    searchParams.append('genres', params.genres.join(','));
  }
  if (params?.targetAudiences && params.targetAudiences.length > 0) {
    searchParams.append('targetAudiences', params.targetAudiences.join(','));
  }
  if (params?.recommendationLevels && params.recommendationLevels.length > 0) {
    searchParams.append('recommendationLevels', params.recommendationLevels.join(','));
  }
  if (params?.sortBy) searchParams.append('sortBy', params.sortBy);
  if (params?.sortOrder) searchParams.append('sortOrder', params.sortOrder);
  if (params?.limit) searchParams.append('limit', params.limit.toString());

  const response = await fetch(`/api/articles?${searchParams}`);

  if (!response.ok) {
    throw new Error('記事の取得に失敗しました');
  }

  const data = await response.json();
  return data.articles || [];
}

/**
 * 管理者用記事一覧を取得
 */
export async function fetchAdminArticles(): Promise<Article[]> {
  const response = await fetch('/api/admin/articles');

  if (!response.ok) {
    throw new Error('記事の取得に失敗しました');
  }

  const data = await response.json();
  return data.articles || [];
}

/**
 * 記事を作成
 */
export async function createArticle(data: ArticleFormData): Promise<Article> {
  const response = await fetch('/api/admin/articles', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || '記事の作成に失敗しました');
  }

  const result = await response.json();
  return result.article;
}

/**
 * 記事を更新
 */
export async function updateArticle(
  id: string,
  data: ArticleFormData
): Promise<Article> {
  const response = await fetch(`/api/admin/articles/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || '記事の更新に失敗しました');
  }

  const result = await response.json();
  return result.article;
}

/**
 * 記事を削除
 */
export async function deleteArticle(id: string): Promise<void> {
  const response = await fetch(`/api/admin/articles/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('記事の削除に失敗しました');
  }
}

/**
 * CSVから記事をインポート
 */
export async function importArticlesFromCSV(file: File): Promise<ImportResult> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('/api/articles/import', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'CSVのインポートに失敗しました');
  }

  return response.json();
}
