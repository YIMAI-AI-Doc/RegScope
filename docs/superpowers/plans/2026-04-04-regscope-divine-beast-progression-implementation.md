# RegScope Divine Beast Progression Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first production-ready divine beast progression system for RegScope, including 5 fixed tiers, 25 pet species, user assignment, star-based point growth, upgrade transitions, and the “我的神兽” card plus图鉴页.

**Architecture:** The system extends the existing Prisma user model with pet profile and pet event tables, adds a small `src/lib/pets` domain for tier/species definitions and scoring logic, and renders the current beast through focused React UI components in the account menu and personal center. Existing user actions such as daily question answers, discussion creation, and answer/comment creation award points through a shared server-side grant service. The initial release avoids heavy canvas/game infrastructure and instead uses SVG/CSS/React motion states with tier-aware presets.

**Tech Stack:** Next.js 15 App Router, TypeScript, React, Prisma, PostgreSQL, Auth.js, Vitest, Testing Library, Playwright

---

## Planning Assumptions

- The approved 5 fixed tiers are `凡崽` -> `萌灵` -> `珍宠` -> `灵尊` -> `神兽`.
- Each tier contains exactly 5 species, defined in the spec and seeded into the database.
- Users hold only one active beast at a time.
- Within a tier, the species does not reroll; it only grows through 3 stages.
- Reaching `15 / 15` triggers an upgrade and rerolls a new species from the next tier.
- Current codebase already has “每日一题”, discussion creation, and answer creation; these will be the first live scoring hooks.
- “发表文章 +3” has no user-facing article publishing flow yet, so the first implementation will expose this as a supported event type in the domain service and seed/tests, but not wire it to a non-existent UI route.

## Recommended File Structure

### Database and seed

- `prisma/schema.prisma` — add pet enums/models and user relations
- `prisma/seed.ts` — seed 5 tiers and 25 species

### Pet domain

- `src/lib/pets/catalog.ts` — canonical tier/species definitions and presentation metadata
- `src/lib/pets/scoring.ts` — event-to-points mapping, stage mapping, upgrade thresholds
- `src/lib/pets/queries.ts` — read models for current pet card and pet dex page
- `src/lib/pets/grant-points.ts` — idempotent point-award transaction
- `src/lib/pets/catalog.test.ts`
- `src/lib/pets/scoring.test.ts`
- `src/lib/pets/grant-points.test.ts`

### UI

- `src/components/pets/my-pet-card.tsx` — current beast card shell
- `src/components/pets/pet-avatar-stage.tsx` — species art stage and motion states
- `src/components/pets/pet-progress-stars.tsx` — three-star progress display
- `src/components/pets/pet-tier-badge.tsx` — compact tier label chip
- `src/components/pets/pet-dex-grid.tsx` — grouped species display with lock states

### Pages and integration points

- `src/components/layout/account-menu.tsx` — replace current placeholder row with actual pet summary card
- `src/app/me/page.tsx` — add full “我的神兽” section above favorites
- `src/app/me/pets/page.tsx` — dedicated 神兽图鉴与互动 page
- `src/app/api/daily-question/answer/route.ts` — award +1 on successful submission
- `src/app/api/discussions/route.ts` — award +2 on successful discussion creation
- `src/app/api/discussions/[slug]/answers/route.ts` — award +1 as comment interaction
- `src/app/api/pets/current/route.ts` — optional read endpoint for client refresh after growth events

### Tests and e2e

- `src/app/me/page.test.tsx`
- `src/components/layout/account-menu.test.tsx`
- `src/app/api/daily-question/answer/route.test.ts`
- `e2e/pet-progression.spec.ts`

## Delivery Order

1. Persist the pet domain in Prisma and seed the catalog
2. Build the pure scoring and upgrade logic
3. Wire idempotent point granting into real user actions
4. Render the “我的神兽” summary card and the full personal center card
5. Add the pet dex page
6. Verify with unit, page, and e2e coverage

## Task 1: Add the Pet Schema and Catalog Seed

