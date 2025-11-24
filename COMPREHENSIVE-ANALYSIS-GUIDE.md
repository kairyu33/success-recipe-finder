# Comprehensive Article Analysis - Feature Guide

## Overview

The note.com Article Analyzer now includes **comprehensive AI-powered article analysis** that goes far beyond simple hashtag generation. Using Claude 3.5 Sonnet, the app provides actionable insights to optimize your note.com articles for maximum engagement and discoverability.

## Features

### 1. Title Suggestions (5 variants)
**Purpose**: Generate compelling, click-worthy titles optimized for SEO and reader engagement.

**What you get**:
- 5 different title variations using diverse approaches
- SEO-optimized keywords naturally integrated
- Titles designed to spark curiosity and drive clicks
- Different angles to highlight various aspects of your article

**Use case**: Test different titles to see which resonates best with your audience, or combine elements from multiple suggestions.

### 2. Article Insights

#### What You'll Learn (5 points)
**Purpose**: Clearly communicate the educational value and takeaways.

**What you get**:
- 5 specific, actionable learning points
- Concrete knowledge or skills readers will gain
- Easy-to-understand bullet points
- Focus on practical, applicable insights

**Use case**: Add to article introduction or create a "What You'll Learn" section to set reader expectations.

#### Benefits (5 points)
**Purpose**: Highlight the tangible value and outcomes for readers.

**What you get**:
- 5 reader-centric benefits
- Focus on problem-solving and transformation
- Positive, action-oriented language
- Before/after implications

**Use case**: Use in promotional content, social media posts, or article summary.

#### Recommended Audience (5 personas)
**Purpose**: Identify ideal reader profiles for targeted promotion.

**What you get**:
- 5 specific audience personas
- Defined by profession, interests, or situations
- Clear description of who benefits most
- Helps with content distribution strategy

**Use case**: Tailor promotion channels and messaging based on target audience.

#### One-Liner Summary
**Purpose**: Capture the essence of your article in one compelling sentence.

**What you get**:
- 30-50 character impactful summary
- Core value proposition
- Memorable, shareable statement

**Use case**: Perfect for social media posts, email subject lines, or article meta descriptions.

### 3. Eye-Catch Image Generation

#### AI Image Prompt (English)
**Purpose**: Generate professional images using AI image generators.

**What you get**:
- Detailed English prompt for DALL-E, Midjourney, or Stable Diffusion
- Specific composition, style, and mood descriptions
- Color palette and visual element guidance
- Professional, article-appropriate suggestions

**How to use**:
1. Copy the generated prompt
2. Paste into your preferred AI image generator:
   - DALL-E 3 (ChatGPT Plus, Bing Image Creator)
   - Midjourney (Discord)
   - Stable Diffusion (Various platforms)
3. Generate and download your eye-catch image
4. Upload to note.com article

#### Composition Ideas (3 suggestions)
**Purpose**: Visual layout concepts for your eye-catch image.

**What you get**:
- 3 different composition approaches (Japanese)
- Layout and framing suggestions
- Visual hierarchy guidance

#### Color Palette (4 colors)
**Purpose**: Harmonious color scheme for visual consistency.

**What you get**:
- 4 HEX color codes
- Carefully selected to match article mood
- Professional color combinations

**Use case**: Share with designers or use for consistent branding across article elements.

#### Mood & Style
**Purpose**: Define the overall aesthetic and emotional tone.

**What you get**:
- Mood: Atmospheric description
- Style: Art style classification (modern, minimal, pop, etc.)
- Summary: 100-character description for context

### 4. Hashtags (20 optimized tags)
**Purpose**: Maximize discoverability on note.com platform.

**What you get**:
- 20 carefully selected hashtags
- Mix of broad and specific tags
- Japanese language priority
- Trend-aware selections
- note.com platform optimized

**Best practices**:
- Copy all 20 tags
- Paste at the end of your article
- Consider which tags are most relevant to your specific content
- Mix popular tags with niche tags for balanced reach

## API Endpoint

### `/api/analyze-article-full`

**Method**: POST

**Request Body**:
```json
{
  "articleText": "Your article content here (max 10,000 characters)"
}
```

**Response**:
```typescript
{
  "suggestedTitles": string[],        // 5 title variations
  "insights": {
    "whatYouLearn": string[],         // 5 learning points
    "benefits": string[],             // 5 reader benefits
    "recommendedFor": string[],       // 5 target personas
    "oneLiner": string                // 30-50 char summary
  },
  "eyeCatchImage": {
    "mainPrompt": string,             // English AI image prompt
    "compositionIdeas": string[],     // 3 composition ideas
    "colorPalette": string[],         // 4 HEX color codes
    "mood": string,                   // Atmospheric description
    "style": string,                  // Art style
    "summary": string                 // 100-char description
  },
  "hashtags": string[]                // 20 hashtags with #
}
```

**Error Response**:
```json
{
  "error": "Error message"
}
```

