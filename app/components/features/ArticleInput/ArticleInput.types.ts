/**
 * Article Input Component Types
 *
 * @description Type definitions for ArticleInput component
 */

export interface ArticleInputProps {
  value: string;
  onChange: (value: string) => void;
  onAnalyze: () => void;
  loading?: boolean;
  error?: string;
  onClearError?: () => void;
}
