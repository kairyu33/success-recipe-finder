/**
 * 評価一覧コンポーネント（管理画面用）
 */

'use client';

import { useState } from 'react';

type RatingWithArticle = {
  id: string;
  articleId: string;
  userId: string | null;
  userName: string | null;
  score: number;
  createdAt: string;
  updatedAt: string;
  article: {
    id: string;
    title: string;
    noteLink: string;
  };
};

type RatingListProps = {
  ratings: RatingWithArticle[];
  onDelete: (id: string) => Promise<void>;
};

export function RatingList({ ratings, onDelete }: RatingListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('この評価を削除してもよろしいですか？')) return;

    setDeletingId(id);
    try {
      await onDelete(id);
    } catch (error) {
      console.error('削除エラー:', error);
      alert('削除に失敗しました');
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ja-JP');
  };

  const renderStars = (score: number) => {
    return (
      <div style={{ display: 'flex', gap: '2px' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            style={{
              width: '16px',
              height: '16px',
              fill: star <= score ? '#fbbf24' : '#e5e7eb',
            }}
            viewBox="0 0 24 24"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        ))}
      </div>
    );
  };

  if (ratings.length === 0) {
    return (
      <div style={{
        padding: '40px',
        textAlign: 'center',
        color: '#64748b',
        background: '#f8fafc',
        borderRadius: '8px',
      }}>
        まだ評価はありません
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {ratings.map((rating) => (
        <div
          key={rating.id}
          style={{
            padding: '16px',
            background: 'white',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'start',
            gap: '16px',
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ marginBottom: '8px' }}>
              <a
                href={rating.article.noteLink}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#1e293b',
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#a855f7';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#1e293b';
                }}
              >
                {rating.article.title}
              </a>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              {renderStars(rating.score)}
              <span style={{ fontSize: '13px', color: '#64748b' }}>
                {rating.score}つ星
              </span>
            </div>
            <div style={{ fontSize: '12px', color: '#64748b', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <span>投稿者: {rating.userName || '匿名'}</span>
              <span>投稿日時: {formatDate(rating.createdAt)}</span>
            </div>
          </div>
          <button
            onClick={() => handleDelete(rating.id)}
            disabled={deletingId === rating.id}
            style={{
              padding: '6px 12px',
              background: deletingId === rating.id ? '#e5e7eb' : '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: deletingId === rating.id ? 'not-allowed' : 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              if (deletingId !== rating.id) {
                e.currentTarget.style.background = '#dc2626';
              }
            }}
            onMouseLeave={(e) => {
              if (deletingId !== rating.id) {
                e.currentTarget.style.background = '#ef4444';
              }
            }}
          >
            {deletingId === rating.id ? '削除中...' : '削除'}
          </button>
        </div>
      ))}
    </div>
  );
}
