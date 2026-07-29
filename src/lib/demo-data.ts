// =============================================================================
// Athlete Risk Intelligence Platform
// Demo Dataset (Stanford Track & Field - Mirrors supabase/seed.sql)
// =============================================================================

import {
  AIInsight,
  AthleteProfile,
  CheckIn,
  CoachObservation,
  PhysioNote,
  Scholarship,
  Team,
  TeamMembership,
  Tournament,
  TrainingTask,
  User,
} from '../types';
import { calculateRiskScore, toRiskFlag } from './risk-scoring';

export const DEMO_TEAM: Team = {
  id: '11111111-1111-4111-8111-111111111111',
  name: 'Stanford Track & Field',
  admin_user_id: '00000000-0000-4000-8000-000000000001',
};

export const DEMO_USERS: User[] = [
  // Staff
  {
    id: '00000000-0000-4000-8000-000000000001',
    name: 'Dr. Sarah Jenkins',
    email: 's.jenkins@stanford-athletics.edu',
    created_at: '2026-05-01T00:00:00Z',
  },
  {
    id: '00000000-0000-4000-8000-000000000002',
    name: 'Coach Marcus Vance',
    email: 'm.vance@stanford-athletics.edu',
    created_at: '2026-05-05T00:00:00Z',
  },
  {
    id: '00000000-0000-4000-8000-000000000003',
    name: 'Coach Elena Rostova',
    email: 'e.rostova@stanford-athletics.edu',
    created_at: '2026-05-10T00:00:00Z',
  },
  {
    id: '00000000-0000-4000-8000-000000000004',
    name: 'Dr. David Chen, PT',
    email: 'd.chen@stanford-athletics.edu',
    created_at: '2026-05-05T00:00:00Z',
  },
  {
    id: '00000000-0000-4000-8000-000000000005',
    name: 'Prof. Arthur Pendelton',
    email: 'a.pendelton@stanford-athletics.edu',
    created_at: '2026-05-05T00:00:00Z',
  },

  // Athletes
  {
    id: '33333333-3333-4333-8333-333333333301',
    name: 'Maya Lin',
    email: 'maya.lin@stanford.edu',
    created_at: '2026-06-01T00:00:00Z',
  },
  {
    id: '33333333-3333-4333-8333-333333333302',
    name: 'Jordan Thorne',
    email: 'jordan.t@stanford.edu',
    created_at: '2026-06-01T00:00:00Z',
  },
  {
    id: '33333333-3333-4333-8333-333333333303',
    name: 'Liam Carter',
    email: 'l.carter@stanford.edu',
    created_at: '2026-06-01T00:00:00Z',
  },
  {
    id: '33333333-3333-4333-8333-333333333304',
    name: 'Chloe Ramirez',
    email: 'chloe.r@stanford.edu',
    created_at: '2026-06-01T00:00:00Z',
  },
  {
    id: '33333333-3333-4333-8333-333333333305',
    name: 'Darius Vance',
    email: 'darius.v@stanford.edu',
    created_at: '2026-06-01T00:00:00Z',
  },
  {
    id: '33333333-3333-4333-8333-333333333306',
    name: 'Sienna Brooks',
    email: 'sienna.b@stanford.edu',
    created_at: '2026-06-01T00:00:00Z',
  },
];

