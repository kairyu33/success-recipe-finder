/**
 * Footer Component
 *
 * @description Application footer with credits and description
 *
 * @example
 * ```tsx
 * <Footer />
 * ```
 */

'use client';

import { APP_TEXT } from '@/app/constants/text.constants';

/**
 * Application footer component
 */
export function Footer() {
  return (
    <div className="mt-12 text-center">
      <p className="text-sm text-gray-600 dark:text-gray-400">
        {APP_TEXT.footer.poweredBy}
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
        {APP_TEXT.footer.description}
      </p>
    </div>
  );
}
