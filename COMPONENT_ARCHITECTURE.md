# Component Architecture - Visual Guide

## System Overview

```
┌─────────────────────────────────────────────────────────┐
│                     App (page.tsx)                      │
│                                                         │
│  ┌───────────────────────────────────────────────────┐ │
│  │              MainLayout                           │ │
│  │                                                   │ │
│  │  ┌─────────────────────────────────────────────┐ │ │
│  │  │            Header                           │ │ │
│  │  │  [Logo] Note AI Generator  [History: 5]    │ │ │
│  │  └─────────────────────────────────────────────┘ │ │
│  │                                                   │ │
│  │  ┌─────────────────────────────────────────────┐ │ │
│  │  │         ArticleInput                        │ │ │
│  │  │  ┌───────────────────────────────────────┐  │ │ │
│  │  │  │ [Textarea for article content]        │  │ │ │
│  │  │  └───────────────────────────────────────┘  │ │ │
│  │  │  [Analyze Button with gradient]             │ │ │
│  │  └─────────────────────────────────────────────┘ │ │
│  │                                                   │ │
│  │  ┌─────────────────────────────────────────────┐ │ │
│  │  │      AnalysisResults (Card)                 │ │ │
│  │  │                                             │ │ │
│  │  │  ╔═══════════════════════════════════════╗ │ │ │
│  │  │  ║      TabsContainer (glass-nav)        ║ │ │ │
│  │  │  ║ ╭━━━╮ ╭──╮ ╭──╮ ╭──╮ ╭──╮ ... →      ║ │ │ │
│  │  │  ║ ┃Tab┃ │  │ │  │ │  │ │  │            ║ │ │ │
│  │  │  ║ ╰━━━╯ ╰──╯ ╰──╯ ╰──╯ ╰──╯            ║ │ │ │
│  │  │  ╚═══════════════════════════════════════╝ │ │ │
│  │  │                                             │ │ │
│  │  │  ┌───────────────────────────────────────┐ │ │ │
│  │  │  │       TabPanel (active only)          │ │ │ │
│  │  │  │                                       │ │ │ │
│  │  │  │  ┌─────────────────────────────────┐ │ │ │ │
│  │  │  │  │   TitlesTab / ViralityTab      │ │ │ │ │
│  │  │  │  │   InsightsTab / etc...         │ │ │ │ │
│  │  │  │  └─────────────────────────────────┘ │ │ │ │
│  │  │  └───────────────────────────────────────┘ │ │ │
│  │  └─────────────────────────────────────────────┘ │ │
│  │                                                   │ │
│  │  ┌─────────────────────────────────────────────┐ │ │
│  │  │              Footer                         │ │ │
│  │  └─────────────────────────────────────────────┘ │ │
│  └───────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

---

## Tab Component Hierarchy

### Current Structure (10 Tabs)

```
AnalysisResults
  └── Card (variant="default")
       ├── TabsContainer (glassmorphism)
       │    ├── Tab (Titles) ✅ UPDATED
       │    ├── Tab (Insights)
       │    ├── Tab (Image)
       │    ├── Tab (Hashtags)
       │    ├── Tab (Virality) ✅ UPDATED
       │    ├── Tab (Reading Time)
       │    ├── Tab (Rewrite)
       │    ├── Tab (Series)
       │    ├── Tab (Monetization)
       │    └── Tab (Emotional)
       │
       └── TabPanel (renders active tab only)
            ├── TitlesTab ✅ PREMIUM DESIGN
            ├── InsightsTab ⚠️ TODO
            ├── EyeCatchTab ⚠️ TODO
            ├── HashtagsTab ⚠️ TODO
            ├── ViralityTab ✅ PREMIUM DESIGN
            ├── ReadingTimeTab ⚠️ TODO
            ├── RewriteTab ⚠️ TODO
            ├── SeriesTab ⚠️ TODO
            ├── MonetizationTab ⚠️ TODO
            └── EmotionalTab ⚠️ TODO
