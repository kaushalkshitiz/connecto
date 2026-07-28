# Athlete Risk Intelligence Platform

A B2B SaaS platform for university sports departments that connects athletes, coaches, physios, academic staff, and department management — fusing performance, medical, and academic-load data to catch injury and dropout risk early.

See [`spec.md`](./spec.md) for the full product spec, data model, and build order. This README covers project structure and local setup.

---

## Tech stack

- **Framework**: Next.js (React + API routes)
- **Database + Auth**: Supabase (Postgres + built-in auth + row-level security)
- **Hosting**: Vercel (app) + Supabase (database)
- **Styling**: Tailwind CSS, mobile-first
- **AI insights layer** (Phase 2): standalone Python service, run locally, decoupled from the main app

---

## Project structure

```
athlete-risk-platform/
├── README.md
├── spec.md                        # full product spec — read this first
├── package.json
├── next.config.js
├── tsconfig.json
├── tailwind.config.ts
├── .env.local.example             # copy to .env.local and fill in Supabase keys
│
├── public/                        # static assets (logo, icons)
│
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx                # landing/login redirect
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   └── signup/page.tsx
│   │   ├── dashboard/
│   │   │   ├── admin/page.tsx      # team + coach management, reassign athletes
│   │   │   ├── coach/page.tsx      # roster + risk levels
│   │   │   ├── coach/[athleteId]/page.tsx   # athlete detail view
│   │   │   ├── physio/page.tsx     # injury/treatment log
│   │   │   ├── academic/page.tsx   # exam schedule entry (Phase 2)
│   │   │   └── athlete/page.tsx    # self check-in + own dashboard
│   │   └── api/
│   │       ├── checkins/route.ts
│   │       ├── risk/route.ts       # rule-based risk computation
│   │       ├── physio-notes/route.ts
│   │       ├── observations/route.ts
│   │       ├── export/route.ts     # CSV export (Phase 2)
│   │       └── ai-insights/route.ts # reads AIInsightReport table (Phase 2)
│   │
│   ├── components/
│   │   ├── ui/                     # buttons, cards, badges
│   │   ├── charts/                 # trend charts (check-ins, performance)
│   │   └── forms/                  # check-in form, invite form
│   │
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts           # browser client
│   │   │   ├── server.ts           # server client
│   │   │   └── middleware.ts       # auth/session refresh
│   │   ├── risk-scoring.ts         # rule-based Watch/High logic (section 3.5 of spec)
│   │   └── validators.ts
│   │
│   └── types/
│       └── index.ts                # shared TypeScript types matching the data model
│
├── supabase/
│   ├── migrations/                 # SQL migrations — one file per schema change
│   └── seed.sql                    # sample data for local dev/demo
│
└── ai-insights/                    # Phase 2 — separate local service, NOT part of the Next.js app
    ├── main.py                     # reads Supabase via API, writes AIInsightReport rows
    ├── requirements.txt
    └── README.md                   # how to run this on your own machine
```

**Why `ai-insights/` is separate from `src/`:** it runs on your own laptop, not on Vercel — keeping it decoupled means the main app keeps working normally even when that service isn't running (see spec.md §4.7 for the reliability note).

---

## Local setup

1. **Clone and install**
   ```bash
   npm install
   ```

2. **Create a Supabase project** at [supabase.com](https://supabase.com) (free tier is enough for a pilot).

3. **Copy environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   Fill in:
   ```
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_ANON_KEY=
   SUPABASE_SERVICE_ROLE_KEY=
   ```

4. **Run migrations** (creates tables from spec.md §5)
   ```bash
   npx supabase db push
   ```

5. **Start the dev server**
   ```bash
   npm run dev
   ```
   App runs at `http://localhost:3000`.

6. **(Phase 2 only) Run the AI insights service** separately, on your own machine:
   ```bash
   cd ai-insights
   pip install -r requirements.txt
   python main.py
   ```

---

## Build order

Follow `spec.md` §10 exactly — Phase 1 (MVP) first, fully working with real users, before starting any Phase 2 feature. Don't build both in parallel.

---

## Roles

| Role | Access |
|---|---|
| Admin | Full team management, reassign athletes between coaches |
| Coach | Roster, risk dashboard, observations |
| Physio | Medical profile, injury history, treatment notes |
| Academic staff | Exam schedule entry (Phase 2) |
| Athlete | Own check-ins, own dashboard, own portfolio, CSV export |
