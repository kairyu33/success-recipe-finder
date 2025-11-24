# Eye-Catch Image Generation Guide

## Overview

This guide explains how to use the AI-generated image prompts from the article analyzer to create professional eye-catch images for your note.com articles.

## Supported AI Image Generators

### 1. DALL-E 3 (Recommended for Beginners)

**Access**:
- ChatGPT Plus subscription ($20/month)
- Bing Image Creator (FREE)
- Microsoft Designer (FREE)

**How to use**:
1. Copy the English image prompt from the analysis
2. Go to ChatGPT (with Plus) or Bing Image Creator
3. Paste the prompt
4. Click "Generate" or press Enter
5. Download your favorite result (4 variations provided)

**Pros**:
- Best text rendering in images
- Most consistent results
- FREE option available (Bing)
- Fast generation (~30 seconds)

**Cons**:
- Less artistic flexibility
- Sometimes overly literal

**Example workflow**:
```
1. Copy prompt: "A modern, minimalist illustration of a developer working with AI..."
2. Open: https://www.bing.com/images/create
3. Paste prompt and click "Create"
4. Wait 30 seconds
5. Download 1024x1024 image
```

### 2. Midjourney (Best Quality)

**Access**:
- Discord subscription required
- Plans: Basic ($10), Standard ($30), Pro ($60)

**How to use**:
1. Join Midjourney Discord server
2. Go to any #general or your DM with Midjourney Bot
3. Type: `/imagine prompt: [paste your prompt here]`
4. Add parameters: `--ar 16:9` for wide format
5. Wait for generation (~60 seconds)
6. Upscale your favorite (U1, U2, U3, U4 buttons)

**Pros**:
- Highest artistic quality
- Best for abstract/creative concepts
- Advanced control with parameters

**Cons**:
- Requires Discord
- Steeper learning curve
- No free tier

**Recommended parameters**:
```
/imagine prompt: [your prompt] --ar 16:9 --v 6 --style raw
```

**Parameter guide**:
- `--ar 16:9`: Wide aspect ratio (best for eye-catch)
- `--ar 1:1`: Square format
- `--v 6`: Version 6 (latest)
- `--style raw`: More photographic
- `--style expressive`: More artistic
- `--q 2`: Highest quality

### 3. Stable Diffusion (Advanced/Free)

**Access**:
- RunDiffusion (Paid cloud service)
- Stability.ai (API)
- Local installation (FREE but technical)

**Popular platforms**:
- Leonardo.ai (FREE tier available)
- DreamStudio (Stability official)
- Playground AI (FREE tier)

**How to use (Leonardo.ai example)**:
1. Go to https://leonardo.ai
2. Create free account
3. Click "AI Image Generation"
4. Paste prompt in text box
5. Select model (e.g., "Leonardo Diffusion XL")
6. Set dimensions: 1024x1024 or 1024x576
7. Click "Generate"

**Pros**:
- FREE options available
- Full control over parameters
- Can run locally
- Commercial use friendly

**Cons**:
- Steeper learning curve
- Quality varies by model
- Requires prompt engineering skills

**Recommended settings (Leonardo.ai)**:
- Model: Leonardo Diffusion XL
- Dimensions: 1024x576 (16:9)
- Guidance Scale: 7-10
- Steps: 30-50

## Optimizing Your Prompts

### Basic Prompt Structure
The generated prompts follow this structure:
```
[Subject] + [Style] + [Composition] + [Mood] + [Colors] + [Details]
```

### Enhancing the Generated Prompt

#### For DALL-E 3
Add at the beginning:
```
Create a high-quality, professional [original prompt]
```

#### For Midjourney
Add parameters:
```
[original prompt] --ar 16:9 --v 6 --style raw --q 2
```

Add modifiers:
```
[original prompt], award-winning photography, 8k resolution, cinematic lighting
```

#### For Stable Diffusion
Add quality boosters:
```
[original prompt], masterpiece, best quality, highly detailed, professional
```

Add negative prompts (what to avoid):
```
Negative: blurry, low quality, distorted, ugly, amateur
```

### Aspect Ratios for note.com

**Recommended sizes**:
- **Eye-catch image**: 1280x670 (16:9 or close)
- **Thumbnail**: 1200x630 (OG image size)
- **Square**: 1024x1024 (social media)

**How to specify**:
- DALL-E: Only 1024x1024, resize later
- Midjourney: `--ar 16:9` or `--ar 1:1`
- Stable Diffusion: Set exact dimensions

## Using Color Palette Suggestions

The analyzer provides 4 HEX color codes. Here's how to use them:

### Method 1: Direct Color Specification
Add to your prompt:
```
[original prompt] using colors #4A90E2, #50E3C2, #F5A623, and #FFFFFF
```

### Method 2: Image Editing (Recommended)
1. Generate base image with AI
2. Open in photo editor (Photoshop, Figma, Canva)
3. Apply color grading using suggested palette
4. Adjust shadows, highlights, and accents

### Method 3: Overlay Design
1. Generate background with AI
2. Add colored overlays or text using palette
3. Create cohesive design with consistent colors

## Composition Ideas Usage

The analyzer provides 3 composition suggestions. Use them to:

### Refine Your Prompt
Original prompt:
```
A developer working with AI technology
```

With composition idea "Split-screen layout":
```
A split-screen composition showing a developer working with AI technology on the left, and visual data flowing on the right
```

### Combine Multiple Ideas
Mix composition ideas for unique results:
```
[original prompt] with a centered focal point, using negative space, and diagonal dynamic lines
```

## Style and Mood Application

### Mood Keywords to Add
Based on generated mood, enhance your prompt:

**Professional mood**:
```
[prompt], corporate aesthetic, clean composition, professional lighting
```

