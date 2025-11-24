/**
 * モバイル用フィルタードロワーコンポーネント
 */

'use client';

import { useEffect } from 'react';
import { FilterSection } from './FilterSection';

type MobileFilterDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  search: string;
  onSearchChange: (value: string) => void;
  selectedGenres: string[];
  onGenresChange: (values: string[]) => void;
  selectedTargetAudiences: string[];
  onTargetAudiencesChange: (values: string[]) => void;
  selectedRecommendationLevels: string[];
  onRecommendationLevelsChange: (values: string[]) => void;
  sortValue: string;
  onSortChange: (value: string) => void;
  genreOptions: Array<{ value: string; label: string }>;
  targetAudienceOptions: Array<{ value: string; label: string }>;
  recommendationLevelOptions: Array<{ value: string; label: string }>;
  hasActiveFilters: boolean;
  onClearAll: () => void;
};

export function MobileFilterDrawer({
  isOpen,
  onClose,
  ...filterProps
}: MobileFilterDrawerProps) {
  // ドロワーが開いているときはスクロールを無効化
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          zIndex: 40,
          animation: 'fadeIn 0.2s ease-out'
        }}
      />

      {/* Drawer */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: '85%',
          maxWidth: '400px',
          background: 'white',
          zIndex: 50,
          overflowY: 'auto',
          boxShadow: '-4px 0 20px rgba(0, 0, 0, 0.15)',
          animation: 'slideInRight 0.3s ease-out'
        }}
      >
        {/* Header */}
        <div style={{
          position: 'sticky',
          top: 0,
          background: 'white',
          borderBottom: '1px solid #e2e8f0',
          padding: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 10
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b' }}>
            フィルター
          </h2>
          <button
            onClick={onClose}
            style={{
              padding: '8px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              borderRadius: '6px',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#f5f5f5';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'none';
            }}
          >
            <svg style={{ width: '24px', height: '24px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Filter Content */}
        <div style={{ padding: '16px' }}>
          <FilterSection {...filterProps} />
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideInRight {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
}
