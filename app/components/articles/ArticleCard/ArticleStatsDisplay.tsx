/**
 * 記事統計表示コンポーネント（評価・コメント数）
 */

'use client';

import type { ArticleStats } from '@/types';

type ArticleStatsDisplayProps = {
  stats: ArticleStats | null;
};

export function ArticleStatsDisplay({ stats }: ArticleStatsDisplayProps) {
  if (!stats) return null;

  return (
    <>
      {/* Rating */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '4px',
        whiteSpace: 'nowrap',
        padding: '4px 8px',
        borderRadius: '6px',
        background: stats.totalRatings > 0 ? 'rgba(251, 191, 36, 0.1)' : 'transparent',
        border: stats.totalRatings > 0 ? '1px solid rgba(251, 191, 36, 0.3)' : 'none',
      }}>
        <svg style={{ width: '12px', height: '12px', fill: stats.totalRatings > 0 ? '#fbbf24' : '#e5e7eb' }} viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
        <span style={{ fontSize: '11px', fontWeight: '600', color: stats.totalRatings > 0 ? '#1e293b' : '#94a3b8' }}>
          {stats.averageRating > 0 ? stats.averageRating.toFixed(1) : '---'}
        </span>
        {stats.totalRatings > 0 && (
          <span style={{ fontSize: '10px', color: '#64748b' }}>
            ({stats.totalRatings})
          </span>
        )}
      </div>

      {/* Comments */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '4px',
        whiteSpace: 'nowrap',
        padding: '4px 8px',
        borderRadius: '6px',
        background: stats.totalComments > 0 ? 'rgba(168, 85, 247, 0.1)' : 'transparent',
        border: stats.totalComments > 0 ? '1px solid rgba(168, 85, 247, 0.3)' : 'none',
      }}>
        <svg style={{ width: '12px', height: '12px', color: stats.totalComments > 0 ? '#a855f7' : '#cbd5e1' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
        </svg>
        <span style={{ fontSize: '11px', fontWeight: stats.totalComments > 0 ? '600' : '400', color: stats.totalComments > 0 ? '#1e293b' : '#94a3b8' }}>
          {stats.totalComments}
        </span>
      </div>
    </>
  );
}
