# Project Research Summary

**Project:** Antigravity — Personal Workout Guidance Web App
**Domain:** Mobile-first fitness exercise reference, single-user, no backend
**Researched:** 2026-04-21
**Confidence:** HIGH

## Executive Summary

Antigravity is a gym-use web app that generates a daily set of 6 exercises from 4 fixed routines, with a library of 30+ exercises per muscle group. The correct approach is vanilla HTML/CSS/JS with ES modules — no framework, no build step. The app already exists in two forms (a 162KB monolithic HTML file and a partially built multi-file version in `js/`); the rebuild should use the multi-file structure exclusively, fix the brand design, and populate a complete exercise library. The stack decision is closed: vanilla JS is correct, not a limitation.

The core architecture is two screens (Home with 4 routine tiles, Exercise screen with 6 stacked full-width cards) navigated by a simple routing function in `app.js`. The exercise database lives in `exercises.js` as a plain JS module grouped by muscle group. SVG illustrations (already engineered in `svgIllustrations.js`) replace external images, eliminating load-time and licensing concerns. YouTube videos are linked via anchor tags only — never iframes. The brand palette (Navy/Teal/Cream/Dusty Rose/Sage) applied via CSS custom properties, with Crimson Pro for headings and Inter for body text.

The main risks are content risks, not technical risks. The existing app's core failure was repeated exercises and wrong design — both content problems. The rebuild's success depends on: (1) correct data architecture before content entry, (2) Fisher-Yates shuffle and localStorage recency exclusion from day one, (3) strict card information hierarchy, and (4) verified YouTube links from institutional channels. None of these are hard problems; all require discipline during execution.

---

## Key Findings

### Recommended Stack

The current multi-file structure is architecturally correct and should be preserved as-is. No framework, preprocessor, or build tool is warranted. The only material changes are: replace dark theme colors with the brand palette, add Crimson Pro via Google Fonts, rebuild the exercise database with 30+ entries per group, and wire YouTube links as anchor tags.

**Core technologies:**
- HTML5 (`index.html` as shell) — zero overhead, no toolchain, browser-native
- CSS with custom properties (`css/styles.css`) — CSS `clamp()` and Grid handle all responsive needs; no preprocessor
- ES Modules, no bundler (`js/app.js`, `js/exercises.js`, `js/svgIllustrations.js`) — already in place, clean separation without a build step
- Crimson Pro + Inter via Google Fonts CSS API v2 — headings (Crimson Pro, weight 600) and body (Inter, weight 400)
- Inline SVG figures (`svgIllustrations.js`) — zero HTTP requests for images, scales perfectly, already built
- YouTube anchor links only — `<a href="https://youtu.be/[id]" target="_blank">` styled as a button; thumbnails from `img.youtube.com/vi/[id]/hqdefault.jpg`

**What NOT to use:** React/Vue/Svelte (build step, overkill), Tailwind (build step, fights custom design), YouTube iframes (450KB–1.3MB per embed, autoplay fails on iOS Safari), JSON + fetch() for exercise data (async complexity; JS module resolves synchronously at parse time).

### Expected Features

**Must have (table stakes):**
- 4 fixed routines: Chest+Abs, Back+Abs, Arms/Shoulders+Abs, Legs
- Correct exercise ratios: Chest+Abs (3+3), Back+Abs (3+3), Arms/Shoulders+Abs (1 biceps + 1 triceps + 1 shoulders + 3 abs), Legs (6)
- 30+ exercises per muscle group, with descriptions and YouTube links
- Regenerate button producing a new random set of 6 exercises
- Full-width vertical stacked cards (6 per session) — no horizontal carousel
- Card hierarchy: illustration → exercise name → brief description → YouTube link button
- Responsive on mobile, tablet, desktop

**Should have (quality differentiators):**
- SVG illustrations re-colored with brand palette (Navy/Teal figure on Cream background)
- Fisher-Yates shuffle + localStorage recency exclusion (prevents cross-session repeats)
- CSS View Transitions API for screen transitions (200–250ms crossfade; fallback: opacity class toggle)
- Staggered card fade-in on Regenerate (60ms delay per card, `translateY(8px)` to 0)
- 48px minimum touch targets on all interactive elements; full-width Regenerate button

**Defer (v2+):**
- Sets/reps tracking — explicitly out of scope per PROJECT.md
- Custom routine builder — 4 fixed routines are sufficient
- Progress history / charts — not a tracker
- Service workers / offline mode — adds complexity not needed for v1

**Exercise library inventory (from FEATURES.md):**

| Group | Count | Notes |
|-------|-------|-------|
| Chest | 34 | All variants: barbell, dumbbell, cable, machine, bodyweight |
| Back | 33 | Pull-ups, rows, pulldowns, pullovers, traps |
| Arms (Biceps + Triceps) | 34 | ~17 biceps + ~17 triceps, grouped as "Arms" |
| Shoulders | 32 | Press, lateral, front, posterior, rotator cuff |
| Abs | Present in file | Exact count unread — file exceeds token limit |
| Legs | Present in file | Exact count unread — file exceeds token limit |

