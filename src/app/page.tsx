'use client';

// =============================================================================
// AI Athlete Growth Platform
// Landing Page — Enterprise University Sports Management Platform
// =============================================================================

import React from 'react';
import Link from 'next/link';
import { useDemo } from '../context/DemoContext';
import {
  Activity,
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  CheckSquare,
  GraduationCap,
  HeartPulse,
  Lock,
  LogIn,
  ShieldAlert,
  Sparkles,
  Trophy,
  UserPlus,
  Users,
  Zap,
} from 'lucide-react';

export default function HomePage() {
  const { team, riskFlags, tasks, scholarships, tournaments } = useDemo();

  const highCount = riskFlags.filter((rf) => rf.level === 'high').length;
  const watchCount = riskFlags.filter((rf) => rf.level === 'watch').length;
  const lowCount = riskFlags.filter((rf) => rf.level === 'low').length;

  const portals = [
    {
      title: 'Athlete Growth Dashboard',
      subtitle: 'Real-time AI Insights, readiness sliders & training streak',
      desc: 'Check daily recovery scores, view customized AI load adjustments, complete assigned training tasks, and discover NCAA scholarships.',
      href: '/dashboard/athlete',
      icon: <Activity className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />,
      badge: 'Athlete App',
      borderColor:
        'border-emerald-200 dark:border-emerald-500/30 hover:border-emerald-500 dark:hover:border-emerald-400',
      gradient:
        'from-emerald-50/90 via-white to-slate-50/60 dark:from-emerald-950/40 dark:via-slate-900 dark:to-slate-950',
      iconBg:
        'bg-emerald-100/80 dark:bg-slate-900/80 border-emerald-200 dark:border-slate-700/80',
    },
    {
      title: 'Coach Roster & Command Center',
      subtitle: 'Real-time risk flags, task assignment & AI recommendations',
      desc: 'View your track & field roster at a glance. Catch fatigue, assign structured workout tasks with proof review, and balance squad workload.',
      href: '/dashboard/coach',
      icon: <Users className="h-7 w-7 text-blue-600 dark:text-blue-400" />,
      badge: 'Coach & Staff',
      borderColor:
        'border-blue-200 dark:border-blue-500/30 hover:border-blue-500 dark:hover:border-blue-400',
      gradient:
        'from-blue-50/90 via-white to-slate-50/60 dark:from-blue-950/40 dark:via-slate-900 dark:to-slate-950',
      iconBg: 'bg-blue-100/80 dark:bg-slate-900/80 border-blue-200 dark:border-slate-700/80',
    },
    {
      title: 'Academic Staff & Exam Schedule Portal',
      subtitle: 'Student-athlete exam calendars & academic balance',
      desc: 'Monitor academic load against training schedules. Edit exam dates and prevent burnout during midterms and finals.',
      href: '/dashboard/academic',
      icon: <BookOpen className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />,
      badge: 'Academic Staff',
      borderColor:
        'border-indigo-200 dark:border-indigo-500/30 hover:border-indigo-500 dark:hover:border-indigo-400',
      gradient:
        'from-indigo-50/90 via-white to-slate-50/60 dark:from-indigo-950/40 dark:via-slate-900 dark:to-slate-950',
      iconBg:
        'bg-indigo-100/80 dark:bg-slate-900/80 border-indigo-200 dark:border-slate-700/80',
    },
    {
      title: 'Medical & Physio Rehab Portal',
      subtitle: 'Clinical injury tracking & clearance status',
      desc: 'Log acute injuries, rehab notes, and mark status as Active, Recovering, or Cleared. Exclusive medical write permissions.',
      href: '/dashboard/physio',
      icon: <HeartPulse className="h-7 w-7 text-rose-600 dark:text-rose-400" />,
      badge: 'Medical Team',
      borderColor:
        'border-rose-200 dark:border-rose-500/30 hover:border-rose-500 dark:hover:border-rose-400',
      gradient:
        'from-rose-50/90 via-white to-slate-50/60 dark:from-rose-950/40 dark:via-slate-900 dark:to-slate-950',
      iconBg: 'bg-rose-100/80 dark:bg-slate-900/80 border-rose-200 dark:border-slate-700/80',
    },
    {
      title: 'Department Admin & Security Hub',
      subtitle: 'RLS governance, audit logs & organization reports',
      desc: 'Manage university staff, audit row-level security (RLS) compliance, and generate executive AI reports.',
      href: '/dashboard/admin',
      icon: <ShieldAlert className="h-7 w-7 text-purple-600 dark:text-purple-400" />,
      badge: 'Athletics Dir.',
      borderColor:
        'border-purple-200 dark:border-purple-500/30 hover:border-purple-500 dark:hover:border-purple-400',
      gradient:
        'from-purple-50/90 via-white to-slate-50/60 dark:from-purple-950/40 dark:via-slate-900 dark:to-slate-950',
      iconBg:
        'bg-purple-100/80 dark:bg-slate-900/80 border-purple-200 dark:border-slate-700/80',
    },
    {
      title: 'Training Tasks & Proof Verification',
      subtitle: 'Structured workout assignments & video/photo proof',
      desc: 'Coaches assign tasks with deadlines and difficulty badges. Athletes mark complete and upload execution proof for verification.',
      href: '/dashboard/tasks',
      icon: <CheckSquare className="h-7 w-7 text-teal-600 dark:text-teal-400" />,
      badge: `${tasks.length} Active Tasks`,
      borderColor:
        'border-teal-200 dark:border-teal-500/30 hover:border-teal-500 dark:hover:border-teal-400',
      gradient:
        'from-teal-50/90 via-white to-slate-50/60 dark:from-teal-950/40 dark:via-slate-900 dark:to-slate-950',
      iconBg: 'bg-teal-100/80 dark:bg-slate-900/80 border-teal-200 dark:border-slate-700/80',
    },
  ];

  return (
    <div className="space-y-16 pb-20 transition-colors duration-300">
      {/* Top Navigation / Auth Bar */}
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 bg-white/80 py-4 px-6 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-950/80 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-md">
            <Zap size={22} />
          </div>
          <div>
            <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
              Connecto Athlete Risk Intelligence
            </span>
            <span className="ml-2 hidden rounded-full border border-purple-200 bg-purple-50 px-2 py-0.5 text-[10px] font-bold text-purple-700 dark:border-purple-800 dark:bg-purple-950/60 dark:text-purple-300 sm:inline">
              Enterprise NCAA Platform
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-800 shadow-sm transition-all hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <LogIn size={15} />
            <span>Login</span>
          </Link>
          <Link
            href="/signup"
            className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-white"
          >
            <UserPlus size={15} />
            <span>Create Account</span>
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md transition-all hover:from-purple-500 hover:to-indigo-500"
          >
            <Sparkles size={15} />
            <span>Try Demo</span>
          </Link>
        </div>
      </header>

      {/* Hero Header Block */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-purple-950 via-indigo-950 to-slate-950 p-8 text-white shadow-2xl dark:border-slate-800 sm:p-14">
        <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-purple-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-6">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-400/30 bg-purple-500/20 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-purple-300">
              <Lock size={14} className="text-purple-400" />
              <span>Multi-Role Security &amp; Supabase RLS Protected</span>
            </span>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-slate-300">
              5 Enterprise Roles • NCAA Division I Ready
            </span>
          </div>

          <h1 className="text-4xl font-black leading-tight tracking-tight text-white sm:text-6xl">
            Intelligent Risk, Medical &amp; Academic Governance for Athletic Teams
          </h1>

          <p className="text-base leading-relaxed text-slate-300 sm:text-lg">
            Empower Athletes, Coaches, Physiotherapists, Academic Staff, and Administrators with role-isolated dashboards, deterministic risk analytics, and context-aware AI summaries.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-4">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-500 px-7 py-4 text-sm font-extrabold text-white shadow-lg transition-all hover:from-purple-400 hover:to-indigo-400"
            >
              <LogIn size={18} />
              <span>Login</span>
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-7 py-4 text-sm font-bold text-white transition-all hover:bg-white/20"
            >
              <UserPlus size={18} />
              <span>Create Account</span>
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-2xl border border-purple-300/30 bg-purple-900/40 px-7 py-4 text-sm font-bold text-purple-200 transition-all hover:bg-purple-800/60"
            >
              <Sparkles size={18} />
              <span>Try Demo</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Roster Readiness KPI Ribbon */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Active Squad
          </span>
          <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
            {team.name}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Division I Track &amp; Field
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5 shadow-sm dark:border-emerald-900/60 dark:bg-emerald-950/40">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
            Optimal (Low Risk)
          </span>
          <p className="mt-2 text-2xl font-black text-emerald-800 dark:text-emerald-300">
            {lowCount} Athletes
          </p>
          <p className="mt-1 text-xs text-emerald-700 dark:text-emerald-400">
            Cleared for full training volume
          </p>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-5 shadow-sm dark:border-amber-900/60 dark:bg-amber-950/40">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
            Watch (Moderate) Alert
          </span>
          <p className="mt-2 text-2xl font-black text-amber-800 dark:text-amber-300">
            {watchCount} Athletes
          </p>
          <p className="mt-1 text-xs text-amber-700 dark:text-amber-400">
            Elevated soreness or sleep deficit
          </p>
        </div>

        <div className="rounded-2xl border border-rose-200 bg-rose-50/60 p-5 shadow-sm dark:border-rose-900/60 dark:bg-rose-950/40">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400">
            High Risk Attention
          </span>
          <p className="mt-2 text-2xl font-black text-rose-800 dark:text-rose-300">
            {highCount} Athlete(s)
          </p>
          <p className="mt-1 text-xs text-rose-700 dark:text-rose-400">
            Requires AI load reduction action
          </p>
        </div>
      </section>

      {/* Product Overview & Features (§Landing Page requirement) */}
      <section className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
            <Lock size={24} />
          </div>
          <h3 className="mt-5 text-lg font-black text-slate-900 dark:text-white">
            Strict RBAC &amp; Medical Isolation
          </h3>
          <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
            Physiotherapy records and treatment notes are strictly write-protected for Medical Staff. Coaches receive high-level status without exposing confidential clinical details.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
            <Sparkles size={24} />
          </div>
          <h3 className="mt-5 text-lg font-black text-slate-900 dark:text-white">
            Context-Aware AI Assistant
          </h3>
          <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
            Role-tailored AI assistant answers readiness queries, summarizes caseloads, and explains deterministic rule triggers (§3.5) while strictly honoring user permissions.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
            <BookOpen size={24} />
          </div>
          <h3 className="mt-5 text-lg font-black text-slate-900 dark:text-white">
            Academic &amp; Training Balance
          </h3>
          <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
            Academic counselors schedule exam calendars and identify student-athletes at risk of burnout during high-intensity competitive travel blocks.
          </p>
        </div>
      </section>

      {/* Portals Grid */}
      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
            Role-Specific Application Dashboards
          </h2>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Every user is routed exclusively to the dashboard assigned to their verified role.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {portals.map((portal) => (
            <Link
              key={portal.href}
              href={portal.href}
              className={`group flex flex-col justify-between rounded-3xl border bg-gradient-to-br ${portal.gradient} p-6 shadow-sm transition-all duration-200 ${portal.borderColor} hover:-translate-y-1 hover:shadow-xl dark:shadow-none`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${portal.iconBg} shadow-sm`}
                  >
                    {portal.icon}
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    {portal.badge}
                  </span>
                </div>

                <h3 className="mt-5 text-lg font-extrabold text-slate-900 dark:text-white group-hover:text-purple-900 dark:group-hover:text-purple-400">
                  {portal.title}
                </h3>
                <p className="mt-1 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                  {portal.subtitle}
                </p>
                <p className="mt-2.5 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                  {portal.desc}
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-slate-200/60 pt-4 dark:border-slate-800/80">
                <span className="text-xs font-bold text-slate-900 dark:text-slate-200">
                  Launch Portal
                </span>
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition-colors group-hover:bg-purple-900 group-hover:text-white dark:bg-slate-800 dark:text-slate-300 dark:group-hover:bg-purple-600">
                  <ArrowRight size={15} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Call To Action Block */}
      <section className="rounded-3xl border border-purple-200 bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 p-8 text-center text-white shadow-xl dark:border-purple-800 sm:p-12">
        <h2 className="text-2xl font-black text-white sm:text-3xl">
          Ready to Experience Multi-Role Sports Governance?
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-purple-200">
          Try our interactive Demo Mode with read-only accounts across all five roles, or log in with your credentials.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3 text-sm font-bold text-slate-900 shadow-md transition-all hover:bg-slate-100"
          >
            <LogIn size={16} />
            <span>Login</span>
          </Link>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 rounded-2xl bg-purple-600 px-6 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-purple-500"
          >
            <UserPlus size={16} />
            <span>Create Account</span>
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-2xl border border-white/30 bg-white/10 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-white/20"
          >
            <Sparkles size={16} />
            <span>Try Demo</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
