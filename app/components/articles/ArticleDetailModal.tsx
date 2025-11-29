/**
 * 記事詳細モーダルコンポーネント
 * localStorage使用で評価・コメント機能を実装
 */

'use client';

import { useState, useEffect } from 'react';
import type { Article } from '@/types';
import { useIsMobile } from '@/app/hooks/useMediaQuery';
import { SimpleRatingInput } from './SimpleRatingInput';
import { SimpleCommentSection } from './SimpleCommentSection';
import * as storage from '@/lib/localStorage';

type ArticleDetailModalProps = {
  article: Article;
  isOpen: boolean;
  onClose: () => void;
};

export function ArticleDetailModal({ article, isOpen, onClose }: ArticleDetailModalProps) {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState<'info' | 'rating' | 'comments'>('info');
  const [stats, setStats] = useState<storage.ArticleStats | null>(null);
  const [comments, setComments] = useState<storage.Comment[]>([]);

  // モーダルが開いたときにデータをロード
  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen, article.id]);

  const loadData = () => {
    setStats(storage.getArticleStats(article.id));
    setComments(storage.getComments(article.id));
  };

  const handleRatingSubmit = (score: number, userName?: string) => {
    storage.addRating(article.id, score, userName);
    loadData(); // 統計を再読み込み
  };

  const handleCommentSubmit = (userName: string, content: string) => {
    storage.addComment(article.id, userName, content);
    loadData(); // コメントを再読み込み
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: isMobile ? '0' : '20px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'white',
          borderRadius: isMobile ? '0' : '16px',
          width: '100%',
          maxWidth: '600px',
          maxHeight: isMobile ? '100%' : '90vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ヘッダー */}
        <div style={{
          padding: '20px',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'start',
        }}>
          <div style={{ flex: 1, paddingRight: '16px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b', marginBottom: '8px', lineHeight: '1.4' }}>
              {article.title}
            </h2>
            {stats && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', color: '#64748b', marginTop: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ color: '#fbbf24' }}>★</span>
                  {stats.averageRating > 0 ? stats.averageRating.toFixed(1) : '未評価'}
                  {stats.totalRatings > 0 && <span>({stats.totalRatings})</span>}
                </div>
                <div>💬 {stats.totalComments}件</div>
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              color: '#64748b',
            }}
          >
            <svg style={{ width: '24px', height: '24px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* タブ */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid #e2e8f0',
          background: '#f8fafc',
        }}>
          <button
            onClick={() => setActiveTab('info')}
            style={{
              flex: 1,
              padding: '12px',
              background: activeTab === 'info' ? 'white' : 'transparent',
              border: 'none',
              borderBottom: activeTab === 'info' ? '2px solid #a855f7' : '2px solid transparent',
              fontSize: '14px',
              fontWeight: '600',
              color: activeTab === 'info' ? '#a855f7' : '#64748b',
              cursor: 'pointer',
            }}
          >
            詳細情報
          </button>
          <button
            onClick={() => setActiveTab('rating')}
            style={{
              flex: 1,
              padding: '12px',
              background: activeTab === 'rating' ? 'white' : 'transparent',
              border: 'none',
              borderBottom: activeTab === 'rating' ? '2px solid #a855f7' : '2px solid transparent',
              fontSize: '14px',
              fontWeight: '600',
              color: activeTab === 'rating' ? '#a855f7' : '#64748b',
              cursor: 'pointer',
            }}
          >
            評価する
          </button>
          <button
            onClick={() => setActiveTab('comments')}
            style={{
              flex: 1,
              padding: '12px',
              background: activeTab === 'comments' ? 'white' : 'transparent',
              border: 'none',
              borderBottom: activeTab === 'comments' ? '2px solid #a855f7' : '2px solid transparent',
              fontSize: '14px',
              fontWeight: '600',
              color: activeTab === 'comments' ? '#a855f7' : '#64748b',
              cursor: 'pointer',
            }}
          >
            コメント ({comments.length})
          </button>
        </div>

        {/* コンテンツ */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px',
        }}>
          {activeTab === 'info' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* ジャンル・対象読者 */}
              <div>
                <h3 style={{ fontSize: '13px', fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>
                  カテゴリー
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  <span style={{
                    padding: '4px 12px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    borderRadius: '16px',
                    fontSize: '12px',
                    fontWeight: '600',
                  }}>
                    {article.genre}
                  </span>
                  <span style={{
                    padding: '4px 12px',
                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    color: 'white',
                    borderRadius: '16px',
                    fontSize: '12px',
                    fontWeight: '600',
                  }}>
                    {article.targetAudience}
                  </span>
                </div>
              </div>

              {/* メリット */}
              <div>
                <h3 style={{ fontSize: '13px', fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>
                  この記事で得られること
                </h3>
                <p style={{ fontSize: '14px', color: '#1e293b', lineHeight: '1.6' }}>
                  {article.benefit}
                </p>
              </div>

              {/* おすすめ度 */}
              <div>
                <h3 style={{ fontSize: '13px', fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>
                  おすすめ度
                </h3>
                <div style={{ fontSize: '20px', color: '#fbbf24' }}>
                  {article.recommendationLevel}
                </div>
              </div>

              {/* 記事情報 */}
              <div>
                <h3 style={{ fontSize: '13px', fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>
                  記事情報
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px', color: '#1e293b' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>文字数</span>
                    <span style={{ fontWeight: '600' }}>{article.characterCount.toLocaleString()}字</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>推定読了時間</span>
                    <span style={{ fontWeight: '600' }}>約{article.estimatedReadTime}分</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>公開日</span>
                    <span style={{ fontWeight: '600' }}>
                      {new Date(article.publishedAt).toLocaleDateString('ja-JP')}
                    </span>
                  </div>
                </div>
              </div>

              {/* メンバーシップ */}
              {article.memberships && article.memberships.length > 0 && (
                <div>
                  <h3 style={{ fontSize: '13px', fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>
                    メンバーシップ
                  </h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {article.memberships.map((membership) => (
                      <span
                        key={membership.id}
                        style={{
                          padding: '4px 12px',
                          background: membership.color || '#a855f7',
                          color: 'white',
                          borderRadius: '16px',
                          fontSize: '12px',
                          fontWeight: '600',
                        }}
                      >
                        {membership.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'rating' && (
            <SimpleRatingInput onSubmit={handleRatingSubmit} />
          )}

          {activeTab === 'comments' && (
            <SimpleCommentSection comments={comments} onSubmit={handleCommentSubmit} />
          )}
        </div>

        {/* フッター - note記事へのリンク */}
        <div style={{
          padding: '16px 20px',
          borderTop: '1px solid #e2e8f0',
          background: '#f8fafc',
        }}>
          <a
            href={article.noteLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '12px 16px',
              background: 'linear-gradient(to right, #41c9b4, #3a9d8f)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(65, 201, 180, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            noteで記事を読む
            <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
