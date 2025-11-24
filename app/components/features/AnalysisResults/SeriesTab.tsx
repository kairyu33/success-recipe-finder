/**
 * Series Tab Component - Premium Design
 *
 * @description Enhanced series article ideas with glassmorphism and gradient effects
 */

'use client';

import { CopyButton } from '@/app/components/ui/CopyButton/CopyButton';
import { TabContentProps } from './AnalysisResults.types';

export function SeriesTab({ data }: Pick<TabContentProps, 'data'>) {
  const series = data.seriesIdeas;

  if (!series || series.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          シリーズ記事の提案が生成されませんでした
        </p>
      </div>
    );
  }

  const icons = ['📚', '🎯', '🚀'];
  const colorMap = [
    { gradient: 'from-blue-500 to-cyan-600', bg: 'from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20', border: 'border-blue-200 dark:border-blue-800', shadow: 'shadow-blue-500/30' },
    { gradient: 'from-purple-500 to-pink-600', bg: 'from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20', border: 'border-purple-200 dark:border-purple-800', shadow: 'shadow-purple-500/30' },
    { gradient: 'from-orange-500 to-amber-600', bg: 'from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20', border: 'border-orange-200 dark:border-orange-800', shadow: 'shadow-orange-500/30' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold gradient-text">
          シリーズ記事提案
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          この記事を起点に展開できる関連コンテンツのアイデア
        </p>
      </div>

      {/* Series Ideas Cards */}
      <div className="space-y-6 stagger-children">
        {series.map((idea: any, index: number) => {
          const colors = colorMap[index % 3];
          return (
            <div key={index} className="group relative">
              {/* Background glow effect */}
              <div className={`absolute -inset-0.5 bg-gradient-to-r ${colors.gradient} rounded-2xl opacity-0 group-hover:opacity-20 blur transition duration-300`} />

              {/* Card content */}
              <div className={`relative bg-gradient-to-br ${colors.bg} rounded-2xl p-6 border ${colors.border} hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300`}>
                {/* Header */}
                <div className="flex items-start gap-4 mb-4">
                  <span className={`flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${colors.gradient} text-white text-2xl shadow-lg ${colors.shadow} flex-shrink-0`}>
                    {icons[index % 3]}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white/50 dark:bg-black/20 text-gray-700 dark:text-gray-300">
                            シリーズ {index + 1}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
                          {idea.title}
                        </h3>
                      </div>
                      <CopyButton text={idea.title} itemId={`series-${index}`} />
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="bg-white/50 dark:bg-black/20 rounded-lg p-4 mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    記事の内容
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                    {idea.description}
                  </p>
                </div>

                {/* Target Audience */}
                <div className="flex items-center gap-3 bg-white/30 dark:bg-black/10 rounded-lg p-3">
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">ターゲット読者</p>
                    <p className="text-sm text-gray-900 dark:text-white font-semibold">{idea.targetAudience}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Benefits */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 border border-green-200 dark:border-green-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          シリーズ記事のメリット
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">• 読者のリピート率向上</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 ml-3">続きが気になる読者が定期的に訪問</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">• 専門性のアピール</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 ml-3">深い知識と経験を段階的に示せる</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">• 内部リンク強化</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 ml-3">関連記事同士をリンクしSEO効果向上</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">• コンテンツ資産の蓄積</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 ml-3">まとめ記事や電子書籍化も可能</p>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          シリーズ展開のコツ
        </h3>
        <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <p>• <strong>定期更新をアナウンス：</strong>「毎週金曜日更新」など、読者が次を楽しみにできる</p>
          <p>• <strong>目次ページを作成：</strong>シリーズ全体の構成を示し、どこからでも読みやすく</p>
          <p>• <strong>最後にCTA：</strong>記事の最後に「次回は〇〇について解説」と予告を入れる</p>
        </div>
      </div>
    </div>
  );
}
