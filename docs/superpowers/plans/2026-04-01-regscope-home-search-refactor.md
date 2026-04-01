# RegScope Home/Search Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the homepage around three distinct content sections and reposition `/feed` as a categorized search-result page with a top expandable intelligence filter drawer.

**Architecture:** Keep the current route skeleton, Prisma schema, and follow API. Refactor `src/lib/content/queries.ts` to expose homepage/search data that matches the approved information architecture, then add focused homepage/search components so intelligence, accounts/topics, and discussions no longer share the same repetitive presentation. Use lightweight client components only where interaction is required: topic browsing, follow toggles, and search filter drawer behavior.

**Tech Stack:** Next.js App Router, React server/client components, TypeScript, Prisma, Vitest, Testing Library

---

### Task 1: Reshape homepage and search query data

**Files:**
- Modify: `src/lib/content/queries.ts`
- Test: `src/app/page.test.tsx`
- Test: `src/app/feed/feed-page.test.tsx`

- [ ] **Step 1: Add homepage-specific types for accounts, grouped topics, and discussion highlights**

Include exact structures for:

```ts
type AccountCardData = {
  slug: string;
  href: string;
  label: string;
  note: string;
  summary: string;
  badge?: string;
  targetType: "SOURCE" | "COUNTRY";
  recentCountLabel: string;
};

type TopicGroupData = {
  slug: string;
  label: string;
  description: string;
  children: CatalogCardData[];
};
```

- [ ] **Step 2: Replace homepage small-card buckets with the new query shape**

Update the homepage result to return:

```ts
{
  alert,
  featuredCards,
  accountCards,
  topicGroups,
  discussions,
}
```

Expected: homepage consumers no longer depend on `officialSources`, `topicCards`, `countryCards`, or `trending`.

- [ ] **Step 3: Build account cards from source and country catalogs**

Use a focused subset for the homepage and preserve direct routing:

```ts
href: `/sources/${slug}` // sources
href: `/countries/${slug}` // countries
```

Expected: each account card exposes enough metadata for a followable object UI.

- [ ] **Step 4: Build large-topic groups from existing topic data**

Use top-level topics as large topics and `buildTopicSubtopics()` for children:

```ts
const topicGroups = topLevelTopics.map((topic) => ({
  slug: topic.slug,
  label: topic.name,
  description: "...",
  children: buildTopicSubtopics(topic.slug),
}));
```

Expected: no schema change, all hierarchy stays query-layer only.

- [ ] **Step 5: Expand feed/search data to support categorized results framing**

Return search header context and tab counts along with the existing intelligence list:

```ts
{
  query,
  activeTab,
  total,
  tabCounts,
  items,
  filters,
}
```

Expected: `/feed` can render as a search-result page even if only the intelligence tab is fully populated in the first pass.

- [ ] **Step 6: Update failing tests for the new data contract**

Run:

```bash
npm test -- --run src/app/page.test.tsx src/app/feed/feed-page.test.tsx
```

Expected: tests fail first on old headings/fields before UI is updated.

### Task 2: Rebuild homepage around three primary sections

**Files:**
- Modify: `src/app/page.tsx`
- Create: `src/components/home/home-intelligence-section.tsx`
- Create: `src/components/home/home-account-topic-section.tsx`
- Create: `src/components/home/home-discussion-section.tsx`
- Create: `src/components/home/account-card.tsx`
- Create: `src/components/home/topic-browser.tsx`
- Create: `src/components/follows/follow-toggle-button.tsx`
- Modify: `src/app/globals.css`
- Test: `src/app/page.test.tsx`

- [ ] **Step 1: Add the failing homepage assertions for the approved three-section layout**

Cover text that proves the page contains:

- intelligence section
- accounts/topics section
- discussion section

Expected: old homepage rendering no longer satisfies the test.

- [ ] **Step 2: Extract the intelligence block into a dedicated homepage section component**

Render a constrained, high-signal set of `IntelligenceCard` items and keep tags intact.

Expected: no more generic "latest intelligence + small card section" composition in `src/app/page.tsx`.

- [ ] **Step 3: Implement an account card component with follow action support**

Render:

- label
- note/type
- summary
- recent activity label
- follow button

Use a small client component for follow toggling:

```ts
fetch("/api/follows", {
  method: isFollowed ? "DELETE" : "POST",
  body: JSON.stringify({ targetType, slug }),
})
```

Expected: source/country cards behave like followable objects.

- [ ] **Step 4: Implement the topic browser client component**

Behavior:

- render large-topic chips
- keep one selected chip in state
- show a topic-only search input
- filter displayed small topics by selected large topic and search text

Expected: homepage topics behave like structured navigation, not another flat card matrix.

- [ ] **Step 5: Implement the discussion summary section**

