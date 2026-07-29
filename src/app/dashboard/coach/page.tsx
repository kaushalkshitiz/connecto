'use client';

// =============================================================================
// Athlete Risk Intelligence Platform
// Coach Roster Dashboard — Real-time risk badges, filters, and trend overview
// =============================================================================

import React, { useState } from 'react';
import Link from 'next/link';
import { useDemo } from '../../../context/DemoContext';
import { RiskBadge } from '../../../components/ui/RiskBadge';
import { RiskLevel } from '../../../types';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Clock,
  Filter,
  Flame,
  Moon,
  Search,
  Users,
} from 'lucide-react';

export default function CoachDashboardPage() {
  const { users, memberships, team, riskFlags, checkIns } = useDemo();

  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Find athletes
  const athleteUsers = users.filter((u) =>
    memberships.some((m) => m.user_id === u.id && m.role === 'athlete')
  );

  const rosterWithRisk = athleteUsers.map((athlete) => {
    const flag = riskFlags.find((rf) => rf.athlete_id === athlete.id) || {
      id: 'default',
      athlete_id: athlete.id,
      team_id: team.id,
      level: 'low' as RiskLevel,
      reason: 'All metrics in normal range',
      computed_at: new Date().toISOString(),
    };

    const athleteCheckIns = checkIns
      .filter((c) => c.athlete_id === athlete.id)
      .sort((a, b) => (a.date > b.date ? -1 : 1));

    const latest = athleteCheckIns[0] || null;

    let daysSince = 999;
    if (latest) {
      const today = new Date().toISOString().slice(0, 10);
      const d1 = new Date(latest.date + 'T00:00:00Z');
      const d2 = new Date(today + 'T00:00:00Z');
      daysSince = Math.floor(
        Math.abs(d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24)
      );
    }

    // Compute 7-day sleep avg
    const recent7 = athleteCheckIns.slice(0, 7);
    const avgSleep =
      recent7.length > 0
        ? Number(
            (
              recent7.reduce((s, ci) => s + Number(ci.sleep_hours), 0) /
              recent7.length
            ).toFixed(1)
          )
        : null;

    const avgSoreness =
      recent7.length > 0
        ? Number(
            (
              recent7.reduce((s, ci) => s + Number(ci.soreness), 0) /
              recent7.length
            ).toFixed(1)
          )
        : null;

    return {
      athlete,
      flag,
      latestCheckIn: latest,
      daysSince,
      avgSleep,
      avgSoreness,
    };
  });

  // Filter roster
  const filteredRoster = rosterWithRisk.filter((item) => {
    const matchesLevel =
      filterLevel === 'all' ||
      item.flag.level.toLowerCase() === filterLevel.toLowerCase();

    const matchesSearch =
      searchQuery.trim() === '' ||
      item.athlete.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.athlete.email.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesLevel && matchesSearch;
  });

  const highCount = rosterWithRisk.filter((i) => i.flag.level === 'high').length;
  const watchCount = rosterWithRisk.filter((i) => i.flag.level === 'watch').length;

  return (
    <div className="space-y-8 pb-12">
      {/* Top Title & Roster Alert Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-lg bg-blue-950/80 p-2 text-blue-400 border border-blue-800/50">
              <Users size={20} />
            </span>
            <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
              Coach Roster Intelligence
            </h1>
          </div>
          <p className="mt-1 text-sm text-slate-400">
            Real-time rule-based injury &amp; dropout risk flags for{' '}
            <span className="font-semibold text-slate-200">{team.name}</span>
          </p>
        </div>

        {/* Actionable summary badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-rose-900/50 bg-rose-950/40 px-4 py-2 text-sm font-bold text-rose-300">
            <Flame size={18} className="text-rose-400 animate-pulse" />
            <span>{highCount} High Risk</span>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-amber-900/50 bg-amber-950/40 px-4 py-2 text-sm font-bold text-amber-300">
            <AlertTriangle size={18} className="text-amber-400" />
            <span>{watchCount} Watch</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
            <Filter size={14} />
            <span>Risk Level:</span>
          </span>
          {[
            { id: 'all', label: 'All Athletes' },
            { id: 'high', label: 'High Risk' },
            { id: 'watch', label: 'Watch Risk' },
            { id: 'low', label: 'Low Risk' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterLevel(tab.id)}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                filterLevel === tab.id
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'bg-slate-950 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search
            size={16}
            className="absolute left-3.5 top-3 text-slate-500"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search athlete by name..."
            className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2 pl-9 pr-4 text-sm text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Roster Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/60 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/80 text-xs font-bold uppercase tracking-wider text-slate-400">
                <th className="py-4 pl-6 pr-4">Athlete Name</th>
                <th className="py-4 px-4">Current Risk Level</th>
                <th className="py-4 px-4">7-Day Sleep Avg</th>
                <th className="py-4 px-4">7-Day Soreness Avg</th>
                <th className="py-4 px-4">Last Check-In</th>
                <th className="py-4 px-4">Flag Reason (Explainable)</th>
                <th className="py-4 pl-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm">
              {filteredRoster.map((item) => (
                <tr
                  key={item.athlete.id}
                  className="transition-colors hover:bg-slate-800/40"
                >
                  <td className="py-4 pl-6 pr-4 font-bold text-white">
                    <Link
                      href={`/dashboard/coach/${item.athlete.id}`}
                      className="flex items-center gap-2 hover:text-blue-400"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-xs font-black text-white">
                        {item.athlete.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </div>
                      <div>
                        <p>{item.athlete.name}</p>
                        <p className="text-xs font-normal text-slate-500">
                          {item.athlete.email}
                        </p>
                      </div>
                    </Link>
                  </td>

                  <td className="py-4 px-4">
                    <RiskBadge level={item.flag.level} size="sm" />
                  </td>

                  <td className="py-4 px-4">
                    {item.avgSleep !== null ? (
                      <div className="flex items-center gap-1.5 font-semibold">
                        <Moon
                          size={15}
                          className={
                            item.avgSleep < 6.0
                              ? 'text-rose-400'
                              : 'text-blue-400'
                          }
                        />
                        <span
                          className={
                            item.avgSleep < 6.0
                              ? 'text-rose-400 font-bold'
                              : 'text-slate-200'
                          }
                        >
                          {item.avgSleep} hrs
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-500">N/A</span>
                    )}
                  </td>

                  <td className="py-4 px-4">
                    {item.avgSoreness !== null ? (
                      <div className="flex items-center gap-1.5 font-semibold">
                        <Activity
                          size={15}
                          className={
                            item.avgSoreness >= 4.0
                              ? 'text-amber-400'
                              : 'text-emerald-400'
                          }
                        />
                        <span
                          className={
                            item.avgSoreness >= 4.0
                              ? 'text-amber-400 font-bold'
                              : 'text-slate-200'
                          }
                        >
                          {item.avgSoreness} / 5
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-500">N/A</span>
                    )}
                  </td>

                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <Clock size={15} className="text-slate-500" />
                      {item.daysSince === 0 ? (
                        <span className="font-semibold text-emerald-400">
                          Today
                        </span>
                      ) : item.daysSince === 1 ? (
                        <span>Yesterday</span>
                      ) : item.daysSince >= 4 ? (
                        <span className="font-bold text-amber-400">
                          {item.daysSince} days ago (Watch)
                        </span>
                      ) : (
                        <span>{item.daysSince} days ago</span>
                      )}
                    </div>
                  </td>

                  <td className="py-4 px-4 max-w-xs">
                    <p className="line-clamp-2 text-xs text-slate-300">
                      {item.flag.reason}
                    </p>
                  </td>

                  <td className="py-4 pl-4 pr-6 text-right">
                    <Link
                      href={`/dashboard/coach/${item.athlete.id}`}
                      className="inline-flex items-center gap-1 rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-bold text-white transition-all hover:border-blue-500 hover:bg-blue-600"
                    >
                      <span>Detail</span>
                      <ArrowRight size={13} />
                    </Link>
                  </td>
                </tr>
              ))}

              {filteredRoster.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="py-12 text-center text-sm text-slate-500"
                  >
                    No athletes found matching your selected risk filter or search query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
