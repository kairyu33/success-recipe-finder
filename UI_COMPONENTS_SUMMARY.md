# UI Components Summary - Note Hashtag AI Generator

## Overview

5つの新しいプレミアムUIコンポーネントを作成しました。すべて purple-cyan グラデーションデザインシステム、Glassmorphism、アニメーションに対応しています。

---

## 作成されたコンポーネント一覧

### 1. EmptyState Component
**パス**: `app/components/ui/EmptyState/EmptyState.tsx`

**機能**:
- データがない時の美しい空状態表示
- 3つのサイズバリアント (sm, md, lg)
- グラデーションアイコン背景
- スムーズなエントランスアニメーション
- プリセットバリアント（NoData, NoResults, Error）
- オプションのアクションボタン

**使用例**:
```tsx
import { EmptyState, NoDataEmptyState } from '@/app/components/ui';

// 基本的な使用
<EmptyState
  icon={<SparklesIcon />}
  title="データがありません"
  description="分析を実行すると、ここに結果が表示されます"
  size="md"
/>

// プリセット
<NoDataEmptyState message="分析結果がありません" />
```

**プロパティ**:
- `icon?: ReactNode` - 表示するアイコン
- `title: string` - メインタイトル
- `description?: string` - 説明文
- `action?: ReactNode` - アクションボタン
- `size?: 'sm' | 'md' | 'lg'` - サイズ
- `animated?: boolean` - アニメーション有効化

---

### 2. SectionHeader Component
**パス**: `app/components/ui/SectionHeader/SectionHeader.tsx`

**機能**:
- アイコン付きセクションヘッダー
- グラデーションテキスト対応
- 3つのアライメントオプション
- バッジとアクションボタン対応
- コンパクトバリアント、ディバイダーバリアント

**使用例**:
```tsx
import { SectionHeader, CompactSectionHeader } from '@/app/components/ui';

// フル機能
<SectionHeader
  icon={<BoltIcon />}
  title="AI分析結果"
  description="人工知能による深い洞察"
  gradient
  badge={<Badge variant="success">New</Badge>}
  action={<Button>詳細</Button>}
/>

// コンパクト版
<CompactSectionHeader
  title="統計"
  icon={<ChartIcon />}
/>
```

**プロパティ**:
- `icon?: ReactNode` - アイコン
- `title: string` - タイトル
- `description?: string` - 説明
- `gradient?: boolean` - グラデーションテキスト
- `align?: 'left' | 'center' | 'right'` - 配置
- `size?: 'sm' | 'md' | 'lg'` - サイズ
- `badge?: ReactNode` - バッジ
- `action?: ReactNode` - アクション

---

### 3. ProgressBar Component
**パス**: `app/components/ui/ProgressBar/ProgressBar.tsx`

**機能**:
- リニア・サーキュラープログレスバー
- グラデーション対応
- シマーアニメーション
- ラベル位置オプション（inside, outside, top）
- マルチセグメントバー
- スムーズなアニメーション

**使用例**:
```tsx
import { ProgressBar, CircularProgress, SegmentedProgressBar } from '@/app/components/ui';

// リニアプログレスバー
<ProgressBar
  value={75}
  max={100}
  color="gradient"
  showLabel
  labelPosition="outside"
  animated
  shimmer
/>

// サーキュラープログレス
<CircularProgress
  value={85}
  max={100}
  size={120}
  strokeWidth={12}
  color="gradient"
/>

// セグメント型
<SegmentedProgressBar
  segments={[
    { value: 30, color: 'bg-green-500', label: '優秀' },
    { value: 50, color: 'bg-blue-500', label: '良好' },
    { value: 20, color: 'bg-amber-500', label: '普通' },
  ]}
  showLabels
/>
```

**プロパティ**:
- `value: number` - 現在値
- `max?: number` - 最大値（デフォルト: 100）
- `color?: 'primary' | 'accent' | 'success' | 'warning' | 'error' | 'gradient'`
- `size?: 'xs' | 'sm' | 'md' | 'lg'` - 高さ
- `showLabel?: boolean` - ラベル表示
- `animated?: boolean` - アニメーション
- `shimmer?: boolean` - シマーエフェクト

---

