# Supabase / RLS audit

## Scope

The frontend accesses these tables:

### User-owned data
- `profiles`
- `user_progress`
- `lesson_progress`
- `quiz_results`
- `difficult_words`

### Course/content data
- `courses`
- `levels`
- `lessons`
- `vocabulary`
- `grammar_notes`
- `exercises`

## Required security boundary

The browser uses a Supabase publishable/anon key. Therefore authorization must be enforced by Supabase Row Level Security (RLS). Frontend filters such as `.eq("user_id", userId)` are not a security boundary.

For every user-owned table, verify:
1. RLS is enabled.
2. Authenticated users can access only rows belonging to `auth.uid()`.
3. Anonymous users cannot read or write user-owned rows.
4. INSERT policies require the inserted `user_id` to equal `auth.uid()`.
5. UPDATE policies protect both the existing row owner and the new owner value.
6. DELETE policies require ownership.
7. No broad `using (true)` / `with check (true)` policy exists on user-owned tables.
8. No service-role key is exposed to the browser.

## Table-specific checks

### profiles

Expected ownership condition:
`id = auth.uid()`

The frontend reads and updates a profile by the authenticated user's ID.

### user_progress

Expected ownership condition:
`user_id = auth.uid()`

The natural uniqueness boundary is `user_id + course_id`.

### lesson_progress

Expected ownership condition:
`user_id = auth.uid()`

The frontend performs upserts and deletes for the current user's lessons.

### quiz_results

Expected ownership condition:
`user_id = auth.uid()`

Quiz answers may contain user activity data and should not be readable by other users.

### difficult_words

Expected ownership condition:
`user_id = auth.uid()`

The frontend reads, inserts, updates and deletes these rows.

## Course/content tables

Course content is intentionally shared between users. If these tables are publicly readable, SELECT may be allowed for anonymous users.

Writes should normally be restricted to trusted/admin/service-role access and must not be exposed through the browser.

At minimum, verify that ordinary authenticated clients cannot INSERT, UPDATE or DELETE course content.

## Important application observation

`services/progressService.js` accepts a `userId` argument from the application layer. This is acceptable only because RLS must independently enforce ownership.

Do not rely on the frontend value being correct.

## What is still required

The repository does not contain a Supabase migration/schema/policy directory. This means the exact live RLS policies cannot be verified from GitHub alone.

Before changing database policies, export or inspect the live Supabase schema and policies. Then compare the result against this document.

Do not disable RLS as a workaround for application errors.

## Audit result – 2026-09-16

The live policy output supplied from the Supabase SQL Editor contains 26 policies.

### User-owned tables

The following tables have complete SELECT/INSERT/UPDATE/DELETE ownership policies for the authenticated role:

- `profiles` — ownership enforced with `auth.uid() = id`.
- `user_progress` — ownership enforced with `auth.uid() = user_id`.
- `lesson_progress` — ownership enforced with `auth.uid() = user_id`.
- `quiz_results` — ownership enforced with `auth.uid() = user_id`.
- `difficult_words` — ownership enforced with `auth.uid() = user_id`.

For INSERT, `WITH CHECK` requires the inserted owner to match `auth.uid()`.
For UPDATE, both `USING` and `WITH CHECK` enforce ownership.
For DELETE and SELECT, `USING` enforces ownership.

No broad `USING (true)` policy was observed on these user-owned tables in the supplied output.

### Shared course/content tables

The following tables have authenticated SELECT policies using `true`:

- `courses`
- `levels`
- `lessons`
- `vocabulary`
- `grammar_notes`
- `exercises`

No INSERT, UPDATE or DELETE policies for the authenticated role were present in the supplied output.

### Remaining verification

The policy list strongly indicates the intended ownership model is correctly configured, but the output does not itself prove that RLS is enabled on every table. Run the RLS-status query from the audit procedure and verify `rowsecurity = true` for all user-owned tables.

Also verify whether anonymous/public access is intentionally disabled for user-owned data. The policies shown are scoped to `authenticated`, which is correct, but explicit table-level RLS status should still be confirmed.
