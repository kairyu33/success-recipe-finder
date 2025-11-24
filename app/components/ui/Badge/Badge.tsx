/**
 * Badge Component
 *
 * @description Small label/badge component with color variants
 * Used for tags, labels, and status indicators
 *
 * @example
 * ```tsx
 * <Badge variant="success">Active</Badge>
 * <Badge variant="warning">Pending</Badge>
 * ```
 */

'use client';

import { BadgeProps } from '@/app/types/ui';
import { cn, variantClasses } from '@/app/utils/ui/classNames';

const badgeVariants = {
  default: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
  success: 'bg-success-100 dark:bg-success-900/40 text-success-700 dark:text-success-300 border-success-200 dark:border-success-800',
  warning: 'bg-warning-100 dark:bg-warning-900/40 text-warning-800 dark:text-warning-300 border-warning-200 dark:border-warning-800',
  error: 'bg-danger-100 dark:bg-danger-900/40 text-danger-700 dark:text-danger-300 border-danger-200 dark:border-danger-800',
  info: 'bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 border-primary-200 dark:border-primary-800',
};

/**
 * Small badge/label component
 */
export function Badge({ variant = 'default', children, className }: BadgeProps) {
  const baseClasses =
    'inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border';

  const badgeClass = variantClasses(baseClasses, badgeVariants, variant);

  return (
    <span className={cn(badgeClass, className)}>
      {children}
    </span>
  );
}
