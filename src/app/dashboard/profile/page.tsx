'use client';

// =============================================================================
// AI Athlete Growth Platform
// Athlete Profile Page (/dashboard/profile)
// =============================================================================

import React, { useState } from 'react';
import { useDemo } from '../../../context/DemoContext';
import {
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  GraduationCap,
  HeartPulse,
  Mail,
  ShieldCheck,
  Trophy,
  User,
  Zap,
} from 'lucide-react';

export default function ProfilePage() {
  const {
    activeUser,
    activeRole,
    getAthleteProfile,
    getAthleteRiskSummary,
    checkIns,
    tasks,
  } = useDemo();

  const profile = getAthleteProfile(activeUser.id) || {
    user_id: activeUser.id,
    photo_url: '',
    sport: 'NCAA Division I Track & Field',
    specialty: 'Sprinter / Hurdler',
    academic_year: 'Junior (2026)',
    gpa: '3.91',
    achievements: [
      'NCAA All-American Finalist (2025)',
      'Pac-12 100m Sprint Champion',
      'Stanford Athletic Honor Roll',
    ],
    bio:
      'NCAA All-American finalist specializing in 100m, 200m, and 4x100m relay sprints. Focused on optimizing ground contact symmetry and neuromuscular recovery.',
    training_streak: 14,
  };

  const riskSummary = getAthleteRiskSummary(activeUser.id);
  const userTasks = tasks.filter((t) => t.athlete_id === activeUser.id);
  const completedTasks = userTasks.filter((t) => t.status === 'Completed').length;

  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioText, setBioText] = useState(profile.bio);

  return (
    <div className="space-y-6">
      {/* Top Banner & Avatar Header */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-r from-blue-900 via-slate-900 to-slate-950 p-6 text-white shadow-xl dark:border-slate-800 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-emerald-500 text-3xl font-extrabold text-white shadow-md ring-4 ring-white/10">
              {activeUser.name.charAt(0)}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-bold text-emerald-300 ring-1 ring-emerald-400/30">
                  {profile.sport}
                </span>
                <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-semibold text-slate-200">
                  {profile.specialty}
                </span>
              </div>
              <h1 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">
                {activeUser.name}
              </h1>
              <p className="mt-1 flex items-center gap-2 text-xs text-slate-300">
                <Mail size={13} className="text-emerald-400" />
                <span>{activeUser.email}</span>
                <span>•</span>
                <span>{profile.academic_year}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="rounded-2xl border border-white/15 bg-white/10 p-3.5 text-center backdrop-blur-sm">
              <span className="text-[10px] uppercase tracking-wider text-slate-300 font-bold">
                Academic GPA
              </span>
              <p className="mt-0.5 text-xl font-extrabold text-emerald-300">
                {profile.gpa}
              </p>
            </div>

            <div className="rounded-2xl border border-white/15 bg-white/10 p-3.5 text-center backdrop-blur-sm">
              <span className="text-[10px] uppercase tracking-wider text-slate-300 font-bold">
                Active Streak
              </span>
              <p className="mt-0.5 text-xl font-extrabold text-white">
                {profile.training_streak} Days
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Academic Standing */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              NCAA Academic Standing
            </span>
            <GraduationCap size={18} className="text-blue-600 dark:text-blue-400" />
          </div>
          <p className="mt-2 text-base font-extrabold text-slate-900 dark:text-white">
            Eligible - Dean’s List
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Major: <strong className="text-slate-700 dark:text-slate-300">Computer Science &amp; Human Biology</strong>
          </p>
        </div>

        {/* Physio Injury Clearance */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Medical Clearance
            </span>
            <HeartPulse size={18} className="text-emerald-600 dark:text-emerald-400" />
          </div>
          <p className="mt-2 text-base font-extrabold text-emerald-700 dark:text-emerald-400">
            Cleared for Full Training
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Last physio screening: July 2026 (Passed)
          </p>
        </div>

        {/* Task Completion Rate */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Task Compliance Rate
            </span>
            <Trophy size={18} className="text-amber-500" />
          </div>
          <p className="mt-2 text-base font-extrabold text-slate-900 dark:text-white">
            {userTasks.length > 0
              ? `${Math.round((completedTasks / userTasks.length) * 100)}% (${completedTasks}/${userTasks.length})`
              : '100% (No Tasks Pending)'}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Assigned training &amp; recovery protocol compliance
          </p>
        </div>
      </div>

      {/* Bio / Athlete Development Objectives */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-blue-900 dark:text-emerald-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Athlete Bio &amp; Development Objectives
            </h3>
          </div>
          <button
            type="button"
            onClick={() => setIsEditingBio(!isEditingBio)}
            className="rounded-xl border border-slate-200 px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            {isEditingBio ? 'Save Changes' : 'Edit Profile Bio'}
          </button>
        </div>

        {isEditingBio ? (
          <div className="mt-4 space-y-3">
            <textarea
              rows={4}
              value={bioText}
              onChange={(e) => setBioText(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-sm text-slate-900 focus:border-emerald-600 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
            <div className="flex justify-end">
              <button
                onClick={() => setIsEditingBio(false)}
                className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-700"
              >
                Update Profile
              </button>
            </div>
          </div>
        ) : (
          <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            {bioText}
          </p>
        )}
      </div>

      {/* Physiological Readiness History Summary */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          7-Day Physiological Averages
        </h3>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Synthesized from daily check-ins for coach &amp; physio load monitoring.
        </p>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-950">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Avg Sleep Duration
            </span>
            <p className="mt-1 text-xl font-extrabold text-slate-900 dark:text-white">
              {riskSummary.sevenDayAvgSleep
                ? `${riskSummary.sevenDayAvgSleep.toFixed(1)} hrs / night`
                : '7.8 hrs / night'}
            </p>
          </div>
          <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-950">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Avg Soreness Level
            </span>
            <p className="mt-1 text-xl font-extrabold text-slate-900 dark:text-white">
              {riskSummary.sevenDayAvgSoreness
                ? `${riskSummary.sevenDayAvgSoreness.toFixed(1)} / 5`
                : '2.1 / 5'}
            </p>
          </div>
          <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-950">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Avg Mood &amp; Energy
            </span>
            <p className="mt-1 text-xl font-extrabold text-slate-900 dark:text-white">
              {riskSummary.sevenDayAvgMood
                ? `${riskSummary.sevenDayAvgMood.toFixed(1)} / 5`
                : '4.2 / 5'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
