/**
 * 記事タイトルコンポーネント
 */

'use client';

import { getGenreGradient } from '@/app/utils/genreColors';

type ArticleTitleProps = {
  title: string;
  noteLink: string;
  genre?: string;
  isMobile: boolean;
};

export function ArticleTitle({ title, noteLink, genre, isMobile }: ArticleTitleProps) {
  return (
    <a
      href={noteLink}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'block',
        fontSize: '13px',
        fontWeight: '600',
        color: '#1e293b',
        marginBottom: '2px',
        padding: '8px 12px',
        borderRadius: '8px',
        background: getGenreGradient(genre),
        whiteSpace: 'normal',
        wordBreak: 'break-word',
        textDecoration: 'none',
        cursor: 'pointer',
        lineHeight: '1.5',
        transition: 'all 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = '#a855f7';
        e.currentTarget.style.transform = 'translateY(-1px)';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = '#1e293b';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {title}
    </a>
  );
}
