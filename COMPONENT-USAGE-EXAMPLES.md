# Component Usage Examples

## Practical Examples for Common Tasks

This guide provides real-world examples for using the component-based architecture.

## Table of Contents
1. [Adding a New Button](#adding-a-new-button)
2. [Creating a New Card Section](#creating-a-new-card-section)
3. [Adding a Copy Feature](#adding-a-copy-feature)
4. [Building a Custom Tab](#building-a-custom-tab)
5. [Creating a Form](#creating-a-form)
6. [Adding Error Handling](#adding-error-handling)
7. [Implementing Loading States](#implementing-loading-states)
8. [Customizing Styles](#customizing-styles)

---

## Adding a New Button

### Basic Usage
```tsx
import { Button } from '@/app/components/ui';

function MyComponent() {
  return (
    <Button variant="primary" size="lg" onClick={() => console.log('Clicked!')}>
      Click Me
    </Button>
  );
}
```

### Button with Icon
```tsx
import { Button } from '@/app/components/ui';

const SaveIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

function SaveButton() {
  return (
    <Button
      variant="success"
      size="md"
      leftIcon={<SaveIcon />}
    >
      Save Changes
    </Button>
  );
}
```

### Button with Loading State
```tsx
import { Button } from '@/app/components/ui';
import { useState } from 'react';

function SubmitButton() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await someAsyncOperation();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="primary"
      isLoading={loading}
      onClick={handleSubmit}
    >
      {loading ? 'Submitting...' : 'Submit'}
    </Button>
  );
}
```

---

## Creating a New Card Section

### Basic Card
```tsx
import { Card } from '@/app/components/ui';

function InfoCard() {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4">Card Title</h2>
      <p className="text-gray-600 dark:text-gray-300">
        Card content goes here...
      </p>
    </Card>
  );
}
```

### Gradient Card
```tsx
import { Card } from '@/app/components/ui';

function HighlightCard() {
  return (
    <Card gradient colorScheme="blue" className="p-6">
      <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100">
        Special Announcement
      </h3>
      <p className="text-blue-800 dark:text-blue-200 mt-2">
        This card has a beautiful gradient background!
      </p>
    </Card>
  );
}
```

### Card with Multiple Sections
```tsx
import { Card } from '@/app/components/ui';

function DetailCard({ data }: { data: MyData }) {
  return (
    <Card className="p-6 space-y-4">
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold">{data.title}</h2>
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold">Details</h3>
        <ul className="list-disc pl-5">
          {data.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="border-t pt-4">
        <Button variant="primary">Take Action</Button>
      </div>
    </Card>
  );
}
```

---

## Adding a Copy Feature

### Simple Copy Button
```tsx
import { CopyButton } from '@/app/components/ui';

function CodeBlock({ code }: { code: string }) {
  return (
    <div className="relative bg-gray-900 rounded-lg p-4">
      <pre className="text-white">{code}</pre>
      <div className="absolute top-2 right-2">
        <CopyButton text={code} itemId="code-block" />
      </div>
    </div>
  );
}
```

### Copy with Custom Hook
```tsx
import { useClipboard } from '@/app/hooks';

function ShareButtons({ url }: { url: string }) {
  const { copy, isCopied } = useClipboard();

  return (
    <div className="flex gap-2">
      <button
        onClick={() => copy(url, 'share-url')}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg"
      >
        {isCopied('share-url') ? 'Copied!' : 'Copy Link'}
      </button>
    </div>
  );
}
```

### Batch Copy Feature
```tsx
import { useClipboard } from '@/app/hooks';

function DataList({ items }: { items: string[] }) {
  const { copy, isCopied } = useClipboard();

  const copyAll = () => {
    const allText = items.join('\n');
    copy(allText, 'all-items');
  };

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h3 className="font-bold">Items ({items.length})</h3>
        <button onClick={copyAll} className="text-blue-600">
          {isCopied('all-items') ? 'Copied All!' : 'Copy All'}
        </button>
      </div>

      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex justify-between items-center p-2 border rounded">
            <span>{item}</span>
            <button onClick={() => copy(item, `item-${i}`)}>
              {isCopied(`item-${i}`) ? '✓' : 'Copy'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## Building a Custom Tab

### Creating a New Tab Component
```tsx
// app/components/features/AnalysisResults/MyNewTab.tsx
import { SECTION_HEADERS } from '@/app/constants/text.constants';
import { COLORS } from '@/app/constants/ui.constants';

interface MyNewTabProps {
  data: {
    items: string[];
  };
}

export function MyNewTab({ data }: MyNewTabProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        My New Feature
      </h2>

      <div className="grid grid-cols-2 gap-4">
        {data.items.map((item, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg ${COLORS.blue.bg} ${COLORS.blue.border} border`}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Integrating the Tab
```tsx
// app/components/features/AnalysisResults/AnalysisResults.tsx
import { MyNewTab } from './MyNewTab';

// Add to tabs array
const tabs = [
  // ... existing tabs
  {
    id: 'mynew' as TabId,
    label: 'My Feature',
    icon: <MyIcon />,
  },
];

// Add TabPanel
<TabPanel id="mynew" isActive={activeTab === 'mynew'}>
  <MyNewTab data={data} />
</TabPanel>
```

---

## Creating a Form

### Form with Validation
```tsx
import { useState } from 'react';
import { Card, Button, ErrorMessage } from '@/app/components/ui';

function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email) {
      setError('All fields are required');
      return;
    }

    if (!email.includes('@')) {
      setError('Invalid email address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await submitForm({ name, email });
      // Success handling
    } catch (err) {
      setError('Failed to submit form');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-2">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700"
          />
        </div>

        {error && <ErrorMessage message={error} onDismiss={() => setError('')} />}

        <Button type="submit" variant="primary" isLoading={loading} className="w-full">
          Submit
        </Button>
      </form>
    </Card>
  );
}
```

---

## Adding Error Handling

### Simple Error Display
```tsx
import { ErrorMessage } from '@/app/components/ui';

function MyComponent() {
  const [error, setError] = useState('');

  return (
    <div>
      {error && <ErrorMessage message={error} onDismiss={() => setError('')} />}
      {/* Your content */}
    </div>
  );
}
```

### Error with Retry
```tsx
import { ErrorMessage, Button } from '@/app/components/ui';

function DataFetcher() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="space-y-4">
        <ErrorMessage message={error} />
        <Button variant="secondary" onClick={fetchData}>
          Try Again
        </Button>
      </div>
    );
  }

  return <div>{/* Success content */}</div>;
}
```

---

## Implementing Loading States

### Basic Loading
```tsx
import { LoadingSpinner } from '@/app/components/ui';

function LoadingComponent() {
  const [loading, setLoading] = useState(true);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return <div>{/* Loaded content */}</div>;
}
```

### Skeleton Loading
```tsx
function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 animate-pulse">
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
    </div>
  );
}

function ContentList({ loading, items }: { loading: boolean; items: any[] }) {
  if (loading) {
    return (
      <div className="space-y-4">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item, i) => (
        <Card key={i}>{/* Item content */}</Card>
      ))}
    </div>
  );
}
```

---

## Customizing Styles

### Using className Prop
```tsx
import { Button } from '@/app/components/ui';

function CustomStyledButton() {
  return (
    <Button
      variant="primary"
      className="rounded-full shadow-2xl hover:scale-110"
    >
      Custom Styled
    </Button>
  );
}
```

### Using cn() Utility
```tsx
import { cn } from '@/app/utils/ui';

function ConditionalCard({ isHighlighted, isError }: Props) {
  return (
    <div
      className={cn(
        'p-6 rounded-lg border',
        isHighlighted && 'bg-yellow-50 border-yellow-400',
        isError && 'bg-red-50 border-red-400',
        !isHighlighted && !isError && 'bg-white border-gray-200'
      )}
    >
      {/* Content */}
    </div>
  );
}
```

### Creating Custom Variants
```tsx
// Extend existing component
import { Button } from '@/app/components/ui';
import { cn } from '@/app/utils/ui';

function IconButton({ icon, ...props }: { icon: React.ReactNode } & any) {
  return (
    <Button
      {...props}
      className={cn('aspect-square p-0 w-10 h-10', props.className)}
    >
      {icon}
    </Button>
  );
}

// Usage
<IconButton icon={<TrashIcon />} variant="danger" />
```

---

## Advanced Patterns

### Compound Components
```tsx
import { Card } from '@/app/components/ui';

function FeatureCard({ children }: { children: React.ReactNode }) {
  return <Card className="p-6">{children}</Card>;
}

FeatureCard.Header = function Header({ children }: { children: React.ReactNode }) {
  return <div className="border-b pb-4 mb-4">{children}</div>;
};

FeatureCard.Body = function Body({ children }: { children: React.ReactNode }) {
  return <div className="space-y-4">{children}</div>;
};

FeatureCard.Footer = function Footer({ children }: { children: React.ReactNode }) {
  return <div className="border-t pt-4 mt-4">{children}</div>;
};

// Usage
<FeatureCard>
  <FeatureCard.Header>
    <h2>Title</h2>
  </FeatureCard.Header>
  <FeatureCard.Body>
    <p>Content</p>
  </FeatureCard.Body>
  <FeatureCard.Footer>
    <Button>Action</Button>
  </FeatureCard.Footer>
</FeatureCard>
```

### Render Props Pattern
```tsx
import { useClipboard } from '@/app/hooks';

function CopyWrapper({
  text,
  children
}: {
  text: string;
  children: (props: { copy: () => void; copied: boolean }) => React.ReactNode;
}) {
  const { copy, isCopied } = useClipboard();
  const itemId = `copy-${text.slice(0, 10)}`;

  return (
    <>
      {children({
        copy: () => copy(text, itemId),
        copied: isCopied(itemId),
      })}
    </>
  );
}

// Usage
<CopyWrapper text="Some text">
  {({ copy, copied }) => (
    <button onClick={copy}>
      {copied ? 'Copied!' : 'Copy'}
    </button>
  )}
</CopyWrapper>
```

## Tips and Best Practices

1. **Always use TypeScript types** - Import from `@/app/types/ui`
2. **Leverage constants** - Use `@/app/constants` for consistency
3. **Compose components** - Build complex UI from simple pieces
4. **Use custom hooks** - Extract reusable logic
5. **Keep components focused** - Single responsibility principle
6. **Document with JSDoc** - Help future developers (including you!)

## Need More Examples?

Check the existing components in:
- `app/components/features/` - Real-world feature examples
- `app/components/ui/` - Base component implementations
- `app/page.tsx` - Component composition in action

Happy coding! 🚀