**Creative mood**:
```
[prompt], artistic interpretation, vibrant energy, dynamic composition
```

**Minimal mood**:
```
[prompt], minimalist design, lots of white space, simple and clean
```

### Style Variations

**Photographic**:
```
[prompt], photorealistic, studio photography, professional lighting
```

**Illustrated**:
```
[prompt], digital illustration, vector art style, clean lines
```

**Abstract**:
```
[prompt], abstract representation, geometric shapes, modern art
```

**3D Render**:
```
[prompt], 3D render, octane render, volumetric lighting
```

## Platform-Specific Tips

### DALL-E 3 Tips
- Keep prompts under 400 characters
- Be specific about text placement
- Use "professional photography" for realistic images
- Use "digital illustration" for graphics

### Midjourney Tips
- Use `--seed` for consistent style: `--seed 12345`
- Use `--sref` for style reference images
- Combine styles: `photorealistic + minimalist`
- Use weights: `developer::2 AI technology::1` (emphasizes developer)

### Stable Diffusion Tips
- Use negative prompts extensively
- Try different models (SDXL, SD 1.5, etc.)
- Adjust CFG scale (7-12 for realistic, 15-20 for artistic)
- Use LoRA models for specific styles

## Common Image Issues and Fixes

### Issue: Text is unreadable
**Solution**:
- DALL-E: Specify exact text in quotes: `with the text "AI Technology"`
- Midjourney: V6 improved text, use `--v 6`
- Alternative: Add text in post-processing

### Issue: Wrong colors
**Solution**:
- Be more specific: Instead of "blue", use "navy blue #1E3A5F"
- Try multiple generations
- Adjust in post-processing

### Issue: Composition is off
**Solution**:
- Add specific composition terms: "centered", "rule of thirds", "golden ratio"
- Use negative prompts to exclude unwanted elements
- Crop or reframe in image editor

### Issue: Style doesn't match
**Solution**:
- Add style modifiers: "in the style of [artist/movement]"
- Use reference images (Midjourney --sref, Stable Diffusion img2img)
- Adjust model or version

## Post-Processing Recommendations

Even AI-generated images benefit from editing:

### Essential Edits
1. **Resize** to note.com recommended size (1280x670)
2. **Crop** to remove unwanted elements
3. **Adjust brightness/contrast** for readability
4. **Add text overlay** if needed (title, category)
5. **Apply color grading** using suggested palette

### Free Tools
- **Canva**: Easy-to-use, templates available
- **Photopea**: Free Photoshop alternative (web-based)
- **GIMP**: Free desktop software
- **Figma**: Professional design tool with free tier

### Workflow Example
```
1. Generate image with AI (3-5 variations)
2. Select best result
3. Open in Canva
4. Resize to 1280x670
5. Apply color filter using palette
6. Add text overlay with article title
7. Export as PNG or JPG
8. Upload to note.com
```

## Best Practices

### DO:
- Generate multiple variations (3-5)
- Test different prompts based on suggestions
- Use high resolution (1024x1024 minimum)
- Match image style to article tone
- Consider note.com's visual standards
- Add article title as text overlay
- Ensure images are culturally appropriate

### DON'T:
- Use copyrighted characters or brands
- Ignore aspect ratio recommendations
- Use low-resolution images
- Overcomplicate prompts
- Forget to check image quality before uploading
- Use images that don't relate to content

## Cost Comparison

| Platform | Cost | Images/Month | Quality | Ease of Use |
|----------|------|--------------|---------|-------------|
| Bing Image Creator | FREE | ~100 | Good | Easy |
| DALL-E 3 (ChatGPT Plus) | $20/mo | ~50-100 | Excellent | Easy |
| Midjourney Basic | $10/mo | ~200 | Excellent | Medium |
| Midjourney Standard | $30/mo | Unlimited* | Excellent | Medium |
| Leonardo.ai Free | FREE | 150 | Good | Medium |
| Stability.ai API | Pay-as-go | Variable | Good | Hard |

*Subject to fair use policy

## Quick Reference Cheat Sheet

### DALL-E 3 (Bing Free)
```
1. Go to: bing.com/images/create
2. Paste prompt
3. Click "Create"
4. Download (1024x1024)
5. Resize to 1280x670
```

### Midjourney
```
/imagine prompt: [prompt] --ar 16:9 --v 6 --q 2
Click U1/U2/U3/U4 to upscale favorite
Download high-res image
```

### Leonardo.ai (Free)
```
1. Login to leonardo.ai
2. Click "AI Image Generation"
3. Paste prompt
4. Set: 1024x576, Leonardo Diffusion XL
5. Generate (4 images)
6. Download favorite
```

## Example Workflow: From Analysis to Eye-Catch

**Step 1**: Analyze article
```typescript
const analysis = await analyzeArticle(articleText);
```

**Step 2**: Copy image prompt
```
analysis.eyeCatchImage.mainPrompt
```

**Step 3**: Generate image (Bing free)
```
1. Open bing.com/images/create
2. Paste: "A modern minimalist illustration of..."
3. Generate
```

**Step 4**: Post-process (Canva)
```
1. Open in Canva
2. Resize: 1280 x 670
3. Add article title text
4. Apply color: Use palette colors
5. Download PNG
```

**Step 5**: Upload to note.com
```
1. Upload as eye-catch image
2. Set alt text
3. Publish
```

**Total time**: 5-10 minutes
**Total cost**: FREE (using Bing)

## Conclusion

The AI-generated image prompts are designed to work seamlessly with all major image generation platforms. Experiment with different platforms and settings to find what works best for your content style and workflow.

For best results:
1. Generate 3-5 variations
2. Post-process for optimization
3. Test with your audience
4. Iterate based on engagement

Happy creating!
