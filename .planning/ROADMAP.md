# Roadmap: Antigravity

## Overview

Antigravity is built in five phases. Phase 1 locks the data model and design tokens before anything is rendered — getting this order wrong means refactoring 180+ exercise objects. Phase 2 builds the app shell and home screen, validating the routing architecture on the simplest interactive piece first. Phase 3 delivers the core product: the exercise screen, Fisher-Yates shuffle, localStorage recency exclusion, and fully styled cards. Phase 4 populates the complete exercise library (30+ per muscle group with verified YouTube IDs). Phase 5 adds the animations and polish that make the app feel intentional at the gym.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Data Architecture + Design System** - Lock the data model and CSS design tokens before any UI is built
- [ ] **Phase 2: App Shell + Home Screen** - Routing skeleton, 2x2 routine tile grid, mobile-first layout
- [ ] **Phase 3: Exercise Screen + Randomization + Cards** - Fisher-Yates shuffle, recency exclusion, 6-card layout, YouTube thumbnails
- [ ] **Phase 4: Exercise Content Population** - Enter all 30+ exercises per muscle group with descriptions and verified YouTube IDs
- [ ] **Phase 5: Polish + Animation** - Staggered card fade-in, View Transitions, button feedback, performance audit

## Phase Details

### Phase 1: Data Architecture + Design System
**Goal**: The exercise data schema and CSS design tokens are established so every subsequent phase builds on a stable, correct foundation
**Depends on**: Nothing (first phase)
**Requirements**: DATA-01, DATA-02, DATA-04, DSNG-01, DSNG-02, DSNG-03, DSNG-04, DSNG-05, PERF-02
**Success Criteria** (what must be TRUE):
  1. Opening `index.html` directly in a browser (no server) renders the correct brand background color (#FFFEF1) and loads Crimson Pro and Inter fonts
  2. The `exercises.js` file exports a grouped object keyed by muscle group (chest, back, biceps, triceps, shoulders, abs, legs), and each exercise entry has id, name, group, description, videoId, and svgKey fields
  3. Every exercise id follows the stable kebab-case pattern (e.g., `chest-001`) with no duplicates across the library
  4. CSS custom properties for the full brand palette (Navy, Teal, Cream, Dusty Rose, Sage Green) are defined in `:root` and visibly applied to typography and background
  5. No drop shadows, gradients, or 3D effects appear anywhere in the rendered output
**Plans**: 2 plans
Plans:
- [x] 01-01-PLAN.md — HTML shell + CSS design tokens (index.html + css/styles.css)
- [ ] 01-02-PLAN.md — Exercise data schema + app entry point (js/exercises.js + js/app.js)
**UI hint**: yes

### Phase 2: App Shell + Home Screen
**Goal**: Users can see the home screen with 4 tappable routine tiles and navigate to the exercise screen (even with placeholder content)
**Depends on**: Phase 1
**Requirements**: NAV-01, NAV-02, NAV-03, DSNG-06, DSNG-07
**Success Criteria** (what must be TRUE):
  1. The home screen displays exactly 4 routine tiles (Chest+Abs, Back+Abs, Arms/Shoulders+Abs, Legs) in a 2x2 grid
  2. Tapping any tile navigates to the exercise screen for that routine without a page reload
  3. A back button on the exercise screen returns the user to the home screen
  4. Every tappable element has a minimum 48px touch target height
  5. The layout is usable on a 375px mobile viewport, a tablet, and a desktop without horizontal scrolling
**Plans**: 2 plans
Plans:
- [ ] 02-01-PLAN.md — muscleGroups export + CSS home/exercise screen styles + test updates (js/exercises.js, css/styles.css, test/app.test.js)
- [ ] 02-02-PLAN.md — app.js full rewrite: routing, utilities, workoutDays, renderers, event delegation (js/app.js)
**UI hint**: yes

### Phase 3: Exercise Screen + Randomization + Cards
**Goal**: Users can generate a randomized set of 6 exercises for any routine, see full exercise cards, and regenerate without cross-session repeats
**Depends on**: Phase 2
**Requirements**: ROUT-01, ROUT-02, ROUT-03, ROUT-04, ROUT-05, ROUT-06, ROUT-07, CARD-01, CARD-02, CARD-03, CARD-04
**Success Criteria** (what must be TRUE):
  1. Selecting a routine always produces exactly 6 exercise cards in the correct muscle group ratio (3+3 for Chest/Back, 1+1+1+3 for Arms/Shoulders, 6 legs)
  2. Running the same routine on consecutive sessions never repeats any of the previous session's 6 exercises (localStorage recency exclusion working)
  3. The Regenerate button produces a new set of 6 exercises with the same ratio constraint, without navigating away
  4. Each exercise card displays: SVG illustration, exercise name, how-to description, and a YouTube thumbnail button that opens the video in a new tab
  5. Exercise cards are full-width, vertically stacked, and readable at a glance without zooming on a mobile screen
**Plans**: TBD
**UI hint**: yes

### Phase 4: Exercise Content Population
**Goal**: The exercise library contains 30+ verified entries for every muscle group, making the randomization meaningful and repetition practically impossible
**Depends on**: Phase 3
**Requirements**: DATA-03
**Success Criteria** (what must be TRUE):
  1. The `exercises.js` file contains 30 or more exercises for each of the 7 muscle groups: chest, back, biceps, triceps, shoulders, abs, legs
  2. Every exercise entry has a non-empty description (2-4 sentences) and a valid YouTube video ID that resolves to a real, accessible video
  3. Running any routine 5 times in a row produces no repeated exercises (pool is large enough that recency exclusion works correctly)
**Plans**: TBD

### Phase 5: Polish + Animation
**Goal**: The app feels intentional and responsive at the gym — smooth transitions, visual confirmation of regeneration, and verified load performance
**Depends on**: Phase 4
**Requirements**: PERF-01
**Success Criteria** (what must be TRUE):
  1. Tapping Regenerate produces a visible staggered card animation (cards fade in sequentially, not all at once) confirming a new set has loaded
  2. Navigating between home and exercise screens has a smooth crossfade transition (200-250ms) rather than an abrupt swap
  3. The app loads and is interactive in under 2 seconds on a simulated mobile connection (Chrome DevTools 4G throttle)
**Plans**: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Data Architecture + Design System | 2/2 | Complete | 2026-04-24 |
| 2. App Shell + Home Screen | 0/2 | Not started | - |
| 3. Exercise Screen + Randomization + Cards | 0/TBD | Not started | - |
| 4. Exercise Content Population | 0/TBD | Not started | - |
| 5. Polish + Animation | 0/TBD | Not started | - |

---
*Roadmap created: 2026-04-24*
*Requirements covered: 27/27*
