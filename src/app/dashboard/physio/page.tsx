'use client';

// =============================================================================
// Athlete Risk Intelligence Platform
// Physio Dashboard — Full White & Dark UI support, medical injury logger
// =============================================================================

import React, { useState } from 'react';
import Link from 'next/link';
import { useDemo } from '../../../context/DemoContext';
import { RiskBadge } from '../../../components/ui/RiskBadge';
import { PhysioModal } from '../../../components/forms/PhysioModal';
import { canEditMedicalRecords, isRoleAllowedForRoute } from '../../../lib/rbac';
import { PhysioNote } from '../../../types';
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  HeartPulse,
  Info,
  Pencil,
  Plus,
  ShieldAlert,
  UserCheck,
} from 'lucide-react';

export default function PhysioDashboardPage() {
  const { users, memberships, physioNotes, riskFlags, team, activeRole } = useDemo();

  const canLogTreatment = canEditMedicalRecords(activeRole);

  const athleteUsers = users.filter((u) =>
    memberships.some((m) => m.user_id === u.id && m.role === 'athlete')
  );

  const [selectedAthleteId, setSelectedAthleteId] = useState<string>(
    athleteUsers[0]?.id || ''
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<PhysioNote | null>(null);
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
          <span className="inline-flex items-center gap-1 rounded-full border border-rose-300 bg-rose-100/90 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-rose-800 shadow-sm dark:border-rose-500/50 dark:bg-rose-950/80 dark:text-rose-300">
            <AlertCircle size={13} className="text-rose-600 dark:text-rose-400" />
            <span>Active Injury</span>
          </span>
        );
      case 'recovering':
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-amber-300 bg-amber-100/90 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-amber-800 shadow-sm dark:border-amber-500/50 dark:bg-amber-950/80 dark:text-amber-300">
            <span>Recovering</span>
          </span>
        );
      case 'cleared':
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-300 bg-emerald-100/90 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-emerald-800 shadow-sm dark:border-emerald-500/50 dark:bg-emerald-950/80 dark:text-emerald-300">
            <CheckCircle2 size={13} className="text-emerald-600 dark:text-emerald-400" />
            <span>Cleared</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-slate-300 bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 pb-12 transition-colors duration-300">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-6 rounded-3xl border border-slate-200 bg-gradient-to-br from-teal-50 via-white to-slate-50 p-6 shadow-xl dark:border-slate-800 dark:from-teal-950/60 dark:via-slate-900 dark:to-slate-950 dark:shadow-2xl sm:p-8 transition-all">
        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-300 bg-teal-50/90 px-3 py-1 text-xs font-bold uppercase tracking-wider text-teal-800 dark:border-teal-500/40 dark:bg-teal-950 dark:text-teal-300 shadow-sm">
            <span>Clinical Medical Portal</span>
          </span>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white sm:text-3xl">
            Physio Injury &amp; Treatment Hub
          </h1>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
            {team.name} • Physical Therapy &amp; Rehab Records
          </p>
        </div>

        {canLogTreatment && (
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={selectedAthleteId}
              onChange={(e) => setSelectedAthleteId(e.target.value)}
              className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900 shadow-sm focus:border-teal-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            >
              {athleteUsers.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} ({a.email.split('@')[0]})
                </option>
              ))}
            </select>

            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 dark:from-teal-500 dark:to-emerald-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-teal-600/25 dark:shadow-teal-500/30 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:from-teal-700 hover:to-emerald-700"
            >
              <Plus size={18} />
              <span>Log Injury / Treatment</span>
            </button>
          </div>
        )}
      </div>

      {/* Rule & Stats Bar */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-teal-900/40 dark:bg-teal-950/20 transition-all">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-300">
            <ShieldAlert size={15} />
            <span>Automatic Risk Escalation</span>
          </div>
          <p className="mt-1.5 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
            An <strong className="text-slate-900 dark:text-white">Active Injury</strong> note combined with any Watch condition automatically elevates an athlete to <strong className="text-rose-600 dark:text-rose-400">High Risk</strong>.
          </p>
        </div>

        <div className="rounded-2xl border border-rose-200 bg-rose-50/80 p-5 shadow-sm dark:border-rose-900/40 dark:bg-rose-950/20 transition-all">
          <p className="text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-300">
            Active Injuries
          </p>
          <p className="mt-1.5 text-3xl font-black text-rose-600 dark:text-rose-400">{activeCount}</p>
          <p className="mt-1 text-xs font-medium text-rose-600/80 dark:text-rose-400/80">
            Currently restricted / high risk trigger
          </p>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-5 shadow-sm dark:border-amber-900/40 dark:bg-amber-950/20 transition-all">
          <p className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300">
            Recovering
          </p>
          <p className="mt-1.5 text-3xl font-black text-amber-600 dark:text-amber-400">
            {recoveringCount}
          </p>
          <p className="mt-1 text-xs font-medium text-amber-600/80 dark:text-amber-400/80">
            Rehab progress on schedule
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-5 shadow-sm dark:border-emerald-900/40 dark:bg-emerald-950/20 transition-all">
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
            Cleared to Play
          </p>
          <p className="mt-1.5 text-3xl font-black text-emerald-600 dark:text-emerald-400">
            {clearedCount}
          </p>
          <p className="mt-1 text-xs font-medium text-emerald-600/80 dark:text-emerald-400/80">
            Full training return
          </p>
        </div>
      </div>

      {/* Filter and Notes List */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <h2 className="flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white">
            <HeartPulse className="text-teal-600 dark:text-teal-400" size={20} />
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
                className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all duration-200 ${
                  statusFilter === tab.id
                    ? 'bg-teal-600 text-white shadow-md shadow-teal-600/25'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table of Physio Notes */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md dark:border-slate-800 dark:bg-slate-900/60 dark:shadow-xl transition-all">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
                  <th className="py-4 pl-6 pr-4">Date</th>
                  <th className="py-4 px-4">Athlete Name</th>
                  <th className="py-4 px-4">Medical Status</th>
                  <th className="py-4 px-4">Clinical Treatment / Rehab Note</th>
                  <th className="py-4 px-4">Logged By</th>
                  <th className="py-4 pl-4 pr-6 text-right">Current Risk</th>
                  {canLogTreatment && (
                    <th className="py-4 pl-4 pr-6 text-right">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 text-sm">
                {filteredNotes.map((pn) => {
                  const athlete = users.find((u) => u.id === pn.athlete_id);
                  const flag =
                    riskFlags.find((rf) => rf.athlete_id === pn.athlete_id) || {
                      level: 'low',
                    };

                  return (
                    <tr
                      key={pn.id}
                      className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40"
                    >
                      <td className="py-4 pl-6 pr-4 font-bold text-slate-900 dark:text-white">
                        {pn.date}
                      </td>

                      <td className="py-4 px-4 font-bold text-slate-800 dark:text-slate-200">
                        {athlete ? (
                          isRoleAllowedForRoute(activeRole, `/dashboard/coach/${athlete.id}`) ? (
                            <Link
                              href={`/dashboard/coach/${athlete.id}`}
                              className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                            >
                              {athlete.name}
                            </Link>
                          ) : (
                            <span>{athlete.name}</span>
                          )
                        ) : (
                          'Unknown Athlete'
                        )}
                      </td>

                      <td className="py-4 px-4">{getStatusBadge(pn.status)}</td>

                      <td className="py-4 px-4 text-slate-700 dark:text-slate-200 max-w-md">
                        {pn.note}
                      </td>

                      <td className="py-4 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
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

                      {canLogTreatment && (
                        <td className="py-4 pl-4 pr-6 text-right">
                          <button
                            onClick={() => {
                              setEditingNote(pn);
                              setIsModalOpen(true);
                            }}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-teal-300 bg-teal-50 px-3 py-1.5 text-xs font-bold text-teal-800 shadow-sm transition-all hover:bg-teal-100 dark:border-teal-500/40 dark:bg-teal-950/60 dark:text-teal-300 dark:hover:bg-teal-900/60"
                          >
                            <Pencil size={13} />
                            <span>Edit</span>
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })}

                {filteredNotes.length === 0 && (
                  <tr>
                    <td
                      colSpan={canLogTreatment ? 7 : 6}
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
        onClose={() => {
          setIsModalOpen(false);
          setEditingNote(null);
        }}
        athleteId={selectedAthleteId}
        editingNote={editingNote}
      />
    </div>
  );
}
