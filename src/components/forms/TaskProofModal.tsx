'use client';

// =============================================================================
// AI Athlete Growth Platform
// TaskProofModal — Athlete uploads proof (optional image/link or notes) & marks complete
// =============================================================================

import React, { useState } from 'react';
import { useDemo } from '../../context/DemoContext';
import { TrainingTask } from '../../types';
import { CheckCircle2, Link as LinkIcon, Upload, X } from 'lucide-react';

interface TaskProofModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: TrainingTask | null;
  onSuccess?: () => void;
}

export function TaskProofModal({
  isOpen,
  onClose,
  task,
  onSuccess,
}: TaskProofModalProps) {
  const { updateTaskStatus } = useDemo();

  const [proofNote, setProofNote] = useState('');
  const [proofUrl, setProofUrl] = useState(
    'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !task) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      updateTaskStatus(
        task.id,
        'Completed',
        proofUrl.trim() || undefined,
        proofNote.trim() || 'Completed as assigned.'
      );
      setIsSubmitting(false);
      setProofNote('');
      if (onSuccess) onSuccess();
      onClose();
    }, 200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm dark:bg-slate-950/80">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-600 text-white">
              <Upload size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Upload Proof of Completion
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Task: <span className="font-semibold text-slate-700 dark:text-slate-300">{task.title}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-xs dark:border-slate-800 dark:bg-slate-950">
            <p className="font-bold text-slate-900 dark:text-white">
              Coach Instructions:
            </p>
            <p className="mt-1 text-slate-600 dark:text-slate-400">
              {task.instructions}
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Proof Note / Execution Comments (Optional)
            </label>
            <textarea
              rows={3}
              value={proofNote}
              onChange={(e) => setProofNote(e.target.value)}
              placeholder="e.g. Completed 3 sets of 5 depth jumps. Ground contact time averaged 220ms..."
              className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white p-3 text-sm text-slate-900 focus:border-emerald-600 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Video / Photo Proof URL (Optional)
            </label>
            <div className="relative mt-1.5">
              <LinkIcon
                size={14}
                className="absolute left-3 top-3 text-slate-400"
              />
              <input
                type="url"
                value={proofUrl}
                onChange={(e) => setProofUrl(e.target.value)}
                placeholder="https://..."
                className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-9 pr-4 text-xs text-slate-900 focus:border-emerald-600 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              />
            </div>
          </div>

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
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-emerald-700 disabled:opacity-50"
            >
              <CheckCircle2 size={15} />
              <span>{isSubmitting ? 'Submitting...' : 'Mark Task Complete'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
