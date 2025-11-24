/**
 * Input Validation and Sanitization Utilities
 *
 * @description Validates and sanitizes user input to prevent injection attacks
 * and ensure data quality
 */

export interface ValidationResult {
  valid: boolean;
  error?: string;
  sanitized?: string;
}

/**
 * Validate and sanitize article input text
 *
 * @param text - Raw article text from user
 * @returns Validation result with sanitized text or error message
 *
 * @example
 * ```typescript
 * const result = validateArticleInput(userInput);
 * if (!result.valid) {
 *   return NextResponse.json({ error: result.error }, { status: 400 });
 * }
 * const cleanText = result.sanitized!;
 * ```
 */
export function validateArticleInput(text: unknown): ValidationResult {
  // Type check
  if (typeof text !== 'string') {
    return {
      valid: false,
      error: 'Article text must be a string',
    };
  }

  // Trim whitespace
  const trimmed = text.trim();

  // Check for empty input
  if (trimmed.length === 0) {
    return {
      valid: false,
      error: '記事のテキストを入力してください（Article text is required）',
    };
  }

  // Minimum length check (100 characters for meaningful analysis)
  if (trimmed.length < 100) {
    return {
      valid: false,
      error: '記事が短すぎます。最低100文字以上入力してください（Article is too short, minimum 100 characters required）',
    };
  }

  // Maximum length check
  const maxLength = parseInt(process.env.MAX_ARTICLE_LENGTH || '30000', 10);
  if (trimmed.length > maxLength) {
    return {
      valid: false,
      error: `記事が長すぎます。最大${maxLength.toLocaleString()}文字まで入力できます（Article exceeds maximum length of ${maxLength.toLocaleString()} characters）`,
    };
  }

  // Sanitize: Remove potential script injections and dangerous HTML
  // This is belt-and-suspenders since Claude API handles text safely,
  // but good practice for defense in depth
  let sanitized = trimmed;

  // Remove script tags and their content
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

  // Remove iframe tags
  sanitized = sanitized.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');

  // Remove potentially dangerous event handlers
  sanitized = sanitized.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');

  // Remove data URIs that could contain malicious code
  sanitized = sanitized.replace(/data:text\/html[^,]*,/gi, '');

  // Check for suspicious patterns that might indicate injection attempts
  const suspiciousPatterns = [
    /javascript:/gi,
    /vbscript:/gi,
    /<embed/gi,
    /<object/gi,
  ];

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(sanitized)) {
      console.warn('[Security] Suspicious pattern detected in input:', pattern);
      sanitized = sanitized.replace(pattern, '');
    }
  }

  // If sanitization removed too much content, it was likely malicious
  const removalPercentage = ((trimmed.length - sanitized.length) / trimmed.length) * 100;
  if (removalPercentage > 10) {
    return {
      valid: false,
      error: '入力に不適切な内容が含まれています（Input contains inappropriate content）',
    };
  }

  return {
    valid: true,
    sanitized: sanitized.trim(),
  };
}

/**
 * Validate API key format (basic check)
 */
export function validateApiKey(key: unknown): boolean {
  if (typeof key !== 'string') return false;
  if (key.length < 20) return false;
  if (!key.startsWith('sk-ant-')) return false;
  return true;
}

/**
 * Sanitize output data before sending to client
 * Ensures no unexpected data structure issues
 */
export function sanitizeAnalysisOutput(data: any): any {
  return {
    suggestedTitles: Array.isArray(data.suggestedTitles)
      ? data.suggestedTitles.slice(0, 5).map((t: any) => String(t).substring(0, 100))
      : [],
    insights: {
      whatYouLearn: Array.isArray(data.insights?.whatYouLearn)
        ? data.insights.whatYouLearn.slice(0, 5).map((i: any) => String(i).substring(0, 200))
        : [],
      benefits: Array.isArray(data.insights?.benefits)
        ? data.insights.benefits.slice(0, 5).map((b: any) => String(b).substring(0, 200))
        : [],
      recommendedFor: Array.isArray(data.insights?.recommendedFor)
        ? data.insights.recommendedFor.slice(0, 5).map((r: any) => String(r).substring(0, 200))
        : [],
      oneLiner: data.insights?.oneLiner ? String(data.insights.oneLiner).substring(0, 100) : '',
    },
    eyeCatchImage: {
      mainPrompt: data.eyeCatchImage?.mainPrompt ? String(data.eyeCatchImage.mainPrompt).substring(0, 1000) : '',
      compositionIdeas: Array.isArray(data.eyeCatchImage?.compositionIdeas)
        ? data.eyeCatchImage.compositionIdeas.slice(0, 3).map((c: any) => String(c).substring(0, 100))
        : [],
      colorPalette: Array.isArray(data.eyeCatchImage?.colorPalette)
        ? data.eyeCatchImage.colorPalette.slice(0, 4).map((c: any) => String(c).substring(0, 20))
        : [],
      mood: data.eyeCatchImage?.mood ? String(data.eyeCatchImage.mood).substring(0, 50) : '',
      style: data.eyeCatchImage?.style ? String(data.eyeCatchImage.style).substring(0, 50) : '',
      summary: data.eyeCatchImage?.summary ? String(data.eyeCatchImage.summary).substring(0, 150) : '',
    },
    hashtags: Array.isArray(data.hashtags)
      ? data.hashtags
          .slice(0, 20)
          .map((tag: any) => {
            const tagStr = String(tag);
            return tagStr.startsWith('#') ? tagStr.substring(0, 30) : `#${tagStr}`.substring(0, 30);
          })
      : [],
  };
}
