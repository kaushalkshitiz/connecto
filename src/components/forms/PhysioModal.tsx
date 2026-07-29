'use client';

// =============================================================================
// Athlete Risk Intelligence Platform
// PhysioModal — Injury and treatment logger with status tags
// =============================================================================

import React, { useState } from 'react';
import { useDemo } from '../../context/DemoContext';
import { validatePhysioNoteInput } from '../../lib/validators';
import { PhysioStatus } from '../../types';
import {
  AlertCircle,
  HeartPulse,
  X,
} from 'lucide-react';

interface PhysioModalProps {
  isOpen: boolean;
  onClose: () => void;
  athleteId: string;
  onSuccess?: () => void;
}

export function PhysioModal({
  isOpen,
  onClose,
  athleteId,
  onSuccess,
}: PhysioModalProps) {
  const { users, team, activeUser, addPhysioNote } = useDemo();

  const athlete = users.find((u) => u.id === athleteId) || users[0];

  const [status, setStatus] = useState<PhysioStatus>('active');
  const [note, setNote] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);

    const validation = validatePhysioNoteInput({ status, note });
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      addPhysioNote({
        athlete_id: athleteId,
        physio_id: activeUser.id,
        team_id: team.id,
        date: new Date().toISOString().slice(0, 10),
        status,
        note: note.trim(),
      });

      setIsSubmitting(false);
      setNote('');
      if (onSuccess) onSuccess();
      onClose();
    }, 200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl ring-1 ring-white/10">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <HeartPulse className="text-teal-400" size={22} />
            <div>
              <h3 className="text-lg font-bold text-white">
                Log Physio Treatment / Injury Note
              </h3>
              <p className="text-xs text-slate-400">
                Athlete: <span className="font-semibold text-teal-300">{athlete.name}</span>
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

        {errors.length > 0 && (
          <div className="mt-4 rounded-xl border border-rose-800/60 bg-rose-950/40 p-3 text-xs text-rose-300">
            <div className="flex items-center gap-1.5 font-bold">
              <AlertCircle size={15} />
              <span>Please check your entry:</span>
            </div>
            <ul className="mt-1 list-inside list-disc space-y-0.5">
              {errors.map((err, idx) => (
                <li key={idx}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-5">
          {/* Status Tag Picker */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Injury / Medical Status Tag
            </label>
            <div className="mt-2 grid grid-cols-3 gap-3">
              {[
                {
                  id: 'active',
                  label: 'Active Injury',
                  desc: 'Triggers High Risk if combined with Watch conditions',
                  colorClasses:
                    status === 'active'
                      ? 'border-rose-500 bg-rose-950/80 text-rose-300 ring-2 ring-rose-500/50'
                      : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700',
                },
                {
                  id: 'recovering',
                  label: 'Recovering',
                  desc: 'Rehab / therapy progress normal',
                  colorClasses:
                    status === 'recovering'
                      ? 'border-amber-500 bg-amber-950/80 text-amber-300 ring-2 ring-amber-500/50'
                      : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700',
                },
                {
                  id: 'cleared',
                  label: 'Cleared',
                  desc: 'Full return to training',
                  colorClasses:
                    status === 'cleared'
                      ? 'border-emerald-500 bg-emerald-950/80 text-emerald-300 ring-2 ring-emerald-500/50'
                      : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700',
                },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setStatus(item.id as PhysioStatus)}
                  className={`flex flex-col items-center justify-center rounded-xl border p-3 text-center transition-all ${item.colorClasses}`}
                >
                  <span className="text-sm font-bold">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Clinical Treatment / Rehab Note
            </label>
            <textarea
              rows={4}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Grade 1 left hamstring strain. Iced and compressed. Restricting high-velocity sprinting..."
              className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 p-3.5 text-sm text-white placeholder-slate-600 focus:border-teal-500 focus:outline-none"
            />
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
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 px-5 py-2 text-sm font-bold text-white shadow-lg shadow-teal-500/25 transition-all hover:from-teal-700 hover:to-emerald-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save Physio Note'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
