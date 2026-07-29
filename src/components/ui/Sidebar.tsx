'use client';

// =============================================================================
// AI Athlete Growth Platform
// Sidebar — Left Navigation inspired by Teamworks, Catapult Sports & Linear
// =============================================================================

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useDemo } from '../../context/DemoContext';
import {
  Activity,
  Award,
  BookOpen,
  Calendar,
  CheckSquare,
  FileText,
  GraduationCap,
  HeartPulse,
  LayoutDashboard,
  ShieldAlert,
  Trophy,
  User,
  Users,
  Zap,
} from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();
  const { activeRole, team } = useDemo();

  const isCoachOrStaff = activeRole === 'coach' || activeRole === 'admin' || activeRole === 'physio';

  const navItems = [
    {
      label: 'Overview',
      href: isCoachOrStaff ? '/dashboard/coach' : '/dashboard/athlete',
      icon: LayoutDashboard,
      roles: ['coach', 'athlete', 'physio', 'admin', 'academic'],
    },
    {
      label: 'Tasks & Training',
      href: '/dashboard/tasks',
      icon: CheckSquare,
      roles: ['coach', 'athlete', 'physio', 'admin', 'academic'],
      badge: 'New',
    },
    {
      label: 'Tournaments',
      href: '/dashboard/tournaments',
      icon: Trophy,
      roles: ['coach', 'athlete', 'physio', 'admin', 'academic'],
    },
    {
      label: 'Scholarships',
      href: '/dashboard/scholarships',
      icon: GraduationCap,
      roles: ['coach', 'athlete', 'physio', 'admin', 'academic'],
    },
    {
      label: 'Medical & Rehab',
      href: '/dashboard/physio',
      icon: HeartPulse,
      roles: ['coach', 'athlete', 'physio', 'admin', 'academic'],
    },
    {
      label: 'Team Security (RLS)',
      href: '/dashboard/admin',
      icon: ShieldAlert,
      roles: ['coach', 'physio', 'admin'],
    },
    {
      label: 'My Profile',
      href: '/dashboard/profile',
      icon: User,
      roles: ['coach', 'athlete', 'physio', 'admin', 'academic'],
    },
  ];

  return (
    <aside className="hidden w-64 flex-shrink-0 flex-col justify-between border-r border-slate-200 bg-white p-4 transition-colors dark:border-slate-800 dark:bg-slate-900 lg:flex">
      {/* Top navigation section */}
      <div className="space-y-6">
        {/* Team Sub-Header */}
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-900 text-white dark:bg-emerald-600">
              <Users size={14} />
            </div>
            <div className="overflow-hidden">
              <p className="truncate text-xs font-bold text-slate-900 dark:text-white">
                {team.name}
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                NCAA Division I • Stanford
              </p>
            </div>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="space-y-1">
          <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Platform Menu
          </p>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-blue-900 text-white shadow-sm dark:bg-emerald-600 dark:text-white font-bold'
                    : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    size={17}
                    className={
                      isActive
                        ? 'text-emerald-400 dark:text-white'
                        : 'text-slate-400 dark:text-slate-500'
                    }
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom section: AI Growth Engine Card */}
      <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-3.5 dark:border-slate-800/80 dark:bg-slate-950/60">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            <Zap size={15} />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-900 dark:text-white">
              AI Growth Engine
            </span>
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400">
                94% Confidence Model
              </span>
            </div>
          </div>
        </div>
        <p className="mt-2 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
          Real-time physiological readiness, workload balance &amp; academic eligibility tracking.
        </p>
      </div>
    </aside>
  );
}