**Status Codes**:
- `200`: Success
- `400`: Invalid request (missing text, text too long)
- `500`: Server error or API failure

## Technical Implementation

### AI Model
- **Model**: Claude 3.5 Sonnet (claude-3-5-sonnet-20241022)
- **Max Tokens**: 4096 (for comprehensive responses)
- **Temperature**: 0.7 (balanced creativity and consistency)
- **Language**: Japanese output (except image prompts in English)

### Prompt Engineering
The system uses a carefully crafted prompt that:
1. Instructs Claude to output pure JSON (no markdown)
2. Specifies exact requirements for each section
3. Provides context about note.com platform
4. Ensures actionable, specific outputs
5. Balances SEO with reader value

### Error Handling
- API key validation
- Input length validation (max 10,000 characters)
- JSON parsing with fallback defaults
- Comprehensive error messages
- Array length sanitization

### Performance
- **Average Response Time**: 10-15 seconds
- **Token Usage**: ~3000-4000 tokens per analysis
- **Reliability**: Automatic retry logic for parsing failures

## Usage Tips

### Best Practices
1. **Input Quality**: Provide complete, well-written article text for best results
2. **Title Selection**: Test multiple title variations for A/B testing
3. **Image Generation**: Iterate on the AI prompt if first result isn't perfect
4. **Hashtag Strategy**: Use all 20 tags, but prioritize most relevant ones
5. **Content Enhancement**: Use insights to improve article introduction and structure

### Common Use Cases

#### New Article Optimization
1. Write your article
2. Run comprehensive analysis
3. Select best title from suggestions
4. Generate eye-catch image using AI prompt
5. Add learning points to introduction
6. Include all 20 hashtags

#### Existing Article Enhancement
1. Paste existing article text
2. Compare generated titles with current title
3. Add missing learning points or benefits
4. Update eye-catch image if needed
5. Optimize hashtags for better discovery

#### Content Marketing
1. Use one-liner for social media posts
2. Use benefits for promotional content
3. Target specific personas from recommended audience
4. Create visual assets using color palette and composition ideas

## Integration Examples

### Next.js Client Component
```typescript
import { useState } from 'react';

export default function ArticleAnalyzer() {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyzeArticle = async (text: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/analyze-article-full', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleText: text })
      });

      const data = await response.json();
      setAnalysis(data);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    // Your UI here
  );
}
```

### Direct API Call (cURL)
```bash
curl -X POST http://localhost:3000/api/analyze-article-full \
  -H "Content-Type: application/json" \
  -d '{
    "articleText": "Your article content here..."
  }'
```

### Python Integration
```python
import requests

def analyze_article(text: str):
    response = requests.post(
        'http://localhost:3000/api/analyze-article-full',
        json={'articleText': text}
    )
    return response.json()

# Usage
article = "Your article text..."
result = analyze_article(article)
print(result['suggestedTitles'])
```

## Limitations & Considerations

### Input Constraints
- **Maximum length**: 10,000 characters
- **Language**: Optimized for Japanese content (note.com focus)
- **Format**: Plain text (HTML tags may affect analysis quality)

### Output Variability
- AI-generated content may vary between requests
- Temperature setting (0.7) balances consistency and creativity
- Some outputs may require manual refinement

### Rate Limits
- Depends on Anthropic API rate limits
- Consider implementing caching for identical inputs
- Monitor API usage and costs

### Cost Considerations
- Each analysis uses ~3000-4000 tokens
- Anthropic pricing: ~$0.03 per analysis (as of 2025)
- Consider implementing usage limits or authentication

## Troubleshooting

### Common Issues

#### "Failed to parse analysis data"
**Cause**: Claude returned invalid JSON or markdown formatting
**Solution**: API automatically retries parsing; check logs for raw response

#### "Article text is too long"
**Cause**: Input exceeds 10,000 characters
**Solution**: Summarize or split article into sections

#### "API key is not configured"
**Cause**: Missing `ANTHROPIC_API_KEY` environment variable
**Solution**: Add key to `.env.local` file

#### Incomplete results (fewer than expected items)
**Cause**: Model didn't generate full set
**Solution**: Logged as warning; API provides fallback defaults

## Future Enhancements

Potential features for future versions:
- [ ] Multi-language support (English, Chinese, Korean)
- [ ] Image generation integration (direct DALL-E API)
- [ ] A/B testing recommendations
- [ ] SEO score calculation
- [ ] Readability analysis
- [ ] Sentiment analysis
- [ ] Competitor article comparison
- [ ] Trending topic suggestions
- [ ] Publishing schedule optimization

## Support & Feedback

For issues, questions, or feature requests:
- Open an issue on GitHub
- Check existing documentation
- Review API logs for detailed error messages

## Credits

- **AI Model**: Anthropic Claude 3.5 Sonnet
- **Framework**: Next.js 16
- **UI**: Tailwind CSS 4
- **Platform**: note.com optimization focus
