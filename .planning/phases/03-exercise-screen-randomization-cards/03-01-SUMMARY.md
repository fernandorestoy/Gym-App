---
plan: 03-01
phase: 03-exercise-screen-randomization-cards
status: complete
completed_at: "2026-04-25"
---

# 03-01 Summary: Exercise Library Foundation

## What Was Done

- Fixed all 21 existing svgKey values in exercises.js from camelCase to Spanish kebab-case matching svgIllustrations.js pose keys
- Expanded exercises.js from 21 to 126 exercises (7 groups × 18 each): chest, back, biceps, triceps, shoulders, abs, legs
- Replaced Spanish label strings in svgIllustrations.js with English: INICIO→START, FIN→END, Ilustración del ejercicio→Exercise illustration, Ejercicio→Exercise
- Namespaced bgGrad linearGradient IDs by exerciseId (`bgGrad-${exerciseId}`) to prevent SVG ID conflicts when multiple exercises render on the same page
- Updated test/app.test.js assertions: allExercises.length 108→126, Spanish regex patterns→English

## Verification

All 6 tests pass: `node --test test/app.test.js` → 6 pass, 0 fail

## Files Changed

- `js/exercises.js` — 126 exercises, all with correct Spanish kebab-case svgKey values
- `js/svgIllustrations.js` — English labels, namespaced gradient IDs
- `test/app.test.js` — Updated assertions for new count and English strings

## Notes

- The gradient namespace fix (bgGrad → bgGrad-${exerciseId}) was not in the original plan but was required to pass the pre-existing "exercise SVG internals are namespaced" test
- Wave 2 (03-02) can now proceed: renderCard() will call getSvg(exercise.svgKey, '#82CDD8') and get real illustrations for all 126 exercises
