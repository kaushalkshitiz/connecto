'use client';

// =============================================================================
// Athlete Risk Intelligence Platform
// SorenessTrendsChart — Recharts Visualization of Daily Soreness vs Watch Threshold
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
import { Activity } from 'lucide-react';

interface SorenessTrendsChartProps {
  checkIns: CheckIn[];
}

export function SorenessTrendsChart({ checkIns }: SorenessTrendsChartProps) {
  const sorted = [...checkIns]
    .sort((a, b) => (a.date > b.date ? 1 : -1))
    .slice(-14)
    .map((ci) => ({
      date: ci.date.slice(5),
      fullDate: ci.date,
      soreness: Number(ci.soreness),
    }));

  if (sorted.length === 0) {
    return (
      <div className="flex h-64 w-full items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
        No soreness check-in data recorded.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between pb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400">
            <Activity size={18} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Soreness Level Trends (1 = Fresh, 5 = Severe)
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Dashed amber line indicates 4.0 Watch threshold (§3.5)
            </p>
          </div>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={sorted} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="sorenessGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
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
                  const isHigh = val >= 4;
                  return (
                    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-lg dark:border-slate-800 dark:bg-slate-950">
                      <p className="text-xs font-bold text-slate-900 dark:text-white">
                        {payload[0].payload.fullDate}
                      </p>
                      <p className={`mt-1 text-sm font-extrabold ${isHigh ? 'text-amber-500' : 'text-slate-600 dark:text-slate-300'}`}>
                        {val} / 5 {isHigh ? '(Watch Threshold >= 4)' : ''}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <ReferenceLine
              y={4.0}
              stroke="#f59e0b"
              strokeDasharray="4 4"
              label={{
                value: 'Watch >= 4',
                fill: '#f59e0b',
                fontSize: 10,
                position: 'insideTopRight',
              }}
            />
            <Area
              type="monotone"
              dataKey="soreness"
              stroke="#f59e0b"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#sorenessGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
