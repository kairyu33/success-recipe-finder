# Eye-Catch Image Generation - Usage Guide

## Quick Start

### For Content Creators

1. **Open the app** at `http://localhost:3000` (after running `npm run dev`)
2. **Paste your article text** (up to 10,000 characters)
3. **Click "記事を分析する"** (Analyze Article)
4. **Navigate to the "アイキャッチ" tab**
5. **Copy the DALL-E prompt** and use it in:
   - ChatGPT (GPT-4 with DALL-E)
   - Midjourney
   - DALL-E 3
   - Stable Diffusion
   - Adobe Firefly

### Example Workflow

```
Article → AI Analysis → Image Prompt → Image Generator → Eye-Catch Image
```

## What You Get

### 1. DALL-E-Ready Prompt (English)

**What it is**: A detailed, optimized prompt in English that you can paste directly into image generation AI tools.

**Example**:
```
A modern tech conference scene with diverse developers collaborating
around laptops and monitors displaying AI code, vibrant blue and
white color scheme, professional photography style, bright and
energetic atmosphere, shallow depth of field
```

**How to use**:
- Copy the prompt (one-click button)
- Open ChatGPT, Midjourney, or DALL-E
- Paste and generate
- Download your custom eye-catch image

### 2. Composition Ideas (Japanese)

**What it is**: 3-5 alternative visual concepts in Japanese for designers or DIY creators.

**Example**:
1. 青と白のグラデーション背景に、中央にラップトップとコードが浮かぶ構図
2. テクノロジーカンファレンスの会場を俯瞰で捉えた広角ショット
3. AIのイメージを表現する幾何学的パターンと人物のシルエット

**How to use**:
- Reference when designing manually in Figma/Canva
- Give to a designer as concept guidance
- Mix and match ideas for unique compositions

### 3. 100-Character Summary

**What it is**: A concise Japanese summary perfect for overlaying on images or using as alt text.

**Example**:
```
東京で開催されたテクノロジーカンファレンスでAI技術を学んだ体験記。
Claude APIの自然言語処理デモが印象的でした。
```

**How to use**:
- Overlay as text on the eye-catch image
- Use as image alt text for SEO
- Include in social media posts

## API Endpoints

### Option 1: Standalone Eye-Catch Generator

**Endpoint**: `/api/generate-eyecatch`

**Request**:
```javascript
fetch('/api/generate-eyecatch', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    articleText: 'あなたの記事の内容をここに...'
  })
})
```

**Response**:
```json
{
  "eyeCatch": {
    "imagePrompt": "A modern tech conference scene...",
    "compositionIdeas": [
      "青と白のグラデーション背景に...",
      "テクノロジーカンファレンスの会場を...",
      "AIのイメージを表現する..."
    ],
    "summary": "東京で開催されたテクノロジーカンファレンス..."
  }
}
```

**Use when**: You only need eye-catch suggestions, no hashtags

### Option 2: Combined Hashtags + Eye-Catch

**Endpoint**: `/api/analyze-article`

**Request**:
```javascript
fetch('/api/analyze-article', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    articleText: 'あなたの記事の内容をここに...'
  })
})
```

**Response**:
```json
{
  "hashtags": [
    "#AI", "#テクノロジー", "#プログラミング",
    // ... 20 total
  ],
  "eyeCatch": {
    "imagePrompt": "A modern tech conference scene...",
    "compositionIdeas": ["...", "...", "..."],
    "summary": "東京で開催された..."
  }
}
```

**Use when**: You need both hashtags and eye-catch in one call (faster, more efficient)

### Option 3: Full Article Analysis (Recommended)

**Endpoint**: `/api/analyze-article-full`

**Request**: Same as above

**Response**: Includes everything above PLUS:
- `suggestedTitles` (5 title options)
- `whatYouWillLearn` (5 learning points)
- `benefits` (5 reader benefits)
- `targetAudience` (5 target personas)
- `oneLineSummary`
- `eyeCatch.colors` (4-color palette)
- `eyeCatch.mood` (atmosphere description)

**Use when**: You want comprehensive article optimization

## Step-by-Step: Creating Your Eye-Catch Image

### Method 1: Using ChatGPT

1. Copy the DALL-E prompt from the app
2. Open ChatGPT (GPT-4 or Plus subscription)
3. Type: "Generate an image with this prompt:"
4. Paste the prompt
5. ChatGPT will create an image using DALL-E 3
6. Download and use as your eye-catch

**Tips**:
- You can ask for variations: "Make it more colorful" or "Add more people"
- Request specific dimensions: "Make it 1200x630 for social media"
- Refine details: "Make the background lighter"

