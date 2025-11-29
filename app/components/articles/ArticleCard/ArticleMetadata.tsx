/**
 * 記事メタデータコンポーネント（ジャンル、対象、おすすめ度、文字数、読書時間）
 */

'use client';

import { formatNumber } from '@/lib/utils';

type ArticleMetadataProps = {
  genre?: string;
  targetAudience?: string;
  recommendationLevel?: string;
  characterCount: number;
  estimatedReadTime: number;
  isMobile: boolean;
};

export function ArticleMetadata({
  genre,
  targetAudience,
  recommendationLevel,
  characterCount,
  estimatedReadTime,
  isMobile,
}: ArticleMetadataProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
      {genre && (
        <span style={{
          fontSize: '10px',
          color: '#64748b',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <span style={{
            width: '4px',
            height: '4px',
            borderRadius: '50%',
            background: '#a855f7',
            display: 'inline-block'
          }} />
          {genre}
        </span>
      )}
      {targetAudience && (
        <span style={{
          fontSize: '10px',
          color: '#64748b',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <span style={{
            width: '4px',
            height: '4px',
            borderRadius: '50%',
            background: '#ec4899',
            display: 'inline-block'
          }} />
          {targetAudience}
        </span>
      )}
      {recommendationLevel && (
        <span style={{
          fontSize: '10px',
          padding: '2px 8px',
          borderRadius: '10px',
          background: 'linear-gradient(to right, #fef3c7, #fde68a)',
          color: '#92400e',
          fontWeight: '600'
        }}>
          {recommendationLevel}
        </span>
      )}
      {isMobile && (
        <>
          <span style={{ fontSize: '10px', color: '#94a3b8' }}>•</span>
          <span style={{ fontSize: '10px', color: '#64748b' }}>
            {formatNumber(characterCount)}字
          </span>
          <span style={{ fontSize: '10px', color: '#64748b' }}>
            約{estimatedReadTime}分
          </span>
        </>
      )}
    </div>
  );
}
