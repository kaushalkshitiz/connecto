-- =============================================================================
-- Athlete Risk Intelligence Platform
-- Seed Data (Rich sample dataset for local dev & demoing all 5 roles)
-- =============================================================================

-- Clean up existing data in reverse dependency order
TRUNCATE TABLE "RiskFlag", "PhysioNote", "CoachObservation", "CheckIn", "TeamMembership", "Team", "User" CASCADE;

-- =============================================================================
-- 1. USERS (Admin, Coaches, Physio, Academic Staff, and Athletes)
-- =============================================================================
INSERT INTO "User" (id, name, email, password_hash, created_at)
VALUES
  -- Staff & Admin
  ('00000000-0000-4000-8000-000000000001', 'Dr. Sarah Jenkins', 's.jenkins@stanford-athletics.edu', '$2a$10$demoHashAdmin', now() - interval '90 days'),
  ('00000000-0000-4000-8000-000000000002', 'Coach Marcus Vance', 'm.vance@stanford-athletics.edu', '$2a$10$demoHashCoach1', now() - interval '85 days'),
  ('00000000-0000-4000-8000-000000000003', 'Coach Elena Rostova', 'e.rostova@stanford-athletics.edu', '$2a$10$demoHashCoach2', now() - interval '80 days'),
  ('00000000-0000-4000-8000-000000000004', 'Dr. David Chen, PT', 'd.chen@stanford-athletics.edu', '$2a$10$demoHashPhysio', now() - interval '85 days'),
  ('00000000-0000-4000-8000-000000000005', 'Prof. Arthur Pendelton', 'a.pendelton@stanford-athletics.edu', '$2a$10$demoHashAcad', now() - interval '85 days'),

  -- Athletes (6 distinct risk profiles)
  ('33333333-3333-4333-8333-333333333301', 'Maya Lin', 'maya.lin@stanford.edu', '$2a$10$demoHashAthlete', now() - interval '60 days'),
  ('33333333-3333-4333-8333-333333333302', 'Jordan Thorne', 'jordan.t@stanford.edu', '$2a$10$demoHashAthlete', now() - interval '60 days'),
  ('33333333-3333-4333-8333-333333333303', 'Liam Carter', 'l.carter@stanford.edu', '$2a$10$demoHashAthlete', now() - interval '60 days'),
  ('33333333-3333-4333-8333-333333333304', 'Chloe Ramirez', 'chloe.r@stanford.edu', '$2a$10$demoHashAthlete', now() - interval '60 days'),
  ('33333333-3333-4333-8333-333333333305', 'Darius Vance', 'darius.v@stanford.edu', '$2a$10$demoHashAthlete', now() - interval '60 days'),
  ('33333333-3333-4333-8333-333333333306', 'Sienna Brooks', 'sienna.b@stanford.edu', '$2a$10$demoHashAthlete', now() - interval '60 days');

-- =============================================================================
-- 2. TEAM
-- =============================================================================
INSERT INTO "Team" (id, name, admin_user_id)
VALUES
  ('11111111-1111-4111-8111-111111111111', 'Stanford Track & Field', '00000000-0000-4000-8000-000000000001');

-- =============================================================================
-- 3. TEAM MEMBERSHIPS (All 5 roles represented)
-- =============================================================================
INSERT INTO "TeamMembership" (user_id, team_id, role)
VALUES
  -- Staff
  ('00000000-0000-4000-8000-000000000001', '11111111-1111-4111-8111-111111111111', 'admin'),
  ('00000000-0000-4000-8000-000000000002', '11111111-1111-4111-8111-111111111111', 'coach'),
  ('00000000-0000-4000-8000-000000000003', '11111111-1111-4111-8111-111111111111', 'coach'),
  ('00000000-0000-4000-8000-000000000004', '11111111-1111-4111-8111-111111111111', 'physio'),
  ('00000000-0000-4000-8000-000000000005', '11111111-1111-4111-8111-111111111111', 'academic'),
  -- Athletes
  ('33333333-3333-4333-8333-333333333301', '11111111-1111-4111-8111-111111111111', 'athlete'),
  ('33333333-3333-4333-8333-333333333302', '11111111-1111-4111-8111-111111111111', 'athlete'),
  ('33333333-3333-4333-8333-333333333303', '11111111-1111-4111-8111-111111111111', 'athlete'),
  ('33333333-3333-4333-8333-333333333304', '11111111-1111-4111-8111-111111111111', 'athlete'),
  ('33333333-3333-4333-8333-333333333305', '11111111-1111-4111-8111-111111111111', 'athlete'),
  ('33333333-3333-4333-8333-333333333306', '11111111-1111-4111-8111-111111111111', 'athlete');

