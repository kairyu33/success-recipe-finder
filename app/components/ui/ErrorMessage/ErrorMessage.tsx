/**
 * Error Message Component
 *
 * @description Displays error messages with optional dismiss functionality
 * Includes icon and animation
 *
 * @example
 * ```tsx
 * <ErrorMessage message="Something went wrong" onDismiss={() => setError(null)} />
 * ```
 */

'use client';

import { ErrorMessageProps } from '@/app/types/ui';
import { cn } from '@/app/utils/ui/classNames';

/**
 * Error message display with optional dismiss button
 */
export function ErrorMessage({ message, onDismiss }: ErrorMessageProps) {
  return (
    <div
      className={cn(
        'mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg animate-fade-in'
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start">
          <p className="text-red-700 dark:text-red-400 text-sm font-medium">
            {message}
          </p>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors ml-3"
            aria-label="Dismiss error"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
