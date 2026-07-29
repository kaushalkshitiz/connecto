'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '../../lib/supabase/client';
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'password' | 'magic_link'>('password');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const supabase = createClient();

    if (!supabase) {
      // Demo fallback if Supabase env vars are not set
      setMessage({
        type: 'success',
        text: 'Demo Mode Active: Supabase environment variables not configured. Redirecting to Coach Dashboard...',
      });
      setTimeout(() => {
        router.push('/dashboard/coach');
      }, 1000);
      return;
    }

    try {
      if (mode === 'password') {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setMessage({ type: 'error', text: error.message });
        } else {
          router.push('/dashboard/coach');
        }
      } else {
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });

        if (error) {
          setMessage({ type: 'error', text: error.message });
        } else {
          setMessage({
            type: 'success',
            text: 'Magic link sent! Please check your email inbox to log in.',
          });
        }
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'An unexpected error occurred during authentication.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[75vh] items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl backdrop-blur-xl">
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-400">
            <ShieldCheck size={28} />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
            Sign In to Platform
          </h2>
          <p className="text-sm text-slate-400">
            Access your university athletics department account
          </p>
        </div>

        {/* Form Mode Selector */}
        <div className="grid grid-cols-2 rounded-xl bg-slate-950 p-1 border border-slate-800 text-xs font-bold uppercase tracking-wider">
          <button
            type="button"
            onClick={() => setMode('password')}
            className={`rounded-lg py-2.5 transition-all ${
              mode === 'password'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Password
          </button>
          <button
            type="button"
            onClick={() => setMode('magic_link')}
            className={`rounded-lg py-2.5 transition-all ${
              mode === 'magic_link'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Magic Link
          </button>
        </div>

        {/* Message Banner */}
        {message && (
          <div
            className={`flex items-start gap-3 rounded-2xl p-4 text-xs ${
              message.type === 'error'
                ? 'border border-rose-500/40 bg-rose-950/30 text-rose-300'
                : 'border border-emerald-500/40 bg-emerald-950/30 text-emerald-300'
            }`}
          >
            {message.type === 'error' ? (
              <AlertCircle size={18} className="text-rose-400 shrink-0 mt-0.5" />
            ) : (
              <ShieldCheck size={18} className="text-emerald-400 shrink-0 mt-0.5" />
            )}
            <p className="leading-relaxed">{message.text}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="coach@stanford.edu"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          {mode === 'password' && (
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/30 transition-all hover:bg-emerald-500 disabled:opacity-50"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>{mode === 'password' ? 'Sign In' : 'Send Magic Link'}</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
