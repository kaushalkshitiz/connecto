'use client';

// =============================================================================
// Athlete Risk Intelligence Platform
// Athlete Self-Report Dashboard — One-handed check-in CTA and recovery history
// =============================================================================

import React, { useState } from 'react';
import { useDemo } from '../../../context/DemoContext';
import { RiskBadge } from '../../../components/ui/RiskBadge';
import { CheckInModal } from '../../../components/forms/CheckInModal';
import {
  Activity,
  Calendar,
  Clock,
  Info,
  Moon,
  Plus,
  Smile,
} from 'lucide-react';

export default function AthleteDashboardPage() {
  const { activeUser, users, getAthleteRiskSummary } = useDemo();

  // If the active user is a coach or admin testing the athlete view, let's allow selecting an athlete
  const athleteUser =
    users.find((u) => u.id === activeUser.id) ||
    users.find((u) => u.email.includes('maya')) ||
    users[5];

  const summary = getAthleteRiskSummary(athleteUser.id);
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);

  return (
    <div className="space-y-8 pb-12">
      {/* Top Welcome Banner */}
      <div className="flex flex-wrap items-center justify-between gap-6 rounded-3xl border border-slate-800 bg-gradient-to-br from-emerald-950/60 via-slate-900 to-slate-950 p-6 shadow-2xl sm:p-8">
        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-950 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-300">
            <span>Athlete Self-Report Portal</span>
          </span>
          <h1 className="text-2xl font-black text-white sm:text-4xl">
            Welcome, {athleteUser.name}
          </h1>
          <p className="text-sm text-slate-300">
            Stanford Track &amp; Field • Daily Recovery &amp; Readiness
          </p>
        </div>

        <div>
          <button
            onClick={() => setIsCheckInModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-4 text-base font-black text-white shadow-xl shadow-emerald-500/30 transition-all hover:scale-105 hover:from-emerald-600 hover:to-teal-700"
          >
            <Plus size={20} />
            <span>Submit Daily Check-In</span>
          </button>
        </div>
      </div>

      {/* Current Readiness & Explainable Risk Flag Box */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="col-span-1 rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-sm md:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Your Current Readiness Level
              </p>
              <h3 className="mt-1 text-xl font-bold text-white">
                Rule-Based Risk Intelligence
              </h3>
            </div>
            <RiskBadge level={summary.currentRisk.level} size="lg" />
          </div>

          <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <div className="flex items-center gap-1.5 text-xs font-bold text-blue-400">
              <Info size={15} />
              <span>Status Explanation:</span>
            </div>
            <p className="mt-1 text-sm font-medium leading-relaxed text-slate-200">
              {summary.currentRisk.reason}
            </p>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-6 text-xs text-slate-400">
            <div>
              Last check-in:{' '}
              <span className="font-bold text-slate-200">
                {summary.daysSinceLastCheckIn === 0
                  ? 'Today'
                  : `${summary.daysSinceLastCheckIn} days ago`}
              </span>
            </div>
            <div>
              Active injury notes:{' '}
              <span className="font-bold text-slate-200">
                {summary.activeInjuryNotes.length}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Averages Column */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-bold uppercase text-slate-400">
                <Moon size={15} className="text-blue-400" />
                <span>7-Day Sleep Avg</span>
              </span>
              <span
                className={`text-lg font-black ${
                  summary.sevenDayAvgSleep && summary.sevenDayAvgSleep < 6.0
                    ? 'text-rose-400'
                    : 'text-blue-300'
                }`}
              >
                {summary.sevenDayAvgSleep ? `${summary.sevenDayAvgSleep} hrs` : '-'}
              </span>
            </div>
            <p className="mt-1 text-[11px] text-slate-500">
              Watch threshold: &lt; 6.0 hrs
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-bold uppercase text-slate-400">
                <Activity size={15} className="text-amber-400" />
                <span>7-Day Soreness Avg</span>
              </span>
              <span
                className={`text-lg font-black ${
                  summary.sevenDayAvgSoreness &&
                  summary.sevenDayAvgSoreness >= 4.0
                    ? 'text-amber-400'
                    : 'text-emerald-300'
                }`}
              >
                {summary.sevenDayAvgSoreness
                  ? `${summary.sevenDayAvgSoreness} / 5`
                  : '-'}
              </span>
            </div>
            <p className="mt-1 text-[11px] text-slate-500">
              Watch threshold: &ge; 4.0
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-bold uppercase text-slate-400">
                <Smile size={15} className="text-emerald-400" />
                <span>7-Day Mood Avg</span>
              </span>
              <span className="text-lg font-black text-emerald-300">
                {summary.sevenDayAvgMood ? `${summary.sevenDayAvgMood} / 5` : '-'}
              </span>
            </div>
            <p className="mt-1 text-[11px] text-slate-500">
              5 = High energy / motivation
            </p>
          </div>
        </div>
      </div>

      {/* Check-in history table */}
      <div className="space-y-4">
        <h2 className="flex items-center gap-2 text-xl font-bold text-white">
          <Calendar className="text-emerald-400" size={20} />
          <span>Your 14-Day Check-In History</span>
        </h2>

        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-3.5 pl-6 pr-4">Date</th>
                  <th className="py-3.5 px-4">Sleep Hours</th>
                  <th className="py-3.5 px-4">Soreness Rating</th>
                  <th className="py-3.5 px-4">Mood Rating</th>
                  <th className="py-3.5 px-4">Session RPE</th>
                  <th className="py-3.5 pl-4 pr-6">Personal Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-sm">
                {summary.recentCheckIns.map((ci) => (
                  <tr
                    key={ci.id}
                    className="transition-colors hover:bg-slate-800/40"
                  >
                    <td className="py-3.5 pl-6 pr-4 font-bold text-white">
                      {ci.date}
                    </td>
                    <td className="py-3.5 px-4 font-semibold">
                      <span
                        className={
                          Number(ci.sleep_hours) < 6.0
                            ? 'font-bold text-rose-400'
                            : 'text-slate-200'
                        }
                      >
                        {ci.sleep_hours} hrs
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold">
                      <span
                        className={
                          Number(ci.soreness) >= 4.0
                            ? 'font-bold text-amber-400'
                            : 'text-emerald-400'
                        }
                      >
                        {ci.soreness} / 5
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-200">
                      {ci.mood} / 5
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      {ci.rpe ? `${ci.rpe} / 10` : '-'}
                    </td>
                    <td className="py-3.5 pl-4 pr-6 text-slate-400">
                      {ci.note || '-'}
                    </td>
                  </tr>
                ))}

                {summary.recentCheckIns.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-12 text-center text-sm text-slate-500"
                    >
                      No recovery check-ins recorded yet. Click the submit button above to log your first morning check-in.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Check-In Modal */}
      <CheckInModal
        isOpen={isCheckInModalOpen}
        onClose={() => setIsCheckInModalOpen(false)}
        athleteId={athleteUser.id}
      />
    </div>
  );
}
