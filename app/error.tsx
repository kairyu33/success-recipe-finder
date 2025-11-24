'use client';

import { useEffect } from 'react';
import { Button } from './components/ui/Button/Button';

/**
 * Error Boundary Component
 *
 * @description Catches runtime errors in the application and displays a user-friendly error page
 * Automatically integrated with Next.js App Router error handling
 *
 * @see https://nextjs.org/docs/app/building-your-application/routing/error-handling
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console for debugging
    console.error('[Error Boundary] Caught error:', error);

    // In production, you could send this to an error tracking service
    // Example: Sentry, LogRocket, etc.
    if (process.env.NODE_ENV === 'production') {
      // logErrorToService(error);
    }
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 md:p-12">
        {/* Error Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-red-100 dark:bg-red-900/30 rounded-full p-4">
            <svg
              className="h-16 w-16 text-red-600 dark:text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        </div>

        {/* Error Message */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            エラーが発生しました
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">
            申し訳ございません。予期しないエラーが発生しました。
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            問題が解決しない場合は、ページを再読み込みしてください。
          </p>
        </div>

        {/* Error Details (Development Only) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              開発者向け情報：
            </h2>
            <div className="space-y-2">
              <div className="text-xs text-red-600 dark:text-red-400 font-mono break-all">
                {error.message}
              </div>
              {error.digest && (
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Error Digest: {error.digest}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={reset}
            variant="primary"
            size="lg"
            className="sm:min-w-[160px]"
          >
            もう一度試す
          </Button>
          <Button
            onClick={() => window.location.href = '/'}
            variant="secondary"
            size="lg"
            className="sm:min-w-[160px]"
          >
            ホームに戻る
          </Button>
        </div>

        {/* Help Text */}
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            問題が継続する場合は、以下をお試しください：
          </p>
          <ul className="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <li className="flex items-center justify-center gap-2">
              <span className="inline-block w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
              ブラウザのキャッシュをクリアする
            </li>
            <li className="flex items-center justify-center gap-2">
              <span className="inline-block w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
              記事のテキストが長すぎないか確認する（最大30,000文字）
            </li>
            <li className="flex items-center justify-center gap-2">
              <span className="inline-block w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
              しばらく時間をおいて再度お試しください
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