-- =============================================================================
-- 4. CHECK-INS (7 days of history per athlete for trend charts & risk rules)
-- =============================================================================
INSERT INTO "CheckIn" (athlete_id, team_id, date, sleep_hours, soreness, mood, rpe, note)
VALUES
  -- 4.1 Maya Lin (HIGH RISK: 7-day sleep avg 5.2 hrs < 6.0 AND active hamstring injury note)
  ('33333333-3333-4333-8333-333333333301', '11111111-1111-4111-8111-111111111111', CURRENT_DATE - 6, 5.0, 4, 2, 8, 'Hamstring feeling tight after block starts'),
  ('33333333-3333-4333-8333-333333333301', '11111111-1111-4111-8111-111111111111', CURRENT_DATE - 5, 5.5, 4, 3, 7, 'Struggling to sleep due to midterms'),
  ('33333333-3333-4333-8333-333333333301', '11111111-1111-4111-8111-111111111111', CURRENT_DATE - 4, 4.8, 5, 2, 9, 'Sharp pain in left posterior thigh during acceleration'),
  ('33333333-3333-4333-8333-333333333301', '11111111-1111-4111-8111-111111111111', CURRENT_DATE - 3, 6.0, 4, 3, 7, 'Saw Dr. Chen, iced and compressed'),
  ('33333333-3333-4333-8333-333333333301', '11111111-1111-4111-8111-111111111111', CURRENT_DATE - 2, 5.1, 4, 2, 8, 'Soreness persistent, sleep broken'),
  ('33333333-3333-4333-8333-333333333301', '11111111-1111-4111-8111-111111111111', CURRENT_DATE - 1, 4.9, 5, 2, 9, 'Tired and sore, hard sprint session'),
  ('33333333-3333-4333-8333-333333333301', '11111111-1111-4111-8111-111111111111', CURRENT_DATE, 5.1, 4, 2, 8, 'Hamstring still tender; low energy'),

  -- 4.2 Jordan Thorne (WATCH RISK: 7-day soreness avg 4.14 >= 4.0)
  ('33333333-3333-4333-8333-333333333302', '11111111-1111-4111-8111-111111111111', CURRENT_DATE - 6, 7.5, 4, 4, 7, 'Heavy legs after tempo run'),
  ('33333333-3333-4333-8333-333333333302', '11111111-1111-4111-8111-111111111111', CURRENT_DATE - 5, 7.0, 4, 3, 8, 'Quad soreness from lifting day'),
  ('33333333-3333-4333-8333-333333333302', '11111111-1111-4111-8111-111111111111', CURRENT_DATE - 4, 6.8, 5, 3, 8, 'High soreness in calves and quads'),
  ('33333333-3333-4333-8333-333333333302', '11111111-1111-4111-8111-111111111111', CURRENT_DATE - 3, 7.2, 4, 4, 7, 'Foam rolled, still stiff'),
  ('33333333-3333-4333-8333-333333333302', '11111111-1111-4111-8111-111111111111', CURRENT_DATE - 2, 7.1, 4, 4, 7, 'Normal morning check-in'),
  ('33333333-3333-4333-8333-333333333302', '11111111-1111-4111-8111-111111111111', CURRENT_DATE - 1, 6.9, 4, 3, 8, 'Tough interval workout yesterday'),
  ('33333333-3333-4333-8333-333333333302', '11111111-1111-4111-8111-111111111111', CURRENT_DATE, 7.3, 4, 4, 7, 'Soreness remains high across lower body'),

  -- 4.3 Liam Carter (WATCH RISK: No check-in for 5 days)
  ('33333333-3333-4333-8333-333333333303', '11111111-1111-4111-8111-111111111111', CURRENT_DATE - 7, 7.2, 3, 4, 6, 'Feeling good after rest day'),
  ('33333333-3333-4333-8333-333333333303', '11111111-1111-4111-8111-111111111111', CURRENT_DATE - 6, 7.0, 3, 4, 7, 'Solid pole vault practice'),

  -- 4.4 Chloe Ramirez (LOW RISK: Normal metrics)
  ('33333333-3333-4333-8333-333333333304', '11111111-1111-4111-8111-111111111111', CURRENT_DATE - 6, 8.2, 2, 5, 5, 'Felt strong on distance trail'),
  ('33333333-3333-4333-8333-333333333304', '11111111-1111-4111-8111-111111111111', CURRENT_DATE - 5, 8.0, 2, 4, 6, 'Good recovery'),
  ('33333333-3333-4333-8333-333333333304', '11111111-1111-4111-8111-111111111111', CURRENT_DATE - 4, 7.8, 2, 5, 6, 'Smooth track intervals'),
  ('33333333-3333-4333-8333-333333333304', '11111111-1111-4111-8111-111111111111', CURRENT_DATE - 3, 8.1, 1, 5, 5, 'Rested and energized'),
  ('33333333-3333-4333-8333-333333333304', '11111111-1111-4111-8111-111111111111', CURRENT_DATE - 2, 7.9, 2, 4, 6, 'Great rhythm'),
  ('33333333-3333-4333-8333-333333333304', '11111111-1111-4111-8111-111111111111', CURRENT_DATE - 1, 8.0, 2, 5, 5, 'Ready for competition block'),
  ('33333333-3333-4333-8333-333333333304', '11111111-1111-4111-8111-111111111111', CURRENT_DATE, 8.2, 2, 5, 5, 'Feeling fresh'),

  -- 4.5 Darius Vance (LOW RISK: Recovering normally, good sleep/soreness)
  ('33333333-3333-4333-8333-333333333305', '11111111-1111-4111-8111-111111111111', CURRENT_DATE - 6, 7.5, 3, 4, 6, 'Ankle taped for drills'),
  ('33333333-3333-4333-8333-333333333305', '11111111-1111-4111-8111-111111111111', CURRENT_DATE - 5, 7.6, 2, 4, 5, 'Physical therapy went well'),
  ('33333333-3333-4333-8333-333333333305', '11111111-1111-4111-8111-111111111111', CURRENT_DATE - 4, 7.4, 3, 4, 6, 'Light sprint mechanics'),
  ('33333333-3333-4333-8333-333333333305', '11111111-1111-4111-8111-111111111111', CURRENT_DATE - 3, 7.8, 2, 5, 5, 'Ankle swelling down'),
  ('33333333-3333-4333-8333-333333333305', '11111111-1111-4111-8111-111111111111', CURRENT_DATE - 2, 7.5, 2, 4, 6, 'Good block work'),
  ('33333333-3333-4333-8333-333333333305', '11111111-1111-4111-8111-111111111111', CURRENT_DATE - 1, 7.7, 2, 4, 5, 'No pain during acceleration'),
  ('33333333-3333-4333-8333-333333333305', '11111111-1111-4111-8111-111111111111', CURRENT_DATE, 7.6, 2, 5, 5, 'Feeling back to 95%'),

  -- 4.6 Sienna Brooks (HIGH RISK: Multiple Watch conditions together - sleep < 6 AND soreness >= 4)
  ('33333333-3333-4333-8333-333333333306', '11111111-1111-4111-8111-111111111111', CURRENT_DATE - 6, 5.2, 4, 2, 8, 'Exhausted after jump practice'),
  ('33333333-3333-4333-8333-333333333306', '11111111-1111-4111-8111-111111111111', CURRENT_DATE - 5, 5.5, 4, 3, 7, 'Late night studying'),
  ('33333333-3333-4333-8333-333333333306', '11111111-1111-4111-8111-111111111111', CURRENT_DATE - 4, 5.1, 5, 2, 9, 'Lower back and knee soreness'),
  ('33333333-3333-4333-8333-333333333306', '11111111-1111-4111-8111-111111111111', CURRENT_DATE - 3, 5.4, 4, 2, 8, 'Trouble sleeping'),
  ('33333333-3333-4333-8333-333333333306', '11111111-1111-4111-8111-111111111111', CURRENT_DATE - 2, 5.0, 5, 2, 9, 'Stiff take-off leg'),
  ('33333333-3333-4333-8333-333333333306', '11111111-1111-4111-8111-111111111111', CURRENT_DATE - 1, 5.3, 4, 3, 8, 'Still feeling drained'),
  ('33333333-3333-4333-8333-333333333306', '11111111-1111-4111-8111-111111111111', CURRENT_DATE, 5.2, 4, 2, 8, 'High fatigue and body soreness');

