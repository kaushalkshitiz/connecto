// =============================================================================
// Shared TypeScript Types (matching MVP Data Model in Section 5 of spec.md)
// =============================================================================

export type UserRole = 'admin' | 'coach' | 'physio' | 'academic' | 'athlete';

export type RiskLevel = 'low' | 'watch' | 'high';

export type PhysioStatus = 'active' | 'recovering' | 'cleared';

export interface User {
  id: string;
  name: string;
  email: string;
  password_hash?: string;
  created_at: string;
}

export interface Team {
  id: string;
  name: string;
  admin_user_id: string | null;
}

export interface TeamMembership {
  id: string;
  user_id: string;
  team_id: string;
  role: UserRole;
  created_at: string;
}

export interface CheckIn {
  id: string;
  athlete_id: string;
  team_id: string;
  date: string;          // YYYY-MM-DD
  sleep_hours: number;   // 0-24
  soreness: number;      // 1-5
  mood: number;          // 1-5
  rpe: number | null;    // 1-10 (nullable)
  note: string | null;
  created_at: string;
}

export interface CoachObservation {
  id: string;
  athlete_id: string;
  coach_id: string | null; // ON DELETE SET NULL
  team_id: string;
  date: string;
  note: string;
  created_at: string;
  coach_name?: string;
}

export interface PhysioNote {
  id: string;
  athlete_id: string;
  physio_id: string | null; // ON DELETE SET NULL
  team_id: string;
  date: string;
  status: PhysioStatus;
  note: string;
  created_at: string;
  physio_name?: string;
}

export interface RiskFlag {
  id: string;
  athlete_id: string;
  team_id: string;
  level: RiskLevel;
  reason: string;
  computed_at: string;
}

// =============================================================================
// UI & Computed Presentation Types
// =============================================================================

export interface AthleteRiskSummary {
  athlete: User;
  currentRisk: RiskFlag;
  latestCheckIn: CheckIn | null;
  daysSinceLastCheckIn: number;
  sevenDayAvgSleep: number | null;
  sevenDayAvgSoreness: number | null;
  sevenDayAvgMood: number | null;
  activeInjuryNotes: PhysioNote[];
  recentObservations: CoachObservation[];
  recentCheckIns: CheckIn[];
}

export interface RiskCalculationInput {
  athleteId: string;
  teamId: string;
  checkIns: CheckIn[];
  physioNotes: PhysioNote[];
  referenceDate?: string; // Defaults to today (YYYY-MM-DD)
}

export interface RiskCalculationResult {
  athleteId: string;
  teamId: string;
  level: RiskLevel;
  reasons: string[];
  watchConditions: {
    lowSleep: boolean;
    highSoreness: boolean;
    missingCheckIns: boolean;
  };
  hasActiveInjury: boolean;
  computedAt: string;
  sevenDayAvgSleep: number | null;
  sevenDayAvgSoreness: number | null;
  daysSinceLastCheckIn: number;
}
