# RegScope

RegScope is a Chinese-first regulatory intelligence MVP for tracking global pharma updates across official sources, countries, topics, and conclusion-oriented discussions.

## Stack

- Next.js 15 App Router
- TypeScript + React 19
- Prisma + PostgreSQL
- Auth.js
- Vitest + Testing Library
- Playwright

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables from [.env.example](/Users/mzzhang/Documents/eCTD/RegScope/.env.example) into `.env.local` or `.env`.

3. Start a local PostgreSQL database and set `DATABASE_URL`.

4. Apply migrations:

```bash
npm run db:migrate
```

5. Seed demo data:

```bash
npm run db:seed
```

6. Start the app:

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

## Environment Variables

- `DATABASE_URL`: PostgreSQL connection string. Required for Prisma queries, migrations, and seed data.
- `NEXTAUTH_URL`: Public app URL used by Auth.js.
- `NEXTAUTH_SECRET`: Shared Auth.js signing secret.
- `REGSCOPE_INGEST_SECRET`: Shared secret for the manual ingest endpoint.
- `EMAIL_SERVER`: Optional email provider connection string.
- `EMAIL_FROM`: Optional sender address for email login.

## Common Commands

```bash
npm run lint
npm run test
npm run test:e2e
npm run db:migrate
npm run db:seed
npm run ingest
```

## Prisma Workflow

- Update [prisma/schema.prisma](/Users/mzzhang/Documents/eCTD/RegScope/prisma/schema.prisma)
- Run `npm run db:migrate`
- Re-run `npm run db:seed` if demo data needs to match the new schema

## Seed Data

The seed script loads:

- 8 top-level topics and representative subtopics
- 6 countries or regions
- 6 official sources
- 16 demo content items
- 5 discussions with conclusions, evidence, and answers

This dataset is intentionally rich enough to support homepage, directory, feed, and discussion review in local environments before live ingestion is stable.

## Ingestion

Run the local ingestion worker with:

```bash
npm run ingest
```

For manual operational triggering, send a `POST` request to `/api/ingest/run` with either:

- an authenticated admin session
- the `x-regscope-ingest-secret` header matching `REGSCOPE_INGEST_SECRET`

## Route Protection

- Public browsing pages remain open.
- `/me/follows` requires login and redirects anonymous users to Auth.js sign-in.
- Write APIs require authentication.
- `/api/ingest/run` requires either admin access or the ingest secret header.

## Deployment Notes

Deployment and cron guidance lives in [docs/deployment.md](/Users/mzzhang/Documents/eCTD/RegScope/docs/deployment.md).
