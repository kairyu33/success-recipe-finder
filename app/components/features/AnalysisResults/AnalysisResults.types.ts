/**
 * Analysis Results Component Types
 *
 * @description Type definitions for AnalysisResults components
 */

export interface AnalysisData {
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
  emotionalAnalysis?: any;
  monetization?: any;
  readingTime?: any;
  rewriteSuggestions?: any;
  seriesIdeas?: Array<{
    title: string;
    description: string;
    targetAudience: string;
  }>;
  viralityScore?: any;
  seoAnalysis?: any;
}

export interface AnalysisResultsProps {
  data: AnalysisData;
}

export interface TabContentProps {
  data: AnalysisData;
  copiedId: string | null;
  onCopy: (text: string, id: string) => void;
}
