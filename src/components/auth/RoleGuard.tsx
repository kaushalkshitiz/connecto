'use client';

// =============================================================================
// Athlete Risk Intelligence Platform
// RoleGuard — Enterprise Authentication & Role-Based Access Control Middleware
// =============================================================================

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useDemo } from '../../context/DemoContext';
import { isRoleAllowedForRoute, getDashboardPathForRole } from '../../lib/rbac';
import { ShieldAlert, Loader2 } from 'lucide-react';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const { isAuthenticated, activeRole } = useDemo();
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Give local storage / React hydration a brief tick to stabilize
    const timer = setTimeout(() => {
      if (!isAuthenticated) {
        router.replace('/login');
        return;
      }

      // Check if user's role is allowed on this route
      if (!isRoleAllowedForRoute(activeRole, pathname)) {
        router.replace('/unauthorized');
        return;
      }

      if (allowedRoles && !allowedRoles.includes(activeRole)) {
        router.replace('/unauthorized');
        return;
      }

      setIsChecking(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [isAuthenticated, activeRole, pathname, router, allowedRoles]);

  if (isChecking) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 text-white">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
          <p className="text-sm font-semibold tracking-wider uppercase text-slate-400">
            Verifying Security Session &amp; RBAC Permissions...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
