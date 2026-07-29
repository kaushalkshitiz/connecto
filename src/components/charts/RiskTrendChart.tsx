'use client';

// =============================================================================
// Athlete Risk Intelligence Platform
// RiskTrendChart — Responsive SVG Chart for 7-Day Sleep & Soreness
// =============================================================================

import React from 'react';
import { CheckIn } from '../../types';
import { Moon, Activity } from 'lucide-react';

interface RiskTrendChartProps {
  checkIns: CheckIn[];
}

export function RiskTrendChart({ checkIns }: RiskTrendChartProps) {
  // Take last 7 check-ins sorted chronologically (oldest to newest)
  const sorted = [...checkIns]
    .sort((a, b) => (a.date > b.date ? 1 : -1))
    .slice(-7);

  if (sorted.length === 0) {
    return (
      <div className="flex h-56 w-full items-center justify-center rounded-2xl border border-slate-800 bg-slate-950/40 text-sm text-slate-500">
        No recent check-in data available for trend chart.
      </div>
    );
  }

  // Calculate SVG coordinates
  const height = 180;
  const width = 500;
  const paddingX = 40;
  const paddingY = 25;

  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingY * 2;

  // Max sleep = 10 hrs, Max soreness = 5
  const getX = (index: number) => {
    if (sorted.length === 1) return width / 2;
    return paddingX + (index / (sorted.length - 1)) * chartWidth;
  };

  const getSleepY = (sleep: number) => {
    const ratio = Math.min(Math.max(sleep / 10, 0), 1);
    return height - paddingY - ratio * chartHeight;
  };

  const getSorenessY = (soreness: number) => {
    const ratio = Math.min(Math.max(soreness / 5, 0), 1);
    return height - paddingY - ratio * chartHeight;
  };

  // Watch threshold lines: Sleep < 6.0 hrs (6/10), Soreness >= 4.0 (4/5)
  const sleepWatchY = getSleepY(6.0);
  const sorenessWatchY = getSorenessY(4.0);

  // SVG polyline points for Sleep
  const sleepPoints = sorted
    .map((ci, idx) => `${getX(idx)},${getSleepY(Number(ci.sleep_hours))}`)
    .join(' ');

  // SVG polyline points for Soreness
  const sorenessPoints = sorted
    .map((ci, idx) => `${getX(idx)},${getSorenessY(Number(ci.soreness))}`)
    .join(' ');

  return (
    <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-5 shadow-inner">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3">
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300">
            7-Day Load & Recovery Trend
          </h4>
          <p className="text-xs text-slate-400">
            Dashed red lines indicate critical <span className="font-semibold text-rose-400">Watch thresholds</span> (Sleep &lt; 6h, Soreness &ge; 4)
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1.5 text-blue-400">
            <Moon size={14} />
            <span>Sleep (hrs)</span>
          </div>
          <div className="flex items-center gap-1.5 text-amber-400">
            <Activity size={14} />
            <span>Soreness (1-5)</span>
          </div>
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="h-56 w-full min-w-[320px]"
        >
          {/* Grid lines */}
          <line
            x1={paddingX}
            y1={paddingY}
            x2={width - paddingX}
            y2={paddingY}
            stroke="#1e293b"
            strokeWidth="1"
          />
          <line
            x1={paddingX}
            y1={height - paddingY}
            x2={width - paddingX}
            y2={height - paddingY}
            stroke="#1e293b"
            strokeWidth="1"
          />

          {/* Watch Threshold Lines */}
          <line
            x1={paddingX}
            y1={sleepWatchY}
            x2={width - paddingX}
            y2={sleepWatchY}
            stroke="#3b82f6"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            opacity="0.4"
          />
          <line
            x1={paddingX}
            y1={sorenessWatchY}
            x2={width - paddingX}
            y2={sorenessWatchY}
            stroke="#f59e0b"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            opacity="0.4"
          />

          {/* Sleep line & points */}
          <polyline
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2.5"
            points={sleepPoints}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {sorted.map((ci, idx) => (
            <circle
              key={`sleep-${ci.id}`}
              cx={getX(idx)}
              cy={getSleepY(Number(ci.sleep_hours))}
              r="4.5"
              fill="#1e40af"
              stroke="#60a5fa"
              strokeWidth="2"
            />
          ))}

          {/* Soreness line & points */}
          <polyline
            fill="none"
            stroke="#f59e0b"
            strokeWidth="2.5"
            points={sorenessPoints}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {sorted.map((ci, idx) => (
            <circle
              key={`soreness-${ci.id}`}
              cx={getX(idx)}
              cy={getSorenessY(Number(ci.soreness))}
              r="4.5"
              fill="#92400e"
              stroke="#fbbf24"
              strokeWidth="2"
            />
          ))}

          {/* Date labels */}
          {sorted.map((ci, idx) => (
            <text
              key={`date-${ci.id}`}
              x={getX(idx)}
              y={height - 5}
              textAnchor="middle"
              className="fill-slate-500 text-[10px] font-medium"
            >
              {ci.date.slice(5)}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
}
