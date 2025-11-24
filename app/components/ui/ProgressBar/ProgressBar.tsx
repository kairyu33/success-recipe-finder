/**
 * ProgressBar Component - Premium Progress Visualization
 *
 * @description Enhanced progress bars with gradients, animations, and shimmer effects
 * Used for score displays, loading states, and progress indicators
 *
 * @example
 * ```tsx
 * <ProgressBar
 *   value={75}
 *   max={100}
 *   color="primary"
 *   animated
 *   showLabel
 * />
 * ```
 */

'use client';

import { ReactNode } from 'react';
import { cn } from '@/app/utils/ui/classNames';

export interface ProgressBarProps {
  /** Current progress value */
  value: number;
  /** Maximum value */
  max?: number;
  /** Color scheme */
  color?: 'primary' | 'accent' | 'success' | 'warning' | 'error' | 'gradient';
  /** Height size */
  size?: 'xs' | 'sm' | 'md' | 'lg';
  /** Show percentage label */
  showLabel?: boolean;
  /** Label position */
  labelPosition?: 'inside' | 'outside' | 'top';
  /** Enable animations */
  animated?: boolean;
  /** Enable shimmer effect */
  shimmer?: boolean;
  /** Custom label (overrides percentage) */
  label?: ReactNode;
  /** Custom className */
  className?: string;
  /** Rounded or square ends */
  rounded?: boolean;
}

/**
 * ProgressBar with gradient support and animations
 */
export function ProgressBar({
  value,
  max = 100,
  color = 'gradient',
  size = 'md',
  showLabel = false,
  labelPosition = 'outside',
  animated = true,
  shimmer = false,
  label,
  className,
  rounded = true,
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const sizes = {
    xs: 'h-1',
    sm: 'h-2',
    md: 'h-2.5',
    lg: 'h-3',
  };

  const colors = {
    primary: 'bg-gradient-to-r from-primary-500 to-primary-600',
    accent: 'bg-gradient-to-r from-accent-500 to-accent-600',
    success: 'bg-gradient-to-r from-green-500 to-emerald-600',
    warning: 'bg-gradient-to-r from-amber-500 to-orange-600',
    error: 'bg-gradient-to-r from-red-500 to-rose-600',
    gradient: 'bg-gradient-to-r from-primary-500 to-accent-500',
  };

  const progressColor = colors[color];
  const displayLabel = label || `${percentage.toFixed(0)}%`;

  return (
    <div className={cn('w-full', className)}>
      {/* Top label */}
      {showLabel && labelPosition === 'top' && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{displayLabel}</span>
        </div>
      )}

      {/* Progress bar container */}
      <div className="relative flex items-center gap-3">
        {/* Bar background */}
        <div
          className={cn(
            'relative flex-1 bg-gray-200 dark:bg-gray-800 overflow-hidden',
            sizes[size],
            rounded ? 'rounded-full' : 'rounded-sm'
          )}
        >
          {/* Shimmer effect */}
          {shimmer && (
            <div className="absolute inset-0 shimmer-effect">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
            </div>
          )}

          {/* Progress fill */}
          <div
            className={cn(
              'h-full relative overflow-hidden',
              progressColor,
              rounded ? 'rounded-full' : 'rounded-sm',
              animated && 'transition-all duration-1000 ease-out'
            )}
            style={{ width: `${percentage}%` }}
          >
            {/* Shine overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent" />

            {/* Inside label */}
            {showLabel && labelPosition === 'inside' && percentage > 15 && (
              <div className="absolute inset-0 flex items-center justify-end pr-2">
                <span className="text-xs font-bold text-white drop-shadow-sm">{displayLabel}</span>
              </div>
            )}
          </div>
        </div>

        {/* Outside label */}
        {showLabel && labelPosition === 'outside' && (
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 min-w-[3rem] text-right">
            {displayLabel}
          </span>
        )}
      </div>
    </div>
  );
}

/**
 * Circular progress indicator
 */
export function CircularProgress({
  value,
  max = 100,
  size = 120,
  strokeWidth = 12,
  color = 'gradient',
  showLabel = true,
  label,
  className,
}: {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  color?: 'primary' | 'accent' | 'success' | 'warning' | 'error' | 'gradient';
  showLabel?: boolean;
  label?: ReactNode;
  className?: string;
}) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  const gradientId = `gradient-${color}-${Math.random().toString(36).substr(2, 9)}`;

  const gradients = {
    primary: { from: '#a855f7', to: '#9333ea' },
    accent: { from: '#06b6d4', to: '#0891b2' },
    success: { from: '#10b981', to: '#14b8a6' },
    warning: { from: '#f59e0b', to: '#ef4444' },
    error: { from: '#ef4444', to: '#dc2626' },
    gradient: { from: '#a855f7', to: '#06b6d4' },
  };

  const { from, to } = gradients[color];

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg className="transform -rotate-90" width={size} height={size}>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-gray-200 dark:text-gray-800"
        />

        {/* Progress circle with gradient */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />

        {/* Gradient definition */}
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={from} />
            <stop offset="100%" stopColor={to} />
          </linearGradient>
        </defs>
      </svg>

      {/* Center label */}
      {showLabel && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {label || (
            <>
              <span className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 dark:from-primary-400 dark:to-accent-400 bg-clip-text text-transparent">
                {value}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">/ {max}</span>
            </>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Multi-segment progress bar (for showing multiple values)
 */
export function SegmentedProgressBar({
  segments,
  height = 'md',
  showLabels = false,
  className,
}: {
  segments: Array<{
    value: number;
    color: string;
    label?: string;
  }>;
  height?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
  className?: string;
}) {
  const total = segments.reduce((sum, seg) => sum + seg.value, 0);

  const heights = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  };

  return (
    <div className={cn('w-full', className)}>
      <div className={cn('relative flex overflow-hidden rounded-full', heights[height])}>
        {segments.map((segment, index) => {
          const percentage = (segment.value / total) * 100;
          return (
            <div
              key={index}
              className={cn('transition-all duration-1000 ease-out', segment.color)}
              style={{ width: `${percentage}%` }}
              title={segment.label}
            />
          );
        })}
      </div>

      {/* Labels */}
      {showLabels && (
        <div className="flex flex-wrap gap-3 mt-3">
          {segments.map((segment, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className={cn('w-3 h-3 rounded-full', segment.color)} />
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {segment.label}: {segment.value}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
