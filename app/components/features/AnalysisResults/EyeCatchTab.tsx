/**
 * Eye-Catch Tab Component - Premium Design
 *
 * @description Enhanced eye-catch image generation ideas with glassmorphism and gradient effects
 */

'use client';

import { CopyButton } from '@/app/components/ui/CopyButton/CopyButton';
import { SECTION_HEADERS, EMPTY_STATE_MESSAGES } from '@/app/constants/text.constants';
import { TabContentProps } from './AnalysisResults.types';
import { COLORS } from '@/app/constants/ui.constants';

export function EyeCatchTab({ data }: Pick<TabContentProps, 'data'>) {
  const eyeCatch = data.eyeCatchImage;

  if (!eyeCatch) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          {EMPTY_STATE_MESSAGES.noImage}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold gradient-text">
          {SECTION_HEADERS.image.main}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          AI画像生成プロンプトとデザインアイデア
        </p>
      </div>

      {/* Summary */}
      {eyeCatch.summary && (
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl p-6 border border-indigo-200 dark:border-indigo-800 animate-scale-in">
          <h3 className="text-sm font-semibold text-indigo-700 dark:text-indigo-300 mb-3">
            {SECTION_HEADERS.image.summary}
          </h3>
          <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
            {eyeCatch.summary}
          </p>
        </div>
      )}

      {/* Main Prompt */}
      {eyeCatch.mainPrompt && (
        <div className="group relative">
          {/* Background glow effect */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl opacity-0 group-hover:opacity-10 blur transition duration-300" />

          {/* Card content */}
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {SECTION_HEADERS.image.prompt}
              </h3>
              <CopyButton text={eyeCatch.mainPrompt} itemId="main-prompt" />
            </div>
            <div className="bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20 p-5 rounded-xl">
              <p className="text-gray-800 dark:text-gray-200 leading-relaxed font-mono text-sm">
                {eyeCatch.mainPrompt}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Details Grid */}
      <div className="grid md:grid-cols-2 gap-6 stagger-children">
        {/* Composition Ideas */}
        {eyeCatch.compositionIdeas && eyeCatch.compositionIdeas.length > 0 && (
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-2xl p-6 border border-indigo-200 dark:border-indigo-800">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
              {SECTION_HEADERS.image.composition}
            </h3>
            <div className="flex flex-wrap gap-2">
              {eyeCatch.compositionIdeas.map((idea, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium bg-white dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-700 hover:shadow-md transition-shadow"
                >
                  {idea}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Color Palette */}
        {eyeCatch.colorPalette && eyeCatch.colorPalette.length > 0 && (
          <div className="bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 rounded-2xl p-6 border border-pink-200 dark:border-pink-800">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
              {SECTION_HEADERS.image.colorPalette}
            </h3>
            <div className="flex flex-wrap gap-2">
              {eyeCatch.colorPalette.map((color, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium bg-white dark:bg-pink-900/40 text-pink-700 dark:text-pink-300 border border-pink-300 dark:border-pink-700 hover:shadow-md transition-shadow"
                >
                  {color}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mood and Style */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Mood */}
        {eyeCatch.mood && (
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl p-6 border border-amber-200 dark:border-amber-800">
            <h3 className="text-sm font-semibold text-amber-700 dark:text-amber-300 mb-3">
              {SECTION_HEADERS.image.mood}
            </h3>
            <p className="text-gray-800 dark:text-gray-200 text-base font-medium">
              {eyeCatch.mood}
            </p>
          </div>
        )}

        {/* Style */}
        {eyeCatch.style && (
          <div className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-2xl p-6 border border-teal-200 dark:border-teal-800">
            <h3 className="text-sm font-semibold text-teal-700 dark:text-teal-300 mb-3">
              {SECTION_HEADERS.image.style}
            </h3>
            <p className="text-gray-800 dark:text-gray-200 text-base font-medium">
              {eyeCatch.style}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
