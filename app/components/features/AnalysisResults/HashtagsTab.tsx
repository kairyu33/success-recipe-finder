/**
 * Hashtags Tab Component - Premium Design
 *
 * @description Enhanced hashtags display with glassmorphism and gradient effects
 */

'use client';

import { CopyButton } from '@/app/components/ui/CopyButton/CopyButton';
import { useClipboard } from '@/app/hooks/useClipboard';
import { SECTION_HEADERS, EMPTY_STATE_MESSAGES } from '@/app/constants/text.constants';
import { TabContentProps } from './AnalysisResults.types';
import { COLORS } from '@/app/constants/ui.constants';

export function HashtagsTab({ data }: Pick<TabContentProps, 'data'>) {
  const hashtags = data.hashtags || [];
  const { copy, isCopied } = useClipboard();

  if (hashtags.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
          </svg>
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          {EMPTY_STATE_MESSAGES.noHashtags}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold gradient-text">
          {SECTION_HEADERS.hashtags.main}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {hashtags.length}個のハッシュタグ（クリックでコピー）
        </p>
      </div>

      {/* Hashtags Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 stagger-children">
        {hashtags.map((hashtag, index) => (
          <button
            key={index}
            onClick={() => copy(hashtag, `hashtag-${index}`)}
            className={`group relative rounded-xl p-3 transition-all text-left ${
              isCopied(`hashtag-${index}`)
                ? 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/40 dark:to-emerald-900/40 border-2 border-green-500 shadow-lg shadow-green-500/20'
                : 'bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-800 hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-lg hover:-translate-y-0.5'
            }`}
          >
            {/* Hover glow effect */}
            {!isCopied(`hashtag-${index}`) && (
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl opacity-0 group-hover:opacity-10 blur transition duration-300" />
            )}

            <div className="relative flex items-center gap-2">
              <span className={`font-bold text-sm ${
                isCopied(`hashtag-${index}`)
                  ? 'text-green-700 dark:text-green-300'
                  : 'text-blue-700 dark:text-blue-300'
              }`}>
                #
              </span>
              <span className={`font-medium text-sm truncate flex-1 ${
                isCopied(`hashtag-${index}`)
                  ? 'text-green-800 dark:text-green-200'
                  : 'text-blue-800 dark:text-blue-200'
              }`}>
                {hashtag.replace('#', '')}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Usage Tips */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl p-6 border border-indigo-200 dark:border-indigo-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          ハッシュタグの効果的な使い方
        </h3>
        <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <p>• 記事内に3〜5個のハッシュタグを配置すると検索されやすくなります</p>
          <p>• タイトルや冒頭に人気のハッシュタグを入れることで発見率が向上</p>
          <p>• 独自のハッシュタグを作ってシリーズ化すると読者が関連記事を見つけやすい</p>
        </div>
      </div>
    </div>
  );
}
