/**
 * Titles Tab Component - Premium Design
 *
 * @description Displays suggested article titles with modern glassmorphism and gradient effects
 */

'use client';

import { CopyButton } from '@/app/components/ui/CopyButton/CopyButton';
import { SECTION_HEADERS, EMPTY_STATE_MESSAGES } from '@/app/constants/text.constants';
import { TabContentProps } from './AnalysisResults.types';

export function TitlesTab({ data }: Pick<TabContentProps, 'data'>) {
  const titles = data.suggestedTitles || [];

  if (titles.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
          </svg>
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          {EMPTY_STATE_MESSAGES.noTitles}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold gradient-text">
          {SECTION_HEADERS.titles.main}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          AI生成された魅力的なタイトル案
        </p>
      </div>

      {/* Titles grid with stagger animation */}
      <div className="space-y-4 stagger-children">
        {titles.map((title, index) => (
          <div
            key={index}
            className="group relative"
          >
            {/* Background glow effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl opacity-0 group-hover:opacity-20 blur transition duration-300" />

            {/* Card content */}
            <div className="relative bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-200 dark:border-gray-800 hover:border-primary-300 dark:hover:border-primary-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  {/* Badge and number */}
                  <div className="flex items-center gap-3 mb-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 text-white text-sm font-bold shadow-lg shadow-primary-500/30">
                      {index + 1}
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
                      {SECTION_HEADERS.titles.badge}
                    </span>
                  </div>

                  {/* Title text */}
                  <p className="text-gray-900 dark:text-gray-100 font-semibold text-lg leading-relaxed">
                    {title}
                  </p>

                  {/* Metadata */}
                  <div className="flex items-center gap-4 mt-3 text-xs text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      読みやすさ: 高
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      クリック率: 良好
                    </span>
                  </div>
                </div>

                {/* Copy button */}
                <div className="flex-shrink-0">
                  <CopyButton text={title} itemId={`title-${index}`} />
                </div>
              </div>

              {/* Bottom gradient line */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500/0 via-primary-500/50 to-primary-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </div>
        ))}
      </div>

      {/* Tips section */}
      <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-accent-50 to-primary-50 dark:from-accent-900/20 dark:to-primary-900/20 border border-accent-200 dark:border-accent-800">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-white dark:bg-gray-900 shadow-sm">
            <svg className="w-5 h-5 text-accent-600 dark:text-accent-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
              プロのヒント
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              タイトルは記事の顔です。数字を入れたり、疑問形にすることでクリック率が向上します。
              また、キーワードを冒頭に配置するとSEO効果が高まります。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