export const DEMO_MEMBERSHIPS: TeamMembership[] = [
  { id: 'tm-1', user_id: '00000000-0000-4000-8000-000000000001', team_id: DEMO_TEAM.id, role: 'admin', created_at: '2026-05-01T00:00:00Z' },
  { id: 'tm-2', user_id: '00000000-0000-4000-8000-000000000002', team_id: DEMO_TEAM.id, role: 'coach', created_at: '2026-05-05T00:00:00Z' },
  { id: 'tm-3', user_id: '00000000-0000-4000-8000-000000000003', team_id: DEMO_TEAM.id, role: 'coach', created_at: '2026-05-10T00:00:00Z' },
  { id: 'tm-4', user_id: '00000000-0000-4000-8000-000000000004', team_id: DEMO_TEAM.id, role: 'physio', created_at: '2026-05-05T00:00:00Z' },
  { id: 'tm-5', user_id: '00000000-0000-4000-8000-000000000005', team_id: DEMO_TEAM.id, role: 'academic', created_at: '2026-05-05T00:00:00Z' },

  { id: 'tm-11', user_id: '33333333-3333-4333-8333-333333333301', team_id: DEMO_TEAM.id, role: 'athlete', created_at: '2026-06-01T00:00:00Z' },
  { id: 'tm-12', user_id: '33333333-3333-4333-8333-333333333302', team_id: DEMO_TEAM.id, role: 'athlete', created_at: '2026-06-01T00:00:00Z' },
  { id: 'tm-13', user_id: '33333333-3333-4333-8333-333333333303', team_id: DEMO_TEAM.id, role: 'athlete', created_at: '2026-06-01T00:00:00Z' },
  { id: 'tm-14', user_id: '33333333-3333-4333-8333-333333333304', team_id: DEMO_TEAM.id, role: 'athlete', created_at: '2026-06-01T00:00:00Z' },
  { id: 'tm-15', user_id: '33333333-3333-4333-8333-333333333305', team_id: DEMO_TEAM.id, role: 'athlete', created_at: '2026-06-01T00:00:00Z' },
  { id: 'tm-16', user_id: '33333333-3333-4333-8333-333333333306', team_id: DEMO_TEAM.id, role: 'athlete', created_at: '2026-06-01T00:00:00Z' },
];

// Helper to format YYYY-MM-DD offset from today
function getOffsetDate(daysAgo: number): string {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().slice(0, 10);
}

