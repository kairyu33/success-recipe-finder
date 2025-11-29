/**
 * 記事フィルタリングユーティリティ
 */

import type { Article, ArticleStats } from '@/types';
import * as storage from './localStorage';

/**
 * 記事統計情報を取得（localStorage使用）
 */
export function fetchArticleStats(articleId: string): ArticleStats {
  return storage.getArticleStats(articleId);
}

/**
 * 評価フィルターの条件をチェック
 */
export function matchesRatingFilter(
  totalRatings: number,
  filter: 'all' | 'has' | 'none'
): boolean {
  if (filter === 'all') return true;
  if (filter === 'has') return totalRatings > 0;
  if (filter === 'none') return totalRatings === 0;
  return true;
}

/**
 * コメントフィルターの条件をチェック
 */
export function matchesCommentFilter(
  totalComments: number,
  filter: 'all' | 'has' | 'none'
): boolean {
  if (filter === 'all') return true;
  if (filter === 'has') return totalComments > 0;
  if (filter === 'none') return totalComments === 0;
  return true;
}

/**
 * 記事を統計情報でフィルタリング（localStorage使用）
 */
export function filterArticlesByStats(
  articles: Article[],
  ratingFilter: string,
  commentFilter: string
): Article[] {
  if (ratingFilter === 'all' && commentFilter === 'all') {
    return articles;
  }

  return articles.filter((article) => {
    const stats = fetchArticleStats(article.id);

    const matchesRating = matchesRatingFilter(stats.totalRatings, ratingFilter as 'all' | 'has' | 'none');
    const matchesComment = matchesCommentFilter(stats.totalComments, commentFilter as 'all' | 'has' | 'none');

    return matchesRating && matchesComment;
  });
}
