# ONSLAUGHT ESPORTS

Website for the ONSLAUGHT (ONS) PUBG esports organization. React + Vite + Tailwind CSS + Framer Motion.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build into dist/
```

## Pages

Home, About, Roster, Achievements, Media, Recruitment, and an admin dashboard at `/admin`
(not linked from the public navigation).

## Content

Public content lives in `src/data/*.js` and is clearly marked as sample data until replaced.
The admin dashboard currently edits a **local draft** in the browser and exports code for these files.
It has no login, so it must not be used for private data until Supabase authentication is connected.

## Supabase (in progress)

Phase 08 (database, authentication, storage and row level security) is being built on the
`phase-08-wip` branch and is **not complete or verified against a real project yet**.
Do not run its migrations on a production database until that work is finished.
Environment variables are listed in `.env.example`. Only the anon key belongs in the front end.
