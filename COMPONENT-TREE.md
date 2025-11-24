# Component Tree Visualization

## Application Component Hierarchy

```
HomePage (page.tsx)
│
└── MainLayout
    │
    └── Section
        │
        └── Container (max-width: 7xl)
            │
            ├── Header
            │   └── [Static Title & Subtitle]
            │
            ├── ArticleInput
            │   ├── Card
            │   │   ├── <label> - Input Label
            │   │   ├── <textarea> - Text Input
            │   │   │   └── Character Counter
            │   │   ├── ErrorMessage (conditional)
            │   │   │   └── Dismiss Button
            │   │   └── Button
            │   │       └── LoadingSpinner (when loading)
            │   │
            │   └── [Props: value, onChange, onAnalyze, loading, error]
            │
            ├── AnalysisResults (conditional: when data exists)
            │   ├── Card
            │   │   ├── TabsContainer
            │   │   │   ├── Tab (Titles)
            │   │   │   ├── Tab (Insights)
            │   │   │   ├── Tab (Image)
            │   │   │   └── Tab (Hashtags)
            │   │   │
            │   │   └── TabPanel
            │   │       │
            │   │       ├── TitlesTab (when active)
            │   │       │   └── [For each title]
            │   │       │       └── GradientCard
            │   │       │           ├── Badge (Title #)
            │   │       │           ├── Title Text
            │   │       │           └── CopyButton
            │   │       │
            │   │       ├── InsightsTab (when active)
            │   │       │   ├── OneLiner Section
            │   │       │   │   └── GradientCard (purple)
            │   │       │   │       └── Quote Display
            │   │       │   └── Grid (3 columns)
            │   │       │       ├── What You Learn
            │   │       │       │   └── Card (green)
            │   │       │       │       └── [List Items]
            │   │       │       ├── Benefits
            │   │       │       │   └── Card (blue)
            │   │       │       │       └── [List Items]
            │   │       │       └── Recommended For
            │   │       │           └── Card (orange)
            │   │       │               └── [List Items]
            │   │       │
            │   │       ├── EyeCatchTab (when active)
            │   │       │   ├── Summary Section
            │   │       │   │   └── GradientCard (indigo)
            │   │       │   ├── Main Prompt
            │   │       │   │   └── Card
            │   │       │   │       ├── Prompt Text
            │   │       │   │       └── CopyButton
            │   │       │   ├── Grid (2 columns)
            │   │       │   │   ├── Composition Ideas
            │   │       │   │   │   └── [Badge Array]
            │   │       │   │   └── Color Palette
            │   │       │   │       └── [Badge Array]
            │   │       │   └── Grid (2 columns)
            │   │       │       ├── Mood Card
            │   │       │       └── Style Card
            │   │       │
            │   │       └── HashtagsTab (when active)
            │   │           ├── Header
            │   │           │   └── Copy All Button
            │   │           └── Grid (4 columns)
            │   │               └── [For each hashtag]
            │   │                   └── Clickable Card
            │   │                       ├── Hashtag Text
            │   │                       └── Copy Icon
            │   │
            │   └── [Props: data]
            │
            └── Footer
                └── [Static Credits & Description]
```

## Component Dependencies

### UI Component Library
```
ui/
├── Button
│   └── uses: LoadingSpinner, cn()
├── Card
│   └── uses: cn(), COLORS
├── Badge
│   └── uses: cn(), variantClasses()
├── CopyButton
│   └── uses: cn(), BUTTON_TEXT
├── ErrorMessage
│   └── uses: cn()
├── LoadingSpinner
│   └── uses: cn()
└── Tabs
    ├── Tab
    ├── TabsContainer
    └── TabPanel
```

### Feature Components
```
features/
├── ArticleInput
│   └── uses: Card, Button, ErrorMessage, INPUT_TEXT, BUTTON_TEXT
├── AnalysisResults
│   ├── uses: Card, TabsContainer, Tab, TabPanel, TAB_TEXT
│   └── children:
│       ├── TitlesTab
│       │   └── uses: CopyButton, SECTION_HEADERS, COLORS
│       ├── InsightsTab
│       │   └── uses: SECTION_HEADERS, COLORS
│       ├── EyeCatchTab
│       │   └── uses: CopyButton, SECTION_HEADERS, COLORS
│       └── HashtagsTab
│           └── uses: CopyButton, useClipboard, SECTION_HEADERS, BUTTON_TEXT
├── Header
│   └── uses: APP_TEXT
└── Footer
    └── uses: APP_TEXT
```

### Layout Components
```
layout/
├── MainLayout
│   └── uses: cn()
├── Container
│   └── uses: cn()
└── Section
    └── uses: cn()
```

