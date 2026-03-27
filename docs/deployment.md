# Deployment

## Runtime Requirements

- Node.js 22+
- PostgreSQL
- Environment variables from [.env.example](/Users/mzzhang/Documents/eCTD/RegScope/.env.example)

## Required Environment Variables

- `DATABASE_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `REGSCOPE_INGEST_SECRET`

Optional:

- `EMAIL_SERVER`
- `EMAIL_FROM`

## Recommended Deployment Flow

1. Install dependencies with `npm install`.
2. Build the app with `npm run build`.
3. Apply database migrations with `npm run db:migrate`.
4. Load demo data with `npm run db:seed` in non-production or review environments.
5. Start the app with `npm run start`.

## Cron / Scheduled Ingestion

RegScope’s ingestion worker is exposed through `/api/ingest/run`.

Recommended pattern:

- Schedule a `POST` request every 30 to 60 minutes.
- Pass `x-regscope-ingest-secret: $REGSCOPE_INGEST_SECRET`.
- Restrict the secret to operational systems only.

Example:

```bash
curl -X POST \
  -H "x-regscope-ingest-secret: $REGSCOPE_INGEST_SECRET" \
  https://your-regscope-host.example.com/api/ingest/run
```

## Verification Checklist

Before promoting an environment:

```bash
npm run lint
npm run test
npm run test:e2e
```

Also confirm:

- homepage loads with demo or live data
- write APIs reject anonymous requests
- `/me/follows` redirects to sign-in when unauthenticated
- ingestion can be triggered by admin or ingest secret

## Operational Notes

- Keep `NEXTAUTH_SECRET` and `REGSCOPE_INGEST_SECRET` distinct in deployed environments.
- Run `npm run db:seed` only where demo content is appropriate.
- If review environments do not have live feeds yet, the seed dataset is enough for product walkthroughs.
