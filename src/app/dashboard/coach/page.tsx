'use client';

// =============================================================================
// AI Athlete Growth Platform
// Coach Dashboard (/dashboard/coach) — Roster, AI Insights, Task Assignment & Alerts
// =============================================================================

import React, { useState } from 'react';
import Link from 'next/link';
import { useDemo } from '../../../context/DemoContext';
import { RiskBadge } from '../../../components/ui/RiskBadge';
import { AIInsightCard } from '../../../components/ui/AIInsightCard';
import { TaskAssignModal } from '../../../components/forms/TaskAssignModal';
import { RiskLevel, TrainingTask } from '../../../types';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Calendar,
  CheckCircle2,
  CheckSquare,
  Clock,
  Filter,
  Flame,
  Moon,
  Plus,
  Search,
  Sparkles,
  Users,
} from 'lucide-react';

export default function CoachDashboardPage() {
  const {
    users,
    memberships,
    team,
    riskFlags,
    checkIns,
    tasks,
    aiInsights,
  } = useDemo();

  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  // Find athletes
  const athleteUsers = users.filter((u) =>
    memberships.some((m) => m.user_id === u.id && m.role === 'athlete')
  );

  const rosterWithRisk = athleteUsers.map((athlete) => {
    const flag = riskFlags.find((rf) => rf.athlete_id === athlete.id) || {
      id: 'default',
      athlete_id: athlete.id,
      team_id: team.id,
      level: 'low' as RiskLevel,
      reason: 'All metrics in normal range',
      computed_at: new Date().toISOString(),
    };

    const athleteCheckIns = checkIns
      .filter((c) => c.athlete_id === athlete.id)
      .sort((a, b) => (a.date > b.date ? -1 : 1));

    const latest = athleteCheckIns[0] || null;

    return {
      athlete,
      flag,
      latest,
    };
  });

  const highRiskCount = rosterWithRisk.filter(
    (r) => r.flag.level === 'high'
  ).length;

  const watchRiskCount = rosterWithRisk.filter(
    (r) => r.flag.level === 'watch'
  ).length;

  const completedTasksWithProof = tasks.filter(
    (t) => t.status === 'Completed' && t.proof_note
  );

  const filteredRoster = rosterWithRisk.filter((item) => {
    const matchesFilter =
      filterLevel === 'all' || item.flag.level === filterLevel;
    const matchesSearch =
      item.athlete.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.athlete.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-8 pb-12 transition-colors duration-300">
      {/* 1. Top Header Banner with Assign Task Button */}
      <div className="flex flex-wrap items-center justify-between gap-6 rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-blue-50/40 p-6 shadow-sm dark:border-slate-800 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 sm:p-8">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-900 dark:border-blue-800 dark:bg-slate-800 dark:text-slate-200">
              <span>Coach Command Center</span>
            </span>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              NCAA Track &amp; Field Roster
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            {team.name} • Training &amp; Load Management
          </h1>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
            Real-time physiological risk monitoring, workout assignments, and NCAA scholarship tracking.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsAssignModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-2xl bg-blue-900 px-6 py-3.5 text-sm font-extrabold text-white shadow-lg transition-all hover:bg-blue-800 dark:bg-emerald-600 dark:hover:bg-emerald-700"
          >
            <Plus size={18} />
            <span>Assign New Task to Athlete</span>
          </button>
        </div>
      </div>

      {/* 2. Overview Cards & Team Analytics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Roster
            </span>
            <Users size={16} className="text-blue-600 dark:text-blue-400" />
          </div>
          <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
            {athleteUsers.length} Athletes
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Active NCAA division squad
          </p>
        </div>

        <div className="rounded-2xl border border-rose-200 bg-rose-50/60 p-5 shadow-sm dark:border-rose-900/60 dark:bg-rose-950/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400">
              High Risk Alerts
            </span>
            <AlertTriangle size={16} className="text-rose-600 dark:text-rose-400" />
          </div>
          <p className="mt-2 text-2xl font-black text-rose-800 dark:text-rose-300">
            {highRiskCount} Athlete(s)
          </p>
          <p className="mt-1 text-xs font-semibold text-rose-700 dark:text-rose-400">
            Requires immediate load adjustment
          </p>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-5 shadow-sm dark:border-amber-900/60 dark:bg-amber-950/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
              Warning (Watch)
            </span>
            <Clock size={16} className="text-amber-600 dark:text-amber-400" />
          </div>
          <p className="mt-2 text-2xl font-black text-amber-800 dark:text-amber-300">
            {watchRiskCount} Athlete(s)
          </p>
          <p className="mt-1 text-xs font-semibold text-amber-700 dark:text-amber-400">
            Monitor sleep &amp; soreness trends
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Task Proof Reviews
            </span>
            <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400" />
          </div>
          <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
            {completedTasksWithProof.length} Completed
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            With attached execution proof
          </p>
        </div>
      </div>

      {/* 3. MOST IMPORTANT SECTION: AI RECOMMENDATIONS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
              AI Coach Intelligence &amp; Load Recommendations
            </h2>
          </div>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Synthesized from daily athlete readiness &amp; physio logs
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {aiInsights.slice(0, 2).map((insight) => (
            <AIInsightCard key={insight.id} insight={insight} />
          ))}
        </div>
      </div>

      {/* 4. Pending Task Reviews Widget */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <CheckSquare className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Recent Training Task Submissions ({completedTasksWithProof.length})
            </h3>
          </div>
          <Link
            href="/dashboard/tasks"
            className="text-xs font-bold text-blue-900 hover:underline dark:text-emerald-400"
          >
            Manage All Tasks &rarr;
          </Link>
        </div>

        {completedTasksWithProof.length === 0 ? (
          <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
            No completed tasks with proof submitted yet today.
          </p>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
            {completedTasksWithProof.slice(0, 4).map((task) => {
              const athlete = users.find((u) => u.id === task.athlete_id);
              return (
                <div
                  key={task.id}
                  className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-950"
                >
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {athlete?.name || 'Athlete'}
                    </span>
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {task.title}
                    </p>
                    <p className="mt-0.5 text-[11px] text-emerald-700 dark:text-emerald-400">
                      &ldquo;{task.proof_note}&rdquo;
                    </p>
                  </div>
                  <span className="rounded-lg bg-emerald-100 px-2.5 py-1 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    Completed
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 5. Athlete Roster & Performance Alerts Table */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
            Roster Readiness &amp; Early Warning Monitor
          </h2>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-900">
              <button
                onClick={() => setFilterLevel('all')}
                className={`rounded-lg px-3 py-1 text-xs font-bold transition-colors ${
                  filterLevel === 'all'
                    ? 'bg-blue-900 text-white dark:bg-emerald-600'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                All ({rosterWithRisk.length})
              </button>
              <button
                onClick={() => setFilterLevel('high')}
                className={`rounded-lg px-3 py-1 text-xs font-bold transition-colors ${
                  filterLevel === 'high'
                    ? 'bg-rose-600 text-white'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                High Risk ({highRiskCount})
              </button>
              <button
                onClick={() => setFilterLevel('watch')}
                className={`rounded-lg px-3 py-1 text-xs font-bold transition-colors ${
                  filterLevel === 'watch'
                    ? 'bg-amber-600 text-white'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                Watch ({watchRiskCount})
              </button>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search athlete..."
                className="rounded-xl border border-slate-300 bg-white py-1.5 pl-8 pr-3 text-xs text-slate-900 placeholder-slate-400 focus:border-emerald-600 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              />
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
                <tr>
                  <th className="px-5 py-3.5">Athlete</th>
                  <th className="px-5 py-3.5">Risk Status</th>
                  <th className="px-5 py-3.5">Assigned Tasks</th>
                  <th className="px-5 py-3.5">Last Check-In</th>
                  <th className="px-5 py-3.5">Primary Reason / Trigger</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredRoster.map(({ athlete, flag, latest }) => {
                  const athleteTasks = tasks.filter(
                    (t) => t.athlete_id === athlete.id
                  );
                  const completedCount = athleteTasks.filter(
                    (t) => t.status === 'Completed'
                  ).length;

                  return (
                    <tr
                      key={athlete.id}
                      className="transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/40"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-900 text-xs font-bold text-white dark:bg-emerald-600">
                            {athlete.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white">
                              {athlete.name}
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400">
                              {athlete.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <RiskBadge level={flag.level} size="sm" />
                      </td>
                      <td className="px-5 py-4 font-semibold text-slate-700 dark:text-slate-300">
                        {athleteTasks.length > 0
                          ? `${completedCount}/${athleteTasks.length} Completed`
                          : 'No tasks'}
                      </td>
                      <td className="px-5 py-4 text-slate-600 dark:text-slate-400">
                        {latest ? (
                          <span>{new Date(latest.date).toLocaleDateString()}</span>
                        ) : (
                          <span className="text-slate-400 italic">No log yet</span>
                        )}
                      </td>
                      <td className="max-w-xs truncate px-5 py-4 text-slate-600 dark:text-slate-400">
                        {flag.reason}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <Link
                          href={`/dashboard/coach/athlete/${athlete.id}`}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 font-bold text-blue-900 hover:bg-slate-50 dark:border-slate-700 dark:text-emerald-400 dark:hover:bg-slate-800"
                        >
                          <span>Analyze</span>
                          <ArrowRight size={13} />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Assign Task Modal */}
      <TaskAssignModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
      />
    </div>
  );
}
