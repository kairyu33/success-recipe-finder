/**
 * シンプルな評価入力コンポーネント
 */

'use client';

import { useState } from 'react';

interface SimpleRatingInputProps {
  onSubmit: (score: number, userName?: string) => void;
}

export function SimpleRatingInput({ onSubmit }: SimpleRatingInputProps) {
  const [score, setScore] = useState(0);
  const [userName, setUserName] = useState('');
  const [hoveredScore, setHoveredScore] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (score === 0) {
      alert('評価を選択してください');
      return;
    }

    setIsSubmitting(true);
    try {
      onSubmit(score, userName || undefined);
      setSubmitted(true);
      setTimeout(() => {
        setScore(0);
        setUserName('');
        setSubmitted(false);
      }, 2000);
    } catch (error) {
      alert('評価の送信に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {submitted ? (
        <div style={{
          padding: '20px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderRadius: '12px',
          textAlign: 'center',
          fontSize: '16px',
          fontWeight: '600',
        }}>
          ✓ 評価を送信しました！
        </div>
      ) : (
        <>
          {/* 星評価 */}
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#1e293b', marginBottom: '12px' }}>
              この記事を評価してください
            </label>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setScore(star)}
                  onMouseEnter={() => setHoveredScore(star)}
                  onMouseLeave={() => setHoveredScore(0)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '36px',
                    padding: '4px',
                    transition: 'transform 0.2s',
                  }}
                  onMouseDown={(e) => {
                    e.currentTarget.style.transform = 'scale(0.9)';
                  }}
                  onMouseUp={(e) => {
                    e.currentTarget.style.transform = 'scale(1.1)';
                  }}
                >
                  <span style={{
                    color: (hoveredScore >= star || score >= star) ? '#fbbf24' : '#e2e8f0',
                  }}>
                    ★
                  </span>
                </button>
              ))}
            </div>
            {score > 0 && (
              <p style={{ textAlign: 'center', marginTop: '8px', fontSize: '14px', color: '#64748b' }}>
                {score}つ星を選択中
              </p>
            )}
          </div>

          {/* 名前入力（任意） */}
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
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#a855f7';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e2e8f0';
              }}
            />
          </div>

          {/* 送信ボタン */}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || score === 0}
            style={{
              padding: '12px 24px',
              background: score === 0 ? '#cbd5e1' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: score === 0 ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              if (score > 0 && !isSubmitting) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {isSubmitting ? '送信中...' : '評価を送信'}
          </button>
        </>
      )}
    </div>
  );
}
