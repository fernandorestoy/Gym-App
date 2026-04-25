# Phase 2: App Shell + Home Screen — Research

**Researched:** 2026-04-24
**Domain:** Vanilla JS SPA routing, CSS Grid, touch-target compliance, ES module patterns
**Confidence:** HIGH

---

## Summary

Phase 2 builds two screens (home + exercise placeholder) connected by client-side state routing — no URL changes, no hash, no framework. The entire pattern fits in one file: `js/app.js`. A `currentScreen` string variable drives a `render()` function that clears `#app` and injects new HTML. Event delegation on `#app` catches all clicks through a single listener. CSS Grid with `grid-template-columns: 1fr 1fr` and `min-height: var(--touch-target)` delivers a responsive 2x2 tile layout that satisfies DSNG-06 and DSNG-07 with no media query complexity.

The test file at `test/app.test.js` already imports `escapeHtml`, `pickRandom`, and `workoutDays` from `app.js` — these are the three exports Phase 2 must provide. The tests also reference a `muscleGroups` export from `exercises.js` that does not yet exist. Phase 2 must satisfy this contract or the test suite will remain broken. Specifically: `escapeHtml` is needed for safe HTML injection, `pickRandom` is needed for Phase 3 but must be exported now, and `workoutDays` is the routine definition array that drives tile rendering.

The critical constraint is `file://` protocol: ES modules load correctly over `file://` in all modern browsers without a dev server, but CORS restrictions mean no `fetch()` calls are permissible. Since all data is synchronous JS module imports (no JSON fetching), this is a non-issue for Phase 2.

**Primary recommendation:** State-variable routing with a single `render()` dispatcher in `app.js`, event delegation on `#app`, and CSS Grid for the tile layout. All routing state lives in two JS variables: `currentScreen` (string) and `currentRoutine` (object or null).

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| NAV-01 | Home screen shows 4 routine tiles in a 2x2 grid | CSS Grid `repeat(2, 1fr)` pattern; confirmed works at 375px |
| NAV-02 | Tapping a tile opens the exercise screen for that routine | State-variable routing: set `currentRoutine`, call `render()` |
| NAV-03 | Back button returns to the home screen | Set `currentScreen = 'home'`, call `render()` |
| DSNG-06 | Touch targets minimum 48px height | `min-height: var(--touch-target)` on tiles and buttons |
| DSNG-07 | Fully responsive — mobile, tablet, desktop | CSS Grid + `#app` max-width 640px already constrains desktop |
</phase_requirements>

---

## Project Constraints (from CLAUDE.md)

- **Vanilla HTML/CSS/JS ONLY** — no frameworks, no build step, no npm packages
- **No backend** — all data lives in JS files; no server, no fetch
- **ES Modules** — `type="module"` set in package.json; `import`/`export` syntax throughout
- **file:// compatible** — app opens directly in browser without a dev server
- **Design tokens** — use CSS custom properties from `:root`; never hardcode colors or sizes
- **Touch targets** — `var(--touch-target)` = 48px minimum height on all interactive elements
- **Max content width** — `#app` is already constrained to 640px centered
- **No shadows, no gradients, no 3D** — flat and minimalist (DSNG-05)
- **Teal as accent only** — card borders and focus rings; never as text color
- **Font weights** — Crimson Pro weight 300 (headings only), Inter weight 400 (body only)

---

## Standard Stack

### Core

| Layer | Technology | Version/Source | Purpose |
|-------|-----------|----------------|---------|
| Routing | State variable in `app.js` | ES2020 | Screen switching without URL changes |
| Rendering | `innerHTML` assignment to `#app` | Browser native | Replaces entire screen content |
| Layout | CSS Grid | CSS3 (all browsers) | 2x2 tile grid, responsive |
| Events | Event delegation on `#app` | Browser native | Single listener for all clicks |
| Data | Named exports from `exercises.js` | Already established | Source of truth for routine definitions |
| Safety | `escapeHtml()` utility | Hand-written, ~5 lines | XSS prevention for dynamic HTML injection |

No new packages. No npm installs. Everything is browser-native.

