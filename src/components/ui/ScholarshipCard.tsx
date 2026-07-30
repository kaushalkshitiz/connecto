'use client';

// =============================================================================
// AI Athlete Growth Platform
// ScholarshipCard — Card-based scholarship item (No simple table!)
// =============================================================================

import React from 'react';
import { Scholarship } from '../../types';
import {
  Calendar,
  CheckCircle2,
  DollarSign,
  GraduationCap,
  Sparkles,
  Users,
} from 'lucide-react';

interface ScholarshipCardProps {
  scholarship: Scholarship;
  /** Athlete view: whether the current athlete has applied, and a toggle handler. */
  isApplied?: boolean;
  onApplyToggle?: (id: string) => void;
  /** Coach/Admin view: show a read-only list of registered athletes instead of an Apply button. */
  registrants?: { id: string; name: string }[];
  totalEligible?: number;
}

export function ScholarshipCard({
  scholarship,
  isApplied = false,
  onApplyToggle,
  registrants,
  totalEligible,
}: ScholarshipCardProps) {
  const isStaffView = registrants !== undefined;

  const handleToggle = () => {
    if (onApplyToggle) {
      onApplyToggle(scholarship.id);
    }
  };

  const categoryBadgeColors = {
    'NCAA Div I':
      'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800',
    'Merit & Athletic':
      'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800',
    'Endowed Fellowship':
      'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800',
    International:
      'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800',
  }[scholarship.category] || 'bg-slate-100 text-slate-800 border-slate-300 dark:bg-slate-900 dark:text-slate-300';

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      <div>
        {/* Top Header Row: Category Badge & Amount */}
        <div className="flex items-center justify-between gap-2">
          <span
            className={`rounded-xl border px-2.5 py-1 text-xs font-bold uppercase tracking-wider ${categoryBadgeColors}`}
          >
            {scholarship.category}
          </span>
          <div className="flex items-center gap-1 text-sm font-extrabold text-emerald-700 dark:text-emerald-400">
            <DollarSign size={15} />
            <span>{scholarship.amount}</span>
          </div>
        </div>

        {/* Scholarship Name & Provider */}
        <h3 className="mt-3 text-base font-bold text-slate-900 dark:text-white">
          {scholarship.name}
        </h3>
        <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
          Provider: <span className="font-semibold text-slate-700 dark:text-slate-300">{scholarship.provider}</span>
        </p>

        {/* Eligibility Block */}
        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
            <GraduationCap size={15} className="text-blue-600 dark:text-blue-400" />
            <span>Eligibility Criteria:</span>
          </div>
          <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
            {scholarship.eligibility}
          </p>
        </div>

        {/* Description */}
        <p className="mt-3 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
          {scholarship.description}
        </p>

        {/* Coach/Admin: Registrant List */}
        {isStaffView && (
          <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-950">
            <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white">
              <span className="flex items-center gap-1.5">
                <Users size={15} className="text-emerald-600 dark:text-emerald-400" />
                <span>Registered Athletes</span>
              </span>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                {registrants!.length} / {totalEligible ?? registrants!.length} eligible
              </span>
            </div>
            {registrants!.length > 0 ? (
              <ul className="mt-2 space-y-1">
                {registrants!.map((r) => (
                  <li
                    key={r.id}
                    className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300"
                  >
                    <CheckCircle2 size={12} className="text-emerald-600 dark:text-emerald-400" />
                    <span>{r.name}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                No athletes have registered yet.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Footer Row: Deadline & Apply Button (Athlete view only) */}
      <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <Calendar size={14} className="text-slate-400" />
          <span>Deadline: {scholarship.deadline}</span>
        </div>

        {!isStaffView && (
          <button
            type="button"
            onClick={handleToggle}
            className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              isApplied
                ? 'border border-emerald-300 bg-emerald-50 text-emerald-800 shadow-sm dark:border-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300'
                : 'bg-blue-900 text-white shadow-md hover:bg-blue-800 dark:bg-emerald-600 dark:hover:bg-emerald-700'
            }`}
          >
            {isApplied ? (
              <>
                <CheckCircle2 size={15} className="text-emerald-600 dark:text-emerald-400" />
                <span>Applied</span>
              </>
            ) : (
              <>
                <Sparkles size={14} />
                <span>Apply Now</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
