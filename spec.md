# Athlete Risk Intelligence Platform — Spec

## 1. Overview

A B2B SaaS web app for university sports departments, connecting **individual athletes, their coach, physio, department management, and academic staff** into one system. It fuses performance, medical, and academic-schedule data to flag early warning signs of injury or dropout risk, track long-term development, and give each athlete a career portfolio.

**Scope note:** this app focuses on **individual sport athletes** (e.g. track, wrestling, swimming, tennis — one performer per profile), not team-tactics tracking. A profile belongs to one athlete across their whole time at the university, regardless of which coach currently manages them.

This spec is split into **MVP (build first, Phase 1)** and **Full Vision (Phase 2+)**. Build MVP completely and get it working with real users before starting Phase 2 — the temptation with a spec this size is to build a little of everything and finish nothing.

## 2. Users & roles

| Role | Can do |
|---|---|
| **Admin** (sports dept management) | Create teams, invite coaches/physios/academic staff, view all athletes' aggregate data, reassign athletes if a coach leaves |
| **Coach** | View roster, view each athlete's risk score + performance history + trend, log observations, receive alerts |
| **Physio** | Log injury/treatment notes and medical profile/history per athlete, mark injury status |
| **Academic staff** | Log/view each athlete's exam schedule so coaches can see academic load alongside training load (read-only for coaches) |
| **Athlete** | Submit self-report check-ins, view own dashboard, view own portfolio, download own data as CSV |

**Critical architecture rule:** all athlete data (check-ins, medical history, performance records, portfolio) is owned by the **university/department record**, not by the coach's user account. If a coach account is deleted or a coach leaves, their athletes and all historical data must remain fully intact, and an admin can reassign those athletes to a new coach with zero data loss. Never cascade-delete athlete data when a coach account is removed — this must be enforced at the database level (foreign key `ON DELETE SET NULL`, never `CASCADE`, on any coach reference).

## 3. MVP features (Phase 1 — build this first)

### 3.1 Onboarding
- Admin signs up, creates one team, invites coach(es)/physio by email.
- Coach invites athletes by email (magic link or invite code).

### 3.2 Athlete self-report (daily/weekly check-in)
- Sleep hours, soreness (1–5), mood/stress (1–5), optional note, optional RPE after sessions.

### 3.3 Coach dashboard
- Roster list, risk level (Low/Watch/High), trend arrow, days since last check-in.
- Athlete detail page: check-in history chart, physio notes, coach observations.

### 3.4 Physio log
- Injury/treatment notes with timestamp and status tag (active/recovering/cleared).

### 3.5 Risk scoring (rule-based, not ML)
- "Watch": 7-day soreness avg ≥ 4, OR 7-day sleep avg < 6 hrs, OR no check-in for 4+ days.
- "High": 2+ Watch conditions together, OR active injury note + any Watch condition.
- Always show *why* an athlete is flagged.

### 3.6 Alerts
- In-app notification when risk level changes.

## 4. Phase 2 features (build only after MVP is working with real users)

### 4.1 Historical & performance analysis
- Per-athlete performance log (event times, scores, personal bests — fields depend on the sport) with a timeline view, not just the last few weeks.
- Trend charts comparing performance over full time-on-team, not just recent check-ins.

