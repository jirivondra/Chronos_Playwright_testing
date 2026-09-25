# Serial Execution For Shared Backend State

Playwright runs with `fullyParallel: true` (see `playwright.config.ts`), so individual tests — even from different `describe` blocks in the same file — can be scheduled onto different workers and execute at the same time. All of them hit the same backend (`API_BASE_URL`), which is not reset or isolated per worker.

This setting is not something introduced for any specific feature — it has been in `playwright.config.ts` since the project's first commit and is Playwright's own scaffolded default. It was harmless until a test came along that reads an aggregate over the whole shared dataset (see below); nothing about parallelism itself needs to change, only how those specific tests are grouped.

Most tests are safe under this model because they only touch data they created themselves (e.g. `newTaskPage` creates a task and tears it down via `deleteTaskByTitle`). Some assertions are not safe: they read an **aggregate** over the whole shared dataset — a total count, a percentage, "is the list empty" — rather than a single task they own. If another worker creates or deletes a task via the API at the same moment, the aggregate can change between the page's DOM snapshot and the API call the test compares it against, and the test fails on data it never touched.

## Symptom

A test fails intermittently only when the full suite runs in parallel, passes every time when run alone or with `--workers=1`, and the failure is a count/percentage/visibility mismatch rather than a broken locator or timeout.

```
npx playwright test tests/regression/dashboard_page.spec.ts --project=chromium         # sometimes fails
npx playwright test tests/regression/dashboard_page.spec.ts --project=chromium --grep "..." # always passes alone
```

## Example: Pulse and Upcoming widgets

`DashboardPage.checkPulseStats()` re-visits the page, then fetches `/todos` and computes `%`/`count` over **every** todo in the backend — not just ones the test created. `countUpcomingTasks()` (used in a `beforeEach`) does the same for the 7-day due-date window. Meanwhile, `Atomic Tests For Upcoming Task Behavior` creates and deletes due-dated tasks via the API in every test. Running these `describe` blocks in parallel races the mutation against the aggregate read:

```ts
// tests/regression/dashboard_page.spec.ts
test.describe.serial('Serial Tests For Pulse And Upcoming Widgets', () => {
  test.describe("Atomic Tests For Today's Pulse", () => {
    /* checkPulseStats() reads totals over ALL todos */
  })

  test.describe('Atomic Tests For Upcoming', () => {
    /* countUpcomingTasks() reads the due-date window over ALL todos */
  })

  test.describe('Atomic Tests For Upcoming Task Behavior', () => {
    /* creates/deletes due-dated todos via the API in every test */
  })
})
```

`test.describe.serial(name, callback)` forces every test inside — including nested `describe` blocks — onto the same worker, in declaration order, with no interleaving from other tests in the same group. It does **not** protect against tests outside the serial group; those can still run concurrently and mutate shared state.

## Decision rule

| Situation                                                                                   | Use                                                                  |
| ------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| Test only asserts on data it created and tears down itself                                  | Default parallel — no `serial` needed                                |
| Test reads an aggregate (total count, %, "list empty") over the whole shared dataset        | Candidate for `serial`, grouped with whatever mutates that aggregate |
| Two or more `describe` blocks both read/write the same aggregate and have raced in practice | Wrap them together in one `test.describe.serial(...)`                |

## Rules

- Reach for `serial` only after reproducing the flake (run the file repeatedly without `--grep`, e.g. `for i in 1 2 3; do npx playwright test <file>; done`) — don't apply it preemptively to every new widget test.
- Keep the serial group as small as possible: only the `describe` blocks that actually race against each other. Serial execution loses parallelism, so wrapping unrelated blocks "just in case" slows the suite for no benefit.
- Prefer fixing the root cause first if it's cheap (e.g. scope the aggregate to tasks the test owns instead of all of them). Reach for `serial` when the assertion is inherently about the whole shared dataset and can't be scoped down.
- A `test.describe.serial(...)` wrapper is a structural grouping only — it does not need to follow the `'Atomic Tests For [Section]'` / `'E2E Test For [Page]'` naming convention from `test-structure.md`; name it after what it's serializing.
- Leave a short comment above the `serial` wrapper stating which reads race against which mutations — the need for it is not obvious from the code alone.
