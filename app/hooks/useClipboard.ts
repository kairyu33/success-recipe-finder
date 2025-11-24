/**
 * useClipboard Hook
 *
 * @description Custom hook for clipboard operations with feedback
 * Manages copy state and provides success callbacks
 *
 * @example
 * ```tsx
 * const { copy, copiedId, isCopied } = useClipboard();
 *
 * <button onClick={() => copy('text', 'id')}>
 *   {isCopied('id') ? 'Copied!' : 'Copy'}
 * </button>
 * ```
 */

'use client';

import { useState, useCallback } from 'react';

interface UseClipboardReturn {
  copy: (text: string, itemId: string) => Promise<void>;
  copiedId: string | null;
  isCopied: (itemId: string) => boolean;
}

/**
 * Hook for managing clipboard copy operations
 *
 * @param timeout - Time in ms before resetting copied state (default: 2000)
 * @returns Clipboard utilities
 */
export function useClipboard(timeout = 2000): UseClipboardReturn {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copy = useCallback(
    async (text: string, itemId: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopiedId(itemId);
        setTimeout(() => setCopiedId(null), timeout);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    },
    [timeout]
  );

  const isCopied = useCallback(
    (itemId: string) => copiedId === itemId,
    [copiedId]
  );

  return { copy, copiedId, isCopied };
}
