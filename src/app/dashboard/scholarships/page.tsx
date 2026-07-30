'use client';

// =============================================================================
// AI Athlete Growth Platform
// Scholarship Discovery & Application Hub (/dashboard/scholarships)
// =============================================================================

import React, { useState } from 'react';
import { useDemo } from '../../../context/DemoContext';
import { ScholarshipCard } from '../../../components/ui/ScholarshipCard';
import {
  Filter,
  GraduationCap,
  Search,
  Sparkles,
  Users,
} from 'lucide-react';

export default function ScholarshipsPage() {
  const {
    scholarships,
    toggleScholarshipApplication,
    activeRole,
    activeUser,
    users,
    memberships,
  } = useDemo();

  const isStaffView = activeRole === 'coach' || activeRole === 'admin';

  const athleteUsers = users.filter((u) =>
    memberships.some((m) => m.user_id === u.id && m.role === 'athlete')
  );

  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    'All',
    'NCAA Div I',
    'Merit & Athletic',
    'Endowed Fellowship',
    'International',
  ];

  const visibleScholarships = scholarships.filter((s) => {
    if (filterCategory !== 'All' && s.category !== filterCategory) return false;
    if (searchQuery) {
      const matchName = s.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchProv = s.provider
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchElig = s.eligibility
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchName || matchProv || matchElig;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              NCAA &amp; Academic Scholarship Opportunities
            </h1>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Card-based scholarship discovery matching athletic performance and academic GPA with endowed university funds.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-3.5 py-2 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
          {isStaffView ? (
            <>
              <Users size={15} />
              <span>
                {scholarships.reduce((sum, s) => sum + s.appliedAthleteIds.length, 0)} Total Registration(s) Across Roster
              </span>
            </>
          ) : (
            <>
              <Sparkles size={15} />
              <span>
                {scholarships.filter((s) => s.appliedAthleteIds.includes(activeUser.id)).length} Applied Scholarship(s)
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
            <span>Category:</span>
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                filterCategory === cat
                  ? 'bg-blue-900 text-white shadow-sm dark:bg-emerald-600'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search scholarship name or provider..."
            className="rounded-xl border border-slate-300 bg-white py-1.5 pl-8 pr-3 text-xs text-slate-900 placeholder-slate-400 focus:border-emerald-600 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          />
        </div>
      </div>

      {/* Scholarship Cards Grid (No Table as requested!) */}
      {visibleScholarships.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center dark:border-slate-800 dark:bg-slate-900">
          <GraduationCap className="h-12 w-12 text-slate-300 dark:text-slate-700" />
          <h3 className="mt-3 text-sm font-bold text-slate-900 dark:text-white">
            No scholarships match your filter
          </h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Try clearing your search query or selecting a different category.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {visibleScholarships.map((sch) =>
            isStaffView ? (
              <ScholarshipCard
                key={sch.id}
                scholarship={sch}
                registrants={athleteUsers
                  .filter((a) => sch.appliedAthleteIds.includes(a.id))
                  .map((a) => ({ id: a.id, name: a.name }))}
                totalEligible={athleteUsers.length}
              />
            ) : (
              <ScholarshipCard
                key={sch.id}
                scholarship={sch}
                isApplied={sch.appliedAthleteIds.includes(activeUser.id)}
                onApplyToggle={(id) => toggleScholarshipApplication(id)}
              />
            )
          )}
        </div>
      )}
    </div>
  );
}
