'use client';

// =============================================================================
// AI Athlete Growth Platform
// TaskAssignModal — Coach assigns task with Deadline, Difficulty & Instructions
// =============================================================================

import React, { useState } from 'react';
import { useDemo } from '../../context/DemoContext';
import { TaskDifficulty } from '../../types';
import {
  Calendar,
  CheckSquare,
  FileText,
  User,
  X,
} from 'lucide-react';

interface TaskAssignModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultAthleteId?: string;
  onSuccess?: () => void;
}

export function TaskAssignModal({
  isOpen,
  onClose,
  defaultAthleteId,
  onSuccess,
}: TaskAssignModalProps) {
  const { users, activeUser, addTask } = useDemo();

  const athletes = users.filter((u) => !u.email.includes('stanford-athletics'));

  const [athleteId, setAthleteId] = useState(
    defaultAthleteId || athletes[0]?.id || ''
  );
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Sprint Drills');
  const [difficulty, setDifficulty] = useState<TaskDifficulty>('Medium');
  const [deadline, setDeadline] = useState('2026-08-01');
  const [instructions, setInstructions] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !instructions.trim()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      addTask({
        athlete_id: athleteId,
        coach_id: activeUser.id,
        title: title.trim(),
        instructions: instructions.trim(),
        deadline,
        difficulty,
        category,
      });

      setIsSubmitting(false);
      setTitle('');
      setInstructions('');
      if (onSuccess) onSuccess();
      onClose();
    }, 200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm dark:bg-slate-950/80">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-900 text-white dark:bg-emerald-600">
              <CheckSquare size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Assign Training Task
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Coach: <span className="font-semibold text-slate-700 dark:text-slate-300">{activeUser.name}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Athlete selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Assign to Athlete
            </label>
            <select
              value={athleteId}
              onChange={(e) => setAthleteId(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm focus:border-blue-900 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            >
              {athletes.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} ({a.email})
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Task Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Complete 4x100m Relay Hand-off Drill Video Review"
              className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm focus:border-blue-900 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
          </div>

          {/* Category & Difficulty & Deadline */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              >
                <option value="Sprint Drills">Sprint Drills</option>
                <option value="Strength">Strength</option>
                <option value="Recovery">Recovery</option>
                <option value="Video Analysis">Video Analysis</option>
                <option value="Endurance">Endurance</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as TaskDifficulty)}
                className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Deadline
              </label>
              <input
                type="date"
                required
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              />
            </div>
          </div>

          {/* Instructions */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Detailed Instructions
            </label>
            <textarea
              rows={4}
              required
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Provide exact execution steps, target heart rate, or video angles required..."
              className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white p-3.5 text-sm text-slate-900 shadow-sm focus:border-blue-900 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-4 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-blue-900 px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-blue-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Assigning...' : 'Assign Task to Athlete'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
