/**
 * 記事カードコンポーネント - レスポンシブ対応
 */

'use client';

import type { Article } from '@/types';
import { formatNumber } from '@/lib/utils';
import { useIsMobile } from '@/app/hooks/useMediaQuery';

type ArticleCardProps = {
  article: Article;
};

export function ArticleCard({ article }: ArticleCardProps) {
  const isMobile = useIsMobile();

  return (
    <a
      href={article.noteLink}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: isMobile ? 'flex' : 'grid',
        flexDirection: isMobile ? 'column' : undefined,
        gridTemplateColumns: isMobile ? undefined : '1fr auto auto auto',
        alignItems: isMobile ? 'flex-start' : 'center',
        gap: isMobile ? '12px' : '16px',
        padding: isMobile ? '16px' : '12px 16px',
        background: 'rgba(255, 255, 255, 0.9)',
        borderRadius: '10px',
        border: '1px solid #e2e8f0',
        textDecoration: 'none',
        transition: 'all 0.2s',
        cursor: 'pointer'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(255, 255, 255, 1)';
        e.currentTarget.style.borderColor = '#a855f7';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(168, 85, 247, 0.1)';
        e.currentTarget.style.transform = 'translateY(-1px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)';
        e.currentTarget.style.borderColor = '#e2e8f0';
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Title and metadata */}
      <div style={{ minWidth: 0, width: '100%' }}>
        <div style={{
          fontSize: '14px',
          fontWeight: '600',
          color: '#1e293b',
          marginBottom: '6px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: isMobile ? 'normal' : 'nowrap',
          display: isMobile ? '-webkit-box' : 'block',
          WebkitLineClamp: isMobile ? 2 : undefined,
          WebkitBoxOrient: isMobile ? 'vertical' : undefined
        }}>
          {article.title}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {article.genre && (
            <span style={{
              fontSize: '11px',
              color: '#64748b',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <span style={{
                width: '4px',
                height: '4px',
                borderRadius: '50%',
                background: '#a855f7',
                display: 'inline-block'
              }} />
              {article.genre}
            </span>
          )}
          {article.targetAudience && (
            <span style={{
              fontSize: '11px',
              color: '#64748b',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <span style={{
                width: '4px',
                height: '4px',
                borderRadius: '50%',
                background: '#ec4899',
                display: 'inline-block'
              }} />
              {article.targetAudience}
            </span>
          )}
          {article.recommendationLevel && (
            <span style={{
              fontSize: '11px',
              padding: '2px 8px',
              borderRadius: '10px',
              background: 'linear-gradient(to right, #fef3c7, #fde68a)',
              color: '#92400e',
              fontWeight: '600'
            }}>
              {article.recommendationLevel}
            </span>
          )}
        </div>
      </div>

      {/* Membership tags */}
      {article.memberships.length > 0 && (
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', width: isMobile ? '100%' : 'auto' }}>
          {article.memberships.map((m) => (
            <span
              key={m.membership.id}
              style={{
                fontSize: '11px',
                padding: '3px 8px',
                borderRadius: '6px',
                color: 'white',
                fontWeight: '600',
                background: m.membership.color || '#41c9b4',
                whiteSpace: 'nowrap'
              }}
            >
              {m.membership.name}
            </span>
          ))}
        </div>
      )}

      {/* Stats and Arrow */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: isMobile ? '100%' : 'auto',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', whiteSpace: 'nowrap' }}>
          <span style={{ fontSize: '12px', color: '#64748b' }}>
            {formatNumber(article.characterCount)}文字
          </span>
          <span style={{ fontSize: '12px', color: '#64748b' }}>
            約{article.estimatedReadTime}分
          </span>
        </div>

        {/* Arrow */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg
            style={{ width: '16px', height: '16px', color: '#a855f7' }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </div>
      </div>
    </a>
  );
}
