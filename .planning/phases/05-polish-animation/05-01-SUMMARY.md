---
phase: 05-polish-animation
plan: 01
subsystem: ui
tags: [css-animations, view-transitions, stagger, accessibility, reduced-motion]

requires:
  - phase: 04-exercise-content-population
    provides: "exercise cards rendered by renderCard() as .exercise-card elements"

provides:
  - "CSS @keyframes cardFadeIn: staggered card entry (opacity + translateY 12px → 0, 300ms)"
  - "View Transitions API crossfade (220ms ease-in-out) wrapping every render() call"
  - "applyCardStagger(): per-card inline animation-delay at index * 80ms"
  - "prefers-reduced-motion: reduce override disabling all animations instantly"

affects: [any phase adding new .exercise-card elements or calling render()]

tech-stack:
  added: []
  patterns:
    - "View Transitions API conditional wrap: if (document.startViewTransition) { ... } else { doRender() }"
    - "Post-render stagger injection: querySelectorAll + forEach setting style.animationDelay"
    - "CSS section 9 for all animation rules, never touching structural rules in other sections"

key-files:
  created: []
  modified:
    - css/styles.css
    - js/app.js

key-decisions:
  - "80ms stagger increment chosen: 6 cards x 80ms = 480ms total cascade — perceptible but not slow"
  - "View Transitions applied to ALL render() calls (tile, back, regen) — single wrapping point, no repetition"
  - "applyCardStagger() placed inside doRender() so stagger fires even when View Transitions is absent"
  - "Section 9 holds all animation CSS; section 7 structural .exercise-card rule left untouched"

requirements-completed:
  - PERF-01

duration: 5min
completed: 2026-04-26
---

# Phase 05 Plan 01: Polish Animation Summary

**CSS staggered card entry (cardFadeIn keyframe + 80ms per-card JS delay) and View Transitions API crossfade (220ms) added to every screen change, with full prefers-reduced-motion support**

## Performance

- **Duration:** ~5 min
- **Started:** 2026-04-26T13:08:00Z
- **Completed:** 2026-04-26T13:12:54Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments

- Cards now enter with a visible cascade: card 1 immediately, card 2 at 80ms, up to card 6 at 400ms — confirming each regeneration visually
- Screen transitions (home → exercise, exercise → home, regenerate) crossfade in 220ms instead of an abrupt DOM swap
- Users with prefers-reduced-motion: reduce see instant rendering — zero animation, no jank

## Task Commits

1. **Task 1: CSS animations — @keyframes, view-transition rules, reduced-motion** - `8aa6d7e` (feat)
2. **Task 2: Wire View Transitions and stagger delays in app.js** - `af86f0f` (feat)

## Files Created/Modified

- `css/styles.css` - Section 9 filled: cardFadeIn keyframe, .exercise-card animation rule, ::view-transition-old/new crossfade keyframes, prefers-reduced-motion overrides
- `js/app.js` - applyCardStagger() helper added; render() body wrapped in document.startViewTransition with else fallback

## Decisions Made

- 80ms stagger increment: produces a visible cascade over ~480ms total without feeling sluggish on mobile
- View Transitions wraps all three render() triggers (tile click, back, regen) from a single function — clean, DRY
- applyCardStagger() runs inside doRender() (not outside the transition wrapper) so stagger works regardless of API support
- CSS section separation maintained — structural styles stay in section 7, animation properties only in section 9

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- Phase 05 Plan 01 complete; animations are live
- Plan 02 (final QA / release polish) can proceed
- No blockers

---
*Phase: 05-polish-animation*
*Completed: 2026-04-26*
