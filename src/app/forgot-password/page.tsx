'use client';

// =============================================================================
// Athlete Risk Intelligence Platform
// /forgot-password — Enterprise Password Recovery
// =============================================================================

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  CheckCircle2,
  KeyRound,
  Loader2,
  Mail,
  Zap,
} from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsSent(true);
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="flex min-h-screen flex-col justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-purple-950 py-12 px-4 sm:px-6 lg:px-8 text-white">
      <div className="mx-auto w-full max-w-md">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-xl">
            <KeyRound size={26} />
          </div>
          <h2 className="mt-4 text-2xl font-black tracking-tight sm:text-3xl">
            Reset University Password
          </h2>
          <p className="mt-1 text-xs font-medium text-slate-400">
            Enter your university email to receive a secure Supabase recovery link
          </p>
        </div>

        <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
          {isSent ? (
            <div className="space-y-6 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                <CheckCircle2 size={32} />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-black text-white">
                  Recovery Link Dispatched
                </h3>
                <p className="text-xs leading-relaxed text-slate-300">
                  If an account exists for <span className="font-bold text-white">{email}</span>, we have sent instructions for resetting your password.
                </p>
              </div>
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-6 py-2.5 text-xs font-bold text-white transition-all hover:bg-purple-500"
              >
                <ArrowLeft size={14} />
                <span>Return to Login</span>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
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
                    required
                    placeholder="m.vance@stanford-athletics.edu"
                    className="block w-full rounded-xl border border-slate-700 bg-slate-950 py-2.5 pl-10 pr-3 text-sm text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 py-3 text-sm font-extrabold text-white shadow-lg transition-all hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <span>Send Recovery Email</span>
                )}
              </button>
            </form>
          )}

          <div className="mt-6 border-t border-slate-800 pt-6 text-center text-xs text-slate-400">
            Remembered your password?{' '}
            <Link href="/login" className="font-bold text-purple-400 hover:text-purple-300">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
