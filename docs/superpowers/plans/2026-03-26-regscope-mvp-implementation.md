# RegScope MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first production-ready Chinese-language MVP of RegScope: a global pharma regulatory intelligence platform with feed ingestion, structured taxonomy browsing, follow/subscription workflows, and a conclusion-oriented discussion board.

**Architecture:** This plan assumes a greenfield web app built with Next.js App Router. The product uses a single PostgreSQL database via Prisma, a scheduled ingestion worker for RSS/Atom/JSON feeds, and a public-first UI where browsing is open and login gates follow/comment actions.

**Tech Stack:** Next.js 15, TypeScript, React, Tailwind CSS, Prisma, PostgreSQL, Auth.js, Zod, rss-parser/custom feed adapters, Vitest, Testing Library, Playwright

---

## Planning Assumptions

- The current workspace is a greenfield project with no application code yet.
- MVP scope covers RSS / Atom / JSON feed ingestion only.
- Interface language is Simplified Chinese only.
- Public content pages are accessible without login.
- Logged-in users can follow topics/sources/countries and post in discussions.
- Automated discussion summarization is deferred; MVP ships with manually editable conclusion blocks.

## Recommended Repository Structure

### Application files

- `package.json` — workspace scripts and dependencies
- `next.config.ts` — Next.js configuration
- `tsconfig.json` — TypeScript configuration
- `tailwind.config.ts` — design tokens and utility config
- `postcss.config.js` — Tailwind pipeline
- `prisma/schema.prisma` — database schema
- `prisma/seed.ts` — seed sources, countries, taxonomy, and demo content
- `src/app/layout.tsx` — root layout, nav shell, metadata
- `src/app/page.tsx` — homepage
- `src/app/feed/page.tsx` — intelligence feed page
- `src/app/topics/page.tsx` — topic index
- `src/app/topics/[slug]/page.tsx` — topic detail page
- `src/app/sources/page.tsx` — source directory
- `src/app/sources/[slug]/page.tsx` — source detail page
- `src/app/countries/page.tsx` — country directory
- `src/app/countries/[slug]/page.tsx` — country detail page
- `src/app/discussions/page.tsx` — discussion list page
- `src/app/discussions/[slug]/page.tsx` — discussion detail page
- `src/app/me/follows/page.tsx` — logged-in follow center
- `src/app/api/auth/[...nextauth]/route.ts` — Auth.js handler
- `src/app/api/follows/route.ts` — follow/unfollow endpoint
- `src/app/api/discussions/route.ts` — create discussion endpoint
- `src/app/api/discussions/[id]/answers/route.ts` — create answer endpoint
- `src/app/api/ingest/run/route.ts` — protected manual ingestion trigger for ops

### Domain and data files

- `src/lib/db.ts` — Prisma client singleton
- `src/lib/auth.ts` — Auth.js config helpers
- `src/lib/env.ts` — environment validation
- `src/lib/feed/parser.ts` — unified feed parse interface
- `src/lib/feed/adapters/rss.ts` — RSS adapter
- `src/lib/feed/adapters/atom.ts` — Atom adapter
- `src/lib/feed/adapters/json.ts` — JSON feed adapter
- `src/lib/feed/normalize.ts` — map feed items into RegScope content model
- `src/lib/feed/dedupe.ts` — dedupe by canonical URL and source
- `src/lib/content/queries.ts` — shared content queries
- `src/lib/discussions/queries.ts` — discussion read models
- `src/lib/discussions/status.ts` — discussion state transitions
- `src/lib/taxonomy/constants.ts` — default top-level topic tree
- `src/lib/permissions.ts` — authz helpers

### UI files

