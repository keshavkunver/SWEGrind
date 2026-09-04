# SWE Grind

Personal learning dashboard for an 8-week software engineering plan: roadmap,
interview prep by pattern, system design topics, the Life Companion project,
notes, and resources. Next.js App Router + TypeScript + Tailwind + Prisma +
Supabase (Postgres + Auth).

## Run it locally

```bash
npm install
npx supabase start   # local Postgres + Auth (needs Docker)
npm run db:setup     # create tables + row level security
npm run dev
```

Open http://localhost:3000, create an account, and the full curriculum
(8-week roadmap, 12 interview patterns with curated LeetCode problem sets,
15 system design topics, 18 project milestones, starter resources) seeds
itself on first sign-in.

## Configuration (.env)

Copy `.env.example` to `.env`:

- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`:
  which Supabase project handles **auth**. Legacy
  `NEXT_PUBLIC_SUPABASE_ANON_KEY` JWTs also work. Hosted projects require
  email confirmation on sign-up by default.
- `DATABASE_URL`: where Prisma stores **data**. To use the hosted project:
  Dashboard → Connect → ORMs (Prisma), paste the pooled connection string,
  then `npm run db:setup`.

The local Supabase stack for this repo runs on remapped ports (API 54331,
DB 54332) so it can coexist with other local Supabase projects.

## Deploying to Vercel

1. Point `DATABASE_URL` at the hosted Supabase project and run
   `npm run db:setup` once (creates tables + RLS).
2. Import the GitHub repo in Vercel and set three env vars:
   `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`,
   `DATABASE_URL` (the pooled string). `prisma generate` runs automatically
   via the postinstall script.
3. In Supabase: Authentication → URL Configuration → set the site URL to
   the Vercel domain so confirmation emails link to the deployed app.

## Features worth knowing about

- **Course model:** the curriculum is read-only content; learners only
  cycle statuses, rate confidence, write notes, and track their own
  project milestones.
- **Spaced repetition:** completing a problem schedules review +3 days,
  a system design topic +7. Due items show Again / Good / Easy on the
  dashboard, stepping through a 1 / 3 / 7 / 14 / 30 / 60 day ladder.
- **Phone-friendly:** bottom tab navigation on mobile, and a web manifest
  so the site can be added to the home screen and opened like an app
  (share menu → Add to Home Screen). Data lives in Supabase, so progress
  syncs across devices automatically; sign in from any of them.
- **Row level security:** `prisma/rls.sql` locks Supabase's REST API down
  to owner-only rows; the app itself scopes every query by user in
  `lib/actions.ts`.

## How it's organized

- `app/` — one folder per section; all server components + server actions,
  no client-side data fetching.
- `lib/actions.ts` — every mutation; each one resolves the signed-in user
  and scopes writes by `userId`.
- `lib/curriculum.ts` — the seed curriculum; `lib/seed-user.ts` applies it
  to a new account on first dashboard load.
- `prisma/schema.prisma` — data model; status/category/confidence values
  are documented in `lib/constants.ts`.
- `middleware.ts` — session refresh + login gate for every route.
