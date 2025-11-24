/**
 * Text Constants
 *
 * @description Static text content for the application
 * Centralized for easy i18n implementation later
 */

export const APP_TEXT = {
  title: 'NoteBoost AI',
  subtitle:
    'note記事を最適化するAI分析ツール。タイトル候補、記事の要約、アイキャッチ画像のアイデア、最適なハッシュタグをClaude AIが自動生成します',
  footer: {
    poweredBy: 'Powered by Claude AI (Sonnet 4.5) | Built with Next.js 16 & Tailwind CSS 4',
    description: 'note記事を総合的に分析し、エンゲージメントを高める最適な提案を生成',
  },
} as const;

export const INPUT_TEXT = {
  label: '記事の内容を入力してください',
  placeholder: `記事のテキストをここに貼り付けてください...

例：
今日は東京で開催されたテクノロジーカンファレンスに参加しました。最新のAI技術について学び、多くの開発者と交流できました。特にClaude APIを使った自然言語処理のデモが印象的でした。`,
  characterCount: '文字',
  maxCharacters: '最大30,000文字',
} as const;

export const BUTTON_TEXT = {
  analyze: '記事を分析する',
  analyzing: '記事を分析中...',
  copy: 'コピー',
  copied: 'コピー済み',
  copyAll: 'すべてコピー',
} as const;

export const TAB_TEXT = {
  titles: 'タイトル候補',
  insights: '記事の要約',
  image: 'アイキャッチ',
  hashtags: 'ハッシュタグ',
  virality: 'バイラル性分析',
  readingTime: '読了時間',
  rewrite: 'リライト提案',
  series: 'シリーズ記事',
  monetization: '収益化',
  emotional: '感情分析',
  seo: 'SEO分析',
} as const;

export const SECTION_HEADERS = {
  titles: {
    main: 'タイトル候補',
    badge: 'タイトル案',
  },
  insights: {
    main: '記事の要約',
    oneLiner: 'この記事を一言で',
    whatYouLearn: '学べること',
    benefits: '読むメリット',
    recommendedFor: 'おすすめの読者',
  },
  image: {
    main: 'アイキャッチ画像のアイデア',
    summary: '画像の概要（100文字）',
    prompt: '画像生成プロンプト',
    composition: '構図のアイデア',
    colorPalette: 'カラーパレット',
    mood: 'ムード・雰囲気',
    style: 'スタイル',
  },
  hashtags: {
    main: 'ハッシュタグ',
  },
} as const;

export const ERROR_MESSAGES = {
  emptyInput: '記事のテキストを入力してください',
  analysisFailed: '分析に失敗しました',
  genericError: 'エラーが発生しました',
  copyFailed: 'コピーに失敗しました',
} as const;

export const EMPTY_STATE_MESSAGES = {
  noTitles: 'タイトル候補が生成されませんでした',
  noInsights: '要約が生成されませんでした',
  noImage: 'アイキャッチ画像のアイデアが生成されませんでした',
  noHashtags: 'ハッシュタグが生成されませんでした',
} as const;
