/**
 * 記事タイトルコンポーネント
 */

'use client';

type ArticleTitleProps = {
  title: string;
  noteLink: string;
  isMobile: boolean;
};

export function ArticleTitle({ title, noteLink, isMobile }: ArticleTitleProps) {
  return (
    <a
      href={noteLink}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        fontSize: '13px',
        fontWeight: '600',
        color: '#1e293b',
        marginBottom: '6px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: isMobile ? 'normal' : 'nowrap',
        display: isMobile ? '-webkit-box' : 'block',
        WebkitLineClamp: isMobile ? 2 : undefined,
        WebkitBoxOrient: isMobile ? 'vertical' : undefined,
        textDecoration: 'none',
        cursor: 'pointer',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = '#a855f7';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = '#1e293b';
      }}
    >
      {title}
    </a>
  );
}