**Files:**
- Modify: `prisma/schema.prisma`
- Modify: `prisma/seed.ts`
- Create: `src/lib/pets/catalog.ts`
- Test: `src/lib/pets/catalog.test.ts`

- [ ] **Step 1: Write the failing catalog test**

```ts
import { describe, expect, it } from "vitest";
import { petTiers, petSpecies } from "./catalog";

describe("pet catalog", () => {
  it("defines 5 tiers and 25 species", () => {
    expect(petTiers).toHaveLength(5);
    expect(petSpecies).toHaveLength(25);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- src/lib/pets/catalog.test.ts`
Expected: FAIL because `src/lib/pets/catalog.ts` does not exist

- [ ] **Step 3: Add the Prisma schema pieces**

Add these enums:

```prisma
enum PetTierSlug {
  FANZAI
  MENGLING
  ZHENCHONG
  LINGZUN
  SHENSHOU
}

enum PetGrowthStage {
  BABY
  GROWING
  MATURE
}

enum PetEventType {
  DAILY_QUESTION
  COMMENT
  ARTICLE
  DISCUSSION_POST
}
```

Add these models:

```prisma
model PetTier {
  id        String       @id @default(cuid())
  slug      PetTierSlug  @unique
  name      String
  sortOrder Int          @unique
  species   PetSpecies[]
  profiles  UserPetProfile[]
}

model PetSpecies {
  id                String     @id @default(cuid())
  slug              String     @unique
  name              String
  tierId            String
  tier              PetTier    @relation(fields: [tierId], references: [id], onDelete: Cascade)
  motionPreset      String
  visualStyle       String
  title             String
  traitKeywords     String[]
  growthStageConfig Json
  profiles          UserPetProfile[]
}

model UserPetProfile {
  id               String          @id @default(cuid())
  userId           String          @unique
  user             User            @relation(fields: [userId], references: [id], onDelete: Cascade)
  currentTierId    String
  currentTier      PetTier         @relation(fields: [currentTierId], references: [id], onDelete: Cascade)
  currentSpeciesId String
  currentSpecies   PetSpecies      @relation(fields: [currentSpeciesId], references: [id], onDelete: Cascade)
  currentPoints    Int             @default(0)
  currentStage     PetGrowthStage  @default(BABY)
  totalPointsEarned Int            @default(0)
  lastUpgradeAt    DateTime?
  createdAt        DateTime        @default(now())
  updatedAt        DateTime        @updatedAt
  events           UserPetEvent[]
}

model UserPetEvent {
  id          String       @id @default(cuid())
  userPetId   String
  userPet     UserPetProfile @relation(fields: [userPetId], references: [id], onDelete: Cascade)
  userId      String
  user        User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  eventType   PetEventType
  points      Int
  sourceId    String?
  sourceType  String?
  createdAt   DateTime     @default(now())

  @@index([userId, createdAt])
  @@index([eventType, createdAt])
  @@unique([userId, eventType, sourceId, sourceType])
}
```

Also extend `User` with:

```prisma
petProfile UserPetProfile?
petEvents  UserPetEvent[]
```

- [ ] **Step 4: Define the 5 tiers and 25 species in `catalog.ts`**

Include:
- canonical slug
- Chinese display name
- `motionPreset`
- `visualStyle`
- `title`
- `traitKeywords`
- `growthStageConfig` for BABY / GROWING / MATURE

Keep the source of truth in code and reuse it from seed scripts.

- [ ] **Step 5: Seed tiers and species in `prisma/seed.ts`**

Seed order:
1. Upsert 5 `PetTier` rows
2. Upsert 25 `PetSpecies` rows
3. Do not create `UserPetProfile` rows in seed yet; that belongs to first-login/bootstrap logic

- [ ] **Step 6: Run tests and Prisma generation**

Run:
- `npm test -- src/lib/pets/catalog.test.ts`
- `npx prisma generate`

Expected: PASS and generated client updated

- [ ] **Step 7: Commit**

```bash
git add prisma/schema.prisma prisma/seed.ts src/lib/pets/catalog.ts src/lib/pets/catalog.test.ts
git commit -m "feat: add divine beast schema and catalog"
```

