# Quick Start Guide - Article Analysis

## 1-Minute Setup

### Prerequisites
- Node.js 18+ installed
- Anthropic API key ([Get one here](https://console.anthropic.com))

### Installation
```bash
# 1. Navigate to project
cd C:\Users\tyobi\note-hashtag-ai-generator

# 2. Install dependencies (if not already done)
npm install

# 3. Configure API key
# Create .env.local file with:
ANTHROPIC_API_KEY=your_api_key_here

# 4. Start development server
npm run dev

# 5. Open browser
# Visit: http://localhost:3000
```

## How to Use

### Step 1: Write or Paste Article
1. Open http://localhost:3000
2. Paste your article text (up to 10,000 characters)

### Step 2: Analyze
1. Click **"記事を分析する"** (Analyze Article)
2. Wait 10-15 seconds while AI processes

### Step 3: Explore Results
Navigate through tabs:
- **タイトル候補**: Title suggestions
- **記事の要約**: Article insights
- **アイキャッチ**: Image generation ideas
- **ハッシュタグ**: Hashtags

### Step 4: Copy & Use
Click any section to copy to clipboard!

## What You Get

### 📝 Titles (5 variants)
```
Example:
1. AIで記事作成を10倍効率化する方法
2. note.com執筆者必見：AI分析ツールの使い方
3. 【2025年版】記事最適化の完全ガイド
4. たった10秒で完璧なハッシュタグを生成
5. プロライターが使うAI記事分析術
```

### 💡 Insights
- **What You'll Learn**: 5 learning points
- **Benefits**: 5 reader advantages
- **Target Audience**: 5 ideal readers
- **One-Liner**: Perfect summary

### 🎨 Eye-Catch Image
- AI image prompt (English)
- Composition ideas (3)
- Color palette (4 HEX codes)
- Mood & style

### #️⃣ Hashtags
20 optimized tags for note.com

## Generate Eye-Catch Images

### Free Option: Bing Image Creator
```bash
1. Copy AI image prompt from analysis
2. Go to: https://www.bing.com/images/create
3. Paste prompt
4. Click "Create"
5. Download image (1024x1024)
6. Resize to 1280x670 for note.com
```

### Paid Option: Midjourney
```bash
1. Copy prompt
2. In Midjourney Discord:
   /imagine prompt: [paste] --ar 16:9 --v 6
3. Select favorite with U1/U2/U3/U4
4. Download high-res image
```

## API Usage

### Programmatic Access
```typescript
const response = await fetch('/api/analyze-article-full', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    articleText: 'Your article text here...'
  })
});

const analysis = await response.json();
console.log(analysis.suggestedTitles);
```

### Test Script
```bash
# Run included test
npx tsx test-analysis.ts

# View formatted output in terminal
```

## Common Issues

### "API key is not configured"
**Solution**: Create `.env.local` with your Anthropic API key

### "Article text is too long"
**Solution**: Limit to 10,000 characters or split into sections

### Results take too long
**Normal**: 10-15 seconds is expected for comprehensive analysis

### JSON parsing error
**Solution**: Usually auto-retries. Check your internet connection.

## Best Practices

### Input
✅ DO:
- Use complete article text
- 500-5000 characters ideal
- Clean, well-formatted text

❌ DON'T:
- Exceed 10,000 characters
- Use excessive formatting
- Include HTML tags

### Output Usage
✅ DO:
- Test multiple title variations
- Use all 20 hashtags
- Generate images from prompts
- Add insights to article intro

❌ DON'T:
- Use titles without reading your article
- Ignore the target audience suggestions
- Skip the image generation step

## Example Workflow

### Complete Article Optimization
```
1. Write article in editor (500-3000 words)
   ⏱️ Time: 1-2 hours

2. Copy & paste to analyzer
   ⏱️ Time: 10 seconds

3. Run analysis
   ⏱️ Time: 10-15 seconds

4. Review & select title
   ⏱️ Time: 2 minutes

5. Generate eye-catch image (Bing free)
   ⏱️ Time: 1 minute

6. Add intro using "What You'll Learn"
   ⏱️ Time: 5 minutes

7. Add all 20 hashtags to note.com
   ⏱️ Time: 30 seconds

Total optimization time: ~10 minutes
```

## Cost Analysis

### Per Article
- API call: ~$0.03 USD
- Time saved: ~30 minutes
- ROI: Significant

### Monthly (20 articles)
- Cost: ~$0.60 USD
- Time saved: ~10 hours
- Value: Priceless insights

## Next Steps

1. ✅ Analyze your first article
2. ✅ Generate eye-catch image
3. ✅ Publish on note.com
4. ✅ Track engagement metrics

## Learn More

📚 **Comprehensive Guides**:
- `COMPREHENSIVE-ANALYSIS-GUIDE.md` - Full feature docs
- `IMAGE-GENERATION-GUIDE.md` - Image creation tutorial
- `FEATURES-UPDATE.md` - What's new

🔧 **Technical Docs**:
- `IMPLEMENTATION-SUMMARY.md` - Technical overview
- API route: `app/api/analyze-article-full/route.ts`

## Support

### Getting Help
1. Check documentation files
2. Run test script: `npx tsx test-analysis.ts`
3. Check browser console for errors
4. Verify `.env.local` configuration

### Troubleshooting
See `COMPREHENSIVE-ANALYSIS-GUIDE.md` > Troubleshooting section

---

## One-Command Start

```bash
npm install && npm run dev
```

Then open: http://localhost:3000

**That's it!** Start optimizing your articles with AI. 🚀

---

**Pro Tip**: Bookmark these tabs:
- App: http://localhost:3000
- Bing Image Creator: https://www.bing.com/images/create
- note.com: https://note.com

Happy writing! ✍️
