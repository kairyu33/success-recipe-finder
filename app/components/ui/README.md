# UI Components Library

Premium UI components for the Note Hashtag AI Generator app, following the purple-cyan gradient design system with glassmorphism and modern animations.

## Table of Contents

- [EmptyState](#emptystate)
- [SectionHeader](#sectionheader)
- [ProgressBar](#progressbar)
- [BadgeList](#badgelist)
- [InfoCard](#infocard)

---

## EmptyState

Beautifully designed empty state component with animations for when no data is available.

### Features
- Multiple size variants (sm, md, lg)
- Gradient icon backgrounds
- Smooth entrance animations
- Preset variants for common scenarios
- Optional action buttons

### Basic Usage

```tsx
import { EmptyState } from '@/app/components/ui';

function MyTab() {
  return (
    <EmptyState
      icon={
        <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      }
      title="No insights yet"
      description="Analyze your article to see AI-powered insights"
    />
  );
}
```

### With Action Button

```tsx
<EmptyState
  icon={<SparklesIcon />}
  title="Start analyzing"
  description="Upload an article to get started"
  action={
    <Button variant="primary" onClick={handleAnalyze}>
      Analyze Now
    </Button>
  }
  size="lg"
/>
```

### Preset Variants

```tsx
// No data state
<NoDataEmptyState message="分析結果がありません" />

// No search results
<NoResultsEmptyState query="React" />

// Error state
<ErrorEmptyState message="データの読み込みに失敗しました" />
```

### Props

```typescript
interface EmptyStateProps {
  icon?: ReactNode;              // Icon to display
  title: string;                 // Main heading
  description?: string;          // Supporting text
  action?: ReactNode;            // Optional action button
  className?: string;            // Custom className
  size?: 'sm' | 'md' | 'lg';    // Size variant
  animated?: boolean;            // Enable entrance animation (default: true)
}
```

---

## SectionHeader

Enhanced section headers with icons, gradients, and descriptions for clear content separation.

### Features
- Icon with gradient background
- Gradient text support
- Multiple alignment options
- Size variants
- Optional badges and actions
- Compact and divider variants

### Basic Usage

```tsx
import { SectionHeader } from '@/app/components/ui';

function AnalysisTab() {
  return (
    <SectionHeader
      icon={
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      }
      title="AI Analysis Results"
      description="Deep insights powered by artificial intelligence"
      gradient
    />
  );
}
```

### With Badge and Action

```tsx
<SectionHeader
  icon={<SparklesIcon />}
  title="Premium Features"
  description="Unlock advanced capabilities"
  badge={<Badge variant="success">New</Badge>}
  action={
    <Button variant="outline" size="sm">
      Upgrade
    </Button>
  }
  size="lg"
/>
```

### Compact Variant

```tsx
import { CompactSectionHeader } from '@/app/components/ui';

<CompactSectionHeader
  title="Quick Stats"
  icon={<ChartIcon />}
  action={<button>View All</button>}
/>
```

### Section Divider

```tsx
import { SectionDivider } from '@/app/components/ui';

<SectionDivider title="Additional Information" />
```

### Props

```typescript
interface SectionHeaderProps {
  icon?: ReactNode;                      // Icon to display
  title: string;                         // Main heading
  description?: string;                  // Supporting text
  gradient?: boolean;                    // Apply gradient to title
  align?: 'left' | 'center' | 'right';  // Alignment
  size?: 'sm' | 'md' | 'lg';            // Size variant
  className?: string;                    // Custom className
  action?: ReactNode;                    // Right-side action
  badge?: ReactNode;                     // Badge next to title
}
```

---

## ProgressBar

Premium progress bars with gradients, animations, and shimmer effects.

### Features
- Linear and circular variants
- Multiple color schemes
- Gradient support
- Shimmer animations
- Label positioning options
- Multi-segment bars

### Linear Progress Bar

```tsx
import { ProgressBar } from '@/app/components/ui';

function ScoreDisplay() {
  return (
    <ProgressBar
      value={75}
      max={100}
      color="gradient"
      showLabel
      labelPosition="outside"
      animated
      shimmer
    />
  );
}
```

### Circular Progress

```tsx
import { CircularProgress } from '@/app/components/ui';

<CircularProgress
  value={85}
  max={100}
  size={120}
  strokeWidth={12}
  color="gradient"
  showLabel
/>
```

### Custom Label

```tsx
<ProgressBar
  value={42}
  max={100}
  label={
    <div className="flex items-center gap-2">
      <span className="font-bold">42</span>
      <span className="text-sm">points</span>
    </div>
  }
  showLabel
  labelPosition="inside"
/>
```

### Segmented Progress

```tsx
import { SegmentedProgressBar } from '@/app/components/ui';

<SegmentedProgressBar
  segments={[
    { value: 30, color: 'bg-green-500', label: 'Excellent' },
    { value: 50, color: 'bg-blue-500', label: 'Good' },
    { value: 20, color: 'bg-amber-500', label: 'Fair' },
  ]}
  height="md"
  showLabels
/>
```

### Props

```typescript
interface ProgressBarProps {
  value: number;                           // Current value
  max?: number;                            // Maximum value (default: 100)
  color?: 'primary' | 'accent' | 'success' | 'warning' | 'error' | 'gradient';
  size?: 'xs' | 'sm' | 'md' | 'lg';       // Height
  showLabel?: boolean;                     // Show percentage
  labelPosition?: 'inside' | 'outside' | 'top';
  animated?: boolean;                      // Enable animations
  shimmer?: boolean;                       // Enable shimmer effect
  label?: ReactNode;                       // Custom label
  className?: string;                      // Custom className
  rounded?: boolean;                       // Rounded ends (default: true)
}
```

---

## BadgeList

Interactive badge collection with copy functionality, perfect for hashtags and tags.

### Features
- Copy on click
- Multiple variants and sizes
- Show more/less functionality
- Removable badges
- Copy all button
- Stagger animations

### Basic Usage

```tsx
import { BadgeList } from '@/app/components/ui';

function HashtagDisplay() {
  return (
    <BadgeList
      items={['#design', '#ui', '#react', '#nextjs']}
      variant="primary"
      copyable
      onCopy={(item) => console.log('Copied:', item)}
    />
  );
}
```

### With Icons

```tsx
<BadgeList
  items={[
    { label: 'Featured', icon: <StarIcon />, value: 'featured' },
    { label: 'Trending', icon: <FireIcon />, value: 'trending' },
    { label: 'New', icon: <SparklesIcon />, value: 'new' },
  ]}
  variant="gradient"
  size="lg"
  onClick={(item) => console.log('Clicked:', item)}
/>
```

### Removable Badges

```tsx
<BadgeList
  items={tags}
  variant="accent"
  removable
  onRemove={(item, index) => {
    const newTags = tags.filter((_, i) => i !== index);
    setTags(newTags);
  }}
/>
```

### With Max Items

```tsx
<BadgeList
  items={allHashtags}
  variant="primary"
  maxItems={5}
  copyable
/>
// Shows "Show more" button if more than 5 items
```

### Hashtag Preset

```tsx
import { HashtagList } from '@/app/components/ui';

<HashtagList
  hashtags={['design', 'ui', 'react']}  // Automatically adds #
  onCopy={(tag) => console.log('Copied:', tag)}
/>
```

### Props

```typescript
interface BadgeListProps {
  items: string[] | Array<{ label: string; value?: string; icon?: ReactNode }>;
  variant?: 'default' | 'primary' | 'accent' | 'success' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  copyable?: boolean;                    // Enable copy on click
  maxItems?: number;                     // Max items to show
  layout?: 'horizontal' | 'vertical';
  onCopy?: (item: string) => void;       // Copy callback
  onClick?: (item: string, index: number) => void;
  className?: string;
  removable?: boolean;                   // Show remove button
  onRemove?: (item: string, index: number) => void;
}
```

---

## InfoCard

Versatile card component for displaying structured information with icons, headers, and footers.

### Features
- Multiple variants (default, glass, gradient, outline)
- Icon positioning (top, left)
- Hover effects
- Clickable cards
- Footer actions
- Stat and feature presets

### Basic Usage

```tsx
import { InfoCard } from '@/app/components/ui';

function FeaturesList() {
  return (
    <InfoCard
      icon={
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      }
      title="AI Analysis"
      subtitle="Powered by GPT-4"
      content={
        <p className="text-sm">
          Get deep insights into your content with advanced AI analysis.
        </p>
      }
      footer={
        <Button variant="primary" size="sm">
          Learn More
        </Button>
      }
    />
  );
}
```

### Gradient Variant

```tsx
<InfoCard
  icon={<SparklesIcon />}
  title="Premium Feature"
  subtitle="Unlock advanced capabilities"
  content="Enhanced AI analysis with custom models"
  variant="gradient"
  hoverable
/>
```

### Glass Variant

```tsx
<InfoCard
  icon={<ChartIcon />}
  title="Analytics Dashboard"
  subtitle="Real-time insights"
  variant="glass"
  content={<AnalyticsChart />}
/>
```

### Horizontal Layout

```tsx
<InfoCard
  icon={<BellIcon />}
  iconPosition="left"
  title="Notifications"
  subtitle="3 new updates"
  content="Check your latest notifications"
  badge={<Badge variant="error">3</Badge>}
/>
```

### Clickable Card

```tsx
<InfoCard
  icon={<FolderIcon />}
  title="Project Files"
  subtitle="24 documents"
  onClick={() => navigate('/files')}
  hoverable
/>
```

### Stat Card Preset

```tsx
import { StatCard } from '@/app/components/ui';

<StatCard
  label="Total Views"
  value="12,543"
  change="+12.5%"
  changeType="increase"
  icon={<EyeIcon />}
/>
```

### Feature Card Preset

```tsx
import { FeatureCard } from '@/app/components/ui';

<FeatureCard
  title="Premium Plan"
  description="Everything you need to grow"
  features={[
    'Unlimited AI analysis',
    'Priority support',
    'Advanced analytics',
    'Custom branding',
  ]}
  icon={<StarIcon />}
/>
```

### Props

```typescript
interface InfoCardProps {
  icon?: ReactNode;                      // Icon at top/left
  iconPosition?: 'top' | 'left';        // Icon position
  title: string;                         // Main title
  subtitle?: string;                     // Subtitle
  content?: ReactNode;                   // Main content
  footer?: ReactNode;                    // Footer actions
  variant?: 'default' | 'glass' | 'gradient' | 'outline';
  hoverable?: boolean;                   // Enable hover effects
  onClick?: () => void;                  // Click handler
  className?: string;                    // Custom className
  badge?: ReactNode;                     // Badge in header
  size?: 'sm' | 'md' | 'lg';            // Size variant
}
```

---

## Design System Integration

All components follow the purple-cyan gradient design system:

### Color Palette
- **Primary**: Purple gradient (#a855f7 to #9333ea)
- **Accent**: Cyan gradient (#06b6d4 to #0891b2)
- **Success**: Green gradient (#10b981 to #14b8a6)
- **Warning**: Amber/Orange gradient (#f59e0b to #ef4444)
- **Error**: Red gradient (#ef4444 to #dc2626)

### Animations
- `fade-in-up`: Entrance animation
- `scale-in`: Scale entrance
- `shimmer`: Loading shimmer effect
- `pulse-subtle`: Subtle pulsing

### Glass Effects
All components support glassmorphism with `backdrop-blur` and transparency.

---

## Best Practices

### 1. Consistent Sizing
Use size props consistently across your app:
```tsx
<SectionHeader size="lg" />
<EmptyState size="md" />
<BadgeList size="sm" />
```

### 2. Gradient Usage
Apply gradients to highlight important sections:
```tsx
<SectionHeader title="Main Feature" gradient />
<InfoCard variant="gradient" />
<ProgressBar color="gradient" />
```

### 3. Animations
Enable animations for better UX:
```tsx
<EmptyState animated />
<ProgressBar animated shimmer />
```

### 4. Accessibility
All components include proper ARIA labels and keyboard navigation:
```tsx
<InfoCard onClick={handler} /> // Automatically keyboard accessible
<BadgeList copyable /> // Enter/Space to copy
```

### 5. Dark Mode
All components automatically support dark mode via Tailwind's `dark:` classes.

---

## Migration Guide

### From Old Badge to BadgeList

**Before:**
```tsx
{hashtags.map(tag => <Badge key={tag}>{tag}</Badge>)}
```

**After:**
```tsx
<BadgeList items={hashtags} variant="primary" copyable />
```

### From Custom Empty State to EmptyState

**Before:**
```tsx
{data.length === 0 && (
  <div className="text-center py-16">
    <p>No data</p>
  </div>
)}
```

**After:**
```tsx
{data.length === 0 && <NoDataEmptyState />}
```

---

## Examples from Real Tabs

### ViralityTab Example

```tsx
import { SectionHeader, CircularProgress, ProgressBar, InfoCard } from '@/app/components/ui';

export function ViralityTab({ data }: TabContentProps) {
  return (
    <div className="space-y-8">
      <SectionHeader
        icon={<BoltIcon />}
        title="バイラル性分析"
        description="記事がSNSで拡散される可能性を評価"
        gradient
      />

      <CircularProgress
        value={data.overall}
        max={100}
        size={160}
        color="gradient"
      />

      <div className="grid grid-cols-2 gap-4">
        <ProgressBar value={data.titleAppeal} showLabel animated shimmer />
        <ProgressBar value={data.empathy} showLabel animated shimmer />
      </div>
    </div>
  );
}
```

### HashtagsTab Example

```tsx
import { SectionHeader, BadgeList, EmptyState } from '@/app/components/ui';

export function HashtagsTab({ data }: TabContentProps) {
  if (!data.hashtags?.length) {
    return <NoDataEmptyState message="ハッシュタグが生成されませんでした" />;
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
        onCopy={(tag) => toast.success(`Copied: ${tag}`)}
      />
    </div>
  );
}
```

---

## Contributing

When adding new components:
1. Follow the existing file structure
2. Include comprehensive JSDoc comments
3. Export through index.ts
4. Add TypeScript types
5. Update this README with examples
6. Ensure dark mode support
7. Add animations where appropriate

---

## Support

For issues or questions, check the component source code - all components include detailed JSDoc documentation with examples.
