/**
 * SectionHeader Component - Premium Section Headers
 *
 * @description Enhanced section headers with icons, gradients, and descriptions
 * Used to clearly separate and label different sections of content
 *
 * @example
 * ```tsx
 * <SectionHeader
 *   icon={<SparklesIcon />}
 *   title="AI Insights"
 *   description="Deep analysis powered by artificial intelligence"
 *   gradient
 * />
 * ```
 */

'use client';

import { ReactNode } from 'react';
import { cn } from '@/app/utils/ui/classNames';

export interface SectionHeaderProps {
  /** Icon to display */
  icon?: ReactNode;
  /** Main heading text */
  title: string;
  /** Supporting description text */
  description?: string;
  /** Apply gradient to title text */
  gradient?: boolean;
  /** Alignment */
  align?: 'left' | 'center' | 'right';
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Custom className */
  className?: string;
  /** Optional right-side action (e.g., button) */
  action?: ReactNode;
  /** Badge or tag next to title */
  badge?: ReactNode;
}

/**
 * SectionHeader with icon, title, description, and optional gradient
 */
export function SectionHeader({
  icon,
  title,
  description,
  gradient = false,
  align = 'left',
  size = 'md',
  className,
  action,
  badge,
}: SectionHeaderProps) {
  const sizes = {
    sm: {
      icon: 'w-5 h-5',
      iconWrapper: 'p-2 rounded-lg',
      title: 'text-lg',
      description: 'text-sm',
      gap: 'gap-2',
    },
    md: {
      icon: 'w-6 h-6',
      iconWrapper: 'p-3 rounded-xl',
      title: 'text-2xl',
      description: 'text-base',
      gap: 'gap-3',
    },
    lg: {
      icon: 'w-7 h-7',
      iconWrapper: 'p-4 rounded-2xl',
      title: 'text-3xl',
      description: 'text-lg',
      gap: 'gap-4',
    },
  };

  const alignments = {
    left: 'text-left justify-start',
    center: 'text-center justify-center',
    right: 'text-right justify-end',
  };

  const sizeStyles = sizes[size];
  const alignStyles = alignments[align];

  return (
    <div className={cn('mb-6', className)}>
      <div className={cn('flex items-center', alignStyles, action ? 'justify-between' : '')}>
        {/* Left side: Icon + Title + Badge */}
        <div className={cn('flex items-center', sizeStyles.gap)}>
          {/* Icon with gradient background */}
          {icon && (
            <div
              className={cn(
                'flex-shrink-0',
                sizeStyles.iconWrapper,
                'bg-gradient-to-br from-primary-500 to-accent-500',
                'text-white',
                'shadow-lg shadow-primary-500/30',
                'transition-transform duration-300 hover:scale-110'
              )}
            >
              <div className={sizeStyles.icon}>{icon}</div>
            </div>
          )}

          {/* Title and Badge */}
          <div className="flex items-center gap-3 flex-wrap">
            <h2
              className={cn(
                'font-bold',
                sizeStyles.title,
                gradient
                  ? 'bg-gradient-to-r from-primary-600 to-accent-600 dark:from-primary-400 dark:to-accent-400 bg-clip-text text-transparent'
                  : 'text-gray-900 dark:text-white'
              )}
            >
              {title}
            </h2>

            {/* Optional badge */}
            {badge && <div className="flex-shrink-0">{badge}</div>}
          </div>
        </div>

        {/* Right side: Action */}
        {action && <div className="flex-shrink-0 ml-4">{action}</div>}
      </div>

      {/* Description */}
      {description && (
        <p
          className={cn(
            'text-gray-600 dark:text-gray-400 mt-2',
            sizeStyles.description,
            alignStyles,
            icon ? 'ml-0 md:ml-[calc(theme(spacing.3)+theme(width.6)+theme(spacing.3))]' : '' // Align with title when icon present
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}

/**
 * Compact section header for dense layouts
 */
export function CompactSectionHeader({
  title,
  icon,
  action,
  className,
}: Pick<SectionHeaderProps, 'title' | 'icon' | 'action' | 'className'>) {
  return (
    <div className={cn('flex items-center justify-between mb-4', className)}>
      <div className="flex items-center gap-2">
        {icon && (
          <span className="text-primary-600 dark:text-primary-400 flex-shrink-0">{icon}</span>
        )}
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

/**
 * Section divider with centered title
 */
export function SectionDivider({ title, className }: { title: string; className?: string }) {
  return (
    <div className={cn('relative flex items-center my-8', className)}>
      {/* Left line */}
      <div className="flex-1 border-t border-gray-300 dark:border-gray-700" />

      {/* Center text */}
      <div className="px-4">
        <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          {title}
        </span>
      </div>

      {/* Right line */}
      <div className="flex-1 border-t border-gray-300 dark:border-gray-700" />
    </div>
  );
}

/**
 * Section header with gradient underline
 */
export function SectionHeaderWithUnderline({
  title,
  subtitle,
  className,
}: {
  title: string;
  subtitle?: string;
  className?: string;
}) {
  return (
    <div className={cn('mb-6', className)}>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{title}</h2>
      {subtitle && <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">{subtitle}</p>}
      <div className="h-1 w-20 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full" />
    </div>
  );
}
