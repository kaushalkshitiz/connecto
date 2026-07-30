'use client';

// =============================================================================
// Athlete Risk Intelligence Platform
// PhysioModal — White & Dark UI support, Injury and treatment logger
// =============================================================================

import React, { useEffect, useState } from 'react';
import { useDemo } from '../../context/DemoContext';
import { validatePhysioNoteInput } from '../../lib/validators';
import { PhysioNote, PhysioStatus } from '../../types';
import {
  AlertCircle,
  HeartPulse,
  X,
} from 'lucide-react';

interface PhysioModalProps {
  isOpen: boolean;
  onClose: () => void;
  athleteId: string;
  editingNote?: PhysioNote | null;
  onSuccess?: () => void;
}

export function PhysioModal({
  isOpen,
  onClose,
  athleteId,
  editingNote,
  onSuccess,
}: PhysioModalProps) {
  const { users, team, activeUser, addPhysioNote, updatePhysioNote } = useDemo();

  const isEditing = Boolean(editingNote);
  const athlete =
    users.find((u) => u.id === (editingNote ? editingNote.athlete_id : athleteId)) ||
    users[0];

  const [status, setStatus] = useState<PhysioStatus>('active');
  const [note, setNote] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-fill the form when opening in edit mode
  useEffect(() => {
    if (isOpen) {
      setStatus(editingNote ? editingNote.status : 'active');
      setNote(editingNote ? editingNote.note : '');
      setErrors([]);
    }
  }, [isOpen, editingNote]);

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
      if (editingNote) {
        updatePhysioNote(editingNote.id, { status, note: note.trim() });
      } else {
        addPhysioNote({
          athlete_id: athleteId,
          physio_id: activeUser.id,
          team_id: team.id,
          date: new Date().toISOString().slice(0, 10),
          status,
          note: note.trim(),
        });
      }

      setIsSubmitting(false);
      setNote('');
      if (onSuccess) onSuccess();
      onClose();
    }, 200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 dark:bg-slate-950/80 p-4 backdrop-blur-sm transition-colors">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 transition-all">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <HeartPulse className="text-teal-600 dark:text-teal-400" size={22} />
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {isEditing
                  ? 'Edit Physio Treatment / Injury Note'
                  : 'Log Physio Treatment / Injury Note'}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Athlete: <span className="font-semibold text-teal-600 dark:text-teal-300">{athlete.name}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {errors.length > 0 && (
          <div className="mt-4 rounded-xl border border-rose-300 bg-rose-50 p-3 text-xs text-rose-800 dark:border-rose-800/60 dark:bg-rose-950/40 dark:text-rose-300">
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
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
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
                      ? 'border-rose-300 bg-rose-100 text-rose-800 ring-2 ring-rose-400 dark:border-rose-500 dark:bg-rose-950/80 dark:text-rose-300 dark:ring-rose-500/50'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-400 dark:hover:border-slate-700',
                },
                {
                  id: 'recovering',
                  label: 'Recovering',
                  desc: 'Rehab / therapy progress normal',
                  colorClasses:
                    status === 'recovering'
                      ? 'border-amber-300 bg-amber-100 text-amber-800 ring-2 ring-amber-400 dark:border-amber-500 dark:bg-amber-950/80 dark:text-amber-300 dark:ring-amber-500/50'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-400 dark:hover:border-slate-700',
                },
                {
                  id: 'cleared',
                  label: 'Cleared',
                  desc: 'Full return to training',
                  colorClasses:
                    status === 'cleared'
                      ? 'border-emerald-300 bg-emerald-100 text-emerald-800 ring-2 ring-emerald-400 dark:border-emerald-500 dark:bg-emerald-950/80 dark:text-emerald-300 dark:ring-emerald-500/50'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-400 dark:hover:border-slate-700',
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
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Clinical Treatment / Rehab Note
            </label>
            <textarea
              rows={4}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Grade 1 left hamstring strain. Iced and compressed. Restricting high-velocity sprinting..."
              className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white p-3.5 text-sm text-slate-900 placeholder-slate-400 shadow-sm focus:border-teal-500 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder-slate-600"
            />
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 px-5 py-2 text-sm font-bold text-white shadow-lg shadow-teal-500/25 transition-all hover:from-teal-700 hover:to-emerald-700 disabled:opacity-50"
            >
              {isSubmitting
                ? 'Saving...'
                : isEditing
                ? 'Update Physio Note'
                : 'Save Physio Note'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
