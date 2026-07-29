'use client';

// =============================================================================
// Athlete Risk Intelligence Platform
// PerformanceProgressionChart — Recharts Visualization of Performance & Readiness
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
import { Zap } from 'lucide-react';

interface PerformanceProgressionChartProps {
  checkIns: CheckIn[];
}

export function PerformanceProgressionChart({ checkIns }: PerformanceProgressionChartProps) {
  const sorted = [...checkIns]
    .sort((a, b) => (a.date > b.date ? 1 : -1))
    .slice(-14)
    .map((ci, idx) => {
      // Calculate a deterministic performance readiness score based on sleep & soreness
      const sleepScore = (Number(ci.sleep_hours) / 10) * 100;
      const sorenessPenalty = (Number(ci.soreness) - 1) * 12;
      const readiness = Math.min(Math.max(Math.round(sleepScore - sorenessPenalty), 40), 100);

      return {
        date: ci.date.slice(5),
        fullDate: ci.date,
        readinessIndex: readiness,
        targetReadiness: 85,
      };
    });

  if (sorted.length === 0) {
    return (
      <div className="flex h-64 w-full items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
        No performance check-in records available.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between pb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-500/20 text-purple-600 dark:text-purple-400">
            <Zap size={18} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Performance Readiness Progression Index (%)
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Derived deterministically from sleep, soreness, and training adaptation balance
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
              domain={[40, 100]}
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              unit="%"
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
                      <p className="mt-1 text-sm font-extrabold text-purple-500">
                        {val}% Readiness Index
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
              name="Readiness Index"
              type="monotone"
              dataKey="readinessIndex"
              stroke="#a855f7"
              strokeWidth={3}
              dot={{ r: 4, fill: '#a855f7' }}
              activeDot={{ r: 6 }}
            />
            <Line
              name="Optimal Target"
              type="monotone"
              dataKey="targetReadiness"
              stroke="#10b981"
              strokeDasharray="4 4"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