```

---

## Card Component Variants

### 1. Default Card
```
┌─────────────────────────────────────────┐
│                                         │
│  Standard white card with subtle shadow │
│  Hover: Lift + enhanced shadow          │
│                                         │
└─────────────────────────────────────────┘
```

**Use Cases:**
- General content containers
- List items
- Form sections

### 2. Glass Card
```
╔═════════════════════════════════════════╗
║  Translucent background with blur       ║
║  White/dark overlay (70% opacity)       ║
║  Perfect for overlays and navs          ║
╚═════════════════════════════════════════╝
```

**Use Cases:**
- Sticky navigation
- Modal overlays
- Floating panels

### 3. Gradient Card
```
╔═══════════════════════════════════════════╗
║ ✨ Full gradient background              ║
║    Purple → Pink or Cyan → Blue          ║
║    White text, bold design               ║
║    Perfect for hero sections             ║
╚═══════════════════════════════════════════╝
```

**Use Cases:**
- Hero sections
- Featured content
- Call-to-action cards

### 4. Neumorphic Card
```
┌─────────────────────────────────────────┐
│   Subtle depth effect (light mode)      │
│   Soft shadows: inset + outset          │
│   Minimalist, clean aesthetic           │
└─────────────────────────────────────────┘
```

**Use Cases:**
- Settings panels
- Calculator interfaces
- Minimal designs

---

## TitlesTab Component Structure (Example)

```
TitlesTab
├── Section Header
│   ├── Gradient Icon Badge (purple-cyan)
│   └── Title + Description
│       ├── H2 with gradient-text
│       └── Gray description text
│
├── Titles List (stagger-children)
│   └── For each title:
│       └── Hover Glow Wrapper (group)
│           ├── Glow Effect Layer (absolute, blur)
│           └── Card Container (relative)
│               ├── Number Badge (gradient circle)
│               ├── Category Badge (rounded pill)
│               ├── Title Text (font-semibold)
│               ├── Metadata Icons (readability, CTR)
│               ├── Copy Button
│               └── Bottom Gradient Line (on hover)
│
└── Tips Section
    └── Info Card (accent gradient background)
        ├── Icon Badge
        └── Content
            ├── Heading
            └── Description
```

### Visual Breakdown:

```
┌─────────────────────────────────────────────────────────┐
│ 🎨 Suggested Titles                                     │
│ AI生成された魅力的なタイトル案                         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ ╭─╮ [✨ AI生成]                                        │
│ │1│                                                     │
│ ╰─╯                                                     │
│                                                         │
│ Your amazing article title goes here with proper       │
│ line height and font weight                            │
│                                                         │
│ 👁 読みやすさ: 高  ⚡ クリック率: 良好                │
│                                        [🔄 Copy]       │
│ ════════════════════════════════════════════════        │
└─────────────────────────────────────────────────────────┘
(Appears with 0.1s delay)

┌─────────────────────────────────────────────────────────┐
│ ╭─╮ [✨ AI生成]                                        │
│ │2│                                                     │
│ ╰─╯ ...                                                │
└─────────────────────────────────────────────────────────┘
(Appears with 0.2s delay)

... (more titles with stagger animation)

┌─────────────────────────────────────────────────────────┐
│ 💡 プロのヒント                                        │
│                                                         │
│ タイトルは記事の顔です。数字を入れたり、疑問形に...   │
└─────────────────────────────────────────────────────────┘
```

---

## ViralityTab Component Structure

```
ViralityTab
├── Section Header (same as TitlesTab)
│
├── Overall Score Card
│   ├── Background (gradient mesh)
│   ├── Circular SVG Progress
│   │   ├── Background Circle (gray)
│   │   ├── Progress Circle (gradient stroke)
│   │   └── Center Content
│   │       ├── Score Number (gradient-text)
│   │       └── "/ 100" label
│   └── Score Details
│       ├── Emoji Indicator (🚀⚡📈💡)
│       ├── Score Label (非常に高い)
│       └── Description Text
│
├── Score Breakdown Grid
│   └── ScoreCard × 4
│       ├── Title Appeal
│       ├── Opening Hook
│       ├── Empathy
│       └── Shareability
│       Each with:
│       ├── Icon
│       ├── Title
│       ├── Score Number
│       └── Animated Progress Bar
│
└── Improvements List
    └── For each improvement:
        └── Card with glow hover
            ├── Number Badge
            └── Improvement Text
