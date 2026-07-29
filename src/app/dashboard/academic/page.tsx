'use client';

// =============================================================================
// Athlete Risk Intelligence Platform
// /dashboard/academic — Academic Staff & Faculty Counselor Portal
// =============================================================================

import React, { useState } from 'react';
import { useDemo } from '../../../context/DemoContext';
import { RiskBadge } from '../../../components/ui/RiskBadge';
import { AIChatAssistant } from '../../../components/ui/AIChatAssistant';
import { RiskLevel } from '../../../types';
import {
  AlertCircle,
  BookOpen,
  Calendar,
  CheckCircle2,
  GraduationCap,
  Plus,
  ShieldAlert,
  User,
  Users,
} from 'lucide-react';

interface ExamEvent {
  id: string;
  athleteId: string;
  course: string;
  examType: 'Midterm' | 'Final' | 'Lab Practical';
  date: string;
  conflictRisk: 'Low' | 'High';
}

export default function AcademicDashboardPage() {
  const { users, memberships, team, riskFlags, checkIns } = useDemo();

  const athleteUsers = users.filter((u) =>
    memberships.some((m) => m.user_id === u.id && m.role === 'athlete')
  );

  const [exams, setExams] = useState<ExamEvent[]>([
    {
      id: 'ex-1',
      athleteId: '33333333-3333-4333-8333-333333333301', // Maya Lin
      course: 'ENGR 102 (Linear Dynamics)',
      examType: 'Midterm',
      date: '2026-08-04',
      conflictRisk: 'High', // High fatigue + exam
    },
    {
      id: 'ex-2',
      athleteId: '33333333-3333-4333-8333-333333333302', // Jordan Thorne
      course: 'ECON 101 (Microeconomics)',
      examType: 'Midterm',
      date: '2026-08-05',
      conflictRisk: 'Low',
    },
    {
      id: 'ex-3',
      athleteId: '33333333-3333-4333-8333-333333333303', // Liam Carter
      course: 'PHYS 41 (Mechanics)',
      examType: 'Lab Practical',
      date: '2026-08-07',
      conflictRisk: 'Low',
    },
  ]);

  const [newCourse, setNewCourse] = useState('');
  const [newExamDate, setNewExamDate] = useState('');
  const [selectedAthleteId, setSelectedAthleteId] = useState(
    athleteUsers[0]?.id || ''
  );

  const handleAddExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourse || !newExamDate) return;

    // Check if athlete is in Watch or High risk
    const flag = riskFlags.find((rf) => rf.athlete_id === selectedAthleteId);
    const isConflict = flag && flag.level !== 'low';

    const newExam: ExamEvent = {
      id: crypto.randomUUID(),
      athleteId: selectedAthleteId,
      course: newCourse,
      examType: 'Midterm',
      date: newExamDate,
      conflictRisk: isConflict ? 'High' : 'Low',
    };

    setExams((prev) => [newExam, ...prev]);
    setNewCourse('');
    setNewExamDate('');
  };

  const highConflictExams = exams.filter((x) => x.conflictRisk === 'High');

  return (
    <div className="space-y-10 pb-12 transition-colors duration-300">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-6 rounded-3xl border border-slate-200 bg-gradient-to-br from-indigo-50 via-white to-slate-50 p-6 shadow-xl dark:border-slate-800 dark:from-indigo-950/60 dark:via-slate-900 dark:to-slate-950 dark:shadow-2xl sm:p-8">
        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-300 bg-indigo-50/90 px-3 py-1 text-xs font-bold uppercase tracking-wider text-indigo-800 dark:border-indigo-500/40 dark:bg-indigo-950 dark:text-indigo-300 shadow-sm">
            <BookOpen size={14} className="text-indigo-600 dark:text-indigo-400" />
            <span>Academic Staff &amp; Exam Calendar Portal</span>
          </span>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white sm:text-3xl">
            Student-Athlete Academic Balance &amp; Exam Scheduling
          </h1>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
            Monitor academic load against training schedules without exposing confidential clinical medical records.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-2xl border border-indigo-200 bg-indigo-50 px-5 py-3 text-sm font-bold text-indigo-800 shadow-sm dark:border-indigo-900/50 dark:bg-indigo-950/40 dark:text-indigo-200">
            <GraduationCap size={18} className="text-indigo-600 dark:text-indigo-400" />
            <span>Academic Write Access Active</span>
          </div>
        </div>
      </div>

      {/* KPI Ribbon */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Assigned Student-Athletes
            </span>
            <Users size={18} className="text-indigo-500" />
          </div>
          <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
            {athleteUsers.length} Athletes
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Full academic standing oversight
          </p>
        </div>

        <div className="rounded-2xl border border-indigo-200 bg-indigo-50/60 p-5 shadow-sm dark:border-indigo-900/60 dark:bg-indigo-950/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
              Upcoming Scheduled Exams
            </span>
            <Calendar size={18} className="text-indigo-600 dark:text-indigo-400" />
          </div>
          <p className="mt-2 text-2xl font-black text-indigo-900 dark:text-indigo-200">
            {exams.length} Exams / Practicals
          </p>
          <p className="mt-1 text-xs text-indigo-700 dark:text-indigo-400">
            Midterms &amp; Finals calendar
          </p>
        </div>

        <div className="rounded-2xl border border-rose-200 bg-rose-50/60 p-5 shadow-sm dark:border-rose-900/60 dark:bg-rose-950/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-300">
              Exam / Fatigue Conflict Alerts
            </span>
            <AlertCircle size={18} className="text-rose-600 dark:text-rose-400" />
          </div>
          <p className="mt-2 text-2xl font-black text-rose-800 dark:text-rose-300">
            {highConflictExams.length} Athlete(s) at Risk
          </p>
          <p className="mt-1 text-xs text-rose-700 dark:text-rose-400">
            Exams scheduled during high fatigue/soreness windows
          </p>
        </div>
      </div>

      {/* Interactive AI Academic Balance Assistant */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              AI Academic &amp; Training Balance Assistant
            </h2>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Ask about exam schedules, athlete academic load, or sleep deficits during midterms
          </span>
        </div>

        <AIChatAssistant
          role="coach"
          coachContext={{
            teamId: team.id,
            teamName: team.name,
            athletes: athleteUsers,
            profiles: [],
            riskFlags,
            checkIns,
            physioNotes: [],
            observations: [],
          }}
          title="Academic Balance & Burnout Prevention Advisor"
          subtitle="Monitors student-athlete academic load against training intensity"
          embedded={true}
        />
      </div>

      {/* Exam Calendar & Schedule Editor (§Academic Staff Edit rights) */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Student-Athlete Exam Calendar
          </h2>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md dark:border-slate-800 dark:bg-slate-900">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
                    <th className="py-4 pl-6 pr-4">Student-Athlete</th>
                    <th className="py-4 px-4">Course / Exam</th>
                    <th className="py-4 px-4">Exam Date</th>
                    <th className="py-4 pl-4 pr-6 text-right">Conflict Alert</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 text-sm">
                  {exams.map((ex) => {
                    const ath = athleteUsers.find((a) => a.id === ex.athleteId);
                    return (
                      <tr
                        key={ex.id}
                        className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40"
                      >
                        <td className="py-4 pl-6 pr-4 font-bold text-slate-900 dark:text-white">
                          {ath?.name || 'Student Athlete'}
                        </td>
                        <td className="py-4 px-4 text-slate-700 dark:text-slate-300">
                          <span className="font-semibold">{ex.course}</span>
                          <span className="ml-2 rounded bg-indigo-100 px-2 py-0.5 text-xs font-bold text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                            {ex.examType}
                          </span>
                        </td>
                        <td className="py-4 px-4 font-mono text-xs text-slate-600 dark:text-slate-400">
                          {ex.date}
                        </td>
                        <td className="py-4 pl-4 pr-6 text-right">
                          {ex.conflictRisk === 'High' ? (
                            <span className="inline-flex items-center gap-1 rounded-full border border-rose-300 bg-rose-100 px-2.5 py-0.5 text-xs font-bold text-rose-800 dark:border-rose-700 dark:bg-rose-950 dark:text-rose-300">
                              <AlertCircle size={12} />
                              <span>High Fatigue Conflict</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-300 bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800 dark:border-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                              <CheckCircle2 size={12} />
                              <span>Optimal Balance</span>
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Add Exam Schedule Form */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Schedule Academic Exam
          </h2>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md dark:border-slate-800 dark:bg-slate-900">
            <form onSubmit={handleAddExam} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                  Select Athlete
                </label>
                <select
                  value={selectedAthleteId}
                  onChange={(e) => setSelectedAthleteId(e.target.value)}
                  className="mt-1 block w-full rounded-xl border border-slate-700 bg-slate-950 py-2.5 px-3 text-sm font-bold text-white focus:border-indigo-500 focus:outline-none"
                >
                  {athleteUsers.map((ath) => (
                    <option key={ath.id} value={ath.id} className="bg-slate-900 text-white font-bold">
                      {ath.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                  Course Title
                </label>
                <input
                  type="text"
                  value={newCourse}
                  onChange={(e) => setNewCourse(e.target.value)}
                  placeholder="e.g. ENGR 102 (Linear Dynamics)"
                  required
                  className="mt-1 block w-full rounded-xl border border-slate-700 bg-slate-950 py-2.5 px-3 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                  Exam Date
                </label>
                <input
                  type="date"
                  value={newExamDate}
                  onChange={(e) => setNewExamDate(e.target.value)}
                  required
                  className="mt-1 block w-full rounded-xl border border-slate-700 bg-slate-950 py-2.5 px-3 text-sm font-bold text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-xs font-extrabold text-white shadow-md transition-all hover:bg-indigo-500"
              >
                <Plus size={16} />
                <span>Add Exam to Academic Calendar</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
