'use client';

// =============================================================================
// AI Athlete Growth Platform
// TournamentCard — Card-based tournament discovery item
// =============================================================================

import React, { useState } from 'react';
import { Tournament } from '../../types';
import {
  Calendar,
  CheckCircle2,
  ChevronRight,
  MapPin,
  Trophy,
} from 'lucide-react';

interface TournamentCardProps {
  tournament: Tournament;
  onRegisterToggle?: (id: string) => void;
}

export function TournamentCard({
  tournament,
  onRegisterToggle,
}: TournamentCardProps) {
  const [registered, setRegistered] = useState(tournament.registered || false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const handleToggle = () => {
    setRegistered(!registered);
    if (onRegisterToggle) {
      onRegisterToggle(tournament.id);
    }
  };

  const statusBadgeColors = {
    Open: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800',
    'Closing Soon':
      'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800',
    Registered:
      'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800',
    Closed:
      'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700',
  }[tournament.registration_status];

  return (
    <>
      <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
        <div>
          {/* Top Header Row: Sport tag & Registration Status */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {tournament.sport}
            </span>
            <span
              className={`rounded-xl border px-2.5 py-1 text-xs font-bold uppercase tracking-wider ${statusBadgeColors}`}
            >
              {tournament.registration_status}
            </span>
          </div>

          {/* Tournament Name */}
          <h3 className="mt-3 text-base font-bold text-slate-900 dark:text-white">
            {tournament.name}
          </h3>

          {/* Location & Date */}
          <div className="mt-3 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-1.5 font-medium">
              <MapPin size={14} className="text-blue-600 dark:text-blue-400" />
              <span>{tournament.location}</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium">
              <Calendar size={14} className="text-emerald-600 dark:text-emerald-400" />
              <span>{tournament.date}</span>
            </div>
          </div>

          {/* Summary Details */}
          <p className="mt-4 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
            {tournament.details}
          </p>
        </div>

        {/* Footer Row: View Details Button & Register Toggle */}
        <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setShowDetailsModal(true)}
            className="inline-flex items-center gap-1 text-xs font-bold text-blue-900 hover:underline dark:text-emerald-400"
          >
            <span>View Details</span>
            <ChevronRight size={14} />
          </button>

          <button
            type="button"
            onClick={handleToggle}
            disabled={tournament.registration_status === 'Closed'}
            className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              registered
                ? 'border border-blue-300 bg-blue-50 text-blue-900 shadow-sm dark:border-blue-700 dark:bg-blue-950/80 dark:text-blue-300'
                : tournament.registration_status === 'Closed'
                ? 'cursor-not-allowed bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-600'
                : 'bg-emerald-600 text-white shadow-md hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700'
            }`}
          >
            {registered ? (
              <>
                <CheckCircle2 size={15} className="text-blue-600 dark:text-blue-400" />
                <span>Registered</span>
              </>
            ) : tournament.registration_status === 'Closed' ? (
              <span>Registration Closed</span>
            ) : (
              <>
                <Trophy size={14} />
                <span>Register Athlete</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Details Modal */}
      {showDetailsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm dark:bg-slate-950/80">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-900 text-white dark:bg-emerald-600">
                  <Trophy size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {tournament.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {tournament.sport}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowDetailsModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                &times;
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs text-slate-700 dark:text-slate-300">
              <div className="rounded-xl bg-slate-50 p-3.5 dark:bg-slate-950">
                <span className="font-bold text-slate-900 dark:text-white">
                  Event Overview:
                </span>
                <p className="mt-1 leading-relaxed">{tournament.details}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-800">
                  <span className="text-[10px] uppercase text-slate-400 font-bold">
                    Venue
                  </span>
                  <p className="mt-0.5 font-semibold text-slate-900 dark:text-white">
                    {tournament.location}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-800">
                  <span className="text-[10px] uppercase text-slate-400 font-bold">
                    Schedule Date
                  </span>
                  <p className="mt-0.5 font-semibold text-slate-900 dark:text-white">
                    {tournament.date}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 p-3.5 dark:border-slate-800">
                <span className="font-bold text-slate-900 dark:text-white">
                  NCAA &amp; Olympic Qualification Rules:
                </span>
                <p className="mt-1 text-slate-600 dark:text-slate-400">
                  All competing university athletes must have valid NCAA eligibility compliance status and a completed injury clearance form from the team physiotherapist.
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3 border-t border-slate-200 pt-4 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowDetailsModal(false)}
                className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  handleToggle();
                  setShowDetailsModal(false);
                }}
                disabled={tournament.registration_status === 'Closed'}
                className="rounded-xl bg-blue-900 px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 disabled:opacity-50"
              >
                {registered ? 'Cancel Registration' : 'Confirm Registration'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
