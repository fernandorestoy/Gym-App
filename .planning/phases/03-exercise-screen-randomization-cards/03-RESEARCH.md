# Phase 3 Research — Exercise Screen: Randomization + Cards

**Researched:** 2026-04-25
**Domain:** Vanilla JS DOM rendering, localStorage, SVG illustration integration
**Confidence:** HIGH — all findings are code-verified against actual files

---

## 1. svgIllustrations.js — getSvg API and pose keys

### Function signatures (verified by reading lines 955–1084)

```js
export function getSvg(exerciseId, accentColor = "#E74C3C")
// Returns: a complete <svg> string (400×280 viewBox)
// Falls back to getFallbackSvg(accentColor) when exerciseId is not a key in `poses`

function getFallbackSvg(accentColor)
// Not exported. Returns a single-figure <svg> with label "Ejercicio"
// Called internally by getSvg; callers only need getSvg
```

`getFallbackSvg` is NOT exported. The only public API is `getSvg(exerciseId, accentColor)`.

### How the key lookup works

`getSvg` does: `const poseData = poses[exerciseId]` where `poses` is a plain object keyed by
Spanish kebab-case strings. If `exerciseId` is not a key in `poses`, `getSvg` silently calls
`getFallbackSvg` and returns a generic silhouette. No error is thrown.

### Label strings to replace (verified lines 1067, 1069, 1082)

Line 1067: `${label(110, 274, "INICIO", "#999", 10)}`  → change `"INICIO"` to `"START"`
Line 1069: `${label(300, 274, "FIN", accentColor, 10)}` → change `"FIN"` to `"END"`
Line 1082: `${label(200, 274, "Ejercicio", "#888", 11)}` → change `"Ejercicio"` to `"Exercise"`
Line 1051 aria-label: `aria-label="Ilustración del ejercicio"` → change to `aria-label="Exercise illustration"`
Line 1079 aria-label (fallback): `aria-label="Ilustración del ejercicio"` → same change

Total: 5 string replacements in svgIllustrations.js.

### Complete pose key inventory (all keys in `poses`, lines 288–949)

**Legs / Glutes (14 keys)**
- `"sentadilla-goblet"`
- `"zancada-caminando"`
- `"peso-muerto-rumano-mancuernas"`
- `"sentadilla-sumo"`
- `"step-up"`
- `"sentadilla-bulgara"`
- `"prensa-piernas"`
- `"extension-cuadriceps"`
- `"curl-isquiotibiales"`
- `"hack-squat"`
- `"aduccion-cadera"`
- `"abduccion-cadera"`
- `"patada-gluteo-polea"`
- `"sentadilla-banda"`
- `"peso-muerto-banda"`
- `"clamshell-banda"`
- `"puente-gluteos-banda"`
- `"monster-walk"`

**Arms / Biceps + Triceps (18 keys)**
- `"curl-biceps"`
- `"curl-martillo"`
- `"extension-triceps-overhead"`
- `"curl-concentrado"`
- `"kickback-triceps"`
- `"curl-zottman"`
- `"curl-maquina-biceps"`
- `"extension-triceps-maquina"`
- `"curl-predicador-maquina"`
- `"dip-asistido"`
- `"curl-scott-maquina"`
- `"press-frances-maquina"`
- `"curl-cable"`
- `"pushdown-triceps"`
- `"curl-banda"`
- `"extension-banda-overhead"`
- `"curl-inverso-polea"`
- `"extension-triceps-banda"`

**Chest (18 keys)**
- `"press-pecho-plano"`
- `"press-inclinado-mancuernas"`
- `"aperturas-mancuernas"`
- `"press-declinado-mancuernas"`
- `"pullover-mancuerna"`
- `"squeeze-press"`
- `"press-pecho-maquina"`
- `"pec-deck"`
- `"press-inclinado-maquina"`
- `"crossover-maquina"`
- `"smith-press-pecho"`
- `"press-declinado-maquina"`
- `"crossover-cables"`
- `"press-bandas-pecho"`
- `"aperturas-cables-bajo"`
- `"aperturas-cables-alto"`
- `"press-inclinado-cable"`
- `"cruce-cable-unilateral"`