## Task 2: Implement Pure Scoring, Stage, and Upgrade Logic

**Files:**
- Create: `src/lib/pets/scoring.ts`
- Create: `src/lib/pets/scoring.test.ts`

- [ ] **Step 1: Write the failing scoring test**

```ts
import { describe, expect, it } from "vitest";
import { getStageForPoints, getPointsForEvent } from "./scoring";

describe("pet scoring", () => {
  it("maps current points to the correct stage", () => {
    expect(getStageForPoints(0)).toBe("BABY");
    expect(getStageForPoints(5)).toBe("GROWING");
    expect(getStageForPoints(10)).toBe("MATURE");
  });

  it("uses the approved event points", () => {
    expect(getPointsForEvent("DAILY_QUESTION")).toBe(1);
    expect(getPointsForEvent("COMMENT")).toBe(1);
    expect(getPointsForEvent("DISCUSSION_POST")).toBe(2);
    expect(getPointsForEvent("ARTICLE")).toBe(3);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- src/lib/pets/scoring.test.ts`
Expected: FAIL because `src/lib/pets/scoring.ts` does not exist

- [ ] **Step 3: Implement scoring helpers**

Implement:

```ts
export const PET_TIER_MAX_POINTS = 15;

export function getPointsForEvent(eventType: PetEventType) {
  const table = {
    DAILY_QUESTION: 1,
    COMMENT: 1,
    ARTICLE: 3,
    DISCUSSION_POST: 2,
  } as const;

  return table[eventType];
}

export function getStageForPoints(points: number): PetGrowthStage {
  if (points >= 10) return "MATURE";
  if (points >= 5) return "GROWING";
  return "BABY";
}
```

Also add helpers for:
- next tier lookup
- points remaining display
- comment daily cap check metadata

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- src/lib/pets/scoring.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/pets/scoring.ts src/lib/pets/scoring.test.ts
git commit -m "feat: add divine beast scoring helpers"
```

## Task 3: Add User Pet Bootstrap and Idempotent Point Granting

**Files:**
- Create: `src/lib/pets/grant-points.ts`
- Create: `src/lib/pets/grant-points.test.ts`
- Create: `src/lib/pets/queries.ts`
- Modify: `src/lib/db.ts` only if needed for typed transaction helpers

- [ ] **Step 1: Write the failing grant test**

```ts
import { describe, expect, it, vi } from "vitest";
import { ensureUserPetProfile, grantPetPoints } from "./grant-points";

