'use client';

// =============================================================================
// Athlete Risk Intelligence Platform
// CheckInModal — Mobile-first one-handed check-in form with sliders
// =============================================================================

import React, { useState } from 'react';
import { useDemo } from '../../context/DemoContext';
import { validateCheckInInput } from '../../lib/validators';
import {
  Activity,
  AlertCircle,
  Moon,
  Smile,
  X,
  Zap,
} from 'lucide-react';

interface CheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
  athleteId?: string;
  onSuccess?: () => void;
}

export function CheckInModal({
  isOpen,
  onClose,
  athleteId,
  onSuccess,
}: CheckInModalProps) {
  const { users, team, addCheckIn, activeUser } = useDemo();

  const targetAthleteId = athleteId || activeUser.id;
  const targetAthlete =
    users.find((u) => u.id === targetAthleteId) || activeUser;

  const [sleepHours, setSleepHours] = useState<number>(7.5);
  const [soreness, setSoreness] = useState<number>(2);
  const [mood, setMood] = useState<number>(4);
  const [rpe, setRpe] = useState<number | ''>('');
  const [note, setNote] = useState<string>('');
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const sorenessLabels: Record<number, { text: string; color: string }> = {
    1: { text: '1 - Fresh & pain-free', color: 'text-emerald-400' },
    2: { text: '2 - Minimal soreness', color: 'text-emerald-300' },
    3: { text: '3 - Moderate stiffness', color: 'text-amber-400' },
    4: { text: '4 - High soreness (Watch threshold)', color: 'text-amber-500 font-bold' },
    5: { text: '5 - Extreme / debilitating soreness', color: 'text-rose-500 font-bold' },
  };

  const moodLabels: Record<number, { text: string; color: string }> = {
    1: { text: '1 - Very low / high stress', color: 'text-rose-400' },
    2: { text: '2 - Sluggish / strained', color: 'text-amber-400' },
    3: { text: '3 - Okay / baseline', color: 'text-slate-300' },
    4: { text: '4 - Good energy', color: 'text-emerald-300' },
    5: { text: '5 - Excellent / highly motivated', color: 'text-emerald-400' },
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);

    const validation = validateCheckInInput({
      sleep_hours: sleepHours,
      soreness,
      mood,
      rpe: rpe === '' ? undefined : rpe,
      note: note.trim() === '' ? undefined : note.trim(),
    });

    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      addCheckIn({
        athlete_id: targetAthleteId,
        team_id: team.id,
        date: new Date().toISOString().slice(0, 10),
        sleep_hours: sleepHours,
        soreness,
        mood,
        rpe: rpe === '' ? null : Number(rpe),
        note: note.trim() === '' ? null : note.trim(),
      });

      setIsSubmitting(false);
      if (onSuccess) onSuccess();
      onClose();
    }, 200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl ring-1 ring-white/10">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-xl font-bold tracking-tight text-white">
              Daily Athlete Check-In
            </h3>
            <p className="text-xs text-slate-400">
              Submitting for <span className="font-semibold text-emerald-400">{targetAthlete.name}</span>
            </p>
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
              <span>Please check your submission:</span>
            </div>
            <ul className="mt-1 list-inside list-disc space-y-0.5">
              {errors.map((err, idx) => (
                <li key={idx}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-6">
          {/* 1. Sleep Hours Slider */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                <Moon size={18} className="text-blue-400" />
                <span>Sleep Last Night</span>
              </label>
              <span className="rounded-lg bg-blue-950/80 px-3 py-1 text-base font-bold text-blue-300 border border-blue-800/50">
                {sleepHours} hrs
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="12"
              step="0.5"
              value={sleepHours}
              onChange={(e) => setSleepHours(Number(e.target.value))}
              className="mt-3 h-2.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-800 accent-blue-500"
            />
            <div className="mt-1.5 flex justify-between text-[11px] text-slate-500 font-medium">
              <span>0 hrs</span>
              <span className="text-amber-400">6.0 hrs (Watch Threshold)</span>
              <span>12+ hrs</span>
            </div>
          </div>

          {/* 2. Soreness Rating Slider */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                <Activity size={18} className="text-amber-400" />
                <span>Muscle Soreness / Fatigue</span>
              </label>
              <span className="rounded-lg bg-amber-950/80 px-3 py-1 text-base font-bold text-amber-300 border border-amber-800/50">
                {soreness} / 5
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={soreness}
              onChange={(e) => setSoreness(Number(e.target.value))}
              className="mt-3 h-2.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-800 accent-amber-500"
            />
            <p className={`mt-2 text-xs ${sorenessLabels[soreness]?.color || 'text-slate-400'}`}>
              {sorenessLabels[soreness]?.text}
            </p>
          </div>

          {/* 3. Mood / Stress Rating Slider */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                <Smile size={18} className="text-emerald-400" />
                <span>Mood & Stress Level</span>
              </label>
              <span className="rounded-lg bg-emerald-950/80 px-3 py-1 text-base font-bold text-emerald-300 border border-emerald-800/50">
                {mood} / 5
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={mood}
              onChange={(e) => setMood(Number(e.target.value))}
              className="mt-3 h-2.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-800 accent-emerald-500"
            />
            <p className={`mt-2 text-xs ${moodLabels[mood]?.color || 'text-slate-400'}`}>
              {moodLabels[mood]?.text}
            </p>
          </div>

          {/* 4. Optional RPE & Notes */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                <Zap size={14} className="text-amber-400" />
                <span>Session RPE (1-10, Optional)</span>
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={rpe}
                onChange={(e) =>
                  setRpe(e.target.value === '' ? '' : Number(e.target.value))
                }
                placeholder="e.g. 7"
                className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300">
                <span>Notes / How do you feel?</span>
              </label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g. Right calf tight after sprints..."
                className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Buttons */}
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
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-5 py-2 text-sm font-bold text-white shadow-lg shadow-emerald-500/25 transition-all hover:from-emerald-600 hover:to-teal-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Check-In'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