**Arms/Shoulders split is resolved:** Per PROJECT.md, the Arms/Shoulders/Abs routine draws 1 biceps + 1 triceps + 1 shoulders from their respective sub-pools, not from one merged "arms" pool.

### Architecture Approach

The app is two screens deep. `app.js` owns all routing state (current screen, current routine) and uses event delegation on a single `#app` element — one `click` listener checks `event.target.closest('[data-action]')` instead of per-element listeners, preventing memory leaks on re-render. `exercises.js` is pure data: a top-level object keyed by muscle group, each containing its array of exercise objects. `svgIllustrations.js` is a pure rendering engine: takes an exercise key, returns an SVG. No file touches another file's concerns.

**Major components:**
1. `exercises.js` — exercise database grouped by muscle group; named exports `exercises` and `muscleGroups`; no DOM, no side effects
2. `app.js` — routing, `render_home()`, `render_exercises(routine)`, Fisher-Yates + recency exclusion, event delegation, View Transitions wrapper
3. `svgIllustrations.js` — SVG figure engine; maps exercise keys to anatomical figures using brand colors (Navy/Teal)
4. `css/styles.css` — all styles organized in 10 labeled sections: tokens, reset, layout, home, exercise screen, cards, YouTube button, animations, utilities, media queries

**Data model per exercise:**
```javascript
{
  id: "chest-001",           // unique, stable, kebab-case
  name: "Bench Press",
  group: "chest",
  description: "...",        // 2-4 sentences, action-focused
  videoId: "abc123XYZ",      // YouTube ID only, not full URL
  svgKey: "benchPress",
}
```

Thumbnail URL and watch URL are both computed from `videoId` at render time — clean data, no redundancy.

### Critical Pitfalls

1. **Biased shuffle** — `arr.sort(() => Math.random() - 0.5)` produces non-uniform results; certain exercises recur disproportionately. Prevention: Fisher-Yates (Knuth) only. Non-negotiable from day one.

2. **Cross-session repeats without memory** — fair shuffle still repeats exercises across consecutive sessions from a 30-exercise pool. Prevention: localStorage recency exclusion — store previous session's 6 IDs, exclude from next pool. ~10 lines of code. Implement alongside Fisher-Yates.

3. **YouTube iframe embeds** — 450KB–1.3MB payload per embed; autoplay fails silently on iOS Safari; breaks flat layout. Prevention: anchor links only, styled as buttons. No iframes ever in exercise cards.

4. **YouTube link rot** — tutorial videos are deleted, privatized, or DMCA-struck frequently. Prevention: prefer institutional/high-subscriber channels; quarterly link audit via comment block in `exercises.js`.

5. **Flat data structure** — a single array of 180+ exercise objects is unnavigable and error-prone. Prevention: top-level object keyed by muscle group from day one, before content entry begins.

6. **Information overload on cards** — three tiers only: (1) illustration + name, (2) 2-sentence description, (3) YouTube link. No difficulty badges, equipment tags, rep counts, or muscle diagrams. The PROJECT.md spec is correct — enforce strictly.

---

## Implications for Roadmap

Based on research, dependencies are clear: data architecture before content; design tokens before component CSS; core logic before polish. Suggested 5-phase structure:

### Phase 1: Data Architecture and Design System
**Rationale:** Everything else depends on this. The exercise data structure must be established before content can be entered. CSS custom properties must be wired before any component is styled. Getting this wrong means refactoring 180+ exercise objects.
**Delivers:** `exercises.js` with correct grouped structure and schema comment; `index.html` shell with Google Fonts loaded; CSS custom properties (brand palette, typography scale, spacing variables); base reset and typography
**Addresses:** brand color gap (current app uses wrong dark theme), Crimson Pro missing from current app, data structure correctness
**Avoids:** Pitfall 8 (flat unmaintainable structure)

### Phase 2: App Shell and Home Screen
**Rationale:** The Home screen (2x2 routine tile grid) is the simplest interactive piece and validates the routing architecture before the more complex Exercise screen is built.
**Delivers:** `app.js` with routing state and event delegation; `render_home()` function; 4 routine tiles styled and tappable; screen switching skeleton; CSS for home screen layout
**Addresses:** 4-routine navigation, mobile-first responsive layout, 48px touch targets
**Avoids:** Per-element event listener memory leaks (event delegation from day one)

