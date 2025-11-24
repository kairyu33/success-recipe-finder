/**
 * Main Layout Component
 *
 * @description Primary layout wrapper for the application
 * Provides consistent background and structure
 *
 * @example
 * ```tsx
 * <MainLayout>
 *   <YourPageContent />
 * </MainLayout>
 * ```
 */

'use client';

import { ReactNode } from 'react';
import { cn } from '@/app/utils/ui/classNames';

interface MainLayoutProps {
  children: ReactNode;
  className?: string;
}

/**
 * Main application layout
 */
export function MainLayout({ children, className }: MainLayoutProps) {
  return (
    <main
      className={cn(
        'min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900',
        className
      )}
    >
      {children}
    </main>
  );
}
