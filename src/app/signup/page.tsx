'use client';

// =============================================================================
// Athlete Risk Intelligence Platform
// /signup — Enterprise Account Creation with Role Assignment
// =============================================================================

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDemo } from '../../context/DemoContext';
import { getDashboardPathForRole, PLATFORM_ROLES, getRoleDisplayName } from '../../lib/rbac';
import { UserRole } from '../../types';
import {
  KeyRound,
  Loader2,
  Mail,
  ShieldAlert,
  User,
  UserPlus,
  Zap,
} from 'lucide-react';

export default function SignupPage() {
  const { loginAsDemoRole } = useDemo();
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('athlete');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    try {
      if (!email || !password || !name) {
        setErrorMsg('Please fill in all required fields.');
        setIsLoading(false);
        return;
      }

      // Automatically log into the selected demo role profile
      loginAsDemoRole(selectedRole);
      router.push(getDashboardPathForRole(selectedRole));
    } catch (err) {
      setErrorMsg('Account registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-purple-950 py-12 px-4 sm:px-6 lg:px-8 text-white">
      <div className="mx-auto w-full max-w-md">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-xl">
            <Zap size={26} />
          </div>
          <h2 className="mt-4 text-2xl font-black tracking-tight sm:text-3xl">
            Create a University Account
          </h2>
          <p className="mt-1 text-xs font-medium text-slate-400">
            Select your organization role to configure your permissions
          </p>
        </div>

        <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
          <form onSubmit={handleSignup} className="space-y-4">
            {errorMsg && (
              <div className="rounded-xl border border-rose-500/40 bg-rose-950/50 p-3 text-xs font-semibold text-rose-300">
                {errorMsg}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                Full Name
              </label>
              <div className="relative mt-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                  <User size={16} />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Maya Lin"
                  className="block w-full rounded-xl border border-slate-700 bg-slate-950 py-2.5 pl-10 pr-3 text-sm text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                University Email Address
              </label>
              <div className="relative mt-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                  <Mail size={16} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="maya.lin@stanford.edu"
                  className="block w-full rounded-xl border border-slate-700 bg-slate-950 py-2.5 pl-10 pr-3 text-sm text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                Password
              </label>
              <div className="relative mt-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                  <KeyRound size={16} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="block w-full rounded-xl border border-slate-700 bg-slate-950 py-2.5 pl-10 pr-3 text-sm text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                Assigned Role
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                className="mt-1 block w-full rounded-xl border border-slate-700 bg-slate-950 py-2.5 px-3 text-sm font-bold text-white focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              >
                {PLATFORM_ROLES.map((r) => (
                  <option key={r} value={r} className="bg-slate-900 text-white font-bold">
                    {getRoleDisplayName(r)} ({r.toUpperCase()})
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 py-3 text-sm font-extrabold text-white shadow-lg transition-all hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <UserPlus size={18} />
              )}
              <span>Create Account &amp; Enter Dashboard</span>
            </button>
          </form>

          <div className="mt-6 border-t border-slate-800 pt-6 text-center text-xs text-slate-400">
            Already have an account?{' '}
            <Link href="/login" className="font-bold text-purple-400 hover:text-purple-300">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
