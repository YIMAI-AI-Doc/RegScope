# RegScope Homepage and Search Architecture Design

## Context

The current site framework is in place, but multiple sections reuse near-identical card treatments, which weakens information hierarchy. The product needs clearer separation between three primary content systems:

1. Intelligence content
2. Followable accounts and hierarchical topics
3. Discussion and Q&A

The existing `IntelligenceCard` and tag system are good and should be preserved. The current `/feed` page should be repositioned from a generic "intelligence feed" into the search-result category page, with a hidden expandable filter area inspired by the Bilibili search interaction shared by the user.

## Approved Direction

The user approved the following structural choices during brainstorming:

- Homepage uses three parallel primary sections instead of an entry-first subscription dashboard.
- The "accounts and topics" area stays in one homepage section, split vertically into `accounts` and `topics`.
- The `/feed` search-result page uses a top expandable filter drawer instead of a left sidebar.

## Goals

- Make the homepage immediately communicate the site's three primary content modes.
- Keep intelligence content visually strong and distinct from account and discussion surfaces.
- Turn accounts into clear followable objects.
- Turn topics into a clear large-topic / small-topic exploration system.
- Preserve the existing tag-based scanning experience across content, discussions, and results.
- Reuse the current route skeleton and follow system where possible.

## Non-Goals

- No database schema redesign.
- No follow backend redesign.
- No attempt to deliver full cross-entity search relevance in the first pass.
- No merge of accounts and topics into a single card type.

## Information Architecture

### Homepage

The homepage becomes a structured overview with three primary blocks:

1. `Intelligence`
2. `Accounts and Topics`
3. `Discussion and Q&A`

This replaces the current mixed composition of alert strip, small-card matrices, and trend modules as the dominant information hierarchy.

### Search / Feed Page

`/feed` becomes the categorized search result page. It is no longer positioned as only a fast news stream. Instead, it supports:

- search input context
- category tabs such as `综合 / 情报 / 账号 / 领域 / 问答`
- result counts and sort controls
- a hidden top filter drawer for the intelligence tab

### Existing Detail Pages

Existing detail pages remain the drill-down destinations:

- account-like entities continue to use `/sources/[slug]` and `/countries/[slug]`
- topic entities continue to use `/topics/[slug]`
- discussions continue to use `/discussions/[slug]`
- content items continue to use `/content/[slug]`

This keeps the routing model stable while improving the way entry pages organize the user journey.

## Page Design

### 1. Homepage: Intelligence Section

The first major homepage section remains content-led and uses the existing large intelligence card treatment based on the approved visual reference.

Requirements:

- keep the strong cover + metadata + tag structure
- show a limited set of high-value items rather than a large repetitive grid
- preserve content tags such as source, topic, and type
- allow tags to continue acting as drill-down or filtering affordances

Purpose:

- act as the homepage's highest-signal content zone
- establish recency, authority, and breadth at a glance

### 2. Homepage: Accounts and Topics Section

This is a single homepage block with two vertically stacked subsections.

#### Accounts

This subsection represents followable objects such as:

- countries
- regions where applicable through country-style entities
- official sources / official accounts

Each account card should communicate:

- name
- entity type
- short description or note
- follow action
- recent activity count or freshness cue

Click behavior:

- source cards route to `/sources/[slug]`
- country cards route to `/countries/[slug]`

Follow behavior:

- reuse the existing follow model with `SOURCE` and `COUNTRY`

#### Topics

This subsection represents structured knowledge domains rather than accounts.

The experience has two layers:

- large-topic selector
- small-topic results area below it

Interaction model:

- show large topics as prominent chips or pills
- clicking a large topic reveals the small topics under it
- provide a topic-only search field to find topics worth following
- clicking a small topic routes to `/topics/[slug]`
- small topics can also expose follow actions

Data model note:

The current `Topic` model already has `parentId` and `level`, so this hierarchy can be driven without schema changes.

### 3. Homepage: Discussion and Q&A Section

This section should visually diverge from intelligence cards and read as a conclusion-oriented summary list.

Each item should emphasize:

- status
- title
- summary
- current conclusion
- answer count
- evidence count
- tags