**Back (18 keys)**
- `"remo-mancuerna"`
- `"remo-inclinado-bilateral"`
- `"peso-muerto-mancuernas"`
- `"pullover-espalda"`
- `"remo-kroc"`
- `"encogimientos-mancuernas"`
- `"jalon-pecho"`
- `"remo-sentado-maquina"`
- `"jalon-agarre-cerrado"`
- `"remo-tbar"`
- `"pulldown-brazos-rectos"`
- `"hiperextension"`
- `"remo-cable"`
- `"face-pull"`
- `"jalon-banda"`
- `"remo-bajo-cable"`
- `"pullover-cable"`
- `"remo-alto-cable"`

**Shoulders (18 keys)**
- `"press-militar-mancuernas"`
- `"elevacion-lateral"`
- `"elevacion-frontal"`
- `"pajaros-reversefly"`
- `"press-arnold"`
- `"encogimientos-hombros"`
- `"press-hombro-maquina"`
- `"elevacion-lateral-maquina"`
- `"reverse-pec-deck"`
- `"smith-press-hombro"`
- `"maquina-encogimientos"`
- `"press-sentado-maquina-hombro"`
- `"elevacion-lateral-cable"`
- `"face-pull-cable"`
- `"elevacion-frontal-banda"`
- `"press-banda-hombros"`
- `"rotacion-externa-banda"`
- `"pull-apart-banda"`

**Abs / Core (18 keys)**
- `"crunch-mancuerna"`
- `"russian-twist"`
- `"plancha-remo"`
- `"woodchop-mancuerna"`
- `"farmers-carry"`
- `"side-bend"`
- `"crunch-maquina"`
- `"rotacion-torso-maquina"`
- `"elevacion-piernas-romana"`
- `"ab-roller-maquina"`
- `"hiperextension-inversa"`
- `"crunch-polea-alta"`
- `"pallof-press"`
- `"woodchop-cable"`
- `"crunch-cable"`
- `"anti-rotacion-banda"`
- `"dead-bug-banda"`
- `"plancha-banda"`

---

## 2. svgKey reconciliation map

exercises.js stores `svgKey` in **camelCase** (e.g. `"benchPress"`).  
svgIllustrations.js indexes `poses` by **Spanish kebab-case** (e.g. `"press-pecho-plano"`).  
The two namespaces never overlap — every current `getSvg(exercise.svgKey)` call hits the fallback.

**The approved fix (Option a from UI-SPEC):** Update `svgKey` in exercises.js to match the
Spanish kebab-case keys that already exist in svgIllustrations.js.

### Current svgKey → Required svgKey

| exercises.js id | Current svgKey (broken) | Correct svgKey (Spanish kebab-case) | Pose exists in svgIllustrations.js? |
|---|---|---|---|
| chest-001 | `benchPress` | `press-pecho-plano` | YES |
| chest-002 | `inclineBenchPress` | `press-inclinado-mancuernas` | YES |
| chest-003 | `dumbbellFly` | `aperturas-mancuernas` | YES |
| back-001 | `bentOverRow` | `remo-inclinado-bilateral` | YES |
| back-002 | `pullUp` | `jalon-pecho` | YES (closest: lat pulldown motion) |
| back-003 | `latPulldown` | `jalon-pecho` | YES |
| biceps-001 | `barbellCurl` | `curl-biceps` | YES |
| biceps-002 | `hammerCurl` | `curl-martillo` | YES |
| biceps-003 | `inclineDumbbellCurl` | `curl-concentrado` | YES (closest available) |
| triceps-001 | `ropePushdown` | `pushdown-triceps` | YES |
| triceps-002 | `overheadExtension` | `extension-triceps-overhead` | YES |
| triceps-003 | `closeGripBenchPress` | `press-frances-maquina` | YES (closest bench triceps) |
| shoulders-001 | `dumbbellOverheadPress` | `press-militar-mancuernas` | YES |
| shoulders-002 | `lateralRaise` | `elevacion-lateral` | YES |
| shoulders-003 | `facePull` | `face-pull` | YES |
| abs-001 | `plank` | `plancha-banda` | YES (only plank variant available) |
| abs-002 | `cableCrunch` | `crunch-cable` | YES |
| abs-003 | `hangingLegRaise` | `elevacion-piernas-romana` | YES (closest hanging leg raise) |
| legs-001 | `backSquat` | `sentadilla-goblet` | YES (closest squat variant) |
| legs-002 | `romanianDeadlift` | `peso-muerto-rumano-mancuernas` | YES |
| legs-003 | `legPress` | `prensa-piernas` | YES |

