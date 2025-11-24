/**
 * Insights Tab Component - Premium Design
 *
 * @description Enhanced article insights with glassmorphism and gradient effects
 */

'use client';

import { useClipboard } from '@/app/hooks/useClipboard';
import { SECTION_HEADERS, EMPTY_STATE_MESSAGES, BUTTON_TEXT } from '@/app/constants/text.constants';
import { TabContentProps } from './AnalysisResults.types';
import { COLORS } from '@/app/constants/ui.constants';

export function InsightsTab({ data }: Pick<TabContentProps, 'data'>) {
  const insights = data.insights;
  const { copy, isCopied } = useClipboard();

  if (!insights) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          {EMPTY_STATE_MESSAGES.noInsights}
        </p>
      </div>
    );
  }

  // Format combined text for copying
  const formatCombinedText = () => {
    const sections: string[] = [];

    // Add "学べること" section
    if (insights.whatYouLearn && insights.whatYouLearn.length > 0) {
      sections.push('【学べること】');
      insights.whatYouLearn.forEach((item, index) => {
        sections.push(`${index + 1}. ${item}`);
      });
      sections.push(''); // Empty line
    }

    // Add "読むメリット" section
    if (insights.benefits && insights.benefits.length > 0) {
      sections.push('【読むメリット】');
      insights.benefits.forEach((item, index) => {
        sections.push(`${index + 1}. ${item}`);
      });
      sections.push(''); // Empty line
    }

    // Add "おすすめの読者" section
    if (insights.recommendedFor && insights.recommendedFor.length > 0) {
      sections.push('【おすすめの読者】');
      insights.recommendedFor.forEach((item, index) => {
        sections.push(`${index + 1}. ${item}`);
      });
    }

    return sections.join('\n');
  };

  const handleCopyCombined = () => {
    const combinedText = formatCombinedText();
    copy(combinedText, 'combined-insights');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold gradient-text">
          {SECTION_HEADERS.insights.main}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          記事の価値と読者へのメリット
        </p>
      </div>

      {/* One-liner Summary */}
      {insights.oneLiner && (
        <div className="relative bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6 border border-purple-200 dark:border-purple-800 animate-scale-in">
          <div>
            <h3 className="text-sm font-semibold text-purple-700 dark:text-purple-300 mb-2">
              {SECTION_HEADERS.insights.oneLiner}
            </h3>
            <p className="text-lg text-gray-800 dark:text-gray-200 font-medium italic leading-relaxed">
              "{insights.oneLiner}"
            </p>
          </div>
        </div>
      )}

      {/* Combined Copy Section Header */}
      {((insights.whatYouLearn && insights.whatYouLearn.length > 0) ||
        (insights.benefits && insights.benefits.length > 0) ||
        (insights.recommendedFor && insights.recommendedFor.length > 0)) && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              記事の魅力ポイント
            </h3>
            <button
              onClick={handleCopyCombined}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm font-medium shadow-md hover:shadow-lg ${
                isCopied('combined-insights')
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white'
              }`}
            >
              {isCopied('combined-insights') ? (
                <>
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {BUTTON_TEXT.copied}
                </>
              ) : (
                <>
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  全てをコピー
                </>
              )}
            </button>
          </div>

          {/* Text Area Display for Easy Editing and Copying */}
          <div className="bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900/20 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
            <h4 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">
              記事の魅力ポイント（テキスト形式）
            </h4>
            <textarea
              value={formatCombinedText()}
              readOnly
              className="w-full min-h-[300px] px-4 py-3 text-sm text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-y font-sans leading-relaxed transition-all"
              onClick={(e) => e.currentTarget.select()}
            />
          </div>
        </div>
      )}
    </div>
  );
}
