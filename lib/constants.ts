/**
 * アプリケーション定数
 */

// 認証
export const ADMIN_PASSWORD = 'admin123';

// デフォルト値
export const DEFAULT_MEMBERSHIP_COLOR = '#3B82F6';
export const DEFAULT_ARTICLE_LIMIT = 100;

// CSVフォーマット
export const CSV_HEADERS = [
  'rowNumber',
  'title',
  'noteLink',
  'publishedAt',
  'characterCount',
  'estimatedReadTime',
  'genre',
  'targetAudience',
  'benefit',
  'recommendationLevel',
  'membershipIds',
] as const;

// メッセージ
export const MESSAGES = {
  // 成功メッセージ
  SUCCESS: {
    ARTICLE_CREATED: '記事を作成しました',
    ARTICLE_UPDATED: '記事を更新しました',
    ARTICLE_DELETED: '記事を削除しました',
    MEMBERSHIP_CREATED: 'メンバーシップを作成しました',
    MEMBERSHIP_UPDATED: 'メンバーシップを更新しました',
    MEMBERSHIP_DELETED: 'メンバーシップを削除しました',
    CSV_IMPORTED: (count: number) => `${count}件の記事をインポートしました`,
  },

  // エラーメッセージ
  ERROR: {
    AUTH_FAILED: 'パスワードが正しくありません',
    DATA_FETCH_FAILED: 'データの取得に失敗しました',
    OPERATION_FAILED: '操作に失敗しました',
    FILE_NOT_SELECTED: 'ファイルを選択してください',
  },

  // 確認メッセージ
  CONFIRM: {
    DELETE_ARTICLE: 'この記事を削除してもよろしいですか?',
    DELETE_MEMBERSHIP: 'このメンバーシップを削除してもよろしいですか?',
  },
} as const;
