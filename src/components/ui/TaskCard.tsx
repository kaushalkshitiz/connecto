'use client';

// =============================================================================
// AI Athlete Growth Platform
// TaskCard — Individual training task card with athlete completion & proof
// =============================================================================

import React, { useState } from 'react';
import { TaskStatus, TrainingTask } from '../../types';
import {
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileText,
  Upload,
  User,
} from 'lucide-react';

interface TaskCardProps {
  task: TrainingTask;
  onStatusChange?: (id: string, status: TaskStatus) => void;
  onUploadProof?: (task: TrainingTask) => void;
  athleteName?: string;
  isCoachView?: boolean;
}

export function TaskCard({
  task,
  onStatusChange,
  onUploadProof,
  athleteName,
  isCoachView = false,
}: TaskCardProps) {
  const difficultyStyles = {
    Low: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800',
    Medium:
      'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800',
    High: 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800',
  }[task.difficulty];

  const statusBadgeStyles = {
    Pending:
      'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
    'In Progress':
      'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800',
    Completed:
      'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800',
  }[task.status];

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      <div>
        {/* Top Header Row: Category, Difficulty, and Status */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              {task.category}
            </span>
            <span
              className={`rounded-lg border px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ${difficultyStyles}`}
            >
              {task.difficulty} Difficulty
            </span>
          </div>

          <span
            className={`rounded-lg border px-2.5 py-1 text-xs font-bold ${statusBadgeStyles}`}
          >
            {task.status}
          </span>
        </div>

        {/* Task Title */}
        <h3 className="mt-3 text-sm font-bold text-slate-900 dark:text-white">
          {task.title}
        </h3>

        {/* Athlete assignment name if viewed by Coach */}
        {athleteName && (
          <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
            <User size={13} className="text-blue-600 dark:text-blue-400" />
            <span>Assigned to: <strong className="text-slate-700 dark:text-slate-300">{athleteName}</strong></span>
          </p>
        )}

        {/* Instructions */}
        <p className="mt-2.5 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
          {task.instructions}
        </p>

        {/* Proof of completion preview if uploaded */}
        {task.status === 'Completed' && task.proof_note && (
          <div className="mt-3.5 rounded-xl border border-emerald-200 bg-emerald-50/70 p-3 text-xs text-emerald-900 dark:border-emerald-800/60 dark:bg-emerald-950/40 dark:text-emerald-300">
            <div className="flex items-center gap-1.5 font-bold">
              <CheckCircle2 size={14} className="text-emerald-600 dark:text-emerald-400" />
              <span>Completion Proof Verified:</span>
            </div>
            <p className="mt-1 text-slate-700 dark:text-slate-300">
              &ldquo;{task.proof_note}&rdquo;
            </p>
            {task.proof_url && (
              <a
                href={task.proof_url}
                target="_blank"
                rel="noreferrer"
                className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:underline dark:text-blue-400"
              >
                <span>View Attached Proof File</span>
                <ExternalLink size={12} />
              </a>
            )}
          </div>
        )}
      </div>

      {/* Footer Row: Deadline & Actions */}
      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3.5 dark:border-slate-800">
        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
          <Calendar size={14} className="text-slate-400" />
          <span>Due: {task.deadline}</span>
        </div>

        {/* Action controls */}
        {!isCoachView && (
          <div className="flex items-center gap-2">
            {task.status !== 'Completed' ? (
              <>
                {onUploadProof && (
                  <button
                    type="button"
                    onClick={() => onUploadProof(task)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                  >
                    <Upload size={13} />
                    <span>Upload Proof</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() =>
                    onStatusChange && onStatusChange(task.id, 'Completed')
                  }
                  className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700"
                >
                  <CheckCircle2 size={14} />
                  <span>Mark Complete</span>
                </button>
              </>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 size={15} />
                <span>Task Finished</span>
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
