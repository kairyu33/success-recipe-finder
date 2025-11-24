/**
 * Header Component
 *
 * @description Application header with title and subtitle
 *
 * @example
 * ```tsx
 * <Header />
 * ```
 */

'use client';

import { APP_TEXT } from '@/app/constants/text.constants';

/**
 * Application header component
 */
export function Header() {
  return (
    <div className="text-center mb-12">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
        {APP_TEXT.title}
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
        {APP_TEXT.subtitle}
      </p>
    </div>
  );
}
