// =============================================================================
// Athlete Risk Intelligence Platform
// Demo Dataset (Stanford Track & Field - Mirrors supabase/seed.sql)
// =============================================================================

import {
  CheckIn,
  CoachObservation,
  PhysioNote,
  Team,
  TeamMembership,
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
  };
}
