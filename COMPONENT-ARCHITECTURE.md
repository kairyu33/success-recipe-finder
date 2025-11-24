# Component Architecture Documentation

## Overview

This application has been refactored from a monolithic 700-line component into a highly modular, component-based architecture. This architecture prioritizes:

- **Reusability**: Components can be used across different contexts
- **Maintainability**: Easy to update and extend
- **Type Safety**: Full TypeScript coverage
- **Testability**: Components can be tested in isolation
- **Performance**: Optimized with React best practices

## Directory Structure

```
app/
├── components/
│   ├── ui/                 # Reusable UI components
│   │   ├── Button/
│   │   ├── Card/
│   │   ├── Badge/
│   │   ├── CopyButton/
│   │   ├── ErrorMessage/
│   │   ├── LoadingSpinner/
│   │   ├── Tabs/
│   │   └── index.ts
│   ├── features/           # Feature-specific components
│   │   ├── ArticleInput/
│   │   ├── AnalysisResults/
│   │   │   ├── TitlesTab.tsx
│   │   │   ├── InsightsTab.tsx
│   │   │   ├── EyeCatchTab.tsx
│   │   │   └── HashtagsTab.tsx
│   │   ├── Header/
│   │   ├── Footer/
│   │   └── index.ts
│   └── layout/             # Layout components
│       ├── Container.tsx
│       ├── Section.tsx
│       ├── MainLayout.tsx
│       └── index.ts
├── hooks/                  # Custom React hooks
│   ├── useAnalysis.ts
│   ├── useClipboard.ts
│   └── index.ts
├── contexts/               # React contexts (future use)
├── types/                  # TypeScript definitions
│   ├── ui.ts
│   └── ...
├── constants/              # Application constants
│   ├── ui.constants.ts
│   ├── text.constants.ts
│   └── ...
└── utils/                  # Utility functions
    └── ui/
        ├── classNames.ts
        └── index.ts
```

## Component Hierarchy

```
HomePage
└── MainLayout
    └── Section
        └── Container
            ├── Header
            ├── ArticleInput
            │   ├── Card
            │   ├── ErrorMessage
            │   └── Button
            ├── AnalysisResults
            │   ├── Card
            │   ├── TabsContainer
            │   │   └── Tab (x4)
            │   └── TabPanel
            │       ├── TitlesTab
            │       ├── InsightsTab
            │       ├── EyeCatchTab
            │       └── HashtagsTab
            └── Footer
```

## Component Categories

### 1. UI Components (`app/components/ui/`)

**Purpose**: Reusable, presentational components with no business logic

#### Button
- **Props**: `variant`, `size`, `isLoading`, `leftIcon`, `rightIcon`
- **Variants**: `primary`, `secondary`, `outline`, `ghost`, `success`, `danger`
- **Sizes**: `sm`, `md`, `lg`, `xl`

```tsx
<Button variant="primary" size="lg" isLoading={loading}>
  Analyze Article
</Button>
```

#### Card
- **Props**: `gradient`, `colorScheme`, `children`
- **Purpose**: Container with consistent styling
- **Variants**: Standard card, Gradient card

```tsx
<Card gradient colorScheme="blue">
  <YourContent />
</Card>
```

#### CopyButton
- **Props**: `text`, `itemId`, `label`, `onCopy`
- **Features**: Clipboard API integration, success feedback

```tsx
<CopyButton text="Copy this" itemId="unique-id" />
```

#### Tabs
- **Components**: `TabsContainer`, `Tab`, `TabPanel`
- **Features**: Accessible tab navigation with ARIA attributes

```tsx
<TabsContainer>
  <Tab id="tab1" label="Tab 1" icon={<Icon />} isActive={true} onClick={...} />
</TabsContainer>
<TabPanel id="tab1" isActive={true}>Content</TabPanel>
```

### 2. Layout Components (`app/components/layout/`)

**Purpose**: Structural components for page layout

#### MainLayout
- **Purpose**: Application-wide layout with gradient background
- **Usage**: Wrap entire page content

#### Container
- **Props**: `maxWidth` (`sm`, `md`, `lg`, `xl`, `2xl`, `7xl`)
- **Purpose**: Responsive container with max-width constraints

#### Section
- **Purpose**: Semantic section with consistent vertical spacing

### 3. Feature Components (`app/components/features/`)

**Purpose**: Domain-specific components with business logic

#### ArticleInput
- **Props**: `value`, `onChange`, `onAnalyze`, `loading`, `error`
- **Features**: Character count, validation, error display

#### AnalysisResults
- **Purpose**: Orchestrates tabbed analysis display
- **Sub-components**:
  - `TitlesTab`: Title suggestions
  - `InsightsTab`: Article insights
  - `EyeCatchTab`: Image generation ideas
  - `HashtagsTab`: Hashtag suggestions

## Custom Hooks

### useAnalysis
**Purpose**: Manages article analysis state and API calls

```tsx
const { analyze, data, loading, error, clearError } = useAnalysis();
```

**Returns**:
- `analyze(text)`: Function to trigger analysis
- `data`: Analysis response data
- `loading`: Loading state
- `error`: Error message
- `clearError()`: Clear error state