Reuse existing discussion digest content but present it as a conclusion-first list.

Expected: discussion items no longer visually compete with intelligence cards.

- [ ] **Step 6: Replace homepage assembly in `src/app/page.tsx`**

Compose:

```tsx
<HomeIntelligenceSection />
<HomeAccountTopicSection />
<HomeDiscussionSection />
```

Expected: `FollowCenterPanel` and `TrendingPanel` are removed from the homepage path.

- [ ] **Step 7: Add focused shared styling in `src/app/globals.css` only where responsive behavior is awkward inline**

Use classes for repeated responsive grids or section shells only.

Expected: mobile layout preserves section separation and topic browser usability.

- [ ] **Step 8: Run homepage tests**

Run:

```bash
npm test -- --run src/app/page.test.tsx
```

Expected: PASS

### Task 3: Turn `/feed` into a categorized search page

**Files:**
- Modify: `src/app/feed/page.tsx`
- Delete: `src/components/filters/feed-filters.tsx`
- Create: `src/components/search/search-results-header.tsx`
- Create: `src/components/filters/feed-filter-drawer.tsx`
- Modify: `src/app/globals.css`
- Test: `src/app/feed/feed-page.test.tsx`

- [ ] **Step 1: Update feed-page test expectations to the new search-result framing**

Cover:

- search result headline/context
- category tabs
- drawer trigger
- intelligence results

Expected: current `/feed` implementation fails.

- [ ] **Step 2: Replace the static filter block with a top drawer client component**

Add a toggle state and render filter groups only when expanded.

Expected: the page defaults to a compact search-result header, not a permanently open filter panel.

- [ ] **Step 3: Add a search header component with tabs and summary context**

Render:

- search input shell
- tabs: `综合 / 情报 / 账号 / 领域 / 问答`
- result count
- sort label
- `更多筛选`

Expected: `/feed` reads as a categorized search page even before all tabs are fully implemented.

- [ ] **Step 4: Keep the intelligence tab as the first complete result mode**

Continue rendering `IntelligenceCard` results in the content area.

Expected: no regression in intelligence result browsing while the outer frame changes.

- [ ] **Step 5: Add placeholder result panels for non-intelligence tabs**

Render concise placeholder messaging such as:

```tsx
<section>账号结果正在接入统一搜索...</section>
```

Expected: tabs are structurally visible without pretending the backend already supports full cross-entity search.

- [ ] **Step 6: Run feed tests**

Run:

```bash
npm test -- --run src/app/feed/feed-page.test.tsx
```

Expected: PASS

### Task 4: Upgrade the topic directory page to match the new hierarchy

**Files:**
- Modify: `src/app/topics/page.tsx`
- Create: `src/components/topics/topic-directory-browser.tsx`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Replace the flat "small topic matrix" with a large-topic / small-topic browser**

Use the same grouped topic data concept as the homepage browser.

Expected: the directory page matches the new product language for topics.

- [ ] **Step 2: Add topic search and selected large-topic state**

Expected: users can find a topic directly instead of scanning only a flat list.

- [ ] **Step 3: Keep latest content and related discussions beneath the browser**

Expected: the directory page still supports discovery beyond structure alone.

- [ ] **Step 4: Manually verify `src/app/topics/[slug]/page.tsx` still feels consistent as the drill-down destination**

Expected: no route breakage and no mismatched terminology.

### Task 5: Final polish and verification

**Files:**
- Modify: `src/components/layout/site-header.tsx`
- Modify: any touched homepage/search files as needed

- [ ] **Step 1: Update navigation labels where needed to reflect the new `/feed` positioning**

For example, consider changing the header label from `情报快讯` to a search/result-oriented label only if the page copy now clearly diverges from a feed.

- [ ] **Step 2: Run targeted tests**

Run:

```bash
npm test -- --run src/app/page.test.tsx src/app/feed/feed-page.test.tsx
```

Expected: PASS

- [ ] **Step 3: Run a broader relevant test sweep**

Run:

```bash
npm test -- --run src/app/topics/topics-page.test.tsx src/app/page.test.tsx src/app/feed/feed-page.test.tsx
```

Expected: PASS or concrete failures limited to touched surfaces.

- [ ] **Step 4: Run lint if the existing project workflow supports it**

Run:

```bash
npm run lint
```

Expected: no new lint errors in touched files.

- [ ] **Step 5: Commit the implementation**

```bash
git add src/app/page.tsx src/app/feed/page.tsx src/app/topics/page.tsx src/lib/content/queries.ts src/app/globals.css src/components/home src/components/search src/components/filters src/components/follows src/components/topics src/app/page.test.tsx src/app/feed/feed-page.test.tsx
git commit -m "feat: redesign homepage and search experience"
```
