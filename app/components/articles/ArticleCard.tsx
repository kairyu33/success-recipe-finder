/**
 * 記事カードコンポーネント - レスポンシブ対応（リファクタリング版）
 */

'use client';

import { useState, useEffect } from 'react';
import type { Article } from '@/types';
import { formatNumber } from '@/lib/utils';
import { useIsMobile } from '@/app/hooks/useMediaQuery';
import { ArticleDetailModal } from './ArticleDetailModal';
import { ArticleTitle } from './ArticleCard/ArticleTitle';
import { ArticleMetadata } from './ArticleCard/ArticleMetadata';
import { MembershipTags } from './ArticleCard/MembershipTags';
import { articleCardStyles } from '@/app/styles/articleCard.styles';
import * as storage from '@/lib/localStorage';

type ArticleCardProps = {
  article: Article;
};

export function ArticleCard({ article }: ArticleCardProps) {
  const isMobile = useIsMobile();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stats, setStats] = useState<storage.ArticleStats | null>(null);

  // 統計情報を読み込む
  const loadStats = () => {
    setStats(storage.getArticleStats(article.id));
  };

  // マウント時と記事IDが変わったときに統計を読み込む
  useEffect(() => {
    loadStats();
  }, [article.id]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // モーダルを閉じたときに統計を再読み込み（評価・コメントが追加されている可能性があるため）
    loadStats();
  };

  return (
    <>
      <div style={articleCardStyles.card(isMobile)}>
        {/* Title and metadata */}
        <div style={articleCardStyles.titleSection(isMobile)}>
          <ArticleTitle
            title={article.title}
            noteLink={article.noteLink}
            isMobile={isMobile}
          />
          <ArticleMetadata
            genre={article.genre}
            targetAudience={article.targetAudience}
            recommendationLevel={article.recommendationLevel}
            characterCount={article.characterCount}
            estimatedReadTime={article.estimatedReadTime}
            isMobile={isMobile}
          />
        </div>

        {/* Middle section: Membership tags */}
        <div style={articleCardStyles.middleSection}>
          <MembershipTags memberships={article.memberships} />
        </div>

        {/* Right section: Stats and Detail button */}
        <div style={articleCardStyles.rightSection}>
          {/* Stats */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: isMobile ? '4px' : '8px',
            fontSize: isMobile ? '11px' : '13px',
            color: '#64748b',
          }}>
            {/* 文字数・読了時間 - PC only */}
            {!isMobile && (
              <div style={{ display: 'flex', gap: '12px' }}>
                <span>{formatNumber(article.characterCount)}字</span>
                <span>約{article.estimatedReadTime}分</span>
              </div>
            )}

            {/* 評価・コメント統計 */}
            {stats && (
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ color: '#fbbf24' }}>★</span>
                  <span>
                    {stats.averageRating > 0 ? stats.averageRating.toFixed(1) : '未評価'}
                  </span>
                  {stats.totalRatings > 0 && (
                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                      ({stats.totalRatings})
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>💬</span>
                  <span>{stats.totalComments}</span>
                </div>
              </div>
            )}
          </div>

          {/* Detail button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsModalOpen(true);
            }}
            style={articleCardStyles.detailButton(isMobile)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(168, 85, 247, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            詳細
          </button>
        </div>
      </div>

      <ArticleDetailModal
        article={article}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
}