### 4.2 Medical profile & history (lightweight EMR)
- Persistent medical profile per athlete: known conditions, past injuries, allergies, medications — distinct from the day-to-day physio *notes* in the MVP, this is the standing record.
- Full injury history timeline, not just current status.
- **Important**: real medical data has real privacy stakes. Even for a pilot, restrict who can view full medical history (physio + admin only; coach sees a summary status, not raw medical detail, unless your pilot's consent forms say otherwise).

### 4.3 Sport & discipline tagging
- Each athlete profile is tagged with their specific sport/event (e.g. "400m", "freestyle wrestling") so performance fields and portfolio content are relevant to that discipline.

### 4.4 Career pathway & portfolio
- Each athlete gets a shareable portfolio: personal bests, injury-free streaks, coach endorsements, academic standing — built for scholarship/recruitment use, matching your original pitch promise to athletes.

### 4.5 Academic integration
- Exam schedule per athlete, entered by academic staff.
- Coach dashboard shows upcoming exams alongside training load, so a coach can see *why* an athlete might be more fatigued or stressed that week — this is a real, distinctive feature tying back to your Ravi story (exams piling up was one of the missed signals).

### 4.6 Nutrition suggestions
- Simple rule-based suggestions (not a full diet-planning engine) based on check-in data — e.g. flag low sleep + high soreness with a generic recovery-nutrition tip. Keep this informational, not prescriptive; do not present it as individualized medical/dietary advice.

### 4.7 AI-generated dashboard insights (local AI)
- A locally-run AI process (on your own server/laptop) that periodically reads aggregated, already-computed data (risk trends, performance trends) and generates a **plain-language summary report** for coaches/admin — e.g. "3 athletes moved to Watch this week, most commonly due to low sleep."
- **This AI generates narrative summaries and visualizations from data that's already been computed by the rule-based system — it does not replace the risk-scoring logic in 3.5.** Keep prediction rule-based and explainable; use the AI layer only for report writing and pattern summarization.
- **Architecture risk to flag to your team**: running this on a personal laptop means the AI/report layer goes offline whenever that laptop is off or disconnected. For a real pilot, either (a) treat AI reports as a batch job that runs whenever the laptop is on and accept the delay, or (b) budget for a small always-on server (e.g. a cheap cloud VM) once you're past the demo stage. Don't let this be a silent single point of failure in front of judges or a real pilot user.

### 4.8 CSV data export
- Every athlete can download their own check-ins, performance history, and portfolio data as CSV, on demand, from their own dashboard.
- Admin can export full team-level data as CSV for reporting.

## 5. Data model

### MVP tables
```
User: id, name, email, password_hash, created_at
Team: id, name, admin_user_id
TeamMembership: id, user_id, team_id, role (admin/coach/physio/academic/athlete)
CheckIn: id, athlete_id, team_id, date, sleep_hours, soreness (1-5), mood (1-5), rpe (nullable), note (nullable)
CoachObservation: id, athlete_id, coach_id, team_id, date, note
PhysioNote: id, athlete_id, physio_id, team_id, date, status (active/recovering/cleared), note
RiskFlag: id, athlete_id, team_id, level (low/watch/high), reason (text), computed_at
```
Note: `coach_id` foreign keys use `ON DELETE SET NULL` — never `CASCADE`.

### Phase 2 additions
```
AthleteProfile: id, athlete_id, sport, event_discipline, joined_date
MedicalProfile: id, athlete_id, condition, allergy, medication, notes, updated_at
InjuryHistory: id, athlete_id, injury_type, date_occurred, date_cleared, notes
PerformanceRecord: id, athlete_id, date, metric_name, value, unit, context (training/competition)
ExamSchedule: id, athlete_id, exam_name, exam_date, entered_by (academic staff user_id)
PortfolioEntry: id, athlete_id, type (personal_best/endorsement/academic/award), content, date
NutritionTip: id, athlete_id, generated_at, tip_text, trigger_reason
AIInsightReport: id, team_id, generated_at, summary_text, data_window_start, data_window_end
```

## 6. Tech stack (locked in — build with this, no need to re-evaluate)

- **Framework**: Next.js (React + API routes in one app).
- **Database + Auth**: Supabase (managed Postgres + built-in auth + row-level security).
- **Hosting**: Vercel for the app, Supabase for the database.
- **Local AI layer**: a separate script/service (Python is a reasonable choice) that runs on your own machine, reads from Supabase via API, and writes generated reports back into the `AIInsightReport` table — keep it decoupled from the main app so the web app works fine even when your laptop is off.
- **Role-based access**: Supabase row-level security enforces all 5 roles at the database level.

## 7. UI requirements — mobile-first, responsive

- Mobile-first from ~375px up; Tailwind default breakpoints are enough.
- Athlete check-in form: one-handed usable, large tap targets, sliders/numeric inputs over free text.
- Coach dashboard: stacks vertically on mobile, no horizontal scroll, charts resize to width.
- Test every screen at 375px, 768px, and 1280px before calling a feature done.

## 8. Out of scope (do not build, even in Phase 2, without a separate spec)

- Payments/billing
- True ML-based risk prediction (keep scoring rule-based and explainable)
- Native mobile app (responsive web only)
- Wearable device integrations (Garmin/Whoop/etc.)
- SMS/push notifications (in-app + optional email only)
- Prescriptive/individualized medical or diet advice from the AI layer (informational tips only, see 4.6)

## 9. Success criteria for the MVP pilot

- At least one coach checks the dashboard 3+ times per week without being reminded.
- At least one athlete is flagged Watch/High, and the coach confirms it was accurate/actionable afterward.
- Athlete check-in completion rate stays above 60% over a 4-week pilot window.

## 10. Build order

**Phase 1 (MVP):**
1. Data model + auth (roles, team membership, `ON DELETE SET NULL` on coach references).
2. Athlete check-in form + storage.
3. Coach roster view (raw data, no scoring yet).
4. Rule-based risk scoring + Watch/High badges with reasons.
5. Physio notes + coach observations.
6. In-app alerts on risk-level change.
7. Mobile-first polish + trend charts.

**Phase 2 (only after Phase 1 works with real users):**
8. Sport/discipline tagging + full performance record history.
9. Medical profile & injury history (with access restricted to physio/admin).
10. Academic exam schedule + coach visibility.
11. CSV export (athlete self-export + admin team export).
12. Athlete portfolio/career page.
13. Nutrition tip rules.
14. Local AI report-generation layer (decoupled service, see 4.7 and 6).
