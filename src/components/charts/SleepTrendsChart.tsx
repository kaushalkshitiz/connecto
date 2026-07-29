'use client';

// =============================================================================
// Athlete Risk Intelligence Platform
// SleepTrendsChart — Recharts Visualization of Daily Sleep vs Watch Threshold
// =============================================================================

import React from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { CheckIn } from '../../types';
import { Moon } from 'lucide-react';

interface SleepTrendsChartProps {
  checkIns: CheckIn[];
}

export function SleepTrendsChart({ checkIns }: SleepTrendsChartProps) {
  const sorted = [...checkIns]
    .sort((a, b) => (a.date > b.date ? 1 : -1))
    .slice(-14)
    .map((ci) => ({
      date: ci.date.slice(5),
      fullDate: ci.date,
      sleep: Number(ci.sleep_hours),
    }));

  if (sorted.length === 0) {
    return (
      <div className="flex h-64 w-full items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
        No check-in sleep data recorded.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between pb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500/20 text-blue-600 dark:text-blue-400">
            <Moon size={18} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Sleep Duration Trends (Last 14 Check-Ins)
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Dashed red line indicates 6.0h Watch threshold (§3.5)
            </p>
          </div>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={sorted} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="sleepGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
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
              domain={[0, 10]}
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              unit="h"
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const val = payload[0].value as number;
                  const isLow = val < 6.0;
                  return (
                    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-lg dark:border-slate-800 dark:bg-slate-950">
                      <p className="text-xs font-bold text-slate-900 dark:text-white">
                        {payload[0].payload.fullDate}
                      </p>
                      <p className={`mt-1 text-sm font-extrabold ${isLow ? 'text-rose-500' : 'text-blue-500'}`}>
                        {val} hours {isLow ? '(Watch Flag < 6h)' : ''}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <ReferenceLine
              y={6.0}
              stroke="#ef4444"
              strokeDasharray="4 4"
              label={{
                value: 'Watch < 6h',
                fill: '#ef4444',
                fontSize: 10,
                position: 'insideTopRight',
              }}
            />
            <Area
              type="monotone"
              dataKey="sleep"
              stroke="#3b82f6"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#sleepGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
