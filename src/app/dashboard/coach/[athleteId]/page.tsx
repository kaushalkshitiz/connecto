'use client';

// =============================================================================
// Athlete Risk Intelligence Platform
// Coach Athlete Detail View — White & Dark UI support, explainable risk trigger
// =============================================================================

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useDemo } from '../../../../context/DemoContext';
import { RiskBadge } from '../../../../components/ui/RiskBadge';
import { RiskTrendChart } from '../../../../components/charts/RiskTrendChart';
import { ObservationModal } from '../../../../components/forms/ObservationModal';
import { PhysioModal } from '../../../../components/forms/PhysioModal';
import { CheckInModal } from '../../../../components/forms/CheckInModal';
import {
  Activity,
  ArrowLeft,
  Calendar,
  Clock,
  Eye,
  HeartPulse,
  Info,
  Moon,
  Plus,
  Smile,
  Zap,
} from 'lucide-react';

export default function AthleteDetailPage() {
  const params = useParams();
  const athleteId =
    typeof params.athleteId === 'string' ? params.athleteId : '';

  const { getAthleteRiskSummary, users } = useDemo();

  const athleteUser = users.find((u) => u.id === athleteId);
  const summary = getAthleteRiskSummary(athleteId);

  const [isObsModalOpen, setIsObsModalOpen] = useState(false);
  const [isPhysioModalOpen, setIsPhysioModalOpen] = useState(false);
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);

  if (!athleteUser) {
    return (
      <div className="space-y-6">
        <Link
          href="/dashboard/coach"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
        >
          <ArrowLeft size={16} />
          <span>Back to Coach Roster</span>
        </Link>
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-base font-bold text-slate-900 dark:text-white">
            Athlete not found in current roster
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 transition-colors duration-300">
      {/* Back link */}
      <div>
        <Link
          href="/dashboard/coach"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400"
        >
          <ArrowLeft size={15} />
          <span>Back to Roster Table</span>
        </Link>
      </div>

      {/* Header & Risk Status Box */}
      <div className="flex flex-wrap items-center justify-between gap-6 rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-blue-50/50 p-6 shadow-xl dark:border-slate-800 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 dark:shadow-2xl sm:p-8 transition-all">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-xl font-black text-white shadow-lg">
            {athleteUser.name
              .split(' ')
              .map((n) => n[0])
              .join('')}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-black text-slate-900 dark:text-white sm:text-3xl">
                {athleteUser.name}
              </h1>
              <RiskBadge level={summary.currentRisk.level} size="lg" />
            </div>
            <p className="mt-1 text-sm font-medium text-slate-600 dark:text-slate-400">
              {athleteUser.email} • Stanford Track &amp; Field
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsObsModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-blue-500/25 transition-all hover:-translate-y-0.5 hover:bg-blue-700"
          >
            <Eye size={15} />
            <span>Log Observation</span>
          </button>
          <button
            onClick={() => setIsPhysioModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-teal-500/25 transition-all hover:-translate-y-0.5 hover:bg-teal-700"
          >
            <HeartPulse size={15} />
            <span>Log Injury / Physio</span>
          </button>
          <button
            onClick={() => setIsCheckInModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-800 shadow-sm transition-all hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:bg-slate-700"
          >
            <Plus size={15} />
            <span>Submit Check-In</span>
          </button>
        </div>
      </div>

      {/* Human-Readable Explainable Reason Box (§3.5 Requirement) */}
      <div className="rounded-2xl border border-blue-200 bg-blue-50/90 p-5 shadow-sm dark:border-blue-900/40 dark:bg-blue-950/20 transition-all">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300">
          <Info size={16} />
          <span>Explainable Rule-Based Trigger (§3.5)</span>
        </div>
        <p className="mt-1.5 text-sm font-medium leading-relaxed text-slate-800 dark:text-slate-200">
          {summary.currentRisk.reason}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-6 text-xs text-slate-600 dark:text-slate-400">
          <div>
            7-Day Avg Sleep:{' '}
            <span className="font-bold text-slate-900 dark:text-white">
              {summary.sevenDayAvgSleep ? `${summary.sevenDayAvgSleep} hrs` : 'N/A'}
            </span>
          </div>
          <div>
            7-Day Avg Soreness:{' '}
            <span className="font-bold text-slate-900 dark:text-white">
              {summary.sevenDayAvgSoreness ? `${summary.sevenDayAvgSoreness} / 5` : 'N/A'}
            </span>
          </div>
          <div>
            Days Since Last Check-In:{' '}
            <span className="font-bold text-slate-900 dark:text-white">
              {summary.daysSinceLastCheckIn} days
            </span>
          </div>
          <div>
            Active Medical Notes:{' '}
            <span className="font-bold text-slate-900 dark:text-white">
              {summary.activeInjuryNotes.length}
            </span>
          </div>
        </div>
      </div>

      {/* SVG Trend Chart */}
      <RiskTrendChart checkIns={summary.recentCheckIns} />

      {/* Two Column Section: Check-In History + Observations & Medical Feed */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Left Column: Recent Check-Ins Table */}
        <div className="space-y-4">
          <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
            <Calendar className="text-emerald-600 dark:text-emerald-400" size={19} />
            <span>14-Day Recovery Check-In History</span>
          </h3>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md dark:border-slate-800 dark:bg-slate-900/60 transition-all">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
                    <th className="py-3 pl-4 pr-2">Date</th>
                    <th className="py-3 px-2">Sleep</th>
                    <th className="py-3 px-2">Soreness</th>
                    <th className="py-3 px-2">Mood</th>
                    <th className="py-3 px-2">RPE</th>
                    <th className="py-3 pl-2 pr-4">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800/50 text-xs">
                  {summary.recentCheckIns.map((ci) => (
                    <tr
                      key={ci.id}
                      className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40"
                    >
                      <td className="py-3 pl-4 pr-2 font-bold text-slate-900 dark:text-white">
                        {ci.date}
                      </td>
                      <td className="py-3 px-2">
                        <span
                          className={
                            Number(ci.sleep_hours) < 6.0
                              ? 'font-bold text-rose-600 dark:text-rose-400'
                              : 'text-slate-800 dark:text-slate-200'
                          }
                        >
                          {ci.sleep_hours}h
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        <span
                          className={
                            Number(ci.soreness) >= 4.0
                              ? 'font-bold text-amber-600 dark:text-amber-400'
                              : 'text-slate-800 dark:text-slate-200'
                          }
                        >
                          {ci.soreness}/5
                        </span>
                      </td>
                      <td className="py-3 px-2 text-slate-700 dark:text-slate-200">
                        {ci.mood}/5
                      </td>
                      <td className="py-3 px-2 text-slate-600 dark:text-slate-300">
                        {ci.rpe ? `${ci.rpe}/10` : '-'}
                      </td>
                      <td className="py-3 pl-2 pr-4 text-slate-600 dark:text-slate-400 max-w-[150px] truncate">
                        {ci.note || '-'}
                      </td>
                    </tr>
                  ))}

                  {summary.recentCheckIns.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-8 text-center text-slate-500"
                      >
                        No check-ins logged for this athlete yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Combined Staff Observations & Physio Feed */}
        <div className="space-y-4">
          <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
            <HeartPulse className="text-teal-600 dark:text-teal-400" size={19} />
            <span>Staff Observations &amp; Clinical Injury Notes</span>
          </h3>

          <div className="space-y-4">
            {/* Active Injury Notes */}
            {summary.activeInjuryNotes.map((pn) => (
              <div
                key={pn.id}
                className="rounded-2xl border border-rose-300 bg-rose-50/90 p-5 shadow-sm dark:border-rose-900/60 dark:bg-rose-950/30 dark:shadow-md transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-300 bg-rose-100 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-rose-800 dark:border-rose-500/50 dark:bg-rose-950 dark:text-rose-300">
                    <span>Active Injury Note</span>
                  </span>
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    {pn.date}
                  </span>
                </div>
                <p className="mt-2 text-sm font-medium leading-relaxed text-slate-900 dark:text-slate-100">
                  &ldquo;{pn.note}&rdquo;
                </p>
                <p className="mt-2 text-xs font-bold text-rose-700 dark:text-rose-300">
                  Logged by: {pn.physio_name || 'Medical Staff'}
                </p>
              </div>
            ))}

            {/* Coach Observations */}
            {summary.recentObservations.map((obs) => (
              <div
                key={obs.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/60 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-blue-800 dark:border-blue-500/40 dark:bg-blue-950 dark:text-blue-300">
                    <span>Coach Observation</span>
                  </span>
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    {obs.date}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-slate-800 dark:text-slate-200">
                  &ldquo;{obs.note}&rdquo;
                </p>
                <p className="mt-2 text-xs font-bold text-blue-700 dark:text-blue-300">
                  Logged by: {obs.coach_name || 'Coach Staff'}
                </p>
              </div>
            ))}

            {summary.activeInjuryNotes.length === 0 &&
              summary.recentObservations.length === 0 && (
                <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900/40">
                  No staff observations or active medical injury notes recorded.
                </div>
              )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <ObservationModal
        isOpen={isObsModalOpen}
        onClose={() => setIsObsModalOpen(false)}
        athleteId={athleteId}
      />
      <PhysioModal
        isOpen={isPhysioModalOpen}
        onClose={() => setIsPhysioModalOpen(false)}
        athleteId={athleteId}
      />
      <CheckInModal
        isOpen={isCheckInModalOpen}
        onClose={() => setIsCheckInModalOpen(false)}
        athleteId={athleteId}
      />
    </div>
  );
}