**Version verification:** N/A — no npm packages. All APIs are browser-native and supported in all modern browsers. [VERIFIED: MDN compatibility tables for CSS Grid, ES Modules, template literals — all baseline-supported since 2018]

---

## Architecture Patterns

### Recommended Project Structure (after Phase 2)

```
js/
├── exercises.js     # Exercise database — exists, no changes in Phase 2
├── svgIllustrations.js  # SVG engine — exists, not used in Phase 2
└── app.js           # Entry point + ALL Phase 2 logic (routing, render, events)
```

Phase 2 does NOT need a new file. All work goes into `js/app.js`. [ASSUMED — splitting into multiple JS files (e.g. `router.js`, `home.js`) would be cleaner architecture but contradicts CLAUDE.md's "simplest solution that achieves the goal" directive and YAGNI for a personal 2-screen app]

### Pattern 1: State-Variable Routing

**What:** A module-level variable holds the current screen name. A `render()` function reads it and dispatches to the correct screen renderer.

**Why this over alternatives:**
- Hash routing (`window.location.hash`) — adds URL changes, browser back-button complexity, and requires `hashchange` event handling. Unnecessary for 2 screens.
- `history.pushState()` — requires a server to handle direct URL loads (fails on `file://`). Ruled out.
- Multiple HTML files — violates single-page requirement (NAV-02: no page reload on navigation).
- `innerHTML` state variable — simplest pattern, zero complexity, fully debuggable.

**How the routing state works:**

```javascript
// Source: [ASSUMED — standard SPA pattern for vanilla JS, consistent with
// MDN SPA documentation https://developer.mozilla.org/en-US/docs/Glossary/SPA]

let currentScreen = 'home'; // 'home' | 'exercise'
let currentRoutine = null;  // null | routine object from workoutDays

function render() {
  const app = document.getElementById('app');
  if (currentScreen === 'home') {
    app.innerHTML = renderHome();
  } else if (currentScreen === 'exercise') {
    app.innerHTML = renderExercise(currentRoutine);
  }
}
```

**Navigation actions:**

```javascript
// Navigate to exercise screen:
currentScreen = 'exercise';
currentRoutine = workoutDays.find(d => d.id === routineId);
render();

// Navigate back to home:
currentScreen = 'home';
currentRoutine = null;
render();
```

[ASSUMED — pattern derived from training knowledge; not verified against a specific URL in this session]

### Pattern 2: CSS Grid 2x2 Tile Layout

**What:** A grid container with two equal columns. Four tiles auto-place into two rows.

**Why this works at 375px:** At 375px viewport, the `#app` container is `375 - 2*16px padding = 343px` wide. With `gap: var(--space-md)` (16px) and `grid-template-columns: 1fr 1fr`, each tile is `(343 - 16) / 2 = 163.5px` wide. This is sufficient for a tile label.

```css
/* Section 5 — HOME SCREEN (routine tiles) */
/* Source: [ASSUMED — standard CSS Grid pattern, MDN-documented] */

.routine-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-md);
  margin-top: var(--space-xl);
}

.routine-tile {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: var(--touch-target); /* 48px — satisfies DSNG-06 */
  padding: var(--space-lg);        /* 24px — readable in gym light */
  background-color: var(--color-cream);
  border: 2px solid var(--color-teal);
  border-radius: var(--radius-card);
  cursor: pointer;
  text-align: center;
  font-family: var(--font-heading);
  font-weight: 300;
  font-size: 20px;
  color: var(--color-navy);
  /* Interaction */
  transition: opacity var(--transition-speed) var(--transition-ease);
}

.routine-tile:hover,
.routine-tile:focus-visible {
  outline: 3px solid var(--color-teal);
  outline-offset: 3px;
}

.routine-tile:active {
  opacity: 0.7;
}
```

**Why `<button>` not `<div>` for tiles:** Buttons are natively keyboard-focusable, fire `click` on Enter/Space, and receive focus-visible styling without extra JS. Accessibility requirement per CLAUDE.md (WCAG compliance). [VERIFIED: MDN — https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button]

**The 2x2 auto-placement:** With `grid-template-columns: 1fr 1fr`, 4 child elements auto-place into 2 rows without explicitly setting `grid-template-rows`. [VERIFIED: MDN CSS Grid auto-placement — https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout/Auto-placement_in_grid_layout]

**Desktop behavior:** `#app` is already capped at `max-width: 640px` by Section 4 styles. At desktop width, the grid simply renders at max 640px centered — no extra media query needed for the tile grid itself.

### Pattern 3: Event Delegation

**What:** One `click` listener on `#app`. The handler inspects `event.target` (or its closest ancestor) to determine the action.

**Why not per-element listeners:** `render()` replaces `#app.innerHTML` entirely on each screen change. Any listeners attached to child elements are destroyed. Re-attaching them after every render is error-prone. Delegation on the stable `#app` element survives re-renders. [ASSUMED — standard DOM pattern documented in every JS fundamentals resource]

```javascript
// Source: [ASSUMED — standard event delegation pattern]

document.getElementById('app').addEventListener('click', (event) => {
  const tile = event.target.closest('[data-routine-id]');
  const backBtn = event.target.closest('[data-action="back"]');

  if (tile) {
    currentRoutine = workoutDays.find(d => d.id === tile.dataset.routineId);
    currentScreen = 'exercise';
    render();
  } else if (backBtn) {
    currentScreen = 'home';
    currentRoutine = null;
    render();
  }
});
```

**`closest()` is required** (not `target` directly) because the click may land on a child element inside the button (e.g., the text node's wrapper). `closest('[data-routine-id]')` walks up the DOM tree correctly. [VERIFIED: MDN — https://developer.mozilla.org/en-US/docs/Web/API/Element/closest — supported in all modern browsers]

### Pattern 4: Routine Definitions (workoutDays)

**What:** An array of 4 objects, each describing one routine. Exported as `workoutDays` from `app.js`.

**Why exported from `app.js` and not a separate file:** The test at `test/app.test.js` line 6 imports `workoutDays` directly from `../js/app.js`. This is the existing test contract. Creating a separate `routines.js` would require updating the test import — do not deviate from the existing test contract. [VERIFIED: `test/app.test.js` line 6]

**Structure the test expects:**

The test at line 62–72 calls `day.build()` and expects 6 exercises. It uses `exercise._group` as the group discriminator. This means `workoutDays` must have a `build()` method per routine, and exercises selected by `build()` must have a `_group` property.

```javascript
// Source: [VERIFIED — test/app.test.js lines 62–74 define this contract exactly]

export const workoutDays = [
  {
    id: 'day1',
    label: 'Arms / Shoulders + Abs',
    build() { /* returns array of 6 exercise objects with _group set */ }
  },
  {
    id: 'day2',
    label: 'Chest + Abs',
    build() { /* returns array of 6 exercise objects with _group set */ }
  },
  {
    id: 'day3',
    label: 'Back + Abs',
    build() { /* returns array of 6 exercise objects with _group set */ }
  },
  {
    id: 'day4',
    label: 'Legs',
    build() { /* returns array of 6 exercise objects with _group set */ }
  },
];
```

**Expected group counts per test (lines 63–68):**

| Day | Expected group composition |
|-----|---------------------------|
| day1 | `{ hombros: 2, brazos: 1, core: 3 }` |
| day2 | `{ pecho: 3, core: 3 }` |
| day3 | `{ espalda: 3, core: 3 }` |
| day4 | `{ gluteos: 2, cuadriceps: 2, isquiotibiales: 1, core: 1 }` |

**CRITICAL CONFLICT:** The test uses Spanish group keys (`hombros`, `pecho`, `espalda`, etc.) as `_group` values, but `exercises.js` was migrated to English keys (`shoulders`, `chest`, `back`, etc.) in Phase 1. This is a conflict that must be resolved in Phase 2. Options:

1. The test was written for the old Spanish-key schema and predates Phase 1's migration to English. The test is wrong and must be updated to match English keys.
2. `workoutDays.build()` sets `_group` to a display-friendly Spanish label (separate from the `exercises.js` grouping key).

Option 1 is the correct interpretation: the test was written against the old schema and is stale. Phase 2 must update `test/app.test.js` to use English `_group` values that match the current `exercises.js` keys. [VERIFIED: `exercises.js` uses English keys — confirmed by Phase 1 `01-02-SUMMARY.md`; `test/app.test.js` uses Spanish keys — confirmed by reading file]

**Also critical:** The test imports `muscleGroups` from `exercises.js` (line 4) and asserts `muscleGroups.length === 6` (line 19). But `exercises.js` currently only exports `exercises` (not `muscleGroups`). Phase 2 must add a `muscleGroups` export to `exercises.js`. [VERIFIED: `exercises.js` exports only `exercises`; `test/app.test.js` line 4 imports `muscleGroups`]

**Also critical:** The test asserts `allExercises.length === 108` and `groupExercises.length === 18` per group, but Phase 1 shipped only 3 exercises per group (21 total). The test will fail on count assertions until Phase 4. This is a known gap, not something Phase 2 should fix prematurely.

### Pattern 5: escapeHtml Utility

**What:** Sanitizes a string before injecting it into `innerHTML`. Prevents XSS from any dynamic content.

**Why needed:** Even though this is a personal app with no user input, using `innerHTML` with template literals is a habit that Phase 3 will expand (exercise names, descriptions). Establishing `escapeHtml` in Phase 2 is correct and the test file already requires it.

```javascript
// Source: [ASSUMED — standard HTML escaping utility; pattern documented on OWASP]

export function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
```

[VERIFIED: test/app.test.js lines 87–91 define the exact expected output for this function — the implementation above matches the expected test output exactly]

### Pattern 6: pickRandom Utility

**What:** A Fisher-Yates partial shuffle that returns N items from an array without mutating the input. Used in Phase 3 for exercise selection, but the test contract requires it exported from `app.js` now.

```javascript
// Source: [VERIFIED — test/app.test.js lines 76–84 define the exact contract]
// The function signature must accept: (source, count, randFn)
// randFn defaults to Math.random but accepts an injected function for testing

export function pickRandom(source, count, randFn = Math.random) {
  const pool = [...source]; // non-mutating copy
  for (let i = pool.length - 1; i > pool.length - 1 - count; i--) {
    const j = Math.floor(randFn() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(pool.length - count);
}
```

[VERIFIED: test/app.test.js lines 76–84: confirms non-mutation, correct length, unique values, all items from source]

### Pattern 7: Exercise Screen Placeholder

**What:** A minimal screen that proves navigation works. Phase 3 replaces it entirely.

**What it must show in Phase 2:**
1. The routine's label (e.g., "Chest + Abs")
2. A back button that navigates to home
3. Placeholder text indicating "exercises will appear here"

**What it must NOT have:** Any exercise data rendering — that belongs to Phase 3.

```javascript
// Minimal exercise screen renderer (Phase 2 only)
function renderExercise(routine) {
  return `
    <div class="exercise-screen">
      <div class="exercise-header">
        <button class="back-btn" data-action="back" aria-label="Back to home">
          &larr; Back
        </button>
        <h1>${escapeHtml(routine.label)}</h1>
      </div>
      <p class="placeholder-text">Exercises will appear here in Phase 3.</p>
    </div>
  `;
}
```

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Client-side routing | Custom hash router, history API wrapper | State variable + `render()` dispatch | 2 screens don't justify routing complexity; hash changes break `file://` semantics; history API requires a server |
| Event binding after render | Re-attach per-element listeners after every `render()` | Single delegated listener on `#app` (permanent) | Per-element listeners are destroyed by `innerHTML` replacement and are error-prone to re-attach |
| Responsive grid | Custom float/flexbox grid system | `display: grid; grid-template-columns: 1fr 1fr` | CSS Grid handles all responsive cases natively without JS or media queries |
| Touch target sizing | JS that measures and adjusts heights | `min-height: var(--touch-target)` in CSS | CSS min-height is the correct layer; no JS needed |
| XSS prevention | DOMPurify or sanitize-html | Inline `escapeHtml()` (5 lines) | Only escaping 5 entities; a full library is overkill for a personal app with no user input |

---

## Common Pitfalls

### Pitfall 1: Attaching Listeners Before `render()` Completes

**What goes wrong:** Adding `addEventListener` to a child element of `#app` before `render()` injects it — the element doesn't exist yet. Also, calling `render()` replaces the element, destroying the listener.

**Why it happens:** Intuitive pattern from tutorials: "find element, add listener."

**How to avoid:** Attach the delegated listener to `#app` ONCE, outside of `render()`. Use `event.target.closest('[data-action]')` inside the handler.

**Warning signs:** Navigation works once, then stops on second click.

---

### Pitfall 2: ES Modules Blocked on file:// for Non-Module JS

**What goes wrong:** `<script type="module">` works on `file://` in Chrome/Firefox/Safari — but ONLY if the script itself does not call `fetch()`. Any `fetch()` call fails with CORS error on `file://`.

**Why it happens:** The browser applies CORS to `fetch()` even for `file://` URLs.

**How to avoid:** Never use `fetch()` for loading exercise data. Use ES module imports (`import { exercises } from './exercises.js'`) — these are module-loading, not network requests, and work on `file://`.

**Confirmed:** Phase 1 already uses the correct import-only pattern. Phase 2 must not introduce any `fetch()` calls. [ASSUMED — CORS behavior on file:// is well-documented but not verified in this specific browser session; standard browser security model]

---

### Pitfall 3: `innerHTML` Without Escaping

**What goes wrong:** `app.innerHTML = \`<h1>${routineName}</h1>\`` — if `routineName` contains `<` or `&`, it breaks the HTML structure.

**Why it happens:** The data is "trusted" so developers skip escaping.

**How to avoid:** Always pipe dynamic values through `escapeHtml()`. The test contract already requires this function to exist.

---

### Pitfall 4: Tiles as `<div>` Instead of `<button>`

**What goes wrong:** Divs are not keyboard-focusable by default. Keyboard-only users (and VoiceOver/TalkBack users) cannot activate them. Missing `tabindex`, `role="button"`, and `keydown` handling.

**Why it happens:** Divs are easier to style and feel "flexible."

**How to avoid:** Use `<button>` elements for the tiles. The CSS reset in Section 2 already strips default button styling (`border: none; background: none; font: inherit`). Just add the visual tile styles.

---

### Pitfall 5: Stale Test Contract

**What goes wrong:** `test/app.test.js` was written before Phase 1 migrated exercise keys from Spanish to English. Running `node --test` currently fails because `app.js` does not export `escapeHtml`, `pickRandom`, or `workoutDays`.

**Why it matters:** The test file defines the exact API Phase 2 must implement. The planner must treat it as a specification, not an obstacle.

**What needs updating in tests:**
- Spanish `_group` keys in the `workoutDays` test → update to English group names
- `muscleGroups.length === 6` → requires new `muscleGroups` export from `exercises.js`
- Exercise count assertions (`108 total`, `18 per group`) → will remain failing until Phase 4 (leave as-is, document as known)

---

## Runtime State Inventory

Step 2.5 SKIPPED — this is a greenfield rendering phase, not a rename/refactor/migration phase. No stored data, live service config, OS-registered state, secrets, or build artifacts are affected.

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | `node --test` test runner | Yes | v24.14.1 | — |
| Browser (file://) | Opening index.html | Yes (macOS Safari/Chrome) | — | — |
| Google Fonts CDN | Font loading | Assumed yes (internet required) | — | System fonts in CSS fallback stack already defined |

**Missing dependencies with no fallback:** None.

**Missing dependencies with fallback:** Google Fonts CDN requires internet. CSS fallback fonts are declared (`Georgia, serif` and `-apple-system, sans-serif`) so the app degrades gracefully offline. [ASSUMED — internet connectivity not tested in this session]

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Node.js built-in `node:test` |
| Config file | None — `package.json` scripts.test: `"node --test"` |
| Quick run command | `node --test` |
| Full suite command | `node --test` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| NAV-01 | Home renders 4 tiles | unit | `node --test` | ❌ Wave 0 |
| NAV-02 | Tile click navigates to exercise screen | unit | `node --test` | ❌ Wave 0 |
| NAV-03 | Back button returns to home | unit | `node --test` | ❌ Wave 0 |
| DSNG-06 | Touch targets ≥ 48px | manual-only | Open in browser DevTools | — |
| DSNG-07 | Responsive layout | manual-only | Resize browser to 375px | — |

**Note on manual tests:** DSNG-06 and DSNG-07 are visual/layout requirements that cannot be meaningfully tested with `node --test` (no DOM). Verify by opening `index.html` in Chrome DevTools device emulator at 375px width and inspecting computed heights.

**Note on existing test file:** `test/app.test.js` already tests `escapeHtml`, `pickRandom`, and `workoutDays` — these are the Phase 2 exports that enable the test file to pass at all. The `workoutDays` test (lines 61–73) verifies correct exercise counts per routine. This is the primary automated check for NAV-02 logic.

### Sampling Rate
- **Per task commit:** `node --test`
- **Per wave merge:** `node --test`
- **Phase gate:** `node --test` green (on the tests that Phase 2 can satisfy) before `/gsd-verify-work`

### Wave 0 Gaps

The existing `test/app.test.js` file must be updated (not replaced) to:
- [ ] Change Spanish `_group` values to English (`hombros` → `shoulders`, `pecho` → `chest`, `espalda` → `back`, `gluteos`/`cuadriceps`/`isquiotibiales` → `legs`, `brazos` → `arms`, `core` → `abs`)
- [ ] The count assertions (`108 total`, `18 per group`) will remain failing — acceptable until Phase 4

Additionally, `exercises.js` needs:
- [ ] `export const muscleGroups = ['chest', 'back', 'biceps', 'triceps', 'shoulders', 'abs', 'legs']` — required by line 4 of existing test

---

## Code Examples

### Home Screen HTML (renderHome output)

```javascript
// Source: [ASSUMED — derived from REQUIREMENTS.md tile names and test contract]

function renderHome() {
  return `
    <div class="home-screen">
      <h1 class="app-title">Antigravity</h1>
      <p class="home-subtitle">Choose your routine</p>
      <div class="routine-grid" role="list">
        ${workoutDays.map(day => `
          <button
            class="routine-tile"
            data-routine-id="${escapeHtml(day.id)}"
            aria-label="${escapeHtml(day.label)}"
            role="listitem"
          >
            ${escapeHtml(day.label)}
          </button>
        `).join('')}
      </div>
    </div>
  `;
}
```

### Full app.js Skeleton (Phase 2 structure)

```javascript
// Source: [ASSUMED — synthesized from test contract + Phase 1 summary + this research]

import { exercises } from './exercises.js';

// --- Routing state ---
let currentScreen = 'home'; // 'home' | 'exercise'
let currentRoutine = null;

// --- Utilities (exported for test contract) ---
export function escapeHtml(str) { ... }
export function pickRandom(source, count, randFn = Math.random) { ... }

// --- Routine definitions (exported for test contract) ---
export const workoutDays = [ ... ];

// --- Renderers ---
function renderHome() { ... }
function renderExercise(routine) { ... }
function render() {
  const app = document.getElementById('app');
  app.innerHTML = currentScreen === 'home'
    ? renderHome()
    : renderExercise(currentRoutine);
}

// --- Event delegation (set up once) ---
document.getElementById('app').addEventListener('click', (event) => {
  const tile = event.target.closest('[data-routine-id]');
  const backBtn = event.target.closest('[data-action="back"]');
  if (tile) {
    currentRoutine = workoutDays.find(d => d.id === tile.dataset.routineId);
    currentScreen = 'exercise';
    render();
  } else if (backBtn) {
    currentScreen = 'home';
    currentRoutine = null;
    render();
  }
});

// --- Initial render ---
render();
```

---

## State of the Art

| Old Approach | Current Approach | Notes |
|--------------|-----------------|-------|
| Hash routing (`#home`, `#exercise`) | State variable | Hash routing adds URL noise and `hashchange` complexity for 2 screens |
| `document.createElement` + `.appendChild` | `innerHTML` template literals | Template literals are more readable for non-developers (Fer's maintenance concern) |
| `textContent` for safe text insertion | `escapeHtml()` + `innerHTML` | `textContent` can't build structured HTML; `escapeHtml` is the correct pattern when `innerHTML` is used |
| `click` listeners per element | Delegated listener on stable ancestor | Avoids listener lifecycle management; more robust with dynamic content |

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | State-variable routing is the simplest correct approach for a 2-screen vanilla JS SPA | Architecture Patterns - Pattern 1 | Low — alternatives (hash, history API) have known drawbacks for this file:// context |
| A2 | `workoutDays` should be exported from `app.js` rather than a separate file | Pattern 4 | Low — confirmed by test contract import on line 6; separate file would require test change |
| A3 | Spanish `_group` values in the test are stale from pre-Phase-1 schema | Pitfall 5 + Wave 0 Gaps | Medium — if intentional (display keys vs data keys), test would need different fix; review test intent before updating |
| A4 | `fetch()` is unavailable on `file://` and must never be used | Common Pitfalls - Pitfall 2 | Low — standard browser security model; Phase 1 already uses import-only correctly |
| A5 | `muscleGroups` should be `['chest', 'back', 'biceps', 'triceps', 'shoulders', 'abs', 'legs']` (7 items, English) | Wave 0 Gaps | Low — directly derived from Phase 1 exercises.js structure; but test asserts `.length === 6`, not 7. See open question below. |

---

## Open Questions

**RESOLVED — 2026-04-25**

1. **`muscleGroups.length` assertion: 6 or 7?**
   - **RESOLVED: 7.** All 7 English group keys (chest, back, biceps, triceps, shoulders, abs, legs) are included. The test assertion of 6 was stale from the old Spanish schema. 02-01 Task 2 Change 1 updates it to 7.

2. **workoutDays `_group` values: what string should be set?**
   - **RESOLVED: exact `exercises.js` key string (English lowercase).** `_group` must equal the parent key in `exercises.js` exactly — `'chest'`, `'back'`, etc. No display-friendly labels. 02-01 Task 2 Change 3 updates the test to use these English keys.

---

## Sources

### Primary (HIGH confidence)

- `test/app.test.js` (project file, read in this session) — defines the exact export contract for `app.js` and `exercises.js`
- `js/app.js` (project file, read in this session) — confirms Phase 1 left app.js as import-only, no rendering
- `css/styles.css` (project file, read in this session) — confirms sections 5–11 are empty scaffolds
- `index.html` (project file, read in this session) — confirms `<main id="app">` structure and ES module script
- `.planning/phases/01-data-architecture-design-system/01-02-SUMMARY.md` — confirms exercises.js English keys, 3 seed exercises/group

### Secondary (MEDIUM confidence)

- MDN Web Docs — CSS Grid auto-placement: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout/Auto-placement_in_grid_layout [CITED]
- MDN Web Docs — Element.closest(): https://developer.mozilla.org/en-US/docs/Web/API/Element/closest [CITED]
- MDN Web Docs — `<button>` element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button [CITED]

### Tertiary (LOW confidence / ASSUMED)

- State-variable SPA routing pattern — training knowledge, standard pattern, not cited to a specific source
- CORS on `file://` behavior — training knowledge; standard browser security model

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — confirmed via codebase; no new packages needed
- Architecture: HIGH for exported API (test contract is ground truth); MEDIUM for HTML structure (assumed patterns)
- Pitfalls: HIGH for stale test contract (verified); MEDIUM for CORS/file:// (assumed)
- CSS Grid: HIGH — MDN-verified, baseline browser support

**Research date:** 2026-04-24
**Valid until:** 2026-06-24 (stable browser APIs; CSS Grid and ES modules are not changing)

---

## RESEARCH COMPLETE