### Method 2: Using Midjourney

1. Copy the DALL-E prompt from the app
2. Open Midjourney (Discord or web app)
3. Type: `/imagine`
4. Paste the prompt
5. Add Midjourney-specific parameters if desired:
   - `--ar 16:9` for widescreen
   - `--ar 4:3` for traditional
   - `--style raw` for realistic
   - `--stylize 1000` for artistic
6. Select your favorite variation
7. Upscale and download

**Example**:
```
/imagine A modern tech conference scene with diverse developers
collaborating around laptops and monitors displaying AI code,
vibrant blue and white color scheme, professional photography
style --ar 16:9 --style raw
```

### Method 3: Using DALL-E 3 Directly

1. Go to https://labs.openai.com/
2. Copy the prompt from the app
3. Paste into the prompt field
4. Click "Generate"
5. Download your favorite result

### Method 4: Manual Design (Using Composition Ideas)

1. Review the composition ideas in Japanese
2. Open Canva, Figma, or your design tool
3. Use the ideas as inspiration
4. Reference the color palette suggestions
5. Match the mood/atmosphere described
6. Create your custom design

**Example Canva workflow**:
- Start with a blank template (1200x630 for blogs)
- Set gradient background using suggested colors
- Add elements based on composition ideas
- Overlay the 100-character summary
- Export as PNG

## Understanding the Output

### Image Prompt Structure

AI-generated prompts typically include:

1. **Subject**: What's in the image
   - "A modern tech conference scene with developers"

2. **Details**: Specific elements
   - "laptops and monitors displaying AI code"

3. **Style**: Visual aesthetic
   - "professional photography style"

4. **Colors**: Color scheme
   - "vibrant blue and white color scheme"

5. **Mood**: Atmosphere
   - "bright and energetic atmosphere"

6. **Technical**: Camera/rendering details
   - "shallow depth of field"

### Color Palette (Full Analysis Only)

**Format**: ["#4A90E2", "#50E3C2", "#F5A623", "#FFFFFF"]

**How to use**:
- Primary color: First in the list (usually brand/theme color)
- Secondary color: Second (accent or contrast)
- Tertiary: Third (highlights or details)
- Background: Fourth (usually white or light color)

**In design tools**:
- Copy hex codes directly
- Use as exact color values
- Maintain consistency across your article

### Mood Description

**Examples**:
- "モダンでプロフェッショナル" (Modern and professional)
- "温かみのある親しみやすい" (Warm and friendly)
- "エネルギッシュで革新的" (Energetic and innovative)

**How to use**:
- Guide overall visual tone
- Inform font choices (bold vs. elegant)
- Influence image filters/effects
- Direct lighting and saturation

## Best Practices

### For Better Prompts

1. **Use longer articles** (300+ characters) for richer prompts
2. **Include visual details** in your writing when possible
3. **Mention colors/moods** that match your brand
4. **Describe your target audience** for relevant imagery

### Example: Good vs. Better Article Input

**Good** (Basic):
```
今日はAIについて学びました。便利な技術です。
```

**Better** (Detailed):
```
今日は東京で開催されたテクノロジーカンファレンスに参加しました。
最新のAI技術について学び、多くの若手開発者と交流できました。
特にClaude APIを使った自然言語処理のデモが印象的で、
明るく活気のある会場の雰囲気も素晴らしかったです。
```

The better input provides:
- Specific location (東京)
- Visual context (カンファレンス、会場)
- People (若手開発者)
- Atmosphere (明るく活気のある)
- Technology details (AI、Claude API)

### Image Generation Tips

1. **Be specific in requests**:
   - Bad: "Make it blue"
   - Good: "Change the background to a soft sky blue gradient"

2. **Request variations**:
   - Generate 4-6 options
   - Compare and select the best
   - Combine elements from multiple

3. **Optimize for platform**:
   - note.com: 1280x670 recommended
   - Twitter/X: 1200x675
   - Facebook: 1200x630
   - Instagram: 1080x1080

4. **Test readability**:
   - Ensure text overlays are legible
   - Check mobile preview
   - Verify brand consistency

## Troubleshooting

### "Failed to generate eye-catch data"

**Causes**:
- Article too short (< 50 characters)
- Network timeout
- Claude API error

**Solutions**:
- Try with longer article text (200+ characters)
- Check internet connection
- Verify ANTHROPIC_API_KEY in `.env.local`
- Wait 30 seconds and retry

### "Prompt doesn't match my article"

**Causes**:
- AI misinterpreted theme
- Article lacks visual cues
- Generic content

