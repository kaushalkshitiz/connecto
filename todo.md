# Athlete Risk Intelligence Platform — MVP Production TODO

This document provides a detailed step-by-step roadmap to transition the platform from demo/mock state to a fully functional, production-ready end-to-end web application (MVP Scope only).

---

## Task Overview Checklist

- [ ] **Task 1: Environment & Supabase Database Configuration**
- [ ] **Task 2: Supabase Authentication & Route Protection Middleware**
- [ ] **Task 3: Live Data Access Layer & Next.js API Routes**
- [ ] **Task 4: Form & Dashboard Integration (Connecting UI to Live Backend)**
- [ ] **Task 5: Onboarding & Team Invitation Pipeline**
- [ ] **Task 6: Production Build, Testing & Verification**

---

## Detailed Task Breakdown

### Task 1: Environment & Supabase Database Configuration

#### What to do:
Set up live Supabase PostgreSQL database tables, Row Level Security (RLS) policies, and local environment secrets.

#### What is needed:
- Active Supabase project (URL and Anon/Public Key).
- Local environment configuration file (`.env.local`).
- Execution of database migration files from `supabase/migrations/`.

#### How to do it:
1. **Create `.env.local`**:
   Add the following variables to `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://<your-project-id>.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
   SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
   ```
2. **Execute Database Migrations**:
   Run the migration scripts in order using Supabase CLI or SQL Editor:
   - Run `supabase/migrations/0001_initial_schema.sql` (Creates `User`, `Team`, `TeamMembership`, `CheckIn`, `CoachObservation`, `PhysioNote`, `RiskFlag`).
   - Run `supabase/migrations/0002_rls_policies.sql` (Enforces role-based row security).
   - Run `supabase/seed.sql` (Populates initial test team and sample users).

---

### Task 2: Supabase Authentication & Route Protection Middleware

#### What to do:
Replace the client-side `RoleSwitcher` demo mode with genuine Supabase Auth sessions, sign-in/sign-up pages, and route middleware.

#### What is needed:
- Login/Signup page (`src/app/login/page.tsx`).
- Auth callback route (`src/app/auth/callback/route.ts`).
- Root middleware (`middleware.ts`).

#### How to do it:
1. **Create Auth Callback Route** (`src/app/auth/callback/route.ts`):
   Exchange auth code for user session using `@supabase/ssr`.
2. **Create Login/Signup Page** (`src/app/login/page.tsx`):
   - Build responsive login form supporting Email + Password and Magic Link sign-in.
   - On successful login, fetch the user's role from `TeamMembership` and redirect to their appropriate dashboard (`/dashboard/coach`, `/dashboard/athlete`, `/dashboard/physio`, `/dashboard/admin`).
3. **Implement Next.js Middleware** (`middleware.ts`):
   - Use `createServerClient` from `@supabase/ssr` to refresh session cookies.
   - Redirect unauthenticated users attempting to access `/dashboard/*` to `/login`.
   - Restrict role-specific pages (e.g. restrict `/dashboard/admin` to `admin` role).

---

### Task 3: Live Data Access Layer & Next.js API Routes

#### What to do:
Create server-side API endpoints and database service handlers to query and mutate Supabase data securely.

#### What is needed:
- Data service file (`src/lib/data-service.ts`).
- Next.js API routes under `src/app/api/`.

#### How to do it:
1. **Create Data Service Utility** (`src/lib/data-service.ts`):
   Write async helper functions wrapping Supabase server client:
   - `getAthleteCheckIns(athleteId: string)`
   - `getCoachRoster(teamId: string)`
   - `submitCheckIn(data: CheckInInput)`
   - `submitPhysioNote(data: PhysioNoteInput)`
   - `submitObservation(data: ObservationInput)`
2. **Create API Routes**:
   - `POST /api/check-ins`: Validate input via `validators.ts`, insert into `CheckIn` table, call `calculateRiskScore()`, and upsert `RiskFlag`.
   - `POST /api/physio-notes`: Insert into `PhysioNote` table, recalculate athlete risk flag.
   - `POST /api/observations`: Insert into `CoachObservation` table.
   - `POST /api/reassign-coach`: Admin endpoint to update athlete coach assignment with `ON DELETE SET NULL` safety.

---

### Task 4: Form & Dashboard Integration (Connecting UI to Live Backend)

#### What to do:
Wire UI components (`CheckInModal`, `PhysioModal`, `ObservationModal`, dashboards) to consume server data and trigger API routes instead of updating `localStorage`.

#### What is needed:
- Updated form submission hooks in modals.
- Real-time data refetching or Supabase realtime subscriptions.

#### How to do it:
1. **Update `CheckInModal.tsx`**:
   Replace `addCheckIn()` from `DemoContext` with a `fetch('/api/check-ins', { method: 'POST', body })` call. Add loading spinner and error notifications.
2. **Update Dashboards**:
   - Update `/dashboard/coach/page.tsx` to fetch live roster and risk flags using Server Components or `swr` / `react-query`.
   - Update `/dashboard/athlete/page.tsx` to display real check-in history from Supabase.
   - Update `/dashboard/physio/page.tsx` to show live active injuries.

---

### Task 5: Onboarding & Team Invitation Pipeline

#### What to do:
Build the administrative onboarding flow allowing sports departments to invite coaches, physios, and athletes to their team.

#### What is needed:
- Admin Team Setup UI (`src/app/dashboard/admin/page.tsx` enhancements).
- Team invite code generator and invitation handler.

#### How to do it:
1. **Admin Invite Form**:
   In `/dashboard/admin/page.tsx`, allow admins to generate invite tokens/links with assigned roles (`coach`, `physio`, `academic`).
2. **Athlete Invitation**:
   Allow coaches to generate a team invite code or magic link for athletes.
3. **Invite Acceptance Flow**:
   When invited users sign up via invite link, create their `User` record and automatically insert their `TeamMembership` row.

---

### Task 6: Production Build, Testing & Verification

#### What to do:
Validate the entire application for production readiness, code quality, and responsive design.

#### What is needed:
- Build check (`npm run build`).
- TypeScript check (`npx tsc --noEmit`).
- End-to-end user flow verification.

#### How to do it:
1. **Compile & Lint Check**:
   Run `npm run build` and resolve any compilation or ESLint errors.
2. **End-to-End Flow Verification**:
   - Sign in as **Athlete** -> Submit daily check-in (Sleep: 5.5, Soreness: 4).
   - Sign in as **Coach** -> Verify risk dashboard automatically updates athlete status to **Watch** with exact reason displayed.
   - Sign in as **Physio** -> Add active injury note -> Verify coach dashboard updates status to **High**.
3. **Responsive UX Audit**:
   Test check-in forms and dashboards at 375px (mobile), 768px (tablet), and 1280px (desktop).
