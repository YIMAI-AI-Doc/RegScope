# Account Menu Follow Entry Consolidation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans (inline) or superpowers:subagent-driven-development (recommended) to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Route the top “关注” stat card in the account popover to `/me/follows` and remove the three follow-related cards, without changing the stat row layout.

**Architecture:** Small UI adjustment inside `AccountMenu`: convert the “关注” stat tile into a link-like control with keyboard support; prune three JSX blocks in the authenticated section; preserve existing layout containers and dividers.

**Tech Stack:** Next.js (app router), React client component, inline styles.

---

### Task 1: Add navigation + a11y to “关注” stat card

**Files:**
- Modify: `src/components/layout/account-menu.tsx` (Stat component + usage in stats grid)
- Test (manual): account popover interaction in browser

- [ ] **Step 1: Locate Stat usage** in the stats grid (three columns “关注/回答/讨论”).
- [ ] **Step 2: Extend Stat props** to accept optional `href` and `onClick` so it can act as a link.
- [ ] **Step 3: Make Stat focusable/clickable** when `href` provided:
  - Add `role="link"`, `tabIndex={0}`, `aria-label="管理关注"`.
  - Add pointer cursor and focus ring consistent with design.
  - On click or Enter/Space, call `router.push(href)` (use `useRouter` in parent, pass handler down).
- [ ] **Step 4: Wire “关注” tile** with `href="/me/follows"` and handler; keep other tiles unchanged.
- [ ] **Step 5: Manual test**:
  - Open account popover as logged-in user; hover shows pointer.
  - Click “关注” navigates to `/me/follows`.
  - Keyboard Tab to “关注”, press Enter/Space → navigates.
  - “回答/讨论” remain inert.

### Task 2: Remove redundant follow cards

**Files:**
- Modify: `src/components/layout/account-menu.tsx` (authenticated section JSX)

- [ ] **Step 1: Delete JSX blocks** for:
  - “关注中心” description + “管理关注” button.
  - “关注管理” card.
  - “讨论问答” card.
- [ ] **Step 2: Keep surrounding structure**:
  - Preserve the divider lines and remaining menu rows.
  - No padding/spacing change to the top stats row.
- [ ] **Step 3: Manual visual check**:
  - Popover shows stats row, divider, then remaining items (主题 row, logout button, etc.).
  - No empty gap where cards were.

### Task 3: Sanity and regression checks

**Files:**
- Verify: `src/components/layout/account-menu.tsx`
- Optional: run lint/tests if fast

- [ ] **Step 1: `npm test -- --runInBand` or `npm run lint`** (optional if slow; prioritize smoke in UI).
- [ ] **Step 2: Final manual UX pass**:
  - Popover closes on navigation click.
  - Unauthenticated state unchanged.
- [ ] **Step 3: Stage changes** for review/commit.

---

Plan written from spec: `docs/superpowers/specs/2026-04-01-account-menu-follow-card-design.md`.