### 4. BadgeList Component
**パス**: `app/components/ui/BadgeList/BadgeList.tsx`

**機能**:
- インタラクティブなバッジコレクション
- クリックでコピー機能
- 削除可能バッジ
- 「もっと見る」機能
- 全てコピーボタン
- スタガーアニメーション

**使用例**:
```tsx
import { BadgeList, HashtagList } from '@/app/components/ui';

// 基本的な使用
<BadgeList
  items={['#design', '#ui', '#react', '#nextjs']}
  variant="primary"
  copyable
  onCopy={(item) => console.log('Copied:', item)}
/>

// アイコン付き
<BadgeList
  items={[
    { label: 'Featured', icon: <StarIcon />, value: 'featured' },
    { label: 'New', icon: <SparklesIcon />, value: 'new' },
  ]}
  variant="gradient"
/>

// ハッシュタグ専用
<HashtagList
  hashtags={['design', 'ui', 'react']}
  onCopy={(tag) => toast.success(`Copied: ${tag}`)}
/>

// 削除可能
<BadgeList
  items={tags}
  removable
  onRemove={(item, index) => handleRemove(index)}
/>
```

**プロパティ**:
- `items: string[] | Array<{label, value?, icon?}>` - バッジアイテム
- `variant?: 'default' | 'primary' | 'accent' | 'success' | 'gradient'`
- `size?: 'sm' | 'md' | 'lg'` - サイズ
- `copyable?: boolean` - コピー機能
- `maxItems?: number` - 最大表示数
- `removable?: boolean` - 削除可能
- `onCopy?: (item: string) => void` - コピーコールバック
- `onRemove?: (item: string, index: number) => void` - 削除コールバック

---

### 5. InfoCard Component
**パス**: `app/components/ui/InfoCard/InfoCard.tsx`

**機能**:
- 構造化された情報表示カード
- 4つのバリアント（default, glass, gradient, outline）
- アイコン位置（top, left）
- ホバーエフェクト
- クリック可能カード
- StatCard、FeatureCardプリセット

**使用例**:
```tsx
import { InfoCard, StatCard, FeatureCard } from '@/app/components/ui';

// 基本的な使用
<InfoCard
  icon={<SparklesIcon />}
  title="AI分析"
  subtitle="GPT-4搭載"
  content={<p>高度なAI分析で深い洞察を提供</p>}
  footer={<Button>詳細を見る</Button>}
  variant="default"
  hoverable
/>

// グラデーントカード
<InfoCard
  icon={<BoltIcon />}
  title="プレミアム機能"
  subtitle="高度な機能を解放"
  variant="gradient"
/>

// ガラスエフェクト
<InfoCard
  icon={<ChartIcon />}
  title="分析ダッシュボード"
  variant="glass"
/>

// 統計カード
<StatCard
  label="総閲覧数"
  value="12,543"
  change="+12.5%"
  changeType="increase"
  icon={<EyeIcon />}
/>

// 機能カード
<FeatureCard
  title="プレミアムプラン"
  description="成長に必要なすべて"
  features={[
    '無制限AI分析',
    '優先サポート',
    '高度な分析',
  ]}
  icon={<StarIcon />}
/>
```

**プロパティ**:
- `icon?: ReactNode` - アイコン
- `iconPosition?: 'top' | 'left'` - アイコン位置
- `title: string` - タイトル
- `subtitle?: string` - サブタイトル
- `content?: ReactNode` - コンテンツ
- `footer?: ReactNode` - フッター
- `variant?: 'default' | 'glass' | 'gradient' | 'outline'`
- `hoverable?: boolean` - ホバーエフェクト
- `onClick?: () => void` - クリックハンドラ

---

## ファイル構造

```
app/components/ui/
├── EmptyState/
│   ├── EmptyState.tsx
│   └── index.ts
├── SectionHeader/
│   ├── SectionHeader.tsx
│   └── index.ts
├── ProgressBar/
│   ├── ProgressBar.tsx
│   └── index.ts
├── BadgeList/
│   ├── BadgeList.tsx
│   └── index.ts
├── InfoCard/
│   ├── InfoCard.tsx
│   └── index.ts
├── index.ts (updated)
└── README.md (new)
```

