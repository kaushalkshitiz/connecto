'use client';

// =============================================================================
// Athlete Risk Intelligence Platform
// RoleSwitcher Component — Interactive Demo Header, Role Navigator & White/Dark Toggle
// =============================================================================

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useDemo } from '../../context/DemoContext';
import { useTheme } from '../../context/ThemeContext';
import {
  Activity,
  Award,
  Moon,
  RefreshCw,
  Shield,
  Sun,
  UserCheck,
  Users,
} from 'lucide-react';

export function RoleSwitcher() {
  const { team, users, activeUser, activeRole, switchUser, resetDemoData } =
    useDemo();
  const { theme, toggleTheme, isDark } = useTheme();
  const pathname = usePathname();

  const roleColors: Record<string, string> = {
    admin:
      'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950/80 dark:text-purple-300 dark:border-purple-500/60',
    coach:
      'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/80 dark:text-blue-300 dark:border-blue-500/60',
    physio:
      'bg-teal-100 text-teal-800 border-teal-300 dark:bg-teal-950/80 dark:text-teal-300 dark:border-teal-500/60',
    academic:
      'bg-indigo-100 text-indigo-800 border-indigo-300 dark:bg-indigo-950/80 dark:text-indigo-300 dark:border-indigo-500/60',
    athlete:
      'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-500/60',
  };

  const navLinks = [
    {
      href: '/dashboard/coach',
      label: 'Coach Dashboard',
      icon: <Users size={16} />,
      roles: ['coach', 'admin', 'physio', 'academic', 'athlete'],
    },
    {
      href: '/dashboard/athlete',
      label: 'Athlete Self-Report',
      icon: <Activity size={16} />,
      roles: ['athlete', 'coach', 'admin'],
    },
    {
      href: '/dashboard/physio',
      label: 'Physio Injury Log',
      icon: <UserCheck size={16} />,
      roles: ['physio', 'admin', 'coach'],
    },
    {
      href: '/dashboard/admin',
      label: 'Admin & Team Mgmt',
      icon: <Shield size={16} />,
      roles: ['admin', 'coach'],
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/90 dark:border-slate-800/80 dark:bg-slate-950/90 backdrop-blur-md transition-colors duration-300">
      {/* Top Demo Bar */}
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-2.5 text-xs text-slate-600 dark:text-slate-300 sm:px-6">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse" />
          <span className="font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            DEMO PILOT MODE
          </span>
          <span className="hidden text-slate-300 dark:text-slate-600 sm:inline">|</span>
          <span className="hidden font-medium text-slate-700 dark:text-slate-300 sm:inline">
            {team.name}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 dark:text-slate-400">Active User:</span>
            <select
              value={activeUser.id}
              onChange={(e) => switchUser(e.target.value)}
              className="rounded-lg border border-slate-300 bg-slate-50 dark:border-slate-700 dark:bg-slate-900 px-3 py-1 text-sm font-medium text-slate-800 dark:text-slate-200 transition-colors hover:border-slate-400 dark:hover:border-slate-500 focus:border-emerald-500 focus:outline-none"
            >
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.email.split('@')[0]})
                </option>
              ))}
            </select>
            <span
              className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider ${
                roleColors[activeRole] || roleColors.coach
              }`}
            >
              {activeRole}
            </span>
          </div>

          <button
            onClick={resetDemoData}
            title="Reset demo data to initial Stanford Track & Field state"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-slate-100 dark:border-slate-700 dark:bg-slate-900/60 px-2.5 py-1 text-xs font-medium text-slate-700 dark:text-slate-400 transition-all hover:border-slate-400 hover:bg-slate-200 dark:hover:border-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <RefreshCw size={13} />
            <span className="hidden sm:inline">Reset Demo</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Bar with White & Dark Mode Toggle Button */}
      <div className="border-t border-slate-200/80 bg-white dark:border-slate-900 dark:bg-slate-950 transition-colors duration-300">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2.5 text-lg font-black tracking-tight text-slate-900 dark:text-white hover:opacity-90"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 via-teal-600 to-blue-600 shadow-lg shadow-emerald-500/20">
                <Award className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-blue-600 dark:from-emerald-400 dark:via-teal-300 dark:to-blue-400 bg-clip-text text-transparent font-black">
                  CONNECTO
                </span>
                <span className="ml-1 text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                  ATHLETE RISK
                </span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <nav className="flex items-center gap-1 sm:gap-1.5">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-slate-900 text-white dark:bg-slate-800 dark:text-white shadow-sm ring-1 ring-slate-800 dark:ring-slate-700/80'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    {link.icon}
                    <span className="hidden md:inline">{link.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* WHITE / DARK MODE TOGGLE BUTTON */}
            <div className="flex items-center border-l border-slate-200 dark:border-slate-800 pl-2 sm:pl-4">
              <button
                onClick={toggleTheme}
                title={`Switch to ${isDark ? 'White (Light)' : 'Dark'} Mode`}
                aria-label="Toggle White and Dark theme"
                className={`group relative inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-bold transition-all duration-300 shadow-sm ${
                  isDark
                    ? 'border-slate-700 bg-slate-900/90 text-amber-300 hover:border-amber-400/60 hover:bg-slate-800 hover:shadow-amber-500/10'
                    : 'border-slate-300 bg-white text-slate-800 hover:border-emerald-500 hover:bg-slate-50 hover:text-emerald-700 hover:shadow-md'
                }`}
              >
                <div className="relative flex items-center justify-center">
                  {isDark ? (
                    <Sun
                      size={16}
                      className="text-amber-400 transition-transform duration-300 group-hover:rotate-45 group-hover:scale-110"
                    />
                  ) : (
                    <Moon
                      size={16}
                      className="text-slate-700 transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110"
                    />
                  )}
                </div>
                <span className="hidden sm:inline font-bold tracking-wide">
                  {isDark ? 'White UI' : 'Dark UI'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
