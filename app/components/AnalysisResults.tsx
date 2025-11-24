"use client";

import { useState } from "react";
import { ArticleAnalysisResponse } from "../types/article-analysis";

/**
 * Comprehensive article analysis results display component
 *
 * @description Displays all analysis outputs in an organized, visually appealing layout
 * with copy-to-clipboard functionality for each section
 *
 * @param analysis - Complete analysis data from Claude AI
 * @returns JSX element with tabbed interface for all analysis sections
 */
interface AnalysisResultsProps {
  analysis: ArticleAnalysisResponse;
}

type TabType = "hashtags" | "titles" | "learning" | "benefits" | "audience" | "summary" | "eyecatch";

export default function AnalysisResults({ analysis }: AnalysisResultsProps) {
  const [activeTab, setActiveTab] = useState<TabType>("hashtags");
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  /**
   * Copy text to clipboard with visual feedback
   */
  const copyToClipboard = async (text: string, itemId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItem(itemId);
      setTimeout(() => setCopiedItem(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  /**
   * Tab button component
   */
  const TabButton = ({ id, label, icon }: { id: TabType; label: string; icon: string }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
        activeTab === id
          ? "bg-blue-600 text-white shadow-md"
          : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
      }`}
    >
      <span>{icon}</span>
      <span className="hidden sm:inline">{label}</span>
    </button>
  );

  /**
   * Copy button with success indicator
   */
  const CopyButton = ({ text, itemId, label = "コピー" }: { text: string; itemId: string; label?: string }) => (
    <button
      onClick={() => copyToClipboard(text, itemId)}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
        copiedItem === itemId
          ? "bg-green-600 text-white"
          : "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800"
      }`}
    >
      {copiedItem === itemId ? (
        <>
          <svg className="h-4 w-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M5 13l4 4L19 7" />
          </svg>
          コピー済み
        </>
      ) : (
        <>
          <svg className="h-4 w-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          {label}
        </>
      )}
    </button>
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8">
      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
        <TabButton id="hashtags" label="ハッシュタグ" icon="#" />
        <TabButton id="titles" label="タイトル案" icon="📝" />
        <TabButton id="learning" label="学べること" icon="🎓" />
        <TabButton id="benefits" label="メリット" icon="✨" />
        <TabButton id="audience" label="読者層" icon="👥" />
        <TabButton id="summary" label="要約" icon="📄" />
        <TabButton id="eyecatch" label="アイキャッチ" icon="🎨" />
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {/* Hashtags Tab */}
        {activeTab === "hashtags" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                生成されたハッシュタグ（{analysis.hashtags.length}個）
              </h3>
              <CopyButton text={analysis.hashtags.join(" ")} itemId="all-hashtags" label="すべてコピー" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
              {analysis.hashtags.map((hashtag, index) => (
                <div
                  key={index}
                  onClick={() => copyToClipboard(hashtag, `hashtag-${index}`)}
                  className="group relative bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 rounded-lg p-3 border border-blue-100 dark:border-gray-600 hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-blue-700 dark:text-blue-300 font-medium text-sm truncate">
                      {hashtag}
                    </span>
                    {copiedItem === `hashtag-${index}` ? (
                      <svg className="h-4 w-4 text-green-600 flex-shrink-0" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="h-4 w-4 text-gray-400 group-hover:text-blue-600 flex-shrink-0 transition-colors" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Titles Tab */}
        {activeTab === "titles" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                タイトル提案
              </h3>
            </div>
            <div className="space-y-3">
              {analysis.suggestedTitles.map((title, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-700 dark:to-gray-600 rounded-lg p-4 border border-purple-100 dark:border-gray-600"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded">
                          案{index + 1}
                        </span>
                      </div>
                      <p className="text-gray-800 dark:text-gray-200 font-medium leading-relaxed">
                        {title}
                      </p>
                    </div>
                    <CopyButton text={title} itemId={`title-${index}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Learning Tab */}
        {activeTab === "learning" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                この記事で学べること
              </h3>
            </div>
            <div className="space-y-3">
              {analysis.whatYouWillLearn.map((item, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-700 dark:to-gray-600 rounded-lg p-4 border border-green-100 dark:border-gray-600"
                >
                  <div className="flex items-start gap-3">
                    <span className="bg-green-600 text-white text-sm font-bold px-2.5 py-1 rounded-full flex-shrink-0">
                      {index + 1}
                    </span>
                    <p className="text-gray-800 dark:text-gray-200 flex-1 leading-relaxed">
                      {item}
                    </p>
                    <CopyButton text={item} itemId={`learn-${index}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Benefits Tab */}
        {activeTab === "benefits" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                読むことで得られるメリット
              </h3>
            </div>
            <div className="space-y-3">
              {analysis.benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-gray-700 dark:to-gray-600 rounded-lg p-4 border border-yellow-100 dark:border-gray-600"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl flex-shrink-0">✨</span>
                    <p className="text-gray-800 dark:text-gray-200 flex-1 leading-relaxed">
                      {benefit}
                    </p>
                    <CopyButton text={benefit} itemId={`benefit-${index}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Target Audience Tab */}
        {activeTab === "audience" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                おすすめの読者層
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {analysis.targetAudience.map((audience, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-gray-700 dark:to-gray-600 rounded-lg p-4 border border-cyan-100 dark:border-gray-600"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl flex-shrink-0">👤</span>
                    <div className="flex-1">
                      <p className="text-gray-800 dark:text-gray-200 font-medium leading-relaxed">
                        {audience}
                      </p>
                    </div>
                    <CopyButton text={audience} itemId={`audience-${index}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Summary Tab */}
        {activeTab === "summary" && (
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  1行要約
                </h3>
                <CopyButton text={analysis.oneLineSummary} itemId="one-line" />
              </div>
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-lg p-6 border border-indigo-100 dark:border-gray-600">
                <p className="text-lg text-gray-800 dark:text-gray-200 font-medium leading-relaxed">
                  {analysis.oneLineSummary}
                </p>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  アイキャッチ用要約（100文字）
                </h3>
                <CopyButton text={analysis.summary} itemId="summary" />
              </div>
              <div className="bg-gradient-to-r from-pink-50 to-rose-50 dark:from-gray-700 dark:to-gray-600 rounded-lg p-6 border border-pink-100 dark:border-gray-600">
                <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
                  {analysis.summary}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  {analysis.summary.length} 文字
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Eye-catch Tab */}
        {activeTab === "eyecatch" && (
          <div className="space-y-6">
            {/* Image Prompt */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  画像生成プロンプト（英語）
                </h3>
                <CopyButton text={analysis.eyeCatch.imagePrompt} itemId="image-prompt" />
              </div>
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-lg p-6 border border-gray-200 dark:border-gray-600">
                <p className="text-gray-800 dark:text-gray-200 leading-relaxed font-mono text-sm">
                  {analysis.eyeCatch.imagePrompt}
                </p>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                DALL-E、Midjourney、Stable Diffusion等で使用できます
              </p>
            </div>

            {/* Composition Ideas */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                構図アイデア
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {analysis.eyeCatch.compositionIdeas.map((idea, index) => (
                  <div
                    key={index}
                    onClick={() => copyToClipboard(idea, `composition-${index}`)}
                    className="bg-purple-50 dark:bg-gray-700 rounded-lg p-4 border border-purple-100 dark:border-gray-600 cursor-pointer hover:shadow-md transition-all"
                  >
                    <p className="text-gray-800 dark:text-gray-200 text-center font-medium">
                      {idea}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Color Palette */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                カラーパレット
              </h3>
              <div className="flex flex-wrap gap-3">
                {analysis.eyeCatch.colors.map((color, index) => (
                  <div
                    key={index}
                    onClick={() => copyToClipboard(color, `color-${index}`)}
                    className="group cursor-pointer"
                  >
                    <div
                      className="w-20 h-20 rounded-lg shadow-md hover:shadow-xl transition-all border-2 border-gray-200 dark:border-gray-600"
                      style={{ backgroundColor: color }}
                    />
                    <p className="text-xs text-center mt-2 text-gray-600 dark:text-gray-400 font-mono">
                      {color}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Mood */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                イメージの雰囲気
              </h3>
              <div className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-gray-700 dark:to-gray-600 rounded-lg p-6 border border-amber-100 dark:border-gray-600 text-center">
                <p className="text-xl text-gray-800 dark:text-gray-200 font-semibold">
                  {analysis.eyeCatch.mood}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
