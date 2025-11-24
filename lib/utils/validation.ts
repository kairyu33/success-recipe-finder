/**
 * バリデーション関連のユーティリティ関数
 */

/**
 * 必須フィールドのバリデーション
 */
export function validateRequired(value: string | number): boolean {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  return value !== null && value !== undefined;
}

/**
 * URLのバリデーション
 */
export function validateUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * note.com URLのバリデーション
 */
export function validateNoteUrl(url: string): boolean {
  if (!validateUrl(url)) return false;
  return url.includes('note.com');
}

/**
 * 数値の範囲バリデーション
 */
export function validateRange(
  value: number,
  min: number,
  max: number
): boolean {
  return value >= min && value <= max;
}
