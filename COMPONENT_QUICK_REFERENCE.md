# UI Component Quick Reference Card

## Import Statement
```tsx
import {
  EmptyState,
  SectionHeader,
  ProgressBar,
  BadgeList,
  InfoCard,
} from '@/app/components/ui';
```

---

## EmptyState - 空状態表示

### 最小限の使用
```tsx
<EmptyState
  title="データなし"
  description="分析を実行してください"
/>
```

### フル機能
```tsx
<EmptyState
  icon={<Icon />}
  title="データなし"
  description="説明文"
  action={<Button>アクション</Button>}
  size="md"
  animated
/>
```

### プリセット
```tsx
<NoDataEmptyState message="カスタムメッセージ" />
<NoResultsEmptyState query="検索クエリ" />
<ErrorEmptyState message="エラーメッセージ" />
```

---

## SectionHeader - セクションヘッダー

### 最小限の使用
```tsx
<SectionHeader title="セクションタイトル" />
```

### フル機能
```tsx
<SectionHeader
  icon={<Icon />}
  title="タイトル"
  description="説明"
  gradient
  badge={<Badge>New</Badge>}
  action={<Button>アクション</Button>}
  size="md"
  align="left"
/>
```

### バリアント
```tsx
<CompactSectionHeader title="タイトル" icon={<Icon />} />
<SectionDivider title="区切り" />
<SectionHeaderWithUnderline title="タイトル" subtitle="サブ" />
```

---

## ProgressBar - プログレスバー

### リニア
```tsx
<ProgressBar
  value={75}
  max={100}
  color="gradient"
  showLabel
  animated
  shimmer
/>
```

### サーキュラー
```tsx
<CircularProgress
  value={85}
  size={120}
  color="gradient"
  showLabel
/>
```

### セグメント
```tsx
<SegmentedProgressBar
  segments={[
    { value: 30, color: 'bg-green-500', label: 'A' },
    { value: 70, color: 'bg-blue-500', label: 'B' },
  ]}
  showLabels
/>
```

### カラーオプション
`'primary' | 'accent' | 'success' | 'warning' | 'error' | 'gradient'`

---

## BadgeList - バッジリスト

### 基本
```tsx
<BadgeList
  items={['タグ1', 'タグ2', 'タグ3']}
  variant="primary"
/>
```

### コピー可能
```tsx
<BadgeList
  items={hashtags}
  variant="primary"
  copyable
  onCopy={(item) => toast.success(`Copied: ${item}`)}
/>
```

### アイコン付き
```tsx
<BadgeList
  items={[
    { label: 'Featured', icon: <StarIcon />, value: 'feat' },
    { label: 'New', icon: <SparklesIcon />, value: 'new' },
  ]}
  variant="gradient"
  onClick={(item) => console.log(item)}
/>
```

### 削除可能
```tsx
<BadgeList
  items={tags}
  removable
  onRemove={(item, index) => handleRemove(index)}
/>
```

### もっと見る
```tsx
<BadgeList
  items={allItems}
  maxItems={5}  // 5個以上は「もっと見る」ボタン
  copyable
/>
```

### ハッシュタグ専用
```tsx
<HashtagList
  hashtags={['design', 'ui']}  // 自動的に#が付く
  onCopy={(tag) => console.log(tag)}
/>
```

---

## InfoCard - 情報カード

### 基本
```tsx
<InfoCard
  title="タイトル"
  subtitle="サブタイトル"
  content={<p>コンテンツ</p>}
/>
```

### フル機能
```tsx
<InfoCard
  icon={<Icon />}
  iconPosition="top"
  title="タイトル"
  subtitle="サブタイトル"
  content={<div>内容</div>}
  footer={<Button>アクション</Button>}
  badge={<Badge>New</Badge>}
  variant="default"
  hoverable
  onClick={() => navigate('/page')}
  size="md"
/>
```

### バリアント
```tsx
<InfoCard variant="default" />   // 標準
<InfoCard variant="glass" />     // ガラスエフェクト
<InfoCard variant="gradient" />  // グラデーション背景
<InfoCard variant="outline" />   // アウトライン
```

### 統計カード
```tsx
<StatCard
  label="総閲覧数"
  value="12,543"
  change="+12.5%"
  changeType="increase"
  icon={<EyeIcon />}
/>
```

