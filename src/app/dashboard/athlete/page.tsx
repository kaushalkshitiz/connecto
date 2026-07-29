'use client';

// =============================================================================
// AI Athlete Growth Platform
// Athlete Dashboard (/dashboard/athlete) — Full AI Insights, Tasks, Recovery & Opportunities
// =============================================================================

import React, { useState } from 'react';
import Link from 'next/link';
import { useDemo } from '../../../context/DemoContext';
import { RiskBadge } from '../../../components/ui/RiskBadge';
import { CheckInModal } from '../../../components/forms/CheckInModal';
import { AIInsightCard } from '../../../components/ui/AIInsightCard';
import { TaskCard } from '../../../components/ui/TaskCard';
import { ScholarshipCard } from '../../../components/ui/ScholarshipCard';
import { TournamentCard } from '../../../components/ui/TournamentCard';
import {
  Activity,
  Award,
  Calendar,
  CheckCircle2,
  CheckSquare,
  ChevronRight,
  Clock,
  GraduationCap,
  HeartPulse,
  Info,
  Moon,
  Plus,
  Smile,
  Sparkles,
  Trophy,
  Zap,
} from 'lucide-react';

export default function AthleteDashboardPage() {
  const {
    activeUser,
    users,
    getAthleteRiskSummary,
    tasks,
    scholarships,
    tournaments,
    aiInsights,
    updateTaskStatus,
    toggleScholarshipApplication,
    toggleTournamentRegistration,
  } = useDemo();

  const athleteUser =
    users.find((u) => u.id === activeUser.id) ||
    users.find((u) => u.email.includes('maya')) ||
    users[5];

  const summary = getAthleteRiskSummary(athleteUser.id);
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);

  // Filter tasks for this athlete
  const athleteTasks = tasks.filter((t) => t.athlete_id === athleteUser.id);
  const pendingTasks = athleteTasks.filter((t) => t.status !== 'Completed');
  const completedTasks = athleteTasks.filter((t) => t.status === 'Completed');

  // Filter AI insights for this athlete (fallback to first insight if general)
  const athleteInsights = aiInsights.filter(
    (i) => !i.athlete_id || i.athlete_id === athleteUser.id
  );

  return (
    <div className="space-y-8 pb-12 transition-colors duration-300">
      {/* 1. Welcome Section & Training Streak */}
      <div className="flex flex-wrap items-center justify-between gap-6 rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-blue-50/40 p-6 shadow-sm dark:border-slate-800 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 sm:p-8">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-800 dark:border-emerald-500/40 dark:bg-emerald-950 dark:text-emerald-300">
              <span>Athlete Growth Portal</span>
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-900 dark:bg-slate-800 dark:text-slate-200">
              <Zap size={13} className="text-emerald-500" />
              <span>14-Day Training Streak</span>
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Welcome back, {athleteUser.name}
          </h1>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
            NCAA Division I Track &amp; Field • Today&rsquo;s Readiness &amp; Action Plan
          </p>
        </div>

        {/* Quick Check-In CTA */}
        <div>
          <button
            onClick={() => setIsCheckInModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-2xl bg-blue-900 px-6 py-3.5 text-sm font-extrabold text-white shadow-lg transition-all hover:bg-blue-800 dark:bg-emerald-600 dark:hover:bg-emerald-700"
          >
            <Plus size={18} />
            <span>Log Today&rsquo;s Daily Check-In</span>
          </button>
        </div>
      </div>

      {/* 2. MOST IMPORTANT SECTION: AI INSIGHTS CARD */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
              AI Physiological &amp; Performance Insights
            </h2>
          </div>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Real-time recommendations from 7-day trend analysis
          </span>
        </div>

        {athleteInsights.length > 0 ? (
          <div className="space-y-4">
            {athleteInsights.map((insight) => (
              <AIInsightCard key={insight.id} insight={insight} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              All physiological indicators are within optimal baseline!
            </p>
          </div>
        )}
      </div>

      {/* 3. Performance Summary & Recovery Status */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Current Risk Status
          </span>
          <div className="mt-3">
            <RiskBadge level={summary.currentRisk.level} size="lg" />
          </div>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            Updated from your last check-in
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              7-Day Avg Sleep
            </span>
            <Moon size={16} className="text-blue-600 dark:text-blue-400" />
          </div>
          <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
            {summary.sevenDayAvgSleep
              ? `${summary.sevenDayAvgSleep.toFixed(1)}h`
              : '7.8h'}
          </p>
          <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">
            Target: &gt;7.5h / night
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Soreness Level
            </span>
            <Activity size={16} className="text-amber-500" />
          </div>
          <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
            {summary.sevenDayAvgSoreness
              ? `${summary.sevenDayAvgSoreness.toFixed(1)}/5`
              : '2.0/5'}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            1 = No sore, 5 = Severe
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Mood &amp; Energy
            </span>
            <Smile size={16} className="text-emerald-500" />
          </div>
          <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
            {summary.sevenDayAvgMood
              ? `${summary.sevenDayAvgMood.toFixed(1)}/5`
              : '4.2/5'}
          </p>
          <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">
            Optimal Readiness
          </p>
        </div>
      </div>

      {/* 4. Today's Training Tasks */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckSquare className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
              Today&rsquo;s Training &amp; Recovery Tasks
            </h2>
          </div>
          <Link
            href="/dashboard/tasks"
            className="flex items-center gap-1 text-xs font-bold text-blue-900 hover:underline dark:text-emerald-400"
          >
            <span>View All Tasks ({athleteTasks.length})</span>
            <ChevronRight size={14} />
          </Link>
        </div>

        {athleteTasks.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              No tasks assigned for today.
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Check back later or visit the Tasks tab.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {athleteTasks.slice(0, 3).map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onStatusChange={(id, status) => updateTaskStatus(id, status)}
              />
            ))}
          </div>
        )}
      </div>

      {/* 5. Coach Feedback & Recent Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Coach Observations */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Coach Feedback &amp; Performance Notes
          </h3>
          <div className="mt-4 space-y-3">
            {summary.recentObservations.length > 0 ? (
              summary.recentObservations.map((obs) => (
                <div
                  key={obs.id}
                  className="rounded-xl border border-slate-100 bg-slate-50 p-3.5 text-xs dark:border-slate-800 dark:bg-slate-950"
                >
                  <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                    <span>Coach Marcus Vance</span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(obs.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="mt-1 leading-relaxed text-slate-600 dark:text-slate-300">
                    {obs.note}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                No recent coach feedback notes.
              </p>
            )}
          </div>
        </div>

        {/* Physio & Medical Clearance */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Medical &amp; Rehab Status
          </h3>
          <div className="mt-4 space-y-3">
            {summary.activeInjuryNotes.length > 0 ? (
              summary.activeInjuryNotes.map((note) => (
                <div
                  key={note.id}
                  className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-3.5 text-xs dark:border-emerald-900/60 dark:bg-emerald-950/40"
                >
                  <div className="flex items-center justify-between font-bold text-emerald-900 dark:text-emerald-300">
                    <span>Medical Log ({note.status})</span>
                    <span className="text-[10px] text-emerald-700 dark:text-emerald-400">
                      {new Date(note.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="mt-1 leading-relaxed text-slate-700 dark:text-slate-300">
                    {note.note}
                  </p>
                </div>
              ))
            ) : (
              <div className="rounded-xl bg-slate-50 p-4 text-center text-xs dark:bg-slate-950">
                <CheckCircle2
                  size={20}
                  className="mx-auto text-emerald-600 dark:text-emerald-400"
                />
                <p className="mt-1 font-bold text-slate-900 dark:text-white">
                  100% Medically Cleared
                </p>
                <p className="mt-0.5 text-slate-500 dark:text-slate-400">
                  No active injury notes or rehabilitation holds.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 6. Upcoming Tournaments & Scholarship Opportunities */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Scholarships Widget */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Scholarship Opportunities
              </h3>
            </div>
            <Link
              href="/dashboard/scholarships"
              className="flex items-center gap-1 text-xs font-bold text-blue-900 hover:underline dark:text-emerald-400"
            >
              <span>View All</span>
              <ChevronRight size={14} />
            </Link>
          </div>
          {scholarships.slice(0, 1).map((sch) => (
            <ScholarshipCard
              key={sch.id}
              scholarship={sch}
              onApplyToggle={(id) => toggleScholarshipApplication(id)}
            />
          ))}
        </div>

        {/* Tournaments Widget */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Upcoming Tournaments
              </h3>
            </div>
            <Link
              href="/dashboard/tournaments"
              className="flex items-center gap-1 text-xs font-bold text-blue-900 hover:underline dark:text-emerald-400"
            >
              <span>View All</span>
              <ChevronRight size={14} />
            </Link>
          </div>
          {tournaments.slice(0, 1).map((t) => (
            <TournamentCard
              key={t.id}
              tournament={t}
              onRegisterToggle={(id) => toggleTournamentRegistration(id)}
            />
          ))}
        </div>
      </div>

      {/* Check-In Modal */}
      <CheckInModal
        isOpen={isCheckInModalOpen}
        onClose={() => setIsCheckInModalOpen(false)}
      />
    </div>
  );
}
