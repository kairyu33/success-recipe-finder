/**
 * Analysis Results Component
 *
 * @description Main component that orchestrates tab-based display of analysis results
 * Manages tab state and renders appropriate content with error boundaries
 *
 * @example
 * ```tsx
 * <AnalysisResults data={analysisData} />
 * ```
 */

'use client';

import { useState, useCallback } from 'react';
import { Card } from '@/app/components/ui/Card/Card';
import { Tab, TabsContainer, TabPanel } from '@/app/components/ui/Tabs/Tabs';
import { ErrorBoundary } from '@/app/components/ui/ErrorBoundary/ErrorBoundary';
import { TitlesTab } from './TitlesTab';
import { InsightsTab } from './InsightsTab';
import { EyeCatchTab } from './EyeCatchTab';
import { HashtagsTab } from './HashtagsTab';
import { SeriesTab } from './SeriesTab';
import { AnalysisResultsProps } from './AnalysisResults.types';
import { TabId } from '@/app/types/ui';
import { TAB_TEXT } from '@/app/constants/text.constants';
import { exportAnalysisToText, downloadTextFile } from '@/app/utils/exportToText';
import { toast } from 'sonner';

/**
 * Main analysis results component with tabbed interface
 * Enhanced with error boundaries and debounced tab switching
 */
export function AnalysisResults({ data }: AnalysisResultsProps) {
  const [activeTab, setActiveTab] = useState<TabId>('titles');
  const [isChanging, setIsChanging] = useState(false);

  // Debounced tab change to prevent rapid clicking errors
  const handleTabChange = useCallback((tabId: TabId) => {
    if (isChanging) return;
    setIsChanging(true);
    setActiveTab(tabId);
    setTimeout(() => setIsChanging(false), 100);
  }, [isChanging]);

  // Download analysis results as text file
  const handleDownload = useCallback(() => {
    try {
      const textContent = exportAnalysisToText(data);
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      const filename = `note分析結果_${timestamp}.txt`;
      downloadTextFile(textContent, filename);
      toast.success('分析結果をダウンロードしました');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('ダウンロードに失敗しました');
    }
  }, [data]);

  const tabs = [
    {
      id: 'titles' as TabId,
      label: TAB_TEXT.titles,
      icon: '📝',
    },
    {
      id: 'insights' as TabId,
      label: TAB_TEXT.insights,
      icon: '💡',
    },
    {
      id: 'image' as TabId,
      label: TAB_TEXT.image,
      icon: '🖼️',
    },
    {
      id: 'hashtags' as TabId,
      label: TAB_TEXT.hashtags,
      icon: '#️⃣',
    },
    {
      id: 'series' as TabId,
      label: TAB_TEXT.series,
      icon: '📚',
    },
  ];

  // Null check for data
  if (!data) {
    return (
      <Card className="overflow-hidden p-8">
        <div className="text-center py-16">
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            分析データがありません
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      {/* Download Button */}
      <div className="px-6 pt-4 pb-2 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          テキスト形式でダウンロード
        </button>
      </div>

      <TabsContainer>
        {tabs.map((tab) => (
          <Tab
            key={tab.id}
            id={tab.id}
            label={tab.label}
            icon={tab.icon}
            isActive={activeTab === tab.id}
            onClick={() => handleTabChange(tab.id)}
          />
        ))}
      </TabsContainer>

      <ErrorBoundary>
        <TabPanel id="titles" isActive={activeTab === 'titles'}>
          {data && <TitlesTab data={data} />}
        </TabPanel>
      </ErrorBoundary>

      <ErrorBoundary>
        <TabPanel id="insights" isActive={activeTab === 'insights'}>
          {data && <InsightsTab data={data} />}
        </TabPanel>
      </ErrorBoundary>

      <ErrorBoundary>
        <TabPanel id="image" isActive={activeTab === 'image'}>
          {data && <EyeCatchTab data={data} />}
        </TabPanel>
      </ErrorBoundary>

      <ErrorBoundary>
        <TabPanel id="hashtags" isActive={activeTab === 'hashtags'}>
          {data && <HashtagsTab data={data} />}
        </TabPanel>
      </ErrorBoundary>

      <ErrorBoundary>
        <TabPanel id="series" isActive={activeTab === 'series'}>
          {data && <SeriesTab data={data} />}
        </TabPanel>
      </ErrorBoundary>
    </Card>
  );
}
