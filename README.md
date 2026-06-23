# PetVibe — MVP

PetVibe is a lean MVP to help pet parents discover nearby pets, arrange safe local meetups, and build neighborhood pet communities. This repository contains the web PWA prototype built with Next.js; the backend will use Supabase (planned).

This project contains a focused MVP scaffold and supporting design docs in the `docs/` directory covering architecture, requirements, and system design.

## Quick start (development)

Install dependencies and run the dev server:

```bash
npm install
npm run dev
```

Open http://localhost:3000 to view the app.

## What you'll find here

- `src/app` — Next.js App Router UI and pages
- `docs/` — design docs (architecture, requirements, system design)

## Docs to read first

- `docs/REQUIREMENTS.md` — functional + non-functional requirements and MVP acceptance criteria
- `docs/ARCHITECTURE.md` — high-level system architecture and component interactions
- `docs/SYSTEM_DESIGN.md` — database schema, API patterns, and privacy/contact flows

## Contributing and development notes

- We follow a modular, feature-first approach: group code by feature (auth, profiles, pets, matches, locations) to keep boundaries clear and make it easy to work in parallel.
- Keep the MVP minimal: image-based discovery, match flow, and opt-in contact sharing. Defer heavy features (video, full chat) to later phases.

## Next actions

If you want me to continue, I can:

- Provision a Supabase project and create the initial DB schema
- Implement auth and pet profile CRUD
- Add discovery feed and match flow

The core docs have been added to `docs/` for review.
