/**
 * InfoCard Component - Enhanced Information Cards
 *
 * @description Versatile card component for displaying structured information
 * with icons, headers, content, and footers. Supports hover effects and actions.
 *
 * @example
 * ```tsx
 * <InfoCard
 *   icon={<SparklesIcon />}
 *   title="AI Analysis"
 *   subtitle="Powered by GPT-4"
 *   content={<p>Your content here</p>}
 *   footer={<Button>View Details</Button>}
 *   hoverable
 * />
 * ```
 */

'use client';

import { ReactNode } from 'react';
import { cn } from '@/app/utils/ui/classNames';

export interface InfoCardProps {
  /** Icon displayed at the top */
  icon?: ReactNode;
  /** Icon position */
  iconPosition?: 'top' | 'left';
  /** Main title */
  title: string;
  /** Subtitle or description */
  subtitle?: string;
  /** Main content area */
  content?: ReactNode;
  /** Footer content (actions, buttons, etc.) */
  footer?: ReactNode;
  /** Visual variant */
  variant?: 'default' | 'glass' | 'gradient' | 'outline';
  /** Enable hover effects */
  hoverable?: boolean;
  /** Clickable card */
  onClick?: () => void;
  /** Custom className */
  className?: string;
  /** Badge in header */
  badge?: ReactNode;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
}

/**
 * InfoCard with flexible layout and premium styling
 */
export function InfoCard({
  icon,
  iconPosition = 'top',
  title,
  subtitle,
  content,
  footer,
  variant = 'default',
  hoverable = true,
  onClick,
  className,
  badge,
  size = 'md',
}: InfoCardProps) {
  const sizes = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const variants = {
    default: 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-lg',
    glass:
      'backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 border border-white/20 dark:border-white/10 shadow-xl',
    gradient:
      'bg-gradient-to-br from-primary-500 via-primary-600 to-accent-600 text-white border-0 shadow-2xl shadow-primary-500/30',
    outline:
      'bg-transparent border-2 border-primary-200 dark:border-primary-800 hover:bg-primary-50 dark:hover:bg-primary-900/10',
  };

  const isClickable = !!onClick;

  return (
    <div
      className={cn(
        'rounded-2xl transition-all duration-300 ease-out overflow-hidden',
        variants[variant],
        sizes[size],
        hoverable && 'hover:shadow-2xl',
        hoverable && 'hover:-translate-y-1',
        hoverable && variant === 'default' && 'hover:border-primary-300 dark:hover:border-primary-700',
        isClickable && 'cursor-pointer active:scale-[0.98]',
        className
      )}
      onClick={onClick}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={
        isClickable
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick?.();
              }
            }
          : undefined
      }
    >
      {/* Icon position: left - horizontal layout */}
      {iconPosition === 'left' && icon && (
        <div className="flex gap-4">
          {/* Icon */}
          <div className="flex-shrink-0">
            <div
              className={cn(
                'flex items-center justify-center rounded-xl',
                variant === 'gradient'
                  ? 'bg-white/20 text-white'
                  : 'bg-gradient-to-br from-primary-500 to-accent-500 text-white shadow-lg shadow-primary-500/30',
                'w-12 h-12'
              )}
            >
              <div className="w-6 h-6">{icon}</div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex-1 min-w-0">
                <h3
                  className={cn(
                    'font-bold text-lg truncate',
                    variant === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
                  )}
                >
                  {title}
                </h3>
                {subtitle && (
                  <p
                    className={cn(
                      'text-sm mt-1',
                      variant === 'gradient'
                        ? 'text-white/80'
                        : 'text-gray-600 dark:text-gray-400'
                    )}
                  >
                    {subtitle}
                  </p>
                )}
              </div>
              {badge && <div className="flex-shrink-0">{badge}</div>}
            </div>

            {/* Content */}
            {content && <div className="mt-3">{content}</div>}

            {/* Footer */}
            {footer && <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">{footer}</div>}
          </div>
        </div>
      )}

      {/* Icon position: top - vertical layout */}
      {iconPosition === 'top' && (
        <>
          {/* Icon */}
          {icon && (
            <div className="mb-4">
              <div
                className={cn(
                  'inline-flex items-center justify-center rounded-xl',
                  variant === 'gradient'
                    ? 'bg-white/20 text-white'
                    : 'bg-gradient-to-br from-primary-500 to-accent-500 text-white shadow-lg shadow-primary-500/30',
                  'w-12 h-12'
                )}
              >
                <div className="w-6 h-6">{icon}</div>
              </div>
            </div>
          )}

          {/* Header */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1 min-w-0">
              <h3
                className={cn(
                  'font-bold text-lg',
                  variant === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
                )}
              >
                {title}
              </h3>
              {subtitle && (
                <p
                  className={cn(
                    'text-sm mt-1',
                    variant === 'gradient'
                      ? 'text-white/80'
                      : 'text-gray-600 dark:text-gray-400'
                  )}
                >
                  {subtitle}
                </p>
              )}
            </div>
            {badge && <div className="flex-shrink-0">{badge}</div>}
          </div>

          {/* Content */}
          {content && (
            <div
              className={cn(
                'mt-3',
                variant === 'gradient' ? 'text-white/90' : 'text-gray-700 dark:text-gray-300'
              )}
            >
              {content}
            </div>
          )}

          {/* Footer */}
          {footer && (
            <div
              className={cn(
                'mt-4 pt-4',
                variant === 'gradient'
                  ? 'border-t border-white/20'
                  : 'border-t border-gray-200 dark:border-gray-800'
              )}
            >
              {footer}
            </div>
          )}
        </>
      )}
    </div>
  );
}

/**
 * Stat card variant for displaying numbers/metrics
 */
export function StatCard({
  label,
  value,
  change,
  changeType,
  icon,
  className,
}: {
  label: string;
  value: string | number;
  change?: string | number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  icon?: ReactNode;
  className?: string;
}) {
  const changeColors = {
    increase: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20',
    decrease: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20',
    neutral: 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20',
  };

  return (
    <InfoCard
      icon={icon}
      iconPosition="left"
      title={label}
      content={
        <div className="flex items-end justify-between gap-4">
          <div className="text-3xl font-bold text-gray-900 dark:text-white">{value}</div>
          {change !== undefined && changeType && (
            <div
              className={cn(
                'inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold',
                changeColors[changeType]
              )}
            >
              {changeType === 'increase' && '↑'}
              {changeType === 'decrease' && '↓'}
              {change}
            </div>
          )}
        </div>
      }
      className={className}
      size="sm"
    />
  );
}

/**
 * Feature card with list of items
 */
export function FeatureCard({
  title,
  description,
  features,
  icon,
  className,
}: {
  title: string;
  description?: string;
  features: string[];
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <InfoCard
      icon={icon}
      title={title}
      subtitle={description}
      content={
        <ul className="space-y-2 mt-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
              <svg
                className="w-5 h-5 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
            </li>
          ))}
        </ul>
      }
      className={className}
    />
  );
}
