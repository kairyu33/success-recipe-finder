# Frontend Refactoring Plan - note-hashtag-ai-generator

## 概要
このドキュメントは、note-hashtag-ai-generatorフロントエンドの包括的なリファクタリング計画です。
React/TypeScriptのベストプラクティスに基づき、コンポーネント構造、パフォーマンス、型安全性、コードの可読性を改善します。

---

## 1. 現状の課題分析

### A. 重複コードの問題 (Critical)

#### 1.1 SVGアイコンの重複
**場所:** `app/components/features/AnalysisResults/AnalysisResults.tsx` L43-128

**問題:**
- 10個のタブで同じSVGアイコンがハードコード (各10-15行)
- 各タブコンポーネント内でも空状態のSVGが重複
- 合計: 約200行の重複SVGコード

**影響:**
- バンドルサイズの増加 (~15KB)
- アイコン変更時の修正箇所が多数
- 一貫性の欠如

#### 1.2 空状態コンポーネントの重複
**場所:** 全タブコンポーネント

**問題:**
```typescript
// TitlesTab.tsx, HashtagsTab.tsx, InsightsTab.tsx などで類似コード
if (!data) {
  return (
    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
      <p>データがありません</p>
    </div>
  );
}
```

**影響:**
- 約100行の重複コード
- スタイル変更時の修正コストが高い

#### 1.3 コピー機能の実装が二重
**場所:**
- `app/components/ui/CopyButton/CopyButton.tsx` (独自state)
- `app/hooks/useClipboard.ts` (フック)

**問題:**
- 同じ機能を2つの異なる方法で実装
- `HashtagsTab`と`InsightsTab`で`useClipboard`使用
- `TitlesTab`と`EyeCatchTab`で`CopyButton`使用

**影響:**
- 一貫性のない実装
- 保守性の低下

#### 1.4 スコア表示ロジックの重複
**場所:**
- `ViralityTab.tsx` L23-35
- `MonetizationTab.tsx` L22-34
- `SEOTab.tsx` L32-35

**問題:**
```typescript
// 各コンポーネントで同じロジックを再実装
const getScoreColor = (score: number) => {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-blue-600';
  if (score >= 40) return 'text-yellow-600';
  return 'text-red-600';
};
```

**影響:**
- 約60行の重複コード
- スコア基準変更時に3箇所の修正が必要

---

### B. パフォーマンスの問題 (High)

#### 2.1 メモ化の不足
**問題:**
- すべてのタブコンポーネントでReact.memoが未使用
- 親の`AnalysisResults`が再レンダーされると全タブが再レンダー
- 非アクティブなタブも再計算される

**影響:**
- 不必要な再レンダー: 毎回10コンポーネント
- パフォーマンス: 大規模データで顕著な遅延

#### 2.2 非効率的な計算
**場所:** `InsightsTab.tsx` L27-57

**問題:**
```typescript
// 毎レンダーで実行される重い処理
const formatCombinedText = () => {
  const sections: string[] = [];
  // 複雑なテキスト処理...
  return sections.join('\n');
};
```

**影響:**
- 毎レンダーで同じ計算を実行
- useMemoで簡単に最適化可能

#### 2.3 大きなインラインJSX配列
**場所:** `AnalysisResults.tsx` L38-129

**問題:**
- 91行のタブ定義配列がコンポーネント内にハードコード
- 各レンダーでJSXオブジェクトを再生成

**影響:**
- メモリ使用量の増加
- 可読性の低下

---

### C. 型安全性の問題 (Medium)

#### 3.1 型定義の不一致
**場所:**
- `app/types/article-analysis.ts` (古い型定義)
- `app/components/features/AnalysisResults/AnalysisResults.types.ts` (実際の型)

**問題:**
```typescript
// article-analysis.ts には viralityScore, monetization, readingTime が未定義
export interface ArticleAnalysisResponse {
  hashtags: string[];
  suggestedTitles: string[];
  // ❌ SEO, virality, monetization などの型がない
}

// AnalysisResults.types.ts では存在
export interface AnalysisData {
  viralityScore?: { /* ... */ };
  monetization?: { /* ... */ };
  // 型が不一致
}
```

**影響:**
- 型チェックが不完全
- ランタイムエラーのリスク

#### 3.2 Pick<>の過剰使用
**問題:**
```typescript
export function HashtagsTab({ data }: Pick<TabContentProps, 'data'>) {
  // Pick を使う必要性が低い
}
```

**影響:**
- 型定義が複雑化
- 可読性の低下

#### 3.3 オプショナルプロパティの乱用
**問題:**
```typescript
export interface AnalysisData {
  suggestedTitles?: string[];  // 必須なのに?付き
  hashtags?: string[];         // 必須なのに?付き
}
```

**影響:**
- 不要なnullチェックが必要
- 型安全性の低下

---

### D. コードの可読性の問題 (Medium)

#### 4.1 巨大なコンポーネント
**場所:** `SEOTab.tsx` (577行)

**問題:**
- 単一ファイルに6つのサブコンポーネントを定義
- 複雑なロジックとUIが混在

**影響:**
- 保守性の低下
- テストの困難さ

#### 4.2 定数のハードコード
**問題:**
```typescript
// AnalysisResults.tsx
const tabs = [
  { id: 'titles', label: 'タイトル', icon: <svg>...</svg> },
  // ... 10個のタブ定義がハードコード
];
```

**影響:**
- タブ追加/削除時の修正が困難
- 設定の一元管理ができない

---

## 2. 共通化できるコンポーネント・ロジック

### A. 共通UIコンポーネント (新規作成)

