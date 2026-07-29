'use client';

// =============================================================================
// Athlete Risk Intelligence Platform
// Landing Page — High-impact overview and Role Portal Hub
// =============================================================================

import React from 'react';
import Link from 'next/link';
import { useDemo } from '../context/DemoContext';
import { RiskBadge } from '../components/ui/RiskBadge';
import {
  Activity,
  ArrowRight,
  Award,
  HeartPulse,
  ShieldAlert,
  Users,
} from 'lucide-react';

export default function HomePage() {
  const { team, riskFlags } = useDemo();

  const highCount = riskFlags.filter((rf) => rf.level === 'high').length;
  const watchCount = riskFlags.filter((rf) => rf.level === 'watch').length;
  const lowCount = riskFlags.filter((rf) => rf.level === 'low').length;

  const portals = [
    {
      title: 'Coach Roster Dashboard',
      subtitle: 'Real-time Watch/High risk badges & 7-day trend charts',
      desc: 'View your track & field roster at a glance. Catch fatigue, sleep deficits, and elevated soreness before injuries happen. Log immediate coach observations.',
      href: '/dashboard/coach',
      icon: <Users className="h-7 w-7 text-blue-400" />,
      badge: 'Coach & Staff',
      borderColor: 'border-blue-500/30 hover:border-blue-500/80',
      gradient: 'from-blue-950/40 via-slate-900 to-slate-950',
    },
    {
      title: 'Athlete Self-Report Hub',
      subtitle: 'One-handed daily recovery check-in with sliders',
      desc: 'Submit your morning sleep hours, muscle soreness (1-5), mood (1-5), and optional RPE in under 15 seconds. Large touch targets built for mobile.',
      href: '/dashboard/athlete',
      icon: <Activity className="h-7 w-7 text-emerald-400" />,
      badge: 'Athlete App',
      borderColor: 'border-emerald-500/30 hover:border-emerald-500/80',
      gradient: 'from-emerald-950/40 via-slate-900 to-slate-950',
    },
    {
      title: 'Physio Treatment Logger',
      subtitle: 'Clinical injury tracking & recovery status tags',
      desc: 'Log acute injuries, rehab notes, and mark status as Active, Recovering, or Cleared. Active injury notes instantly elevate athlete risk in the Coach view.',
      href: '/dashboard/physio',
      icon: <HeartPulse className="h-7 w-7 text-teal-400" />,
      badge: 'Medical Team',
      borderColor: 'border-teal-500/30 hover:border-teal-500/80',
      gradient: 'from-teal-950/40 via-slate-900 to-slate-950',
    },
    {
      title: 'Department Admin Mgmt',
      subtitle: 'Team roster & zero-data-loss coach reassignment',
      desc: 'Reassign athletes between coaches with absolute data preservation. All check-ins and medical records stay tied to the university record (ON DELETE SET NULL).',
      href: '/dashboard/admin',
      icon: <ShieldAlert className="h-7 w-7 text-purple-400" />,
      badge: 'Athletics Dir.',
      borderColor: 'border-purple-500/30 hover:border-purple-500/80',
      gradient: 'from-purple-950/40 via-slate-900 to-slate-950',
    },
  ];

  return (
    <div className="space-y-12 pb-12">
      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-800/80 bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950/40 p-8 shadow-2xl sm:p-12">
        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-950/60 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-emerald-300">
            <Award size={14} className="text-emerald-400" />
            <span>Stanford University Athletics Pilot • MVP Phase 1</span>
          </div>

          <h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl">
            Early Warning Injury &{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-blue-400 bg-clip-text text-transparent">
              Dropout Risk Intelligence
            </span>
          </h1>

          <p className="text-base leading-relaxed text-slate-300 sm:text-lg">
            Fusing daily training load, recovery metrics, and clinical physio data into one explainable platform for{' '}
            <span className="font-semibold text-white">{team.name}</span>. Catching the missed signals before an athlete breaks.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="/dashboard/coach"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/25 transition-all hover:from-emerald-600 hover:to-teal-700"
            >
              <span>Launch Coach Roster</span>
              <ArrowRight size={17} />
            </Link>
            <Link
              href="/dashboard/athlete"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-6 py-3 text-sm font-semibold text-slate-200 transition-all hover:border-slate-500 hover:bg-slate-800"
            >
              <span>Test Athlete Check-In Form</span>
            </Link>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 right-1/3 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
      </section>

      {/* Live Pilot Stats Bar */}
      <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Active Roster
          </p>
          <p className="mt-1 text-3xl font-black text-white">
            {riskFlags.length} Athletes
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Stanford Track &amp; Field
          </p>
        </div>

        <div className="rounded-2xl border border-rose-900/40 bg-rose-950/20 p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-rose-300">
            High Risk Flagged
          </p>
          <div className="mt-1 flex items-center justify-between">
            <p className="text-3xl font-black text-rose-400">{highCount}</p>
            <RiskBadge level="high" size="sm" showIcon={false} />
          </div>
          <p className="mt-1 text-xs text-rose-400/80">
            Requires immediate intervention
          </p>
        </div>

        <div className="rounded-2xl border border-amber-900/40 bg-amber-950/20 p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-300">
            Watch List
          </p>
          <div className="mt-1 flex items-center justify-between">
            <p className="text-3xl font-black text-amber-400">{watchCount}</p>
            <RiskBadge level="watch" size="sm" showIcon={false} />
          </div>
          <p className="mt-1 text-xs text-amber-400/80">
            Elevated soreness or sleep deficit
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-900/40 bg-emerald-950/20 p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-300">
            Low Risk (Normal)
          </p>
          <div className="mt-1 flex items-center justify-between">
            <p className="text-3xl font-black text-emerald-400">{lowCount}</p>
            <RiskBadge level="low" size="sm" showIcon={false} />
          </div>
          <p className="mt-1 text-xs text-emerald-400/80">
            Training &amp; recovery normal
          </p>
        </div>
      </section>

      {/* Role Portal Cards */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-white">
              Role-Based Pilot Portals
            </h2>
            <p className="text-sm text-slate-400">
              Select any role below to test their dedicated workflow and permissions
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {portals.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border bg-gradient-to-br p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${item.borderColor} ${item.gradient}`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="rounded-xl border border-slate-700/80 bg-slate-900/80 p-3 shadow-md">
                    {item.icon}
                  </div>
                  <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs font-bold uppercase tracking-wider text-slate-300">
                    {item.badge}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold tracking-tight text-white group-hover:text-emerald-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm font-semibold text-emerald-400/90">
                    {item.subtitle}
                  </p>
                </div>

                <p className="text-sm leading-relaxed text-slate-300">
                  {item.desc}
                </p>
              </div>

              <div className="mt-6 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 group-hover:text-white">
                <span>Enter Portal</span>
                <ArrowRight
                  size={15}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
