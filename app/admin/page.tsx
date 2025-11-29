/**
 * 管理画面メインページ（Premium Redesign）
 */

'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
  LoginForm,
  CSVUpload,
  ArticleForm,
  ArticleListCompact,
  ArticleFilters,
  MembershipForm,
  MembershipList,
  RatingList,
  CommentList,
} from '@/app/components/admin';
import type { ArticleFiltersState } from '@/app/components/admin/ArticleFilters';
import {
  fetchArticles,
  fetchAdminMemberships,
  createArticle,
  updateArticle,
  deleteArticle,
  createMembership,
  updateMembership,
  deleteMembership,
} from '@/lib/api';
import { MESSAGES, DEFAULT_MEMBERSHIP_COLOR } from '@/lib/constants';
import { formatDate } from '@/lib/utils';
import * as storage from '@/lib/localStorage';
import type {
  Article,
  Membership,
  ArticleFormData,
  MembershipFormData,
  Tab,
} from '@/types';

export default function AdminPage() {
  // 認証状態
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // タブ状態
  const [activeTab, setActiveTab] = useState<Tab>('articles');

  // データ状態
  const [allArticles, setAllArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [ratings, setRatings] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // フィルタ状態
  const [filters, setFilters] = useState<ArticleFiltersState>({
    search: '',
    genres: [],
    targetAudiences: [],
    recommendationLevels: [],
    membershipIds: [],
    sortBy: 'publishedAt',
    sortOrder: 'desc',
  });

  // 記事フォーム状態
  const [articleForm, setArticleForm] = useState<ArticleFormData>({
    title: '',
    noteLink: '',
    publishedAt: '',
    characterCount: 0,
    estimatedReadTime: 0,
    genre: '',
    targetAudience: '',
    benefit: '',
    recommendationLevel: '',
    membershipIds: [],
  });
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  const [showArticleForm, setShowArticleForm] = useState(false);

  // メンバーシップフォーム状態
  const [membershipForm, setMembershipForm] = useState<MembershipFormData>({
    name: '',
    description: '',
    color: DEFAULT_MEMBERSHIP_COLOR,
    sortOrder: 0,
    isActive: true,
  });
  const [editingMembershipId, setEditingMembershipId] = useState<string | null>(
    null
  );
  const [showMembershipForm, setShowMembershipForm] = useState(false);

  // 初回データ取得
  useEffect(() => {
    if (isAuthenticated) {
      fetchInitialData();
    }
  }, [isAuthenticated]);

  // フィルタ変更時に記事を再取得
  useEffect(() => {
    if (isAuthenticated && allArticles.length > 0) {
      fetchFilteredArticles();
    }
  }, [filters]);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [allArticlesData, membershipsData] = await Promise.all([
        fetchArticles({ limit: 10000 }), // 全記事取得
        fetchAdminMemberships(),
      ]);

      setAllArticles(allArticlesData);
      setFilteredArticles(allArticlesData);
      setMemberships(membershipsData);

      // localStorageから評価とコメントを取得して記事情報と結合
      loadRatingsAndComments(allArticlesData);
    } catch (error) {
      console.error('データ取得エラー:', error);
      toast.error(MESSAGES.ERROR.DATA_FETCH_FAILED);
    } finally {
      setLoading(false);
    }
  };

  const fetchFilteredArticles = async () => {
    setLoading(true);
    try {
      const articlesData = await fetchArticles({
        search: filters.search || undefined,
        genres: filters.genres.length > 0 ? filters.genres : undefined,
        targetAudiences: filters.targetAudiences.length > 0 ? filters.targetAudiences : undefined,
        recommendationLevels: filters.recommendationLevels.length > 0 ? filters.recommendationLevels : undefined,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
        limit: 1000,
      });

      setFilteredArticles(articlesData);
    } catch (error) {
      console.error('記事取得エラー:', error);
      toast.error(MESSAGES.ERROR.DATA_FETCH_FAILED);
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    await fetchInitialData();
  };

  // localStorageから評価とコメントを取得して記事情報と結合
  const loadRatingsAndComments = (articles: Article[]) => {
    const allRatings = storage.getAllRatings();
    const allComments = storage.getAllComments();

    // 記事情報マップを作成
    const articleMap = new Map(articles.map(a => [a.id, a]));

    // 評価に記事情報を追加
    const ratingsWithArticle = allRatings
      .map(rating => {
        const article = articleMap.get(rating.articleId);
        if (!article) return null;
        return {
          id: rating.id,
          articleId: rating.articleId,
          userId: null,
          userName: rating.userName || null,
          score: rating.score,
          createdAt: rating.createdAt,
          updatedAt: rating.createdAt,
          article: {
            id: article.id,
            title: article.title,
            noteLink: article.noteLink,
          },
        };
      })
      .filter(Boolean);

    // コメントに記事情報を追加
    const commentsWithArticle = allComments
      .map(comment => {
        const article = articleMap.get(comment.articleId);
        if (!article) return null;
        return {
          id: comment.id,
          articleId: comment.articleId,
          userId: null,
          userName: comment.userName,
          content: comment.content,
          createdAt: comment.createdAt,
          updatedAt: comment.createdAt,
          article: {
            id: article.id,
            title: article.title,
            noteLink: article.noteLink,
          },
        };
      })
      .filter(Boolean);

    setRatings(ratingsWithArticle);
    setComments(commentsWithArticle);
  };

  // 利用可能な選択肢を計算
  const availableGenres = Array.from(new Set(allArticles.map(a => a.genre).filter(Boolean))).sort();
  const availableTargetAudiences = Array.from(new Set(allArticles.map(a => a.targetAudience).filter(Boolean))).sort();
  const availableRecommendationLevels = Array.from(new Set(allArticles.map(a => a.recommendationLevel).filter(Boolean))).sort();

  // 読者メリットの選択肢を計算（カンマ区切りから抽出）
  const availableBenefits = Array.from(
    new Set(
      allArticles
        .map(a => a.benefit)
        .filter(Boolean)
        .flatMap(b => b.split(',').map(item => item.trim()))
        .filter(Boolean)
    )
  ).sort();

  // フィルタリセット
  const handleResetFilters = () => {
    setFilters({
      search: '',
      genres: [],
      targetAudiences: [],
      recommendationLevels: [],
      membershipIds: [],
      sortBy: 'publishedAt',
      sortOrder: 'desc',
    });
  };

  // 記事操作
  const handleArticleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingArticleId) {
        await updateArticle(editingArticleId, articleForm);
        toast.success(MESSAGES.SUCCESS.ARTICLE_UPDATED);
      } else {
        await createArticle(articleForm);
        toast.success(MESSAGES.SUCCESS.ARTICLE_CREATED);
      }
      resetArticleForm();

      // 全記事データを再取得してフィルタを再適用
      const allArticlesData = await fetchArticles({ limit: 10000 });
      setAllArticles(allArticlesData);

      // 現在のフィルタ設定で記事を再取得
      await fetchFilteredArticles();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : MESSAGES.ERROR.OPERATION_FAILED;
      toast.error(message);
    }
  };

  const handleArticleEdit = (article: Article) => {
    setArticleForm({
      title: article.title,
      noteLink: article.noteLink,
      publishedAt: formatDate(article.publishedAt),
      characterCount: article.characterCount,
      estimatedReadTime: article.estimatedReadTime,
      genre: article.genre,
      targetAudience: article.targetAudience,
      benefit: article.benefit,
      recommendationLevel: article.recommendationLevel,
      membershipIds: article.memberships.map((m) => m.membership.id),
    });
    setEditingArticleId(article.id);
    setShowArticleForm(true);

    // フォームが表示される位置にスクロール
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  const handleArticleDelete = async (id: string) => {
    if (!confirm(MESSAGES.CONFIRM.DELETE_ARTICLE)) return;

    try {
      await deleteArticle(id);
      toast.success(MESSAGES.SUCCESS.ARTICLE_DELETED);

      // 全記事データを再取得してフィルタを再適用
      const allArticlesData = await fetchArticles({ limit: 10000 });
      setAllArticles(allArticlesData);

      // 現在のフィルタ設定で記事を再取得
      await fetchFilteredArticles();
    } catch (error) {
      toast.error(MESSAGES.ERROR.OPERATION_FAILED);
    }
  };

  const handleMembershipToggle = async (articleId: string, membershipId: string) => {
    try {
      // Find the article to toggle
      const article = allArticles.find((a) => a.id === articleId);
      if (!article) return;

      // Get current membership IDs
      const currentMembershipIds = article.memberships.map((m) => m.membership.id);

      // Toggle the membership ID
      const newMembershipIds = currentMembershipIds.includes(membershipId)
        ? currentMembershipIds.filter((id) => id !== membershipId)
        : [...currentMembershipIds, membershipId];

      // Update the article
      await updateArticle(articleId, {
        ...article,
        membershipIds: newMembershipIds,
      });

      // 全記事データを再取得してフィルタを再適用
      const allArticlesData = await fetchArticles({ limit: 10000 });
      setAllArticles(allArticlesData);

      // 現在のフィルタ設定で記事を再取得
      await fetchFilteredArticles();
      toast.success('メンバーシップを更新しました');
    } catch (error) {
      toast.error(MESSAGES.ERROR.OPERATION_FAILED);
    }
  };

  const resetArticleForm = () => {
    setArticleForm({
      title: '',
      noteLink: '',
      publishedAt: '',
      characterCount: 0,
      estimatedReadTime: 0,
      genre: '',
      targetAudience: '',
      benefit: '',
      recommendationLevel: '',
      membershipIds: [],
    });
    setEditingArticleId(null);
    setShowArticleForm(false);
  };

  // メンバーシップ操作
  const handleMembershipSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingMembershipId) {
        await updateMembership(editingMembershipId, membershipForm);
        toast.success(MESSAGES.SUCCESS.MEMBERSHIP_UPDATED);
      } else {
        await createMembership(membershipForm);
        toast.success(MESSAGES.SUCCESS.MEMBERSHIP_CREATED);
      }
      resetMembershipForm();
      fetchData();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : MESSAGES.ERROR.OPERATION_FAILED;
      toast.error(message);
    }
  };

  const handleMembershipEdit = (membership: Membership) => {
    setMembershipForm({
      name: membership.name,
      description: membership.description || '',
      color: membership.color || DEFAULT_MEMBERSHIP_COLOR,
      sortOrder: membership.sortOrder,
      isActive: membership.isActive,
    });
    setEditingMembershipId(membership.id);
    setShowMembershipForm(true);
  };

  const handleMembershipDelete = async (id: string) => {
    if (!confirm(MESSAGES.CONFIRM.DELETE_MEMBERSHIP)) return;

    try {
      await deleteMembership(id);
      toast.success(MESSAGES.SUCCESS.MEMBERSHIP_DELETED);
      fetchData();
    } catch (error) {
      toast.error(MESSAGES.ERROR.OPERATION_FAILED);
    }
  };

  const resetMembershipForm = () => {
    setMembershipForm({
      name: '',
      description: '',
      color: DEFAULT_MEMBERSHIP_COLOR,
      sortOrder: 0,
      isActive: true,
    });
    setEditingMembershipId(null);
    setShowMembershipForm(false);
  };

  // 評価削除（localStorage使用）
  const handleRatingDelete = async (id: string) => {
    try {
      const success = storage.deleteRating(id);

      if (!success) {
        throw new Error('評価が見つかりませんでした');
      }

      toast.success('評価を削除しました');
      // 評価データを再取得
      loadRatingsAndComments(allArticles);
    } catch (error) {
      console.error('評価削除エラー:', error);
      toast.error('評価の削除に失敗しました');
      throw error;
    }
  };

  // コメント削除（localStorage使用）
  const handleCommentDelete = async (id: string) => {
    try {
      const success = storage.deleteComment(id);

      if (!success) {
        throw new Error('コメントが見つかりませんでした');
      }

      toast.success('コメントを削除しました');
      // コメントデータを再取得
      loadRatingsAndComments(allArticles);
    } catch (error) {
      console.error('コメント削除エラー:', error);
      toast.error('コメントの削除に失敗しました');
      throw error;
    }
  };

  // 認証されていない場合はログインフォームを表示
  if (!isAuthenticated) {
    return <LoginForm onSuccess={() => setIsAuthenticated(true)} />;
  }

  // ローディング中
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-neutral-50 via-white to-primary-50/30">
        <div className="relative w-24 h-24 mb-6">
          <div className="absolute inset-0 rounded-full border-4 border-primary-200" />
          <div className="absolute inset-0 rounded-full border-4 border-primary-500 border-t-transparent animate-spin" />
        </div>
        <div className="text-2xl font-bold gradient-text">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-primary-50/30">
      {/* Decorative gradient orbs */}
      <div className="fixed top-0 right-0 w-96 h-96 bg-gradient-primary opacity-10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-96 h-96 bg-gradient-accent opacity-10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12 animate-fade-in-up">
          <h1 className="text-5xl font-bold mb-3">
            <span className="gradient-text">管理画面</span>
          </h1>
          <p className="text-lg text-neutral-600">
            記事とメンバーシップを管理
          </p>

          {/* Stats */}
          <div className="flex items-center gap-8 mt-6">
            <div className="flex items-center gap-3 px-6 py-3 bg-white rounded-2xl shadow-soft border border-neutral-100">
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold text-neutral-800">{allArticles.length}</div>
                <div className="text-sm text-neutral-500">記事</div>
              </div>
            </div>

            <div className="flex items-center gap-3 px-6 py-3 bg-white rounded-2xl shadow-soft border border-neutral-100">
              <div className="w-10 h-10 bg-gradient-accent rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold text-neutral-800">{memberships.length}</div>
                <div className="text-sm text-neutral-500">メンバーシップ</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="glass-light backdrop-blur-xl rounded-2xl p-2 mb-8 border border-white/50 shadow-soft inline-flex gap-2 animate-fade-in">
          <button
            onClick={() => setActiveTab('articles')}
            className={`relative px-8 py-3.5 rounded-xl font-semibold transition-all duration-300 overflow-hidden ${
              activeTab === 'articles'
                ? 'bg-gradient-primary text-white shadow-primary'
                : 'text-neutral-600 hover:bg-white/50'
            }`}
          >
            {activeTab === 'articles' && (
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] animate-shimmer" />
            )}
            <span className="relative z-10 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              記事管理
            </span>
          </button>

          <button
            onClick={() => setActiveTab('memberships')}
            className={`relative px-8 py-3.5 rounded-xl font-semibold transition-all duration-300 overflow-hidden ${
              activeTab === 'memberships'
                ? 'bg-gradient-primary text-white shadow-primary'
                : 'text-neutral-600 hover:bg-white/50'
            }`}
          >
            {activeTab === 'memberships' && (
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] animate-shimmer" />
            )}
            <span className="relative z-10 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              メンバーシップ管理
            </span>
          </button>

          <button
            onClick={() => setActiveTab('ratings')}
            className={`relative px-8 py-3.5 rounded-xl font-semibold transition-all duration-300 overflow-hidden ${
              activeTab === 'ratings'
                ? 'bg-gradient-primary text-white shadow-primary'
                : 'text-neutral-600 hover:bg-white/50'
            }`}
          >
            {activeTab === 'ratings' && (
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] animate-shimmer" />
            )}
            <span className="relative z-10 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              評価管理
            </span>
          </button>

          <button
            onClick={() => setActiveTab('comments')}
            className={`relative px-8 py-3.5 rounded-xl font-semibold transition-all duration-300 overflow-hidden ${
              activeTab === 'comments'
                ? 'bg-gradient-primary text-white shadow-primary'
                : 'text-neutral-600 hover:bg-white/50'
            }`}
          >
            {activeTab === 'comments' && (
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] animate-shimmer" />
            )}
            <span className="relative z-10 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              コメント管理
            </span>
          </button>
        </div>

        {/* 記事管理タブ */}
        {activeTab === 'articles' && (
          <div className="space-y-8 animate-fade-in">
            {/* CSV Upload */}
            <div className="glass-light backdrop-blur-xl rounded-3xl p-8 border border-white/50 shadow-soft-lg">
              <CSVUpload onSuccess={fetchData} />
            </div>

            {/* New Article Button */}
            <div>
              <button
                onClick={() => setShowArticleForm(!showArticleForm)}
                className="relative px-8 py-4 bg-gradient-primary text-white rounded-2xl font-semibold shadow-primary overflow-hidden group transition-all duration-300 hover:shadow-primary-lg"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-400 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="relative z-10 flex items-center gap-3">
                  {showArticleForm ? (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      フォームを閉じる
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      新規記事作成
                    </>
                  )}
                </span>
              </button>
            </div>

            {/* Article Form */}
            {showArticleForm && (
              <div className="glass-light backdrop-blur-xl rounded-3xl p-8 border border-white/50 shadow-soft-lg animate-scale-in">
                <ArticleForm
                  formData={articleForm}
                  memberships={memberships}
                  availableGenres={availableGenres}
                  availableBenefits={availableBenefits}
                  isEditing={!!editingArticleId}
                  onSubmit={handleArticleSubmit}
                  onChange={(data) => setArticleForm({ ...articleForm, ...data })}
                  onCancel={resetArticleForm}
                />
              </div>
            )}

            {/* 2-Column Layout: Filters (Left) + Articles List (Right) */}
            <div className="grid grid-cols-12 gap-8">
              {/* Left Column: Filters */}
              <div className="col-span-12 lg:col-span-4">
                <div className="glass-light backdrop-blur-xl rounded-3xl p-8 border border-white/50 shadow-soft-lg sticky top-8">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold gradient-text mb-2">記事を検索・フィルタ</h2>
                    <p className="text-neutral-600">
                      検索やフィルタを使って目的の記事を素早く見つけられます
                    </p>
                    <div className="mt-2 text-sm font-semibold text-primary-600">
                      {filteredArticles.length}件 / {allArticles.length}件
                    </div>
                  </div>
                  <ArticleFilters
                    filters={filters}
                    memberships={memberships}
                    availableGenres={availableGenres}
                    availableTargetAudiences={availableTargetAudiences}
                    availableRecommendationLevels={availableRecommendationLevels}
                    onChange={setFilters}
                    onReset={handleResetFilters}
                  />
                </div>
              </div>

              {/* Right Column: Articles List */}
              <div className="col-span-12 lg:col-span-8">
                <div className="glass-light backdrop-blur-xl rounded-3xl p-8 border border-white/50 shadow-soft-lg">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold gradient-text">記事一覧</h2>
                  </div>
                  <ArticleListCompact
                    articles={filteredArticles}
                    memberships={memberships}
                    onEdit={handleArticleEdit}
                    onDelete={handleArticleDelete}
                    onMembershipToggle={handleMembershipToggle}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* メンバーシップ管理タブ */}
        {activeTab === 'memberships' && (
          <div className="space-y-8 animate-fade-in">
            {/* New Membership Button */}
            <div>
              <button
                onClick={() => setShowMembershipForm(!showMembershipForm)}
                className="relative px-8 py-4 bg-gradient-primary text-white rounded-2xl font-semibold shadow-primary overflow-hidden group transition-all duration-300 hover:shadow-primary-lg"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-400 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="relative z-10 flex items-center gap-3">
                  {showMembershipForm ? (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      フォームを閉じる
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      新規メンバーシップ作成
                    </>
                  )}
                </span>
              </button>
            </div>

            {/* Membership Form */}
            {showMembershipForm && (
              <div className="glass-light backdrop-blur-xl rounded-3xl p-8 border border-white/50 shadow-soft-lg animate-scale-in">
                <MembershipForm
                  formData={membershipForm}
                  isEditing={!!editingMembershipId}
                  onSubmit={handleMembershipSubmit}
                  onChange={(data) =>
                    setMembershipForm({ ...membershipForm, ...data })
                  }
                  onCancel={resetMembershipForm}
                />
              </div>
            )}

            {/* Memberships List */}
            <div className="glass-light backdrop-blur-xl rounded-3xl p-8 border border-white/50 shadow-soft-lg">
              <MembershipList
                memberships={memberships}
                onEdit={handleMembershipEdit}
                onDelete={handleMembershipDelete}
              />
            </div>
          </div>
        )}

        {/* 評価管理タブ */}
        {activeTab === 'ratings' && (
          <div className="space-y-8 animate-fade-in">
            <div className="glass-light backdrop-blur-xl rounded-3xl p-8 border border-white/50 shadow-soft-lg">
              <h2 className="text-2xl font-bold mb-6 gradient-text">評価一覧</h2>
              <RatingList
                ratings={ratings}
                onDelete={handleRatingDelete}
              />
            </div>
          </div>
        )}

        {/* コメント管理タブ */}
        {activeTab === 'comments' && (
          <div className="space-y-8 animate-fade-in">
            <div className="glass-light backdrop-blur-xl rounded-3xl p-8 border border-white/50 shadow-soft-lg">
              <h2 className="text-2xl font-bold mb-6 gradient-text">コメント一覧</h2>
              <CommentList
                comments={comments}
                onDelete={handleCommentDelete}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
