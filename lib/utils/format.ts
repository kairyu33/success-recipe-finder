/**
 * フォーマット関連のユーティリティ関数
 */

/**
 * 日付をYYYY-MM-DD形式にフォーマット
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString().split('T')[0];
}

/**
 * 数値をカンマ区切りにフォーマット
 */
export function formatNumber(num: number): string {
  return num.toLocaleString();
}

/**
 * メンバーシップIDを配列に変換（セミコロン区切り）
 */
export function parseMembershipIds(idsString: string): string[] {
  if (!idsString) return [];
  return idsString
    .split(';')
    .map((id) => id.trim())
    .filter((id) => id.length > 0);
}

/**
 * メンバーシップID配列を文字列に変換（セミコロン区切り）
 */
export function stringifyMembershipIds(ids: string[]): string {
  return ids.join(';');
}
