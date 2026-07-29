'use client';

// =============================================================================
// AI Athlete Growth Platform
// Landing Page — Executive Hub & Quick Access Portals
// =============================================================================

import React from 'react';
import Link from 'next/link';
import { useDemo } from '../context/DemoContext';
import {
  Activity,
  ArrowRight,
  Award,
  BookOpen,
  CheckSquare,
  GraduationCap,
  HeartPulse,
  ShieldAlert,
  Sparkles,
  Trophy,
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
      title: 'Training Tasks & Proof Verification',
      subtitle: 'Structured workout assignments & video/photo proof',
      desc: 'Coaches assign tasks with deadlines and difficulty badges. Athletes mark complete and upload execution proof for verification.',
      href: '/dashboard/tasks',
      icon: <CheckSquare className="h-7 w-7 text-purple-600 dark:text-purple-400" />,
      badge: `${tasks.length} Active Tasks`,
      borderColor:
        'border-purple-200 dark:border-purple-500/30 hover:border-purple-500 dark:hover:border-purple-400',
      gradient:
        'from-purple-50/90 via-white to-slate-50/60 dark:from-purple-950/40 dark:via-slate-900 dark:to-slate-950',
      iconBg:
        'bg-purple-100/80 dark:bg-slate-900/80 border-purple-200 dark:border-slate-700/80',
    },
    {
      title: 'NCAA Scholarship Discovery Hub',
      subtitle: 'Card-based opportunity matching & instant application',
      desc: 'Discover athletic and merit scholarships with clear eligibility criteria, deadlines, and one-click application tracking.',
      href: '/dashboard/scholarships',
      icon: <GraduationCap className="h-7 w-7 text-amber-600 dark:text-amber-400" />,
      badge: `${scholarships.length} Open Grants`,
      borderColor:
        'border-amber-200 dark:border-amber-500/30 hover:border-amber-500 dark:hover:border-amber-400',
      gradient:
        'from-amber-50/90 via-white to-slate-50/60 dark:from-amber-950/40 dark:via-slate-900 dark:to-slate-950',
      iconBg: 'bg-amber-100/80 dark:bg-slate-900/80 border-amber-200 dark:border-slate-700/80',
    },
    {
      title: 'Tournament & Meet Registration',
      subtitle: 'Sport division filtering & compliance verification',
      desc: 'Explore upcoming collegiate and Olympic-qualifying meets, inspect venue schedules, and register athletes with compliance rules.',
      href: '/dashboard/tournaments',
      icon: <Trophy className="h-7 w-7 text-teal-600 dark:text-teal-400" />,
      badge: `${tournaments.length} Upcoming Meets`,
      borderColor:
        'border-teal-200 dark:border-teal-500/30 hover:border-teal-500 dark:hover:border-teal-400',
      gradient:
        'from-teal-50/90 via-white to-slate-50/60 dark:from-teal-950/40 dark:via-slate-900 dark:to-slate-950',
      iconBg: 'bg-teal-100/80 dark:bg-slate-900/80 border-teal-200 dark:border-slate-700/80',
    },
    {
      title: 'Physio Rehab & Injury Log',
      subtitle: 'Clinical injury tracking & clearance status',
      desc: 'Log acute injuries, rehab notes, and mark status as Active, Recovering, or Cleared. Integrates directly into Coach risk scoring.',
      href: '/dashboard/physio',
      icon: <HeartPulse className="h-7 w-7 text-rose-600 dark:text-rose-400" />,
      badge: 'Medical Team',
      borderColor:
        'border-rose-200 dark:border-rose-500/30 hover:border-rose-500 dark:hover:border-rose-400',
      gradient:
        'from-rose-50/90 via-white to-slate-50/60 dark:from-rose-950/40 dark:via-slate-900 dark:to-slate-950',
      iconBg: 'bg-rose-100/80 dark:bg-slate-900/80 border-rose-200 dark:border-slate-700/80',
    },
  ];

  return (
    <div className="space-y-12 pb-16 transition-colors duration-300">
      {/* Hero Header Block */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-blue-900 via-slate-900 to-slate-950 p-8 text-white shadow-xl dark:border-slate-800 sm:p-12">
        <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-500/20 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-emerald-300">
              <Zap size={14} className="text-emerald-400" />
              <span>AI-Powered Athlete Growth Platform</span>
            </span>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-slate-300">
              Stanford Track &amp; Field • NCAA Div I
            </span>
          </div>

          <h1 className="text-3xl font-black leading-tight tracking-tight text-white sm:text-5xl">
            Intelligent Performance, Training &amp; Opportunity Management
          </h1>

          <p className="text-sm leading-relaxed text-slate-300 sm:text-base">
            Designed for elite university athletic departments. Combining real-time physiological readiness, AI-powered load recommendations, task accountability, and scholarship discovery in one unified sports platform.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-3">
            <Link
              href="/dashboard/athlete"
              className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-6 py-3.5 text-sm font-extrabold text-slate-950 shadow-lg transition-all hover:bg-emerald-400"
            >
              <span>Launch Athlete Portal</span>
              <ArrowRight size={17} />
            </Link>
            <Link
              href="/dashboard/coach"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-bold text-white transition-all hover:bg-white/20"
            >
              <span>Coach Command Center</span>
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

      {/* Portals Grid */}
      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
            Platform Application Portals
          </h2>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Select a specialized interface tailored to your university role.
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

                <h3 className="mt-5 text-lg font-extrabold text-slate-900 dark:text-white group-hover:text-blue-900 dark:group-hover:text-emerald-400">
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
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition-colors group-hover:bg-blue-900 group-hover:text-white dark:bg-slate-800 dark:text-slate-300 dark:group-hover:bg-emerald-600">
                  <ArrowRight size={15} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
