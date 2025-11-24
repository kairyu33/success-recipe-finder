/**
 * Article Input Component
 *
 * @description Text input area for article content with analysis button
 * Includes character count, error display, and loading state
 *
 * @example
 * ```tsx
 * <ArticleInput
 *   value={text}
 *   onChange={setText}
 *   onAnalyze={handleAnalyze}
 *   loading={isLoading}
 * />
 * ```
 */

'use client';

import { Card } from '@/app/components/ui/Card/Card';
import { Button } from '@/app/components/ui/Button/Button';
import { ErrorMessage } from '@/app/components/ui/ErrorMessage/ErrorMessage';
import { INPUT_TEXT, BUTTON_TEXT } from '@/app/constants/text.constants';
import { ArticleInputProps } from './ArticleInput.types';

/**
 * Article input form component
 */
export function ArticleInput({
  value,
  onChange,
  onAnalyze,
  loading = false,
  error,
  onClearError,
}: ArticleInputProps) {
  const characterCount = value.length;
  const maxCharacters = 30000;

  const analyzeIcon = (
    <svg
      className="h-5 w-5"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  );

  return (
    <Card className="p-6 md:p-8 mb-8">
      <div className="mb-6">
        <label
          htmlFor="article-text"
          className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3"
        >
          {INPUT_TEXT.label}
        </label>
        <textarea
          id="article-text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={INPUT_TEXT.placeholder}
          className="w-full min-h-[400px] px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-y transition-all"
          disabled={loading}
        />
        <div className="mt-2 flex items-center justify-between">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {characterCount} {INPUT_TEXT.characterCount}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            {INPUT_TEXT.maxCharacters}
          </p>
        </div>
      </div>

      {error && (
        <ErrorMessage message={error} onDismiss={onClearError} />
      )}

      <Button
        onClick={onAnalyze}
        disabled={loading || !value.trim()}
        isLoading={loading}
        variant="primary"
        size="xl"
        className="w-full"
        leftIcon={!loading ? analyzeIcon : undefined}
      >
        {loading ? BUTTON_TEXT.analyzing : BUTTON_TEXT.analyze}
      </Button>
    </Card>
  );
}
