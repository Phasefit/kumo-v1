# Kumo v1

Kumo is an interactive learning app for Norwegian beginners learning Japanese, Turkish and Albanian.

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

1. Verify Supabase RLS and policies.
2. Establish browser-flow regression coverage.
3. Reduce technical debt in `app.js` and the bundled Supabase runtime.
4. Add CI for syntax and tests.
5. Improve release/cache versioning.
6. Then expand product functionality.

## Branching

Feature and maintenance work should be developed on branches and merged into `main` after checks pass.
