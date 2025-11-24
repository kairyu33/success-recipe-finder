# SEO Feature - Quick Start Guide

## Getting Started in 5 Minutes

### 1. Prerequisites

- Node.js 18+ installed
- Anthropic API key set in `.env`:
  ```bash
  ANTHROPIC_API_KEY=sk-ant-your-key-here
  ```

### 2. Test the API

```bash
# Start dev server
npm run dev

# Test endpoint (in another terminal)
curl -X POST http://localhost:3000/api/seo-analysis \
  -H "Content-Type: application/json" \
  -d '{
    "articleText": "AIを活用したマーケティング戦略について解説します。データドリブンなアプローチで顧客エンゲージメントを最大化。機械学習による予測分析、パーソナライゼーション、自動化の実践方法を紹介。効果的なKPI設定とROI測定のポイントも詳しく説明します。",
    "title": "AI活用マーケティング実践ガイド"
  }'
```

### 3. Basic Integration

```typescript
// app/page.tsx or your component
async function analyzeSEO(articleText: string, title: string) {
  const response = await fetch('/api/seo-analysis', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      articleText,
      title,
      options: { useCache: true }
    })
  });

  const { data } = await response.json();

  console.log(`SEO Score: ${data.score}/100 (Grade: ${data.grade})`);
  console.log(`Meta Description: ${data.metaDescription}`);
  console.log(`Primary Keywords:`, data.keywords.primary);
  console.log(`Critical Issues:`, data.improvements.critical);

  return data;
}
```

### 4. Add to Existing UI

```typescript
// Update AnalysisResults.tsx to include SEO tab
import { SEOTab } from './SEOTab';
import type { SEOAnalysisResult } from '@/app/services/analysis/SEOService';

// Add to tabs array
const tabs = [
  // ... existing tabs
  {
    id: 'seo' as TabId,
    label: 'SEO分析',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
];

// Add to tab panels
{activeTab === 'seo' && seoData && (
  <TabPanel>
    <SEOTab data={seoData} />
  </TabPanel>
)}
```

### 5. Fetch SEO Data

```typescript
// In your analysis component
const [seoData, setSeoData] = useState<SEOAnalysisResult | null>(null);
const [seoLoading, setSeoLoading] = useState(false);

const fetchSEOAnalysis = async (articleText: string, title?: string) => {
  setSeoLoading(true);
  try {
    const response = await fetch('/api/seo-analysis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        articleText,
        title,
        options: { useCache: true }
      })
    });

    const result = await response.json();
    if (result.success) {
      setSeoData(result.data);
    }
  } catch (error) {
    console.error('SEO analysis failed:', error);
  } finally {
    setSeoLoading(false);
  }
};
```

## Common Use Cases

### Use Case 1: Basic SEO Check

```typescript
const result = await fetch('/api/seo-analysis', {
  method: 'POST',
  body: JSON.stringify({
    articleText: '記事の内容...'
  })
});
```

### Use Case 2: SEO with Target Keyword

```typescript
const result = await fetch('/api/seo-analysis', {
  method: 'POST',
  body: JSON.stringify({
    articleText: '記事の内容...',
    title: 'タイトル',
    targetKeyword: 'AI マーケティング'
  })
});
```

### Use Case 3: Server-Side Analysis

```typescript
// app/api/my-route/route.ts
import { SEOService } from '@/app/services/analysis/SEOService';
import { createAIService } from '@/app/services/ai/AIServiceFactory';

export async function POST(request: Request) {
  const { articleText } = await request.json();

  const aiService = createAIService();
  const seoService = new SEOService(aiService);

  const result = await seoService.analyzeSEO({
    articleText,
    options: { useCache: true }
  });

  return Response.json({ seo: result });
}
```

### Use Case 4: Batch Analysis

```typescript
async function analyzeMultipleArticles(articles: Array<{ text: string; title: string }>) {
  const results = await Promise.all(
    articles.map(article =>
      fetch('/api/seo-analysis', {
        method: 'POST',
        body: JSON.stringify({
          articleText: article.text,
          title: article.title
        })
      }).then(r => r.json())
    )
  );

  return results.map(r => r.data);
}
```

## UI Integration Patterns

### Pattern 1: Inline Score Badge

