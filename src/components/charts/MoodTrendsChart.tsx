'use client';

// =============================================================================
// Athlete Risk Intelligence Platform
// MoodTrendsChart — Recharts Visualization of Daily Mood & Readiness Scores
// =============================================================================

import React from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { CheckIn } from '../../types';
import { Smile } from 'lucide-react';

interface MoodTrendsChartProps {
  checkIns: CheckIn[];
}

export function MoodTrendsChart({ checkIns }: MoodTrendsChartProps) {
  const sorted = [...checkIns]
    .sort((a, b) => (a.date > b.date ? 1 : -1))
    .slice(-14)
    .map((ci) => ({
      date: ci.date.slice(5),
      fullDate: ci.date,
      mood: Number(ci.mood),
    }));

  if (sorted.length === 0) {
    return (
      <div className="flex h-64 w-full items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
        No mood check-in data recorded.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between pb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
            <Smile size={18} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Mood &amp; Energy Trends (1 = Exhausted, 5 = High Energy)
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Positive mood correlates with neuromuscular readiness and training adaptation
            </p>
          </div>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={sorted} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-800" />
            <XAxis
              dataKey="date"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              domain={[1, 5]}
              ticks={[1, 2, 3, 4, 5]}
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const val = payload[0].value as number;
                  return (
                    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-lg dark:border-slate-800 dark:bg-slate-950">
                      <p className="text-xs font-bold text-slate-900 dark:text-white">
                        {payload[0].payload.fullDate}
                      </p>
                      <p className="mt-1 text-sm font-extrabold text-emerald-500">
                        {val} / 5 Mood
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="mood"
              stroke="#10b981"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#moodGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