export function getInitialDemoState() {
  const checkIns: CheckIn[] = [
    // Maya Lin (HIGH RISK: sleep < 6 + active injury note)
    { id: 'ci-1', athlete_id: '33333333-3333-4333-8333-333333333301', team_id: DEMO_TEAM.id, date: getOffsetDate(6), sleep_hours: 5.0, soreness: 4, mood: 2, rpe: 8, note: 'Hamstring feeling tight after block starts', created_at: new Date().toISOString() },
    { id: 'ci-2', athlete_id: '33333333-3333-4333-8333-333333333301', team_id: DEMO_TEAM.id, date: getOffsetDate(5), sleep_hours: 5.5, soreness: 4, mood: 3, rpe: 7, note: 'Struggling to sleep due to midterms', created_at: new Date().toISOString() },
    { id: 'ci-3', athlete_id: '33333333-3333-4333-8333-333333333301', team_id: DEMO_TEAM.id, date: getOffsetDate(4), sleep_hours: 4.8, soreness: 5, mood: 2, rpe: 9, note: 'Sharp pain in left posterior thigh', created_at: new Date().toISOString() },
    { id: 'ci-4', athlete_id: '33333333-3333-4333-8333-333333333301', team_id: DEMO_TEAM.id, date: getOffsetDate(3), sleep_hours: 6.0, soreness: 4, mood: 3, rpe: 7, note: 'Saw Dr. Chen, iced and compressed', created_at: new Date().toISOString() },
    { id: 'ci-5', athlete_id: '33333333-3333-4333-8333-333333333301', team_id: DEMO_TEAM.id, date: getOffsetDate(2), sleep_hours: 5.1, soreness: 4, mood: 2, rpe: 8, note: 'Soreness persistent, sleep broken', created_at: new Date().toISOString() },
    { id: 'ci-6', athlete_id: '33333333-3333-4333-8333-333333333301', team_id: DEMO_TEAM.id, date: getOffsetDate(1), sleep_hours: 4.9, soreness: 5, mood: 2, rpe: 9, note: 'Tired and sore, hard sprint session', created_at: new Date().toISOString() },
    { id: 'ci-7', athlete_id: '33333333-3333-4333-8333-333333333301', team_id: DEMO_TEAM.id, date: getOffsetDate(0), sleep_hours: 5.1, soreness: 4, mood: 2, rpe: 8, note: 'Hamstring still tender; low energy', created_at: new Date().toISOString() },

    // Jordan Thorne (WATCH RISK: soreness avg >= 4.0)
    { id: 'ci-11', athlete_id: '33333333-3333-4333-8333-333333333302', team_id: DEMO_TEAM.id, date: getOffsetDate(6), sleep_hours: 7.5, soreness: 4, mood: 4, rpe: 7, note: 'Heavy legs after tempo run', created_at: new Date().toISOString() },
    { id: 'ci-12', athlete_id: '33333333-3333-4333-8333-333333333302', team_id: DEMO_TEAM.id, date: getOffsetDate(5), sleep_hours: 7.0, soreness: 4, mood: 3, rpe: 8, note: 'Quad soreness from lifting day', created_at: new Date().toISOString() },
    { id: 'ci-13', athlete_id: '33333333-3333-4333-8333-333333333302', team_id: DEMO_TEAM.id, date: getOffsetDate(4), sleep_hours: 6.8, soreness: 5, mood: 3, rpe: 8, note: 'High soreness in calves and quads', created_at: new Date().toISOString() },
    { id: 'ci-14', athlete_id: '33333333-3333-4333-8333-333333333302', team_id: DEMO_TEAM.id, date: getOffsetDate(3), sleep_hours: 7.2, soreness: 4, mood: 4, rpe: 7, note: 'Foam rolled, still stiff', created_at: new Date().toISOString() },
    { id: 'ci-15', athlete_id: '33333333-3333-4333-8333-333333333302', team_id: DEMO_TEAM.id, date: getOffsetDate(2), sleep_hours: 7.1, soreness: 4, mood: 4, rpe: 7, note: 'Normal morning check-in', created_at: new Date().toISOString() },
    { id: 'ci-16', athlete_id: '33333333-3333-4333-8333-333333333302', team_id: DEMO_TEAM.id, date: getOffsetDate(1), sleep_hours: 6.9, soreness: 4, mood: 3, rpe: 8, note: 'Tough interval workout yesterday', created_at: new Date().toISOString() },
    { id: 'ci-17', athlete_id: '33333333-3333-4333-8333-333333333302', team_id: DEMO_TEAM.id, date: getOffsetDate(0), sleep_hours: 7.3, soreness: 4, mood: 4, rpe: 7, note: 'Soreness remains high across lower body', created_at: new Date().toISOString() },

    // Liam Carter (WATCH RISK: No check-in for 5 days)
    { id: 'ci-21', athlete_id: '33333333-3333-4333-8333-333333333303', team_id: DEMO_TEAM.id, date: getOffsetDate(6), sleep_hours: 7.2, soreness: 3, mood: 4, rpe: 6, note: 'Solid pole vault practice', created_at: new Date().toISOString() },
    { id: 'ci-22', athlete_id: '33333333-3333-4333-8333-333333333303', team_id: DEMO_TEAM.id, date: getOffsetDate(5), sleep_hours: 7.0, soreness: 3, mood: 4, rpe: 7, note: 'Good recovery day', created_at: new Date().toISOString() },

    // Chloe Ramirez (LOW RISK: Normal stats)
    { id: 'ci-31', athlete_id: '33333333-3333-4333-8333-333333333304', team_id: DEMO_TEAM.id, date: getOffsetDate(6), sleep_hours: 8.2, soreness: 2, mood: 5, rpe: 5, note: 'Felt strong on distance trail', created_at: new Date().toISOString() },
    { id: 'ci-32', athlete_id: '33333333-3333-4333-8333-333333333304', team_id: DEMO_TEAM.id, date: getOffsetDate(5), sleep_hours: 8.0, soreness: 2, mood: 4, rpe: 6, note: 'Good recovery', created_at: new Date().toISOString() },
    { id: 'ci-33', athlete_id: '33333333-3333-4333-8333-333333333304', team_id: DEMO_TEAM.id, date: getOffsetDate(4), sleep_hours: 7.8, soreness: 2, mood: 5, rpe: 6, note: 'Smooth track intervals', created_at: new Date().toISOString() },
    { id: 'ci-34', athlete_id: '33333333-3333-4333-8333-333333333304', team_id: DEMO_TEAM.id, date: getOffsetDate(3), sleep_hours: 8.1, soreness: 1, mood: 5, rpe: 5, note: 'Rested and energized', created_at: new Date().toISOString() },
    { id: 'ci-35', athlete_id: '33333333-3333-4333-8333-333333333304', team_id: DEMO_TEAM.id, date: getOffsetDate(2), sleep_hours: 7.9, soreness: 2, mood: 4, rpe: 6, note: 'Great rhythm', created_at: new Date().toISOString() },
    { id: 'ci-36', athlete_id: '33333333-3333-4333-8333-333333333304', team_id: DEMO_TEAM.id, date: getOffsetDate(1), sleep_hours: 8.0, soreness: 2, mood: 5, rpe: 5, note: 'Ready for competition block', created_at: new Date().toISOString() },
    { id: 'ci-37', athlete_id: '33333333-3333-4333-8333-333333333304', team_id: DEMO_TEAM.id, date: getOffsetDate(0), sleep_hours: 8.2, soreness: 2, mood: 5, rpe: 5, note: 'Feeling fresh', created_at: new Date().toISOString() },

    // Darius Vance (LOW RISK: Recovering normally)
    { id: 'ci-41', athlete_id: '33333333-3333-4333-8333-333333333305', team_id: DEMO_TEAM.id, date: getOffsetDate(6), sleep_hours: 7.5, soreness: 3, mood: 4, rpe: 6, note: 'Ankle taped for drills', created_at: new Date().toISOString() },
    { id: 'ci-42', athlete_id: '33333333-3333-4333-8333-333333333305', team_id: DEMO_TEAM.id, date: getOffsetDate(5), sleep_hours: 7.6, soreness: 2, mood: 4, rpe: 5, note: 'Physical therapy went well', created_at: new Date().toISOString() },
    { id: 'ci-43', athlete_id: '33333333-3333-4333-8333-333333333305', team_id: DEMO_TEAM.id, date: getOffsetDate(4), sleep_hours: 7.4, soreness: 3, mood: 4, rpe: 6, note: 'Light sprint mechanics', created_at: new Date().toISOString() },
    { id: 'ci-44', athlete_id: '33333333-3333-4333-8333-333333333305', team_id: DEMO_TEAM.id, date: getOffsetDate(3), sleep_hours: 7.8, soreness: 2, mood: 5, rpe: 5, note: 'Ankle swelling down', created_at: new Date().toISOString() },
    { id: 'ci-45', athlete_id: '33333333-3333-4333-8333-333333333305', team_id: DEMO_TEAM.id, date: getOffsetDate(2), sleep_hours: 7.5, soreness: 2, mood: 4, rpe: 6, note: 'Good block work', created_at: new Date().toISOString() },
    { id: 'ci-46', athlete_id: '33333333-3333-4333-8333-333333333305', team_id: DEMO_TEAM.id, date: getOffsetDate(1), sleep_hours: 7.7, soreness: 2, mood: 4, rpe: 5, note: 'No pain during acceleration', created_at: new Date().toISOString() },
    { id: 'ci-47', athlete_id: '33333333-3333-4333-8333-333333333305', team_id: DEMO_TEAM.id, date: getOffsetDate(0), sleep_hours: 7.6, soreness: 2, mood: 5, rpe: 5, note: 'Feeling back to 95%', created_at: new Date().toISOString() },

    // Sienna Brooks (HIGH RISK: sleep < 6 AND soreness >= 4)
    { id: 'ci-51', athlete_id: '33333333-3333-4333-8333-333333333306', team_id: DEMO_TEAM.id, date: getOffsetDate(6), sleep_hours: 5.2, soreness: 4, mood: 2, rpe: 8, note: 'Exhausted after jump practice', created_at: new Date().toISOString() },
    { id: 'ci-52', athlete_id: '33333333-3333-4333-8333-333333333306', team_id: DEMO_TEAM.id, date: getOffsetDate(5), sleep_hours: 5.5, soreness: 4, mood: 3, rpe: 7, note: 'Late night studying', created_at: new Date().toISOString() },
    { id: 'ci-53', athlete_id: '33333333-3333-4333-8333-333333333306', team_id: DEMO_TEAM.id, date: getOffsetDate(4), sleep_hours: 5.1, soreness: 5, mood: 2, rpe: 9, note: 'Lower back and knee soreness', created_at: new Date().toISOString() },
    { id: 'ci-54', athlete_id: '33333333-3333-4333-8333-333333333306', team_id: DEMO_TEAM.id, date: getOffsetDate(3), sleep_hours: 5.4, soreness: 4, mood: 2, rpe: 8, note: 'Trouble sleeping', created_at: new Date().toISOString() },
    { id: 'ci-55', athlete_id: '33333333-3333-4333-8333-333333333306', team_id: DEMO_TEAM.id, date: getOffsetDate(2), sleep_hours: 5.0, soreness: 5, mood: 2, rpe: 9, note: 'Stiff take-off leg', created_at: new Date().toISOString() },
    { id: 'ci-56', athlete_id: '33333333-3333-4333-8333-333333333306', team_id: DEMO_TEAM.id, date: getOffsetDate(1), sleep_hours: 5.3, soreness: 4, mood: 3, rpe: 8, note: 'Still feeling drained', created_at: new Date().toISOString() },
    { id: 'ci-57', athlete_id: '33333333-3333-4333-8333-333333333306', team_id: DEMO_TEAM.id, date: getOffsetDate(0), sleep_hours: 5.2, soreness: 4, mood: 2, rpe: 8, note: 'High fatigue and body soreness', created_at: new Date().toISOString() },
  ];

  const physioNotes: PhysioNote[] = [
    {
      id: 'pn-1',
      athlete_id: '33333333-3333-4333-8333-333333333301',
      physio_id: '00000000-0000-4000-8000-000000000004',
      team_id: DEMO_TEAM.id,
      date: getOffsetDate(4),
      status: 'active',
      note: 'Grade 1 left hamstring strain at biceps femoris musculo-tendinous junction. Start daily ice and eccentric loading.',
      created_at: new Date().toISOString(),
      physio_name: 'Dr. David Chen, PT',
    },
    {
      id: 'pn-2',
      athlete_id: '33333333-3333-4333-8333-333333333305',
      physio_id: '00000000-0000-4000-8000-000000000004',
      team_id: DEMO_TEAM.id,
      date: getOffsetDate(10),
      status: 'recovering',
      note: 'Right lateral ankle sprain (ATFL). Swelling reduced 80%. Cleared for straight-line running and block drills.',
      created_at: new Date().toISOString(),
      physio_name: 'Dr. David Chen, PT',
    },
    {
      id: 'pn-3',
      athlete_id: '33333333-3333-4333-8333-333333333304',
      physio_id: '00000000-0000-4000-8000-000000000004',
      team_id: DEMO_TEAM.id,
      date: getOffsetDate(20),
      status: 'cleared',
      note: 'Minor plantar fascia tightness resolved with custom orthotics and stretching.',
      created_at: new Date().toISOString(),
      physio_name: 'Dr. David Chen, PT',
    },
  ];

  const observations: CoachObservation[] = [
    {
      id: 'obs-1',
      athlete_id: '33333333-3333-4333-8333-333333333301',
      coach_id: '00000000-0000-4000-8000-000000000002',
      team_id: DEMO_TEAM.id,
      date: getOffsetDate(4),
      note: 'Noticed Maya limping slightly after 200m repeat. Pulled her from remaining sets and referred to Dr. Chen.',
      created_at: new Date().toISOString(),
      coach_name: 'Coach Marcus Vance',
    },
    {
      id: 'obs-2',
      athlete_id: '33333333-3333-4333-8333-333333333301',
      coach_id: '00000000-0000-4000-8000-000000000002',
      team_id: DEMO_TEAM.id,
      date: getOffsetDate(1),
      note: 'Restricting Maya to non-impact cycle work until physio clearance.',
      created_at: new Date().toISOString(),
      coach_name: 'Coach Marcus Vance',
    },
    {
      id: 'obs-3',
      athlete_id: '33333333-3333-4333-8333-333333333302',
      coach_id: '00000000-0000-4000-8000-000000000002',
      team_id: DEMO_TEAM.id,
      date: getOffsetDate(2),
      note: 'Jordan reporting heavy legs. Adjusted Friday workout to active recovery tempo.',
      created_at: new Date().toISOString(),
      coach_name: 'Coach Marcus Vance',
    },
    {
      id: 'obs-4',
      athlete_id: '33333333-3333-4333-8333-333333333303',
      coach_id: '00000000-0000-4000-8000-000000000003',
      team_id: DEMO_TEAM.id,
      date: getOffsetDate(1),
      note: 'Liam missed check-ins this week due to travel; reminder sent via SMS.',
      created_at: new Date().toISOString(),
      coach_name: 'Coach Elena Rostova',
    },
    {
      id: 'obs-5',
      athlete_id: '33333333-3333-4333-8333-333333333306',
      coach_id: '00000000-0000-4000-8000-000000000003',
      team_id: DEMO_TEAM.id,
      date: getOffsetDate(0),
      note: 'Take-off mechanics looking sluggish from fatigue. Reduced jump volume by 50%.',
      created_at: new Date().toISOString(),
      coach_name: 'Coach Elena Rostova',
    },
  ];

  // Compute initial risk flags for every athlete using our deterministic engine
  const athleteUsers = DEMO_USERS.filter((u) =>
    DEMO_MEMBERSHIPS.some((m) => m.user_id === u.id && m.role === 'athlete')
  );

  const riskFlags = athleteUsers.map((athlete) => {
    const athleteCheckIns = checkIns.filter((c) => c.athlete_id === athlete.id);
    const athletePhysioNotes = physioNotes.filter((p) => p.athlete_id === athlete.id);

    const calcResult = calculateRiskScore({
      athleteId: athlete.id,
      teamId: DEMO_TEAM.id,
      checkIns: athleteCheckIns,
      physioNotes: athletePhysioNotes,
    });

    return toRiskFlag(calcResult);
  });

  return {
    team: DEMO_TEAM,
    users: DEMO_USERS,
    memberships: DEMO_MEMBERSHIPS,
    checkIns,
    observations,
    physioNotes,
    riskFlags,
    tasks: DEMO_TASKS,
    scholarships: DEMO_SCHOLARSHIPS,
    tournaments: DEMO_TOURNAMENTS,
    aiInsights: DEMO_AI_INSIGHTS,
    profiles: DEMO_PROFILES,
  };
}

