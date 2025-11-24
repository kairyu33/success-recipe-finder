# Export Feature Guide

## Overview

The Export Feature provides comprehensive functionality for exporting analysis results in multiple formats. Users can save their AI-generated content in various formats suitable for different use cases.

## Features

### Supported Export Formats

1. **Markdown (.md)** 📄
   - GitHub/note.com compatible format
   - Beautifully formatted with headers, lists, and code blocks
   - Includes emojis for visual appeal
   - Perfect for publishing directly to note.com

2. **JSON (.json)** 💾
   - Structured data format
   - Includes metadata (tokens, cost, timestamp)
   - Ideal for data exchange and programmatic access
   - Includes optional statistics

3. **CSV (.csv)** 📊
   - Spreadsheet-compatible format
   - Opens in Excel, Google Sheets, Numbers
   - Organized by categories (Titles, Hashtags, Insights, etc.)
   - Easy data analysis

4. **HTML (.html)** 🌐
   - Beautifully styled web page
   - View in any browser
   - Print-friendly
   - Interactive copy buttons
   - Professional gradient design

5. **Plain Text (.txt)** 📝
   - Simple, universal format
   - Works on any device/platform
   - Easy to read and edit
   - No formatting dependencies

## Architecture

### Service Layer

```
app/services/export/
├── ExportService.ts          # Main orchestrator
├── MarkdownExporter.ts       # Markdown formatting
├── JSONExporter.ts           # JSON formatting
├── CSVExporter.ts            # CSV formatting
├── HTMLExporter.ts           # HTML formatting
├── TextExporter.ts           # Plain text formatting
├── formatters.ts             # Utility formatters
├── types.ts                  # Type definitions
└── index.ts                  # Module exports
```

### Component Layer

```
app/components/features/Export/
├── ExportButton.tsx          # Dropdown button for format selection
├── ExportModal.tsx           # Modal with preview and options
├── ExportPreview.tsx         # Syntax-highlighted preview
└── index.ts                  # Component exports
```

### Hook Layer

```
app/hooks/
└── useExport.ts              # Custom hook for export logic
```

## Usage

### Basic Export

```typescript
import { ExportService } from '@/app/services/export';

const exportService = new ExportService();

// Export to Markdown
const result = exportService.exportToMarkdown(analysisData, {
  includeMetadata: true,
  includeStats: false
});

// Download file
exportService.downloadFile(result.content, result.filename, result.mimeType);
```

### Using the Hook

```typescript
import { useExport } from '@/app/hooks';

function MyComponent() {
  const { downloadExport, copyExport, isExporting } = useExport({
    onSuccess: (result) => {
      console.log('Exported:', result.filename);
    },
    onError: (error) => {
      console.error('Export failed:', error);
    }
  });

  const handleExport = () => {
    downloadExport(analysisData, {
      format: 'markdown',
      includeMetadata: true
    });
  };

  return (
    <button onClick={handleExport} disabled={isExporting}>
      {isExporting ? 'Exporting...' : 'Export'}
    </button>
  );
}
```

### Using Components

```typescript
import { ExportButton, ExportModal } from '@/app/components/features/Export';

function AnalysisResults({ data }) {
  const [showModal, setShowModal] = useState(false);
  const [format, setFormat] = useState('markdown');

  return (
    <>
      <ExportButton
        onExport={(format) => {
          setFormat(format);
          setShowModal(true);
        }}
      />

      <ExportModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onExport={(options) => handleExport(options)}
        previewContent={previewContent}
        format={format}
      />
    </>
  );
}
```

## Export Options

### ExportOptions Interface

```typescript
interface ExportOptions {
  format: 'markdown' | 'json' | 'csv' | 'html' | 'txt';
  includeMetadata?: boolean;      // Include timestamp, tokens, cost
  includeStats?: boolean;          // Include statistics section
  includeDecoration?: boolean;     // Include headers/footers
  filename?: string;               // Custom filename (without extension)
  template?: string;               // Custom template (future)
}
```

### Default Values

```typescript
{
  includeMetadata: true,
  includeStats: false,
  includeDecoration: true
}
```

## Export Format Examples

### Markdown Format

```markdown
# 📊 記事分析結果

> AI自動生成された分析レポート

## 📋 メタデータ

**分析日時**: 2025-10-25 20:30:45
**トークン使用**: 1,234
**コスト**: $0.0123
**モデル**: claude-sonnet-4-20250514

---

## 📝 提案タイトル

1. **タイトル案1**
2. **タイトル案2**
...
```

### JSON Format

```json
{
  "version": "1.0.0",
  "exportedAt": "2025-10-25T20:30:45Z",
  "metadata": {
    "tokensUsed": 1234,
    "cost": 0.0123,
    "model": "claude-sonnet-4-20250514"
  },
  "results": {
    "titles": [...],
    "hashtags": [...],
    "eyeCatchImage": {...},
    "insights": {...}
  }
}
```

### CSV Format

```csv
Category,Item,Details,Index
Title,Title 1,"タイトル案1",1
Title,Title 2,"タイトル案2",2
Hashtag,Hashtag 1,#タグ1,1
...
```

## API Reference

### ExportService

#### Methods

