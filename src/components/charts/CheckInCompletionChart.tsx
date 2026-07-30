'use client';

// =============================================================================
// Athlete Risk Intelligence Platform
// CheckInCompletionChart — Recharts Visualization of Daily/Weekly Check-In Adherence
// =============================================================================

import React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { CheckIn } from '../../types';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface CheckInCompletionChartProps {
  checkIns: CheckIn[];
  totalAthletes?: number;
  athletes?: { id: string; name: string }[];
}

export function CheckInCompletionChart({
  checkIns,
  totalAthletes = 6,
  athletes,
}: CheckInCompletionChartProps) {
  // Aggregate check-ins by date to calculate daily adherence %
  const dateMap: Record<string, { date: string; fullDate: string; count: number; percentage: number }> = {};

  checkIns.forEach((ci) => {
    const dateStr = ci.date.slice(0, 10);
    if (!dateMap[dateStr]) {
      dateMap[dateStr] = {
        date: dateStr.slice(5),
        fullDate: dateStr,
        count: 0,
        percentage: 0,
      };
    }
    dateMap[dateStr].count += 1;
    dateMap[dateStr].percentage = Math.min(
      Math.round((dateMap[dateStr].count / Math.max(totalAthletes, 1)) * 100),
      100
    );
  });

  const chartData = Object.values(dateMap)
    .sort((a, b) => (a.fullDate > b.fullDate ? 1 : -1))
    .slice(-7);

  const dataToDisplay =
    chartData.length > 0
      ? chartData
      : [
          { date: 'Mon', fullDate: 'Mon', count: 5, percentage: 83 },
          { date: 'Tue', fullDate: 'Tue', count: 6, percentage: 100 },
          { date: 'Wed', fullDate: 'Wed', count: 5, percentage: 83 },
          { date: 'Thu', fullDate: 'Thu', count: 6, percentage: 100 },
          { date: 'Fri', fullDate: 'Fri', count: 6, percentage: 100 },
        ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between pb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 size={18} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Daily Check-In Adherence Rate (%)
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Percentage of the roster completing their daily self-report check-in
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
              domain={[0, 100]}
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              unit="%"
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload;
                  return (
                    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-lg dark:border-slate-800 dark:bg-slate-950">
                      <p className="text-xs font-bold text-slate-900 dark:text-white">{item.fullDate}</p>
                      <p className="mt-1 text-sm font-extrabold text-emerald-500">
                        {item.percentage}% ({item.count} / {totalAthletes} Athletes)
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar
              dataKey="percentage"
              fill="#10b981"
              radius={[6, 6, 0, 0]}
              barSize={32}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Per-Athlete Check-In Status */}
      {athletes && (
        <div className="mt-5 space-y-1.5 border-t border-slate-100 pt-4 dark:border-slate-800">
          <p className="mb-2 text-xs font-bold text-slate-900 dark:text-white">
            Athlete Check-In Status
          </p>
          {athletes.map((athlete) => {
            const athleteCheckIns = checkIns
              .filter((ci) => ci.athlete_id === athlete.id)
              .sort((a, b) => (a.date > b.date ? -1 : 1));
            const lastCheckIn = athleteCheckIns[0];

            let daysSince: number | null = null;
            if (lastCheckIn) {
              const lastDate = new Date(lastCheckIn.date + 'T00:00:00Z');
              daysSince = Math.floor(
                Math.abs(new Date().getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
              );
            }

            const isOverdue = daysSince === null || daysSince >= 4;

            return (
              <div
                key={athlete.id}
                className="flex items-center justify-between rounded-xl px-3 py-2 text-xs even:bg-slate-50 dark:even:bg-slate-950/50"
              >
                <span className="font-semibold text-slate-900 dark:text-white">
                  {athlete.name}
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 font-semibold ${
                    isOverdue
                      ? 'text-rose-600 dark:text-rose-400'
                      : 'text-emerald-600 dark:text-emerald-400'
                  }`}
                >
                  {isOverdue ? <AlertCircle size={13} /> : <CheckCircle2 size={13} />}
                  {lastCheckIn
                    ? `Last check-in ${daysSince === 0 ? 'today' : `${daysSince}d ago`} (${lastCheckIn.date})`
                    : 'No check-ins recorded'}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
