-- =============================================================================
-- Athlete Risk Intelligence Platform
-- Migration 0001: Initial MVP Schema (Section 5 of spec.md)
-- =============================================================================
--
-- ARCHITECTURE RULES ENFORCED:
-- 1. Strict Phase 1 (MVP) tables only: User, Team, TeamMembership, CheckIn,
--    CoachObservation, PhysioNote, RiskFlag.
-- 2. Data Preservation Rule: All coach/physio foreign key references MUST use
--    ON DELETE SET NULL (never CASCADE) so athlete historical data is preserved
--    even if a staff member's account is deleted or they leave the team.
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. User Table
CREATE TABLE IF NOT EXISTS "User" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Team Table
CREATE TABLE IF NOT EXISTS "Team" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    admin_user_id UUID REFERENCES "User"(id) ON DELETE SET NULL
);

-- 3. TeamMembership Table
-- Enforces membership across the 5 roles: admin, coach, physio, academic, athlete
CREATE TABLE IF NOT EXISTS "TeamMembership" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
    team_id UUID NOT NULL REFERENCES "Team"(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('admin', 'coach', 'physio', 'academic', 'athlete')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT unique_user_team UNIQUE (user_id, team_id)
);

-- 4. CheckIn Table (Athlete daily/weekly self-reports)
CREATE TABLE IF NOT EXISTS "CheckIn" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    athlete_id UUID NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
    team_id UUID NOT NULL REFERENCES "Team"(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    sleep_hours NUMERIC(4,1) NOT NULL CHECK (sleep_hours >= 0 AND sleep_hours <= 24),
    soreness INTEGER NOT NULL CHECK (soreness >= 1 AND soreness <= 5),
    mood INTEGER NOT NULL CHECK (mood >= 1 AND mood <= 5),
    rpe INTEGER CHECK (rpe >= 1 AND rpe <= 10),
    note TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT unique_athlete_date_checkin UNIQUE (athlete_id, date)
);

-- 5. CoachObservation Table
-- CRITICAL: coach_id uses ON DELETE SET NULL (NEVER CASCADE)
CREATE TABLE IF NOT EXISTS "CoachObservation" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    athlete_id UUID NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
    coach_id UUID REFERENCES "User"(id) ON DELETE SET NULL,
    team_id UUID NOT NULL REFERENCES "Team"(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    note TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. PhysioNote Table
-- CRITICAL: physio_id uses ON DELETE SET NULL (NEVER CASCADE)
CREATE TABLE IF NOT EXISTS "PhysioNote" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    athlete_id UUID NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
    physio_id UUID REFERENCES "User"(id) ON DELETE SET NULL,
    team_id UUID NOT NULL REFERENCES "Team"(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    status TEXT NOT NULL CHECK (LOWER(status) IN ('active', 'recovering', 'cleared')),
    note TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. RiskFlag Table
-- Tracks rule-based risk level (low/watch/high) and human-readable reason
CREATE TABLE IF NOT EXISTS "RiskFlag" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    athlete_id UUID NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
    team_id UUID NOT NULL REFERENCES "Team"(id) ON DELETE CASCADE,
    level TEXT NOT NULL CHECK (LOWER(level) IN ('low', 'watch', 'high')),
    reason TEXT NOT NULL,
    computed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================================
-- PERFORMANCE INDEXES
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_checkin_athlete_date ON "CheckIn" (athlete_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_checkin_team_date ON "CheckIn" (team_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_coach_obs_athlete_date ON "CoachObservation" (athlete_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_physio_note_athlete_date ON "PhysioNote" (athlete_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_physio_note_status ON "PhysioNote" (athlete_id, status);
CREATE INDEX IF NOT EXISTS idx_risk_flag_athlete_computed ON "RiskFlag" (athlete_id, computed_at DESC);
CREATE INDEX IF NOT EXISTS idx_team_membership_user ON "TeamMembership" (user_id);
CREATE INDEX IF NOT EXISTS idx_team_membership_team ON "TeamMembership" (team_id);