### Gaps and approximations

- **back-002 Pull-Up**: No pull-up pose exists. `jalon-pecho` (lat pulldown) is the closest
  pulling motion available. Both back-002 and back-003 would share `jalon-pecho` unless a
  pull-up pose is added. For Phase 3, sharing the key is acceptable — two exercises pointing
  at the same pose is harmless, they just render identically.
- **triceps-003 Close-Grip Bench Press**: No barbell bench press for triceps exists. 
  `press-frances-maquina` (lying triceps extension on machine) is the closest compound triceps 
  pose. Alternative: `dip-asistido` which shows dip mechanics.
- **abs-001 Plank**: `plancha-banda` shows forearm plank with band reach — visually close.
  `plancha-remo` is another option. Either works for Phase 3.
- **legs-001 Back Squat**: `sentadilla-goblet` shows squat mechanics adequately. No barbell
  back squat pose. This is the best available match.

**All 21 exercises get a real pose — none are left on fallback after reconciliation.**

---

## 3. renderExercise() current state → required state

### Current state (app.js lines 143–153)

```js
function renderExercise(routine) {
  return `
    <div class="exercise-screen">
      <div class="exercise-header">
        <button class="back-btn" data-action="back" aria-label="Back to home">&larr; Back</button>
        <h1>${escapeHtml(routine.label)}</h1>
      </div>
      <p class="placeholder-text">Exercises will appear here in Phase 3.</p>
    </div>
  `;
}
```

The function receives `routine` — an object from `workoutDays` with `id` and `label`.
It does NOT receive a pre-built exercise list. The exercise list must come from `routine.build()`
called inside the renderer (or passed in as a separate argument).

### Required state — full card HTML per exercise

Per UI-SPEC contract, each card must render:

```html
<div class="exercise-card">
  <div class="card-svg-container">
    <!-- getSvg(exercise.svgKey, accentColor) injected as innerHTML -->
  </div>
  <div class="card-body">
    <span class="card-group-tag">${escapeHtml(exercise.group)}</span>
    <h2 class="card-title">${escapeHtml(exercise.name)}</h2>
    <p class="card-description">${escapeHtml(exercise.description)}</p>
    <a
      class="youtube-btn"
      href="https://youtu.be/${escapeHtml(exercise.videoId)}"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Watch ${escapeHtml(exercise.name)} on YouTube"
    >
      <img
        class="youtube-btn__thumbnail"
        src="https://img.youtube.com/vi/${escapeHtml(exercise.videoId)}/hqdefault.jpg"
        alt=""
        loading="lazy"
        width="120"
        height="90"
      />
      <span class="youtube-btn__label">Watch video</span>
    </a>
  </div>
</div>
```

### Full renderExercise() required structure

```js
function renderExercise(routine) {
  const exerciseList = routine.build();   // ← calls build() here, with localStorage filter applied inside build()
  return `
    <div class="exercise-screen">
      <div class="exercise-header">
        <button class="back-btn" data-action="back" aria-label="Back to home">&larr; Back</button>
        <h1>${escapeHtml(routine.label)}</h1>
      </div>
      <div class="exercise-list">
        ${exerciseList.map(ex => renderCard(ex)).join('')}
      </div>
      <button class="regenerate-btn" data-action="regenerate" aria-label="Generate new exercises">
        New exercises
      </button>
    </div>
  `;
}
```

`renderCard(exercise)` is a private helper that renders one card (HTML shown above).

The SVG is injected with `.innerHTML` in the card — `getSvg()` returns a raw SVG string.
It is safe to inject because svgIllustrations.js generates the SVG entirely from controlled
internal data; no user input enters the SVG markup. The `accentColor` passed should be
`var(--color-teal)` resolved to its hex value `#82CDD8`.

---

## 4. Event delegation extension

### Current handlers (app.js lines 168–181)

```js
document.getElementById('app').addEventListener('click', (event) => {
  const tile    = event.target.closest('[data-routine-id]');
  const backBtn = event.target.closest('[data-action="back"]');

  if (tile) {
    currentRoutine = workoutDays.find(d => d.id === tile.dataset.routineId);
    currentScreen  = 'exercise';
    render();
  } else if (backBtn) {
    currentScreen  = 'home';
    currentRoutine = null;
    render();
  }
});
```

