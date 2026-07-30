'use client';

// =============================================================================
// AI Athlete Growth Platform
// Tournaments Discovery & Registration Hub (/dashboard/tournaments)
// =============================================================================

import React, { useState } from 'react';
import { useDemo } from '../../../context/DemoContext';
import { TournamentCard } from '../../../components/ui/TournamentCard';
import {
  Calendar,
  Filter,
  Search,
  Trophy,
  Users,
} from 'lucide-react';

export default function TournamentsPage() {
  const {
    tournaments,
    toggleTournamentRegistration,
    activeRole,
    activeUser,
    users,
    memberships,
  } = useDemo();

  const isStaffView = activeRole === 'coach' || activeRole === 'admin';

  const athleteUsers = users.filter((u) =>
    memberships.some((m) => m.user_id === u.id && m.role === 'athlete')
  );

  const [filterSport, setFilterSport] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const sports = [
    'All',
    'Track & Field',
    'Cross Country',
    'Indoor Track',
    'Olympic Trials',
  ];

  const visibleTournaments = tournaments.filter((t) => {
    if (filterSport !== 'All' && t.sport !== filterSport) return false;
    if (searchQuery) {
      const matchName = t.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchLoc = t.location
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchDet = t.details
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchName || matchLoc || matchDet;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Trophy className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Upcoming University &amp; NCAA Tournaments
            </h1>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Card-based tournament discovery with instant registration, compliance rules, and event schedule details.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl bg-blue-50 px-3.5 py-2 text-xs font-bold text-blue-900 dark:bg-slate-800 dark:text-slate-200">
          {isStaffView ? (
            <>
              <Users size={15} />
              <span>
                {tournaments.reduce((sum, t) => sum + t.registeredAthleteIds.length, 0)} Total Registration(s) Across Roster
              </span>
            </>
          ) : (
            <>
              <Calendar size={15} />
              <span>
                {tournaments.filter((t) => t.registeredAthleteIds.includes(activeUser.id)).length} Registered Meet(s)
              </span>
            </>
          )}
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400">
            <Filter size={14} />
            <span>Sport Division:</span>
          </span>
          {sports.map((sp) => (
            <button
              key={sp}
              onClick={() => setFilterSport(sp)}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                filterSport === sp
                  ? 'bg-blue-900 text-white shadow-sm dark:bg-emerald-600'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
              }`}
            >
              {sp}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tournament name or venue..."
            className="rounded-xl border border-slate-300 bg-white py-1.5 pl-8 pr-3 text-xs text-slate-900 placeholder-slate-400 focus:border-emerald-600 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          />
        </div>
      </div>

      {/* Tournament Cards Grid (No Table!) */}
      {visibleTournaments.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center dark:border-slate-800 dark:bg-slate-900">
          <Trophy className="h-12 w-12 text-slate-300 dark:text-slate-700" />
          <h3 className="mt-3 text-sm font-bold text-slate-900 dark:text-white">
            No tournaments match your filter
          </h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Try searching for another venue or division.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {visibleTournaments.map((tournament) =>
            isStaffView ? (
              <TournamentCard
                key={tournament.id}
                tournament={tournament}
                registrants={athleteUsers
                  .filter((a) => tournament.registeredAthleteIds.includes(a.id))
                  .map((a) => ({ id: a.id, name: a.name }))}
                totalEligible={athleteUsers.length}
              />
            ) : (
              <TournamentCard
                key={tournament.id}
                tournament={tournament}
                isRegistered={tournament.registeredAthleteIds.includes(activeUser.id)}
                onRegisterToggle={(id) => toggleTournamentRegistration(id)}
              />
            )
          )}
        </div>
      )}
    </div>
  );
}
