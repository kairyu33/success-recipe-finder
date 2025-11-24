# 📜 History Management Feature Guide

Complete guide for the analysis history management system in note-hashtag-ai-generator.

## 🎯 Overview

The history management feature automatically saves all article analyses to browser localStorage, allowing users to:

- Track past analyses with timestamps
- View detailed results from previous sessions
- Monitor cost and token usage over time
- Search and filter history
- Export/import history data
- Manage storage efficiently

## 🏗️ Architecture

### Core Components

```
app/
├── services/
│   └── history/
│       └── HistoryService.ts          # Core history management logic
├── hooks/
│   └── useHistory.ts                  # React hook for history operations
├── utils/
│   └── storage.ts                     # Type-safe localStorage wrapper
└── components/
    └── features/
        └── AnalysisHistory/
            ├── HistoryButton.tsx      # Header button with badge
            ├── HistoryPanel.tsx       # Sidebar panel
            ├── HistoryModal.tsx       # Full-screen detail view
            ├── HistoryItem.tsx        # Individual history card
            ├── HistoryStats.tsx       # Statistics dashboard
            └── index.ts               # Component exports
```

## 🔧 Core Services

### HistoryService

**Location**: `app/services/history/HistoryService.ts`

Provides complete CRUD operations for history management:

```typescript
import { historyService } from '@/app/services/history/HistoryService';

// Save analysis
const item = historyService.save({
  timestamp: Date.now(),
  articlePreview: 'Article text...',
  results: { hashtags: [...], titles: [...] },
  metadata: { cost: 0.01, tokensUsed: 1000 }
});

// Get all history
const allHistory = historyService.getAll();

// Get specific item
const item = historyService.getById('item-id');

// Delete item
historyService.delete('item-id');

// Clear all history
historyService.clear();

// Export to JSON
const json = historyService.export();

// Import from JSON
historyService.import(jsonString, merge: true);

// Search
const results = historyService.search('keyword');

// Get statistics
const stats = historyService.getStats();
```

### Storage Utility

**Location**: `app/utils/storage.ts`

Type-safe wrapper around localStorage:

```typescript
import { storage } from '@/app/utils/storage';

// Type-safe operations
storage.setItem('key', { data: 'value' });
const data = storage.getItem<MyType>('key');

// Storage monitoring
const size = storage.getSize();
const usage = storage.getUsagePercent();
const formatted = storage.formatBytes(size);
```

## 🎣 React Hook

### useHistory Hook

**Location**: `app/hooks/useHistory.ts`

React hook providing history state and operations:

```typescript
import { useHistory } from '@/app/hooks/useHistory';

function MyComponent() {
  const {
    history,              // Array of all history items
    loading,              // Loading state
    saveAnalysis,         // Save new analysis
    deleteItem,           // Delete single item
    clearAll,             // Clear all history
    search,               // Search history
    exportHistory,        // Export as JSON
    importHistory,        // Import from JSON
    getStats,             // Get statistics
    isStorageNearLimit,   // Storage warning
  } = useHistory();

  // Auto-saves on analysis complete
  useEffect(() => {
    if (analysisData) {
      saveAnalysis(analysisData, articleText);
    }
  }, [analysisData]);

  return (/* UI */);
}
```

## 🎨 UI Components

### 1. HistoryButton

Header button with item count badge.

**Location**: `app/components/features/AnalysisHistory/HistoryButton.tsx`

```tsx
<HistoryButton
  count={23}
  onClick={() => setIsOpen(true)}
  isOpen={isOpen}
/>
```

**Features**:
- Clock icon indicating history
- Badge showing count (displays "99+" for 100+)
- Responsive label (hidden on mobile)

### 2. HistoryPanel

Sidebar panel for browsing history.

**Location**: `app/components/features/AnalysisHistory/HistoryPanel.tsx`

```tsx
<HistoryPanel
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  onViewItem={handleViewItem}
/>
```

**Features**:
- Search by article content
- Sort options (newest, oldest, cost)
- Statistics toggle
- Export/clear all actions
- Storage warning
- Responsive design

### 3. HistoryModal

Full-screen modal for viewing detailed history.

**Location**: `app/components/features/AnalysisHistory/HistoryModal.tsx`

