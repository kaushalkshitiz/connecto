'use client';

// =============================================================================
// AI Athlete Growth Platform
// Dashboard Layout — Left Sidebar + Main Content Area + RoleGuard + Demo Banner
// =============================================================================

import React from 'react';
import { Sidebar } from '../../components/ui/Sidebar';
import { RoleGuard } from '../../components/auth/RoleGuard';
import { useDemo } from '../../context/DemoContext';
import { Info } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isDemoMode } = useDemo();

  return (
    <RoleGuard>
      <div className="flex min-h-[calc(100vh-4rem)] w-full flex-col">
        {/* Demo Mode Banner (§Demo Mode requirement) */}
        {isDemoMode && (
          <div className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 px-4 py-2 text-xs font-bold tracking-wide text-purple-200 shadow-sm dark:from-purple-950 dark:via-indigo-950 dark:to-slate-950">
            <Info size={14} className="text-purple-400" />
            <span>Demo Mode – Changes are not permanently saved.</span>
          </div>
        )}

        <div className="flex flex-1 w-full">
          {/* Left Sidebar (Desktop First, responsive) */}
          <Sidebar />

          {/* Main Dashboard Workspace */}
          <div className="flex-1 min-w-0 bg-slate-50/50 p-4 sm:p-6 md:p-8 dark:bg-slate-950">
            <div className="mx-auto max-w-7xl space-y-8">{children}</div>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
