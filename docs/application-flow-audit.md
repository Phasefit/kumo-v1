# Application flow audit

## Scope

Audited `app.js` as the current application orchestrator.

## Current flow

```
bootstrapAuthentication()
  -> auth service session
  -> hydrateAuthenticatedApp()
  -> loadCourseAndProgress()
  -> render dashboard / learning views

Learning:
course
  -> lesson
  -> local state mutation
  -> persistState()
  -> progress service / Supabase

Quiz:
startQuiz()
  -> answerQuiz()
  -> finishQuiz()
  -> saveQuizResult()

Logout:
logout()
  -> flushProgress()
  -> auth.signOut()
```

## Findings

- `app.js` is 2,183 lines and contains roughly 91 named functions.
- It is doing multiple responsibilities: state management, routing/view switching, rendering, learning logic, quiz logic, speech, PWA lifecycle, authentication UI, persistence and progress calculations.
- The service boundary is useful: Supabase access is delegated through `window.KumoServices` rather than being spread throughout the UI.
- The application has explicit hydration and persistence paths, including a pagehide flush and online reconnect handling.
- User-controlled strings are frequently passed through `escapeHtml()` before being inserted into HTML. This should remain a rule during future refactors.
- The application uses localStorage as a cache/state layer. This should be treated as a client cache, not as an authorization or source-of-truth boundary.
- The existing code should not be rewritten wholesale. Incremental extraction is safer.

## Refactor plan

Extract responsibilities in this order:

1. `app/state.js` — state model, validation, cache keys and persistence coordination.
2. `app/navigation.js` — view switching and navigation event wiring.
3. `features/quiz.js` — quiz state, rendering and scoring.
4. `features/learning.js` — daily lesson, words, grammar and alphabet practice.
5. `features/progress.js` — dashboard/progress rendering and calculations.
6. `features/speech.js` — audio and speech recognition.
7. Keep `app.js` as a thin bootstrap/composition layer.

Do not extract all modules in one change. Each extraction should preserve the existing browser behavior and pass the automated checks.
