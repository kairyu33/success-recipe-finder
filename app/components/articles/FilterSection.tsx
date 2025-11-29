/**
 * フィルターセクションコンポーネント - PC/モバイル共通
 */

'use client';

import { SearchBar } from './SearchBar';
import { MultiSelectFilter } from './MultiSelectFilter';
import { SortSelector } from './SortSelector';

type FilterSectionProps = {
  search: string;
  onSearchChange: (value: string) => void;
  selectedGenres: string[];
  onGenresChange: (values: string[]) => void;
  selectedTargetAudiences: string[];
  onTargetAudiencesChange: (values: string[]) => void;
  selectedRecommendationLevels: string[];
  onRecommendationLevelsChange: (values: string[]) => void;
  selectedMembershipIds: string[];
  onMembershipIdsChange: (values: string[]) => void;
  ratingFilter: string;
  onRatingFilterChange: (value: string) => void;
  commentFilter: string;
  onCommentFilterChange: (value: string) => void;
  sortValue: string;
  onSortChange: (value: string) => void;
  genreOptions: Array<{ value: string; label: string }>;
  targetAudienceOptions: Array<{ value: string; label: string }>;
  recommendationLevelOptions: Array<{ value: string; label: string }>;
  membershipOptions: Array<{ value: string; label: string }>;
  hasActiveFilters: boolean;
  onClearAll: () => void;
};

export function FilterSection({
  search,
  onSearchChange,
  selectedGenres,
  onGenresChange,
  selectedTargetAudiences,
  onTargetAudiencesChange,
  selectedRecommendationLevels,
  onRecommendationLevelsChange,
  selectedMembershipIds,
  onMembershipIdsChange,
  ratingFilter,
  onRatingFilterChange,
  commentFilter,
  onCommentFilterChange,
  sortValue,
  onSortChange,
  genreOptions,
  targetAudienceOptions,
  recommendationLevelOptions,
  membershipOptions,
  hasActiveFilters,
  onClearAll,
}: FilterSectionProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b', marginBottom: '4px' }}>
        絞り込み
      </h2>

      {/* Search bar */}
      <SearchBar
        value={search}
        onChange={onSearchChange}
        placeholder="検索..."
      />

      {/* Multi-select filters */}
      <MultiSelectFilter
        label="ジャンル"
        values={selectedGenres}
        options={genreOptions}
        onChange={onGenresChange}
      />

      <MultiSelectFilter
        label="対象"
        values={selectedTargetAudiences}
        options={targetAudienceOptions}
        onChange={onTargetAudiencesChange}
      />

      <MultiSelectFilter
        label="おすすめ度"
        values={selectedRecommendationLevels}
        options={recommendationLevelOptions}
        onChange={onRecommendationLevelsChange}
      />

      <MultiSelectFilter
        label="メンバーシップ"
        values={selectedMembershipIds}
        options={membershipOptions}
        onChange={onMembershipIdsChange}
      />

      {/* Rating filter */}
      <div>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>
          評価数
        </label>
        <select
          value={ratingFilter}
          onChange={(e) => onRatingFilterChange(e.target.value)}
          style={{
            width: '100%',
            padding: '8px 12px',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            fontSize: '13px',
            color: '#1e293b',
            background: 'white',
            cursor: 'pointer',
            outline: 'none',
          }}
        >
          <option value="all">すべて</option>
          <option value="has">評価あり</option>
          <option value="none">評価なし</option>
        </select>
      </div>

      {/* Comment filter */}
      <div>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>
          コメント数
        </label>
        <select
          value={commentFilter}
          onChange={(e) => onCommentFilterChange(e.target.value)}
          style={{
            width: '100%',
            padding: '8px 12px',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            fontSize: '13px',
            color: '#1e293b',
            background: 'white',
            cursor: 'pointer',
            outline: 'none',
          }}
        >
          <option value="all">すべて</option>
          <option value="has">コメントあり</option>
          <option value="none">コメントなし</option>
        </select>
      </div>

      {/* Sort selector */}
      <div style={{
        paddingTop: '12px',
        borderTop: '1px solid #e2e8f0'
      }}>
        <SortSelector value={sortValue} onChange={onSortChange} />
      </div>

      {/* Clear all filters button */}
      {hasActiveFilters && (
        <button
          onClick={onClearAll}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '8px 12px',
            background: 'linear-gradient(to right, #f3e8ff, #fce7f3)',
            color: '#7e22ce',
            border: 'none',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
            width: '100%'
          }}
        >
          <svg style={{ width: '14px', height: '14px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
          すべてクリア
        </button>
      )}
    </div>
  );
}