// =============================================================================
// AI Athlete Growth Platform — Seed Data for Tasks, Scholarships, Tournaments
// =============================================================================

export const DEMO_TASKS: TrainingTask[] = [
  {
    id: 'task-1',
    athlete_id: '33333333-3333-4333-8333-333333333301', // Maya Lin
    coach_id: '00000000-0000-4000-8000-000000000002',
    title: 'Complete 4x100m Relay Hand-off Drill Video Review',
    instructions:
      'Watch the slow-motion block starts from Tuesday session. Analyze rear-foot clearance and hand-off timing at 30m mark.',
    deadline: '2026-07-30',
    difficulty: 'Medium',
    status: 'Pending',
    category: 'Video Analysis',
  },
  {
    id: 'task-2',
    athlete_id: '33333333-3333-4333-8333-333333333301', // Maya Lin
    coach_id: '00000000-0000-4000-8000-000000000002',
    title: 'Post-Workout Ice Bath & Hamstring Compression Session',
    instructions:
      'Complete 15-minute cold plunge (10°C) followed by pneumatic compression boots on left hamstring.',
    deadline: '2026-07-29',
    difficulty: 'Low',
    status: 'Completed',
    proof_url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400',
    proof_note: '15 min cold plunge completed after track session.',
    completed_at: '2026-07-29T10:15:00Z',
    category: 'Recovery',
  },
  {
    id: 'task-3',
    athlete_id: '33333333-3333-4333-8333-333333333301', // Maya Lin
    coach_id: '00000000-0000-4000-8000-000000000002',
    title: 'Plyometric Box Jump Progress Assessment',
    instructions:
      'Perform 3 sets of 5 depth jumps (30-inch box). Focus on sub-250ms ground contact time and upload video proof.',
    deadline: '2026-07-31',
    difficulty: 'High',
    status: 'In Progress',
    category: 'Strength & Power',
  },
  {
    id: 'task-4',
    athlete_id: '33333333-3333-4333-8333-333333333302', // Jordan Thorne
    coach_id: '00000000-0000-4000-8000-000000000003',
    title: 'Aerobic Threshold 8km Recovery Run',
    instructions:
      'Maintain heart rate zone 2 (<145 bpm) on soft turf track. Log Garmin FIT file upon completion.',
    deadline: '2026-07-30',
    difficulty: 'Medium',
    status: 'Pending',
    category: 'Endurance',
  },
  {
    id: 'task-5',
    athlete_id: '33333333-3333-4333-8333-333333333306', // Sienna Brooks
    coach_id: '00000000-0000-4000-8000-000000000003',
    title: 'Biomechanical Take-off Angle Analysis Video Proof',
    instructions:
      'Record 3 full-runup javelin throws from lateral side angle (120fps min) for Coach Rostova review.',
    deadline: '2026-08-01',
    difficulty: 'High',
    status: 'Pending',
    category: 'Technique',
  },
];

