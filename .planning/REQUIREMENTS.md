# Requirements: Antigravity

**Defined:** 2026-04-22
**Core Value:** Every session surfaces 6 varied, well-explained exercises so Fer never repeats the same workout and always knows exactly how to perform each movement.

## v1 Requirements

### Data Architecture

- [ ] **DATA-01**: Exercise library is structured as a grouped JS object (by muscle group), not a flat array
- [ ] **DATA-02**: Each exercise object contains: id, name, description (2–3 sentences), youtubeId, difficulty, equipment
- [ ] **DATA-03**: Library contains 30+ exercises for each of 6 groups: chest, back, biceps, triceps, shoulders, abs, legs
- [ ] **DATA-04**: Unique stable IDs assigned to every exercise (for recency exclusion)

### Routines

- [ ] **ROUT-01**: App offers 4 routine types: Chest+Abs, Back+Abs, Arms/Shoulders+Abs, Legs
- [ ] **ROUT-02**: Chest+Abs generates 3 chest + 3 abs (random, Fisher-Yates)
- [ ] **ROUT-03**: Back+Abs generates 3 back + 3 abs (random, Fisher-Yates)
- [ ] **ROUT-04**: Arms/Shoulders+Abs generates 1 biceps + 1 triceps + 1 shoulders + 3 abs (random, Fisher-Yates)
- [ ] **ROUT-05**: Legs generates 6 legs (random, Fisher-Yates, no abs)
- [ ] **ROUT-06**: Recency exclusion prevents the last 6 shown exercises from appearing again (via localStorage)
- [ ] **ROUT-07**: Regenerate button generates a new random set of 6 for the current routine

### Exercise Cards

- [ ] **CARD-01**: Each exercise card shows: name, how-to description, image, YouTube button
- [ ] **CARD-02**: YouTube button uses the video thumbnail (img.youtube.com/vi/[id]/hqdefault.jpg) and opens video in new tab
- [ ] **CARD-03**: Exercise image clearly shows start and end position (SVG illustration or photograph)
- [ ] **CARD-04**: Card layout is vertical, full-width, readable at a glance in bright gym lighting

### Design

- [ ] **DSNG-01**: Background uses Warm Cream (#FFFEF1), never pure white
- [ ] **DSNG-02**: Headings use Deep Navy (#1A2742), body text uses #333333
- [ ] **DSNG-03**: Primary accent (buttons, links, icons) uses Teal (#82CDD8)
- [ ] **DSNG-04**: Heading font is Crimson Pro (weight 300), body font is Inter (weight 300/400)
- [ ] **DSNG-05**: No drop shadows, no gradients, no 3D effects — flat and minimalist
- [ ] **DSNG-06**: Touch targets minimum 48px height (gym use: sweaty hands, bright light)
- [ ] **DSNG-07**: Fully responsive — works on mobile, tablet, and desktop

### Navigation

- [ ] **NAV-01**: Home screen shows 4 routine tiles in a 2×2 grid
- [ ] **NAV-02**: Tapping a tile opens the exercise screen for that routine
- [ ] **NAV-03**: Back button returns to the home screen

### Performance

- [ ] **PERF-01**: App loads in under 2 seconds on a mobile connection
- [ ] **PERF-02**: No build step — pure HTML/CSS/JS, openable directly in a browser

## v2 Requirements

### Enhancements

- **V2-01**: Equipment filter — show only exercises matching available equipment
- **V2-02**: Difficulty filter — show only beginner/intermediate/advanced
- **V2-03**: Favorite exercises — mark preferred exercises to increase their random weight
- **V2-04**: Workout history — log which exercises were shown each session

## Out of Scope

| Feature | Reason |
|---------|--------|
| Data tracking (sets/reps/weight) | Not how Fer uses the app — pure guidance tool |
| User accounts / login | Personal tool, single user |
| Custom routine builder | 4 fixed routines cover all needs |
| Push notifications | Out of scope for this use case |
| Progress charts | Not a tracker |
| YouTube video embeds | Too heavy for gym use; direct links are correct |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| DATA-01 | Phase 1 | Pending |
| DATA-02 | Phase 1 | Pending |
| DATA-03 | Phase 1 | Pending |
| DATA-04 | Phase 1 | Pending |
| ROUT-01 | Phase 3 | Pending |
| ROUT-02 | Phase 3 | Pending |
| ROUT-03 | Phase 3 | Pending |
| ROUT-04 | Phase 3 | Pending |
| ROUT-05 | Phase 3 | Pending |
| ROUT-06 | Phase 3 | Pending |
| ROUT-07 | Phase 3 | Pending |
| CARD-01 | Phase 2 | Pending |
| CARD-02 | Phase 3 | Pending |
| CARD-03 | Phase 2 | Pending |
| CARD-04 | Phase 2 | Pending |
| DSNG-01 | Phase 2 | Pending |
| DSNG-02 | Phase 2 | Pending |
| DSNG-03 | Phase 2 | Pending |
| DSNG-04 | Phase 2 | Pending |
| DSNG-05 | Phase 2 | Pending |
| DSNG-06 | Phase 2 | Pending |
| DSNG-07 | Phase 2 | Pending |
| NAV-01 | Phase 2 | Pending |
| NAV-02 | Phase 2 | Pending |
| NAV-03 | Phase 2 | Pending |
| PERF-01 | Phase 4 | Pending |
| PERF-02 | Phase 1 | Pending |

**Coverage:**
- v1 requirements: 27 total
- Mapped to phases: 27
- Unmapped: 0 ✓

---
*Requirements defined: 2026-04-22*
*Last updated: 2026-04-22 after initial definition*