### 機能カード
```tsx
<FeatureCard
  title="プレミアムプラン"
  description="説明"
  features={[
    '機能1',
    '機能2',
    '機能3',
  ]}
  icon={<StarIcon />}
/>
```

---

## カラーバリアント一覧

### プログレスバー
- `primary` - Purple
- `accent` - Cyan
- `success` - Green
- `warning` - Amber/Orange
- `error` - Red
- `gradient` - Purple to Cyan (推奨)

### BadgeList
- `default` - Gray
- `primary` - Purple
- `accent` - Cyan
- `success` - Green
- `gradient` - Purple to Cyan

### InfoCard
- `default` - White/Gray
- `glass` - Glassmorphism
- `gradient` - Purple to Cyan
- `outline` - Transparent with border

---

## サイズバリアント

### EmptyState
- `sm` - 小 (py-8)
- `md` - 中 (py-16) - デフォルト
- `lg` - 大 (py-24)

### SectionHeader
- `sm` - 小アイコン、小テキスト
- `md` - 中アイコン、中テキスト - デフォルト
- `lg` - 大アイコン、大テキスト

### ProgressBar
- `xs` - h-1
- `sm` - h-2
- `md` - h-2.5 - デフォルト
- `lg` - h-3

### BadgeList
- `sm` - text-xs, px-2.5, py-1
- `md` - text-sm, px-3, py-1.5 - デフォルト
- `lg` - text-base, px-4, py-2

### InfoCard
- `sm` - p-4
- `md` - p-6 - デフォルト
- `lg` - p-8

---

## よく使うパターン

### 空のタブ
```tsx
if (!data || data.length === 0) {
  return <NoDataEmptyState message="データがありません" />;
}
```

### タブヘッダー
```tsx
<SectionHeader
  icon={<Icon />}
  title="タイトル"
  description="説明"
  gradient
/>
```

### スコア表示
```tsx
<CircularProgress value={score} size={160} color="gradient" />

<div className="grid grid-cols-2 gap-4">
  <ProgressBar value={score1} showLabel animated shimmer />
  <ProgressBar value={score2} showLabel animated shimmer />
</div>
```

### ハッシュタグリスト
```tsx
<SectionHeader title="ハッシュタグ" icon={<HashIcon />} />
<BadgeList items={hashtags} variant="primary" copyable maxItems={10} />
```

### 改善提案リスト
```tsx
<SectionHeader title="改善提案" icon={<LightBulbIcon />} />
{improvements.map((item, i) => (
  <InfoCard
    key={i}
    title={item.title}
    content={item.description}
    variant="outline"
    hoverable
  />
))}
```

---

## アニメーション制御

### 有効化
```tsx
<EmptyState animated />              // デフォルトで有効
<ProgressBar animated shimmer />     // アニメーション + シマー
```

### 無効化
```tsx
<EmptyState animated={false} />
<ProgressBar animated={false} shimmer={false} />
```

### モーション削減（自動対応）
すべてのコンポーネントは`prefers-reduced-motion`に自動対応

---

## アクセシビリティ

### キーボードナビゲーション
```tsx
<InfoCard onClick={handler} />  // Tab, Enter, Spaceで操作可能
<BadgeList copyable />          // Enter/Spaceでコピー
```

### ARIAラベル
すべてのコンポーネントは適切なARIA属性を自動設定

### カラーコントラスト
すべてのテキストは4.5:1以上のコントラスト比を保証

---

## パフォーマンス

### 大きなリスト
```tsx
<BadgeList items={largeArray} maxItems={10} />  // 最初は10個のみ表示
```

### 遅延読み込み
```tsx
const LazyComponent = lazy(() => import('./Component'));
<Suspense fallback={<EmptyState title="Loading..." size="sm" />}>
  <LazyComponent />
</Suspense>
```

---

## トラブルシューティング

### アニメーションが動かない
→ `globals.css`がインポートされているか確認

### グラデーションが表示されない
→ `tailwind.config.ts`のbackgroundImageを確認

### TypeScriptエラー
→ コンポーネントのindex.tsから型をインポート
```tsx
import type { EmptyStateProps } from '@/app/components/ui';
```

---

## まとめ

5つのコンポーネントで完璧なUI:
1. **EmptyState** - データなし時
2. **SectionHeader** - セクション区切り
3. **ProgressBar** - スコア表示
4. **BadgeList** - タグ・ハッシュタグ
5. **InfoCard** - 情報カード

すべて purple-cyan グラデーション + アニメーション + ダークモード対応！
