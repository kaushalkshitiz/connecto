'use client';

// =============================================================================
// Athlete Risk Intelligence Platform
// ReassignCoachModal — Reassign athletes without data loss (ON DELETE SET NULL)
// =============================================================================

import React, { useState } from 'react';
import { useDemo } from '../../context/DemoContext';
import { ShieldAlert, UserCheck, X } from 'lucide-react';

interface ReassignCoachModalProps {
  isOpen: boolean;
  onClose: () => void;
  athleteId: string;
}

export function ReassignCoachModal({
  isOpen,
  onClose,
  athleteId,
}: ReassignCoachModalProps) {
  const { users, memberships, reassignAthleteCoach } = useDemo();

  const athlete = users.find((u) => u.id === athleteId) || users[0];

  const coaches = users.filter((u) =>
    memberships.some((m) => m.user_id === u.id && m.role === 'coach')
  );

  const [selectedCoachId, setSelectedCoachId] = useState<string>(
    coaches[0]?.id || ''
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      reassignAthleteCoach(
        athleteId,
        selectedCoachId === 'unassign' ? null : selectedCoachId
      );
      setIsSubmitting(false);
      onClose();
    }, 200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl ring-1 ring-white/10">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <UserCheck className="text-purple-400" size={22} />
            <div>
              <h3 className="text-lg font-bold text-white">
                Reassign Athlete Coach
              </h3>
              <p className="text-xs text-slate-400">
                Athlete: <span className="font-semibold text-purple-300">{athlete.name}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mt-4 rounded-xl border border-purple-800/50 bg-purple-950/30 p-3.5 text-xs text-purple-200">
          <div className="flex items-center gap-1.5 font-bold text-purple-300">
            <ShieldAlert size={16} />
            <span>Data Preservation Guarantee:</span>
          </div>
          <p className="mt-1 leading-relaxed">
            All historical check-ins, coach observations, and physio notes are owned by the university record. Reassigning or unassigned coaches uses database foreign key{' '}
            <code className="rounded bg-purple-900/80 px-1 py-0.5 font-mono text-[11px] text-purple-200">
              ON DELETE SET NULL
            </code>{' '}
            with 0% data loss.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Assign to Coach
            </label>
            <select
              value={selectedCoachId}
              onChange={(e) => setSelectedCoachId(e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm font-medium text-white focus:border-purple-500 focus:outline-none"
            >
              {coaches.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.email})
                </option>
              ))}
              <option value="unassign">-- Unassign Coach (Set Null) --</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-slate-800 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-2 text-sm font-bold text-white shadow-lg shadow-purple-500/25 transition-all hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Updating...' : 'Confirm Assignment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
