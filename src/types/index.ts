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

// =============================================================================
// AI Athlete Growth Platform — Tasks, Scholarships, Tournaments, and Insights
// =============================================================================

export type TaskDifficulty = 'Low' | 'Medium' | 'High';
export type TaskStatus = 'Pending' | 'In Progress' | 'Completed';

export interface TrainingTask {
  id: string;
  athlete_id: string;
  coach_id: string;
  title: string;
  instructions: string;
  deadline: string; // YYYY-MM-DD
  difficulty: TaskDifficulty;
  status: TaskStatus;
  proof_url?: string;
  proof_note?: string;
  completed_at?: string;
  category: string; // e.g., 'Sprint Drills', 'Strength', 'Recovery', 'Video Analysis'
}

export interface Scholarship {
  id: string;
  name: string;
  provider: string;
  amount: string;
  deadline: string;
  category: string;
  eligibility: string;
  description: string;
  // IDs of athletes (User.id) who have registered/applied for this scholarship.
  appliedAthleteIds: string[];
}

export interface Tournament {
  id: string;
  name: string;
  sport: string;
  location: string;
  date: string;
  registration_status: 'Open' | 'Closing Soon' | 'Registered' | 'Closed';
  details: string;
  // IDs of athletes (User.id) who have registered for this tournament.
  registeredAthleteIds: string[];
}

export interface AIInsight {
  id: string;
  athlete_id: string;
  title: string;
  description: string;
  confidence: number; // Percentage 0-100 (e.g. 94)
  priority: 'High' | 'Medium' | 'Low';
  suggested_actions: {
    label: string;
    action_type: 'adjust_load' | 'schedule_pt' | 'view_drills' | 'rest';
  }[];
  // Diagnostic metrics computed from real check-in data (shown in the card footer)
  metrics?: {
    label: string;
    trend: 'up' | 'down' | 'info';
  }[];
  created_at: string;
}

export interface AthleteProfile {
  user_id: string;
  photo_url: string;
  sport: string;
  specialty: string;
  academic_year: string;
  gpa: string;
  achievements: string[];
  bio: string;
  training_streak: number; // e.g. 14 days
}

// =============================================================================
// AI Assistant & AIInsightReport Types (Phase 2 / AI Extension)
// =============================================================================

export type AIInsightReportType =
  | 'weekly'
  | 'monthly'
  | 'athlete_summary'
  | 'coach_summary'
  | 'department_summary';

export interface AIInsightReport {
  id: string;
  team_id: string;
  generated_at: string;
  summary_text: string;
  data_window_start: string;
  data_window_end: string;
  report_type: AIInsightReportType;
  title: string;
  target_id?: string; // athlete_id, coach_id, or department ID
  metrics?: {
    watchCount?: number;
    highRiskCount?: number;
    avgSleep?: number;
    avgSoreness?: number;
    completionRate?: number;
  };
}

export type AIAssistantRole = 'athlete' | 'coach' | 'admin';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  suggestedQuestions?: string[];
  contextUsed?: string[];
}

