# Account Menu – Follow Entry Consolidation

**Date:** 2026-04-01  
**Owner:** Codex (with user)  
**Page:** `src/components/layout/account-menu.tsx`  
**Goal:** Simplify the account popover by moving all “关注” access into the top stat card and removing redundant follow-related cards, while keeping the layout and spacing unchanged.

## Context
- The account popover currently shows a top stats row (关注/回答/讨论) and, for logged-in users, three follow-related blocks below: “关注中心” description + button, “关注管理” card, and “讨论问答” card.
- User request: click the top “关注” stat to go to `/me/follows`; remove the three lower cards entirely; do not alter the spacing or sizing of the top stat cards.

## Decisions
1) **Primary entry:** Make the “关注” stat card act as a link to `/me/follows`, with pointer/focus affordance and keyboard activation.
2) **Removals:** Delete the three follow-related blocks in the authenticated section (description block, “关注管理”, “讨论问答”). Keep surrounding dividers and other menu content as-is.
3) **Unauthenticated state:** No change; follow login flow remains unchanged.
4) **A11y:** Add `role="link"`, `tabIndex=0`, `aria-label="管理关注"` to the “关注” card; enter/space triggers navigation.

## Acceptance Criteria
- Clicking or pressing Enter/Space on the “关注” stat card navigates to `/me/follows`.
- The three follow-related blocks no longer render when authenticated.
- The top stats row layout and spacing remain unchanged; no new elements are added in their place.
- Unauthenticated experience is unchanged.

## Out of Scope
- Any redesign of the popover, additional shortcuts, or copy changes.
- Metrics/logging for the interaction.

