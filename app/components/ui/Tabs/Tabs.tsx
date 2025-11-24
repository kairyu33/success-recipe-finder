/**
 * Tabs Component - Premium Glassmorphism Design
 *
 * @description Modern tab navigation with glassmorphism, gradient effects, and smooth animations
 * Optimized for 10 tabs with responsive layout
 *
 * @example
 * ```tsx
 * <TabsContainer>
 *   <Tab id="titles" label="Titles" icon={<Icon />} isActive={true} />
 * </TabsContainer>
 * ```
 */

'use client';

import { TabProps } from '@/app/types/ui';
import { cn } from '@/app/utils/ui/classNames';

/**
 * Individual tab button with premium styling
 */
export function Tab({ id, label, icon, isActive, onClick }: TabProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        // Base styles
        'relative px-4 sm:px-5 py-3.5 text-sm font-semibold',
        'transition-all duration-300 ease-out',
        'flex items-center gap-2',
        'whitespace-nowrap flex-shrink-0',
        'snap-start',

        // Inactive state
        !isActive && 'text-gray-600 dark:text-gray-400',
        !isActive && 'hover:text-gray-900 dark:hover:text-gray-100',
        !isActive && 'hover:bg-gray-100/50 dark:hover:bg-gray-800/50',
        !isActive && 'rounded-lg',

        // Active state - gradient with glassmorphism
        isActive && 'bg-gradient-to-r from-primary-500 to-accent-500',
        isActive && 'text-white',
        isActive && 'shadow-lg shadow-primary-500/30',
        isActive && 'rounded-xl',
        isActive && 'scale-105',
        isActive && 'backdrop-blur-sm'
      )}
      role="tab"
      aria-selected={isActive}
      aria-controls={`${id}-panel`}
      id={`${id}-tab`}
    >
      {/* Icon - always visible */}
      <span className={cn(
        'text-lg transition-transform duration-300',
        isActive && 'animate-pulse-subtle'
      )}>
        {icon}
      </span>

      {/* Label - hidden on mobile, visible on sm+ */}
      <span className="hidden sm:inline">
        {label}
      </span>

      {/* Active indicator glow (optional subtle effect) */}
      {isActive && (
        <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary-500/20 to-accent-500/20 blur-xl -z-10" />
      )}
    </button>
  );
}

/**
 * Tabs container with glassmorphism effect
 */
export function TabsContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="sticky top-0 z-20 glass-nav">
      {/* Gradient mesh background (subtle) */}
      <div className="absolute inset-0 bg-gradient-mesh opacity-5 pointer-events-none" />

      <nav
        className="flex gap-2 px-4 sm:px-6 py-3 overflow-x-auto scrollbar-hide snap-x snap-mandatory"
        role="tablist"
      >
        {children}
      </nav>

      {/* Bottom gradient border */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary-500/50 to-transparent" />
    </div>
  );
}

/**
 * Tab panel content wrapper with fade-in animation
 */
export function TabPanel({
  id,
  isActive,
  children,
}: {
  id: string;
  isActive: boolean;
  children: React.ReactNode;
}) {
  if (!isActive) return null;

  return (
    <div
      id={`${id}-panel`}
      role="tabpanel"
      aria-labelledby={`${id}-tab`}
      className="p-6 md:p-8 animate-fade-in-up"
    >
      {children}
    </div>
  );
}