```tsx
<HistoryModal
  item={selectedItem}
  onClose={() => setItem(null)}
  onLoadInEditor={handleLoad}
/>
```

**Features**:
- All analysis results displayed
- Copy buttons for easy access
- Load in editor functionality
- Export single item
- Formatted metadata

### 4. HistoryItem

Individual history card component.

**Location**: `app/components/features/AnalysisHistory/HistoryItem.tsx`

```tsx
<HistoryItem
  item={historyItem}
  onView={handleView}
  onDelete={handleDelete}
/>
```

**Features**:
- Relative timestamp ("2 hours ago")
- Article preview
- Quick stats (cost, tags, tokens)
- Delete with confirmation
- Click to view details

### 5. HistoryStats

Statistics dashboard component.

**Location**: `app/components/features/AnalysisHistory/HistoryStats.tsx`

```tsx
<HistoryStats />
```

**Displays**:
- Total analyses performed
- Total cost (USD & JPY)
- Average cost per analysis
- Average tokens per analysis
- Total token usage with progress bar
- Date range

## 💾 Data Structure

### AnalysisHistoryItem

```typescript
interface AnalysisHistoryItem {
  id: string;                    // Unique identifier
  timestamp: number;              // Unix timestamp
  articlePreview: string;         // First 100 chars
  results: {
    titles?: string[];
    hashtags?: string[];
    insights?: {
      whatYouLearn?: string[];
      benefits?: string[];
      recommendedFor?: string[];
      oneLiner?: string;
    };
    eyeCatchImage?: {
      mainPrompt?: string;
      compositionIdeas?: string[];
      colorPalette?: string[];
      mood?: string;
      style?: string;
      summary?: string;
    };
  };
  metadata: {
    tokensUsed?: number;
    cost?: number;
    duration?: number;
  };
}
```

### LocalStorage Schema

**Key**: `note-hashtag-history`

```typescript
{
  version: '1.0',
  items: AnalysisHistoryItem[],
  settings: {
    maxItems: 100,
    autoDeleteAfterDays: 30
  }
}
```

## 🔄 Integration Guide

### Step 1: Import Required Components

```typescript
import { HistoryPanel, HistoryModal } from '@/app/components/features';
import { useHistory } from '@/app/hooks/useHistory';
```

### Step 2: Add State Management

```typescript
const { history, saveAnalysis } = useHistory();
const [isHistoryPanelOpen, setIsHistoryPanelOpen] = useState(false);
const [selectedItem, setSelectedItem] = useState<AnalysisHistoryItem | null>(null);
```

### Step 3: Auto-save on Analysis

```typescript
useEffect(() => {
  if (analysisData && articleText) {
    saveAnalysis(analysisData, articleText);
  }
}, [analysisData, articleText, saveAnalysis]);
```

### Step 4: Add UI Components

```tsx
// In Header
<Header
  onOpenHistory={() => setIsHistoryPanelOpen(true)}
  historyCount={history.length}
/>

// At root level
<HistoryPanel
  isOpen={isHistoryPanelOpen}
  onClose={() => setIsHistoryPanelOpen(false)}
  onViewItem={setSelectedItem}
/>

<HistoryModal
  item={selectedItem}
  onClose={() => setSelectedItem(null)}
  onLoadInEditor={handleLoadInEditor}
/>
```

## 📊 Usage Statistics

The history system tracks:

- **Total analyses**: Count of all saved analyses
- **Total cost**: Sum of all API costs (USD)
- **Total tokens**: Sum of all tokens used
- **Average cost**: Mean cost per analysis
- **Average tokens**: Mean tokens per analysis
- **Date range**: Oldest to newest entry

Access via:

```typescript
const stats = historyService.getStats();
// or
const { getStats } = useHistory();
const stats = getStats();
```

## 🔍 Search & Filter

### Search

Search across article preview, titles, and hashtags:

```typescript
const { search } = useHistory();
const results = search('keyword');
```

### Filter by Date

Filter items within date range:

```typescript
const { filterByDate } = useHistory();
const startDate = Date.now() - (7 * 24 * 60 * 60 * 1000); // 7 days ago
const endDate = Date.now();
const results = filterByDate(startDate, endDate);
```

### Sort Options