- `src/components/layout/site-header.tsx`
- `src/components/layout/site-footer.tsx`
- `src/components/cards/intelligence-card.tsx`
- `src/components/cards/source-card.tsx`
- `src/components/cards/topic-card.tsx`
- `src/components/cards/discussion-card.tsx`
- `src/components/home/alert-strip.tsx`
- `src/components/home/follow-center-panel.tsx`
- `src/components/home/trending-panel.tsx`
- `src/components/discussions/conclusion-panel.tsx`
- `src/components/discussions/evidence-list.tsx`
- `src/components/discussions/controversy-panel.tsx`
- `src/components/discussions/answer-list.tsx`
- `src/components/filters/feed-filters.tsx`

### Worker files

- `src/workers/ingest/run-all-feeds.ts` — orchestration entrypoint
- `src/workers/ingest/run-single-feed.ts` — single-source ingestion
- `src/workers/ingest/upsert-content.ts` — DB write logic
- `scripts/run-ingest.ts` — local/dev runner

### Tests

- `src/lib/feed/parser.test.ts`
- `src/lib/feed/normalize.test.ts`
- `src/lib/feed/dedupe.test.ts`
- `src/lib/discussions/status.test.ts`
- `src/app/feed/feed-page.test.tsx`
- `src/app/discussions/discussion-page.test.tsx`
- `e2e/home.spec.ts`
- `e2e/feed-filtering.spec.ts`
- `e2e/discussion-flow.spec.ts`

## Delivery Order

1. Foundation and repo bootstrap
2. Core schema and content ingestion
3. Public browse surfaces
4. Follow center and auth
5. Discussion board
6. End-to-end QA, seed/demo data, deployment hardening

## Task 1: Bootstrap the Greenfield Repo

**Files:**
- Create: `package.json`
- Create: `next.config.ts`
- Create: `tsconfig.json`
- Create: `tailwind.config.ts`
- Create: `postcss.config.js`
- Create: `vitest.config.ts`
- Create: `playwright.config.ts`
- Create: `.env.example`
- Create: `.gitignore`
- Create: `src/app/layout.tsx`
- Create: `src/app/globals.css`
- Create: `src/lib/env.ts`
- Create: `src/lib/env.test.ts`
- Test: `npm run lint`

- [ ] **Step 1: Initialize the Next.js app shell**

```bash
npm init -y
npm install next react react-dom
npm install @prisma/client next-auth rss-parser zod
npm install -D typescript @types/node @types/react @types/react-dom tailwindcss postcss autoprefixer eslint eslint-config-next prisma tsx vitest jsdom @testing-library/react @testing-library/jest-dom @playwright/test
```

- [ ] **Step 2: Write the failing environment validation test**

```ts
import { describe, expect, it } from "vitest";
import { envSchema } from "./env";

describe("env schema", () => {
  it("requires DATABASE_URL and NEXTAUTH_SECRET", () => {
    const result = envSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `npm test -- src/lib/env.test.ts`
Expected: FAIL because `src/lib/env.ts` does not exist yet

- [ ] **Step 4: Add minimal project scaffolding**

```ts
// src/lib/env.ts
import { z } from "zod";

export const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  NEXTAUTH_SECRET: z.string().min(1),
});
```

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest run",
    "test:e2e": "playwright test",
    "db:migrate": "prisma migrate dev",
    "db:seed": "prisma db seed",
    "ingest": "tsx scripts/run-ingest.ts"
  }
}
```

- [ ] **Step 5: Run lint and tests**

Run: `npm test -- src/lib/env.test.ts && npm run lint`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git init
git add package.json package-lock.json next.config.ts tsconfig.json tailwind.config.ts postcss.config.js .env.example .gitignore src/app/layout.tsx src/app/globals.css src/lib/env.ts src/lib/env.test.ts
git commit -m "chore: bootstrap RegScope web app"
```

## Task 2: Model the Core RegScope Domain in Prisma

**Files:**
- Create: `prisma/schema.prisma`
- Create: `src/lib/db.ts`
- Create: `src/lib/taxonomy/constants.ts`
- Create: `prisma/seed.ts`
- Test: `src/lib/taxonomy/constants.test.ts`

- [ ] **Step 1: Write the failing taxonomy test**

```ts
import { topLevelTopics } from "./constants";
import { expect, it } from "vitest";

