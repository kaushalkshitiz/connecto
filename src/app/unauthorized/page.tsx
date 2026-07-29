'use client';

// =============================================================================
// Athlete Risk Intelligence Platform
// /unauthorized — 403 Access Denied & Role Isolation Guard Page
// =============================================================================

import React from 'react';
import Link from 'next/link';
import { useDemo } from '../../context/DemoContext';
import { getDashboardPathForRole, getRoleDisplayName } from '../../lib/rbac';
import {
  ArrowRight,
  LogOut,
  ShieldAlert,
} from 'lucide-react';

export default function UnauthorizedPage() {
  const { activeRole, activeUser, logout } = useDemo();
  const allowedDashboard = getDashboardPathForRole(activeRole);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-rose-950 px-4 py-12 text-white">
      <div className="mx-auto max-w-md text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-rose-500/20 text-rose-400 border border-rose-500/40 shadow-2xl">
          <ShieldAlert size={36} />
        </div>

        <span className="mt-6 inline-block rounded-full bg-rose-950/80 border border-rose-500/30 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-rose-300">
          403 Access Denied • Role Isolation
        </span>

        <h1 className="mt-4 text-3xl font-black text-white sm:text-4xl">
          Unauthorized Portal Access
        </h1>

        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          You are currently authenticated as{' '}
          <span className="font-bold text-white">{activeUser?.name || 'User'}</span> with the role{' '}
          <span className="rounded bg-purple-900/80 px-2 py-0.5 font-bold text-purple-200">
            {getRoleDisplayName(activeRole)}
          </span>
          . Your account is not permitted to access this portal.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href={allowedDashboard}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-3.5 text-xs font-bold text-white shadow-lg transition-all hover:from-purple-500 hover:to-indigo-500"
          >
            <span>Go to My {activeRole.toUpperCase()} Dashboard</span>
            <ArrowRight size={15} />
          </Link>

          <Link
            href="/login"
            onClick={() => logout()}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-900 px-6 py-3.5 text-xs font-bold text-slate-300 transition-all hover:bg-slate-800 hover:text-white"
          >
            <LogOut size={15} />
            <span>Log Out</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