```tsx
<div className="flex items-center gap-2">
  <span className="text-sm text-gray-600">SEO Score:</span>
  <span className={`px-3 py-1 rounded-lg font-bold ${
    seoData.grade === 'A' ? 'bg-green-100 text-green-800' :
    seoData.grade === 'B' ? 'bg-blue-100 text-blue-800' :
    seoData.grade === 'C' ? 'bg-yellow-100 text-yellow-800' :
    'bg-red-100 text-red-800'
  }`}>
    {seoData.score}/100 ({seoData.grade})
  </span>
</div>
```

### Pattern 2: Quick Improvements List

```tsx
{seoData.improvements.critical.length > 0 && (
  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
    <h4 className="font-semibold text-red-800 mb-2">
      Critical Issues ({seoData.improvements.critical.length})
    </h4>
    <ul className="space-y-1">
      {seoData.improvements.critical.map((issue, i) => (
        <li key={i} className="text-sm text-red-700">• {issue}</li>
      ))}
    </ul>
  </div>
)}
```

### Pattern 3: Keyword Pills

```tsx
<div className="flex flex-wrap gap-2">
  {seoData.keywords.primary.map((keyword, i) => (
    <span
      key={i}
      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
    >
      {keyword}
    </span>
  ))}
</div>
```

## Configuration Tips

### Adjust for Your Content Type

```typescript
// app/config/seo.config.ts
export const seoConfig = {
  // For long-form content
  content: {
    minWordCount: 500,
    idealWordCount: 2000,
  },

  // For technical content (accept lower readability)
  readability: {
    targetScore: 50,  // Lower for technical content
  },

  // For keyword-focused content
  keywordDensity: {
    min: 1.0,
    max: 3.0,
  },
};
```

### Enable in Full Analysis

```typescript
// app/config/seo.config.ts
export const seoConfig = {
  includeInFullAnalysis: true,  // Auto-include SEO
};

// Then in full analysis
const fullAnalysis = await analyzeArticleFull({
  articleText: '...'
});
// fullAnalysis.seo will be populated
```

## Performance Optimization

### Enable Caching

```typescript
// Always use caching in production
const result = await fetch('/api/seo-analysis', {
  method: 'POST',
  body: JSON.stringify({
    articleText: '...',
    options: {
      useCache: true  // 90% cost reduction on repeated calls
    }
  })
});
```

### Debounce Real-Time Analysis

```typescript
import { debounce } from 'lodash';

const debouncedSEOAnalysis = debounce(async (text: string) => {
  if (text.length > 200) {  // Only analyze substantial content
    await fetchSEOAnalysis(text);
  }
}, 2000);  // Wait 2s after typing stops

// Use in onChange
<textarea onChange={(e) => debouncedSEOAnalysis(e.target.value)} />
```

### Lazy Load UI

```typescript
import dynamic from 'next/dynamic';

const SEOTab = dynamic(
  () => import('./SEOTab').then(mod => ({ default: mod.SEOTab })),
  { loading: () => <div>Loading SEO analysis...</div> }
);
```

## Troubleshooting

### Issue: High Cost

**Solution**: Enable caching and avoid analyzing on every keystroke.

```typescript
options: {
  useCache: true,  // Critical for cost reduction
  temperature: 0.3 // Lower = more deterministic = better caching
}
```

### Issue: Slow Response

**Solution**: Analyze locally what you can, use AI only for complex analysis.

```typescript
// Structure analysis is local (fast)
const structure = analyzeStructureLocally(text);

// Only use AI for keywords and improvements
const aiAnalysis = await fetchSEOAnalysis(text);
```

### Issue: Low Scores

**Solution**: Focus on critical improvements first.

```typescript
// Show actionable steps
if (seoData.score < 60) {
  console.log('Focus on:', seoData.improvements.critical);
  console.log('Add keywords:', seoData.keywords.primary);
  console.log('Improve structure:', seoData.structure.recommendations);
}
```

## What's Next?

1. **Integrate into your workflow** - Add SEO tab to your analysis UI
2. **Set up monitoring** - Track SEO scores over time
3. **Optimize costs** - Enable caching and batch processing
4. **Customize thresholds** - Adjust config for your content type
5. **Build reporting** - Create SEO dashboards and reports

## Need Help?

- Check API documentation: `GET /api/seo-analysis`
- Read full guide: `SEO-FEATURE-SUMMARY.md`
- Review architecture: `ARCHITECTURE.md`
- Explore examples: `app/api/seo-analysis/route.ts`

---

**Happy optimizing!** The SEO feature is designed to help note.com creators maximize their content's discoverability and impact.
