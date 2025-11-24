# Component-Based Architecture - Quick Start Guide

## Immediate Benefits

The codebase has been refactored from **700 lines** of monolithic code to a **modular, component-based architecture**. Here's what you get:

### Before vs After

**Before (Monolithic)**
```tsx
// page.tsx - 700 lines
// Everything in one file:
// - State management
// - API calls
// - UI rendering
// - Event handlers
// - Styling
```

**After (Component-Based)**
```tsx
// page.tsx - 50 lines
<MainLayout>
  <Container>
    <Header />
    <ArticleInput {...props} />
    {data && <AnalysisResults data={data} />}
    <Footer />
  </Container>
</MainLayout>
```

## Using the New Architecture

### 1. Basic Component Usage

Import from clean paths:

```tsx
import { Button, Card, CopyButton } from '@/app/components/ui';
import { Container, Section } from '@/app/components/layout';
import { ArticleInput, AnalysisResults } from '@/app/components/features';
```

### 2. Common Patterns

#### Buttons with Variants

```tsx
<Button variant="primary" size="lg" onClick={handleClick}>
  Primary Action
</Button>

<Button variant="secondary" size="md">
  Secondary Action
</Button>

<Button variant="outline" isLoading={loading}>
  Loading...
</Button>
```

#### Cards for Content

```tsx
<Card gradient colorScheme="blue">
  <h2>Card Title</h2>
  <p>Card content with gradient background</p>
</Card>
```

#### Copy to Clipboard

```tsx
<CopyButton
  text="Text to copy"
  itemId="unique-id"
  label="Copy"
/>
```

### 3. Using Custom Hooks

#### Article Analysis

```tsx
const { analyze, data, loading, error, clearError } = useAnalysis();

// Trigger analysis
await analyze(articleText);

// Use the data
{data && <AnalysisResults data={data} />}

// Show error
{error && <ErrorMessage message={error} onDismiss={clearError} />}
```

#### Clipboard Operations

```tsx
const { copy, isCopied } = useClipboard();

<button onClick={() => copy('text', 'id')}>
  {isCopied('id') ? 'Copied!' : 'Copy'}
</button>
```

## File Structure Quick Reference

```
app/
├── components/
│   ├── ui/              # Reusable UI components
│   │   ├── Button/
│   │   ├── Card/
│   │   ├── Tabs/
│   │   └── index.ts     # Import from here
│   ├── features/        # Feature-specific
│   │   ├── ArticleInput/
│   │   ├── AnalysisResults/
│   │   └── index.ts
│   └── layout/          # Layout components
│       ├── Container.tsx
│       └── index.ts
├── hooks/               # Custom hooks
│   ├── useAnalysis.ts
│   └── index.ts
├── types/               # TypeScript types
│   └── ui.ts
├── constants/           # App constants
│   ├── ui.constants.ts
│   └── text.constants.ts
└── utils/               # Utilities
    └── ui/
        └── classNames.ts
```

## Adding a New Feature

### Example: Adding a "Save Analysis" Button

1. **Use existing Button component**:
```tsx
import { Button } from '@/app/components/ui';

<Button
  variant="success"
  size="md"
  leftIcon={<SaveIcon />}
  onClick={handleSave}
>
  Save Analysis
</Button>
```

2. **Create custom hook if needed**:
```tsx
// app/hooks/useSaveAnalysis.ts
export function useSaveAnalysis() {
  const save = async (data) => {
    // Save logic
  };
  return { save };
}
```

3. **Use in component**:
```tsx
const { save } = useSaveAnalysis();
<Button onClick={() => save(data)}>Save</Button>
```

## Common Tasks

### Task 1: Change Button Colors

Edit once in `app/components/ui/Button/Button.tsx`:

```tsx
const buttonVariants = {
  primary: 'bg-blue-600 hover:bg-blue-700', // Change here
};
```

All buttons update automatically!

### Task 2: Add a New Tab

In `app/components/features/AnalysisResults/AnalysisResults.tsx`:

```tsx
const tabs = [
  ...existingTabs,
  {
    id: 'new-tab',
    label: 'New Feature',
    icon: <YourIcon />,
  }
];
```

