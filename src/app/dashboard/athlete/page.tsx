'use client';

// =============================================================================
// AI Athlete Growth Platform
// Athlete Dashboard (/dashboard/athlete) — Full AI Insights, Chat Assistant, & Visual Analytics
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
import { AIChatAssistant } from '../../../components/ui/AIChatAssistant';
import {
  SleepTrendsChart,
  SorenessTrendsChart,
  MoodTrendsChart,
  RecoveryTimelineChart,
  PerformanceProgressionChart,
} from '../../../components/charts';
import { generateAthleteSummary, AthleteContextInput } from '../../../services/ai';
import {
  Activity,
  Award,
  BarChart2,
  Calendar,
  CheckCircle2,
  CheckSquare,
  ChevronRight,
  Clock,
  GraduationCap,
  HeartPulse,
  Info,
  MessageSquare,
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
    checkIns,
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
  const athleteCheckIns = checkIns.filter((ci) => ci.athlete_id === athleteUser.id);
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);
  const [activeChartTab, setActiveChartTab] = useState<
    'sleep' | 'soreness' | 'mood' | 'recovery' | 'readiness'
  >('sleep');
  const [isFloatingChatOpen, setIsFloatingChatOpen] = useState(false);

  // Filter tasks for this athlete
  const athleteTasks = tasks.filter((t) => t.athlete_id === athleteUser.id);

  // Filter AI insights for this athlete
  const athleteInsights = aiInsights.filter(
    (i) => !i.athlete_id || i.athlete_id === athleteUser.id
  );

  // Prepare full AthleteContextInput for AI Assistant
  const athleteContext: AthleteContextInput = {
    athlete: athleteUser,
    currentRisk: summary.currentRisk,
    checkIns: athleteCheckIns,
    physioNotes: summary.activeInjuryNotes,
    observations: summary.recentObservations,
    sevenDayAvgSleep: summary.sevenDayAvgSleep,
    sevenDayAvgSoreness: summary.sevenDayAvgSoreness,
    sevenDayAvgMood: summary.sevenDayAvgMood,
    daysSinceLastCheckIn: 0,
  };

  const aiReadinessSummary = generateAthleteSummary(athleteContext);

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
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCheckInModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-2xl bg-blue-900 px-6 py-3.5 text-sm font-extrabold text-white shadow-lg transition-all hover:bg-blue-800 dark:bg-emerald-600 dark:hover:bg-emerald-700"
          >
            <Plus size={18} />
            <span>Log Today&rsquo;s Daily Check-In</span>
          </button>
        </div>
      </div>

      {/* 2. AI READINESS SUMMARY & RECOVERY FOCUS CARD */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                AI Physiological &amp; Performance Insights
              </h2>
            </div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Deterministic 7-day trend analysis
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

        {/* Natural Language Readiness Narrative Card */}
        <div className="flex flex-col justify-between rounded-3xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50/70 to-blue-50/40 p-6 shadow-sm dark:border-emerald-900/50 dark:from-slate-900 dark:to-emerald-950/20">
          <div>
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                AI Executive Assessment
              </span>
              <span className="text-xs font-bold text-slate-400">Rule-Based (§3.5)</span>
            </div>
            <h3 className="mt-3 text-base font-black text-slate-900 dark:text-white">
              {aiReadinessSummary.title}
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
              {aiReadinessSummary.summaryText}
            </p>

            <div className="mt-4 space-y-2">
              {aiReadinessSummary.keyPoints.map((kp, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                  <span>{kp.replace(/\*\*/g, '')}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 border-t border-emerald-200/60 pt-4 dark:border-emerald-900/40">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Suggested Recovery Focus
            </p>
            <div className="mt-2 space-y-1 text-xs font-semibold text-emerald-900 dark:text-emerald-300">
              {aiReadinessSummary.suggestedFocus.length > 0 ? (
                aiReadinessSummary.suggestedFocus.map((focus, idx) => (
                  <p key={idx}>• {focus.replace(/\*\*/g, '')}</p>
                ))
              ) : (
                <p>• Maintain consistent sleep routine (&gt; 7.5 hrs/night)</p>
              )}
            </div>
            <p className="mt-3 text-[9px] italic text-slate-500 dark:text-slate-400">
              Note: Recommendations are informational and based on check-in data. They do not constitute personalized medical advice.
            </p>
          </div>
        </div>
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

      {/* 4. INTERACTIVE RECHARTS VISUAL ANALYTICS */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <BarChart2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
              Longitudinal Readiness &amp; Recovery Analytics
            </h2>
          </div>

          {/* Interactive Chart Tab Selector */}
          <div className="inline-flex flex-wrap rounded-2xl bg-slate-100 p-1 dark:bg-slate-800">
            <button
              onClick={() => setActiveChartTab('sleep')}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                activeChartTab === 'sleep'
                  ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-white'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              Sleep Trends
            </button>
            <button
              onClick={() => setActiveChartTab('soreness')}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                activeChartTab === 'soreness'
                  ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-white'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              Soreness Trends
            </button>
            <button
              onClick={() => setActiveChartTab('mood')}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                activeChartTab === 'mood'
                  ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-white'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              Mood Trends
            </button>
            <button
              onClick={() => setActiveChartTab('recovery')}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                activeChartTab === 'recovery'
                  ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-white'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              Recovery Correlation
            </button>
            <button
              onClick={() => setActiveChartTab('readiness')}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                activeChartTab === 'readiness'
                  ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-white'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              Readiness Index
            </button>
          </div>
        </div>

        {activeChartTab === 'sleep' && <SleepTrendsChart checkIns={athleteCheckIns} />}
        {activeChartTab === 'soreness' && <SorenessTrendsChart checkIns={athleteCheckIns} />}
        {activeChartTab === 'mood' && <MoodTrendsChart checkIns={athleteCheckIns} />}
        {activeChartTab === 'recovery' && <RecoveryTimelineChart checkIns={athleteCheckIns} />}
        {activeChartTab === 'readiness' && (
          <PerformanceProgressionChart checkIns={athleteCheckIns} />
        )}
      </div>

      {/* 5. INTERACTIVE CONVERSATIONAL AI ATHLETE ASSISTANT */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
              Interactive AI Athlete Assistant
            </h2>
          </div>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Ask questions about your risk flags, sleep trends, or recovery habits
          </span>
        </div>

        <AIChatAssistant
          role="athlete"
          athleteContext={athleteContext}
          title="Personal Athlete Intelligence Assistant"
          subtitle="Explains your readiness flags deterministically & supports session memory"
          embedded={true}
        />
      </div>

      {/* 6. Today's Training Tasks */}
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

      {/* 7. Coach Feedback & Recent Activity */}
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

      {/* 8. Upcoming Tournaments & Scholarship Opportunities */}
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
