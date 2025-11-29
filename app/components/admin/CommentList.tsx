/**
 * コメント一覧コンポーネント（管理画面用）
 */

'use client';

import { useState } from 'react';

type CommentWithArticle = {
  id: string;
  articleId: string;
  userId: string | null;
  userName: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  article: {
    id: string;
    title: string;
    noteLink: string;
  };
};

type CommentListProps = {
  comments: CommentWithArticle[];
  onDelete: (id: string) => Promise<void>;
};

export function CommentList({ comments, onDelete }: CommentListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('このコメントを削除してもよろしいですか？')) return;

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

  if (comments.length === 0) {
    return (
      <div style={{
        padding: '40px',
        textAlign: 'center',
        color: '#64748b',
        background: '#f8fafc',
        borderRadius: '8px',
      }}>
        まだコメントはありません
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {comments.map((comment) => (
        <div
          key={comment.id}
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
                href={comment.article.noteLink}
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
                {comment.article.title}
              </a>
            </div>
            <div style={{
              padding: '12px',
              background: '#f8fafc',
              borderRadius: '6px',
              marginBottom: '8px',
            }}>
              <div style={{ fontSize: '13px', color: '#1e293b', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                {comment.content}
              </div>
            </div>
            <div style={{ fontSize: '12px', color: '#64748b', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <span>投稿者: {comment.userName}</span>
              <span>投稿日時: {formatDate(comment.createdAt)}</span>
            </div>
          </div>
          <button
            onClick={() => handleDelete(comment.id)}
            disabled={deletingId === comment.id}
            style={{
              padding: '6px 12px',
              background: deletingId === comment.id ? '#e5e7eb' : '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: deletingId === comment.id ? 'not-allowed' : 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              if (deletingId !== comment.id) {
                e.currentTarget.style.background = '#dc2626';
              }
            }}
            onMouseLeave={(e) => {
              if (deletingId !== comment.id) {
                e.currentTarget.style.background = '#ef4444';
              }
            }}
          >
            {deletingId === comment.id ? '削除中...' : '削除'}
          </button>
        </div>
      ))}
    </div>
  );
}
