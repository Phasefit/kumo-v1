# Kumo v1

Kumo is an interactive learning app for Norwegian beginners learning Japanese.

## Current architecture

Kumo is a browser-first static web application backed by Supabase:

- `index.html` — application shell and views
- `app.js` — application orchestration and UI logic
- `styles.css` — visual system
- `data/courseContent.js` — local course content and fallbacks
- `services/` — authentication, profile, course, lesson and progress services
- `lib/supabaseClient.js` — Supabase client configuration
- `lib/supabase-v2.js` — bundled Supabase runtime
- `service-worker.js` — PWA caching and updates
- `manifest.webmanifest` — install metadata

## Development

No framework or package manager is required to serve the current application. A static HTTP server is sufficient.

Node.js 20+ is used for project checks:

```bash
npm test
npm run check:syntax
npm run check
```

The checks are intentionally dependency-free and can run in CI without installing third-party packages.

## Configuration

Runtime configuration lives in `config/runtime-config.js`.

The browser may contain a Supabase publishable/anon key. Database authorization must therefore be enforced with Supabase Row Level Security (RLS) and policies. Never place a Supabase service-role key in this repository.

## Hardening roadmap

The initial hardening work has established automated checks, CI, service-worker cache versioning, and incremental state/storage boundaries. The state/storage extraction is complete; see [`docs/state-refactor.md`](docs/state-refactor.md).

Current focus: finish V1.2 by reviewing the full Attempt → Result → Progress → Review → Next Action journey and fixing any specific data or learning-logic gaps found. After that, update the phase status before selecting V1.3 product-experience work.

## Branching

Feature and maintenance work should be developed on branches and merged into `main` after checks pass.
