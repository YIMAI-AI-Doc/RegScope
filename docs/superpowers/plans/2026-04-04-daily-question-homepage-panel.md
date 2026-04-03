# Daily Question Homepage Panel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a homepage "每日一题" tab beside the hot list, backed by a database-driven daily quiz that reveals answers, legal basis, explanation, and same-day correctness ratios after a logged-in user submits.

**Architecture:** Parse the Markdown question bank into dedicated Prisma quiz tables, assign one question per day in sequence with wraparound, and render the homepage panel from server-fetched quiz state. Keep answer submission behind login, persist one answer per user per day, and return updated aggregate stats for the result state.

**Tech Stack:** Next.js App Router, React 19, NextAuth, Prisma, PostgreSQL, Vitest.

---

### Task 1: Add quiz persistence models

**Files:**
- Modify: `prisma/schema.prisma`
- Create: `prisma/migrations/<generated>/migration.sql`

- [ ] Add `QuizQuestion`, `DailyQuizAssignment`, and `DailyQuizResponse` models plus `User` relation fields.
- [ ] Generate a Prisma migration for the new quiz tables and constraints.
- [ ] Regenerate Prisma client.

### Task 2: Import the Markdown question bank

**Files:**
- Create: `src/lib/quiz/parser.ts`
- Create: `src/lib/quiz/date.ts`
- Create: `scripts/import-quiz-questions.ts`
- Modify: `package.json`

- [ ] Parse the Markdown file into structured question records.
- [ ] Upsert questions by sequence so future appended questions continue naturally.
- [ ] Add an import script command for future question bank refreshes.

### Task 3: Build quiz queries and answer API

**Files:**
- Create: `src/lib/quiz/queries.ts`
- Create: `src/app/api/daily-question/answer/route.ts`
- Create: `src/app/api/daily-question/answer/route.test.ts`

- [ ] Resolve today's assignment, creating it lazily from the next active question.
- [ ] Return homepage panel data with pre-answer and post-answer states.
- [ ] Accept one authenticated answer per user per day and return updated stats.

### Task 4: Render the homepage "每日一题" panel

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/components/home/home-intelligence-section.tsx`
- Create: `src/components/home/daily-question-panel.tsx`
- Modify: `src/app/globals.css`

- [ ] Add a tab switcher for `热榜 top10` and `每日一题`.
- [ ] Render disabled options for anonymous viewers with a "登录后作答" state.
- [ ] Render the result state with selected answer, correctness, legal basis, explanation, and ratio chart after submission.

### Task 5: Test and verify

**Files:**
- Modify: `src/app/page.test.tsx`
- Create: `src/lib/quiz/parser.test.ts`

- [ ] Add parser coverage for the Markdown format.
- [ ] Update homepage tests for the new tab content.
- [ ] Run lint, targeted tests, Prisma migration, and Prisma generate.
