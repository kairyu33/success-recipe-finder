/**
 * LocalStorage管理ユーティリティ
 * 評価とコメントをブラウザ側で管理
 */

export interface Rating {
  id: string;
  articleId: string;
  score: number;
  userName?: string;
  createdAt: string;
}

export interface Comment {
  id: string;
  articleId: string;
  userName: string;
  content: string;
  createdAt: string;
}

export interface ArticleStats {
  averageRating: number;
  totalRatings: number;
  totalComments: number;
}

const RATINGS_KEY = 'article-ratings';
const COMMENTS_KEY = 'article-comments';

// ユニークIDを生成
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// === 評価関連 ===

export function getRatings(articleId: string): Rating[] {
  if (typeof window === 'undefined') return [];

  try {
    const data = localStorage.getItem(RATINGS_KEY);
    const allRatings: Rating[] = data ? JSON.parse(data) : [];
    return allRatings.filter(r => r.articleId === articleId);
  } catch (error) {
    console.error('評価データの取得エラー:', error);
    return [];
  }
}

export function addRating(articleId: string, score: number, userName?: string): Rating {
  if (typeof window === 'undefined') throw new Error('ブラウザ環境でのみ使用可能');

  const newRating: Rating = {
    id: generateId(),
    articleId,
    score,
    userName,
    createdAt: new Date().toISOString(),
  };

  try {
    const data = localStorage.getItem(RATINGS_KEY);
    const allRatings: Rating[] = data ? JSON.parse(data) : [];
    allRatings.push(newRating);
    localStorage.setItem(RATINGS_KEY, JSON.stringify(allRatings));
    return newRating;
  } catch (error) {
    console.error('評価の保存エラー:', error);
    throw error;
  }
}

// === コメント関連 ===

export function getComments(articleId: string): Comment[] {
  if (typeof window === 'undefined') return [];

  try {
    const data = localStorage.getItem(COMMENTS_KEY);
    const allComments: Comment[] = data ? JSON.parse(data) : [];
    return allComments
      .filter(c => c.articleId === articleId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    console.error('コメントデータの取得エラー:', error);
    return [];
  }
}

export function addComment(articleId: string, userName: string, content: string): Comment {
  if (typeof window === 'undefined') throw new Error('ブラウザ環境でのみ使用可能');

  const newComment: Comment = {
    id: generateId(),
    articleId,
    userName,
    content,
    createdAt: new Date().toISOString(),
  };

  try {
    const data = localStorage.getItem(COMMENTS_KEY);
    const allComments: Comment[] = data ? JSON.parse(data) : [];
    allComments.push(newComment);
    localStorage.setItem(COMMENTS_KEY, JSON.stringify(allComments));
    return newComment;
  } catch (error) {
    console.error('コメントの保存エラー:', error);
    throw error;
  }
}

// === 削除機能 ===

export function deleteRating(id: string): boolean {
  if (typeof window === 'undefined') throw new Error('ブラウザ環境でのみ使用可能');

  try {
    const data = localStorage.getItem(RATINGS_KEY);
    const allRatings: Rating[] = data ? JSON.parse(data) : [];
    const updatedRatings = allRatings.filter(r => r.id !== id);

    if (allRatings.length === updatedRatings.length) {
      return false; // IDが見つからなかった
    }

    localStorage.setItem(RATINGS_KEY, JSON.stringify(updatedRatings));
    return true;
  } catch (error) {
    console.error('評価の削除エラー:', error);
    throw error;
  }
}

export function deleteComment(id: string): boolean {
  if (typeof window === 'undefined') throw new Error('ブラウザ環境でのみ使用可能');

  try {
    const data = localStorage.getItem(COMMENTS_KEY);
    const allComments: Comment[] = data ? JSON.parse(data) : [];
    const updatedComments = allComments.filter(c => c.id !== id);

    if (allComments.length === updatedComments.length) {
      return false; // IDが見つからなかった
    }

    localStorage.setItem(COMMENTS_KEY, JSON.stringify(updatedComments));
    return true;
  } catch (error) {
    console.error('コメントの削除エラー:', error);
    throw error;
  }
}

// === すべてのデータ取得（管理画面用） ===

export function getAllRatings(): Rating[] {
  if (typeof window === 'undefined') return [];

  try {
    const data = localStorage.getItem(RATINGS_KEY);
    const allRatings: Rating[] = data ? JSON.parse(data) : [];
    return allRatings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    console.error('評価データの取得エラー:', error);
    return [];
  }
}

export function getAllComments(): Comment[] {
  if (typeof window === 'undefined') return [];

  try {
    const data = localStorage.getItem(COMMENTS_KEY);
    const allComments: Comment[] = data ? JSON.parse(data) : [];
    return allComments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    console.error('コメントデータの取得エラー:', error);
    return [];
  }
}

// === 統計情報 ===

export function getArticleStats(articleId: string): ArticleStats {
  const ratings = getRatings(articleId);
  const comments = getComments(articleId);

  const totalRatings = ratings.length;
  const averageRating = totalRatings > 0
    ? ratings.reduce((sum, r) => sum + r.score, 0) / totalRatings
    : 0;

  return {
    averageRating: Math.round(averageRating * 10) / 10,
    totalRatings,
    totalComments: comments.length,
  };
}
