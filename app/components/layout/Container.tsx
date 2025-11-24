/**
 * Container Component
 *
 * @description Responsive container with max-width constraints
 * Centers content and provides consistent padding
 *
 * @example
 * ```tsx
 * <Container maxWidth="7xl">
 *   <YourContent />
 * </Container>
 * ```
 */

'use client';

import { ContainerProps } from '@/app/types/ui';
import { cn } from '@/app/utils/ui/classNames';

const maxWidthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '7xl': 'max-w-7xl',
};

/**
 * Responsive container component
 */
export function Container({
  maxWidth = '7xl',
  children,
  className,
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn('mx-auto', maxWidthClasses[maxWidth], className)}
      {...props}
    >
      {children}
    </div>
  );
}