describe("grantPetPoints", () => {
  it("bootstraps a new user into 凡崽 with a random species", async () => {
    const profile = await ensureUserPetProfile("user-1");
    expect(profile.currentPoints).toBe(0);
    expect(profile.currentStage).toBe("BABY");
  });

  it("upgrades to the next tier after reaching 15 points", async () => {
    const result = await grantPetPoints({ userId: "user-1", eventType: "DISCUSSION_POST", sourceId: "discussion-1", sourceType: "DISCUSSION" });
    expect(result).toHaveProperty("didUpgrade");
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- src/lib/pets/grant-points.test.ts`
Expected: FAIL because the grant service does not exist

- [ ] **Step 3: Implement the bootstrap transaction**

Implement `ensureUserPetProfile(userId)`:
- fetch profile
- if missing, load `凡崽` tier and its 5 species
- choose one random species
- create `UserPetProfile`

Randomness rule:
- first release uses uniform random from the 5 species in the tier
- use `Math.floor(Math.random() * species.length)` inside the transaction helper
- keep the selector isolated for later deterministic test injection

- [ ] **Step 4: Implement `grantPetPoints`**

Required behaviors:
- enforce idempotency through `UserPetEvent @@unique`
- calculate points via `getPointsForEvent`
- reject duplicate source events
- enforce daily cap for `COMMENT`
- update `currentPoints`, `totalPointsEarned`, and `currentStage`
- when points reach 15:
  - find next tier
  - reroll next species
  - reset points to 0
  - reset stage to `BABY`
  - set `lastUpgradeAt`
- if already at `神兽`, stop at `MATURE` and do not overflow

- [ ] **Step 5: Add read-model helpers to `src/lib/pets/queries.ts`**

Implement:
- `getCurrentUserPetCardData(userId)`
- `getPetDexPageData(userId)`

These should return UI-friendly objects, not raw Prisma shapes.

- [ ] **Step 6: Run tests**

Run:
- `npm test -- src/lib/pets/grant-points.test.ts`

Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add src/lib/pets/grant-points.ts src/lib/pets/grant-points.test.ts src/lib/pets/queries.ts
git commit -m "feat: add divine beast grant and query services"
```

## Task 4: Wire Real Product Actions into Pet Points

**Files:**
- Modify: `src/app/api/daily-question/answer/route.ts`
- Modify: `src/lib/quiz/queries.ts`
- Modify: `src/app/api/discussions/route.ts`
- Modify: `src/app/api/discussions/[slug]/answers/route.ts`
- Test: `src/app/api/daily-question/answer/route.test.ts`
- Test: new route tests for discussion creation and answer creation if missing

- [ ] **Step 1: Add a failing route test for point granting**

Example for daily question:

```ts
expect(mockedGrantPetPoints).toHaveBeenCalledWith({
  userId: "user-1",
  eventType: "DAILY_QUESTION",
  sourceId: expect.any(String),
  sourceType: "DAILY_QUESTION",
});
```

- [ ] **Step 2: Run the route tests to verify they fail**

Run:
- `npm test -- src/app/api/daily-question/answer/route.test.ts`

Expected: FAIL because no grant service is invoked

- [ ] **Step 3: Wire the three live scoring hooks**

Map events as follows:
- daily question successful submission -> `DAILY_QUESTION`
- discussion creation -> `DISCUSSION_POST`
- answer creation -> `COMMENT`

Implementation rule:
- call `grantPetPoints` only after the primary mutation succeeds
- if pet granting fails, log and continue returning the primary success response for now
- do not block core product actions on pet service instability in v1

- [ ] **Step 4: Add a future-safe article hook comment**

In the content authoring area (or nearest docs comment if no route exists yet), leave a clear TODO reference for wiring `ARTICLE` when user-authored article publishing is added.

- [ ] **Step 5: Run route tests**

Run:
- `npm test -- src/app/api/daily-question/answer/route.test.ts`
- `npm test -- src/app/api/discussions/route.test.ts src/app/api/discussions/[slug]/answers/route.test.ts`

Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/app/api/daily-question/answer/route.ts src/lib/quiz/queries.ts src/app/api/discussions/route.ts src/app/api/discussions/[slug]/answers/route.ts src/app/api/daily-question/answer/route.test.ts
git commit -m "feat: award divine beast points for user actions"
```

## Task 5: Render the Pet Card UI Components

**Files:**
- Create: `src/components/pets/my-pet-card.tsx`
- Create: `src/components/pets/pet-avatar-stage.tsx`
- Create: `src/components/pets/pet-progress-stars.tsx`
- Create: `src/components/pets/pet-tier-badge.tsx`
- Test: `src/components/pets/my-pet-card.test.tsx`

- [ ] **Step 1: Write the failing component test**

```tsx
import { render, screen } from "@testing-library/react";
import { MyPetCard } from "./my-pet-card";

it("renders current tier, species, and 3-star progress", () => {
  render(
    <MyPetCard
      pet={{
        tierName: "萌灵",
        speciesName: "萨摩耶",
        currentPoints: 9,
        totalRequiredPoints: 15,
        stage: "GROWING",
      }}
    />,
  );

  expect(screen.getByText("我的神兽")).toBeInTheDocument();
  expect(screen.getByText("萌灵")).toBeInTheDocument();
  expect(screen.getByText("9 / 15")).toBeInTheDocument();
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- src/components/pets/my-pet-card.test.tsx`
Expected: FAIL because components do not exist

- [ ] **Step 3: Implement `PetProgressStars`**

Requirements:
- 3 stars
- each star maps to a 5-point bucket
- partially filled stars for 1-4, 6-9, 11-14
- highlighted complete stars at 5, 10, 15

- [ ] **Step 4: Implement `PetAvatarStage`**

Requirements:
- render a single centered species avatar
- support 3 growth stages: BABY / GROWING / MATURE
- support motion presets such as `swim`, `glide`, `pounce`, `float`, `circle`
- use CSS/SVG/React only; no canvas dependency in v1
- include decorative stage layers for high tiers

- [ ] **Step 5: Implement `MyPetCard`**

Card must show:
- title `我的神兽`
- right action `神兽图鉴与互动 >`
- small tier badge
- centered avatar stage
- star progress
- `当前积分 x / 15`
- next-tier copy if not max tier

- [ ] **Step 6: Run component tests**

Run: `npm test -- src/components/pets/my-pet-card.test.tsx`
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add src/components/pets/my-pet-card.tsx src/components/pets/pet-avatar-stage.tsx src/components/pets/pet-progress-stars.tsx src/components/pets/pet-tier-badge.tsx src/components/pets/my-pet-card.test.tsx
git commit -m "feat: add divine beast card components"
```

## Task 6: Integrate the Pet Card into Account Menu and Personal Center

**Files:**
- Modify: `src/components/layout/account-menu.tsx`
- Modify: `src/app/me/page.tsx`
- Create: `src/app/me/pets/page.tsx`
- Test: `src/app/me/page.test.tsx`
- Test: `src/components/layout/account-menu.test.tsx`

- [ ] **Step 1: Write failing page tests**

For `/me`:

```tsx
expect(screen.getByText("我的神兽")).toBeInTheDocument();
expect(screen.getByText("神兽图鉴与互动")).toBeInTheDocument();
```

For account menu:

```tsx
expect(screen.getByText("我的神兽")).toBeInTheDocument();
expect(screen.getByText("当前积分")).toBeInTheDocument();
```

- [ ] **Step 2: Run the tests to verify they fail**

Run:
- `npm test -- src/app/me/page.test.tsx src/components/layout/account-menu.test.tsx`

Expected: FAIL because the current menu only has a placeholder row

- [ ] **Step 3: Replace the placeholder menu row**

In `account-menu.tsx`:
- replace the current `MenuRow label="我的神兽"` placeholder
- render a compact `MyPetCard` summary instead
- clicking the card routes to `/me/pets`

Compact card rules:
- same data, shorter copy
- keep hover-open behavior stable
- do not let the card overflow the menu panel

- [ ] **Step 4: Add the full card to `/me`**

In `src/app/me/page.tsx`:
- fetch `getCurrentUserPetCardData(viewer.id)`
- render the full `MyPetCard` above “我的活跃”
- link to `/me/pets`

- [ ] **Step 5: Add the pet dex page**

`src/app/me/pets/page.tsx` should include:
- current active beast card
- grouped 5-tier dex
- locked vs unlocked presentation
- short upgrade rules block

- [ ] **Step 6: Run page tests**

Run:
- `npm test -- src/app/me/page.test.tsx src/components/layout/account-menu.test.tsx`

Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add src/components/layout/account-menu.tsx src/app/me/page.tsx src/app/me/pets/page.tsx src/app/me/page.test.tsx src/components/layout/account-menu.test.tsx
git commit -m "feat: integrate divine beast card into user surfaces"
```

## Task 7: Add Motion Polish and Tier-Specific Presentation

**Files:**
- Modify: `src/components/pets/pet-avatar-stage.tsx`
- Modify: `src/app/globals.css` or add `src/components/pets/pets.css` if a focused file is cleaner
- Test: `src/components/pets/pet-avatar-stage.test.tsx`

- [ ] **Step 1: Write the failing stage test**

```tsx
expect(screen.getByTestId("pet-stage-root")).toHaveAttribute("data-stage", "MATURE");
expect(screen.getByTestId("pet-stage-root")).toHaveAttribute("data-motion", "swim");
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- src/components/pets/pet-avatar-stage.test.tsx`
Expected: FAIL because the data attributes and stage styling are incomplete

- [ ] **Step 3: Add the stage-specific motion system**

Implement:
- subtle breathing loop
- tier accent layers
- species-specific presets
- growth-stage scaling and ornament toggles

Examples:
- fish: lateral swim loop + bubbles
- eagle: wing spread + glide sway
- fox: tail fan sway
- dragon: float + body wave

- [ ] **Step 4: Keep v1 motion restrained**

Do not add:
- audio
- auto-play upgrade cinematics on every page load
- large particle systems that distract from navigation

- [ ] **Step 5: Run the test to verify it passes**

Run: `npm test -- src/components/pets/pet-avatar-stage.test.tsx`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/components/pets/pet-avatar-stage.tsx src/components/pets/pet-avatar-stage.test.tsx src/app/globals.css
git commit -m "feat: add divine beast motion presets"
```

## Task 8: Verify Full Progression and Navigation

**Files:**
- Create: `e2e/pet-progression.spec.ts`
- Modify: any touched page tests if the UI copy changed

- [ ] **Step 1: Write the failing e2e**

```ts
test("authenticated user sees the divine beast card and can open the dex page", async ({ page }) => {
  await page.goto("/");
  // sign in test helper or seed-auth session
  await page.getByRole("button", { name: /账户/ }).click();
  await page.getByText("我的神兽").click();
  await expect(page).toHaveURL(/\/me\/pets/);
});
```

- [ ] **Step 2: Run the e2e to verify it fails**

Run: `npm run test:e2e -- e2e/pet-progression.spec.ts`
Expected: FAIL because the pet UI is not fully wired yet

- [ ] **Step 3: Expand the e2e to cover progression**

Minimum assertions:
- current tier is visible
- species is visible
- star progress is visible
- `/me/pets` loads and shows grouped tiers
- daily question answer path keeps the app working and can refresh pet state later

- [ ] **Step 4: Run all related checks**

Run:
- `npm run lint -- src/components/pets src/app/me src/components/layout/account-menu.tsx`
- `npm test -- src/lib/pets/catalog.test.ts src/lib/pets/scoring.test.ts src/lib/pets/grant-points.test.ts src/app/me/page.test.tsx`
- `npm run test:e2e -- e2e/pet-progression.spec.ts`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add e2e/pet-progression.spec.ts src/lib/pets src/app/me src/components/pets src/components/layout/account-menu.tsx
git commit -m "test: verify divine beast progression flows"
```

## Task 9: Migration, Seed, and Manual QA Pass

**Files:**
- Modify: `.env.example` only if new configuration is introduced
- Modify: `docs/superpowers/specs/2026-04-04-regscope-divine-beast-progression-design.md` only if implementation-driven clarifications are required

- [ ] **Step 1: Generate and apply the migration**

Run:
- `npx prisma migrate dev --name add_divine_beast_progression`
- `npx prisma generate`

Expected: migration SQL created and Prisma client regenerated

- [ ] **Step 2: Seed the catalog and verify a demo user gets a pet profile**

Run:
- `npm run db:seed`

Expected:
- 5 pet tiers exist
- 25 species exist
- manual login can trigger initial profile creation on first scoring event or page fetch

- [ ] **Step 3: Manual QA checklist**

Verify:
- account menu opens and current beast renders
- `/me` shows the full card without breaking favorites
- `/me/pets` shows current beast and locked/unlocked dex entries
- daily question answer awards points exactly once
- discussion creation awards +2
- answer creation awards +1
- comment daily cap works
- hitting `15 / 15` rerolls the next-tier species

- [ ] **Step 4: Commit final polish**

```bash
git add prisma src e2e docs
git commit -m "feat: ship divine beast progression system"
```

## Open Implementation Notes

- Treat `ARTICLE` as a supported domain event now, but do not fake a publishing UI that does not exist.
- Keep all pet rendering in code-native SVG/CSS components for v1. Do not block the release on external illustration pipelines.
- If art production becomes a bottleneck, release with one polished motion system per tier and differentiated per-species silhouettes before adding bespoke frame-by-frame animation.
- If daily question is the first scoring hook to ship, make sure the user still sees the pet card even before earning points; otherwise the system feels hidden.