-- =============================================================================
-- 5. COACH OBSERVATIONS
-- =============================================================================
INSERT INTO "CoachObservation" (athlete_id, coach_id, team_id, date, note)
VALUES
  -- Maya Lin
  ('33333333-3333-4333-8333-333333333301', '00000000-0000-4000-8000-000000000002', '11111111-1111-4111-8111-111111111111', CURRENT_DATE - 4, 'Noticed Maya limping slightly after 200m repeat. Pulled her from remaining sets and referred to Dr. Chen.'),
  ('33333333-3333-4333-8333-333333333301', '00000000-0000-4000-8000-000000000002', '11111111-1111-4111-8111-111111111111', CURRENT_DATE - 1, 'Restricting Maya to non-impact cycle work until physio clearance.'),
  -- Jordan Thorne
  ('33333333-3333-4333-8333-333333333302', '00000000-0000-4000-8000-000000000002', '11111111-1111-4111-8111-111111111111', CURRENT_DATE - 2, 'Jordan reporting heavy legs. Adjusted Friday workout to active recovery tempo.'),
  -- Liam Carter
  ('33333333-3333-4333-8333-333333333303', '00000000-0000-4000-8000-000000000003', '11111111-1111-4111-8111-111111111111', CURRENT_DATE - 1, 'Liam missed check-ins this week due to travel; reminder sent via SMS.'),
  -- Sienna Brooks
  ('33333333-3333-4333-8333-333333333306', '00000000-0000-4000-8000-000000000003', '11111111-1111-4111-8111-111111111111', CURRENT_DATE, 'Take-off mechanics looking sluggish from fatigue. Reduced jump volume by 50%.');

