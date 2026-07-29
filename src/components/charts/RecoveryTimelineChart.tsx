'use client';

// =============================================================================
// Athlete Risk Intelligence Platform
// RecoveryTimelineChart — Dual Axis Recharts comparing Sleep and Soreness
// =============================================================================

import React from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { CheckIn } from '../../types';
import { HeartPulse } from 'lucide-react';

interface RecoveryTimelineChartProps {
  checkIns: CheckIn[];
}

export function RecoveryTimelineChart({ checkIns }: RecoveryTimelineChartProps) {
  const sorted = [...checkIns]
    .sort((a, b) => (a.date > b.date ? 1 : -1))
    .slice(-14)
    .map((ci) => ({
      date: ci.date.slice(5),
      fullDate: ci.date,
      sleep: Number(ci.sleep_hours),
      soreness: Number(ci.soreness),
    }));

  if (sorted.length === 0) {
    return (
      <div className="flex h-64 w-full items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
        No recovery check-in data available.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between pb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500/20 text-blue-600 dark:text-blue-400">
            <HeartPulse size={18} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Recovery Correlation Timeline (Sleep vs. Soreness)
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Left axis: Sleep duration (hrs) • Right axis: Muscle soreness (1-5)
            </p>
          </div>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sorted} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-800" />
            <XAxis
              dataKey="date"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              yAxisId="left"
              domain={[0, 10]}
              stroke="#3b82f6"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              unit="h"
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              domain={[1, 5]}
              stroke="#f59e0b"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const sleepVal = payload.find((p) => p.dataKey === 'sleep')?.value;
                  const soreVal = payload.find((p) => p.dataKey === 'soreness')?.value;
                  return (
                    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-lg dark:border-slate-800 dark:bg-slate-950">
                      <p className="text-xs font-bold text-slate-900 dark:text-white">
                        {payload[0].payload.fullDate}
                      </p>
                      <p className="mt-1 text-xs font-bold text-blue-500">
                        Sleep: {sleepVal} hrs
                      </p>
                      <p className="mt-0.5 text-xs font-bold text-amber-500">
                        Soreness: {soreVal}/5
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: 11, paddingTop: 10 }}
              formatter={(value) => <span className="text-slate-700 dark:text-slate-300">{value}</span>}
            />
            <Line
              yAxisId="left"
              name="Sleep Duration (hrs)"
              type="monotone"
              dataKey="sleep"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ r: 4, fill: '#3b82f6' }}
              activeDot={{ r: 6 }}
            />
            <Line
              yAxisId="right"
              name="Muscle Soreness (1-5)"
              type="monotone"
              dataKey="soreness"
              stroke="#f59e0b"
              strokeWidth={3}
              dot={{ r: 4, fill: '#f59e0b' }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
