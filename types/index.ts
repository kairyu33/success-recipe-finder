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
  benefit: string;
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
  benefit: string;
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

// CSVインポート結果型
export type ImportResult = {
  success: boolean;
  total: number;
  imported: number;
  skipped: number;
  errors?: string[];
};

// API レスポンス型
export type ApiResponse<T> = {
  success?: boolean;
  data?: T;
  error?: string;
  message?: string;
};

// タブ型
export type Tab = 'articles' | 'memberships';
