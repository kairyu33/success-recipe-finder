/**
 * 最近追加された記事のお知らせコンポーネント
 */

'use client';

import type { Article } from '@/types';
import { formatNumber } from '@/lib/utils';

type RecentArticlesNoticeProps = {
  articles: Article[];
};

export function RecentArticlesNotice({ articles }: RecentArticlesNoticeProps) {
  // 登録日順（新しい順）にソートして最新10件を取得
  const recentArticles = [...articles]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10);

  if (recentArticles.length === 0) {
    return null;
  }

  // 日付をフォーマット
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}/${day}`;
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(249, 250, 251, 0.9), rgba(243, 244, 246, 0.9))',
      backdropFilter: 'blur(12px)',
      border: '1px solid #e5e7eb',
      borderRadius: '12px',
      padding: '16px',
      marginBottom: '20px',
    }}>
      {/* ヘッダー */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '12px',
      }}>
        <svg style={{ width: '20px', height: '20px', color: '#a855f7' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 style={{
          fontSize: '15px',
          fontWeight: '700',
          color: '#1e293b',
          margin: 0,
        }}>
          最近追加された記事
        </h3>
        <span style={{
          fontSize: '11px',
          padding: '2px 8px',
          borderRadius: '12px',
          background: 'linear-gradient(to right, #f3e8ff, #fce7f3)',
          color: '#7e22ce',
          fontWeight: '700',
        }}>
          {recentArticles.length}件
        </span>
      </div>

      {/* 記事リスト */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}>
        {recentArticles.map((article, index) => (
          <div
            key={article.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 12px',
              background: 'rgba(255, 255, 255, 0.7)',
              borderRadius: '8px',
              border: '1px solid #f3f4f6',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.95)';
              e.currentTarget.style.transform = 'translateX(4px)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.7)';
              e.currentTarget.style.transform = 'translateX(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {/* 順番 */}
            <div style={{
              minWidth: '24px',
              height: '24px',
              borderRadius: '6px',
              background: index === 0
                ? 'linear-gradient(135deg, #fbbf24, #f59e0b)'
                : 'linear-gradient(135deg, #e5e7eb, #d1d5db)',
              color: index === 0 ? 'white' : '#6b7280',
              fontSize: '11px',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              {index + 1}
            </div>

            {/* 登録日 */}
            <div style={{
              fontSize: '11px',
              color: '#6b7280',
              fontWeight: '600',
              minWidth: '35px',
              flexShrink: 0,
            }}>
              {formatDate(article.createdAt)}
            </div>

            {/* タイトル */}
            <a
              href={article.noteLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                flex: 1,
                fontSize: '13px',
                fontWeight: '600',
                color: '#1e293b',
                textDecoration: 'none',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#a855f7';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#1e293b';
              }}
            >
              {article.title}
            </a>

            {/* おすすめ度 */}
            {article.recommendationLevel && (
              <div style={{
                fontSize: '10px',
                padding: '3px 8px',
                borderRadius: '8px',
                background: 'linear-gradient(to right, #fef3c7, #fde68a)',
                color: '#92400e',
                fontWeight: '600',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}>
                {article.recommendationLevel}
              </div>
            )}

            {/* 文字数 */}
            <div style={{
              fontSize: '11px',
              color: '#6b7280',
              minWidth: '50px',
              textAlign: 'right',
              flexShrink: 0,
            }}>
              {formatNumber(article.characterCount)}字
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
