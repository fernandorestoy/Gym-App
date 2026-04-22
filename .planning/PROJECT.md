# Antigravity

## What This Is

Antigravity is a personal web-based workout guidance app for Fernando Restoy. It presents 4 muscle-group routines, randomly generating 6 exercises per session from a library of 30+ exercises per muscle group. Each exercise includes a description, a quality image showing start and end position, and a YouTube video link. The app is a tool for daily gym use — not a data tracker, but a visual exercise guide.

## Core Value

Every session surfaces 6 varied, well-explained exercises so Fer never repeats the same workout and always knows exactly how to perform each movement.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] 4 routine types: Chest+Abs, Back+Abs, Arms/Shoulders+Abs, Legs
- [ ] Each routine generates 6 exercises randomly from the library
- [ ] Chest+Abs ratio: 3 chest + 3 abs (50/50)
- [ ] Back+Abs ratio: 3 back + 3 abs (50/50)
- [ ] Arms+Shoulders+Abs ratio: 3 arms/shoulders + 3 abs (50/50)
- [ ] Legs ratio: 6 legs (100%, no abs)
- [ ] 30+ exercises in the library for each muscle group (chest, back, arms, shoulders, abs, legs)
- [ ] Each exercise shows: name, brief how-to description, quality start/end image, YouTube video link
- [ ] Regenerate button to get a new random set of 6 exercises
- [ ] Minimalist design using The Ripple Effect color palette
- [ ] Fully responsive — works on mobile, tablet, and desktop
- [ ] Pure web app (HTML/CSS/JS) — no build tools, no backend, no login

### Out of Scope

- Data tracking (sets, reps, weight) — not how Fer uses the app
- User accounts / authentication — personal tool, no multi-user need
- Custom routine builder — 4 fixed routine types are sufficient
- Push notifications / reminders — out of scope for v1
- Progress charts / history — not a tracker

## Context

- Rebuilding from scratch — the existing app had repeated exercises and a design that felt off
- The new design must use The Ripple Effect brand colors: Navy (#1A2742), Teal (#82CDD8), Cream (#FFFEF1), Dusty Rose (#E58C8A), Sage Green (#5BA08A)
- Typographic guidelines: Crimson Pro for headings, Inter for body
- Design principles: minimalist, no shadows, no gradients, flat colors, generous whitespace
- The exercise library is the core asset — quality of content matters as much as the UI
- YouTube links should point to short, clear instructional videos (searched and verified)
- Images should be clean illustrations or photographs showing start and end position clearly
- Tech stack: vanilla HTML/CSS/JavaScript — single-file or small multi-file web app

## Constraints

- **Tech Stack**: Vanilla HTML/CSS/JS only — Fer is a non-developer, must remain simple to maintain
- **No backend**: All data (exercise library) lives in the JS file — no server, no database
- **Design**: Must follow The Ripple Effect brand palette strictly — no other colors
- **Performance**: Must load fast — Fer uses it at the gym on any device

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Rebuild from scratch | Old app had repeated exercises and unsatisfactory UX | — Pending |
| Use The Ripple Effect colors | Fer wants brand consistency across his personal tools | — Pending |
| 30+ exercises per muscle group | Prevents repetition — core complaint with old app | — Pending |
| YouTube links per exercise | Fer explicitly requested video reference for each exercise | — Pending |
| Random selection, 6 per session | Quick and effortless — no manual selection needed | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-04-22 after initialization*