export const DEMO_SCHOLARSHIPS: Scholarship[] = [
  {
    id: 'sch-1',
    name: 'NCAA Division I Elite Track & Field Merit Scholarship',
    provider: 'Stanford Athletics Endowment Fund',
    amount: '$25,000 / yr',
    deadline: '2026-08-15',
    category: 'NCAA Div I',
    eligibility: 'Top-8 conference finalists in sprints, hurdles, or field events with min 3.3 GPA.',
    description:
      'Annual endowed grant supporting high-achieving student-athletes with tuition, training equipment, and international competition travel grants.',
    applied: true,
  },
  {
    id: 'sch-2',
    name: 'Arthur Pendelton Student-Athlete Academic Excellence Grant',
    provider: 'Pac-12 Academic Foundation',
    amount: '$12,500 / yr',
    deadline: '2026-09-01',
    category: 'Merit & Athletic',
    eligibility: 'Active varsity roster athlete with cumulative GPA >= 3.75 in STEM or Humanities.',
    description:
      'Recognizes student-athletes who balance rigorous academic coursework with varsity competition.',
    applied: false,
  },
  {
    id: 'sch-3',
    name: 'Nike NextGen Olympic Athlete Development Fellowship',
    provider: 'Nike Sports Science & Innovation Program',
    amount: '$18,000 / yr',
    deadline: '2026-08-30',
    category: 'Endowed Fellowship',
    eligibility: 'Collegiate athletes qualifying for USATF National Olympic Trials in short sprints or distance.',
    description:
      'Includes sports science lab testing, custom footwear development access, and annual stipend.',
    applied: false,
  },
  {
    id: 'sch-4',
    name: 'Global Athletics Leadership & Community Impact Scholarship',
    provider: 'World Athletics Development Council',
    amount: '$10,000 / yr',
    deadline: '2026-10-12',
    category: 'International',
    eligibility: 'Athletes demonstrating active leadership in youth sports outreach and mentorship.',
    description:
      'Empowers collegiate leaders to host community athletics clinics in underserved school districts.',
    applied: false,
  },
];

