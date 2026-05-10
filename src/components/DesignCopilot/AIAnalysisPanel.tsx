"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface Suggestion {
  issue: string;
  severity: "info" | "warning" | "critical";
  suggestion: string;
  affected_component: string;
}

interface AnalysisData {
  overall_score: number;
  proportions_ok: boolean;
  design_character: string;
  estimated_category: string;
  suggestions: Suggestion[];
}

interface AIAnalysisPanelProps {
  analysis: AnalysisData | null;
  isLoading: boolean;
  onRetry?: () => void;
  className?: string;
}

const severityConfig = {
  info: {
    icon: "ℹ️",
    bgClass: "bg-cyan-900/30",
    borderClass: "border-cyan-500/30",
    textClass: "text-cyan-300",
    pillClass: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  },
  warning: {
    icon: "⚠️",
    bgClass: "bg-yellow-900/30",
    borderClass: "border-yellow-500/30",
    textClass: "text-yellow-300",
    pillClass: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  },
  critical: {
    icon: "❌",
    bgClass: "bg-red-900/30",
    borderClass: "border-red-500/30",
    textClass: "text-red-300",
    pillClass: "bg-red-500/20 text-red-300 border-red-500/30",
  },
};

function CircularProgress({
  score,
  size = 120,
  strokeWidth = 8,
}: {
  score: number;
  size?: number;
  strokeWidth?: number;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const [displayedScore, setDisplayedScore] = useState(0);

  useEffect(() => {
    let start: number;
    const duration = 1500;
    const startScore = displayedScore;
    const endScore = score;

    const animate = (timestamp: number) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setDisplayedScore(Math.round(startScore + (endScore - startScore) * easeOut));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [score]);

  const getScoreColor = (value: number): string => {
    if (value >= 80) return "#22d3ee"; // cyan-400
    if (value >= 60) return "#06b6d4"; // cyan-500
    if (value >= 40) return "#f08a3c"; // ember
    if (value >= 20) return "#fbbf24"; // yellow
    return "#ef4444"; // red
  };

  const strokeColor = getScoreColor(displayedScore);
  const dashoffset = circumference - (displayedScore / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashoffset}
          style={{
            transition: "none",
            filter: `drop-shadow(0 0 8px ${strokeColor})`,
          }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
          {displayedScore}
        </span>
        <span className="text-xs text-white/60">/100</span>
      </div>
    </div>
  );
}

function SuggestionCard({
  suggestion,
  isExpanded,
  onToggle,
  index,
}: {
  suggestion: Suggestion;
  isExpanded: boolean;
  onToggle: () => void;
  index: number;
}) {
  const config = severityConfig[suggestion.severity];

  return (
    <div
      data-testid={`suggestion-card-${index}`}
      className={`${config.bgClass} border ${config.borderClass} rounded-lg overflow-hidden transition-all duration-300 hover:border-opacity-60 cursor-pointer`}
      onClick={onToggle}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <span className="text-xl">{config.icon}</span>
          <div className="flex-1 min-w-0">
            <h4 className={`font-semibold ${config.textClass} truncate`}>
              {suggestion.issue}
            </h4>
          </div>
          <div className={`px-2 py-0.5 text-xs rounded-full border ${config.pillClass} shrink-0`}>
            {suggestion.affected_component}
          </div>
        </div>
        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-white/10">
            <p className="text-sm text-white/70 leading-relaxed">{suggestion.suggestion}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function SkeletonLoader() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-white/5 rounded-lg p-4 animate-pulse"
          style={{ animationDelay: `${i * 200}ms` }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-6 h-6 bg-white/10 rounded-full"></div>
            <div className="flex-1 h-4 bg-white/10 rounded"></div>
          </div>
          <div className="space-y-2 ml-9">
            <div className="h-3 bg-white/10 rounded w-3/4"></div>
            <div className="h-3 bg-white/10 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function AIAnalysisPanel({
  analysis,
  isLoading,
  onRetry,
  className = "",
}: AIAnalysisPanelProps) {
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
  const listRef = useRef<HTMLDivElement>(null);

  const toggleExpanded = useCallback((index: number) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }, []);

  // Auto-scroll to first critical suggestion
  useEffect(() => {
    if (analysis?.suggestions && !isLoading) {
      const firstCriticalIndex = analysis.suggestions.findIndex(
        (s) => s.severity === "critical"
      );
      if (firstCriticalIndex !== -1 && listRef.current) {
        const criticalCard = listRef.current.children[firstCriticalIndex] as HTMLElement;
        if (criticalCard) {
          setTimeout(() => {
            criticalCard.scrollIntoView({ behavior: "smooth", block: "center" });
          }, 300);
        }
      }
    }
  }, [analysis, isLoading]);

  // Loading state
  if (isLoading) {
    return (
      <div
        data-testid="ai-analysis-panel-loading"
        className={`bg-[#111318] border border-white/10 rounded-xl p-6 ${className}`}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center animate-pulse">
            <span className="text-lg">🤖</span>
          </div>
          <h3 className="text-lg font-display font-semibold text-white">
            AI Design Review
          </h3>
        </div>
        <SkeletonLoader />
      </div>
    );
  }

  // Error state - analysis is null and we have a retry callback (indicating an error occurred)
  if (!analysis && !isLoading && onRetry) {
    return (
      <div
        data-testid="ai-analysis-panel-error"
        className={`bg-[#111318] border border-white/10 rounded-xl p-6 ${className}`}
      >
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
            <span className="text-3xl">⚠️</span>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">
            AI temporarily unavailable
          </h3>
          <p className="text-white/60 mb-4">
            Unable to connect to design analysis service
          </p>
          <button
            onClick={onRetry}
            className="px-6 py-2 bg-cyan-500/20 text-cyan-300 rounded-lg border border-cyan-500/30 hover:bg-cyan-500/30 transition-all"
            data-testid="ai-analysis-retry-button"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  // Empty state - no analysis data
  if (!analysis) {
    return (
      <div
        data-testid="ai-analysis-panel-empty"
        className={`bg-[#111318] border border-white/10 rounded-xl p-6 ${className}`}
      >
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-cyan-500/10 rounded-full flex items-center justify-center border border-cyan-500/20">
            <span className="text-3xl">🎨</span>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">
            Make a sketch to get AI feedback
          </h3>
          <p className="text-white/60">
            Draw or upload a design to receive AI-powered analysis
          </p>
        </div>
      </div>
    );
  }

  // Normal populated state
  const criticalCount = analysis.suggestions.filter((s) => s.severity === "critical").length;
  const warningCount = analysis.suggestions.filter((s) => s.severity === "warning").length;

  return (
    <div data-testid="ai-analysis-panel" className={`bg-[#111318] border border-white/10 rounded-xl p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-lg flex items-center justify-center border border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
          <span className="text-xl">🧠</span>
        </div>
        <div>
          <h3 className="text-lg font-display font-semibold text-white">
            AI Design Review
          </h3>
          <p className="text-xs text-white/50">
            {analysis.estimated_category} • {analysis.design_character}
          </p>
        </div>
      </div>

      {/* Score Circle and Badge */}
      <div className="flex items-center gap-6 mb-8">
        <CircularProgress score={analysis.overall_score} size={120} strokeWidth={10} />
        <div className="flex-1">
          <div className="mb-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
              {analysis.design_character}
            </span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/60">Proportions</span>
              <span className={analysis.proportions_ok ? "text-green-400" : "text-red-400"}>
                {analysis.proportions_ok ? "✓ Balanced" : "✗ Needs work"}
              </span>
            </div>
            {analysis.suggestions.length > 0 && (
              <>
                {criticalCount > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/60">Critical issues</span>
                    <span className="text-red-400 font-semibold">{criticalCount}</span>
                  </div>
                )}
                {warningCount > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/60">Warnings</span>
                    <span className="text-yellow-400 font-semibold">{warningCount}</span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Suggestions List */}
      <div data-testid="suggestions-list" ref={listRef} className="space-y-3">
        <h4 className="text-sm font-semibold text-white/80 mb-3">
          Design Suggestions
          {analysis.suggestions.length > 0 && (
            <span className="ml-2 text-white/40 font-normal">
              ({analysis.suggestions.length})
            </span>
          )}
        </h4>
        {analysis.suggestions.length === 0 ? (
          <div className="text-center py-8 text-white/40">
            <p>No suggestions — great design! 🎉</p>
          </div>
        ) : (
          analysis.suggestions.map((suggestion, index) => (
            <SuggestionCard
              key={index}
              suggestion={suggestion}
              isExpanded={expandedItems.has(index)}
              onToggle={() => toggleExpanded(index)}
              index={index}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default AIAnalysisPanel;
