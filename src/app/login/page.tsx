'use client';

// =============================================================================
// Athlete Risk Intelligence Platform
// /login — Enterprise Supabase Authentication & Interactive Demo Mode Cards
// =============================================================================

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDemo } from '../../context/DemoContext';
import { getDashboardPathForRole } from '../../lib/rbac';
import { UserRole } from '../../types';
import {
  Activity,
  Award,
  BookOpen,
  CheckCircle2,
  HeartPulse,
  KeyRound,
  Loader2,
  Lock,
  LogIn,
  Mail,
  ShieldAlert,
  Sparkles,
  Users,
  Zap,
} from 'lucide-react';

export default function LoginPage() {
  const { login, loginAsDemoRole } = useDemo();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    try {
      if (!email) {
        setErrorMsg('Please enter your university email address.');
        setIsLoading(false);
        return;
      }

      await login(email, password);
      // Determine dashboard based on email or default coach
      let targetRole: UserRole = 'coach';
      if (email.toLowerCase().includes('athlete') || email.toLowerCase().includes('maya')) {
        targetRole = 'athlete';
      } else if (email.toLowerCase().includes('physio') || email.toLowerCase().includes('chen')) {
        targetRole = 'physio';
      } else if (email.toLowerCase().includes('academic') || email.toLowerCase().includes('pendelton')) {
        targetRole = 'academic';
      } else if (email.toLowerCase().includes('admin') || email.toLowerCase().includes('jenkins')) {
        targetRole = 'admin';
      }

      router.push(getDashboardPathForRole(targetRole));
    } catch (err) {
      setErrorMsg('Authentication failed. Please verify your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoRoleClick = (role: UserRole) => {
    loginAsDemoRole(role);
    router.push(getDashboardPathForRole(role));
  };

  const demoRoles: {
    role: UserRole;
    title: string;
    name: string;
    desc: string;
    icon: React.ReactNode;
    badge: string;
    color: string;
  }[] = [
    {
      role: 'athlete',
      title: 'Athlete Demo',
      name: 'Maya Lin',
      desc: 'NCAA Division I Track & Field • High Risk Attention alert',
      icon: <Activity className="h-6 w-6 text-emerald-400" />,
      badge: 'Athlete App',
      color: 'border-emerald-500/40 hover:border-emerald-500 bg-emerald-950/20',
    },
    {
      role: 'coach',
      title: 'Coach Demo',
      name: 'Marcus Vance',
      desc: 'Head Coach • Full Roster risk monitoring & workout tasks',
      icon: <Users className="h-6 w-6 text-blue-400" />,
      badge: 'Head Coach',
      color: 'border-blue-500/40 hover:border-blue-500 bg-blue-950/20',
    },
    {
      role: 'physio',
      title: 'Physio Demo',
      name: 'Dr. David Chen, PT',
      desc: 'Lead Physical Therapist • Exclusive medical write rights',
      icon: <HeartPulse className="h-6 w-6 text-rose-400" />,
      badge: 'Medical PT',
      color: 'border-rose-500/40 hover:border-rose-500 bg-rose-950/20',
    },
    {
      role: 'academic',
      title: 'Academic Demo',
      name: 'Prof. Arthur Pendelton',
      desc: 'Academic Counselor • Exam schedules & athlete balance',
      icon: <BookOpen className="h-6 w-6 text-indigo-400" />,
      badge: 'Faculty',
      color: 'border-indigo-500/40 hover:border-indigo-500 bg-indigo-950/20',
    },
    {
      role: 'admin',
      title: 'Admin Demo',
      name: 'Dr. Sarah Jenkins',
      desc: 'Athletics Dir. / Security • RLS audit & reports archive',
      icon: <ShieldAlert className="h-6 w-6 text-purple-400" />,
      badge: 'Security Admin',
      color: 'border-purple-500/40 hover:border-purple-500 bg-purple-950/20',
    },
  ];

  return (
    <div className="flex min-h-screen flex-col justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-purple-950 py-12 px-4 sm:px-6 lg:px-8 text-white">
      <div className="mx-auto w-full max-w-md">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-xl">
            <Zap size={26} />
          </div>
          <h2 className="mt-4 text-2xl font-black tracking-tight sm:text-3xl">
            Sign In to Connecto
          </h2>
          <p className="mt-1 text-xs font-medium text-slate-400">
            Enterprise Athlete Risk Intelligence &amp; RLS Governance
          </p>
        </div>

        {/* Email + Password Form */}
        <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
          <form onSubmit={handleEmailLogin} className="space-y-4">
            {errorMsg && (
              <div className="rounded-xl border border-rose-500/40 bg-rose-950/50 p-3 text-xs font-semibold text-rose-300">
                {errorMsg}
              </div>
            )}

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
                  placeholder="m.vance@stanford-athletics.edu"
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

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 font-medium text-slate-300">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-950 text-purple-600 focus:ring-purple-500"
                />
                <span>Remember me</span>
              </label>
              <Link
                href="/forgot-password"
                className="font-bold text-purple-400 hover:text-purple-300"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 py-3 text-sm font-extrabold text-white shadow-lg transition-all hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <LogIn size={18} />
              )}
              <span>Sign In with Email</span>
            </button>
          </form>

          <div className="mt-6 border-t border-slate-800 pt-6 text-center text-xs text-slate-400">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="font-bold text-purple-400 hover:text-purple-300">
              Create an Account
            </Link>
          </div>
        </div>
      </div>

      {/* DEMO MODE: 5 INTERACTIVE ROLE CARDS (§Demo Mode requirement) */}
      <div className="mx-auto mt-12 w-full max-w-4xl">
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-400/30 bg-purple-500/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-purple-300">
            <Sparkles size={13} className="text-purple-400" />
            <span>Instant Demo Mode Access</span>
          </span>
          <h3 className="mt-2 text-xl font-extrabold text-white sm:text-2xl">
            Select a Role to Experience Read-Only Demo Accounts
          </h3>
          <p className="mt-1 text-xs text-slate-400">
            Each card logs you into an authentic NCAA Division I demo profile tailored to that specific role.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {demoRoles.map((dr) => (
            <button
              key={dr.role}
              onClick={() => handleDemoRoleClick(dr.role)}
              className={`group flex flex-col justify-between rounded-2xl border p-5 text-left shadow-lg transition-all hover:-translate-y-1 ${dr.color}`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 shadow-inner">
                    {dr.icon}
                  </div>
                  <span className="rounded-full bg-slate-900/80 px-2.5 py-0.5 text-[10px] font-bold text-slate-300">
                    {dr.badge}
                  </span>
                </div>

                <h4 className="mt-4 text-base font-black text-white group-hover:text-purple-300">
                  {dr.title}
                </h4>
                <p className="text-xs font-bold text-slate-300">{dr.name}</p>
                <p className="mt-2 text-xs leading-relaxed text-slate-400">
                  {dr.desc}
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-slate-800/80 pt-3 text-xs font-bold text-purple-400 group-hover:text-purple-300">
                <span>Launch {dr.title}</span>
                <LogIn size={14} />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
