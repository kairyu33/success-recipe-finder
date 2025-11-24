/**
 * Section Component
 *
 * @description Semantic section wrapper with consistent spacing
 * Provides vertical padding and optional backgrounds
 *
 * @example
 * ```tsx
 * <Section>
 *   <YourContent />
 * </Section>
 * ```
 */

'use client';

import { SectionProps } from '@/app/types/ui';
import { cn } from '@/app/utils/ui/classNames';

/**
 * Semantic section container
 */
export function Section({ children, className, ...props }: SectionProps) {
  return (
    <section
      className={cn('py-12 px-4 sm:px-6 lg:px-8', className)}
      {...props}
    >
      {children}
    </section>
  );
}
