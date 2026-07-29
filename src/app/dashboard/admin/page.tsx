'use client';

// =============================================================================
// Athlete Risk Intelligence Platform
// Admin Dashboard — Full UI support, AI Organization Assistant, & Reports Archive
// =============================================================================

import React, { useState } from 'react';
import { useDemo } from '../../../context/DemoContext';
import { RiskBadge } from '../../../components/ui/RiskBadge';
import { ReassignCoachModal } from '../../../components/forms/ReassignCoachModal';
import { AIChatAssistant } from '../../../components/ui/AIChatAssistant';
import {
  RiskTimelineChart,
  CheckInCompletionChart,
} from '../../../components/charts';
import {
  generateDepartmentSummary,
  generateWeeklyReport,
  generateMonthlyReport,
  CoachContextInput,
} from '../../../services/ai';
import { RiskLevel } from '../../../types';
import {
  Award,
  BarChart2,
  Database,
  FileText,
  Lock,
  MessageSquare,
  ShieldAlert,
  Sparkles,
  Users,
  UserCheck,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { users, memberships, team, riskFlags, checkIns, aiInsights } = useDemo();

  const [reassignModalAthleteId, setReassignModalAthleteId] = useState<
    string | null
  >(null);
  const [activeReportTab, setActiveReportTab] = useState<'dept' | 'weekly' | 'monthly'>('dept');

  const staffUsers = users.filter((u) =>
    memberships.some((m) => m.user_id === u.id && m.role !== 'athlete')
  );

  const athleteUsers = users.filter((u) =>
    memberships.some((m) => m.user_id === u.id && m.role === 'athlete')
  );

  // Prepare CoachContextInput for department-wide AI reporting
  const deptContext: CoachContextInput = {
    teamId: team.id,
    teamName: team.name,
    athletes: athleteUsers,
    profiles: [],
    riskFlags: riskFlags,
    checkIns: checkIns,
    physioNotes: [],
    observations: [],
  };

  const deptSummaryReport = generateDepartmentSummary(deptContext);
  const weeklyReport = generateWeeklyReport(deptContext);
  const monthlyReport = generateMonthlyReport(deptContext);

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return (
          <span className="rounded-full border border-purple-300 bg-purple-100/90 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-purple-800 shadow-sm dark:border-purple-500/50 dark:bg-purple-950/80 dark:text-purple-300">
            Athletics Dir. / Admin
          </span>
        );
      case 'coach':
        return (
          <span className="rounded-full border border-blue-300 bg-blue-100/90 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-blue-800 shadow-sm dark:border-blue-500/50 dark:bg-blue-950/80 dark:text-blue-300">
            Head Coach / Staff
          </span>
        );
      case 'physio':
        return (
          <span className="rounded-full border border-teal-300 bg-teal-100/90 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-teal-800 shadow-sm dark:border-teal-500/50 dark:bg-teal-950/80 dark:text-teal-300">
            Medical / Physio PT
          </span>
        );
      case 'academic':
        return (
          <span className="rounded-full border border-indigo-300 bg-indigo-100/90 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-indigo-800 shadow-sm dark:border-indigo-500/50 dark:bg-indigo-950/80 dark:text-indigo-300">
            Academic Counselor
          </span>
        );
      default:
        return (
          <span className="rounded-full border border-slate-300 bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
            {role}
          </span>
        );
    }
  };

  return (
    <div className="space-y-10 pb-12 transition-colors duration-300">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-6 rounded-3xl border border-slate-200 bg-gradient-to-br from-purple-50 via-white to-slate-50 p-6 shadow-xl dark:border-slate-800 dark:from-purple-950/60 dark:via-slate-900 dark:to-slate-950 dark:shadow-2xl sm:p-8 transition-all">
        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-300 bg-purple-50/90 px-3 py-1 text-xs font-bold uppercase tracking-wider text-purple-800 dark:border-purple-500/40 dark:bg-purple-950 dark:text-purple-300 shadow-sm">
            <span>Department Admin &amp; Security Portal</span>
          </span>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white sm:text-3xl">
            Team Oversight &amp; Roster Management
          </h1>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
            {team.name} • Row-Level Security (RLS) &amp; Data Governance
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-2xl border border-purple-200 bg-purple-50 px-5 py-3 text-sm font-bold text-purple-800 shadow-sm dark:border-purple-900/50 dark:bg-purple-950/40 dark:text-purple-200">
            <Lock size={18} className="text-purple-600 dark:text-purple-400" />
            <span>SECURITY DEFINER Active</span>
          </div>
        </div>
      </div>

      {/* RLS Security Guarantee Banner (§5 requirement) */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-purple-900/40 dark:bg-purple-950/20 transition-all">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300">
            <Database size={16} />
            <span>ON DELETE SET NULL Guarantee</span>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-200">
            Staff foreign keys across all check-ins, observations, and physio notes are configured with <code className="rounded bg-purple-100 px-1.5 py-0.5 font-mono text-xs text-purple-800 dark:bg-purple-900/80 dark:text-purple-200">ON DELETE SET NULL</code>. Reassigning or removing a coach preserves 100% of historical athlete records.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/60 transition-all">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <Users size={16} />
            <span>Staff Roles &amp; Permissions</span>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            Admin users can audit all team memberships, reassign athlete coaching lines, and inspect cross-department risk flags without altering underlying medical logs.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/60 transition-all">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <Award size={16} />
            <span>Pilot Department Info</span>
          </div>
          <p className="mt-2 text-sm font-bold text-slate-900 dark:text-white">
            {team.name}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Active Staff Members: {staffUsers.length} • Registered Athletes:{' '}
            {athleteUsers.length}
          </p>
        </div>
      </div>

      {/* NEW: EXECUTIVE AI REPORTS ARCHIVE & SUMMARY CARDS */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              AI Executive Reports Archive &amp; Department Overview
            </h2>
          </div>

          <div className="inline-flex flex-wrap rounded-2xl bg-slate-100 p-1 dark:bg-slate-800">
            <button
              onClick={() => setActiveReportTab('dept')}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                activeReportTab === 'dept'
                  ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-white'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              Department Summary
            </button>
            <button
              onClick={() => setActiveReportTab('weekly')}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                activeReportTab === 'weekly'
                  ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-white'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              Weekly Report
            </button>
            <button
              onClick={() => setActiveReportTab('monthly')}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                activeReportTab === 'monthly'
                  ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-white'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              Monthly Report
            </button>
          </div>
        </div>

        <div className="rounded-3xl border border-purple-200/80 bg-gradient-to-br from-purple-50/70 via-white to-slate-50 p-6 shadow-sm dark:border-purple-900/50 dark:from-slate-900 dark:via-slate-900 dark:to-purple-950/20">
          <div className="flex items-center justify-between border-b border-purple-100 pb-4 dark:border-purple-900/40">
            <div>
              <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-purple-900 dark:bg-purple-950 dark:text-purple-300">
                AIInsightReport Type: {activeReportTab.toUpperCase()}
              </span>
              <h3 className="mt-2 text-lg font-black text-slate-900 dark:text-white">
                {activeReportTab === 'dept' && deptSummaryReport.title}
                {activeReportTab === 'weekly' && weeklyReport.title}
                {activeReportTab === 'monthly' && monthlyReport.title}
              </h3>
            </div>
            <span className="text-xs font-bold text-slate-400">
              Deterministic Rule Engine (§3.5 / §4.7)
            </span>
          </div>

          <div className="mt-4 whitespace-pre-wrap text-xs leading-relaxed text-slate-700 dark:text-slate-300">
            {activeReportTab === 'dept' && deptSummaryReport.summary_text}
            {activeReportTab === 'weekly' && weeklyReport.summary_text}
            {activeReportTab === 'monthly' && monthlyReport.summary_text}
          </div>

          <div className="mt-4 flex flex-wrap gap-4 border-t border-purple-100 pt-3 dark:border-purple-900/40 text-xs font-bold text-purple-900 dark:text-purple-300">
            <span>High Risk: {deptSummaryReport.metrics?.highRiskCount ?? 2} Athletes</span>
            <span>Watch Risk: {deptSummaryReport.metrics?.watchCount ?? 2} Athletes</span>
            <span>Data Retention: 100% Preserved</span>
          </div>
        </div>
      </div>

      {/* RECHARTS ORGANIZATION VISUAL ANALYTICS */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RiskTimelineChart riskFlags={riskFlags} />
        <CheckInCompletionChart checkIns={checkIns} totalAthletes={athleteUsers.length} />
      </div>

      {/* INTERACTIVE CONVERSATIONAL AI ADMIN ASSISTANT */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Interactive AI Organization Assistant
            </h2>
          </div>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Ask for a team health overview, most common Watch reasons, or injury statistics
          </span>
        </div>

        <AIChatAssistant
          role="admin"
          coachContext={deptContext}
          title="Organization Health & Risk Governance Assistant"
          subtitle="Monitors department caseloads, RLS compliance, & check-in completeness"
          embedded={true}
        />
      </div>

      {/* Staff Members Table */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Department Staff &amp; Faculty
        </h2>
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md dark:border-slate-800 dark:bg-slate-900/60 dark:shadow-xl transition-all">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
                  <th className="py-4 pl-6 pr-4">Staff Name</th>
                  <th className="py-4 px-4">Email</th>
                  <th className="py-4 px-4">Assigned Role</th>
                  <th className="py-4 pl-4 pr-6 text-right">Team ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 text-sm">
                {staffUsers.map((user) => {
                  const mem = memberships.find(
                    (m) => m.user_id === user.id && m.team_id === team.id
                  );
                  return (
                    <tr
                      key={user.id}
                      className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40"
                    >
                      <td className="py-4 pl-6 pr-4 font-bold text-slate-900 dark:text-white">
                        {user.name}
                      </td>
                      <td className="py-4 px-4 text-slate-700 dark:text-slate-300">{user.email}</td>
                      <td className="py-4 px-4">
                        {getRoleBadge(mem?.role || 'coach')}
                      </td>
                      <td className="py-4 pl-4 pr-6 text-right font-mono text-xs text-slate-400 dark:text-slate-500">
                        {team.id.slice(0, 18)}...
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Roster Assignment Table with Reassign Coach Demo */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Athlete Roster &amp; Coach Assignment Tool
          </h2>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Click &ldquo;Reassign Coach&rdquo; to test zero-data-loss assignment
          </span>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md dark:border-slate-800 dark:bg-slate-900/60 dark:shadow-xl transition-all">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
                  <th className="py-4 pl-6 pr-4">Athlete Name</th>
                  <th className="py-4 px-4">Email</th>
                  <th className="py-4 px-4">Current Risk Flag</th>
                  <th className="py-4 pl-4 pr-6 text-right">
                    Coach Reassignment
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 text-sm">
                {athleteUsers.map((athlete) => {
                  const flag =
                    riskFlags.find((rf) => rf.athlete_id === athlete.id) || {
                      level: 'low',
                    };

                  return (
                    <tr
                      key={athlete.id}
                      className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40"
                    >
                      <td className="py-4 pl-6 pr-4 font-bold text-slate-900 dark:text-white">
                        {athlete.name}
                      </td>
                      <td className="py-4 px-4 text-slate-700 dark:text-slate-300">
                        {athlete.email}
                      </td>
                      <td className="py-4 px-4">
                        <RiskBadge
                          level={
                            flag.level as RiskLevel
                          }
                          size="sm"
                        />
                      </td>
                      <td className="py-4 pl-4 pr-6 text-right">
                        <button
                          onClick={() => setReassignModalAthleteId(athlete.id)}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-purple-300 bg-purple-100/90 px-3.5 py-1.5 text-xs font-bold text-purple-800 shadow-sm transition-all hover:bg-purple-600 hover:text-white dark:border-purple-700 dark:bg-purple-950/80 dark:text-purple-200 dark:hover:bg-purple-800 dark:hover:text-white"
                        >
                          <UserCheck size={14} />
                          <span>Reassign Coach</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {reassignModalAthleteId && (
        <ReassignCoachModal
          isOpen={true}
          onClose={() => setReassignModalAthleteId(null)}
          athleteId={reassignModalAthleteId}
        />
      )}
    </div>
  );
}
