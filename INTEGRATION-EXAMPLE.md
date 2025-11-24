# SEO Feature Integration Example

## Quick Integration Guide

This guide shows exactly what changes to make to integrate the SEO feature into your existing UI.

## Step 1: Update Type Definitions

### File: `app/types/ui.ts` (or wherever TabId is defined)

```typescript
// Add 'seo' to TabId type
export type TabId = 'titles' | 'insights' | 'image' | 'hashtags' | 'seo';
```

## Step 2: Update Text Constants

### File: `app/constants/text.constants.ts`

```typescript
export const TAB_TEXT = {
  titles: 'タイトル案',
  insights: 'インサイト',
  image: 'アイキャッチ',
  hashtags: 'ハッシュタグ',
  seo: 'SEO分析',  // Add this line
};

export const SECTION_HEADERS = {
  // ... existing headers
  seo: {
    main: 'SEO最適化分析',
    score: 'SEOスコア',
    improvements: '改善提案',
    keywords: 'キーワード',
    readability: '読みやすさ',
  },
};
```

## Step 3: Update AnalysisResults Component

### File: `app/components/features/AnalysisResults/AnalysisResults.tsx`

```typescript
// 1. Import SEOTab
import { SEOTab } from './SEOTab';
import type { SEOAnalysisResult } from '@/app/services/analysis/SEOService';

// 2. Add SEO data to props type
export interface AnalysisResultsProps {
  data: FullAnalysisResult;
  seoData?: SEOAnalysisResult;  // Add this line
}

// 3. Update component
export function AnalysisResults({ data, seoData }: AnalysisResultsProps) {
  const [activeTab, setActiveTab] = useState<TabId>('titles');

  // 4. Add SEO tab to tabs array
  const tabs = [
    {
      id: 'titles' as TabId,
      label: TAB_TEXT.titles,
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
        </svg>
      ),
    },
    // ... existing tabs (insights, image, hashtags)
    {
      id: 'seo' as TabId,
      label: TAB_TEXT.seo,
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      disabled: !seoData,  // Disable if no SEO data
    },
  ];

  return (
    <Card className="overflow-hidden">
      <TabsContainer>
        {tabs.map((tab) => (
          <Tab
            key={tab.id}
            id={tab.id}
            label={tab.label}
            icon={tab.icon}
            isActive={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            disabled={tab.disabled}
          />
        ))}
      </TabsContainer>

      {/* Existing tab panels */}
      <TabPanel isActive={activeTab === 'titles'}>
        <TitlesTab data={data} />
      </TabPanel>

      <TabPanel isActive={activeTab === 'insights'}>
        <InsightsTab data={data} />
      </TabPanel>

      <TabPanel isActive={activeTab === 'image'}>
        <EyeCatchTab data={data} />
      </TabPanel>

      <TabPanel isActive={activeTab === 'hashtags'}>
        <HashtagsTab data={data} />
      </TabPanel>

      {/* Add SEO tab panel */}
      <TabPanel isActive={activeTab === 'seo'}>
        {seoData ? (
          <SEOTab data={seoData} />
        ) : (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <p>SEO分析データがありません</p>
          </div>
        )}
      </TabPanel>
    </Card>
  );
}
```

## Step 4: Update Main Page/Form

### File: `app/page.tsx` (or your main component)

```typescript
import { useState } from 'react';
import type { FullAnalysisResult } from '@/app/services/analysis/types';
import type { SEOAnalysisResult } from '@/app/services/analysis/SEOService';

export default function MainPage() {
  const [articleText, setArticleText] = useState('');
  const [analysisData, setAnalysisData] = useState<FullAnalysisResult | null>(null);
  const [seoData, setSeoData] = useState<SEOAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [seoLoading, setSeoLoading] = useState(false);

  // Existing full analysis function
  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/analyze-article-full', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleText }),
      });
      const result = await response.json();
      setAnalysisData(result);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setLoading(false);
    }
  };

  // NEW: SEO analysis function
  const handleSEOAnalysis = async () => {
    if (!articleText || articleText.length < 50) {
      alert('記事テキストを入力してください（50文字以上）');
      return;
    }

    setSeoLoading(true);
    try {
      const response = await fetch('/api/seo-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          articleText,
          title: analysisData?.suggestedTitles[0],  // Use suggested title if available
          options: { useCache: true },
        }),
      });

      const result = await response.json();
      if (result.success) {
        setSeoData(result.data);
      } else {
        console.error('SEO analysis error:', result.error);
        alert(`SEO分析エラー: ${result.message || result.error}`);
      }
    } catch (error) {
      console.error('SEO analysis failed:', error);
      alert('SEO分析に失敗しました');
    } finally {
      setSeoLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1>Note記事分析ツール</h1>

      {/* Article input */}
      <textarea
        value={articleText}
        onChange={(e) => setArticleText(e.target.value)}
        placeholder="記事テキストを入力してください"
        className="w-full p-4 border rounded-lg"
        rows={10}
      />

      {/* Action buttons */}
      <div className="flex gap-4 mt-4">
        <button
          onClick={handleAnalyze}
          disabled={loading || !articleText}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300"
        >
          {loading ? '分析中...' : '記事を分析'}
        </button>

        {/* NEW: SEO Analysis button */}
        <button
          onClick={handleSEOAnalysis}
          disabled={seoLoading || !articleText}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300"
        >
          {seoLoading ? 'SEO分析中...' : 'SEO分析'}
        </button>
      </div>

      {/* Results display */}
      {analysisData && (
        <AnalysisResults
          data={analysisData}
          seoData={seoData}  // Pass SEO data
        />
      )}
    </div>
  );
}
```

