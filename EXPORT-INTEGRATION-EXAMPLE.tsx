/**
 * Export Feature Integration Example
 *
 * @description Complete example showing how to integrate export functionality
 * into the main application page
 */

'use client';

import { useState } from 'react';
import { ExportButton, ExportModal } from '@/app/components/features/Export';
import { useExport } from '@/app/hooks';
import { FullAnalysisResult } from '@/app/services/analysis/types';
import { ExportFormat, ExportOptions } from '@/app/services/export/types';

/**
 * Example 1: Simple Export Button Integration
 *
 * Add export button next to your analysis results
 */
export function SimpleExportExample() {
  const [analysisData, setAnalysisData] = useState<FullAnalysisResult | null>(null);
  const { downloadExport, isExporting } = useExport({
    onSuccess: (result) => {
      alert(`Export successful: ${result.filename}`);
    },
    onError: (error) => {
      alert(`Export failed: ${error.message}`);
    },
  });

  const handleExport = (format: ExportFormat) => {
    if (!analysisData) return;

    downloadExport(analysisData, {
      format,
      includeMetadata: true,
      includeStats: false,
    });
  };

  return (
    <div className="space-y-4">
      {/* Your analysis results display */}
      {analysisData && (
        <div className="analysis-results">
          {/* Display results here */}
        </div>
      )}

      {/* Export button */}
      {analysisData && (
        <div className="flex justify-end">
          <ExportButton onExport={handleExport} isExporting={isExporting} />
        </div>
      )}
    </div>
  );
}

/**
 * Example 2: Export with Preview Modal
 *
 * Show preview before exporting
 */
export function ModalExportExample() {
  const [analysisData, setAnalysisData] = useState<FullAnalysisResult | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('markdown');
  const [previewContent, setPreviewContent] = useState('');

  const { downloadExport, generatePreview, isExporting } = useExport({
    onSuccess: (result) => {
      console.log('Export successful:', result);
    },
  });

  const handleExportClick = (format: ExportFormat) => {
    if (!analysisData) return;

    setSelectedFormat(format);
    const preview = generatePreview(analysisData, format);
    setPreviewContent(preview);
    setShowModal(true);
  };

  const handleExportConfirm = (options: ExportOptions) => {
    if (!analysisData) return;

    downloadExport(analysisData, options);
    setShowModal(false);
  };

  return (
    <>
      <div className="space-y-4">
        {/* Analysis results */}
        {analysisData && <div className="results">{/* Results display */}</div>}

        {/* Export button */}
        {analysisData && (
          <ExportButton onExport={handleExportClick} isExporting={isExporting} />
        )}
      </div>

      {/* Export modal */}
      {analysisData && (
        <ExportModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onExport={handleExportConfirm}
          previewContent={previewContent}
          format={selectedFormat}
        />
      )}
    </>
  );
}

/**
 * Example 3: Multiple Export Options
 *
 * Provide quick export buttons for common formats
 */
