/**
 * 記事検索ページ（レスポンシブ対応 - PC/モバイル）
 */

'use client';

import { useState, useEffect } from 'react';
import { fetchArticles, fetchAdminMemberships } from '@/lib/api';
import { filterArticlesByStats } from '@/lib/articleFilters';
import {
  ArticleCard,
  FilterSection,
  MobileFilterDrawer,
} from '@/app/components/articles';
import type { Article, Membership } from '@/types';
import { useIsMobile } from '@/app/hooks/useMediaQuery';

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [allArticles, setAllArticles] = useState<Article[]>([]);
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedTargetAudiences, setSelectedTargetAudiences] = useState<string[]>([]);
  const [selectedRecommendationLevels, setSelectedRecommendationLevels] = useState<string[]>([]);
  const [selectedMembershipIds, setSelectedMembershipIds] = useState<string[]>([]);
  const [ratingFilter, setRatingFilter] = useState('all'); // 'all' | 'has' | 'none'
  const [commentFilter, setCommentFilter] = useState('all'); // 'all' | 'has' | 'none'
  const [sortValue, setSortValue] = useState('publishedAt-desc');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const isMobile = useIsMobile();

  // 初期データ取得
  useEffect(() => {
    loadAllArticles();
    loadMemberships();
  }, []);

  // フィルター・ソート変更時に記事を再取得
  useEffect(() => {
    loadArticles();
  }, [selectedGenres, selectedTargetAudiences, selectedRecommendationLevels, selectedMembershipIds, ratingFilter, commentFilter, search, sortValue]);

  // フィルター選択肢用に全記事を取得
  const loadAllArticles = async () => {
    try {
      const data = await fetchArticles({ limit: 1000 });
      setAllArticles(data);
    } catch (error) {
      console.error('記事取得エラー:', error);
    }
  };

  // メンバーシップを取得
  const loadMemberships = async () => {
    try {
      const data = await fetchAdminMemberships();
      setMemberships(data);
    } catch (error) {
      console.error('メンバーシップ取得エラー:', error);
    }
  };

  const loadArticles = async () => {
    setLoading(true);
    try {
      const [sortBy, sortOrder] = sortValue.split('-') as [string, 'asc' | 'desc'];

      const data = await fetchArticles({
        search,
        genres: selectedGenres,
        targetAudiences: selectedTargetAudiences,
        recommendationLevels: selectedRecommendationLevels,
        membershipIds: selectedMembershipIds,
        sortBy,
        sortOrder,
        limit: 1000,
      });

      // 評価・コメント数でフィルタリング（クライアントサイド）
      const filteredData = await filterArticlesByStats(data, ratingFilter, commentFilter);
      setArticles(filteredData);
    } catch (error) {
      console.error('記事取得エラー:', error);
    } finally {
      setLoading(false);
    }
  };

  // フィルター選択肢を動的に生成
  const genreOptions = Array.from(
    new Set(allArticles.map((a) => a.genre).filter(Boolean))
  ).map((genre) => ({ value: genre, label: genre }));

  const targetAudienceOptions = Array.from(
    new Set(allArticles.map((a) => a.targetAudience).filter(Boolean))
  ).map((audience) => ({ value: audience, label: audience }));

  const recommendationLevelOptions = Array.from(
    new Set(allArticles.map((a) => a.recommendationLevel).filter(Boolean))
  ).map((level) => ({ value: level, label: level }))
    .sort((a, b) => b.value.localeCompare(a.value));

  const membershipOptions = memberships
    .filter((m) => m.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((membership) => ({ value: membership.id, label: membership.name }));

  const hasActiveFilters =
    selectedGenres.length > 0 ||
    selectedTargetAudiences.length > 0 ||
    selectedRecommendationLevels.length > 0 ||
    selectedMembershipIds.length > 0 ||
    ratingFilter !== 'all' ||
    commentFilter !== 'all' ||
    search.length > 0;

  const clearAllFilters = () => {
    setSearch('');
    setSelectedGenres([]);
    setSelectedTargetAudiences([]);
    setSelectedRecommendationLevels([]);
    setSelectedMembershipIds([]);
    setRatingFilter('all');
    setCommentFilter('all');
  };

  const filterProps = {
    search,
    onSearchChange: setSearch,
    selectedGenres,
    onGenresChange: setSelectedGenres,
    selectedTargetAudiences,
    onTargetAudiencesChange: setSelectedTargetAudiences,
    selectedRecommendationLevels,
    onRecommendationLevelsChange: setSelectedRecommendationLevels,
    selectedMembershipIds,
    onMembershipIdsChange: setSelectedMembershipIds,
    ratingFilter,
    onRatingFilterChange: setRatingFilter,
    commentFilter,
    onCommentFilterChange: setCommentFilter,
    sortValue,
    onSortChange: setSortValue,
    genreOptions,
    targetAudienceOptions,
    recommendationLevelOptions,
    membershipOptions,
    hasActiveFilters,
    onClearAll: clearAllFilters,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50/30 via-pink-50/20 to-blue-50/30">
      <div className="relative max-w-7xl mx-auto px-4 py-6">
        {/* Hero Header with Image */}
        <div className="mb-6">
          <div style={{
            width: '100%',
            height: isMobile ? '150px' : '200px',
            borderRadius: '12px',
            overflow: 'hidden',
            marginBottom: '16px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
          }}>
            <img
              src="/MT/top.jpg"
              alt="ヘッダー画像"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-6">
            <div className="text-center">
              <div className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {allArticles.length}
              </div>
              <div className="text-xs text-slate-500 font-medium">記事</div>
            </div>
            {hasActiveFilters && (
              <>
                <div className="w-px h-6 bg-slate-300" />
                <div className="text-center">
                  <div className="text-xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                    {articles.length}
                  </div>
                  <div className="text-xs text-slate-500 font-medium">検索結果</div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* モバイル: フィルターボタン */}
        {isMobile && (
          <div style={{ marginBottom: '16px' }}>
            <button
              onClick={() => setIsFilterOpen(true)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '12px 16px',
                background: 'linear-gradient(to right, #a855f7, #ec4899)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(168, 85, 247, 0.3)',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(168, 85, 247, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(168, 85, 247, 0.3)';
              }}
            >
              <svg style={{ width: '18px', height: '18px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              フィルター
              {hasActiveFilters && (
                <span style={{
                  padding: '2px 8px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.3)',
                  fontSize: '11px',
                  fontWeight: '700'
                }}>
                  適用中
                </span>
              )}
            </button>
          </div>
        )}

        {/* Layout: PC 2カラム / モバイル 1カラム */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '300px 1fr',
          gap: '20px'
        }}>
          {/* PC: 左サイドバー - フィルター */}
          {!isMobile && (
            <div style={{
              background: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(24px)',
              borderRadius: '12px',
              padding: '16px',
              border: '1px solid rgba(255, 255, 255, 0.9)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              height: 'fit-content',
              maxHeight: 'calc(100vh - 280px)',
              overflowY: 'auto',
              position: 'sticky',
              top: '20px'
            }}
            className="custom-scrollbar">
              <FilterSection {...filterProps} />
            </div>
          )}

          {/* 記事リスト */}
          <div>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                <div style={{ fontSize: '14px', color: '#64748b' }}>
                  記事を読み込み中...
                </div>
              </div>
            ) : articles.length === 0 ? (
              <div style={{
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(24px)',
                borderRadius: '12px',
                padding: isMobile ? '40px 20px' : '60px 40px',
                textAlign: 'center',
                border: '1px solid rgba(255, 255, 255, 0.9)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
              }}>
                <div style={{ fontSize: isMobile ? '16px' : '18px', fontWeight: '700', color: '#1e293b', marginBottom: '8px' }}>
                  {hasActiveFilters ? '条件に合う記事が見つかりませんでした' : '記事がまだ登録されていません'}
                </div>
                <div style={{ fontSize: '14px', color: '#64748b' }}>
                  {hasActiveFilters ? '別の条件で検索してみてください' : '管理画面から記事を追加してください'}
                </div>
              </div>
            ) : (
              <>
                {/* Results header */}
                <div style={{
                  marginBottom: '16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '8px'
                }}>
                  <div style={{ fontSize: isMobile ? '14px' : '16px', fontWeight: '700', color: '#1e293b' }}>
                    {articles.length}件の記事
                  </div>
                  {hasActiveFilters && (
                    <span style={{
                      fontSize: '12px',
                      padding: '4px 10px',
                      borderRadius: '12px',
                      background: 'linear-gradient(to right, #e0e7ff, #f3e8ff)',
                      color: '#6366f1',
                      fontWeight: '600'
                    }}>
                      フィルター適用中
                    </span>
                  )}
                </div>

                {/* Articles list */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', overflow: 'hidden' }}>
                  {articles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* モバイル: フィルタードロワー */}
      {isMobile && (
        <MobileFilterDrawer
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          {...filterProps}
        />
      )}
    </div>
  );
}
