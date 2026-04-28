---
phase: 02-app-shell-home-screen
plan: 02
subsystem: ui
tags: [vanilla-js, routing, event-delegation, es-modules, xss-prevention]

requires:
  - phase: 02-01
    provides: "muscleGroups export, home/exercise CSS classes, English test schema"
  - phase: 01-02
    provides: "exercises.js with 7 group keys and exercise data"

provides:
  - escapeHtml utility (XSS-safe string coercion, exported)
  - pickRandom utility (bounded Fisher-Yates partial shuffle, non-mutating, exported)
  - workoutDays array with 4 routines and build() methods (exported)
  - renderHome() screen renderer (2x2 routine-grid with data-routine-id tiles)
  - renderExercise() screen renderer (exercise header, back button, placeholder)
  - Client-side routing state (currentScreen + currentRoutine)
  - Event delegation on #app (tile navigation + back button)
  - DOM bootstrap guard (typeof document !== 'undefined') for Node.js compatibility

affects: [03-exercise-cards, 04-exercise-library]

tech-stack:
  added: []
  patterns:
    - "DOM bootstrap guard pattern: wrap all document.* calls in typeof document !== 'undefined'"
    - "Event delegation: single click listener on #app container, closest() for routing"
    - "Injectable RNG pattern: pickRandom accepts randFn param for deterministic testing"
    - "escapeHtml piped through all dynamic values before innerHTML injection"

key-files:
  modified:
    - js/app.js

key-decisions:
  - "DOM bootstrap guard added (not in plan) — required for Node.js test runner compatibility since app.js is imported by test/app.test.js which runs in Node where document is undefined"
  - "day4 builds 3 legs exercises (not 6) — test contract in test/app.test.js asserts day4: { legs: 3 }; plan spec had a discrepancy; test is authoritative"

patterns-established:
  - "DOM guard: typeof document !== 'undefined' wraps all browser-only code in app.js — maintains testability"
  - "All innerHTML injection goes through escapeHtml() — established as the XSS prevention pattern for this app"

requirements-completed: [NAV-01, NAV-02, NAV-03, DSNG-06, DSNG-07]

duration: ~6min
completed: "2026-04-25"
---

# Phase 02 Plan 02: App Shell and Routing Summary

**Vanilla JS app shell with client-side routing, escapeHtml/pickRandom/workoutDays exports, and 4-screen navigation via event delegation — all three test-required exports passing in Node.js test runner.**

## Performance

- **Duration:** ~6 min
- **Started:** 2026-04-25T02:00:00Z
- **Completed:** 2026-04-25T02:06:00Z
- **Tasks:** 1 (Task 2 is a human-verify checkpoint — not executed)
- **Files modified:** 1

## Accomplishments

- Complete `js/app.js` rewrite replacing the Phase 1 stub
- Three test-required exports (`escapeHtml`, `pickRandom`, `workoutDays`) passing in `node --test`
- Client-side routing with two screen states (`home` / `exercise`) using event delegation
- DOM calls guarded for Node.js compatibility, preserving import-ability from test runner

## Task Commits

1. **Task 1: Rewrite js/app.js — utilities, workoutDays, routing, renderers, event delegation** - `96118a9` (feat)

## Files Created/Modified

- `js/app.js` — Complete Phase 2 implementation: utilities, workoutDays, renderHome(), renderExercise(), routing state, event delegation, DOM bootstrap guard

## Decisions Made

- **DOM bootstrap guard** — `if (typeof document !== 'undefined')` wraps all browser-only code. Not in the plan spec but required because `test/app.test.js` imports from `app.js` directly in Node.js where `document` is undefined. Without the guard, all 6 tests crash at module load time.
- **day4 uses 3 legs exercises, not 6** — The plan spec under `<interfaces>` stated `day4: { legs: 6 }`, but the actual test file (updated in 02-01) asserts `day4: { legs: 3 }`. The test is the authoritative API contract; the spec had a stale value.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] DOM bootstrap guard for Node.js test runner compatibility**
- **Found during:** Task 1 (verification run)
- **Issue:** `document.getElementById('app').addEventListener(...)` and `render()` called at module scope. When `test/app.test.js` imports `app.js` in Node.js, `document` is undefined — crashes all 6 tests before any can run.
- **Fix:** Wrapped event delegation listener and initial `render()` call in `if (typeof document !== 'undefined') { ... }` block. Utilities and `workoutDays` remain unconditionally available for import.
- **Files modified:** js/app.js
- **Verification:** `node --test` — 4 tests PASS, 2 fail for unrelated expected reasons (Phase 4 count, Phase 3 SVG IDs)
- **Committed in:** 96118a9

**2. [Rule 1 - Bug] day4 exercise count corrected to 3 (not 6)**
- **Found during:** Task 1 (reading test/app.test.js before implementation)
- **Issue:** Plan spec said `day4: { legs: 6 }` but the test contract (updated in 02-01) asserts `day4: { legs: 3 }` with `Object.values(expected[day.id]).reduce()` computing the expected total.
- **Fix:** `workoutDays[3].build()` calls `pickRandom(exercises.legs, 3)` instead of 6.
- **Files modified:** js/app.js
- **Verification:** `workout days build the expected muscle-group mix` test PASSES
- **Committed in:** 96118a9

---

**Total deviations:** 2 auto-fixed (both Rule 1 — bugs/inconsistencies caught before or during verification)
**Impact on plan:** Both fixes essential for test correctness. No scope creep. The plan's core objective fully delivered.

## Issues Encountered

None beyond the two auto-fixed deviations above.

## User Setup Required

None — no external services, no environment variables.

## Verification Results

| Check | Result |
|-------|--------|
| `node --check js/app.js` | PASS — exit 0 |
| `export function escapeHtml` present | PASS |
| `export function pickRandom` present | PASS |
| `export const workoutDays` present | PASS |
| No `fetch(` calls | PASS |
| `getElementById('app').addEventListener` present | PASS |
| Test: `escapeHtml encodes dynamic text` | PASS |
| Test: `pickRandom Fisher-Yates, never mutates` | PASS |
| Test: `workout days build expected muscle-group mix` | PASS |
| Test: `exercise database has complete definitions` | FAIL (expected — Phase 4: 21 exercises, needs 108) |
| Test: `exercise SVG internals namespaced by id` | FAIL (expected — Phase 3/4: old Spanish IDs) |

## Next Phase Readiness

- `js/app.js` is the complete Phase 2 app shell — routing and renderers in place
- Human visual verification checkpoint (Task 2) is pending — user must open `index.html` in a browser to confirm the home screen renders and navigation works
- Phase 3 can begin after checkpoint approval: exercise cards, SVG illustrations, Regenerate button

## Known Stubs

- `.placeholder-text` in `renderExercise()` — "Exercises will appear here in Phase 3." This is an intentional documented stub; Phase 3 plan replaces it with actual exercise cards.

## Threat Flags

None. No new network endpoints, auth paths, file access patterns, or schema changes introduced. `escapeHtml` mitigates T-02-03 (Injection threat on innerHTML injection). T-02-04 and T-02-05 accepted per threat model.

## Self-Check: PASSED

- `js/app.js` exists at correct path — FOUND
- Commit 96118a9 exists — FOUND
- `node --check js/app.js` exits 0 — VERIFIED
- 3 required exports present — VERIFIED
- 3 target tests passing — VERIFIED

---
*Phase: 02-app-shell-home-screen*
*Completed: 2026-04-25*
