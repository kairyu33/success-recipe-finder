/**
 * 共通型定義
 */

// メンバーシップ型
export type Membership = {
  id: string;
  name: string;
  description: string | null;
  color: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
};

// ジャンル型
export type Genre = {
  id: string;
  name: string;
  sortOrder: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
};

// 読者メリット型
export type Benefit = {
  id: string;
  name: string;
  description: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
};

// 記事型
export type Article = {
  id: string;
  rowNumber: number;
  title: string;
  noteLink: string;
  publishedAt: string;
  characterCount: number;
  estimatedReadTime: number;
  genre: string;
  targetAudience: string;
  benefit: string; // カンマ区切りで複数のメリットを保存
  recommendationLevel: string;
  createdAt: string;
  updatedAt: string;
  memberships: ArticleMembership[];
};

// 記事-メンバーシップ関連型
export type ArticleMembership = {
  membership: Membership;
};

// 記事フォーム型
export type ArticleFormData = {
  title: string;
  noteLink: string;
  publishedAt: string;
  characterCount: number;
  estimatedReadTime: number;
  genre: string;
  targetAudience: string;
  benefit: string; // カンマ区切りで複数のメリットを保存
  recommendationLevel: string;
  membershipIds: string[];
};

// メンバーシップフォーム型
export type MembershipFormData = {
  name: string;
  description: string;
  color: string;
  sortOrder: number;
  isActive: boolean;
};

// ジャンルフォーム型
export type GenreFormData = {
  name: string;
  sortOrder: number;
  isActive: boolean;
};

// 読者メリットフォーム型
export type BenefitFormData = {
  name: string;
  description: string;
  sortOrder: number;
  isActive: boolean;
};

// CSVインポート結果型
export type ImportResult = {
  success: boolean;
  total: number;
  imported: number;
  skipped: number;
  errors?: string[];
};

// 評価型
export type Rating = {
  id: string;
  articleId: string;
  userId: string | null;
  userName: string | null;
  score: number; // 1-5
  createdAt: string;
  updatedAt: string;
};

// コメント型
export type Comment = {
  id: string;
  articleId: string;
  userId: string | null;
  userName: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

// 評価フォーム型
export type RatingFormData = {
  articleId: string;
  userName?: string;
  score: number;
};

// コメントフォーム型
export type CommentFormData = {
  articleId: string;
  userName: string;
  content: string;
};

// 記事統計型
export type ArticleStats = {
  averageRating: number;
  totalRatings: number;
  totalComments: number;
};

// API レスポンス型
export type ApiResponse<T> = {
  success?: boolean;
  data?: T;
  error?: string;
  message?: string;
};

// タブ型
export type Tab = 'articles' | 'memberships' | 'genres' | 'benefits' | 'ratings' | 'comments';