### What must be added

A third branch for `data-action="regenerate"`:

```js
const regenBtn = event.target.closest('[data-action="regenerate"]');

// ...existing if/else...
} else if (regenBtn) {
  // currentRoutine is already set — just re-render in place
  // build() inside renderExercise will pick fresh exercises (with recency filter)
  render();
  // Focus management: keep focus on the regenerate button
  // After render(), the button is a new DOM node — must re-query it
  document.querySelector('[data-action="regenerate"]')?.focus();
}
```

The render() call re-invokes `renderExercise(currentRoutine)` which calls `routine.build()`
again. Because the localStorage filter excludes recently shown IDs, the new pick will differ
from the previous session. Within the same session, there is no recency memory unless the
filter is applied to a module-level Set — the plan needs to decide whether in-session
recency is also tracked or only cross-session localStorage recency is tracked.

**Design decision required:** The UI-SPEC says localStorage stores last 6 IDs. The Regenerate
button re-calls `build()`. If in-session recency is NOT tracked separately, clicking Regenerate
multiple times within a session can return the same exercises (because they were just stored as
"recent" and therefore excluded — which is actually the desired behavior). This works correctly
as specified: store the current 6 IDs to localStorage on every build, read them at the start
of every build to exclude them.

---

## 5. localStorage recency exclusion pattern

### Key format (from requirements)

`gymup_recent_{routineId}` — e.g. `gymup_recent_day2`

Value: JSON-stringified array of up to 6 exercise IDs (strings).
Example: `'["chest-001","abs-002","chest-003","abs-001","chest-002","abs-003"]'`

### Helper function signatures

Two helpers should live in `app.js` (not exported — internal use only):

```js
/**
 * Read recent exercise IDs for a routine from localStorage.
 * Returns [] on SecurityError (private browsing) or missing key.
 *
 * @param {string} routineId — e.g. "day2"
 * @returns {string[]} — array of exercise id strings (may be empty)
 */
function getRecentIds(routineId) {
  try {
    const raw = localStorage.getItem(`gymup_recent_${routineId}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];   // SecurityError in private browsing, or JSON parse failure
  }
}

/**
 * Write the exercise IDs from a completed build to localStorage.
 * Silently no-ops on SecurityError.
 *
 * @param {string} routineId — e.g. "day2"
 * @param {string[]} ids — exercise IDs from the most recent build
 */
function storeRecentIds(routineId, ids) {
  try {
    localStorage.setItem(`gymup_recent_${routineId}`, JSON.stringify(ids));
  } catch {
    // SecurityError — private browsing or storage full. Ignore silently.
  }
}
```

### SecurityError handling

`localStorage` access throws `SecurityError` in:
- Private/Incognito browsing on some browsers
- `file://` protocol on some browsers
- Embedded iframes with restricted permissions

Both helpers wrap in `try/catch` with empty-catch. No user-facing error. The app degrades
gracefully: recency exclusion simply doesn't apply, and every session picks from the full pool.

---

## 6. CSS sections 7 + 8

### Current state (styles.css lines 211–218)

```css
/* =============================================
   7. EXERCISE CARDS
   ============================================= */

/* =============================================
   8. YOUTUBE BUTTON
   ============================================= */
```

Both sections are **completely empty** — only the comment headers exist. No rules at all.

### CSS variables confirmed available (from :root, lines 5–36)

Every token the planner will reference:

```
--color-cream:       #FFFEF1
--color-navy:        #1A2742
--color-teal:        #82CDD8
--color-dusty-rose:  #E58C8A
--color-sage:        #5BA08A
--color-destructive: #E58C8A

--font-heading:  'Crimson Pro', Georgia, serif
--font-body:     'Inter', -apple-system, BlinkMacSystemFont, sans-serif

--space-xs:  4px
--space-sm:  8px
--space-md:  16px
--space-lg:  24px
--space-xl:  32px
--space-2xl: 48px
--space-3xl: 64px

--radius-card:   12px
--radius-button: 8px
--radius-pill:   999px

--transition-speed: 200ms
--transition-ease:  cubic-bezier(0.2, 0.8, 0.2, 1)
--touch-target:     48px
```