export function MultipleExportExample() {
  const [analysisData, setAnalysisData] = useState<FullAnalysisResult | null>(null);
  const { downloadExport, copyExport, isExporting } = useExport();

  const handleQuickExport = async (format: ExportFormat, copy = false) => {
    if (!analysisData) return;

    if (copy) {
      await copyExport(analysisData, {
        format,
        includeMetadata: false,
      });
      alert('Copied to clipboard!');
    } else {
      downloadExport(analysisData, {
        format,
        includeMetadata: true,
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Results display */}
      {analysisData && <div className="results">{/* Display results */}</div>}

      {/* Quick export buttons */}
      {analysisData && (
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => handleQuickExport('markdown')}
            disabled={isExporting}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            📄 Download Markdown
          </button>

          <button
            onClick={() => handleQuickExport('json')}
            disabled={isExporting}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            💾 Download JSON
          </button>

          <button
            onClick={() => handleQuickExport('html')}
            disabled={isExporting}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            🌐 Download HTML
          </button>

          <button
            onClick={() => handleQuickExport('markdown', true)}
            disabled={isExporting}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            📋 Copy Markdown
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * Example 4: Complete Page Integration
 *
 * Full page with analysis and export
 */
export function CompletePage() {
  const [articleText, setArticleText] = useState('');
  const [analysisData, setAnalysisData] = useState<FullAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState<ExportFormat>('markdown');
  const [previewContent, setPreviewContent] = useState('');

  const { downloadExport, generatePreview, isExporting } = useExport({
    onSuccess: (result) => {
      // Show success toast
      console.log('Export successful:', result.filename);
    },
    onError: (error) => {
      // Show error toast
      console.error('Export failed:', error);
    },
  });

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/analyze-article-full', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleText }),
      });

      const data = await response.json();
      setAnalysisData(data);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleExportClick = (format: ExportFormat) => {
    if (!analysisData) return;

    setExportFormat(format);
    const preview = generatePreview(analysisData, format);
    setPreviewContent(preview);
    setShowExportModal(true);
  };

  const handleExportConfirm = (options: ExportOptions) => {
    if (!analysisData) return;

    downloadExport(analysisData, options);
    setShowExportModal(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <header className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          note.com AI Hashtag Generator
        </h1>
        <p className="text-gray-600">
          記事を分析してハッシュタグとタイトルを自動生成
        </p>
      </header>

      {/* Input Section */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          記事テキストを入力
        </label>
        <textarea
          value={articleText}
          onChange={(e) => setArticleText(e.target.value)}
          placeholder="ここに記事を貼り付けてください..."
          className="w-full h-40 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing || !articleText}
          className="mt-4 w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isAnalyzing ? '分析中...' : '分析開始'}
        </button>
      </div>

      {/* Results Section */}
      {analysisData && (
        <div className="space-y-4">
          {/* Export Button */}
          <div className="flex justify-end">
            <ExportButton
              onExport={handleExportClick}
              isExporting={isExporting}
              variant="primary"
            />
          </div>

          {/* Analysis Results Display */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              分析結果
            </h2>

            {/* Titles */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                📝 提案タイトル
              </h3>
              <ul className="space-y-2">
                {analysisData.suggestedTitles.map((title, index) => (
                  <li key={index} className="p-3 bg-gray-50 rounded-lg">
                    {index + 1}. {title}
                  </li>
                ))}
              </ul>
            </div>

            {/* Hashtags */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                #️⃣ ハッシュタグ
              </h3>
              <div className="flex flex-wrap gap-2">
                {analysisData.hashtags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* More sections... */}
          </div>
        </div>
      )}

      {/* Export Modal */}
      {analysisData && (
        <ExportModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          onExport={handleExportConfirm}
          previewContent={previewContent}
          format={exportFormat}
        />
      )}
    </div>
  );
}

/**
 * Example 5: Using with AnalysisResultsWithExport Component
 *
 * Simplest integration - just use the pre-built component
 */
export function SimplestIntegration() {
  const [analysisData, setAnalysisData] = useState<FullAnalysisResult | null>(null);

  return (
    <div>
      {/* Your analysis logic */}

      {/* That's it! Export is automatically integrated */}
      {analysisData && (
        <AnalysisResultsWithExport
          data={{
            suggestedTitles: analysisData.suggestedTitles,
            hashtags: analysisData.hashtags,
            eyeCatchImage: analysisData.eyeCatchImage,
            insights: analysisData.insights,
          }}
          fullData={analysisData}
        />
      )}
    </div>
  );
}

// Import for the simplest integration
import { AnalysisResultsWithExport } from '@/app/components/features/AnalysisResults/AnalysisResultsWithExport';

/**
 * Usage Instructions:
 *
 * 1. Copy the example that matches your needs
 * 2. Replace the placeholder data with your actual analysis data
 * 3. Customize styling and behavior as needed
 * 4. Add toast notifications for better UX (optional)
 *
 * For the simplest integration, use Example 5 (SimplestIntegration)
 */
