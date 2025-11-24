# Export Feature - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### 1. Basic Export (Simplest Way)

```typescript
import { exportService } from '@/app/services/export';

// One-line export
const result = exportService.exportToMarkdown(analysisData);

// Download the file
exportService.downloadFile(result.content, result.filename, result.mimeType);
```

### 2. Using the Hook (Recommended)

```typescript
import { useExport } from '@/app/hooks';

function MyComponent() {
  const { downloadExport } = useExport();

  const handleExport = () => {
    downloadExport(analysisData, { format: 'markdown' });
  };

  return <button onClick={handleExport}>Export</button>;
}
```

### 3. Using the UI Component (Easiest)

```typescript
import { ExportButton } from '@/app/components/features/Export';

function MyComponent() {
  const handleExport = (format) => {
    console.log(`Exporting as ${format}`);
    // Export logic here
  };

  return <ExportButton onExport={handleExport} />;
}
```

## 📋 Common Use Cases

### Export to Markdown for note.com

```typescript
const { downloadExport } = useExport();

downloadExport(analysisData, {
  format: 'markdown',
  includeMetadata: true
});
```

### Export to JSON for Backup

```typescript
const { downloadExport } = useExport();

downloadExport(analysisData, {
  format: 'json',
  includeMetadata: true,
  includeStats: true
});
```

### Export to CSV for Analysis

```typescript
const { downloadExport } = useExport();

downloadExport(analysisData, {
  format: 'csv',
  includeMetadata: false
});
```

### Export to HTML for Viewing

```typescript
const { downloadExport } = useExport();

downloadExport(analysisData, {
  format: 'html',
  includeMetadata: true
});
```

### Copy to Clipboard

```typescript
const { copyExport } = useExport();

await copyExport(analysisData, {
  format: 'markdown'
});

alert('Copied to clipboard!');
```

## 🎨 Complete Example with UI

```typescript
'use client';

import { useState } from 'react';
import { ExportButton, ExportModal } from '@/app/components/features/Export';
import { useExport } from '@/app/hooks';

export function MyAnalysisPage() {
  const [showModal, setShowModal] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState('markdown');
  const [analysisData, setAnalysisData] = useState(null);

  const { downloadExport, generatePreview } = useExport({
    onSuccess: (result) => {
      alert(`Exported: ${result.filename}`);
    }
  });

  const handleExportClick = (format) => {
    setSelectedFormat(format);
    setShowModal(true);
  };

  const handleExportConfirm = (options) => {
    downloadExport(analysisData, options);
    setShowModal(false);
  };

  return (
    <div>
      <h1>Analysis Results</h1>

      {/* Your analysis display */}

      <ExportButton onExport={handleExportClick} />

      <ExportModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onExport={handleExportConfirm}
        previewContent={generatePreview(analysisData, selectedFormat)}
        format={selectedFormat}
      />
    </div>
  );
}
```

## 🔧 Customization

### Custom Filename

```typescript
downloadExport(analysisData, {
  format: 'markdown',
  filename: 'my-custom-analysis'
  // Will become: my-custom-analysis.md
});
```

### Minimal Export (No Metadata)

```typescript
downloadExport(analysisData, {
  format: 'markdown',
  includeMetadata: false,
  includeDecoration: false
});
```

### Full Export (Everything)

```typescript
downloadExport(analysisData, {
  format: 'json',
  includeMetadata: true,
  includeStats: true,
  includeDecoration: true
});
```

## 🎯 Integration with Existing Code

### Add Export to AnalysisResults

Replace:
```typescript
<AnalysisResults data={analysisData} />
```

With:
```typescript
<AnalysisResultsWithExport
  data={analysisData}
  fullData={fullAnalysisResult}
/>
```

That's it! Export functionality is now integrated.

## 📱 Export on Mobile

The export feature works on mobile devices:

- **iOS Safari**: Downloads to Files app
- **Android Chrome**: Downloads to Downloads folder
- **Copy to Clipboard**: Works on all devices

## 🔍 Debugging

### Check if Export is Working

```typescript
const { exportData, error } = useExport();

try {
  const result = exportData(analysisData, { format: 'markdown' });
  console.log('Export successful:', result);
} catch (err) {
  console.error('Export failed:', err);
}

// Check error state
if (error) {
  console.error('Export error:', error.message);
}
```

### Verify Data Structure

```typescript
// Make sure data has required fields
const fullData = {
  suggestedTitles: ['Title 1', 'Title 2'],
  hashtags: ['#tag1', '#tag2'],
  eyeCatchImage: {
    mainPrompt: 'Image prompt',
    compositionIdeas: ['Idea 1'],
    colorPalette: ['#FF0000'],
    mood: 'energetic',
    style: 'modern',
    summary: 'Summary'
  },
  insights: {
    whatYouLearn: ['Point 1'],
    benefits: ['Benefit 1'],
    recommendedFor: ['Persona 1'],
    oneLiner: 'One liner'
  }
};
```

## 🎓 Best Practices

1. **Always provide full data** - Include all required fields
2. **Handle errors gracefully** - Use onError callback
3. **Show loading state** - Display isExporting status
4. **Provide user feedback** - Show success/error messages
5. **Use appropriate format** - Match format to use case

## 📚 Next Steps

- Read the full [EXPORT-FEATURE-GUIDE.md](./EXPORT-FEATURE-GUIDE.md)
- Explore format-specific examples
- Customize export templates (coming soon)
- Implement batch exports (coming soon)

## 🆘 Common Issues

**"No full data available for export"**
→ Make sure to pass `fullData` prop with all required fields

**Download not starting**
→ Check browser popup blocker settings

**Modal not showing**
→ Verify `isOpen` state is being set correctly

**Preview is empty**
→ Check that `generatePreview` is called with valid data

---

For more detailed information, see [EXPORT-FEATURE-GUIDE.md](./EXPORT-FEATURE-GUIDE.md)

**Happy Exporting!** 🎉