Purpose:

- make discussions feel like a distinct knowledge workflow
- surface conclusion quality instead of article-style content cards

## Search Result Page Design

### Search Header

The top of `/feed` should include:

- search box
- category tabs
- result count
- sorting controls
- a `more filters` trigger

The page should feel like a content search surface, not an admin dashboard.

### Hidden Expandable Intelligence Filters

The intelligence result view uses a top filter drawer.

Requirements:

- collapsed by default
- expands from the top of the results area
- visually aligned with the Bilibili-like reference shared by the user
- preserves screen space for the result grid when closed

Initial filter groups:

- sort
- date or time range
- country / region
- source
- topic
- content type

The current tag-driven filtering remains valid, but the layout shifts from always-visible grouped pills to an expandable drawer.

### Result Modes by Tab

The categorized result page should not render all result types with the same card style.

- `情报` uses intelligence cards
- `账号` uses account-style cards
- `领域` uses large-topic / small-topic or topic-oriented result cards
- `问答` uses discussion summary cards

The first implementation pass may keep the intelligence tab as the primary complete experience while establishing the structural shell for the other tabs.

## Component Strategy

### Reuse

Keep and reuse:

- `src/components/cards/intelligence-card.tsx`
- existing content detail routes
- existing source, country, topic, and discussion routes
- existing follow API and follow center
- existing tag treatment across content and discussions

### Replace or Demote

Homepage modules such as the current follow center summary and trending panel should no longer define homepage structure. They can be removed from the homepage or reduced to secondary supporting roles.

### New UI Responsibilities

The redesign should introduce focused homepage and search components instead of continuing to stretch generic card sections.

Expected responsibilities include:

- homepage intelligence section
- homepage account cards
- homepage topic browser
- homepage discussion summary section
- search result header with category tabs
- top expandable filter drawer

## Data and Query Implications

### Homepage Query Shape

The current homepage data shape groups sources, countries, and topics as separate small-card lists. That should evolve toward a structure that matches the new product language:

- featured intelligence
- accounts
- topic groups
- discussion highlights

This is a query-shape refactor, not a schema refactor.

### Search Query Shape

The current `/feed` query returns intelligence items plus static filter groups. It should evolve toward a broader search-result payload that can support:

- search context
- active tab
- intelligence results
- account results
- topic results
- discussion results
- drawer filter options

The first milestone can stop short of full multi-entity ranking as long as the page shell and interaction model are correct.

## Error Handling and Empty States

- if no topic children exist for a selected large topic, show an explicit empty state instead of a blank panel
- if the user is not authenticated, account and topic follow buttons should degrade to sign-in or a non-destructive prompt
- if search yields no results, keep the selected tab and visible query context so the user can refine instead of restarting
- if the filter drawer is open with no active filters, the default selections should still be obvious

## Responsive Behavior

- homepage sections should remain visually distinct on mobile and not collapse into an undifferentiated stack of cards
- the accounts-and-topics block should keep the vertical logic on mobile
- the top filter drawer should remain usable on narrow screens and not depend on a permanent sidebar
- card density should reduce on mobile rather than preserving desktop repetition

## Testing Expectations

The redesign should update or add tests that cover:

- homepage renders the three approved primary sections
- accounts and topics are both visible in the second homepage block
- topic browser reveals small topics from a selected large topic
- `/feed` renders search-result framing instead of only a feed title
- the intelligence filter drawer can be toggled
- key preserved tags still render on intelligence and discussion surfaces

## Implementation Notes

Recommended delivery order:

1. Rebuild homepage structure around the three primary sections.
2. Add the account and topic subsection behaviors.
3. Reframe `/feed` as a categorized search page with top expandable filters.
4. Update tests and visual polish.

## Success Criteria

- The homepage no longer feels like repeated card sections with minor label changes.
- A new user can distinguish intelligence, accounts/topics, and discussions immediately.
- Accounts clearly behave like followable objects.
- Topics clearly behave like hierarchical domains.
- The `/feed` page reads as a search result page with hidden expandable filters.
- Existing tag richness remains visible across content and discussions.
