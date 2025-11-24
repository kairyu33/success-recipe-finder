/**
 * useAnalysis Hook
 *
 * @description Custom hook for article analysis logic
 * Manages API calls, loading states, and error handling
 *
 * @example
 * ```tsx
 * const { analyze, data, loading, error } = useAnalysis();
 *
 * <button onClick={() => analyze(articleText)}>Analyze</button>
 * ```
 */

'use client';

import { useState, useCallback } from 'react';

interface AnalysisResponse {
  suggestedTitles?: string[];
  insights?: {
    whatYouLearn?: string[];
    benefits?: string[];
    recommendedFor?: string[];
    oneLiner?: string;
  };
  eyeCatchImage?: {
    mainPrompt?: string;
    compositionIdeas?: string[];
    colorPalette?: string[];
    mood?: string;
    style?: string;
    summary?: string;
  };
  hashtags?: string[];
  error?: string;
}

interface LoadingStates {
  titles: boolean;
  insights: boolean;
  image: boolean;
  hashtags: boolean;
}

interface UseAnalysisReturn {
  analyze: (articleText: string) => Promise<void>;
  data: AnalysisResponse | null;
  loading: boolean;
  loadingStates: LoadingStates;
  error: string;
  clearError: () => void;
}

/**
 * Hook for managing article analysis
 *
 * @returns Analysis state and methods
 */
export function useAnalysis(): UseAnalysisReturn {
  const [data, setData] = useState<AnalysisResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingStates, setLoadingStates] = useState<LoadingStates>({
    titles: false,
    insights: false,
    image: false,
    hashtags: false,
  });
  const [error, setError] = useState('');

  const analyze = useCallback(async (articleText: string) => {
    if (!articleText.trim()) {
      setError('記事のテキストを入力してください');
      return;
    }

    setLoading(true);
    setError('');
    setData(null);
    setLoadingStates({
      titles: true,
      insights: true,
      image: true,
      hashtags: true,
    });

    try {
      const response = await fetch('/api/analyze-article-full', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ articleText }),
      });

      const result: AnalysisResponse = await response.json();

      if (!response.ok) {
        throw new Error(result.error || '分析に失敗しました');
      }

      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました');
    } finally {
      setLoading(false);
      setLoadingStates({
        titles: false,
        insights: false,
        image: false,
        hashtags: false,
      });
    }
  }, []);

  const clearError = useCallback(() => {
    setError('');
  }, []);

  return {
    analyze,
    data,
    loading,
    loadingStates,
    error,
    clearError,
  };
}
