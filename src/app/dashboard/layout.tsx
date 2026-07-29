// =============================================================================
// AI Athlete Growth Platform
// Dashboard Layout — Left Sidebar + Main Content Area
// =============================================================================

import React from 'react';
import { Sidebar } from '../../components/ui/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] w-full">
      {/* Left Sidebar (Desktop First, responsive) */}
      <Sidebar />

      {/* Main Dashboard Workspace */}
      <div className="flex-1 min-w-0 bg-slate-50/50 p-4 sm:p-6 md:p-8 dark:bg-slate-950">
        <div className="mx-auto max-w-7xl space-y-8">{children}</div>
      </div>
    </div>
  );
}
