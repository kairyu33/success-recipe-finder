/**
 * BadgeList Component - Interactive Badge Collection
 *
 * @description Display and manage lists of badges with copy functionality
 * Perfect for hashtags, tags, keywords, and label collections
 *
 * @example
 * ```tsx
 * <BadgeList
 *   items={['#design', '#ui', '#react']}
 *   variant="primary"
 *   copyable
 *   onCopy={(item) => console.log('Copied:', item)}
 * />
 * ```
 */

'use client';

import { ReactNode, useState } from 'react';
import { cn } from '@/app/utils/ui/classNames';

export interface BadgeListProps {
  /** Array of badge items (strings or objects) */
  items: string[] | Array<{ label: string; value?: string; icon?: ReactNode }>;
  /** Visual variant */
  variant?: 'default' | 'primary' | 'accent' | 'success' | 'gradient';
  /** Size of badges */
  size?: 'sm' | 'md' | 'lg';
  /** Enable copy-on-click */
  copyable?: boolean;
  /** Maximum items to show (with "show more" button) */
  maxItems?: number;
  /** Layout direction */
  layout?: 'horizontal' | 'vertical';
  /** Callback when badge is copied */
  onCopy?: (item: string) => void;
  /** Callback when badge is clicked */
  onClick?: (item: string, index: number) => void;
  /** Custom className */
  className?: string;
  /** Enable removal (shows X button) */
  removable?: boolean;
  /** Callback when badge is removed */
  onRemove?: (item: string, index: number) => void;
}

/**
 * BadgeList component with copy functionality and animations
 */
export function BadgeList({
  items,
  variant = 'default',
  size = 'md',
  copyable = false,
  maxItems,
  layout = 'horizontal',
  onCopy,
  onClick,
  className,
  removable = false,
  onRemove,
}: BadgeListProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);

  const displayItems = maxItems && !showAll ? items.slice(0, maxItems) : items;
  const hasMore = maxItems && items.length > maxItems;

  const sizes = {
    sm: 'text-xs px-2.5 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2',
  };

  const variants = {
    default:
      'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700',
    primary:
      'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800',
    accent:
      'bg-accent-50 dark:bg-accent-900/20 text-accent-700 dark:text-accent-300 border border-accent-200 dark:border-accent-800',
    success:
      'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800',
    gradient: 'bg-gradient-to-r from-primary-500 to-accent-500 text-white border-0',
  };

  const handleCopy = async (item: string | { label: string; value?: string }, index: number) => {
    const textToCopy = typeof item === 'string' ? item : item.value || item.label;

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopiedIndex(index);
      onCopy?.(textToCopy);

      setTimeout(() => {
        setCopiedIndex(null);
      }, 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleClick = (item: string | { label: string; value?: string }, index: number) => {
    const value = typeof item === 'string' ? item : item.value || item.label;

    if (copyable) {
      handleCopy(item, index);
    } else {
      onClick?.(value, index);
    }
  };

  const handleRemove = (item: string | { label: string; value?: string }, index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const value = typeof item === 'string' ? item : item.value || item.label;
    onRemove?.(value, index);
  };

  return (
    <div className={cn('relative', className)}>
      <div
        className={cn(
          'flex flex-wrap gap-2',
          layout === 'vertical' && 'flex-col items-start'
        )}
      >
        {displayItems.map((item, index) => {
          const label = typeof item === 'string' ? item : item.label;
          const icon = typeof item === 'object' && 'icon' in item ? item.icon : null;
          const isCopied = copiedIndex === index;

          return (
            <button
              key={index}
              type="button"
              onClick={() => handleClick(item, index)}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full font-medium',
                'transition-all duration-200',
                sizes[size],
                variants[variant],
                (copyable || onClick) && 'hover:scale-105 hover:shadow-md cursor-pointer',
                (copyable || onClick) && 'active:scale-95',
                'animate-fade-in-up',
                isCopied && 'ring-2 ring-primary-500 ring-offset-2'
              )}
              style={{ animationDelay: `${index * 50}ms` }}
              disabled={!copyable && !onClick}
            >
              {/* Icon */}
              {icon && <span className="flex-shrink-0">{icon}</span>}

              {/* Label */}
              <span>{label}</span>

              {/* Copy indicator or Remove button */}
              {isCopied ? (
                <svg
                  className="w-4 h-4 flex-shrink-0 animate-scale-in"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : removable ? (
                <button
                  type="button"
                  onClick={(e) => handleRemove(item, index, e)}
                  className={cn(
                    'flex-shrink-0 rounded-full p-0.5',
                    'hover:bg-gray-200 dark:hover:bg-gray-700',
                    'transition-colors duration-200'
                  )}
                  aria-label="Remove"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              ) : copyable ? (
                <svg
                  className="w-4 h-4 flex-shrink-0 opacity-50"
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
              ) : null}
            </button>
          );
        })}

        {/* Show more button */}
        {hasMore && !showAll && (
          <button
            type="button"
            onClick={() => setShowAll(true)}
            className={cn(
              'inline-flex items-center gap-1 rounded-full font-medium',
              'text-primary-600 dark:text-primary-400',
              'hover:bg-primary-50 dark:hover:bg-primary-900/20',
              'transition-all duration-200 hover:scale-105',
              sizes[size]
            )}
          >
            <span>+{items.length - maxItems} more</span>
          </button>
        )}

        {/* Show less button */}
        {hasMore && showAll && (
          <button
            type="button"
            onClick={() => setShowAll(false)}
            className={cn(
              'inline-flex items-center gap-1 rounded-full font-medium',
              'text-gray-600 dark:text-gray-400',
              'hover:bg-gray-100 dark:hover:bg-gray-800',
              'transition-all duration-200',
              sizes[size]
            )}
          >
            <span>Show less</span>
          </button>
        )}
      </div>

      {/* Copy all button */}
      {copyable && items.length > 1 && (
        <button
          type="button"
          onClick={async () => {
            const allText = items
              .map((item) => (typeof item === 'string' ? item : item.value || item.label))
              .join(' ');
            await navigator.clipboard.writeText(allText);
            onCopy?.(allText);
          }}
          className={cn(
            'mt-3 text-sm text-primary-600 dark:text-primary-400',
            'hover:text-primary-700 dark:hover:text-primary-300',
            'transition-colors duration-200',
            'flex items-center gap-1.5'
          )}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
          <span>Copy all</span>
        </button>
      )}
    </div>
  );
}

/**
 * Hashtag-specific badge list
 */
export function HashtagList({
  hashtags,
  onCopy,
  className,
}: {
  hashtags: string[];
  onCopy?: (hashtag: string) => void;
  className?: string;
}) {
  return (
    <BadgeList
      items={hashtags.map((tag) => ({
        label: tag.startsWith('#') ? tag : `#${tag}`,
        value: tag.startsWith('#') ? tag : `#${tag}`,
      }))}
      variant="primary"
      copyable
      onCopy={onCopy}
      className={className}
    />
  );
}
