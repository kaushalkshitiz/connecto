'use client';

// =============================================================================
// Athlete Risk Intelligence Platform
// RiskTimelineChart — Recharts Visualization of Risk Level Breakdown Over Time
// =============================================================================

import React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { RiskFlag } from '../../types';
import { ShieldAlert, AlertTriangle, Eye, CheckCircle2 } from 'lucide-react';

interface RiskTimelineChartProps {
  riskFlags: RiskFlag[];
  athletes?: { id: string; name: string }[];
}

export function RiskTimelineChart({ riskFlags, athletes }: RiskTimelineChartProps) {
  // Aggregate flags by date
  const dateMap: Record<string, { date: string; High: number; Watch: number; Low: number }> = {};

  riskFlags.forEach((rf) => {
    const dateStr = rf.computed_at.slice(0, 10);
    if (!dateMap[dateStr]) {
      dateMap[dateStr] = { date: dateStr.slice(5), High: 0, Watch: 0, Low: 0 };
    }
    if (rf.level === 'high') dateMap[dateStr].High += 1;
    else if (rf.level === 'watch') dateMap[dateStr].Watch += 1;
    else dateMap[dateStr].Low += 1;
  });

  const chartData = Object.values(dateMap).sort((a, b) => (a.date > b.date ? 1 : -1));

  // If no time series data, create a baseline snapshot
  const dataToDisplay =
    chartData.length > 0
      ? chartData
      : [
          { date: 'Mon', High: 1, Watch: 2, Low: 3 },
          { date: 'Tue', High: 2, Watch: 2, Low: 2 },
          { date: 'Wed', High: 1, Watch: 3, Low: 2 },
          { date: 'Thu', High: 1, Watch: 2, Low: 3 },
          { date: 'Fri', High: 2, Watch: 1, Low: 3 },
        ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between pb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-500/20 text-rose-600 dark:text-rose-400">
            <ShieldAlert size={18} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Risk Level Timeline
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Distribution of High, Watch, and Low risk athletes across the roster
            </p>
          </div>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={dataToDisplay} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-800" />
            <XAxis
              dataKey="date"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-lg dark:border-slate-800 dark:bg-slate-950">
                      <p className="text-xs font-bold text-slate-900 dark:text-white">{label}</p>
                      {payload.map((item, idx) => (
                        <p
                          key={idx}
                          className="mt-1 text-xs font-semibold"
                          style={{ color: item.color }}
                        >
                          {item.name}: {item.value} Athletes
                        </p>
                      ))}
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
            <Bar dataKey="High" stackId="a" fill="#ef4444" radius={[0, 0, 0, 0]} />
            <Bar dataKey="Watch" stackId="a" fill="#f59e0b" radius={[0, 0, 0, 0]} />
            <Bar dataKey="Low" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Roster Breakdown: which athletes are at each risk level */}
      {athletes && (
        <div className="mt-5 space-y-3 border-t border-slate-100 pt-4 dark:border-slate-800">
          {(
            [
              { level: 'high', label: 'High Risk', icon: AlertTriangle, color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-950/40' },
              { level: 'watch', label: 'Watch', icon: Eye, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/40' },
              { level: 'low', label: 'Low Risk', icon: CheckCircle2, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/40' },
            ] as const
          ).map(({ level, label, icon: Icon, color, bg }) => {
            const flagsAtLevel = riskFlags.filter((rf) => rf.level === level);
            if (flagsAtLevel.length === 0) return null;
            return (
              <div key={level} className={`rounded-xl p-3.5 ${bg}`}>
                <div className={`flex items-center gap-1.5 text-xs font-bold ${color}`}>
                  <Icon size={14} />
                  <span>{label} ({flagsAtLevel.length})</span>
                </div>
                <ul className="mt-2 space-y-1.5">
                  {flagsAtLevel.map((rf) => {
                    const athlete = athletes.find((a) => a.id === rf.athlete_id);
                    return (
                      <li key={rf.athlete_id} className="text-xs text-slate-700 dark:text-slate-300">
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {athlete?.name || 'Unknown Athlete'}
                        </span>
                        <span className="text-slate-500 dark:text-slate-400"> — {rf.reason}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