---

## インポート方法

### 個別インポート
```tsx
import { EmptyState } from '@/app/components/ui/EmptyState';
import { SectionHeader } from '@/app/components/ui/SectionHeader';
```

### 統合インポート（推奨）
```tsx
import {
  EmptyState,
  NoDataEmptyState,
  SectionHeader,
  ProgressBar,
  CircularProgress,
  BadgeList,
  HashtagList,
  InfoCard,
  StatCard,
} from '@/app/components/ui';
```

---

## デザインシステム統合

### カラーパレット
- **Primary**: Purple gradient (#a855f7 → #9333ea)
- **Accent**: Cyan gradient (#06b6d4 → #0891b2)
- **Success**: Green gradient (#10b981 → #14b8a6)
- **Warning**: Amber/Orange gradient (#f59e0b → #ef4444)
- **Error**: Red gradient (#ef4444 → #dc2626)

### アニメーション
すべてのコンポーネントは以下のアニメーションをサポート:
- `fade-in-up`: エントランスアニメーション
- `scale-in`: スケールエントランス
- `shimmer`: ローディングシマーエフェクト
- `pulse-subtle`: サブルパルス

### ダークモード
すべてのコンポーネントは自動的にダークモードに対応しています。

---

## 実際のタブでの使用例

### ViralityTab での使用

```tsx
import {
  SectionHeader,
  CircularProgress,
  ProgressBar,
  NoDataEmptyState,
} from '@/app/components/ui';

export function ViralityTab({ data }: TabContentProps) {
  if (!data.viralityScore) {
    return <NoDataEmptyState message="バイラル性スコアが生成されませんでした" />;
  }

  return (
    <div className="space-y-8">
      <SectionHeader
        icon={<BoltIcon />}
        title="バイラル性分析"
        description="記事がSNSで拡散される可能性を0-100点で評価"
        gradient
      />

      <CircularProgress
        value={data.viralityScore.overall}
        max={100}
        size={160}
        color="gradient"
      />

      <div className="grid grid-cols-2 gap-4">
        <ProgressBar
          value={data.viralityScore.titleAppeal}
          showLabel
          animated
          shimmer
        />
        <ProgressBar
          value={data.viralityScore.empathy}
          showLabel
          animated
          shimmer
        />
      </div>
    </div>
  );
}
```

### HashtagsTab での使用

```tsx
import {
  SectionHeader,
  BadgeList,
  EmptyState,
} from '@/app/components/ui';

export function HashtagsTab({ data }: TabContentProps) {
  if (!data.hashtags?.length) {
    return (
      <EmptyState
        icon={<HashtagIcon />}
        title="ハッシュタグなし"
        description="分析を実行してハッシュタグを生成してください"
      />
    );
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        title="推奨ハッシュタグ"
        icon={<HashtagIcon />}
        description="noteで効果的なハッシュタグ"
      />

      <BadgeList
        items={data.hashtags}
        variant="primary"
        copyable
        maxItems={10}
        onCopy={(tag) => toast.success(`コピーしました: ${tag}`)}
      />
    </div>
  );
}
```

### InsightsTab での使用

```tsx
import {
  SectionHeader,
  InfoCard,
  FeatureCard,
} from '@/app/components/ui';

export function InsightsTab({ data }: TabContentProps) {
  return (
    <div className="space-y-8">
      <SectionHeader
        icon={<LightBulbIcon />}
        title="AI洞察"
        description="記事に対する詳細な分析と改善提案"
        gradient
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InfoCard
          icon={<TrendingUpIcon />}
          title="強み"
          subtitle="この記事の優れた点"
          content={<ul>...</ul>}
          variant="glass"
          hoverable
        />

        <InfoCard
          icon={<ExclamationIcon />}
          title="改善点"
          subtitle="さらに良くするために"
          content={<ul>...</ul>}
          variant="outline"
          hoverable
        />
      </div>

      <FeatureCard
        title="推奨アクション"
        features={data.recommendations}
        icon={<CheckCircleIcon />}
      />
    </div>
  );
}
```

---

## TypeScript型定義

すべてのコンポーネントには完全な型定義が含まれています:

```typescript
// EmptyState
interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

// SectionHeader
interface SectionHeaderProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  gradient?: boolean;
  align?: 'left' | 'center' | 'right';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  action?: ReactNode;
  badge?: ReactNode;
}

// ProgressBar
interface ProgressBarProps {
  value: number;
  max?: number;
  color?: 'primary' | 'accent' | 'success' | 'warning' | 'error' | 'gradient';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  labelPosition?: 'inside' | 'outside' | 'top';
  animated?: boolean;
  shimmer?: boolean;
  label?: ReactNode;
  className?: string;
  rounded?: boolean;
}

// BadgeList
interface BadgeListProps {
  items: string[] | Array<{ label: string; value?: string; icon?: ReactNode }>;
  variant?: 'default' | 'primary' | 'accent' | 'success' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  copyable?: boolean;
  maxItems?: number;
  layout?: 'horizontal' | 'vertical';
  onCopy?: (item: string) => void;
  onClick?: (item: string, index: number) => void;
  className?: string;
  removable?: boolean;
  onRemove?: (item: string, index: number) => void;
}

// InfoCard
interface InfoCardProps {
  icon?: ReactNode;
  iconPosition?: 'top' | 'left';
  title: string;
  subtitle?: string;
  content?: ReactNode;
  footer?: ReactNode;
  variant?: 'default' | 'glass' | 'gradient' | 'outline';
  hoverable?: boolean;
  onClick?: () => void;
  className?: string;
  badge?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}
```

---

## ベストプラクティス

### 1. 一貫したサイズ使用
```tsx
<SectionHeader size="lg" />
<EmptyState size="md" />
<BadgeList size="sm" />
```

### 2. グラデーションの活用
重要なセクションにグラデーションを使用:
```tsx
<SectionHeader title="メイン機能" gradient />
<InfoCard variant="gradient" />
<ProgressBar color="gradient" />
```

### 3. アニメーションの有効化
より良いUXのためにアニメーションを有効化:
```tsx
<EmptyState animated />
<ProgressBar animated shimmer />
```

### 4. アクセシビリティ
すべてのコンポーネントは適切なARIAラベルとキーボードナビゲーションをサポート:
```tsx
<InfoCard onClick={handler} /> // 自動的にキーボードアクセス可能
<BadgeList copyable /> // Enter/Spaceでコピー
```

---

## パフォーマンス最適化

### アニメーション
- CSS transformsを使用（GPU加速）
- `will-change`は控えめに使用
- `prefers-reduced-motion`に対応

### レンダリング
- 必要に応じて`React.memo`を使用可能
- 大きなリストには`maxItems`プロップを使用

---

## アクセシビリティ対応

すべてのコンポーネントは以下に対応:
- ✅ カラーコントラスト比 >= 4.5:1
- ✅ キーボードナビゲーション
- ✅ スクリーンリーダー対応
- ✅ ARIAラベル
- ✅ モーション削減設定（prefers-reduced-motion）

---

## トラブルシューティング

### アニメーションが動かない
globals.cssがインポートされているか確認:
```tsx
// layout.tsx または _app.tsx
import '@/app/globals.css';
```

### グラデーションが表示されない
Tailwind configが正しく設定されているか確認:
```js
// tailwind.config.ts
backgroundImage: {
  'gradient-primary': 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
  // ...
}
```

### ダークモードが動作しない
`darkMode: 'class'`がTailwind configに設定されているか確認。

---

## まとめ

5つの新しいプレミアムUIコンポーネントが完成しました:

1. **EmptyState** - 美しい空状態表示
2. **SectionHeader** - セクションヘッダー
3. **ProgressBar** - プログレスバー（リニア・サーキュラー）
4. **BadgeList** - インタラクティブバッジリスト
5. **InfoCard** - 情報カード

すべてのコンポーネントは:
- ✅ Purple-cyan グラデーションデザインシステム
- ✅ Glassmorphism対応
- ✅ ダークモード対応
- ✅ アニメーション付き
- ✅ TypeScript完全対応
- ✅ 包括的なドキュメント
- ✅ プリセットバリアント
- ✅ アクセシビリティ対応

詳細なドキュメントは `app/components/ui/README.md` を参照してください。