Create new tab component:
```tsx
// NewTab.tsx
export function NewTab({ data }) {
  return <div>Your new content</div>;
}
```

### Task 3: Update Text Content

Edit `app/constants/text.constants.ts`:

```tsx
export const BUTTON_TEXT = {
  analyze: '記事を分析する', // Change here
  // ...
};
```

All instances update automatically!

### Task 4: Add Loading State

Use the hook:
```tsx
const { loading } = useAnalysis();

<Button isLoading={loading}>
  {loading ? 'Analyzing...' : 'Analyze'}
</Button>
```

## Development Workflow

### Step 1: Start Dev Server
```bash
npm run dev
```

### Step 2: Make Changes
- Edit components in `app/components/`
- Update types in `app/types/`
- Modify constants in `app/constants/`

### Step 3: See Results
Hot reload automatically shows your changes!

### Step 4: Type Check
```bash
npm run type-check
```

## Key Features

### 1. Type Safety
Full TypeScript coverage with autocomplete:
```tsx
<Button
  variant="primary"  // ✓ Autocomplete shows all variants
  size="lg"          // ✓ Type-safe
  isLoading={true}   // ✓ Boolean checked
/>
```

### 2. Reusability
Use components anywhere:
```tsx
// In HomePage
<Button variant="primary">Analyze</Button>

// In Settings
<Button variant="secondary">Save Settings</Button>

// In Modal
<Button variant="outline">Close</Button>
```

### 3. Consistency
Centralized styling ensures consistency:
```tsx
// All cards look the same
<Card>Content 1</Card>
<Card>Content 2</Card>
<Card>Content 3</Card>
```

### 4. Easy Customization
Override styles when needed:
```tsx
<Button className="custom-class">
  Custom Styled Button
</Button>
```

## Testing Components

### Unit Test Example
```tsx
import { render, screen } from '@testing-library/react';
import { Button } from '@/app/components/ui';

test('Button renders correctly', () => {
  render(<Button variant="primary">Click me</Button>);
  expect(screen.getByRole('button')).toHaveTextContent('Click me');
});
```

### Integration Test Example
```tsx
test('ArticleInput shows error on empty submit', async () => {
  const { getByRole, getByText } = render(
    <ArticleInput value="" onChange={...} onAnalyze={...} />
  );

  fireEvent.click(getByRole('button'));
  expect(getByText('記事のテキストを入力してください')).toBeInTheDocument();
});
```

## Troubleshooting

### Import Errors
Make sure you're using the index exports:
```tsx
// ✓ Good
import { Button } from '@/app/components/ui';

// ✗ Avoid
import { Button } from '@/app/components/ui/Button/Button';
```

### Type Errors
Check `app/types/ui.ts` for correct prop types:
```tsx
// ✓ Valid
<Button variant="primary" size="lg" />

// ✗ Invalid - TypeScript will error
<Button variant="invalid" size="huge" />
```

### Styling Issues
Use the `cn()` utility for conditional classes:
```tsx
import { cn } from '@/app/utils/ui';

<div className={cn(
  'base-class',
  isActive && 'active-class',
  className
)} />
```

## Next Steps

1. **Explore Components**: Check `app/components/` directories
2. **Read JSDoc**: Hover over components in VS Code
3. **Review Types**: See `app/types/ui.ts` for all props
4. **Try Examples**: Modify existing components
5. **Build Features**: Create new components following patterns

## Need Help?

1. Check `COMPONENT-ARCHITECTURE.md` for detailed docs
2. Look at existing component examples
3. Review type definitions in `app/types/ui.ts`
4. Examine JSDoc comments in component files

## Quick Reference Card

```tsx
// Import
import { Button, Card } from '@/app/components/ui';
import { useAnalysis } from '@/app/hooks';

// Use Button
<Button variant="primary" size="lg" isLoading={loading}>
  Click Me
</Button>

// Use Card
<Card gradient colorScheme="blue">
  Content
</Card>

// Use Hook
const { analyze, data, loading } = useAnalysis();
await analyze(text);

// Conditional Classes
import { cn } from '@/app/utils/ui';
<div className={cn('base', isActive && 'active')} />
```

Happy coding! 🎉
