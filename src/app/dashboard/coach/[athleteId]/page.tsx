'use client';

// =============================================================================
// Athlete Risk Intelligence Platform
// Coach Athlete Detail View — Explainable risk trigger, trend chart, and logs
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
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white"
        >
          <ArrowLeft size={16} />
          <span>Back to Coach Roster</span>
        </Link>
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center">
          <p className="text-base font-bold text-white">
            Athlete not found in current roster
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Back link */}
      <div>
        <Link
          href="/dashboard/coach"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-emerald-400"
        >
          <ArrowLeft size={15} />
          <span>Back to Roster Table</span>
        </Link>
      </div>

      {/* Header & Risk Status Box */}
      <div className="flex flex-wrap items-center justify-between gap-6 rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-6 shadow-2xl sm:p-8">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-xl font-black text-white shadow-lg">
            {athleteUser.name
              .split(' ')
              .map((n) => n[0])
              .join('')}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-black text-white sm:text-3xl">
                {athleteUser.name}
              </h1>
              <RiskBadge level={summary.currentRisk.level} size="lg" />
            </div>
            <p className="mt-1 text-sm text-slate-400">
              {athleteUser.email} • Stanford Track &amp; Field
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsObsModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-blue-500/25 transition-all hover:bg-blue-700"
          >
            <Eye size={15} />
            <span>Log Observation</span>
          </button>
          <button
            onClick={() => setIsPhysioModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-teal-500/25 transition-all hover:bg-teal-700"
          >
            <HeartPulse size={15} />
            <span>Log Injury / Physio</span>
          </button>
          <button
            onClick={() => setIsCheckInModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-200 transition-all hover:border-slate-500 hover:bg-slate-700"
          >
            <Plus size={15} />
            <span>Submit Check-In</span>
          </button>
        </div>
      </div>

      {/* Human-Readable Explainable Reason Box (§3.5 Requirement) */}
      <div className="rounded-2xl border border-blue-900/40 bg-blue-950/20 p-5 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-300">
          <Info size={16} />
          <span>Explainable Rule-Based Trigger (§3.5)</span>
        </div>
        <p className="mt-1.5 text-sm font-medium leading-relaxed text-slate-200">
          {summary.currentRisk.reason}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-6 text-xs text-slate-400">
          <div>
            7-Day Avg Sleep:{' '}
            <span className="font-bold text-white">
              {summary.sevenDayAvgSleep ? `${summary.sevenDayAvgSleep} hrs` : 'N/A'}
            </span>
          </div>
          <div>
            7-Day Avg Soreness:{' '}
            <span className="font-bold text-white">
              {summary.sevenDayAvgSoreness ? `${summary.sevenDayAvgSoreness} / 5` : 'N/A'}
            </span>
          </div>
          <div>
            Days Since Last Check-In:{' '}
            <span className="font-bold text-white">
              {summary.daysSinceLastCheckIn} days
            </span>
          </div>
          <div>
            Active Medical Notes:{' '}
            <span className="font-bold text-white">
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
          <h3 className="flex items-center gap-2 text-lg font-bold text-white">
            <Calendar className="text-emerald-400" size={19} />
            <span>14-Day Recovery Check-In History</span>
          </h3>

          <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 shadow-md">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    <th className="py-3 pl-4 pr-2">Date</th>
                    <th className="py-3 px-2">Sleep</th>
                    <th className="py-3 px-2">Soreness</th>
                    <th className="py-3 px-2">Mood</th>
                    <th className="py-3 px-2">RPE</th>
                    <th className="py-3 pl-2 pr-4">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50 text-xs">
                  {summary.recentCheckIns.map((ci) => (
                    <tr
                      key={ci.id}
                      className="transition-colors hover:bg-slate-800/40"
                    >
                      <td className="py-3 pl-4 pr-2 font-semibold text-white">
                        {ci.date}
                      </td>
                      <td className="py-3 px-2">
                        <span
                          className={
                            Number(ci.sleep_hours) < 6.0
                              ? 'font-bold text-rose-400'
                              : 'text-slate-200'
                          }
                        >
                          {ci.sleep_hours}h
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        <span
                          className={
                            Number(ci.soreness) >= 4.0
                              ? 'font-bold text-amber-400'
                              : 'text-slate-200'
                          }
                        >
                          {ci.soreness}/5
                        </span>
                      </td>
                      <td className="py-3 px-2 text-slate-200">
                        {ci.mood}/5
                      </td>
                      <td className="py-3 px-2 text-slate-300">
                        {ci.rpe ? `${ci.rpe}/10` : '-'}
                      </td>
                      <td className="py-3 pl-2 pr-4 text-slate-400 max-w-[150px] truncate">
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
          <h3 className="flex items-center gap-2 text-lg font-bold text-white">
            <HeartPulse className="text-teal-400" size={19} />
            <span>Staff Observations &amp; Clinical Injury Notes</span>
          </h3>

          <div className="space-y-4">
            {/* Active Injury Notes */}
            {summary.activeInjuryNotes.map((pn) => (
              <div
                key={pn.id}
                className="rounded-2xl border border-rose-900/60 bg-rose-950/30 p-5 shadow-md"
              >
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/50 bg-rose-950 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-rose-300">
                    <span>Active Injury Note</span>
                  </span>
                  <span className="text-xs font-medium text-slate-400">
                    {pn.date}
                  </span>
                </div>
                <p className="mt-2 text-sm font-medium leading-relaxed text-slate-100">
                  &ldquo;{pn.note}&rdquo;
                </p>
                <p className="mt-2 text-xs font-bold text-rose-300">
                  Logged by: {pn.physio_name || 'Medical Staff'}
                </p>
              </div>
            ))}

            {/* Coach Observations */}
            {summary.recentObservations.map((obs) => (
              <div
                key={obs.id}
                className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/40 bg-blue-950 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-blue-300">
                    <span>Coach Observation</span>
                  </span>
                  <span className="text-xs font-medium text-slate-400">
                    {obs.date}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-slate-200">
                  &ldquo;{obs.note}&rdquo;
                </p>
                <p className="mt-2 text-xs font-bold text-blue-300">
                  Logged by: {obs.coach_name || 'Coach Staff'}
                </p>
              </div>
            ))}

            {summary.activeInjuryNotes.length === 0 &&
              summary.recentObservations.length === 0 && (
                <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-8 text-center text-sm text-slate-500">
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