### Custom Hooks
```
hooks/
├── useAnalysis
│   └── provides: { analyze, data, loading, error, clearError }
└── useClipboard
    └── provides: { copy, copiedId, isCopied }
```

## Data Flow

```
User Input
    ↓
ArticleInput Component
    ↓
onChange handler
    ↓
Parent State (articleText)
    ↓
onAnalyze trigger
    ↓
useAnalysis Hook
    ↓
API Call (/api/analyze-article-full)
    ↓
Response Data
    ↓
AnalysisResults Component
    ↓
Tab Components (TitlesTab, InsightsTab, etc.)
    ↓
Display to User
```

## State Management Flow

```
HomePage
├── Local State
│   └── articleText: string
│
└── Hook State (useAnalysis)
    ├── data: AnalysisResponse | null
    ├── loading: boolean
    ├── error: string
    └── loadingStates: LoadingStates
```

## Event Flow

```
User Types Text
    → onChange (ArticleInput)
        → setArticleText (HomePage)
            → Update articleText state

User Clicks "Analyze"
    → onAnalyze (ArticleInput)
        → analyze(articleText) (useAnalysis hook)
            → POST /api/analyze-article-full
                → Update data/loading/error states
                    → Trigger re-render
                        → Show AnalysisResults

User Clicks Tab
    → onTabChange (AnalysisResults)
        → setActiveTab (local state)
            → Show appropriate TabPanel

User Clicks Copy
    → copy(text, id) (useClipboard)
        → navigator.clipboard.writeText
            → Update copiedId state
                → Show "Copied!" feedback
                    → Auto-reset after 2s
```

## Import Chain

```
page.tsx
    ↓
imports from @/app/components/layout
    ↓
imports from @/app/components/features
    ↓
imports from @/app/components/ui
    ↓
imports from @/app/hooks
    ↓
imports from @/app/constants
    ↓
imports from @/app/utils/ui
    ↓
imports from @/app/types/ui
```

## Rendering Sequence

1. **Initial Render**
   ```
   MainLayout
   → Section
   → Container
   → Header (static)
   → ArticleInput (empty state)
   → Footer (static)
   ```

2. **User Types Input**
   ```
   Re-render ArticleInput
   → Update character counter
   → Enable analyze button
   ```

3. **User Clicks Analyze**
   ```
   ArticleInput shows loading
   → Button disabled with spinner
   → API call initiated
   ```

4. **API Response Received**
   ```
   AnalysisResults rendered
   → Card with TabsContainer
   → Default tab (Titles) active
   → TitlesTab content displayed
   ```

5. **User Switches Tabs**
   ```
   TabPanel changes
   → Previous tab unmounted
   → New tab mounted
   → Content animated in
   ```

## Component Reusability Matrix

| Component      | Used In                          | Count |
|---------------|----------------------------------|-------|
| Button        | ArticleInput                     | 1     |
| Card          | ArticleInput, AnalysisResults, tabs | 15+ |
| CopyButton    | All tabs (multiple per tab)      | 30+   |
| LoadingSpinner| Button (when loading)            | 1     |
| ErrorMessage  | ArticleInput                     | 1     |
| Tab           | AnalysisResults                  | 4     |
| TabsContainer | AnalysisResults                  | 1     |
| TabPanel      | AnalysisResults                  | 4     |
| Container     | HomePage                         | 1     |
| Section       | HomePage                         | 1     |
| MainLayout    | HomePage                         | 1     |

## Type Flow

```
Types Definition (ui.ts)
    ↓
Used by Components
    ↓
Props validation (TypeScript)
    ↓
Runtime type safety
    ↓
IDE autocomplete
```

## Styling Flow

```
Constants (ui.constants.ts)
    ↓
Import in components
    ↓
cn() utility combines classes
    ↓
Tailwind processes classes
    ↓
Final CSS output
```

## File Size Breakdown

```
UI Components:        ~1,200 lines
Feature Components:   ~1,500 lines
Layout Components:    ~200 lines
Hooks:               ~200 lines
Types:               ~150 lines
Constants:           ~300 lines
Utils:               ~100 lines
Documentation:       ~600 lines
────────────────────────────────
Total:               ~4,250 lines

vs. Original:        ~700 lines (monolithic)
```

## Performance Characteristics

### Render Optimization
- Components only re-render when their props change
- Tabs use conditional rendering (unmounted when inactive)
- Memoization opportunities in Tab components

### Bundle Splitting
- Each component in separate file
- Tree-shakeable exports
- Dynamic import ready

### Loading Strategy
```
Initial Load:
  - MainLayout ✓
  - Container ✓
  - Header ✓
  - ArticleInput ✓
  - Footer ✓

On Analysis:
  - AnalysisResults (lazy loadable)
  - Active Tab Component (lazy loadable)
```

This visualization shows the complete component architecture, data flow, and relationships in the refactored application.