## Step 5: Optional - Add Inline SEO Score

### Show SEO score badge next to analysis results

```typescript
// In your results header
{seoData && (
  <div className="flex items-center gap-3 mt-4">
    <span className="text-sm text-gray-600 dark:text-gray-400">
      SEOスコア:
    </span>
    <span className={`px-4 py-2 rounded-lg font-bold text-lg ${
      seoData.grade === 'A' ? 'bg-green-100 text-green-800 border-2 border-green-300' :
      seoData.grade === 'B' ? 'bg-blue-100 text-blue-800 border-2 border-blue-300' :
      seoData.grade === 'C' ? 'bg-yellow-100 text-yellow-800 border-2 border-yellow-300' :
      seoData.grade === 'D' ? 'bg-orange-100 text-orange-800 border-2 border-orange-300' :
      'bg-red-100 text-red-800 border-2 border-red-300'
    }`}>
      {seoData.score}/100 ({seoData.grade})
    </span>

    {seoData.improvements.critical.length > 0 && (
      <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
        {seoData.improvements.critical.length}件の重要な問題
      </span>
    )}
  </div>
)}
```

## Step 6: Optional - Auto-run SEO with Full Analysis

### Automatically run SEO analysis after full analysis completes

```typescript
const handleAnalyze = async () => {
  setLoading(true);
  try {
    // Run full analysis
    const response = await fetch('/api/analyze-article-full', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ articleText }),
    });
    const result = await response.json();
    setAnalysisData(result);

    // Automatically run SEO analysis
    handleSEOAnalysis();
  } catch (error) {
    console.error('Analysis failed:', error);
  } finally {
    setLoading(false);
  }
};
```

## Step 7: Test the Integration

### 1. Start dev server
```bash
npm run dev
```

### 2. Open browser
Navigate to `http://localhost:3000`

### 3. Test flow
1. Enter article text (at least 50 characters)
2. Click "記事を分析" (or "SEO分析")
3. Wait for analysis to complete
4. Click on "SEO分析" tab
5. Verify all sections display correctly:
   - SEO score with grade
   - Meta description
   - Improvements (critical/important/optional)
   - Keywords (primary/secondary/long-tail)
   - Readability metrics
   - Content structure

## Complete Example Files

For reference, complete example files are available:
- `app/components/features/AnalysisResults/SEOTab.tsx` - Full UI component
- `app/api/seo-analysis/route.ts` - API endpoint
- `SEO-QUICKSTART.md` - Quick start guide
- `SEO-FEATURE-SUMMARY.md` - Complete documentation

## Troubleshooting Integration

### Issue: "Module not found: SEOTab"

**Solution**: Ensure import path is correct:
```typescript
import { SEOTab } from './SEOTab';
// or
import { SEOTab } from '@/app/components/features/AnalysisResults/SEOTab';
```

### Issue: "Property 'seo' does not exist on type 'TabId'"

**Solution**: Add 'seo' to TabId type union:
```typescript
export type TabId = 'titles' | 'insights' | 'image' | 'hashtags' | 'seo';
```

### Issue: SEO tab shows "no data"

**Solution**: Ensure SEO data is passed to AnalysisResults:
```typescript
<AnalysisResults data={analysisData} seoData={seoData} />
```

### Issue: API returns 500 error

**Solution**: Check ANTHROPIC_API_KEY is set in `.env`:
```bash
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

## Next Steps

1. Test with various article lengths and types
2. Customize thresholds in `app/config/seo.config.ts`
3. Add loading states and error handling
4. Implement cost tracking dashboard
5. Set up monitoring and analytics

---

**Ready to use!** The SEO feature is now fully integrated into your note-hashtag-ai-generator application.
