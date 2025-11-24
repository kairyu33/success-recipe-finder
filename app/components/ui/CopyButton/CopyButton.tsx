/**
 * Copy Button Component
 *
 * @description Button that copies text to clipboard with visual feedback
 * Includes success state animation
 *
 * @example
 * ```tsx
 * <CopyButton text="Copy this text" itemId="unique-id" label="Copy" />
 * ```
 */

'use client';

import { useState } from 'react';
import { CopyButtonProps } from '@/app/types/ui';
import { cn } from '@/app/utils/ui/classNames';
import { BUTTON_TEXT } from '@/app/constants/text.constants';

/**
 * Copy to clipboard button with success feedback
 */
export function CopyButton({
  text,
  itemId,
  label = BUTTON_TEXT.copy,
  className,
  onCopy,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      onCopy?.(text);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={cn(
        'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
        copied
          ? 'bg-success-600 text-white'
          : 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 hover:bg-primary-200 dark:hover:bg-primary-800',
        className
      )}
    >
      {copied ? (
        <>
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          {BUTTON_TEXT.copied}
        </>
      ) : (
        <>
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
          {label}
        </>
      )}
    </button>
  );
}
