-- =============================================================================
-- Athlete Risk Intelligence Platform
-- Migration 0002: Row Level Security (RLS) Policies Across 5 Roles
-- =============================================================================
-- Roles supported: 'admin', 'coach', 'physio', 'academic', 'athlete'
-- =============================================================================

-- 0. Enable RLS on all MVP tables
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Team" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "TeamMembership" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CheckIn" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CoachObservation" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "PhysioNote" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "RiskFlag" ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- HELPER FUNCTIONS (SECURITY DEFINER to prevent recursive policy checks)
-- =============================================================================

CREATE OR REPLACE FUNCTION public.is_team_member(p_team_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM "TeamMembership"
    WHERE team_id = p_team_id
      AND user_id = auth.uid()
  );
$$;

CREATE OR REPLACE FUNCTION public.has_team_role(p_team_id UUID, p_roles TEXT[])
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM "TeamMembership"
    WHERE team_id = p_team_id
      AND user_id = auth.uid()
      AND role = ANY(p_roles)
  );
$$;

-- =============================================================================
-- 1. USER POLICIES
-- =============================================================================
-- Users can view their own profile or profiles of teammates
CREATE POLICY "Users can view own profile or teammates"
ON "User"
FOR SELECT
USING (
  id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM "TeamMembership" tm1
    JOIN "TeamMembership" tm2 ON tm1.team_id = tm2.team_id
    WHERE tm1.user_id = auth.uid() AND tm2.user_id = "User".id
  )
  OR auth.role() = 'service_role'
  OR auth.uid() IS NULL -- Allow demo mode / local seed inspection
);

CREATE POLICY "Users can update own profile"
ON "User"
FOR UPDATE
USING (id = auth.uid() OR auth.role() = 'service_role')
WITH CHECK (id = auth.uid() OR auth.role() = 'service_role');

-- =============================================================================
-- 2. TEAM POLICIES
-- =============================================================================
CREATE POLICY "Team members can view their team"
ON "Team"
FOR SELECT
USING (
  public.is_team_member(id)
  OR admin_user_id = auth.uid()
  OR auth.role() = 'service_role'
  OR auth.uid() IS NULL
);

CREATE POLICY "Admins can update their team"
ON "Team"
FOR UPDATE
USING (
  admin_user_id = auth.uid()
  OR public.has_team_role(id, ARRAY['admin'])
  OR auth.role() = 'service_role'
);

-- =============================================================================
-- 3. TEAM MEMBERSHIP POLICIES
-- =============================================================================
CREATE POLICY "Team members can view memberships of their team"
ON "TeamMembership"
FOR SELECT
USING (
  public.is_team_member(team_id)
  OR auth.role() = 'service_role'
  OR auth.uid() IS NULL
);

CREATE POLICY "Admins can manage team memberships"
ON "TeamMembership"
FOR ALL
USING (
  public.has_team_role(team_id, ARRAY['admin'])
  OR auth.role() = 'service_role'
  OR auth.uid() IS NULL
)
WITH CHECK (
  public.has_team_role(team_id, ARRAY['admin'])
  OR auth.role() = 'service_role'
  OR auth.uid() IS NULL
);

-- =============================================================================
-- 4. CHECKIN POLICIES (Athlete self-reports)
-- =============================================================================
-- Athletes can insert their own check-ins
CREATE POLICY "Athletes can insert own checkins"
ON "CheckIn"
FOR INSERT
WITH CHECK (
  athlete_id = auth.uid()
  OR auth.role() = 'service_role'
  OR auth.uid() IS NULL
);

-- Athletes can view their own check-ins; Coaches, Physios, and Admins can view team check-ins
CREATE POLICY "Team staff and athlete can view checkins"
ON "CheckIn"
FOR SELECT
USING (
  athlete_id = auth.uid()
  OR public.has_team_role(team_id, ARRAY['admin', 'coach', 'physio'])
  OR auth.role() = 'service_role'
  OR auth.uid() IS NULL
);

-- =============================================================================
-- 5. COACH OBSERVATION POLICIES
-- =============================================================================
-- Coaches and Admins can insert observations
CREATE POLICY "Coaches and admins can insert observations"
ON "CoachObservation"
FOR INSERT
WITH CHECK (
  public.has_team_role(team_id, ARRAY['admin', 'coach'])
  OR auth.role() = 'service_role'
  OR auth.uid() IS NULL
);

-- Coaches, Admins, Physios, and the Athlete themselves can view observations
CREATE POLICY "Staff and athlete can view observations"
ON "CoachObservation"
FOR SELECT
USING (
  athlete_id = auth.uid()
  OR public.has_team_role(team_id, ARRAY['admin', 'coach', 'physio'])
  OR auth.role() = 'service_role'
  OR auth.uid() IS NULL
);

-- =============================================================================
-- 6. PHYSIO NOTE POLICIES
-- =============================================================================
-- Physios and Admins can create and update physio notes
CREATE POLICY "Physios and admins can manage physio notes"
ON "PhysioNote"
FOR ALL
USING (
  public.has_team_role(team_id, ARRAY['admin', 'physio'])
  OR auth.role() = 'service_role'
  OR auth.uid() IS NULL
)
WITH CHECK (
  public.has_team_role(team_id, ARRAY['admin', 'physio'])
  OR auth.role() = 'service_role'
  OR auth.uid() IS NULL
);

-- Coaches can view physio notes (for injury status visibility in dashboards)
-- Athletes can view their own physio notes
CREATE POLICY "Staff and athlete can view physio notes"
ON "PhysioNote"
FOR SELECT
USING (
  athlete_id = auth.uid()
  OR public.has_team_role(team_id, ARRAY['admin', 'coach', 'physio'])
  OR auth.role() = 'service_role'
  OR auth.uid() IS NULL
);

-- =============================================================================
-- 7. RISK FLAG POLICIES
-- =============================================================================
-- Staff and athlete can view risk flags
CREATE POLICY "Staff and athlete can view risk flags"
ON "RiskFlag"
FOR SELECT
USING (
  athlete_id = auth.uid()
  OR public.has_team_role(team_id, ARRAY['admin', 'coach', 'physio'])
  OR auth.role() = 'service_role'
  OR auth.uid() IS NULL
);

-- Admins, Coaches, or Service Role can insert/update risk flags
CREATE POLICY "Staff can insert risk flags"
ON "RiskFlag"
FOR INSERT
WITH CHECK (
  public.has_team_role(team_id, ARRAY['admin', 'coach', 'physio'])
  OR auth.role() = 'service_role'
  OR auth.uid() IS NULL
);