**Solutions**:
- Add more descriptive details to your article
- Mention specific visuals (colors, objects, scenes)
- Try regenerating (slight variations)
- Use composition ideas instead

### "Image looks wrong"

**Causes**:
- Image AI limitations
- Prompt ambiguity
- Random variation

**Solutions**:
- Regenerate with same prompt (different seed)
- Edit prompt: add "professional" or "high quality"
- Try different image AI (Midjourney vs DALL-E)
- Use composition ideas for manual design

## Advanced Usage

### Customizing Prompts

You can edit the generated prompt before using it:

**Original**:
```
A modern tech conference with developers
```

**Customized**:
```
A modern tech conference with diverse developers,
featuring a female keynote speaker, large screens
showing code, audience taking notes, Tokyo skyline
visible through windows, golden hour lighting
```

### Combining Multiple Analyses

Generate eye-catch for different angles:

1. Run analysis on introduction → Get general theme
2. Run analysis on conclusion → Get emotional tone
3. Combine best elements from both prompts

### Batch Processing

For multiple articles:

```javascript
const articles = ['article1...', 'article2...', 'article3...'];

const results = await Promise.all(
  articles.map(text =>
    fetch('/api/generate-eyecatch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ articleText: text })
    }).then(r => r.json())
  )
);

results.forEach((result, i) => {
  console.log(`Article ${i+1}: ${result.eyeCatch.imagePrompt}`);
});
```

## Cost Considerations

### API Usage

**Per analysis**:
- Input: ~500-1500 tokens
- Output: ~300-800 tokens
- Total: ~800-2300 tokens

**Claude 3.5 Sonnet pricing**:
- Input: $3 per million tokens
- Output: $15 per million tokens
- **Cost per eye-catch**: $0.01-0.02

**Budget planning**:
- 100 articles/month: ~$1.50
- 1000 articles/month: ~$15.00
- 10000 articles/month: ~$150.00

### Image Generation Costs

**ChatGPT (GPT-4)**:
- $20/month subscription
- Unlimited DALL-E generations (fair use)
- Best value for high volume

**Midjourney**:
- Basic: $10/month (~200 images)
- Standard: $30/month (~900 images)
- Higher quality, more control

**DALL-E 3 Direct**:
- Pay-per-image pricing
- Higher cost for occasional use

## Examples Gallery

### Tech Article

**Input**: "今日はAI技術について学びました"

**Generated Prompt**:
```
A futuristic AI neural network visualization with
glowing blue connections, modern digital interface
elements, professional tech aesthetic, gradient
background from navy to cyan
```

**Composition Ideas**:
1. 脳のようなニューラルネットワーク図を中央に配置
2. データの流れを表す光のラインと粒子
3. 近未来的なインターフェースとコード

### Lifestyle Article

**Input**: "カフェ巡りで見つけた素敵な場所"

**Generated Prompt**:
```
A cozy modern cafe interior with warm lighting,
latte art on cappuccino, wooden tables, plants,
soft natural light through large windows,
inviting and comfortable atmosphere
```

**Composition Ideas**:
1. 温かみのある照明とコーヒーカップのクローズアップ
2. カフェの外観と看板を含む広角ショット
3. 窓際の席から見える街の風景

### Business Article

**Input**: "効率的な仕事術について解説"

**Generated Prompt**:
```
A clean minimalist office workspace with organized
desk, laptop, notebook, plants, natural lighting,
professional and productive atmosphere, top-down view
```

**Composition Ideas**:
1. 整理整頓されたデスクの俯瞰図
2. タスク管理ツールの画面とメモ
3. 生産性を象徴するグラフとチェックリスト

## Support & Resources

### Documentation
- [Main README](./README.md)
- [Feature Summary](./EYECATCH-FEATURE-SUMMARY.md)
- [API Types](./app/types/api.ts)

### External Resources
- [DALL-E Guide](https://help.openai.com/en/articles/6654000-best-practices-for-prompt-engineering-with-dall-e)
- [Midjourney Docs](https://docs.midjourney.com/)
- [Canva Tutorials](https://www.canva.com/learn/)

### Getting Help

If you encounter issues:
1. Check this guide for troubleshooting
2. Verify your `.env.local` has `ANTHROPIC_API_KEY`
3. Try with a different article (longer/shorter)
4. Check the browser console for errors
5. Review error messages carefully

## Conclusion

The eye-catch image generation feature provides note.com content creators with AI-powered visual concept generation. Whether you use the prompts directly in image AIs or as inspiration for manual design, this tool helps create compelling, relevant eye-catch images that enhance your articles and attract readers.

**Happy creating!** 🎨✨