### Section 6 gap (regenerate button)

Section 6 (EXERCISE SCREEN) at lines 169–209 contains `.exercise-header`, `.back-btn`, and
`.exercise-screen h1`. It does NOT contain `.regenerate-btn`. That class must be added to
section 6, not 7.

### Target CSS rules for sections 7 + 8

**Section 7 — EXERCISE CARDS** (rules needed):
- `.exercise-list` — stacked flex column, gap between cards
- `.exercise-card` — full-width, border-radius `--radius-card`, background `--color-cream`,
  border, overflow hidden
- `.card-svg-container` — aspect-ratio 400/280, width 100%, overflow hidden
- `.card-svg-container svg` — width 100%, height 100%, display block
- `.card-body` — padding `--space-lg`
- `.card-group-tag` — small uppercase label, `--color-teal`, `--font-body`
- `.card-title` — h2 styles, `--font-heading`, 20px, `--color-navy`
- `.card-description` — `--font-body`, 16px, `--color-navy`, margin-top

**Section 8 — YOUTUBE BUTTON** (rules needed):
- `.youtube-btn` — flex row, align-items center, gap, border, border-radius `--radius-button`,
  padding, min-height `--touch-target`, color `--color-navy`, text-decoration none
- `.youtube-btn__thumbnail` — fixed size (120×68px approx), object-fit cover, border-radius
- `.youtube-btn__label` — `--font-body`, 16px
- `.youtube-btn:hover`, `.youtube-btn:focus-visible` — outline with `--color-teal`

**Section 6 addition — REGENERATE BUTTON:**
- `.regenerate-btn` — full width, min-height `--touch-target` (48px), background
  `--color-dusty-rose`, color `--color-cream`, border-radius `--radius-button`, `--font-body`,
  font-size 16px, margin-top `--space-xl`, border none, cursor pointer
- `.regenerate-btn:hover`, `.regenerate-btn:focus-visible` — outline with `--color-teal`

---

## 7. pickRandom / build() integration point

### Current pickRandom signature (app.js lines 46–54)

```js
export function pickRandom(source, count, randFn = Math.random) {
  const pool = [...source];
  const safeCount = Math.min(count, pool.length);
  for (let i = pool.length - 1; i > pool.length - 1 - safeCount; i--) {
    const j = Math.floor(randFn() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(pool.length - safeCount);
}
```

`pickRandom` does NOT know about localStorage. It takes a `source` array and returns `count`
items from it. It is clean and tested.

### Where the localStorage filter inserts

The filter belongs **inside each `build()` method**, applied to each group pool BEFORE calling
`pickRandom`. The pattern per group call:

```js
// Inside e.g. workoutDays[1].build() for day2:
build() {
  const recentIds = getRecentIds('day2');
  const filterPool = (pool) => {
    const filtered = pool.filter(e => !recentIds.includes(e.id));
    return filtered.length >= PICK_COUNT ? filtered : pool;  // fallback to full pool
  };
  const chestPick = pickRandom(filterPool(exercises.chest), 3);
  const absPick   = pickRandom(filterPool(exercises.abs),   3);
  const result = [
    ...chestPick.map(e => ({ ...e, _group: 'chest' })),
    ...absPick.map(e => ({ ...e, _group: 'abs' })),
  ];
  storeRecentIds('day2', result.map(e => e.id));
  return result;
}
```

**PICK_COUNT constants per group per day:**
- day1: biceps=1, triceps=1, shoulders=1, abs=3
- day2: chest=3, abs=3
- day3: back=3, abs=3
- day4: legs=3

**Fallback rule (ROUT-06):** If `filtered.length < PICK_COUNT`, use the full group pool.
With only 3 exercises per group in the current library (and 18 required by the test contract),
the filter will almost always have plenty of non-recent options once the library is complete.

### Impact on existing tests

`pickRandom` itself is not modified — its tests remain valid. The `workoutDays.build()` tests
in `app.test.js` (lines 60–72) test group mix counts, not exercise identity, so they remain
valid after adding the localStorage filter. `getRecentIds` will return `[]` in the Node.js
test environment (no localStorage), meaning `filterPool` returns the full pool — no behavior
change in tests.

