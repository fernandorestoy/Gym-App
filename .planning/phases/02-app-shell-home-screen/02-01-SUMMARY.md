---
phase: 02-app-shell-home-screen
plan: 01
subsystem: data-and-styles
tags: [css, exercises, tests, home-screen, exercise-screen]
dependency_graph:
  requires: [01-01, 01-02]
  provides: [muscleGroups-export, home-screen-css, exercise-screen-css, clean-test-baseline]
  affects: [js/exercises.js, css/styles.css, test/app.test.js]
tech_stack:
  added: []
  patterns: [css-grid-2col, touch-target-48px, focus-visible-outline]
key_files:
  modified:
    - js/exercises.js
    - css/styles.css
    - test/app.test.js
decisions:
  - "muscleGroups export appended before exercises export — no structural change to exercises data"
  - "CSS .back-btn uses navy border (not teal) to distinguish navigation elements from content tiles"
  - "workoutDays loop assertion uses Object.values(expected[day.id]).reduce() sum to avoid hardcoding 6 — day4 expects 3"
  - "Phase 4 count assertions (allExercises.length 108, groupExercises.length 18) intentionally left failing"
metrics:
  duration: ~4 min
  completed: "2026-04-25T01:47:07Z"
  tasks_completed: 2
  files_modified: 3
---

# Phase 02 Plan 01: muscleGroups Export, Home/Exercise Screen CSS, Test Baseline Summary

muscleGroups named export added to exercises.js, CSS sections 5 and 6 filled with home screen grid and exercise screen navigation styles, and stale Spanish-key test assertions replaced with current English-key schema.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Add muscleGroups export + fill CSS sections 5 and 6 | 4190673 | js/exercises.js, css/styles.css |
| 2 | Update stale test assertions in test/app.test.js | bafa651 | test/app.test.js |

## What Was Built

### Task 1: muscleGroups export + CSS sections 5 and 6

**js/exercises.js** — Added `export const muscleGroups = ['chest', 'back', 'biceps', 'triceps', 'shoulders', 'abs', 'legs']` as a second named export immediately before `export const exercises`. Existing exercise data untouched.

**css/styles.css section 5 (HOME SCREEN)** — Added `.home-screen`, `.app-title`, `.home-subtitle`, `.routine-grid`, `.routine-tile` (with `:hover/:focus-visible/:active` states). Key constraints applied:
- `.routine-grid` uses `grid-template-columns: 1fr 1fr` for 2x2 layout
- `.routine-tile` has `min-height: var(--touch-target)` (48px) — gym usability requirement
- Teal used only for border (2px solid) and focus-visible outline — never as text color
- No box-shadow, no gradients (DSNG-05 compliance)

**css/styles.css section 6 (EXERCISE SCREEN)** — Added `.exercise-header`, `.back-btn` (with `:hover/:focus-visible/:active` states), `.exercise-screen h1`, `.placeholder-text`. Key constraints:
- `.back-btn` has `min-height: var(--touch-target)` (48px)
- Navy border on back-btn distinguishes navigation from content tiles (teal only on focus outline)

Sections 7-11 remain empty scaffolds — not touched.

### Task 2: Test baseline cleanup

Updated `test/app.test.js` to match the Phase 1 English schema:
- `muscleGroups.length` assertion: 6 → 7
- Removed stale `equipment` (Spanish values) and `steps` assertions; replaced with `description`, `videoId`, `svgKey` type checks
- Replaced Spanish `expected` object (`hombros`, `pecho`, `espalda`, etc.) with English keys (`chest`, `back`, `biceps`, etc.)
- `workoutDays` loop length check now uses `Object.values(expected[day.id]).reduce((a, b) => a + b, 0)` — correctly handles day4 expecting 3 exercises (not 6)
- Phase 4 count assertions (`allExercises.length, 108`; `groupExercises.length, 18`) and Phase 3/4 SVG tests intentionally left failing

## Verification Results

| Check | Result |
|-------|--------|
| `grep "export const muscleGroups" js/exercises.js` | PASS — 1 match |
| `grep -c "routine-tile" css/styles.css` | PASS — 4 matches |
| `grep -c "back-btn" css/styles.css` | PASS — 4 matches |
| No `box-shadow` in css/styles.css | PASS |
| No `linear-gradient` in css/styles.css | PASS |
| No `radial-gradient` in css/styles.css | PASS |
| No `color: var(--color-teal)` in css/styles.css | PASS |
| `node --check test/app.test.js` | PASS — exit 0 |
| `muscleGroups.length, 7` in test | PASS — 1 match |
| `typeof exercise.videoId` in test | PASS — 1 match |
| `typeof exercise.svgKey` in test | PASS — 1 match |
| `legs: 3` in test (day4 correct) | PASS — 1 match |
| `Object.values(expected` in test | PASS — 1 match |
| `allExercises.length, 108` still present | PASS — 1 match |
| `groupExercises.length, 18` still present | PASS — 1 match |
| All Spanish keys removed from test | PASS — 8/8 absent |

## Deviations from Plan

None — plan executed exactly as written.

## Known Stubs

None. The `.placeholder-text` CSS class is a legitimate UI utility class for placeholder content states, not a data stub.

## Threat Flags

None. No new network endpoints, auth paths, file access patterns, or schema changes at trust boundaries were introduced. All changes are static file modifications (CSS rules, JS export, test assertions).

## Self-Check: PASSED

- `js/exercises.js` exists and contains `export const muscleGroups` — FOUND
- `css/styles.css` contains `.routine-grid`, `.routine-tile`, `.back-btn`, `.exercise-header` — FOUND
- `test/app.test.js` syntax valid, English keys present, no Spanish keys — FOUND
- Commit 4190673 exists — FOUND
- Commit bafa651 exists — FOUND