```

### Visual Breakdown:

```
┌──────────────────────────────────────────────────────────┐
│ ⚡ バイラル性分析                                        │
│ 記事がSNSで拡散される可能性を0-100点で評価              │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│         ╭────────╮        🚀 非常に高い                  │
│        ╱  ░░░░░░  ╲                                      │
│       │   ▓▓▓▓▓   │      この記事は非常に高いバイラル性  │
│       │     85     │      を持っています。多くの人に...  │
│        ╲   100    ╱                                      │
│         ╰────────╯                                       │
└──────────────────────────────────────────────────────────┘

┌─────────────────────┬─────────────────────┐
│ 🎯 タイトルの魅力度 │ 🎣 冒頭のフック力   │
│         85          │         78          │
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░  │ ▓▓▓▓▓▓▓▓▓▓▓░░░░░   │
│                85%  │               78%   │
└─────────────────────┴─────────────────────┘
┌─────────────────────┬─────────────────────┐
│ ❤️ 共感性           │ 📤 シェアしやすさ   │
│         92          │         88          │
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░  │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░   │
│                92%  │               88%   │
└─────────────────────┴─────────────────────┘
```

---

## UI Component Library Structure

```
app/components/
├── ui/
│   ├── Card/
│   │   └── Card.tsx
│   │       ├── Card (base component)
│   │       ├── GradientCard
│   │       ├── ScoreCard ✨ NEW
│   │       └── ContentCard ✨ NEW
│   │
│   ├── Tabs/
│   │   └── Tabs.tsx
│   │       ├── Tab (button)
│   │       ├── TabsContainer (glass nav)
│   │       └── TabPanel (content wrapper)
│   │
│   ├── Button/
│   │   └── Button.tsx
│   │       ├── Primary
│   │       ├── Secondary
│   │       └── Ghost
│   │
│   └── CopyButton/
│       └── CopyButton.tsx
│
└── features/
    ├── ArticleInput/
    │   └── ArticleInput.tsx
    │
    ├── AnalysisResults/
    │   ├── AnalysisResults.tsx (orchestrator)
    │   ├── TitlesTab.tsx ✅ UPDATED
    │   ├── ViralityTab.tsx ✅ UPDATED
    │   └── [8 more tabs] ⚠️ TODO
    │
    ├── Header/
    │   └── Header.tsx
    │
    └── Footer/
        └── Footer.tsx
```

---

## Design Token Hierarchy

```
tailwind.config.ts
├── colors
│   ├── primary (purple scale)
│   ├── accent (cyan scale)
│   ├── success (green)
│   ├── warning (amber)
│   ├── error (red)
│   └── dark (bg + border)
│
├── backgroundImage
│   ├── gradient-primary
│   ├── gradient-accent
│   ├── gradient-success
│   ├── gradient-warm
│   ├── gradient-glass
│   └── gradient-mesh
│
├── animation
│   ├── fade-in
│   ├── fade-in-up
│   ├── scale-in
│   ├── slide-in-right
│   ├── pulse-subtle
│   └── shimmer
│
└── boxShadow
    ├── glass
    ├── glass-dark
    ├── primary
    └── accent
```

---

## Utility Class Composition

### Example: Premium Card with Hover Glow

```tsx
<div className="group relative">  {/* Hover group */}

  {/* Glow layer */}
  <div className="
    absolute -inset-0.5              {/* Positioned outside */}
    bg-gradient-to-r                 {/* Gradient background */}
    from-primary-500 to-accent-500   {/* Purple to cyan */}
    rounded-2xl                      {/* Match card radius */}
    opacity-0                        {/* Hidden by default */}
    group-hover:opacity-20           {/* Show on hover */}
    blur                             {/* Blur effect */}
    transition duration-300          {/* Smooth transition */}
  " />

  {/* Card content */}
  <div className="
    relative                         {/* Above glow layer */}
    bg-white dark:bg-gray-900        {/* Background colors */}
    rounded-2xl                      {/* Corner radius */}
    p-5                              {/* Padding */}
    border                           {/* Border */}
    border-gray-200 dark:border-gray-800  {/* Border colors */}
    hover:border-primary-300         {/* Hover border color */}
    dark:hover:border-primary-700    {/* Dark mode hover */}
    transition-all duration-300      {/* Smooth transitions */}
    hover:shadow-xl                  {/* Enhanced shadow */}
    hover:-translate-y-0.5           {/* Lift up */}
  ">
    {/* Content goes here */}
  </div>

