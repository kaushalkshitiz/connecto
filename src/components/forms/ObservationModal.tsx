'use client';

// =============================================================================
// Athlete Risk Intelligence Platform
// ObservationModal — Coach observation quick logger
// =============================================================================

import React, { useState } from 'react';
import { useDemo } from '../../context/DemoContext';
import { validateObservationInput } from '../../lib/validators';
import { AlertCircle, Eye, X } from 'lucide-react';

interface ObservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  athleteId: string;
  onSuccess?: () => void;
}

export function ObservationModal({
  isOpen,
  onClose,
  athleteId,
  onSuccess,
}: ObservationModalProps) {
  const { users, team, activeUser, addObservation } = useDemo();

  const athlete = users.find((u) => u.id === athleteId) || users[0];

  const [note, setNote] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);

    const validation = validateObservationInput({ note });
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      addObservation({
        athlete_id: athleteId,
        coach_id: activeUser.id,
        team_id: team.id,
        date: new Date().toISOString().slice(0, 10),
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
            <Eye className="text-blue-400" size={22} />
            <div>
              <h3 className="text-lg font-bold text-white">
                Log Coach Observation
              </h3>
              <p className="text-xs text-slate-400">
                Athlete: <span className="font-semibold text-blue-300">{athlete.name}</span>
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

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Observation Notes
            </label>
            <textarea
              rows={4}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Maya showed slight limp after 200m block starts. Recommended physio evaluation..."
              className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 p-3.5 text-sm text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none"
            />
            <p className="mt-1.5 text-[11px] text-slate-400">
              Observations are visible to Coaches, Physios, and Department Admins.
            </p>
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
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2 text-sm font-bold text-white shadow-lg shadow-blue-500/25 transition-all hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save Observation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