#### 2.1 Icon Component
**目的:** SVGアイコンの一元管理

**ファイル:** `app/components/ui/shared/Icon.tsx`

```typescript
/**
 * Icon Component
 *
 * @description Centralized icon management with type-safe icon names
 * Replaces ~200 lines of duplicate SVG code
 *
 * @example
 * <Icon name="hashtag" size="md" className="text-blue-600" />
 */

import React from 'react';
import { IconName, IconSize } from '@/app/types/ui';

interface IconProps {
  name: IconName;
  size?: IconSize;
  className?: string;
  'aria-hidden'?: boolean;
}

const ICON_PATHS: Record<IconName, string> = {
  hashtag: 'M7 20l4-16m2 16l4-16M6 9h14M4 15h14',
  title: 'M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z',
  insights: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  image: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
  virality: 'M13 10V3L4 14h7v7l9-11h-7z',
  clock: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
  edit: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
  series: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
  money: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  emoji: 'M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  check: 'M5 13l4 4L19 7',
  copy: 'M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z',
  warning: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
  info: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
};

const SIZE_CLASSES: Record<IconSize, string> = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
  xl: 'h-8 w-8',
};

export const Icon = React.memo<IconProps>(({
  name,
  size = 'md',
  className = '',
  'aria-hidden': ariaHidden = true
}) => {
  const path = ICON_PATHS[name];

  if (!path) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  return (
    <svg
      className={`${SIZE_CLASSES[size]} ${className}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden={ariaHidden}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d={path}
      />
    </svg>
  );
});

Icon.displayName = 'Icon';
```

**効果:**
- コード削減: 約200行
- バンドルサイズ削減: ~15KB
- 保守性向上: アイコン変更が1箇所で完結

---

#### 2.2 EmptyState Component
**目的:** 空状態表示の統一

**ファイル:** `app/components/ui/shared/EmptyState.tsx`

```typescript
/**
 * EmptyState Component
 *
 * @description Unified empty state display across all tabs
 * Replaces ~100 lines of duplicate code
 *
 * @example
 * <EmptyState
 *   icon="hashtag"
 *   message="ハッシュタグが生成されませんでした"
 * />
 */

import React from 'react';
import { Icon } from './Icon';
import { IconName } from '@/app/types/ui';

interface EmptyStateProps {
  icon: IconName;
  message: string;
  description?: string;
  className?: string;
}

export const EmptyState = React.memo<EmptyStateProps>(({
  icon,
  message,
  description,
  className = ''
}) => {
  return (
    <div className={`text-center py-12 text-gray-500 dark:text-gray-400 ${className}`}>
      <Icon
        name={icon}
        size="xl"
        className="mx-auto mb-4 text-gray-400 dark:text-gray-500"
      />
      <p className="text-base font-medium mb-2">{message}</p>
      {description && (
        <p className="text-sm text-gray-400 dark:text-gray-500">{description}</p>
      )}
    </div>
  );
});

EmptyState.displayName = 'EmptyState';
```

---

#### 2.3 ScoreDisplay Component
**目的:** スコア表示の共通化 (Virality, Monetization, SEOで使用)

**ファイル:** `app/components/ui/shared/ScoreDisplay.tsx`

```typescript
/**
 * ScoreDisplay Component
 *
 * @description Unified score display with circular progress
 * Used in Virality, Monetization, and SEO tabs
 *
 * @example
 * <ScoreDisplay
 *   score={85}
 *   label="総合スコア"
 *   showProgress
 * />
 */

import React, { useMemo } from 'react';
import { useScoreColor } from '@/app/hooks/useScoreColor';