it("defines the 8 approved top-level RegScope topics", () => {
  expect(topLevelTopics).toHaveLength(8);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- src/lib/taxonomy/constants.test.ts`
Expected: FAIL because constants are missing

- [ ] **Step 3: Implement the schema and taxonomy constants**

```prisma
model ContentItem {
  id             String   @id @default(cuid())
  slug           String   @unique
  title          String
  summary        String
  body           String?
  canonicalUrl   String   @unique
  contentType    ContentType
  publishedAt    DateTime
  sourceId       String
  countryId      String?
  primaryTopicId String?
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
}
```

```ts
export const topLevelTopics = [
  "临床试验",
  "CMC 与生产",
  "注册申报",
  "标签与说明书",
  "上市后管理",
  "药物警戒",
  "数字化与 AI 监管",
  "国际协调与指南",
] as const;
```

- [ ] **Step 4: Add remaining models and seed data**

Include models for:
- `Source`
- `Country`
- `Topic`
- `User`
- `Follow`
- `Discussion`
- `DiscussionConclusion`
- `DiscussionEvidence`
- `Answer`

- [ ] **Step 5: Run migrations and seed**

Run:
```bash
npx prisma migrate dev --name init_core_schema
npx prisma db seed
```

Expected: schema applies and seeds load top-level topics plus a small demo set of countries/sources

- [ ] **Step 6: Commit**

```bash
git add prisma/schema.prisma prisma/seed.ts src/lib/db.ts src/lib/taxonomy/constants.ts src/lib/taxonomy/constants.test.ts
git commit -m "feat: add RegScope core schema and taxonomy"
```

## Task 3: Build the Feed Parsing and Normalization Layer

**Files:**
- Create: `src/lib/feed/parser.ts`
- Create: `src/lib/feed/adapters/rss.ts`
- Create: `src/lib/feed/adapters/atom.ts`
- Create: `src/lib/feed/adapters/json.ts`
- Create: `src/lib/feed/normalize.ts`
- Create: `src/lib/feed/dedupe.ts`
- Test: `src/lib/feed/parser.test.ts`
- Test: `src/lib/feed/normalize.test.ts`
- Test: `src/lib/feed/dedupe.test.ts`

- [ ] **Step 1: Write the failing parser test**

```ts
it("normalizes RSS, Atom, and JSON feed items into a common shape", async () => {
  const items = await parseFeed(sampleSource, samplePayload);
  expect(items[0]).toMatchObject({
    title: expect.any(String),
    canonicalUrl: expect.any(String),
    publishedAt: expect.any(Date),
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- src/lib/feed/parser.test.ts`
Expected: FAIL because `parseFeed` is undefined

- [ ] **Step 3: Implement the common parse interface**

```ts
export type ParsedFeedItem = {
  title: string;
  summary: string;
  canonicalUrl: string;
  publishedAt: Date;
  rawBody?: string;
};
```

- [ ] **Step 4: Implement adapter selection and normalization**

Rules:
- Detect feed type from source config first, payload second
- Strip duplicate whitespace from summaries
- Generate deterministic slugs
- Preserve original canonical URLs for dedupe

- [ ] **Step 5: Add dedupe logic**

```ts
export function buildDedupeKey(sourceSlug: string, canonicalUrl: string) {
  return `${sourceSlug}:${canonicalUrl.toLowerCase()}`;
}
```

- [ ] **Step 6: Run the parsing test suite**

Run: `npm test -- src/lib/feed/parser.test.ts src/lib/feed/normalize.test.ts src/lib/feed/dedupe.test.ts`
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add src/lib/feed
git commit -m "feat: add feed parsing and normalization layer"
```

## Task 4: Add the Ingestion Worker and Manual Trigger

**Files:**
- Create: `src/workers/ingest/run-all-feeds.ts`
- Create: `src/workers/ingest/run-single-feed.ts`
- Create: `src/workers/ingest/upsert-content.ts`
- Create: `scripts/run-ingest.ts`
- Create: `src/app/api/ingest/run/route.ts`
- Test: `src/workers/ingest/upsert-content.test.ts`

- [ ] **Step 1: Write the failing upsert test**

```ts
it("upserts a content item without duplicating an existing canonical URL", async () => {
  const first = await upsertContentItem(sampleItem);
  const second = await upsertContentItem(sampleItem);
  expect(first.id).toBe(second.id);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- src/workers/ingest/upsert-content.test.ts`
Expected: FAIL because worker files do not exist

- [ ] **Step 3: Implement DB upsert logic**

```ts
await prisma.contentItem.upsert({
  where: { canonicalUrl: item.canonicalUrl },
  update: { summary: item.summary, publishedAt: item.publishedAt },
  create: item,
});
```

- [ ] **Step 4: Implement worker orchestration**

Behavior:
- Query all active sources
- Fetch payload
- Parse via adapter
- Normalize and dedupe
- Upsert content
- Record ingestion metrics and failures

- [ ] **Step 5: Add protected manual trigger route**

Guard:
- Only allow authenticated admin users or a signed internal secret header

- [ ] **Step 6: Verify locally against seed sources**

Run:
```bash
npm run db:seed
npm run ingest
```

Expected: seeded content appears in `ContentItem`

- [ ] **Step 7: Commit**

```bash
git add src/workers scripts/run-ingest.ts src/app/api/ingest/run/route.ts
git commit -m "feat: add feed ingestion worker"
```

## Task 5: Build the Shared Public Shell and Chinese Navigation

**Files:**
- Modify: `src/app/layout.tsx`
- Create: `src/components/layout/site-header.tsx`
- Create: `src/components/layout/site-footer.tsx`
- Create: `src/components/home/alert-strip.tsx`
- Create: `src/components/home/follow-center-panel.tsx`
- Create: `src/components/home/trending-panel.tsx`
- Test: `src/app/layout.test.tsx`

- [ ] **Step 1: Write the failing layout test**

```tsx
it("renders the Chinese primary navigation", () => {
  render(<SiteHeader />);
  expect(screen.getByText("情报快讯")).toBeInTheDocument();
  expect(screen.getByText("讨论问答")).toBeInTheDocument();
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- src/app/layout.test.tsx`
Expected: FAIL because `SiteHeader` does not exist

- [ ] **Step 3: Implement the shell**

Navigation labels:
- `首页`
- `情报快讯`
- `领域订阅`
- `官方来源`
- `国家地区`
- `讨论问答`
- `我的关注`

- [ ] **Step 4: Add homepage support panels**

Implement:
- alert strip for critical regulatory updates
- follow center placeholder for anonymous/logged-in states
- trending panel for countries/topics/discussions

- [ ] **Step 5: Run layout tests**

Run: `npm test -- src/app/layout.test.tsx`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/app/layout.tsx src/components/layout src/components/home src/app/layout.test.tsx
git commit -m "feat: add public shell and Chinese navigation"
```

## Task 6: Ship the Homepage and Feed Page

**Files:**
- Create: `src/app/page.tsx`
- Create: `src/app/feed/page.tsx`
- Create: `src/components/cards/intelligence-card.tsx`
- Create: `src/components/filters/feed-filters.tsx`
- Create: `src/lib/content/queries.ts`
- Test: `src/app/feed/feed-page.test.tsx`
- Test: `e2e/home.spec.ts`
- Test: `e2e/feed-filtering.spec.ts`

- [ ] **Step 1: Write the failing homepage/feed tests**

```tsx
it("shows the alert strip, intelligence cards, and small-card sections on the homepage", async () => {
  render(await HomePage());
  expect(screen.getByText("今日监管预警")).toBeInTheDocument();
  expect(screen.getByText("官方来源")).toBeInTheDocument();
});
```

```ts
test("feed filters by topic", async ({ page }) => {
  await page.goto("/feed?topic=ai-regulation");
  await expect(page.getByText("数字化与 AI 监管")).toBeVisible();
});
```

- [ ] **Step 2: Run tests to verify failure**

Run: `npm test -- src/app/feed/feed-page.test.tsx && npm run test:e2e -- e2e/home.spec.ts`
Expected: FAIL because pages/components are missing

- [ ] **Step 3: Implement shared content queries**

Read models needed:
- homepage alerts
- homepage feed cards
- trending topics/sources/discussions
- feed page filter results

- [ ] **Step 4: Build the homepage**

Sections:
- `今日监管预警`
- `我的关注中心`
- `情报资讯大卡片流`
- `官方来源 / 小领域 / 国家入口小卡片矩阵`
- `精选讨论摘要`
- `趋势榜单`

- [ ] **Step 5: Build the feed page**

Filtering dimensions:
- country
- source
- top-level topic
- subtopic
- content type
- time range

- [ ] **Step 6: Run unit and e2e tests**

Run:
```bash
npm test -- src/app/feed/feed-page.test.tsx
npm run test:e2e -- e2e/home.spec.ts e2e/feed-filtering.spec.ts
```

Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add src/app/page.tsx src/app/feed/page.tsx src/components/cards/intelligence-card.tsx src/components/filters/feed-filters.tsx src/lib/content/queries.ts src/app/feed/feed-page.test.tsx e2e/home.spec.ts e2e/feed-filtering.spec.ts
git commit -m "feat: add homepage and feed browsing"
```

## Task 7: Build Topic, Source, Country, and Content Detail Pages

**Files:**
- Create: `src/app/topics/page.tsx`
- Create: `src/app/topics/[slug]/page.tsx`
- Create: `src/app/sources/page.tsx`
- Create: `src/app/sources/[slug]/page.tsx`
- Create: `src/app/countries/page.tsx`
- Create: `src/app/countries/[slug]/page.tsx`
- Create: `src/app/content/[slug]/page.tsx`
- Create: `src/components/cards/source-card.tsx`
- Create: `src/components/cards/topic-card.tsx`
- Test: `src/app/topics/topics-page.test.tsx`
- Test: `src/app/sources/source-page.test.tsx`

- [ ] **Step 1: Write failing page tests**

```tsx
it("renders the approved top-level topics on the topic index", async () => {
  render(await TopicsPage());
  expect(screen.getByText("临床试验")).toBeInTheDocument();
  expect(screen.getByText("数字化与 AI 监管")).toBeInTheDocument();
});
```

- [ ] **Step 2: Run tests to verify failure**

Run: `npm test -- src/app/topics/topics-page.test.tsx src/app/sources/source-page.test.tsx`
Expected: FAIL because pages do not exist

- [ ] **Step 3: Implement the topic and source directories**

Requirements:
- show small-card grids
- expose follow buttons
- link to latest content and related discussions

- [ ] **Step 4: Implement the content detail page**

Content detail sections:
- headline and tags
- 3-line digest
- body or extracted feed content
- original source link
- related topic links
- related discussion links

- [ ] **Step 5: Run tests**

Run: `npm test -- src/app/topics/topics-page.test.tsx src/app/sources/source-page.test.tsx`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/app/topics src/app/sources src/app/countries src/app/content src/components/cards/source-card.tsx src/components/cards/topic-card.tsx
git commit -m "feat: add structured browse pages"
```

## Task 8: Add Authentication and Follow Center

**Files:**
- Create: `src/lib/auth.ts`
- Create: `src/lib/permissions.ts`
- Create: `src/app/api/auth/[...nextauth]/route.ts`
- Create: `src/app/api/follows/route.ts`
- Create: `src/app/me/follows/page.tsx`
- Test: `src/app/me/follows/page.test.tsx`
- Test: `src/app/api/follows/route.test.ts`

- [ ] **Step 1: Write the failing follow API test**

```ts
it("creates a follow for a logged-in user", async () => {
  const response = await POST(mockRequestWithSession);
  expect(response.status).toBe(201);
});
```

- [ ] **Step 2: Run tests to verify failure**

Run: `npm test -- src/app/api/follows/route.test.ts src/app/me/follows/page.test.tsx`
Expected: FAIL because auth/follow files do not exist

- [ ] **Step 3: Implement Auth.js**

MVP recommendation:
- email magic link sign-in
- anonymous browse remains enabled
- `ADMIN` role reserved for ingestion trigger access

- [ ] **Step 4: Implement follow API and follow center page**

Followable entities:
- source
- country
- topic
- subtopic

- [ ] **Step 5: Run auth/follow tests**

Run: `npm test -- src/app/api/follows/route.test.ts src/app/me/follows/page.test.tsx`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/lib/auth.ts src/lib/permissions.ts src/app/api/auth src/app/api/follows src/app/me/follows
git commit -m "feat: add auth and follow center"
```

## Task 9: Build the Conclusion-Oriented Discussion Board

**Files:**
- Create: `src/app/discussions/page.tsx`
- Create: `src/app/discussions/[slug]/page.tsx`
- Create: `src/app/api/discussions/route.ts`
- Create: `src/app/api/discussions/[id]/answers/route.ts`
- Create: `src/components/cards/discussion-card.tsx`
- Create: `src/components/discussions/conclusion-panel.tsx`
- Create: `src/components/discussions/evidence-list.tsx`
- Create: `src/components/discussions/controversy-panel.tsx`
- Create: `src/components/discussions/answer-list.tsx`
- Create: `src/lib/discussions/queries.ts`
- Create: `src/lib/discussions/status.ts`
- Test: `src/lib/discussions/status.test.ts`
- Test: `src/app/discussions/discussion-page.test.tsx`
- Test: `e2e/discussion-flow.spec.ts`

- [ ] **Step 1: Write the failing discussion tests**

```tsx
it("renders conclusion, evidence, controversy, and answers in that order", async () => {
  render(await DiscussionPage({ params: { slug: "ema-guideline-impact" } }));
  expect(screen.getByText("当前结论")).toBeInTheDocument();
  expect(screen.getByText("证据区")).toBeInTheDocument();
});
```

```ts
test("logged-in user can post an answer to a discussion", async ({ page }) => {
  await page.goto("/discussions/ema-guideline-impact");
  await page.getByLabel("回答内容").fill("这会影响既有申报路径。");
  await page.getByRole("button", { name: "发布回答" }).click();
  await expect(page.getByText("这会影响既有申报路径。")).toBeVisible();
});
```

- [ ] **Step 2: Run tests to verify failure**

Run: `npm test -- src/lib/discussions/status.test.ts src/app/discussions/discussion-page.test.tsx`
Expected: FAIL because discussion files are missing

- [ ] **Step 3: Implement discussion state and queries**

Allowed statuses:
- `OPEN`
- `IN_REVIEW`
- `PROVISIONAL_CONCLUSION`
- `CONTROVERSIAL`

Evidence labels:
- `OFFICIAL`
- `ANALYSIS`
- `EXPERIENCE`
- `UNVERIFIED`

- [ ] **Step 4: Build discussion list cards**

Each card shows:
- title
- topic tags
- status
- one-line current conclusion
- evidence count
- last updated timestamp

- [ ] **Step 5: Build the discussion detail page**

Order:
1. question definition
2. current conclusion
3. evidence list
4. controversy panel
5. answers sorted by evidence-first / endorsements / recency

- [ ] **Step 6: Implement create discussion and create answer endpoints**

Rules:
- login required for write actions
- answers can declare evidence label
- only moderators/admins can edit the canonical conclusion block in MVP

- [ ] **Step 7: Run unit and e2e tests**

Run:
```bash
npm test -- src/lib/discussions/status.test.ts src/app/discussions/discussion-page.test.tsx
npm run test:e2e -- e2e/discussion-flow.spec.ts
```

Expected: PASS

- [ ] **Step 8: Commit**

```bash
git add src/app/discussions src/components/cards/discussion-card.tsx src/components/discussions src/lib/discussions e2e/discussion-flow.spec.ts
git commit -m "feat: add conclusion-oriented discussion board"
```

## Task 10: Seed Demo Data and Connect Homepage Discussion Digests

**Files:**
- Modify: `prisma/seed.ts`
- Modify: `src/lib/content/queries.ts`
- Modify: `src/app/page.tsx`
- Test: `src/app/page.test.tsx`

- [ ] **Step 1: Write the failing homepage digest test**

```tsx
it("shows featured discussion summaries on the homepage", async () => {
  render(await HomePage());
  expect(screen.getByText("精选讨论摘要")).toBeInTheDocument();
});
```

- [ ] **Step 2: Run the test to verify failure**

Run: `npm test -- src/app/page.test.tsx`
Expected: FAIL because homepage digest query is incomplete

- [ ] **Step 3: Extend seed data**

Seed:
- 5 to 10 sources
- 6 countries/regions
- 8 top-level topics and representative subtopics
- 15 to 20 content items
- 3 to 5 discussions with conclusions and evidence links

- [ ] **Step 4: Wire homepage discussion summaries**

Show:
- question title
- current conclusion one-liner
- status
- answer count

- [ ] **Step 5: Run the homepage tests**

Run: `npm test -- src/app/page.test.tsx`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add prisma/seed.ts src/lib/content/queries.ts src/app/page.tsx src/app/page.test.tsx
git commit -m "feat: add demo data and homepage discussion digests"
```

## Task 11: Hardening, QA, and Deployment Readiness

**Files:**
- Create: `middleware.ts`
- Create: `README.md`
- Create: `docs/deployment.md`
- Modify: `.env.example`
- Modify: `package.json`
- Test: `npm run lint`
- Test: `npm run test`
- Test: `npm run test:e2e`

- [ ] **Step 1: Add route guards and operational middleware**

Protect:
- write APIs
- manual ingest route
- logged-in follow center

- [ ] **Step 2: Add documentation**

Document:
- local setup
- env vars
- Prisma migration flow
- seeding
- ingestion runner
- cron/deployment expectations

- [ ] **Step 3: Add CI-friendly scripts**

Required scripts:
- `lint`
- `test`
- `test:e2e`
- `db:migrate`
- `db:seed`
- `ingest`

- [ ] **Step 4: Run the full verification suite**

Run:
```bash
npm run lint
npm run test
npm run test:e2e
```

Expected: all pass in a clean local environment

- [ ] **Step 5: Commit**

```bash
git add middleware.ts README.md docs/deployment.md .env.example package.json
git commit -m "chore: harden RegScope MVP for delivery"
```

## MVP Acceptance Checklist

- [ ] Public users can browse homepage, feed, topics, sources, countries, content detail, and discussion pages
- [ ] Logged-in users can follow sources/countries/topics/subtopics
- [ ] Logged-in users can create discussions and answers
- [ ] Discussion pages display `当前结论`, `证据区`, `争议点`, and evidence-first answers
- [ ] RSS / Atom / JSON feeds can be ingested without duplicate content rows
- [ ] Homepage shows alert strip, intelligence cards, small-card grids, and featured discussion summaries
- [ ] Topic model matches the approved 8-category top-level taxonomy
- [ ] Interface is Chinese-first with no English navigation leakage

## Deferred After MVP

- Automated discussion summary generation
- Email digests and weekly reports
- Personalized content recommendations
- Multilingual UI
- Browser scraping beyond RSS / Atom / JSON feeds
- Moderator back office beyond basic admin-only conclusion editing

## Notes for the Implementing Engineer

- Keep components small and query functions reusable.
- Do not build a generic CMS; model only what the approved spec requires.
- Keep discussion summaries human-editable in MVP; do not add LLM infrastructure yet.
- Prefer server components for read-heavy pages and thin client components for interactive follow/write actions.
- Use seed data aggressively so reviewable UI exists before live ingestion is stable.
