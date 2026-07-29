'use client';

// =============================================================================
// Athlete Risk Intelligence Platform
// Physio Dashboard — Medical injury & treatment logger with status tags
// =============================================================================

import React, { useState } from 'react';
import Link from 'next/link';
import { useDemo } from '../../../context/DemoContext';
import { RiskBadge } from '../../../components/ui/RiskBadge';
import { PhysioModal } from '../../../components/forms/PhysioModal';
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  HeartPulse,
  Info,
  Plus,
  ShieldAlert,
  UserCheck,
} from 'lucide-react';

export default function PhysioDashboardPage() {
  const { users, memberships, physioNotes, riskFlags, team } = useDemo();

  const athleteUsers = users.filter((u) =>
    memberships.some((m) => m.user_id === u.id && m.role === 'athlete')
  );

  const [selectedAthleteId, setSelectedAthleteId] = useState<string>(
    athleteUsers[0]?.id || ''
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredNotes = physioNotes.filter((pn) => {
    if (statusFilter === 'all') return true;
    return pn.status.toLowerCase() === statusFilter.toLowerCase();
  });

  const activeCount = physioNotes.filter((n) => n.status === 'active').length;
  const recoveringCount = physioNotes.filter((n) => n.status === 'recovering').length;
  const clearedCount = physioNotes.filter((n) => n.status === 'cleared').length;

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-rose-500/50 bg-rose-950/80 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-rose-300">
            <AlertCircle size={13} />
            <span>Active Injury</span>
          </span>
        );
      case 'recovering':
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/50 bg-amber-950/80 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-amber-300">
            <span>Recovering</span>
          </span>
        );
      case 'cleared':
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/50 bg-emerald-950/80 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-emerald-300">
            <CheckCircle2 size={13} />
            <span>Cleared</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-900 px-2.5 py-0.5 text-xs font-medium text-slate-300">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-6 rounded-3xl border border-slate-800 bg-gradient-to-br from-teal-950/60 via-slate-900 to-slate-950 p-6 shadow-2xl sm:p-8">
        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-500/40 bg-teal-950 px-3 py-1 text-xs font-bold uppercase tracking-wider text-teal-300">
            <span>Clinical Medical Portal</span>
          </span>
          <h1 className="text-2xl font-black text-white sm:text-3xl">
            Physio Injury &amp; Treatment Hub
          </h1>
          <p className="text-sm text-slate-300">
            {team.name} • Physical Therapy &amp; Rehab Records
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedAthleteId}
            onChange={(e) => setSelectedAthleteId(e.target.value)}
            className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm font-semibold text-white focus:border-teal-500 focus:outline-none"
          >
            {athleteUsers.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name} ({a.email.split('@')[0]})
              </option>
            ))}
          </select>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-600 px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-teal-500/30 transition-all hover:from-teal-600 hover:to-emerald-700"
          >
            <Plus size={18} />
            <span>Log Injury / Treatment</span>
          </button>
        </div>
      </div>

      {/* Rule & Stats Bar */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-teal-900/40 bg-teal-950/20 p-5 shadow-sm">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-teal-300">
            <ShieldAlert size={15} />
            <span>Rule-Based Synergy (§3.5)</span>
          </div>
          <p className="mt-1 text-xs leading-relaxed text-slate-300">
            An <strong className="text-white">Active Injury</strong> note combined with any Watch condition automatically elevates an athlete to <strong className="text-rose-400">High Risk</strong>.
          </p>
        </div>

        <div className="rounded-2xl border border-rose-900/40 bg-rose-950/20 p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-rose-300">
            Active Injuries
          </p>
          <p className="mt-1 text-3xl font-black text-rose-400">{activeCount}</p>
          <p className="mt-1 text-xs text-rose-400/80">
            Currently restricted / high risk trigger
          </p>
        </div>

        <div className="rounded-2xl border border-amber-900/40 bg-amber-950/20 p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-300">
            Recovering
          </p>
          <p className="mt-1 text-3xl font-black text-amber-400">
            {recoveringCount}
          </p>
          <p className="mt-1 text-xs text-amber-400/80">
            Rehab progress on schedule
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-900/40 bg-emerald-950/20 p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-300">
            Cleared to Play
          </p>
          <p className="mt-1 text-3xl font-black text-emerald-400">
            {clearedCount}
          </p>
          <p className="mt-1 text-xs text-emerald-400/80">
            Full training return
          </p>
        </div>
      </div>

      {/* Filter and Notes List */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <h2 className="flex items-center gap-2 text-xl font-bold text-white">
            <HeartPulse className="text-teal-400" size={20} />
            <span>Team Medical Log &amp; Treatment Records</span>
          </h2>

          <div className="flex items-center gap-2">
            {[
              { id: 'all', label: 'All Status' },
              { id: 'active', label: 'Active' },
              { id: 'recovering', label: 'Recovering' },
              { id: 'cleared', label: 'Cleared' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                  statusFilter === tab.id
                    ? 'bg-teal-600 text-white shadow-md shadow-teal-600/30'
                    : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table of Physio Notes */}
        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-4 pl-6 pr-4">Date</th>
                  <th className="py-4 px-4">Athlete Name</th>
                  <th className="py-4 px-4">Medical Status</th>
                  <th className="py-4 px-4">Clinical Treatment / Rehab Note</th>
                  <th className="py-4 px-4">Logged By</th>
                  <th className="py-4 pl-4 pr-6 text-right">Current Risk</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-sm">
                {filteredNotes.map((pn) => {
                  const athlete = users.find((u) => u.id === pn.athlete_id);
                  const flag =
                    riskFlags.find((rf) => rf.athlete_id === pn.athlete_id) || {
                      level: 'low',
                    };

                  return (
                    <tr
                      key={pn.id}
                      className="transition-colors hover:bg-slate-800/40"
                    >
                      <td className="py-4 pl-6 pr-4 font-bold text-white">
                        {pn.date}
                      </td>

                      <td className="py-4 px-4 font-bold text-slate-200">
                        {athlete ? (
                          <Link
                            href={`/dashboard/coach/${athlete.id}`}
                            className="hover:text-teal-400"
                          >
                            {athlete.name}
                          </Link>
                        ) : (
                          'Unknown Athlete'
                        )}
                      </td>

                      <td className="py-4 px-4">{getStatusBadge(pn.status)}</td>

                      <td className="py-4 px-4 text-slate-200 max-w-md">
                        {pn.note}
                      </td>

                      <td className="py-4 px-4 text-xs font-semibold text-slate-400">
                        {pn.physio_name || 'Dr. David Chen, PT'}
                      </td>

                      <td className="py-4 pl-4 pr-6 text-right">
                        <RiskBadge
                          level={
                            flag.level as 'low' | 'watch' | 'high'
                          }
                          size="sm"
                        />
                      </td>
                    </tr>
                  );
                })}

                {filteredNotes.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-12 text-center text-sm text-slate-500"
                    >
                      No physio treatment notes found matching the selected status filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <PhysioModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        athleteId={selectedAthleteId}
      />
    </div>
  );
}