export const DEMO_TOURNAMENTS: Tournament[] = [
  {
    id: 'tour-1',
    name: '2026 Pac-12 Outdoor Track & Field Championships',
    sport: 'Track & Field • Sprints / Distance / Field',
    location: 'Stanford University (Cobb Track & Angell Field)',
    date: 'May 14–16, 2026',
    registration_status: 'Open',
    details:
      'Premier conference championship meet qualifying top regional finishers for NCAA West Preliminaries.',
    registered: true,
  },
  {
    id: 'tour-2',
    name: 'NCAA Division I West Preliminary Round',
    sport: 'Track & Field • All NCAA Events',
    location: 'Hornet Stadium, Sacramento, CA',
    date: 'May 28–30, 2026',
    registration_status: 'Registered',
    details:
      'Official NCAA regional qualification tournament to determine the 48 finalists advancing to NCAA Outdoors.',
    registered: true,
  },
  {
    id: 'tour-3',
    name: 'Stanford Invitational & Multi-Event Open',
    sport: 'Track & Field • Invitational Sprints & Relays',
    location: 'Stanford University, Stanford, CA',
    date: 'Apr 10–11, 2026',
    registration_status: 'Closed',
    details:
      'Annual premier collegiate and professional early-season invitational featuring over 3,000 athletes.',
    registered: false,
  },
  {
    id: 'tour-4',
    name: 'USATF National Olympic Trials Showcase',
    sport: 'Track & Field • Olympic Qualification Trials',
    location: 'Hayward Field, Eugene, OR',
    date: 'Jun 18–22, 2026',
    registration_status: 'Closing Soon',
    details:
      'National trials competition selecting the United States Olympic Track & Field team.',
    registered: false,
  },
];

