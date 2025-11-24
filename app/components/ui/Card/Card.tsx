/**
 * Card Component - Premium Design System
 *
 * @description Enhanced card containers with glassmorphism, gradients, and neumorphism
 * Provides consistent, modern styling across the application
 *
 * @example
 * ```tsx
 * <Card variant="glass">
 *   <h2>Card Title</h2>
 *   <p>Card content</p>
 * </Card>
 * ```
 */

'use client';

import { CardProps, GradientCardProps } from '@/app/types/ui';
import { cn } from '@/app/utils/ui/classNames';

/**
 * Base card variants
 */
const cardVariants = {
  default: 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-lg',
  glass: 'glass-light dark:glass-dark border-0',
  gradient: 'bg-gradient-to-br from-primary-500 via-primary-600 to-accent-600 text-white border-0 shadow-2xl shadow-primary-500/30',
  neuro: 'bg-gray-100 dark:bg-gray-900 shadow-[8px_8px_16px_#d1d1d1,-8px_-8px_16px_#ffffff] dark:shadow-[8px_8px_16px_#000000,-8px_-8px_16px_#1a1a1f] border-0',
};

/**
 * Enhanced card container with multiple style variants
 */
export function Card({
  variant = 'default',
  hover = true,
  children,
  className,
  ...props
}: CardProps & { variant?: keyof typeof cardVariants; hover?: boolean }) {
  return (
    <div
      className={cn(
        // Base styles
        'rounded-2xl transition-all duration-300 ease-out',

        // Variant styles
        cardVariants[variant],

        // Hover effects (optional)
        hover && 'hover:shadow-2xl',
        hover && 'hover:-translate-y-1',
        hover && variant === 'default' && 'hover:border-primary-300 dark:hover:border-primary-700',

        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * Gradient card with custom colors and premium effects
 */
export function GradientCard({
  fromColor = 'primary-500',
  toColor = 'accent-500',
  children,
  className,
  ...props
}: GradientCardProps & { fromColor?: string; toColor?: string }) {
  return (
    <div
      className={cn(
        'relative rounded-2xl p-6 border-0 transition-all duration-300',
        'shadow-xl hover:shadow-2xl',
        'hover:-translate-y-1',
        'overflow-hidden',
        className
      )}
      style={{
        background: `linear-gradient(135deg, var(--tw-gradient-stops))`,
      }}
      {...props}
    >
      {/* Gradient background */}
      <div
        className="absolute inset-0 opacity-90"
        style={{
          background: `linear-gradient(135deg, rgb(var(--${fromColor})) 0%, rgb(var(--${toColor})) 100%)`,
        }}
      />

      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-10 bg-gradient-mesh" />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

/**
 * Score card with prominent number display
 */
export function ScoreCard({
  title,
  score,
  maxScore = 100,
  color = 'primary',
  icon,
  className,
}: {
  title: string;
  score: number;
  maxScore?: number;
  color?: 'primary' | 'accent' | 'success' | 'warning' | 'error';
  icon?: React.ReactNode;
  className?: string;
}) {
  const percentage = (score / maxScore) * 100;

  const colorClasses = {
    primary: 'from-primary-500 to-primary-600 text-primary-600 dark:text-primary-400',
    accent: 'from-accent-500 to-accent-600 text-accent-600 dark:text-accent-400',
    success: 'from-green-500 to-emerald-600 text-green-600 dark:text-green-400',
    warning: 'from-amber-500 to-orange-600 text-amber-600 dark:text-amber-400',
    error: 'from-red-500 to-rose-600 text-red-600 dark:text-red-400',
  };

  return (
    <Card variant="default" hover className={className}>
      <div className="p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {icon && <span className="text-gray-600 dark:text-gray-400">{icon}</span>}
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {title}
            </h4>
          </div>
          <span className={cn('text-3xl font-bold', colorClasses[color].split(' ')[2])}>
            {score}
          </span>
        </div>

        {/* Progress bar with gradient */}
        <div className="relative h-2.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
          {/* Shimmer effect */}
          <div className="absolute inset-0 shimmer" />

          {/* Progress fill */}
          <div
            className={cn(
              'h-full rounded-full transition-all duration-1000 ease-out',
              `bg-gradient-to-r ${colorClasses[color].split(' ')[0]} ${colorClasses[color].split(' ')[1]}`
            )}
            style={{ width: `${percentage}%` }}
          >
            {/* Shine overlay */}
            <div className="h-full w-full bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          </div>
        </div>

        {/* Percentage label */}
        <div className="mt-2 text-right">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
            {percentage.toFixed(0)}%
          </span>
        </div>
      </div>
    </Card>
  );
}

/**
 * Content card with icon and description
 */
export function ContentCard({
  icon,
  title,
  description,
  children,
  className,
}: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <Card variant="default" hover className={className}>
      <div className="p-6">
        {/* Header with icon */}
        {icon && (
          <div className="mb-4 p-3 w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white shadow-lg shadow-primary-500/30">
            {icon}
          </div>
        )}

        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
          {title}
        </h3>

        {/* Description */}
        {description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {description}
          </p>
        )}

        {/* Additional content */}
        {children}
      </div>
    </Card>
  );
}
