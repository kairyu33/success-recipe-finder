# Testing Guide - Display Fixes Verification

## Quick Test Steps

### Prerequisites
1. Ensure development server is running: `npm run dev`
2. Open browser to `http://localhost:3000`
3. Have sample article text ready

---

## Test 1: Verify "学べる事" Display

### Steps:
1. Paste sample article text into input field
2. Click "記事を分析する" (Analyze Article)
3. Wait for analysis to complete
4. Click "記事の要約" (Insights) tab

### Expected Result:
- Green card on the left shows "学べること" header
- Lists 3-5 learning points with checkmark icons
- Each point is clearly visible and readable

---

## Test 2: Verify Hashtag Display (20 tags)

### Steps:
1. After analysis completes, click "ハッシュタグ" (Hashtags) tab
2. Count the hashtag cards displayed

### Expected Result:
- Exactly 20 hashtags are displayed
- Each hashtag has individual copy button
- Top-right has "すべてコピー" (Copy All) button

---

## Test 3: Verify Combined Copyable Field

### Steps:
1. Go to "記事の要約" (Insights) tab
2. Find section header "記事の魅力ポイント"
3. Locate indigo "全てをコピー" button

### Expected Paste Format:
```
【学べること】
1. Learning point 1
2. Learning point 2

【読むメリット】
1. Benefit 1
2. Benefit 2

【おすすめの読者】
1. Reader persona 1
2. Reader persona 2
```

---

## Sample Test Article

```
今日は最新のAI技術について解説します。

人工知能の進化により、私たちの生活は大きく変わりつつあります。特に自然言語処理の分野では、Claude AIやChatGPTなどの大規模言語モデルが登場し、高度な会話や文章生成が可能になっています。

これらの技術は、カスタマーサポート、コンテンツ制作、プログラミング支援など、様々な分野で活用されています。
```

