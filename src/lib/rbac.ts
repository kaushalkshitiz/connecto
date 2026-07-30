// =============================================================================
// Athlete Risk Intelligence Platform — Enterprise RBAC & Permission Engine
// =============================================================================

import { UserRole } from '../types';

/**
 * All supported enterprise roles in the platform
 */
export const PLATFORM_ROLES: UserRole[] = [
  'athlete',
  'coach',
  'physio',
  'academic',
  'admin',
];

/**
 * Returns the human-readable display title for a given role
 */
export function getRoleDisplayName(role: UserRole): string {
  switch (role) {
    case 'athlete':
      return 'NCAA Student-Athlete';
    case 'coach':
      return 'Head Coach & Performance Staff';
    case 'physio':
      return 'Lead Physical Therapist (PT)';
    case 'academic':
      return 'Academic Counselor & Faculty';
    case 'admin':
      return 'Athletics Director / Admin';
    default:
      return role;
  }
}

/**
 * Returns the official dashboard path assigned to a given role
 */
export function getDashboardPathForRole(role: UserRole): string {
  switch (role) {
    case 'athlete':
      return '/dashboard/athlete';
    case 'coach':
      return '/dashboard/coach';
    case 'physio':
      return '/dashboard/physio';
    case 'academic':
      return '/dashboard/academic';
    case 'admin':
      return '/dashboard/admin';
    default:
      return '/login';
  }
}

/**
 * Validates whether a role is authorized to access a specific route pathname
 * Admins have access to /dashboard/admin and can inspect general team views,
 * but each role is primarily constrained to their assigned dashboard.
 */
export function isRoleAllowedForRoute(role: UserRole, pathname: string): boolean {
  if (pathname.startsWith('/dashboard/unauthorized')) return true;
  if (pathname === '/dashboard/profile') return true;
  // Tournament & scholarship discovery/registration is open to every role.
  if (pathname.startsWith('/dashboard/tournaments')) return true;
  if (pathname.startsWith('/dashboard/scholarships')) return true;

  if (role === 'admin') {
    // Admin has full access
    return true;
  }

  if (role === 'athlete') {
    // Athletes manage their own dashboard and assigned training tasks.
    return (
      pathname.startsWith('/dashboard/athlete') ||
      pathname.startsWith('/dashboard/tasks')
    );
  }

  if (role === 'coach') {
    return pathname.startsWith('/dashboard/coach') || pathname.startsWith('/dashboard/tasks');
  }

  if (role === 'physio') {
    return pathname.startsWith('/dashboard/physio');
  }

  if (role === 'academic') {
    return pathname.startsWith('/dashboard/academic');
  }

  return false;
}

/**
 * Medical & Physiotherapy permissions (§4.4)
 * Only Physio may add, update, delete injuries, or clear return-to-play status.
 * No other role can modify medical information.
 */
export function canViewMedicalRecords(role: UserRole, isOwnAthlete: boolean = false): boolean {
  if (role === 'physio' || role === 'admin') return true;
  if (role === 'athlete' && isOwnAthlete) return true;
  // Coaches can see summary read-only status (e.g. "Recovering", "Cleared")
  if (role === 'coach') return true;
  return false;
}

export function canEditMedicalRecords(role: UserRole): boolean {
  // STRICT RULE: Only Physio may add, update, or delete injuries and recovery clearance.
  return role === 'physio';
}

/**
 * Academic & Schedule permissions
 */
export function canViewAcademicRecords(role: UserRole): boolean {
  return role === 'academic' || role === 'coach' || role === 'admin' || role === 'athlete';
}

export function canEditAcademicRecords(role: UserRole): boolean {
  return role === 'academic' || role === 'admin';
}

/**
 * Training Plan & Workout Task permissions
 */
export function canEditTrainingPlans(role: UserRole): boolean {
  return role === 'coach' || role === 'admin';
}

/**
 * Check-in & Self-Report permissions
 */
export function canEditCheckIn(role: UserRole, isOwnAthlete: boolean = false): boolean {
  return role === 'athlete' && isOwnAthlete;
}
