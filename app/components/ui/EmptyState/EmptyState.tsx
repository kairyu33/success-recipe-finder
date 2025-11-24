/**
 * EmptyState Component - Premium Empty State Design
 *
 * @description Beautifully designed empty state component with animations
 * Used when no data is available in tabs or sections
 *
 * @example
 * ```tsx
 * <EmptyState
 *   icon={<SparklesIcon />}
 *   title="No insights yet"
 *   description="Analyze your article to see AI-powered insights"
 * />
 * ```
 */

'use client';

import { ReactNode } from 'react';
import { cn } from '@/app/utils/ui/classNames';

export interface EmptyStateProps {
  /** Icon to display (React component or SVG) */
  icon?: ReactNode;
  /** Main heading text */
  title: string;
  /** Supporting description text */
  description?: string;
  /** Optional action button */
  action?: ReactNode;
  /** Custom className */
  className?: string;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Enable entrance animation */
  animated?: boolean;
}

/**
 * EmptyState component with gradient icon background and smooth animations
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
  size = 'md',
  animated = true,
}: EmptyStateProps) {
  const sizes = {
    sm: {
      container: 'py-8',
      iconWrapper: 'w-12 h-12 mb-3',
      icon: 'w-6 h-6',
      title: 'text-base',
      description: 'text-sm',
    },
    md: {
      container: 'py-16',
      iconWrapper: 'w-16 h-16 mb-4',
      icon: 'w-8 h-8',
      title: 'text-lg',
      description: 'text-base',
    },
    lg: {
      container: 'py-24',
      iconWrapper: 'w-20 h-20 mb-6',
      icon: 'w-10 h-10',
      title: 'text-2xl',
      description: 'text-lg',
    },
  };

  const sizeStyles = sizes[size];

  return (
    <div
      className={cn(
        'text-center',
        sizeStyles.container,
        animated && 'animate-fade-in-up',
        className
      )}
    >
      {/* Icon with gradient background */}
      {icon && (
        <div className="flex justify-center">
          <div
            className={cn(
              'inline-flex items-center justify-center rounded-2xl',
              'bg-gradient-to-br from-primary-500/10 to-accent-500/10',
              'border border-primary-200/50 dark:border-primary-800/50',
              'backdrop-blur-sm',
              'shadow-lg shadow-primary-500/10',
              sizeStyles.iconWrapper,
              animated && 'animate-scale-in'
            )}
          >
            <div className={cn('text-primary-600 dark:text-primary-400', sizeStyles.icon)}>
              {icon}
            </div>
          </div>
        </div>
      )}

      {/* Title */}
      <h3
        className={cn(
          'font-bold text-gray-900 dark:text-white',
          sizeStyles.title,
          animated && 'animate-fade-in-up [animation-delay:100ms]'
        )}
      >
        {title}
      </h3>

      {/* Description */}
      {description && (
        <p
          className={cn(
            'text-gray-600 dark:text-gray-400 mt-2 max-w-md mx-auto',
            sizeStyles.description,
            animated && 'animate-fade-in-up [animation-delay:200ms]'
          )}
        >
          {description}
        </p>
      )}

      {/* Optional action button */}
      {action && (
        <div className={cn('mt-6', animated && 'animate-fade-in-up [animation-delay:300ms]')}>
          {action}
        </div>
      )}
    </div>
  );
}

/**
 * Preset EmptyState for common scenarios
 */
export function NoDataEmptyState({ message = 'データがありません' }: { message?: string }) {
  return (
    <EmptyState
      icon={
        <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
      }
      title={message}
      description="分析を実行すると、ここに結果が表示されます"
    />
  );
}

/**
 * EmptyState for search/filter results
 */
export function NoResultsEmptyState({ query }: { query?: string }) {
  return (
    <EmptyState
      icon={
        <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      }
      title="結果が見つかりません"
      description={query ? `「${query}」に一致する結果がありません` : '検索条件を変更してみてください'}
      size="sm"
    />
  );
}

/**
 * EmptyState for error scenarios
 */
export function ErrorEmptyState({ message = 'エラーが発生しました' }: { message?: string }) {
  return (
    <EmptyState
      icon={
        <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      }
      title={message}
      description="もう一度お試しください"
    />
  );
}
