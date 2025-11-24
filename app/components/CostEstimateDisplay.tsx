/**
 * Cost Estimate Display Component
 *
 * @description Shows estimated API cost to users before they submit
 * Helps users understand the cost implications of their requests
 */

"use client";

import { useEffect, useState } from "react";
import { estimateAnalysisCost, formatCost } from "@/app/utils/cost-estimator";

interface CostEstimateDisplayProps {
  articleText: string;
  className?: string;
}

export function CostEstimateDisplay({ articleText, className = "" }: CostEstimateDisplayProps) {
  const [estimate, setEstimate] = useState<{
    inputTokens: number;
    outputTokens: number;
    total: number;
  } | null>(null);

  useEffect(() => {
    if (articleText.trim().length === 0) {
      setEstimate(null);
      return;
    }

    // Calculate estimate with a small delay to avoid excessive calculations
    const timer = setTimeout(() => {
      const est = estimateAnalysisCost(articleText);
      setEstimate(est);
    }, 300);

    return () => clearTimeout(timer);
  }, [articleText]);

  if (!estimate || articleText.trim().length === 0) {
    return null;
  }

  // Color code based on cost
  const getCostColor = (cost: number) => {
    if (cost < 0.01) return "text-green-600 dark:text-green-400";
    if (cost < 0.03) return "text-blue-600 dark:text-blue-400";
    if (cost < 0.05) return "text-yellow-600 dark:text-yellow-400";
    return "text-orange-600 dark:text-orange-400";
  };

  const costColor = getCostColor(estimate.total);

  return (
    <div className={`flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 ${className}`}>
      <div className="flex-shrink-0">
        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Estimated cost:
          </span>
          <span className={`text-lg font-bold ${costColor}`}>
            {formatCost(estimate.total)}
          </span>
        </div>
        <div className="flex items-center gap-4 mt-1">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            ~{estimate.inputTokens.toLocaleString()} input + {estimate.outputTokens.toLocaleString()} output tokens
          </span>
        </div>
      </div>
      <div className="flex-shrink-0">
        <div className="text-xs text-gray-500 dark:text-gray-400 text-right">
          <div className="font-medium">Claude Sonnet 4.5</div>
          <div className="mt-0.5">
            <span className="text-green-600 dark:text-green-400">$3</span>/M input
            <span className="mx-1">·</span>
            <span className="text-blue-600 dark:text-blue-400">$15</span>/M output
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Simple cost info tooltip component
 */
export function CostInfoTooltip() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        aria-label="Cost information"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 w-64 p-3 mt-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg -left-28">
          <div className="font-semibold text-gray-900 dark:text-white mb-2">
            About API Costs
          </div>
          <div className="space-y-2 text-gray-600 dark:text-gray-400 text-xs">
            <p>
              <strong>Typical cost:</strong> $0.025-$0.040 per analysis
            </p>
            <p>
              <strong>What affects cost:</strong>
            </p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Article length (longer = more input tokens)</li>
              <li>Response detail (more content = more output tokens)</li>
            </ul>
            <p className="pt-2 border-t border-gray-200 dark:border-gray-700">
              <strong>Cost optimizations:</strong> Caching, deduplication, and rate limiting are enabled to minimize costs.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
