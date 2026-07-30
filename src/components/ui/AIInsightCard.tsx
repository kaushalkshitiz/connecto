'use client';

// =============================================================================
// AI Athlete Growth Platform
// AIInsightCard — Distinct intelligent card design for AI physiological recommendations
// =============================================================================

import React, { useState } from 'react';
import { AIInsight } from '../../types';
import {
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Zap,
} from 'lucide-react';

interface AIInsightCardProps {
  insight: AIInsight;
  onActionSelect?: (actionLabel: string) => void;
}

export function AIInsightCard({ insight, onActionSelect }: AIInsightCardProps) {
  const [appliedActions, setAppliedActions] = useState<string[]>([]);

  const handleApplyAction = (actionLabel: string) => {
    if (!appliedActions.includes(actionLabel)) {
      setAppliedActions((prev) => [...prev, actionLabel]);
      if (onActionSelect) {
        onActionSelect(actionLabel);
      }
    }
  };

  const priorityStyles = {
    High: 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/80 dark:text-rose-300 dark:border-rose-800',
    Medium:
      'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-800',
    Low: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-800',
  }[insight.priority];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-900 via-slate-900 to-slate-950 p-6 text-white shadow-xl transition-all hover:shadow-2xl dark:border-emerald-500/30 dark:from-slate-900 dark:via-slate-950 dark:to-slate-950">
      {/* Accent border bar on left side */}
      <div className="absolute bottom-0 left-0 top-0 w-1.5 bg-gradient-to-b from-emerald-400 to-teal-500" />

      {/* Top Header Row: Intelligent Badge + Confidence Meter + Priority */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-400/40">
            <Sparkles size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-300">
                AI Growth Intelligence
              </span>
              <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-slate-300">
                Rule &amp; Trend Verified
              </span>
            </div>
            <h4 className="mt-0.5 text-base font-bold text-white">
              {insight.title}
            </h4>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Confidence Score */}
          <div className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-200">
            <Zap size={14} className="text-emerald-400" />
            <span>{insight.confidence}% Confidence</span>
          </div>

          {/* Priority Badge */}
          <span
            className={`rounded-xl border px-3 py-1 text-xs font-bold uppercase tracking-wider ${priorityStyles}`}
          >
            {insight.priority} Priority
          </span>
        </div>
      </div>

      {/* Main Intelligent Content: The AI Reasoning & Explanation */}
      <div className="mt-4">
        <p className="text-sm leading-relaxed text-slate-200">
          &ldquo;{insight.description}&rdquo;
        </p>

        {/* Diagnostic Metadata Footer (computed from real check-in data) */}
        {insight.metrics && insight.metrics.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-400">
            {insight.metrics.map((metric, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                {metric.trend === 'down' ? (
                  <TrendingDown size={14} className="text-rose-400" />
                ) : metric.trend === 'up' ? (
                  <TrendingUp size={14} className="text-amber-400" />
                ) : (
                  <HelpCircle size={14} className="text-emerald-400" />
                )}
                <span>{metric.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Suggested Actions Block */}
      <div className="mt-5 border-t border-white/10 pt-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
            AI Recommended Actions (Click to Apply)
          </span>
          <span className="text-[11px] text-slate-400">
            {appliedActions.length} of {insight.suggested_actions.length} action(s) applied
          </span>
        </div>

        <div className="mt-2.5 flex flex-wrap gap-2.5">
          {insight.suggested_actions.map((action, idx) => {
            const isApplied = appliedActions.includes(action.label);

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplyAction(action.label)}
                disabled={isApplied}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                  isApplied
                    ? 'border border-emerald-500/50 bg-emerald-950/80 text-emerald-300 shadow-inner'
                    : 'border border-white/20 bg-white/10 text-white hover:border-emerald-400 hover:bg-emerald-600/30 hover:text-emerald-200'
                }`}
              >
                {isApplied ? (
                  <>
                    <CheckCircle2 size={15} className="text-emerald-400" />
                    <span>Applied: {action.label}</span>
                  </>
                ) : (
                  <>
                    <span>{action.label}</span>
                    <ArrowRight size={14} />
                  </>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
