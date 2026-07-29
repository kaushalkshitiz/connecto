'use client';

// =============================================================================
// AI Athlete Growth Platform
// Navbar — Top Navigation inspired by Stripe & Linear (White & Dark theme)
// =============================================================================

import React, { useState } from 'react';
import Link from 'next/link';
import { useDemo } from '../../context/DemoContext';
import { useTheme } from '../../context/ThemeContext';
import {
  Activity,
  Bell,
  CheckCircle2,
  ChevronDown,
  Moon,
  Search,
  ShieldCheck,
  Sun,
  UserCheck,
  Users,
} from 'lucide-react';

export function Navbar() {
  const { users, activeUser, activeRole, switchUser } = useDemo();
  const { theme, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/90 backdrop-blur-md transition-colors dark:border-slate-800 dark:bg-slate-900/90">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand / Logo */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-900 to-slate-900 text-white shadow-sm dark:from-emerald-600 dark:to-teal-600">
              <Activity className="h-5 w-5 text-emerald-400 dark:text-white" />
            </div>
            <div>
              <span className="flex items-center gap-1.5 text-base font-bold tracking-tight text-slate-900 dark:text-white">
                CONNECTO <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-extrabold text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">SPORTS AI</span>
              </span>
              <p className="hidden text-[11px] font-medium text-slate-500 dark:text-slate-400 sm:block">
                Athlete Growth &amp; Risk Intelligence
              </p>
            </div>
          </Link>

          {/* Quick Search */}
          <div className="hidden md:flex md:w-64 lg:w-80">
            <div className="relative w-full">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search athletes, tasks, scholarships..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-xs text-slate-900 placeholder-slate-400 transition-colors focus:border-emerald-600 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-3">
          {/* Active User / Role Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-900 text-xs font-bold text-white dark:bg-emerald-600">
                {activeUser.name.charAt(0)}
              </div>
              <div className="hidden text-left sm:block">
                <div className="font-semibold text-slate-900 dark:text-white">
                  {activeUser.name}
                </div>
                <div className="text-[10px] uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  {activeRole}
                </div>
              </div>
              <ChevronDown size={14} className="text-slate-400" />
            </button>

            {isRoleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl ring-1 ring-black/5 dark:border-slate-800 dark:bg-slate-900 dark:ring-white/10">
                <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Switch Active Persona
                </div>
                <div className="max-h-64 overflow-y-auto space-y-1">
                  {users.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => {
                        switchUser(u.id);
                        setIsRoleDropdownOpen(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs transition-colors ${
                        u.id === activeUser.id
                          ? 'bg-emerald-50 text-emerald-900 font-bold dark:bg-emerald-950/60 dark:text-emerald-300'
                          : 'text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div>
                        <div>{u.name}</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400">
                          {u.email.includes('stanford-athletics') ? 'Staff / Coach' : 'Athlete'}
                        </div>
                      </div>
                      {u.id === activeUser.id && (
                        <CheckCircle2 size={15} className="text-emerald-600 dark:text-emerald-400" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Theme Toggle (White / Dark UI) */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle White or Dark theme"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition-all hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            title={`Switch to ${theme === 'dark' ? 'Light (White)' : 'Dark'} mode`}
          >
            {theme === 'dark' ? (
              <Sun size={17} className="text-amber-400" />
            ) : (
              <Moon size={17} className="text-slate-700" />
            )}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition-all hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <Bell size={17} />
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white">
                3
              </span>
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 dark:border-slate-800">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    Platform Notifications
                  </span>
                  <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    3 New
                  </span>
                </div>
                <div className="mt-3 space-y-2.5 text-xs">
                  <div className="rounded-xl bg-slate-50 p-2.5 dark:bg-slate-950">
                    <p className="font-semibold text-slate-900 dark:text-white">
                      AI Recovery Insight Triggered
                    </p>
                    <p className="mt-0.5 text-[11px] text-slate-600 dark:text-slate-400">
                      Maya Lin sleep deficit detected. 15% load reduction recommended.
                    </p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-2.5 dark:bg-slate-950">
                    <p className="font-semibold text-slate-900 dark:text-white">
                      New NCAA Scholarship Open
                    </p>
                    <p className="mt-0.5 text-[11px] text-slate-600 dark:text-slate-400">
                      Division I Track &amp; Field Merit Grant ($25,000/yr) deadline Aug 15.
                    </p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-2.5 dark:bg-slate-950">
                    <p className="font-semibold text-slate-900 dark:text-white">
                      Task Completed
                    </p>
                    <p className="mt-0.5 text-[11px] text-slate-600 dark:text-slate-400">
                      Maya Lin uploaded proof for Post-Workout Ice Bath session.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
