/**
 * ジャンル別のカラーユーティリティ
 */

/**
 * ジャンル別のグラデーション背景色を返す
 * @param genre - ジャンル名
 * @returns CSSグラデーション文字列
 */
export function getGenreGradient(genre?: string): string {
  if (!genre) return 'linear-gradient(135deg, rgba(241, 245, 249, 0.5), rgba(226, 232, 240, 0.5))'; // デフォルト: ライトグレー

  const genreMap: Record<string, string> = {
    '副業・起業': 'linear-gradient(135deg, rgba(168, 85, 247, 0.15), rgba(236, 72, 153, 0.15))', // 紫〜ピンク
    'ビジネス・キャリア': 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(147, 51, 234, 0.15))', // 青〜紫
    'マーケティング': 'linear-gradient(135deg, rgba(34, 197, 94, 0.15), rgba(59, 130, 246, 0.15))', // 緑〜青
    '健康・ライフスタイル': 'linear-gradient(135deg, rgba(251, 146, 60, 0.15), rgba(252, 211, 77, 0.15))', // オレンジ〜黄色
    'テクノロジー・社会問題': 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(139, 92, 246, 0.15))', // インディゴ〜紫
    '自己啓発・心理': 'linear-gradient(135deg, rgba(236, 72, 153, 0.15), rgba(244, 114, 182, 0.15))', // ピンク
    '恋愛・人間関係': 'linear-gradient(135deg, rgba(244, 63, 94, 0.15), rgba(251, 113, 133, 0.15))', // 赤〜ピンク
    'ライフプラン': 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(52, 211, 153, 0.15))', // エメラルド
    'その他': 'linear-gradient(135deg, rgba(148, 163, 184, 0.15), rgba(203, 213, 225, 0.15))', // グレー
  };

  return genreMap[genre] || genreMap['その他'];
}

/**
 * ジャンル別の濃いグラデーション背景色を返す（フィルタ選択時用）
 * @param genre - ジャンル名
 * @returns CSSグラデーション文字列
 */
export function getGenreGradientSelected(genre?: string): string {
  if (!genre) return 'linear-gradient(135deg, rgba(241, 245, 249, 0.8), rgba(226, 232, 240, 0.8))'; // デフォルト: ライトグレー

  const genreMap: Record<string, string> = {
    '副業・起業': 'linear-gradient(135deg, rgba(168, 85, 247, 0.25), rgba(236, 72, 153, 0.25))', // 紫〜ピンク
    'ビジネス・キャリア': 'linear-gradient(135deg, rgba(59, 130, 246, 0.25), rgba(147, 51, 234, 0.25))', // 青〜紫
    'マーケティング': 'linear-gradient(135deg, rgba(34, 197, 94, 0.25), rgba(59, 130, 246, 0.25))', // 緑〜青
    '健康・ライフスタイル': 'linear-gradient(135deg, rgba(251, 146, 60, 0.25), rgba(252, 211, 77, 0.25))', // オレンジ〜黄色
    'テクノロジー・社会問題': 'linear-gradient(135deg, rgba(99, 102, 241, 0.25), rgba(139, 92, 246, 0.25))', // インディゴ〜紫
    '自己啓発・心理': 'linear-gradient(135deg, rgba(236, 72, 153, 0.25), rgba(244, 114, 182, 0.25))', // ピンク
    '恋愛・人間関係': 'linear-gradient(135deg, rgba(244, 63, 94, 0.25), rgba(251, 113, 133, 0.25))', // 赤〜ピンク
    'ライフプラン': 'linear-gradient(135deg, rgba(16, 185, 129, 0.25), rgba(52, 211, 153, 0.25))', // エメラルド
    'その他': 'linear-gradient(135deg, rgba(148, 163, 184, 0.25), rgba(203, 213, 225, 0.25))', // グレー
  };

  return genreMap[genre] || genreMap['その他'];
}

/**
 * ジャンル別のホバー時グラデーション背景色を返す
 * @param genre - ジャンル名
 * @returns CSSグラデーション文字列
 */
export function getGenreGradientHover(genre?: string): string {
  if (!genre) return 'linear-gradient(135deg, rgba(241, 245, 249, 0.6), rgba(226, 232, 240, 0.6))'; // デフォルト: ライトグレー

  const genreMap: Record<string, string> = {
    '副業・起業': 'linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(236, 72, 153, 0.1))', // 紫〜ピンク
    'ビジネス・キャリア': 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1))', // 青〜紫
    'マーケティング': 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(59, 130, 246, 0.1))', // 緑〜青
    '健康・ライフスタイル': 'linear-gradient(135deg, rgba(251, 146, 60, 0.1), rgba(252, 211, 77, 0.1))', // オレンジ〜黄色
    'テクノロジー・社会問題': 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1))', // インディゴ〜紫
    '自己啓発・心理': 'linear-gradient(135deg, rgba(236, 72, 153, 0.1), rgba(244, 114, 182, 0.1))', // ピンク
    '恋愛・人間関係': 'linear-gradient(135deg, rgba(244, 63, 94, 0.1), rgba(251, 113, 133, 0.1))', // 赤〜ピンク
    'ライフプラン': 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(52, 211, 153, 0.1))', // エメラルド
    'その他': 'linear-gradient(135deg, rgba(148, 163, 184, 0.1), rgba(203, 213, 225, 0.1))', // グレー
  };

  return genreMap[genre] || genreMap['その他'];
}