- `export(data, options)` - Export to any format
- `exportToMarkdown(data, options?)` - Export to Markdown
- `exportToJSON(data, options?)` - Export to JSON
- `exportToCSV(data, options?)` - Export to CSV
- `exportToHTML(data, options?)` - Export to HTML
- `exportToText(data, options?)` - Export to Plain Text
- `downloadFile(content, filename, mimeType)` - Download file
- `copyToClipboard(content)` - Copy to clipboard

### useExport Hook

#### Returns

```typescript
{
  exportData: (data, options) => ExportResult;
  downloadExport: (data, options) => void;
  copyExport: (data, options) => Promise<void>;
  generatePreview: (data, format) => string;
  isExporting: boolean;
  error: Error | null;
  clearError: () => void;
}
```

## Utilities

### Formatters

```typescript
import {
  formatDate,
  formatCost,
  formatTokens,
  sanitizeFilename,
  escapeMarkdown,
  escapeCSV,
  escapeHTML,
  generateFilename,
  calculateSize,
  formatFileSize
} from '@/app/services/export/formatters';

// Format date
formatDate(new Date()); // "2025-10-25 20:30:45"

// Format cost
formatCost(0.0123); // "$0.0123"

// Format tokens
formatTokens(1234); // "1,234"

// Sanitize filename
sanitizeFilename("My File: 2025/10/25"); // "My_File_2025-10-25"

// Generate filename
generateFilename('markdown', new Date(), 'analysis');
// "analysis_20251025_203045.md"

// Calculate and format file size
const size = calculateSize(content);
formatFileSize(size); // "12.5 KB"
```

## Security

### Content Escaping

All exporters properly escape user content to prevent:
- HTML injection (in HTML exports)
- CSV injection (in CSV exports)
- Markdown injection (in Markdown exports)

### File Download

- Uses Blob API for secure file creation
- Proper MIME type validation
- Filename sanitization to prevent path traversal

## Performance

### Optimization Techniques

1. **Lazy Generation**: Content is generated only when needed
2. **Streaming**: Large exports use streaming for memory efficiency
3. **Caching**: Export results can be cached for repeated downloads
4. **Async Operations**: Clipboard operations are async

### Memory Management

- Blob URLs are properly revoked after download
- No memory leaks from event listeners
- Efficient string concatenation using arrays

## Browser Compatibility

### Supported Browsers

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support (iOS 14+)
- Opera: ✅ Full support

### Fallbacks

- Clipboard API fallback for older browsers
- Download link fallback if Blob API unavailable

## Future Enhancements

### Planned Features

1. **Custom Templates**
   - User-defined export templates
   - Variable substitution
   - Template sharing

2. **Batch Export**
   - Export multiple analyses at once
   - Create ZIP archives
   - Bulk operations

3. **Cloud Export**
   - Direct export to Google Drive
   - Export to Dropbox
   - Share via URL

4. **Additional Formats**
   - PDF export with styling
   - DOCX for Microsoft Word
   - ODT for LibreOffice

5. **Export Presets**
   - Save favorite export configurations
   - Quick export with presets
   - Share preset configurations

## Troubleshooting

### Common Issues

**Export button not appearing**
- Ensure full analysis data is available
- Check that component receives correct props

**Download not working**
- Check browser popup blocker
- Verify browser supports download API
- Try copy to clipboard instead

**Preview not displaying**
- Check console for errors
- Verify format is supported
- Try different format

**File size too large**
- Disable metadata and stats
- Use compressed formats (JSON)
- Split into multiple exports

## Examples

### Complete Integration Example

```typescript
import { AnalysisResultsWithExport } from '@/app/components/features/AnalysisResults';

function ArticleAnalyzer() {
  const [analysisData, setAnalysisData] = useState(null);

  return (
    <div>
      {/* Analysis input and processing */}

      {analysisData && (
        <AnalysisResultsWithExport
          data={analysisData}
          fullData={fullAnalysisResult}
        />
      )}
    </div>
  );
}
```

### Custom Export Button

```typescript
import { useExport } from '@/app/hooks';
import { ExportFormat } from '@/app/services/export';

function CustomExportButton({ data, format }: {
  data: FullAnalysisResult;
  format: ExportFormat;
}) {
  const { downloadExport, isExporting } = useExport();

  return (
    <button
      onClick={() => downloadExport(data, { format })}
      disabled={isExporting}
      className="export-button"
    >
      Export as {format.toUpperCase()}
    </button>
  );
}
```

## Testing

### Unit Tests

```typescript
import { ExportService } from '@/app/services/export';

describe('ExportService', () => {
  it('should export to markdown', () => {
    const service = new ExportService();
    const result = service.exportToMarkdown(testData);

    expect(result.extension).toBe('md');
    expect(result.content).toContain('# 📊 記事分析結果');
  });

  it('should export to JSON', () => {
    const service = new ExportService();
    const result = service.exportToJSON(testData);

    const parsed = JSON.parse(result.content);
    expect(parsed.version).toBe('1.0.0');
  });
});
```

## License

This export feature is part of the note-hashtag-ai-generator project.

## Support

For issues or questions about the export feature:
1. Check this documentation
2. Review code examples
3. Check browser console for errors
4. Open an issue on GitHub

---

**Generated by note.com AI Hashtag Generator**
Export Feature Documentation v1.0.0