### useClipboard
**Purpose**: Handles clipboard operations with visual feedback

```tsx
const { copy, copiedId, isCopied } = useClipboard();
```

**Returns**:
- `copy(text, id)`: Copy text to clipboard
- `copiedId`: Currently copied item ID
- `isCopied(id)`: Check if specific item is copied

## Type Safety

All components have full TypeScript definitions in `app/types/ui.ts`:

```typescript
interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  children: ReactNode;
  // ...
}
```

## Styling System

### Utility Functions

**`cn()` - Conditional classNames**
```tsx
<div className={cn(
  'base-class',
  isActive && 'active-class',
  className
)} />
```

**`variantClasses()` - Variant-based styling**
```tsx
const buttonClass = variantClasses(
  'base-classes',
  { primary: 'primary-classes', ... },
  variant
);
```

### Constants

Centralized in `app/constants/ui.constants.ts`:

- **COLORS**: Color scheme definitions
- **ANIMATIONS**: Animation classes
- **SPACING**: Consistent spacing
- **RADIUS**: Border radius values
- **SHADOWS**: Shadow utilities
- **TRANSITIONS**: Transition effects

## Adding New Components

### 1. Create Component File

```tsx
// app/components/ui/NewComponent/NewComponent.tsx
'use client';

import { NewComponentProps } from '@/app/types/ui';
import { cn } from '@/app/utils/ui';

export function NewComponent({ prop1, prop2 }: NewComponentProps) {
  return (
    <div className={cn('base-classes')}>
      {/* Component content */}
    </div>
  );
}
```

### 2. Add Type Definition

```typescript
// app/types/ui.ts
export interface NewComponentProps {
  prop1: string;
  prop2?: boolean;
}
```

### 3. Export from Index

```typescript
// app/components/ui/index.ts
export { NewComponent } from './NewComponent/NewComponent';
```

### 4. Document Usage

Add to this README with examples and props documentation.

## Benefits of This Architecture

### 1. Reusability
Components can be used in multiple contexts:
```tsx
<Button variant="primary">Analyze</Button>
<Button variant="secondary">Cancel</Button>
<Button variant="outline">Reset</Button>
```

### 2. Maintainability
Update button styling in one place:
```tsx
// app/components/ui/Button/Button.tsx
const buttonVariants = {
  primary: 'bg-blue-600 hover:bg-blue-700', // Single source of truth
};
```

### 3. Testability
Test components in isolation:
```tsx
test('Button renders with primary variant', () => {
  render(<Button variant="primary">Click</Button>);
  expect(screen.getByRole('button')).toHaveClass('bg-blue-600');
});
```

### 4. Type Safety
Full autocomplete and type checking:
```tsx
<Button variant="primary" size="lg" /> // ✓ Valid
<Button variant="invalid" /> // ✗ TypeScript error
```

### 5. Extensibility
Easy to add new features:
```tsx
// Add new tab to AnalysisResults
const tabs = [
  ...existingTabs,
  { id: 'new-tab', label: 'New Feature', icon: <Icon /> }
];
```

## Best Practices

### Component Design
1. **Single Responsibility**: Each component does one thing well
2. **Composition**: Build complex UI from simple components
3. **Props Interface**: Clear, typed props
4. **Controlled Components**: Parent controls state
5. **Accessibility**: ARIA attributes, semantic HTML

### File Organization
1. One component per file
2. Group related components in folders
3. Include type definitions
4. Export from index files
5. Document with JSDoc comments

### State Management
1. Use custom hooks for complex logic
2. Keep components presentational when possible
3. Lift state to appropriate level
4. Use contexts for global state (future)

## Migration Guide

### Before (Monolithic)
```tsx
// 700 lines in page.tsx
export default function Home() {
  // All state, logic, and UI in one component
}
```

### After (Component-Based)
```tsx
// 50 lines in page.tsx
export default function HomePage() {
  return (
    <MainLayout>
      <Container>
        <Header />
        <ArticleInput {...props} />
        <AnalysisResults {...props} />
        <Footer />
      </Container>
    </MainLayout>
  );
}
```

## Future Enhancements

### Potential Additions
1. **Storybook**: Visual component documentation
2. **Testing**: Jest + React Testing Library
3. **Animation**: Framer Motion integration
4. **Theming**: Dark mode toggle component
5. **i18n**: Internationalization support
6. **Contexts**: Global state management
7. **Form Validation**: Zod + React Hook Form

### Component Ideas
- `Toast` notification component
- `Modal` dialog component
- `Dropdown` menu component
- `Tooltip` component
- `Progress` bar component
- `Skeleton` loading states

## Performance Considerations

### Optimizations Implemented
1. **Code Splitting**: Components loaded as needed
2. **Memoization**: React.memo for expensive renders
3. **Lazy Loading**: Dynamic imports for large components
4. **Debouncing**: Input debouncing in hooks

### Future Optimizations
1. Virtual scrolling for long lists
2. Image lazy loading
3. Bundle size optimization
4. Server components where applicable

## Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com)
- [Component Composition Patterns](https://react.dev/learn/passing-props-to-a-component)

## Support

For questions or issues:
1. Check this documentation
2. Review component JSDoc comments
3. Examine type definitions
4. Look at existing component examples
