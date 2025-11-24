/**
 * Storage Utility
 *
 * @description Type-safe wrapper around localStorage with error handling
 * Provides size monitoring and cleanup capabilities
 *
 * @example
 * ```typescript
 * storage.setItem('user-settings', { theme: 'dark' });
 * const settings = storage.getItem<UserSettings>('user-settings');
 * ```
 */

/**
 * Type-safe storage operations
 */
export const storage = {
  /**
   * Get item from localStorage with type safety
   *
   * @param key - Storage key
   * @returns Parsed value or null if not found
   */
  getItem<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      if (item === null) {
        return null;
      }
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`Failed to get item "${key}":`, error);
      return null;
    }
  },

  /**
   * Set item in localStorage
   *
   * @param key - Storage key
   * @param value - Value to store (will be JSON stringified)
   */
  setItem<T>(key: string, value: T): void {
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(key, serialized);
    } catch (error) {
      console.error(`Failed to set item "${key}":`, error);

      // Handle quota exceeded error
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        console.warn('LocalStorage quota exceeded. Consider clearing old data.');
        throw new Error('Storage quota exceeded. Please free up space.');
      }
    }
  },

  /**
   * Remove item from localStorage
   *
   * @param key - Storage key to remove
   */
  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Failed to remove item "${key}":`, error);
    }
  },

  /**
   * Clear all localStorage
   *
   * @description WARNING: This removes ALL data from localStorage
   */
  clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
    }
  },

  /**
   * Get storage size for a specific key in bytes
   *
   * @param key - Storage key
   * @returns Size in bytes
   */
  getItemSize(key: string): number {
    try {
      const item = localStorage.getItem(key);
      if (!item) {
        return 0;
      }
      return new Blob([item]).size;
    } catch (error) {
      console.error(`Failed to calculate size for "${key}":`, error);
      return 0;
    }
  },

  /**
   * Get total localStorage size in bytes
   *
   * @returns Total size in bytes
   */
  getSize(): number {
    try {
      let total = 0;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          const item = localStorage.getItem(key);
          if (item) {
            total += new Blob([item]).size;
          }
        }
      }
      return total;
    } catch (error) {
      console.error('Failed to calculate total storage size:', error);
      return 0;
    }
  },

  /**
   * Check if localStorage is available
   *
   * @returns True if localStorage is supported and available
   */
  isAvailable(): boolean {
    try {
      const testKey = '__storage_test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Get storage usage percentage
   *
   * @param maxBytes - Maximum storage size in bytes (default: 5MB)
   * @returns Usage percentage (0-100)
   */
  getUsagePercent(maxBytes: number = 5 * 1024 * 1024): number {
    const size = this.getSize();
    return (size / maxBytes) * 100;
  },

  /**
   * Format bytes to human-readable string
   *
   * @param bytes - Size in bytes
   * @returns Formatted string (e.g., "1.5 MB")
   */
  formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  },

  /**
   * Get all keys in localStorage
   *
   * @returns Array of storage keys
   */
  getAllKeys(): string[] {
    try {
      const keys: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          keys.push(key);
        }
      }
      return keys;
    } catch (error) {
      console.error('Failed to get storage keys:', error);
      return [];
    }
  },
};

/**
 * Storage event listener for cross-tab synchronization
 *
 * @description Listens for storage changes in other tabs
 * @param callback - Function to call when storage changes
 * @returns Cleanup function to remove listener
 */
export function onStorageChange(callback: (event: StorageEvent) => void): () => void {
  window.addEventListener('storage', callback);

  return () => {
    window.removeEventListener('storage', callback);
  };
}