-- =============================================================================
-- 6. PHYSIO NOTES
-- =============================================================================
INSERT INTO "PhysioNote" (athlete_id, physio_id, team_id, date, status, note)
VALUES
  -- Maya Lin (Active injury -> triggers HIGH risk with sleep/soreness)
  ('33333333-3333-4333-8333-333333333301', '00000000-0000-4000-8000-000000000004', '11111111-1111-4111-8111-111111111111', CURRENT_DATE - 4, 'active', 'Grade 1 left hamstring strain at biceps femoris musculo-tendinous junction. Start daily ice and eccentric loading.'),
  -- Darius Vance (Recovering -> no acute risk flag)
  ('33333333-3333-4333-8333-333333333305', '00000000-0000-4000-8000-000000000004', '11111111-1111-4111-8111-111111111111', CURRENT_DATE - 10, 'recovering', 'Right lateral ankle sprain (ATFL). Swelling reduced 80%. Cleared for straight-line running and block drills.'),
  -- Chloe Ramirez (Cleared history)
  ('33333333-3333-4333-8333-333333333304', '00000000-0000-4000-8000-000000000004', '11111111-1111-4111-8111-111111111111', CURRENT_DATE - 20, 'cleared', 'Minor plantar fascia tightness resolved with custom orthotics and stretching.');

-- =============================================================================
-- 7. RISK FLAGS (Rule-based risk levels matching Section 3.5 of spec.md)
-- =============================================================================
INSERT INTO "RiskFlag" (athlete_id, team_id, level, reason, computed_at)
VALUES
  -- Maya Lin -> High Risk
  ('33333333-3333-4333-8333-333333333301', '11111111-1111-4111-8111-111111111111', 'high',
   'Active injury note present (Hamstring strain) AND 7-day sleep average (5.2 hrs) is below 6.0 hrs AND 7-day soreness average (4.3) is elevated.',
   now()),

  -- Jordan Thorne -> Watch Risk
  ('33333333-3333-4333-8333-333333333302', '11111111-1111-4111-8111-111111111111', 'watch',
   '7-day soreness average (4.1 / 5.0) exceeds Watch threshold (>= 4.0).',
   now()),

  -- Liam Carter -> Watch Risk
  ('33333333-3333-4333-8333-333333333303', '11111111-1111-4111-8111-111111111111', 'watch',
   'No check-in submitted for 5 consecutive days (exceeds 4+ day threshold).',
   now()),

  -- Chloe Ramirez -> Low Risk
  ('33333333-3333-4333-8333-333333333304', '11111111-1111-4111-8111-111111111111', 'low',
   'All training load and recovery indicators within normal range. 7-day sleep average: 8.0 hrs; 7-day soreness average: 1.9.',
   now()),

  -- Darius Vance -> Low Risk
  ('33333333-3333-4333-8333-333333333305', '11111111-1111-4111-8111-111111111111', 'low',
   'Ankle injury status is recovering; no acute Watch conditions triggered. 7-day sleep average: 7.6 hrs; soreness average: 2.3.',
   now()),

  -- Sienna Brooks -> High Risk
  ('33333333-3333-4333-8333-333333333306', '11111111-1111-4111-8111-111111111111', 'high',
   'Multiple Watch indicators combined (2+ Watch rules): 7-day sleep average (5.2 hrs) < 6.0 hrs AND 7-day soreness average (4.4) is critical.',
   now());