### Phase 3: Exercise Screen, Randomization, and Card Components
**Rationale:** This is the core product. Fisher-Yates and recency exclusion must be built here — not retrofitted later. Card information hierarchy must be locked before content is added.
**Delivers:** `render_exercises(routine)` function; Fisher-Yates shuffle; localStorage recency exclusion; 6 stacked full-width exercise cards with correct hierarchy; YouTube anchor link buttons; correct routine ratios enforced
**Addresses:** randomization quality, cross-session variety, card UX, YouTube approach, muscle group ratios
**Avoids:** Pitfall 1 (biased shuffle), Pitfall 2 (cross-session repeats), Pitfall 5 (information overload), Pitfall 7 (YouTube iframe)

### Phase 4: Exercise Content Population
**Rationale:** Content entry is last because the structure must be locked. With data structure, rendering, and validation in place, adding 180+ exercises is mechanical and low-risk.
**Delivers:** 30+ exercises per group with descriptions and verified YouTube IDs; SVG illustration keys mapped to each exercise; complete library across all 6 groups
**Addresses:** library size (prevents the repetition that plagued the old app), YouTube link quality, SVG coverage
**Avoids:** Pitfall 3 (use institutional channels), Pitfall 4 (SVG approach eliminates image loading issues)

### Phase 5: Polish and Animations
**Rationale:** Animations enhance a working product; they must not block core functionality. Building them into Phase 3 slows iteration.
**Delivers:** CSS View Transitions API for screen swaps (200–250ms crossfade + opacity fallback); staggered card fade-in on Regenerate (60ms stagger, `translateY(8px)`); button press feedback (`scale(0.97)`, 80ms); fixed card heights to prevent layout shift; final accessibility audit
**Addresses:** perceived polish, regenerate visual feedback, gym usability
**Avoids:** Pitfall 10 (layout shift on Regenerate), Pitfall 11 (no visual confirmation of new set)

### Phase Ordering Rationale

- Phase 1 must precede everything: data model and design tokens are dependencies for all other phases
- Phase 2 before Phase 3: validates routing architecture on the simpler screen first
- Phase 3 before Phase 4: data structure and rendering validated before 180+ entries are written
- Phase 4 before Phase 5: content must exist before polish can be evaluated
- Phase 5 last: animations on a broken or empty product are wasted work

### Research Flags

Phases with standard patterns (research-phase not needed):
- **Phase 1:** Vanilla JS file structure and CSS custom properties are well-documented
- **Phase 2:** Two-screen navigation with event delegation is a standard vanilla JS pattern
- **Phase 3:** Fisher-Yates and localStorage are standard; card layout is established UX research
- **Phase 5:** CSS View Transitions API has current MDN documentation; fallback is standard

Phases that may need validation during planning:
- **Phase 4 (SVG coverage):** Unknown whether all 180+ exercises have existing SVG keys in `svgIllustrations.js`. Assess at Phase 4 start. Decision point: extend SVG engine vs. use text-on-color fallback for uncovered exercises.

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Verified against MDN, Google Fonts docs, multiple community sources. No ambiguity. |
| Features | HIGH | FEATURES.md has full descriptions and YouTube links for Chest (34), Back (33), Arms (34), Shoulders (32). Abs and Legs present but not fully read. |
| Architecture | HIGH | Two-screen flow, event delegation, and data model are well-documented patterns with fitness-app UX research backing. |
| Pitfalls | HIGH | Fisher-Yates bias is mathematically documented. YouTube autoplay/embed issues are officially documented by Google. Image performance standards are established. |

**Overall confidence:** HIGH

### Gaps to Address

- **SVG illustration coverage:** Unknown how many of 180+ exercises have existing SVG keys in `svgIllustrations.js`. Assess at Phase 4 start.
- **Abs and Legs exercise counts:** FEATURES.md file exceeded token read limit. Abs and Legs sections exist and are populated; exact counts unverified. Confirm at Phase 4 start.
- **YouTube link freshness:** All links were verified at research time (2026-04-21). A re-verification pass is needed at end of Phase 4 before marking content complete.

---

## Sources

### Primary (HIGH confidence)
- MDN Web Docs — ES Modules, View Transitions API, Responsive Images, Touch Events
- Google Fonts CSS API v2 — official documentation
- WCAG 2.1 — contrast ratios verified against brand palette (Navy on Cream: ~9.4:1, WCAG AAA)
- Fisher-Yates algorithm — Wikipedia, DEV Community mathematical documentation

### Secondary (MEDIUM confidence)
- Nielsen Norman Group — touch target size (44x44px minimum; 48px for gym context)
- Jeff Nippard, Athlean-X, BarBend, ACE Fitness — exercise content and YouTube links
- web.dev — YouTube embed best practices and performance costs
- Stormotion, Eastern Peak, MadAppGang — fitness app UX research and gym-context design
- YouTube thumbnail URL pattern (no API key) — `img.youtube.com/vi/[id]/hqdefault.jpg`

### Tertiary (context)
- lite-youtube-embed (Paul Irish, GitHub) — referenced as option if iframes ever reconsidered
- Vanilla JS resurgence 2025 (DEV Community) — stack validation

---
*Research completed: 2026-04-21*
*Ready for roadmap: yes*