interface ScoreDisplayProps {
  score: number;
  label: string;
  description?: string;
  showProgress?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ScoreDisplay = React.memo<ScoreDisplayProps>(({
  score,
  label,
  description,
  showProgress = true,
  size = 'md',
  className = ''
}) => {
  const { colorClass, gradientClass, labelText } = useScoreColor(score);

  const sizeConfig = useMemo(() => ({
    sm: { radius: 30, strokeWidth: 6, textSize: 'text-2xl' },
    md: { radius: 45, strokeWidth: 8, textSize: 'text-3xl' },
    lg: { radius: 60, strokeWidth: 10, textSize: 'text-5xl' },
  }), []);

  const config = sizeConfig[size];
  const circumference = 2 * Math.PI * config.radius;
  const progress = useMemo(() =>
    (score / 100) * circumference,
    [score, circumference]
  );

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {label}
      </h3>
      <div className="flex items-center gap-6">
        {/* Circular Progress */}
        {showProgress && (
          <div className={`relative w-32 h-32`}>
            <svg className="w-32 h-32 transform -rotate-90">
              {/* Background circle */}
              <circle
                cx="64"
                cy="64"
                r={config.radius}
                fill="none"
                stroke="currentColor"
                strokeWidth={config.strokeWidth}
                className="text-gray-200 dark:text-gray-700"
              />
              {/* Progress circle */}
              <circle
                cx="64"
                cy="64"
                r={config.radius}
                fill="none"
                stroke="currentColor"
                strokeWidth={config.strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={circumference - progress}
                strokeLinecap="round"
                className={`transition-all duration-1000 ${colorClass}`}
              />
            </svg>
            {/* Score text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className={`${config.textSize} font-bold text-gray-900 dark:text-white`}>
                  {Math.round(score)}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">/ 100</div>
              </div>
            </div>
          </div>
        )}

        {/* Description */}
        <div className="flex-1">
          <div className={`inline-flex px-4 py-2 rounded-lg border ${gradientClass} text-2xl font-bold mb-2`}>
            {labelText}
          </div>
          {description && (
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
});

ScoreDisplay.displayName = 'ScoreDisplay';
```

---

#### 2.4 MetricCard Component
**目的:** メトリクス表示カードの共通化

**ファイル:** `app/components/ui/shared/MetricCard.tsx`

```typescript
/**
 * MetricCard Component
 *
 * @description Displays a metric with icon, value, and optional progress bar
 * Used in Reading Time, Virality, and other metric-heavy tabs
 *
 * @example
 * <MetricCard
 *   title="読了時間"
 *   value="5分"
 *   icon={<Icon name="clock" />}
 *   color="blue"
 *   progress={75}
 * />
 */

import React from 'react';
import type { ColorVariant } from '@/app/types/ui';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  color?: ColorVariant;
  progress?: number;
  className?: string;
}

const COLOR_CLASSES: Record<ColorVariant, string> = {
  blue: 'from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-200 dark:border-blue-800',
  green: 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800',
  purple: 'from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border-purple-200 dark:border-purple-800',
  orange: 'from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border-orange-200 dark:border-orange-800',
  red: 'from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border-red-200 dark:border-red-800',
};

const PROGRESS_COLOR: Record<ColorVariant, string> = {
  blue: 'bg-blue-600 dark:bg-blue-400',
  green: 'bg-green-600 dark:bg-green-400',
  purple: 'bg-purple-600 dark:bg-purple-400',
  orange: 'bg-orange-600 dark:bg-orange-400',
  red: 'bg-red-600 dark:bg-red-400',
};

export const MetricCard = React.memo<MetricCardProps>(({
  title,
  value,
  icon,
  color = 'blue',
  progress,
  className = ''
}) => {
  return (
    <div className={`bg-gradient-to-br ${COLOR_CLASSES[color]} rounded-lg p-4 border hover:shadow-md transition-all ${className}`}>
      <div className="flex items-center justify-between mb-2">
        {icon && <div className="flex-shrink-0">{icon}</div>}
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex-1 ml-2">
          {title}
        </h4>
        <span className="text-2xl font-bold text-gray-900 dark:text-white">
          {value}
        </span>
      </div>
      {progress !== undefined && (
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-3">
          <div
            className={`h-2 rounded-full transition-all ${PROGRESS_COLOR[color]}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
});

MetricCard.displayName = 'MetricCard';
```

---

#### 2.5 CopyableText Component
**目的:** InsightsTabで使用するコピー可能なテキスト領域

**ファイル:** `app/components/ui/shared/CopyableText.tsx`

```typescript
/**
 * CopyableText Component
 *
 * @description Textarea with copy button for formatted text
 * Used in InsightsTab for combined insights display
 *
 * @example
 * <CopyableText
 *   value={formattedText}
 *   label="記事の魅力ポイント"
 *   rows={10}
 * />
 */

import React, { useCallback } from 'react';
import { useCopyToClipboard } from '@/app/hooks/useCopyToClipboard';
import { Icon } from './Icon';
import { BUTTON_TEXT } from '@/app/constants/text.constants';

interface CopyableTextProps {
  value: string;
  label: string;
  rows?: number;
  className?: string;
}

export const CopyableText = React.memo<CopyableTextProps>(({
  value,
  label,
  rows = 10,
  className = ''
}) => {
  const { copy, isCopied } = useCopyToClipboard();
  const itemId = `copyable-${label}`;

  const handleCopy = useCallback(() => {
    copy(value, itemId);
  }, [copy, value, itemId]);

  const handleClick = useCallback((e: React.MouseEvent<HTMLTextAreaElement>) => {
    e.currentTarget.select();
  }, []);

  return (
    <div className={`bg-white dark:bg-gray-700 rounded-xl p-6 border-2 border-gray-200 dark:border-gray-600 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-base font-semibold text-gray-900 dark:text-gray-100">
          {label}
        </h4>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all text-sm font-medium shadow-md hover:shadow-lg"
          aria-label={isCopied(itemId) ? BUTTON_TEXT.copied : BUTTON_TEXT.copy}
        >
          {isCopied(itemId) ? (
            <>
              <Icon name="check" size="sm" />
              {BUTTON_TEXT.copied}
            </>
          ) : (
            <>
              <Icon name="copy" size="sm" />
              {BUTTON_TEXT.copyAll}
            </>
          )}
        </button>
      </div>
      <textarea
        value={value}
        readOnly
        rows={rows}
        className="w-full px-4 py-3 text-sm text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-y font-sans leading-relaxed"
        onClick={handleClick}
      />
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
        クリックすると全選択されます。編集はできません。
      </p>
    </div>
  );
});

CopyableText.displayName = 'CopyableText';
```

---

### B. 共通カスタムフック (新規作成)

#### 2.6 useScoreColor Hook
**目的:** スコアに基づく色選択ロジックの共通化

**ファイル:** `app/hooks/useScoreColor.ts`

```typescript
/**
 * useScoreColor Hook
 *
 * @description Returns color classes based on score value
 * Unifies score color logic across Virality, Monetization, and SEO tabs
 *
 * @example
 * const { colorClass, gradientClass, labelText } = useScoreColor(85);
 * // colorClass: 'text-green-500'
 * // gradientClass: 'bg-gradient-to-br from-green-500 to-emerald-600'
 * // labelText: 'A'
 */

import { useMemo } from 'react';

interface ScoreColorResult {
  colorClass: string;
  gradientClass: string;
  bgClass: string;
  borderClass: string;
  labelText: string;
  description: string;
}

export function useScoreColor(score: number): ScoreColorResult {
  return useMemo(() => {
    if (score >= 80) {
      return {
        colorClass: 'text-green-500',
        gradientClass: 'bg-gradient-to-br from-green-500 to-emerald-600',
        bgClass: 'bg-green-50 dark:bg-green-900/20',
        borderClass: 'border-green-200 dark:border-green-800',
        labelText: 'A',
        description: '非常に高い',
      };
    }
    if (score >= 60) {
      return {
        colorClass: 'text-blue-500',
        gradientClass: 'bg-gradient-to-br from-blue-500 to-cyan-600',
        bgClass: 'bg-blue-50 dark:bg-blue-900/20',
        borderClass: 'border-blue-200 dark:border-blue-800',
        labelText: 'B',
        description: '高い',
      };
    }
    if (score >= 40) {
      return {
        colorClass: 'text-yellow-500',
        gradientClass: 'bg-gradient-to-br from-yellow-500 to-orange-600',
        bgClass: 'bg-yellow-50 dark:bg-yellow-900/20',
        borderClass: 'border-yellow-200 dark:border-yellow-800',
        labelText: 'C',
        description: '中程度',
      };
    }
    if (score >= 20) {
      return {
        colorClass: 'text-orange-500',
        gradientClass: 'bg-gradient-to-br from-orange-500 to-red-600',
        bgClass: 'bg-orange-50 dark:bg-orange-900/20',
        borderClass: 'border-orange-200 dark:border-orange-800',
        labelText: 'D',
        description: '要改善',
      };
    }
    return {
      colorClass: 'text-red-500',
      gradientClass: 'bg-gradient-to-br from-red-500 to-pink-600',
      bgClass: 'bg-red-50 dark:bg-red-900/20',
      borderClass: 'border-red-200 dark:border-red-800',
      labelText: 'F',
      description: '低い',
    };
  }, [score]);
}
```

**効果:**
- コード削減: 約60行 (3箇所の重複削除)
- 一貫性: スコア基準が統一される

---

#### 2.7 useCopyToClipboard Hook (改善版)
**目的:** useClipboardとCopyButtonの統合

**ファイル:** `app/hooks/useCopyToClipboard.ts`

```typescript
/**
 * useCopyToClipboard Hook
 *
 * @description Unified clipboard management hook
 * Replaces both useClipboard and CopyButton's internal state
 *
 * @example
 * const { copy, isCopied, reset } = useCopyToClipboard();
 *
 * <button onClick={() => copy('text', 'id')}>
 *   {isCopied('id') ? 'Copied!' : 'Copy'}
 * </button>
 */

import { useState, useCallback, useRef, useEffect } from 'react';

interface CopyOptions {
  timeout?: number;
  onSuccess?: (text: string) => void;
  onError?: (error: Error) => void;
}

interface UseCopyToClipboardReturn {
  copy: (text: string, itemId: string) => Promise<boolean>;
  copiedId: string | null;
  isCopied: (itemId: string) => boolean;
  reset: () => void;
}

/**
 * Hook for managing clipboard copy operations with feedback
 *
 * @param options - Configuration options
 * @returns Clipboard utilities
 */
export function useCopyToClipboard(options: CopyOptions = {}): UseCopyToClipboardReturn {
  const { timeout = 2000, onSuccess, onError } = options;
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const copy = useCallback(
    async (text: string, itemId: string): Promise<boolean> => {
      try {
        await navigator.clipboard.writeText(text);
        setCopiedId(itemId);
        onSuccess?.(text);

        // Clear previous timeout
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        // Set new timeout
        timeoutRef.current = setTimeout(() => {
          setCopiedId(null);
        }, timeout);

        return true;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to copy');
        console.error('Failed to copy:', error);
        onError?.(error);
        return false;
      }
    },
    [timeout, onSuccess, onError]
  );

  const isCopied = useCallback(
    (itemId: string) => copiedId === itemId,
    [copiedId]
  );

  const reset = useCallback(() => {
    setCopiedId(null);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  return { copy, copiedId, isCopied, reset };
}
```

---

#### 2.8 useFormattedText Hook
**目的:** InsightsTabのformatCombinedText最適化

**ファイル:** `app/hooks/useFormattedText.ts`

```typescript
/**
 * useFormattedText Hook
 *
 * @description Memoized text formatting for Insights tab
 * Prevents unnecessary recalculation on every render
 *
 * @example
 * const formattedText = useFormattedText(insights);
 */

import { useMemo } from 'react';

interface Insights {
  whatYouLearn?: string[];
  benefits?: string[];
  recommendedFor?: string[];
}

export function useFormattedText(insights: Insights | undefined): string {
  return useMemo(() => {
    if (!insights) return '';

    const sections: string[] = [];

    // Add "学べること" section
    if (insights.whatYouLearn && insights.whatYouLearn.length > 0) {
      sections.push('【学べること】');
      insights.whatYouLearn.forEach((item, index) => {
        sections.push(`${index + 1}. ${item}`);
      });
      sections.push(''); // Empty line
    }

    // Add "読むメリット" section
    if (insights.benefits && insights.benefits.length > 0) {
      sections.push('【読むメリット】');
      insights.benefits.forEach((item, index) => {
        sections.push(`${index + 1}. ${item}`);
      });
      sections.push(''); // Empty line
    }

    // Add "おすすめの読者" section
    if (insights.recommendedFor && insights.recommendedFor.length > 0) {
      sections.push('【おすすめの読者】');
      insights.recommendedFor.forEach((item, index) => {
        sections.push(`${index + 1}. ${item}`);
      });
    }

    return sections.join('\n');
  }, [insights]);
}
```

---

### C. 設定ファイル (新規作成)

#### 2.9 icons.config.tsx
**目的:** アイコンとタブ定義の一元管理

**ファイル:** `app/config/icons.config.tsx`

```typescript
/**
 * Icons Configuration
 *
 * @description Centralized icon and tab definitions
 * Moved from AnalysisResults.tsx (91 lines) to dedicated config
 */

import React from 'react';
import { Icon } from '@/app/components/ui/shared/Icon';
import { TabId } from '@/app/types/ui';
import { TAB_TEXT } from '@/app/constants/text.constants';

export interface TabConfig {
  id: TabId;
  label: string;
  icon: React.ReactNode;
}

export const ANALYSIS_TABS: TabConfig[] = [
  {
    id: 'titles',
    label: TAB_TEXT.titles,
    icon: <Icon name="title" />,
  },
  {
    id: 'insights',
    label: TAB_TEXT.insights,
    icon: <Icon name="insights" />,
  },
  {
    id: 'image',
    label: TAB_TEXT.image,
    icon: <Icon name="image" />,
  },
  {
    id: 'hashtags',
    label: TAB_TEXT.hashtags,
    icon: <Icon name="hashtag" />,
  },
  {
    id: 'virality',
    label: TAB_TEXT.virality,
    icon: <Icon name="virality" />,
  },
  {
    id: 'readingTime',
    label: TAB_TEXT.readingTime,
    icon: <Icon name="clock" />,
  },
  {
    id: 'rewrite',
    label: TAB_TEXT.rewrite,
    icon: <Icon name="edit" />,
  },
  {
    id: 'series',
    label: TAB_TEXT.series,
    icon: <Icon name="series" />,
  },
  {
    id: 'monetization',
    label: TAB_TEXT.monetization,
    icon: <Icon name="money" />,
  },
  {
    id: 'emotional',
    label: TAB_TEXT.emotional,
    icon: <Icon name="emoji" />,
  },
];
```

---

## 3. パフォーマンス改善の具体案

### A. React.memoの適用

**対象:** すべてのタブコンポーネント

**Before:**
```typescript
export function HashtagsTab({ data }: TabProps) {
  // Component logic
}
```

**After:**
```typescript
export const HashtagsTab = React.memo<TabProps>(({ data }) => {
  // Component logic
});

HashtagsTab.displayName = 'HashtagsTab';
```

**効果:**
- 非アクティブなタブの再レンダーを防止
- 親コンポーネントの再レンダー時のパフォーマンス向上

---

### B. useMemoによる計算キャッシュ

**対象:** InsightsTab, ViralityTab, MonetizationTab

**例: InsightsTab**

**Before (毎レンダーで実行):**
```typescript
const formatCombinedText = () => {
  const sections: string[] = [];
  // Heavy processing...
  return sections.join('\n');
};
```

**After (メモ化):**
```typescript
import { useFormattedText } from '@/app/hooks/useFormattedText';

const formattedText = useFormattedText(insights);
```

**効果:**
- 再レンダー時の不要な計算を削減
- パフォーマンス改善: ~30-50ms/render

---

### C. コード分割 (React.lazy + Suspense)

**目的:** 初期バンドルサイズの削減

**ファイル:** `app/components/features/AnalysisResults/AnalysisResults.tsx`

**Before:**
```typescript
import { TitlesTab } from './TitlesTab';
import { InsightsTab } from './InsightsTab';
// ... 10 imports
```

**After:**
```typescript
import React, { lazy, Suspense } from 'react';

// Lazy load tab components
const TitlesTab = lazy(() => import('./TitlesTab'));
const InsightsTab = lazy(() => import('./InsightsTab'));
const EyeCatchTab = lazy(() => import('./EyeCatchTab'));
const HashtagsTab = lazy(() => import('./HashtagsTab'));
const ViralityTab = lazy(() => import('./ViralityTab'));
const ReadingTimeTab = lazy(() => import('./ReadingTimeTab'));
const RewriteTab = lazy(() => import('./RewriteTab'));
const SeriesTab = lazy(() => import('./SeriesTab'));
const MonetizationTab = lazy(() => import('./MonetizationTab'));
const EmotionalTab = lazy(() => import('./EmotionalTab'));
const SEOTab = lazy(() => import('./SEOTab'));

// Skeleton component for loading state
const TabSkeleton = () => (
  <div className="animate-pulse space-y-4 p-6">
    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
    <div className="space-y-3">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
    </div>
  </div>
);

// Render active tab with Suspense
const renderActiveTab = (activeTab: TabId, data: AnalysisData) => {
  const tabComponents: Record<TabId, React.ComponentType<any>> = {
    titles: TitlesTab,
    insights: InsightsTab,
    image: EyeCatchTab,
    hashtags: HashtagsTab,
    virality: ViralityTab,
    readingTime: ReadingTimeTab,
    rewrite: RewriteTab,
    series: SeriesTab,
    monetization: MonetizationTab,
    emotional: EmotionalTab,
    seo: SEOTab,
  };

  const Component = tabComponents[activeTab];

  return (
    <Suspense fallback={<TabSkeleton />}>
      <Component data={data} />
    </Suspense>
  );
};
```

**効果:**
- 初期バンドルサイズ: ~40% 削減
- Time to Interactive: ~500ms 改善
- 非アクティブなタブは必要になるまでロードされない

---

### D. バンドル最適化

#### SVGアイコンの最適化

**Before:** 各コンポーネントでインラインSVG (15KB)

**After:**
1. Icon componentで一元管理
2. または`react-icons`への移行を検討

```bash
npm install react-icons
```

```typescript
import {
  FiHash,     // hashtag
  FiMessageSquare,  // title
  FiFileText, // insights
  FiImage,    // image
  FiZap,      // virality
  FiClock,    // clock
  FiEdit2,    // edit
  FiBook,     // series
  FiDollarSign, // money
  FiSmile     // emoji
} from 'react-icons/fi';
```

**効果:**
- バンドルサイズ削減: ~10-12KB
- Tree-shaking: 未使用のアイコンは除外される

---

## 4. 型安全性の強化

### A. 統合型定義ファイル

**ファイル:** `app/types/analysis.ts` (新規作成)

```typescript
/**
 * Unified Analysis Type Definitions
 *
 * @description Complete type definitions for all analysis features
 * Replaces fragmented types across article-analysis.ts and AnalysisResults.types.ts
 */

// ============================================================================
// Core Analysis Types
// ============================================================================

/**
 * Virality Score Analysis
 */
export interface ViralityScore {
  overall: number;
  titleAppeal: number;
  openingHook: number;
  empathy: number;
  shareability: number;
  improvements?: string[];
}

/**
 * Reading Time Breakdown
 */
export interface ReadingTime {
  total: string;
  introduction: string;
  mainContent: string;
  conclusion: string;
}

/**
 * Monetization Analysis
 */
export interface MonetizationAnalysis {
  score: number;
  recommendations: MonetizationRecommendation[];
}

export interface MonetizationRecommendation {
  method: string;
  difficulty: '低' | '中' | '高';
  expectedRevenue: string;
  description: string;
}

/**
 * SEO Analysis
 */
export interface SEOAnalysis {
  score: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  metaDescription: string;
  optimizedSlug: string;
  improvements: SEOImprovements;
  keywords: SEOKeywords;
  readability: Readability;
  structure: ContentStructure;
  imageOptimization?: ImageOptimization;
  internalLinking?: InternalLinking;
  usage?: TokenUsage;
}

export interface SEOImprovements {
  critical: string[];
  important: string[];
  optional: string[];
}

export interface SEOKeywords {
  primary: string[];
  secondary: string[];
  longTail?: string[];
  density: Record<string, number>;
}

export interface Readability {
  score: number;
  level: string;
  averageSentenceLength: number;
  kanjiRatio?: number;
}

export interface ContentStructure {
  characterCount: number;
  paragraphCount: number;
  headingCount: number;
  readingTimeMinutes: number;
}

export interface ImageOptimization {
  recommendedImageCount: number;
  altTextSuggestions: string[];
}

export interface InternalLinking {
  suggestedAnchors: string[];
  relatedTopics: string[];
}

export interface TokenUsage {
  inputTokens: number;
  outputTokens: number;
  totalCost: number;
}

/**
 * Eye-Catch Image Generation Data
 */
export interface EyeCatchImage {
  mainPrompt: string;
  compositionIdeas: string[];
  colorPalette: string[];
  mood: string;
  style: string;
  summary?: string;
}

/**
 * Article Insights
 */
export interface ArticleInsights {
  whatYouLearn: string[];
  benefits: string[];
  recommendedFor: string[];
  oneLiner: string;
}

/**
 * Emotional Analysis
 */
export interface EmotionalAnalysis {
  tone: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  emotionalImpact: number;
  suggestedAdjustments?: string[];
}

/**
 * Rewrite Suggestions
 */
export interface RewriteSuggestions {
  improvedIntroduction?: string;
  improvedConclusion?: string;
  structureSuggestions: string[];
}

/**
 * Series Recommendations
 */
export interface SeriesRecommendations {
  suggestedTopics: string[];
  seriesTitle?: string;
  contentPlan?: string[];
}

// ============================================================================
// Complete Analysis Data
// ============================================================================

/**
 * Complete analysis result containing all features
 */
export interface AnalysisData {
  // Required fields
  hashtags: string[];
  suggestedTitles: string[];

  // Optional analysis features
  insights?: ArticleInsights;
  eyeCatchImage?: EyeCatchImage;
  viralityScore?: ViralityScore;
  readingTime?: ReadingTime;
  rewrite?: RewriteSuggestions;
  series?: SeriesRecommendations;
  monetization?: MonetizationAnalysis;
  emotional?: EmotionalAnalysis;
  seo?: SEOAnalysis;

  // Metadata
  analyzedAt?: string;
  version?: string;
}

// ============================================================================
// Component Props Types
// ============================================================================

/**
 * Base tab component props
 */
export interface BaseTabProps {
  data: AnalysisData;
}

/**
 * Specific tab props (use these instead of Pick<>)
 */
export interface HashtagsTabProps extends BaseTabProps {}
export interface TitlesTabProps extends BaseTabProps {}
export interface InsightsTabProps extends BaseTabProps {}
export interface EyeCatchTabProps extends BaseTabProps {}
export interface ViralityTabProps extends BaseTabProps {}
export interface ReadingTimeTabProps extends BaseTabProps {}
export interface RewriteTabProps extends BaseTabProps {}
export interface SeriesTabProps extends BaseTabProps {}
export interface MonetizationTabProps extends BaseTabProps {}
export interface EmotionalTabProps extends BaseTabProps {}
export interface SEOTabProps extends BaseTabProps {}

// ============================================================================
// API Response Types
// ============================================================================

/**
 * API response wrapper
 */
export interface AnalysisApiResponse {
  success: boolean;
  data?: AnalysisData;
  error?: string;
  timestamp: string;
}
```

**効果:**
- 型の一貫性: 全体で統一された型定義
- Pick<>の削除: より明確な型名
- 補完の改善: IDEでの型推論が向上

---

### B. タブコンポーネントの型定義改善

**Before:**
```typescript
export function HashtagsTab({ data }: Pick<TabContentProps, 'data'>) {
  const hashtags = data.hashtags || [];
  // ...
}
```

**After:**
```typescript
import type { HashtagsTabProps } from '@/app/types/analysis';

export const HashtagsTab = React.memo<HashtagsTabProps>(({ data }) => {
  const hashtags = data.hashtags; // No || [] needed if type is correct
  // ...
});
```

---

## 5. 優先順位付き実装計画

### Phase 1: 基盤整備 (1-2日) 🔴 Critical

**目標:** 共通コンポーネント・ロジックの構築

#### タスク:

✅ **1.1 型定義の統合** (2時間)
- [ ] `app/types/analysis.ts`を作成
- [ ] 既存の型定義をマージ
- [ ] 不要な型ファイルを削除

✅ **1.2 アイコン管理** (3時間)
- [ ] `app/components/ui/shared/Icon.tsx`を作成
- [ ] `app/config/icons.config.tsx`を作成
- [ ] アイコンタイプ定義を追加

✅ **1.3 共通UIコンポーネント** (4時間)
- [ ] `EmptyState.tsx`を作成
- [ ] `ScoreDisplay.tsx`を作成
- [ ] `MetricCard.tsx`を作成
- [ ] `CopyableText.tsx`を作成

✅ **1.4 共通フック** (3時間)
- [ ] `useScoreColor.ts`を作成
- [ ] `useCopyToClipboard.ts`を改善
- [ ] `useFormattedText.ts`を作成

**成果物:**
```
app/
├── components/ui/shared/
│   ├── Icon.tsx (新規)
│   ├── EmptyState.tsx (新規)
│   ├── ScoreDisplay.tsx (新規)
│   ├── MetricCard.tsx (新規)
│   ├── CopyableText.tsx (新規)
│   └── index.ts (エクスポート)
├── config/
│   ├── icons.config.tsx (新規)
│   └── scoring.config.ts (新規)
├── hooks/
│   ├── useScoreColor.ts (新規)
│   ├── useCopyToClipboard.ts (改善)
│   ├── useFormattedText.ts (新規)
│   └── index.ts (エクスポート)
└── types/
    └── analysis.ts (統合)
```

**検証:**
- すべてのコンポーネントが正常にビルド
- 型エラーがゼロ
- Storybookで各コンポーネントを確認 (optional)

---

### Phase 2: タブコンポーネントのリファクタリング (2-3日) 🟡 High

**目標:** 重複コード削除とパフォーマンス改善

#### タスク:

✅ **2.1 HashtagsTab** (1時間)
- [ ] React.memo適用
- [ ] EmptyState使用
- [ ] Icon使用
- [ ] useCopyToClipboard統合

✅ **2.2 TitlesTab** (1時間)
- [ ] React.memo適用
- [ ] EmptyState使用
- [ ] Icon使用

✅ **2.3 InsightsTab** (1.5時間)
- [ ] React.memo適用
- [ ] useFormattedText使用
- [ ] CopyableText使用

✅ **2.4 ViralityTab** (2時間)
- [ ] React.memo適用
- [ ] ScoreDisplay使用
- [ ] MetricCard使用
- [ ] useScoreColor使用

✅ **2.5 MonetizationTab** (2時間)
- [ ] React.memo適用
- [ ] ScoreDisplay使用
- [ ] useScoreColor使用

✅ **2.6 SEOTab** (3時間)
- [ ] サブコンポーネントを別ファイルに分離
- [ ] ScoreDisplay使用
- [ ] React.memo適用

✅ **2.7 その他のタブ** (2時間)
- [ ] ReadingTimeTab: MetricCard使用
- [ ] EyeCatchTab: EmptyState使用
- [ ] RewriteTab, SeriesTab, EmotionalTabの確認

**成果物:**
```typescript
// Before: 50-100 lines per tab
// After: 30-50 lines per tab

// Example: HashtagsTab.tsx (Before: 79 lines → After: ~40 lines)
import React from 'react';
import { EmptyState, Icon } from '@/app/components/ui/shared';
import { useCopyToClipboard } from '@/app/hooks';
import type { HashtagsTabProps } from '@/app/types/analysis';

export const HashtagsTab = React.memo<HashtagsTabProps>(({ data }) => {
  const hashtags = data.hashtags;
  const { copy, isCopied } = useCopyToClipboard();

  if (!hashtags || hashtags.length === 0) {
    return <EmptyState icon="hashtag" message="ハッシュタグが生成されませんでした" />;
  }

  // ... simplified implementation
});
```

**改善指標:**
- [ ] コード削減: 30-40% (約300行削減)
- [ ] 重複削除: 完全に削除
- [ ] 再レンダー回数: 50%削減 (React DevTools Profilerで確認)

---

### Phase 3: メインコンポーネントの最適化 (1日) 🟢 Medium

**目標:** `AnalysisResults.tsx`の整理と最適化

#### タスク:

✅ **3.1 タブ定義の外部化** (1時間)
- [ ] `ANALYSIS_TABS`を`icons.config.tsx`へ移動
- [ ] `AnalysisResults.tsx`から91行のJSXを削除

✅ **3.2 コード分割** (2時間)
- [ ] React.lazyでタブコンポーネントを動的インポート
- [ ] Suspense + TabSkeletonの追加
- [ ] renderActiveTab関数の実装

✅ **3.3 useTabState導入** (1時間)
- [ ] タブ状態管理フックの作成
- [ ] URL同期機能の追加 (optional)

**成果物:**
```typescript
// app/components/features/AnalysisResults/AnalysisResults.tsx
// Before: 188 lines
// After: 60-70 lines

import React, { lazy, Suspense } from 'react';
import { Card } from '@/app/components/ui/Card/Card';
import { TabsContainer, TabPanel } from '@/app/components/ui/Tabs/Tabs';
import { ANALYSIS_TABS } from '@/app/config/icons.config';
import { useTabState } from '@/app/hooks/useTabState';
import type { AnalysisResultsProps } from '@/app/types/analysis';

// Lazy load tabs
const TitlesTab = lazy(() => import('./TitlesTab'));
const InsightsTab = lazy(() => import('./InsightsTab'));
// ... other tabs

const TabSkeleton = () => (/* ... */);

export function AnalysisResults({ data }: AnalysisResultsProps) {
  const { activeTab, setActiveTab } = useTabState('titles');

  return (
    <Card className="overflow-hidden">
      <TabsContainer
        tabs={ANALYSIS_TABS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      <Suspense fallback={<TabSkeleton />}>
        {renderActiveTab(activeTab, data)}
      </Suspense>
    </Card>
  );
}
```

**検証:**
- [ ] バンドルサイズ: 初期ロードが~40%削減
- [ ] Lighthouse Performance: 90+
- [ ] タブ切り替えが滑らか

---

### Phase 4: 型安全性の強化 (1日) ⚪ Low

**目標:** TypeScriptの型定義を完全に整備

#### タスク:

✅ **4.1 型定義の完全化** (3時間)
- [ ] すべてのコンポーネントで型エラーをゼロに
- [ ] Utility型の活用 (Required, NonNullable)
- [ ] 型ガード関数の追加

✅ **4.2 ランタイム型検証 (optional)** (2時間)
- [ ] Zodスキーマの定義
- [ ] API レスポンスの検証

```typescript
import { z } from 'zod';

const AnalysisDataSchema = z.object({
  hashtags: z.array(z.string()),
  suggestedTitles: z.array(z.string()),
  insights: z.object({
    whatYouLearn: z.array(z.string()),
    benefits: z.array(z.string()),
    recommendedFor: z.array(z.string()),
    oneLiner: z.string(),
  }).optional(),
  // ... other fields
});

export type AnalysisData = z.infer<typeof AnalysisDataSchema>;
```

---

### Phase 5: アクセシビリティ対応 (1日) ⚪ Low

**目標:** WCAG 2.1 AA準拠

#### タスク:

✅ **5.1 ARIA属性の追加** (2時間)
- [ ] タブにrole="tablist"、role="tab"を追加
- [ ] aria-label、aria-selectedの実装
- [ ] aria-controlsとaria-labelledbyの関連付け

✅ **5.2 キーボードナビゲーション** (2時間)
- [ ] 矢印キーでタブ移動
- [ ] Home/Endキーで最初/最後のタブへ
- [ ] Enterキーでタブ選択

✅ **5.3 フォーカス管理** (1時間)
- [ ] useFocusManagementフックの作成
- [ ] タブ切り替え時のフォーカス移動

✅ **5.4 コントラスト比の確認** (1時間)
- [ ] axe DevToolsでチェック
- [ ] 必要に応じて色を調整

---

## 6. 実装の優先順位

### 即時実施 (Today) 🔴
1. Icon componentの作成
2. EmptyStateの作成
3. useScoreColorの作成
4. HashtagsTab, TitlesTabのリファクタリング

### 今週中 (This Week) 🟡
1. すべてのタブコンポーネントのリファクタリング
2. ScoreDisplay, MetricCardの作成
3. AnalysisResults.tsxの最適化

### 来週 (Next Week) 🟢
1. コード分割 (React.lazy)
2. 型定義の完全化
3. アクセシビリティ対応

### 将来的に (Future) ⚪
1. Zodによるランタイム型検証
2. Storybookの追加
3. E2Eテストの追加 (Playwright)

---

## 7. 成功指標 (KPI)

### コード品質
- [ ] コード削減: 500-700行 (30-40%)
- [ ] 重複削除: 完全に削除
- [ ] TypeScript型エラー: ゼロ
- [ ] ESLint警告: ゼロ

### パフォーマンス
- [ ] 初期バンドルサイズ: 40%削減
- [ ] 再レンダー回数: 50%削減
- [ ] Time to Interactive: 500ms改善
- [ ] Lighthouse Performance: 90+

### 保守性
- [ ] コンポーネントの平均行数: 50行以下
- [ ] 共通コンポーネント再利用率: 80%以上
- [ ] ドキュメント完備率: 100%

---

## 8. リスクと対策

### リスク1: 既存機能の破壊
**対策:**
- 各フェーズ後に手動テストを実施
- リファクタリング前後でスクリーンショットを比較
- E2Eテストの追加 (optional)

### リスク2: スケジュール遅延
**対策:**
- Phase 1, 2を最優先
- Phase 4, 5は必要に応じて延期可能

### リスク3: パフォーマンス改悪
**対策:**
- React DevTools Profilerで計測
- Lighthouseで継続的に確認

---

## 9. 次のステップ

### 今すぐ始める
1. このリファクタリング計画を確認
2. Phase 1のタスクから開始
3. 各コンポーネント作成後、即座に既存コードに統合

### 質問・疑問があれば
- 各フェーズの実装方法
- コンポーネント設計の詳細
- パフォーマンス計測方法

いつでもサポートします！

---

**作成日:** 2025-10-26
**対象プロジェクト:** C:\Users\tyobi\note-hashtag-ai-generator
**バージョン:** 1.0
