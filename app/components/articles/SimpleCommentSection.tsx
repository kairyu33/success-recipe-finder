/**
 * シンプルなコメントセクションコンポーネント
 */

'use client';

import { useState } from 'react';
import type { Comment } from '@/lib/localStorage';

interface SimpleCommentSectionProps {
  comments: Comment[];
  onSubmit: (userName: string, content: string) => void;
}

export function SimpleCommentSection({ comments, onSubmit }: SimpleCommentSectionProps) {
  const [userName, setUserName] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      alert('コメントを入力してください');
      return;
    }

    setIsSubmitting(true);
    try {
      onSubmit(userName || '匿名', content);
      setUserName('');
      setContent('');
    } catch (error) {
      alert('コメントの送信に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* コメント入力フォーム */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#1e293b', marginBottom: '8px' }}>
            お名前（任意）
          </label>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="匿名"
            style={{
              width: '100%',
              padding: '10px 14px',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#a855f7';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e2e8f0';
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#1e293b', marginBottom: '8px' }}>
            コメント
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="この記事についてのコメントを入力してください..."
            rows={4}
            style={{
              width: '100%',
              padding: '10px 14px',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none',
              resize: 'vertical',
              fontFamily: 'inherit',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#a855f7';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e2e8f0';
            }}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !content.trim()}
          style={{
            padding: '12px 24px',
            background: !content.trim() ? '#cbd5e1' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '15px',
            fontWeight: '600',
            cursor: !content.trim() ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            if (content.trim() && !isSubmitting) {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          {isSubmitting ? '送信中...' : 'コメントを投稿'}
        </button>
      </form>

      {/* コメント一覧 */}
      <div style={{ marginTop: '8px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b', marginBottom: '12px' }}>
          コメント一覧 ({comments.length})
        </h3>

        {comments.length === 0 ? (
          <p style={{ fontSize: '14px', color: '#64748b', textAlign: 'center', padding: '20px' }}>
            まだコメントがありません
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {comments.map((comment) => (
              <div
                key={comment.id}
                style={{
                  padding: '12px 16px',
                  background: '#f8fafc',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>
                    {comment.userName}
                  </span>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>
                    {new Date(comment.createdAt).toLocaleDateString('ja-JP', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <p style={{ fontSize: '14px', color: '#1e293b', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                  {comment.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
