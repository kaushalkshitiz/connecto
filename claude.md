# CLAUDE.md

# Athlete Risk Intelligence Platform

## Project

This repository contains the Athlete Risk Intelligence Platform.

The complete product requirements, architecture, feature roadmap, data model, user stories, and business logic are defined in **spec.md**.

**spec.md is the single source of truth.**

If any request conflicts with spec.md, always follow spec.md or ask for clarification before implementing.

---

# Tech Stack

Framework
- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS

Backend
- Next.js API Routes

Database
- Supabase PostgreSQL

Authentication
- Supabase Auth

Authorization
- Supabase Row Level Security (RLS)

Hosting
- Vercel
- Supabase

AI Layer
- Separate Python service
- Reads aggregated data from Supabase
- Generates natural-language reports
- Writes reports into AIInsightReport
- Never replaces business logic

Charts
- Recharts

---

# Conventions

## General

- Use TypeScript strict mode.
- Never use `any` unless absolutely necessary.
- Prefer reusable components.
- Keep components focused on one responsibility.
- Business logic belongs in services/utilities, not UI components.
- Follow existing project architecture.
- Prefer server components unless client-side state is required.
- Keep files readable and modular.

---

## Folder Structure

```
src/
│
├── app/
├── components/
├── services/
├── hooks/
├── lib/
├── types/
├── utils/
├── styles/
```

---

## Naming Conventions

Components

PascalCase

Example

```
CoachDashboard.tsx
```

Functions

camelCase

```
calculateRiskScore()
```

Variables

camelCase

```
riskLevel
```

Constants

UPPER_SNAKE_CASE

```
MAX_SLEEP_HOURS
```

Database

Use naming exactly as defined inside spec.md.

Do not rename database tables or fields.

---

# Coding Rules

Always

- Reuse existing components.
- Write readable code.
- Prefer composition.
- Keep functions small.
- Validate every API request.
- Return meaningful error messages.
- Handle loading and error states.

Never

- Duplicate code.
- Hardcode secrets.
- Mix UI with business logic.
- Ignore TypeScript errors.
- Ignore ESLint warnings.

---

# AI Rules

The application does NOT use AI for risk prediction.

Risk scoring is entirely rule-based and must follow spec.md exactly.

The AI layer is only responsible for:

- Writing dashboard summaries
- Explaining trends
- Summarizing historical data
- Generating coach reports
- Converting structured data into natural language

Never

- Replace rule-based scoring with AI
- Predict injuries using AI
- Invent athlete statistics
- Generate medical diagnoses
- Provide personalized medical advice

If insufficient data exists, state that additional historical data is required.

---

# Database Rules

Use Supabase.

Respect Row Level Security (RLS).

Never bypass RLS.

Coach deletion must never remove athlete data.

Follow the foreign key constraints defined in spec.md.

Never change schema without approval.

---

# API Rules

Use Next.js API Routes.

Each endpoint must

- Validate input
- Handle errors
- Return appropriate HTTP status codes
- Return consistent JSON responses

Never expose internal database errors.

---

# UI Rules

Responsive-first.

Required breakpoints

- 375px
- 768px
- 1280px

Use Tailwind CSS.

Design principles

- Minimal
- Clean
- Accessible
- Mobile-first

Large touch targets for athlete check-ins.

No horizontal scrolling.

---

# Testing

Before marking any feature complete

✓ Application builds

✓ No TypeScript errors

✓ No ESLint errors

✓ Responsive layout verified

✓ API tested

✓ Forms validated

✓ Existing functionality still works

For Risk Scoring

Verify every rule exactly as defined in spec.md.

For AI

Verify summaries are generated only from computed data.

Never allow hallucinated reports.

---

# Git Workflow

Never commit directly to main.

Create a branch per feature.

Feature

```
feature/<feature-name>
```

Example

```
feature/coach-dashboard
feature/risk-engine
feature/check-in-form
```

Bug Fix

```
fix/<bug-name>
```

Commit Messages

```
feat:
fix:
docs:
style:
refactor:
test:
```

Examples

```
feat: implement athlete check-in form

feat: add coach dashboard

fix: validate sleep input

docs: update README
```

---

# Pull Requests

Every PR should include

- Summary
- Reason
- Screenshots (if UI changed)
- Testing completed
- Related issue (if applicable)

---

# Boundaries

Always

- Read spec.md before implementing.
- Follow the build order.
- Keep MVP scope first.
- Ask before adding dependencies.
- Ask before modifying database schema.
- Explain architectural decisions when necessary.

Never

- Implement features outside spec.md.
- Rewrite unrelated files.
- Delete files without confirmation.
- Replace rule-based logic with AI.
- Introduce breaking changes without approval.

---

# Performance

Prefer

- Server Components
- Lazy loading
- Memoization where appropriate
- Optimized API calls
- Efficient database queries

Avoid

- Unnecessary re-renders
- Duplicate API requests
- Large client bundles

---

# Definition of Done

A feature is complete only if

✓ Matches spec.md

✓ Builds successfully

✓ No lint errors

✓ No TypeScript errors

✓ Responsive

✓ Tested

✓ Uses existing architecture

✓ Ready for review

---

# Claude Working Rules

Before writing code

1. Read the relevant section of spec.md.
2. Explain the implementation plan.
3. Identify affected files.
4. Reuse existing components whenever possible.
5. Keep changes minimal and focused.

When multiple implementation approaches exist

- Explain the trade-offs.
- Recommend one approach.
- Wait for approval if architecture changes are required.

Never make assumptions that contradict spec.md.

When uncertain, ask instead of guessing.