export const DEMO_AI_INSIGHTS: AIInsight[] = [
  {
    id: 'aii-1',
    athlete_id: '33333333-3333-4333-8333-333333333301', // Maya Lin
    title: 'Recovery Declined: High Hamstring Load & Sleep Deficit',
    description:
      'Your recovery has declined over the past week because your average sleep dropped from 7.8h to 6.1h and muscle soreness rose to 4/5. Consider reducing training intensity by 15% for the next two days.',
    confidence: 94,
    priority: 'High',
    suggested_actions: [
      { label: 'Reduce Sprint Volume by 15%', action_type: 'adjust_load' },
      { label: 'Schedule PT Soft Tissue Check', action_type: 'schedule_pt' },
      { label: 'View Active Recovery Drills', action_type: 'view_drills' },
    ],
    created_at: '2026-07-29T08:00:00Z',
  },
  {
    id: 'aii-2',
    athlete_id: '33333333-3333-4333-8333-333333333302', // Jordan Thorne
    title: 'Optimal Readiness: Ready for Peak Aerobic Threshold Test',
    description:
      'Your 7-day sleep average (8.1 hrs) and low soreness rating (2/5) indicate optimal physiological adaptation. You are primed for high-intensity threshold intervals.',
    confidence: 97,
    priority: 'Low',
    suggested_actions: [
      { label: 'Maintain Current Load', action_type: 'adjust_load' },
    ],
    created_at: '2026-07-29T08:00:00Z',
  },
  {
    id: 'aii-3',
    athlete_id: '33333333-3333-4333-8333-333333333306', // Sienna Brooks
    title: 'High Soreness Trend: Shoulder & Javelin Load Warning',
    description:
      'Soreness in throwing shoulder has remained at 4/5 for 3 consecutive check-ins. Recommending a 48-hour throwing pause and resistance band stabilization.',
    confidence: 91,
    priority: 'Medium',
    suggested_actions: [
      { label: 'Pause Heavy Throwing for 48h', action_type: 'rest' },
      { label: 'Schedule PT Evaluation', action_type: 'schedule_pt' },
    ],
    created_at: '2026-07-29T08:00:00Z',
  },
];