Available in HistoryPanel UI:
- **Newest first** (default)
- **Oldest first**
- **Cost high to low**
- **Cost low to high**

## 📤 Export & Import

### Export History

```typescript
// Via hook
const { exportHistory } = useHistory();
const json = exportHistory();

// Download as file
const blob = new Blob([json], { type: 'application/json' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = `history-${Date.now()}.json`;
a.click();
```

### Import History

```typescript
const { importHistory } = useHistory();

// Replace existing history
importHistory(jsonString, false);

// Merge with existing history
importHistory(jsonString, true);
```

## ⚠️ Storage Management

### Automatic Cleanup

The system automatically:
- Deletes entries older than 30 days
- Keeps maximum 100 items
- Shows warning at 80% storage capacity
- Handles quota exceeded errors

### Manual Cleanup

```typescript
const { clearAll } = useHistory();
clearAll(); // Prompts for confirmation
```

### Storage Monitoring

```typescript
const { isStorageNearLimit } = useHistory();

if (isStorageNearLimit) {
  // Show warning to user
  alert('ストレージ容量が不足しています');
}
```

## 🎨 UI Design Patterns

### Mobile-First Responsive Design

All components adapt to screen size:

```tsx
// Full width on mobile, 384px on desktop
className="w-full sm:w-96"

// Stack on mobile, row on desktop
className="flex-col sm:flex-row"

// Hide labels on mobile
className="hidden sm:inline"
```

### Dark Mode Support

All components support dark mode:

```tsx
className="bg-white dark:bg-gray-900"
className="text-gray-900 dark:text-white"
```

### Animations & Transitions

Smooth transitions enhance UX:

```tsx
className="transition-colors hover:bg-gray-50"
className="transition-all duration-300"
```

## 🔐 Privacy & Security

- All data stored locally in browser
- No data sent to external servers
- User controls all data (export/delete)
- Automatic cleanup prevents data accumulation
- Cross-tab synchronization supported

## 🐛 Troubleshooting

### History Not Saving

Check if localStorage is available:

```typescript
import { storage } from '@/app/utils/storage';

if (!storage.isAvailable()) {
  console.error('localStorage not available');
}
```

### Storage Quota Exceeded

```typescript
const { isStorageNearLimit, clearAll } = useHistory();

if (isStorageNearLimit) {
  // Prompt user to delete old entries
  if (confirm('ストレージがいっぱいです。古い履歴を削除しますか？')) {
    clearAll();
  }
}
```

### Import Failed

Ensure JSON is valid:

```typescript
try {
  importHistory(data, false);
} catch (error) {
  console.error('Invalid JSON format:', error);
  alert('無効なファイル形式です');
}
```

## 🚀 Performance Optimization

### Pagination

History list is paginated automatically:
- Loads 20 items at a time
- Lazy loading for large lists
- Virtual scrolling for 100+ items

### Compression

Old entries are compressed:
- Remove unnecessary data
- Truncate long previews
- Compress metadata

### Debounced Search

Search input is debounced:
- 300ms delay before search
- Prevents excessive re-renders
- Smooth user experience

## 📱 Mobile Experience

Optimized for mobile devices:
- Touch-friendly tap targets (44x44px minimum)
- Swipe to delete (future enhancement)
- Pull to refresh (future enhancement)
- Responsive typography
- Optimized for one-handed use

## 🔮 Future Enhancements

Planned features:
- [ ] Cloud sync across devices
- [ ] Collaborative history sharing
- [ ] Advanced filtering options
- [ ] Export to CSV/Excel
- [ ] Charts for cost trends
- [ ] Tagging system
- [ ] Full-text search
- [ ] Undo delete functionality
- [ ] Bulk operations
- [ ] Keyboard shortcuts

## 📞 Support

For issues or questions:
1. Check this documentation
2. Review component source code
3. Check browser console for errors
4. Verify localStorage permissions

## 🎉 Summary

The history management feature provides:

✅ Automatic saving of all analyses
✅ Complete CRUD operations
✅ Search and filtering
✅ Export/import capabilities
✅ Statistics dashboard
✅ Storage management
✅ Mobile-optimized UI
✅ Dark mode support
✅ Type-safe implementation
✅ Comprehensive documentation

Now users never lose their analysis results and can track their usage over time!
