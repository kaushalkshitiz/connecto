# Athlete Risk Intelligence Platform — Session State & Implementation Roadmap

**Date**: July 28, 2026  
**Status**: Initial Next.js + Tailwind CSS + TypeScript project bootstrapped; ready for Phase 1 (MVP) feature implementation upon resuming.

---

## 1. Work Completed in This Session

1. **Requirements & Architecture Review**:
   - Read and analyzed `README.md` and `spec.md`.
   - Verified the strict **MVP first (Phase 1)** requirement (§10 Build Order): MVP must be built and fully functional before any Phase 2 features (such as standalone Python AI insights or academic exam schedule integration) are added.
   - Confirmed critical database architecture rule: all coach foreign key references must use `ON DELETE SET NULL` (never `CASCADE`) to preserve athlete historical data.

2. **Project Initialization**:
   - Bootstrapped Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS v4 in the root workspace `k:\project`.
   - Restored original specification documents (`README.md` and `spec.md`) in the workspace root.
   - Initiated installation of required UI and data libraries (`lucide-react`, `clsx`, `tailwind-merge`, `@supabase/supabase-js`, `@supabase/ssr`).

---

## 2. Phase 1 (MVP) Implementation Roadmap

When resuming the session, execute the following steps in sequence:

### Step 1: Supabase Schema & Seed Data (`supabase/`)
- [ ] Create `supabase/migrations/0001_initial_schema.sql`:
  - Tables: `User`, `Team`, `TeamMembership`, `CheckIn`, `CoachObservation`, `PhysioNote`, `RiskFlag`.
  - Enforce `ON DELETE SET NULL` on `coach_id` columns.
- [ ] Create `supabase/migrations/0002_rls_policies.sql` for Row-Level Security across all 5 roles (`admin`, `coach`, `physio`, `academic`, `athlete`).
- [ ] Create `supabase/seed.sql` with rich sample data (athletes, teams, check-in history, physio logs, and risk flags) for instant local testing and demoing.

### Step 2: Risk Scoring Engine & Validators (`src/lib/`)
- [ ] Implement `src/lib/risk-scoring.ts` matching Section 3.5 of `spec.md`:
  - **Watch**: 7-day soreness avg ≥ 4, OR 7-day sleep avg < 6 hrs, OR no check-in for 4+ days.
  - **High**: 2+ Watch conditions together, OR active injury note + any Watch condition.
  - Return human-readable reasons (e.g. *"7-day average sleep is critical (5.2 hrs)"*).
- [ ] Implement `src/lib/validators.ts` and Supabase clients (`client.ts`, `server.ts`).
- [ ] Add an interactive **Demo Mode / Role Switcher** so users can toggle between all 5 roles locally even without active Supabase credentials.

### Step 3: UI Design System & Core Components (`src/components/`)
- [ ] Build responsive, mobile-first design system with rich dark-mode aesthetics, smooth gradients, and glowing risk indicators.
- [ ] Implement UI primitives: cards, badges, alerts drawer, and mobile-friendly sliders/numeric inputs for check-ins.

### Step 4: Role Dashboards & Flows (`src/app/dashboard/`)
- [ ] **Athlete (`/dashboard/athlete`)**: One-handed self-report check-in form (Sleep, Soreness, Mood, optional RPE & notes) + personal check-in history.
- [ ] **Coach (`/dashboard/coach` & `/dashboard/coach/[athleteId]`)**:
  - Roster table & grid view with real-time risk badges (`Low`, `Watch`, `High`) and trend arrows.
  - Athlete detail view with 14-day/30-day trend charts, physio notes feed, and observation quick-logger.
- [ ] **Physio (`/dashboard/physio`)**: Injury & treatment logger with status tags (`active`, `recovering`, `cleared`).
- [ ] **Admin (`/dashboard/admin`)**: Team management and athlete re-assignment tool (reassign athletes between coaches without data loss).

---

## 3. How to Resume
1. Open this file (`SESSION_STATE.md`) or instruct the assistant: *"Resume work from SESSION_STATE.md and implement Step 1: Supabase Schema & Seed Data."*
2. Run `npm run dev` in `k:\project` to start the local development server at `http://localhost:3000`.