export const DEMO_PROFILES: AthleteProfile[] = [
  {
    user_id: '33333333-3333-4333-8333-333333333301',
    photo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
    sport: 'Track & Field',
    specialty: '100m & 200m Sprints • Captain',
    academic_year: 'Junior (Class of 2027)',
    gpa: '3.84 / 4.0',
    achievements: [
      '2025 Pac-12 100m Champion (11.08s)',
      'NCAA First-Team All-American',
      'Stanford Athletics Honor Roll (2024–2026)',
      'USATF Olympic Trials Qualifier',
    ],
    bio: 'Junior sprint specialist captaining the short-sprint squad. Focused on explosive block starts and qualifying for the 2026 NCAA Outdoor 100m finals.',
    training_streak: 14,
  },
  {
    user_id: '33333333-3333-4333-8333-333333333302',
    photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    sport: 'Track & Field',
    specialty: '1500m & 5000m Distance',
    academic_year: 'Senior (Class of 2026)',
    gpa: '3.91 / 4.0',
    achievements: [
      '2025 NCAA Cross Country Finalist',
      'Stanford Record Holder (3000m Indoor)',
      'Academic All-American',
    ],
    bio: 'Distance runner majoring in Mechanical Engineering. Specializes in tactical kick pacing and high-altitude threshold conditioning.',
    training_streak: 19,
  },
  {
    user_id: '33333333-3333-4333-8333-333333333306',
    photo_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    sport: 'Track & Field',
    specialty: 'Javelin Throw',
    academic_year: 'Sophomore (Class of 2028)',
    gpa: '3.72 / 4.0',
    achievements: [
      '2025 NCAA West Regional Finalist',
      'U-20 National Championship Silver Medalist',
    ],
    bio: 'Sophomore javelin thrower refining take-off angle mechanics and rotational shoulder stability.',
    training_streak: 8,
  },
];

