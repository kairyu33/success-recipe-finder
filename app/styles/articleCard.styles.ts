/**
 * ArticleCard共通スタイル定義
 */

import { CSSProperties } from 'react';

export const articleCardStyles = {
  card: (isMobile: boolean): CSSProperties => ({
    display: isMobile ? 'flex' : 'grid',
    flexDirection: isMobile ? 'column' : undefined,
    gridTemplateColumns: isMobile ? undefined : '75% 1fr auto',
    alignItems: isMobile ? 'flex-start' : 'center',
    gap: '10px',
    padding: isMobile ? '14px' : '10px 14px',
    background: 'rgba(255, 255, 255, 0.9)',
    borderRadius: '10px',
    border: '1px solid #e2e8f0',
    transition: 'all 0.2s',
    overflow: 'hidden',
    width: '100%',
    maxWidth: '100%',
    boxSizing: 'border-box',
  }),

  titleSection: (isMobile: boolean): CSSProperties => ({
    minWidth: 0,
    overflow: 'hidden',
  }),

  middleSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    flexWrap: 'wrap',
    minWidth: 0,
    overflow: 'hidden',
  } as CSSProperties,

  rightSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    justifyContent: 'flex-end',
    whiteSpace: 'nowrap',
  } as CSSProperties,

  pcStats: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '10px',
    color: '#64748b',
  } as CSSProperties,

  detailButton: (isMobile: boolean): CSSProperties => ({
    padding: isMobile ? '6px 14px' : '5px 10px',
    background: 'linear-gradient(to right, #a855f7, #ec4899)',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: '600',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: 'all 0.2s',
    flexShrink: 0,
  }),
};

export const badgeStyles = {
  base: (hasValue: boolean, activeColor: string): CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
    whiteSpace: 'nowrap',
    padding: '4px 8px',
    borderRadius: '6px',
    background: hasValue ? `rgba(${activeColor}, 0.1)` : 'transparent',
    border: hasValue ? `1px solid rgba(${activeColor}, 0.3)` : 'none',
  }),

  rating: {
    activeColor: '251, 191, 36', // #fbbf24
    icon: {
      width: '14px',
      height: '14px',
    },
  },

  comment: {
    activeColor: '168, 85, 247', // #a855f7
    icon: {
      width: '14px',
      height: '14px',
    },
  },
};

export const metadataStyles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap',
  } as CSSProperties,

  badge: (color: string): CSSProperties => ({
    fontSize: '11px',
    color: '#64748b',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  }),

  dot: (color: string): CSSProperties => ({
    width: '4px',
    height: '4px',
    borderRadius: '50%',
    background: color,
    display: 'inline-block',
  }),

  recommendationLevel: {
    fontSize: '11px',
    padding: '2px 8px',
    borderRadius: '10px',
    background: 'linear-gradient(to right, #fef3c7, #fde68a)',
    color: '#92400e',
    fontWeight: '600',
  } as CSSProperties,
};