</div>
```

---

## Animation Flow Diagram

```
User Action → Tab Click
      ↓
Tab Switch (300ms)
      ↓
Old TabPanel Unmounts (instant)
      ↓
New TabPanel Mounts
      ↓
animate-fade-in-up (500ms)
      ↓
Content Visible
      ↓
stagger-children triggered
      ↓
Child 1 appears (0.1s delay)
Child 2 appears (0.2s delay)
Child 3 appears (0.3s delay)
...
      ↓
Animation Complete
```

---

## Responsive Behavior

### Desktop (1024px+)
```
┌──────────────────────────────────────────────────┐
│ [🔤 Titles] [📊 Insights] [🖼 Image] [#️⃣ Hashtags] ... │
│ (Icon + Label visible, all tabs in viewport)    │
└──────────────────────────────────────────────────┘
```

### Tablet (768px - 1023px)
```
┌───────────────────────────────────────────────┐
│ [🔤 Titles] [📊 Insights] [🖼 Image] [#️⃣ Hash...] → │
│ (Icon + Label, scrollable)                    │
└───────────────────────────────────────────────┘
```

### Mobile (< 768px)
```
┌──────────────────────────────────┐
│ [🔤] [📊] [🖼] [#️⃣] [⚡] [⏱] [✏️] → │
│ (Icon only, horizontally scrollable) │
└──────────────────────────────────┘
```

---

## State Management Flow

```
HomePage (useState)
    ↓
    ├── articleText (string)
    ├── data (AnalysisData | null)
    ├── loading (boolean)
    └── error (string | null)

    ↓ Pass to

ArticleInput
    ├── Receives: value, onChange, onAnalyze
    └── Triggers: analyze() on button click

    ↓ Updates

AnalysisResults
    ├── Receives: data
    ├── Local State: activeTab (TabId)
    └── Renders: TabsContainer + TabPanel

    ↓ Passes to

Individual Tabs (TitlesTab, ViralityTab, etc.)
    ├── Receives: data (read-only)
    └── Renders: UI based on data
```

---

## Performance Optimization Diagram

```
Component Render
    ↓
    ├── TabPanel: Conditional render (only active)
    │   ↓
    │   └── Early return if !isActive
    │
    ├── Animations: CSS-only (GPU accelerated)
    │   ↓
    │   └── transform, opacity (not width/height)
    │
    ├── Backdrop-filter: Limited use
    │   ↓
    │   └── Only on TabsContainer (glass-nav)
    │
    └── Stagger: CSS delays (no JavaScript)
        ↓
        └── nth-child selectors
```

---

## Component Props Interface

### Card Component
```typescript
interface CardProps {
  variant?: 'default' | 'glass' | 'gradient' | 'neuro';
  hover?: boolean;
  children: React.ReactNode;
  className?: string;
}
```

### ScoreCard Component
```typescript
interface ScoreCardProps {
  title: string;
  score: number;
  maxScore?: number;
  color?: 'primary' | 'accent' | 'success' | 'warning' | 'error';
  icon?: React.ReactNode;
  className?: string;
}
```

### Tab Component
```typescript
interface TabProps {
  id: TabId;
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}
```

---

## Color Decision Tree

```
Choosing a color?
    ↓
    Is it a primary action?
    ├─ Yes → Use primary-500 (purple)
    └─ No ↓

    Is it an accent/highlight?
    ├─ Yes → Use accent-500 (cyan)
    └─ No ↓

    Is it a score/metric?
    ├─ High (80+) → success (green)
    ├─ Medium (60-79) → primary (purple)
    ├─ Low (40-59) → warning (amber)
    └─ Poor (<40) → error (red)

    Is it neutral text?
    └─ Primary text: gray-900/white
       Secondary text: gray-600/gray-400
       Tertiary text: gray-500/gray-400
```

---

This architecture guide provides a visual map of how components fit together and flow data through the application. Use it as a reference when building new features or debugging issues.