Note: `app.test.js` line 20 asserts `allExercises.length === 108` and each group has 18
exercises. The current library has only 3 per group (21 total). Phase 3 must expand the
library to 18 per group, or the test will fail. This is an existing constraint from the test
contract, not introduced by Phase 3 — but Phase 3 plan must include it.

---

## 8. Open questions / risks for planner

### Risk 1 — Test contract requires 18 exercises per group (108 total)

`app.test.js` line 20: `assert.equal(allExercises.length, 108)` and line 23: each group must
have 18 exercises. Current library: 3 per group. **The test will fail until the library is
expanded.** Phase 3 must either:
(a) expand exercises.js to 18 per group (7 groups × 18 = 126 entries) — this is the stated
    project goal and the test contract reflects it, or
(b) skip the test with a known-failing flag until a later phase.

The SVG pose inventory contains exactly 18 entries per group-equivalent category, which
suggests the pose library was designed to match a 18-exercise library. This alignment supports
expanding exercises.js to 18 per group in Phase 3.

### Risk 2 — SVG test calls getSvg(exercise.id) not getSvg(exercise.svgKey)

`app.test.js` line 42: `const svg = getSvg(exercise.id, "#E74C3C")`.
This test passes exercise IDs like `"chest-001"` — NOT svgKeys. These IDs are not pose keys
and will always hit the fallback. The test at line 43 only checks that the result is a valid
`<svg>` tag — which getFallbackSvg returns — so the test currently PASSES despite the
illustrations being wrong.

**After reconciliation**, if the planner changes the test to use `exercise.svgKey` to verify
real poses load, a new assertion would be needed. For Phase 3, the existing test remains
unchanged — it validates the fallback behavior correctly. The visual correctness is verified
by reading the card HTML in a browser.

### Risk 3 — back-002 Pull-Up and back-003 Lat Pulldown share the same pose key

After reconciliation, both map to `"jalon-pecho"`. They will render the same illustration.
This is functionally acceptable for Phase 3 — the exercises have different names, descriptions,
and video links. A dedicated Pull-Up pose could be added in a later phase.

### Risk 4 — getSvg accentColor parameter

The UI-SPEC does not specify which hex color to pass as `accentColor`. The CSS token is
`var(--color-teal)` = `#82CDD8`. This value must be hardcoded as the string `"#82CDD8"` when
calling `getSvg()` from the renderer, since `getSvg` does not accept CSS variable references.

### Risk 5 — No svgKey validation in exercises.js

exercises.js has no runtime check that `svgKey` values exist in svgIllustrations.js. If a
future exercise is added with a wrong svgKey, it silently renders the fallback. Consider
adding a developer-time assertion or a test that verifies all svgKeys map to known poses.
Out of scope for Phase 3 — flagged for awareness.

### Risk 6 — exercise-list card HTML injects SVG via innerHTML

`getSvg()` returns an SVG string. It must be injected with `element.innerHTML` or via a
template literal in `renderCard()`. Since the entire exercise screen is rendered via
`document.getElementById('app').innerHTML = ...`, the SVG string is part of the template
literal — this is safe as long as `getSvg` is called with controlled `svgKey` values, which
it is (all svgKey values come from exercises.js, not user input).

### Risk 7 — YouTube thumbnail may fail to load at the gym

`hqdefault.jpg` requires a network request. At the gym on a slow connection, thumbnails may
not load. The `<img>` should have no `alt` text (decorative — the button label provides the
accessible name) and should fail gracefully when the image is unavailable. Using `loading="lazy"`
defers the request until the card is visible.

---

## Sources

All findings are VERIFIED by direct file reads in this session. No web searches were used.

| File | Lines Read | What Was Confirmed |
|---|---|---|
| `js/svgIllustrations.js` | 1–1085 (in sections) | All pose keys, getSvg/getFallbackSvg signatures, label strings |
| `js/exercises.js` | 1–213 | All svgKey values, exercise IDs, full library structure |
| `js/app.js` | 1–185 | renderExercise current state, pickRandom, workoutDays.build(), event delegation |
| `css/styles.css` | 1–230 | All CSS variables, section 7/8 empty scaffolds, section 6 content |
| `test/app.test.js` | 1–92 | Test contracts for exercise count (108), getSvg call pattern, pickRandom |
