/**
 * 記事フィルタコンポーネント
 */

'use client';

import type { Membership } from '@/types';

export type ArticleFiltersState = {
  search: string;
  genres: string[];
  targetAudiences: string[];
  recommendationLevels: string[];
  membershipIds: string[];
  sortBy: string;
  sortOrder: 'asc' | 'desc';
};

type ArticleFiltersProps = {
  filters: ArticleFiltersState;
  memberships: Membership[];
  availableGenres: string[];
  availableTargetAudiences: string[];
  availableRecommendationLevels: string[];
  onChange: (filters: ArticleFiltersState) => void;
  onReset: () => void;
};

export function ArticleFilters({
  filters,
  memberships,
  availableGenres,
  availableTargetAudiences,
  availableRecommendationLevels,
  onChange,
  onReset,
}: ArticleFiltersProps) {
  const handleSearchChange = (value: string) => {
    onChange({ ...filters, search: value });
  };

  const handleGenreToggle = (genre: string) => {
    const newGenres = filters.genres.includes(genre)
      ? filters.genres.filter((g) => g !== genre)
      : [...filters.genres, genre];
    onChange({ ...filters, genres: newGenres });
  };

  const handleTargetAudienceToggle = (audience: string) => {
    const newAudiences = filters.targetAudiences.includes(audience)
      ? filters.targetAudiences.filter((a) => a !== audience)
      : [...filters.targetAudiences, audience];
    onChange({ ...filters, targetAudiences: newAudiences });
  };

  const handleRecommendationLevelToggle = (level: string) => {
    const newLevels = filters.recommendationLevels.includes(level)
      ? filters.recommendationLevels.filter((l) => l !== level)
      : [...filters.recommendationLevels, level];
    onChange({ ...filters, recommendationLevels: newLevels });
  };

  const handleMembershipToggle = (id: string) => {
    const newIds = filters.membershipIds.includes(id)
      ? filters.membershipIds.filter((i) => i !== id)
      : [...filters.membershipIds, id];
    onChange({ ...filters, membershipIds: newIds });
  };

  const handleSortChange = (sortBy: string) => {
    onChange({ ...filters, sortBy });
  };

  const handleSortOrderToggle = () => {
    onChange({
      ...filters,
      sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc',
    });
  };

  const hasActiveFilters =
    filters.search ||
    filters.genres.length > 0 ||
    filters.targetAudiences.length > 0 ||
    filters.recommendationLevels.length > 0 ||
    filters.membershipIds.length > 0;

  return (
    <div className="space-y-6">
      {/* 検索バー */}
      <div className="relative">
        <input
          type="text"
          value={filters.search}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="タイトル、ジャンル、メリットで検索..."
          className="w-full px-4 py-3 pl-12 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
        />
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {/* フィルタとソート */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* ジャンルフィルタ */}
        <div>
          <label className="block text-sm font-semibold text-neutral-700 mb-2">
            ジャンル
          </label>
          <div className="space-y-2 max-h-48 overflow-y-auto p-3 bg-neutral-50 rounded-lg">
            {availableGenres.map((genre) => (
              <label
                key={genre}
                className="flex items-center gap-2 cursor-pointer hover:bg-white p-2 rounded transition-colors"
              >
                <input
                  type="checkbox"
                  checked={filters.genres.includes(genre)}
                  onChange={() => handleGenreToggle(genre)}
                  className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                />
                <span className="text-sm text-neutral-700">{genre}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 対象読者フィルタ */}
        <div>
          <label className="block text-sm font-semibold text-neutral-700 mb-2">
            対象読者
          </label>
          <div className="space-y-2 max-h-48 overflow-y-auto p-3 bg-neutral-50 rounded-lg">
            {availableTargetAudiences.map((audience) => (
              <label
                key={audience}
                className="flex items-center gap-2 cursor-pointer hover:bg-white p-2 rounded transition-colors"
              >
                <input
                  type="checkbox"
                  checked={filters.targetAudiences.includes(audience)}
                  onChange={() => handleTargetAudienceToggle(audience)}
                  className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                />
                <span className="text-sm text-neutral-700">{audience}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 推奨レベルフィルタ */}
        <div>
          <label className="block text-sm font-semibold text-neutral-700 mb-2">
            推奨レベル
          </label>
          <div className="space-y-2 max-h-48 overflow-y-auto p-3 bg-neutral-50 rounded-lg">
            {availableRecommendationLevels.map((level) => (
              <label
                key={level}
                className="flex items-center gap-2 cursor-pointer hover:bg-white p-2 rounded transition-colors"
              >
                <input
                  type="checkbox"
                  checked={filters.recommendationLevels.includes(level)}
                  onChange={() => handleRecommendationLevelToggle(level)}
                  className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                />
                <span className="text-sm text-neutral-700">{level}</span>
              </label>
            ))}
          </div>
        </div>

        {/* メンバーシップフィルタ */}
        {memberships.length > 0 && (
          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-2">
              メンバーシップ
            </label>
            <div className="space-y-2 max-h-48 overflow-y-auto p-3 bg-neutral-50 rounded-lg">
              {memberships.map((membership) => (
                <label
                  key={membership.id}
                  className="flex items-center gap-2 cursor-pointer hover:bg-white p-2 rounded transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={filters.membershipIds.includes(membership.id)}
                    onChange={() => handleMembershipToggle(membership.id)}
                    className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                  />
                  <span
                    className="inline-flex items-center gap-2 text-sm text-neutral-700"
                  >
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor: membership.color || '#3B82F6',
                      }}
                    />
                    {membership.name}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* ソート */}
        <div>
          <label className="block text-sm font-semibold text-neutral-700 mb-2">
            並び替え
          </label>
          <div className="space-y-2">
            <select
              value={filters.sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="w-full px-4 py-2 border-2 border-neutral-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
            >
              <option value="publishedAt">公開日時</option>
              <option value="title">タイトル</option>
              <option value="characterCount">文字数</option>
              <option value="estimatedReadTime">読了時間</option>
              <option value="createdAt">登録日時</option>
            </select>
            <button
              onClick={handleSortOrderToggle}
              className="w-full px-4 py-2 bg-neutral-100 hover:bg-neutral-200 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <svg
                className={`w-4 h-4 transition-transform ${
                  filters.sortOrder === 'desc' ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 15l7-7 7 7"
                />
              </svg>
              <span className="text-sm font-medium">
                {filters.sortOrder === 'asc' ? '昇順' : '降順'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* リセットボタン */}
      {hasActiveFilters && (
        <div className="flex justify-end">
          <button
            onClick={onReset}
            className="px-6 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            フィルタをリセット
          </button>
        </div>
      )}
    </div>
  );
}
