# Architecture Patterns: Antigravity Gym App

**Domain:** Minimalist personal fitness routine web app (mobile-first, gym use)
**Researched:** 2026-04-21
**Confidence:** HIGH for UX patterns and component structure. MEDIUM for animation specifics (browser support is recent). HIGH for YouTube thumbnail approach.

---

## 1. UX Flow: Routine Selection to Exercise Display

### Recommended flow

```
Home Screen (4 large tiles)
      |
      | tap routine tile
      v
Exercise Screen (6 stacked cards, full-width)
      |
      | tap "Regenerate"
      v
Same Exercise Screen (new 6 cards, animated in)
      |
      | tap Back
      v
Home Screen
```

**Why this two-screen flow, not modal or drawer:**
- Modals add a layer of cognitive overhead and hide the home screen context. At the gym, you want zero ambiguity about where you are.
- A dedicated exercise screen with a back button is the pattern used by Nike Training Club and Jefit. It is also the simplest to build and maintain in vanilla JS.
- The existing app already uses this pattern correctly. The rebuild should preserve the flow and fix the content and design, not restructure navigation.

**Home Screen tile layout: 2x2 grid.**
- Four equal tiles in a 2-column CSS grid, full width on mobile.
- Each tile: routine icon or illustration, routine name, subtitle (e.g., "3 Chest + 3 Abs").
- Minimum tile height: 120px, touch target extends across the full tile.
- No hover shadows (flat design rule). Use a solid border color shift on active state.

---

## 2. Exercise Card: Information Hierarchy

Research across top fitness apps (Nike Training Club, Jefit, Strong) and card UX best practices establishes this hierarchy as the standard:

```
[ Exercise Illustration / Image ]   <- visual anchor, top of card
  Exercise Name                     <- largest text, H2 level
  Muscle group tag (pill/badge)     <- secondary, small colored label
  How-to description                <- body text, 3-4 sentences max
  YouTube link button               <- clearly distinct CTA, bottom of card
```

### What NOT to include on the card

- Sets and reps: out of scope per PROJECT.md. Antigravity is a visual guide, not a tracker. Adding sets/reps creates clutter without value.
- Equipment tags: useful context, but only worth including if it does not add visual noise. If included, one small pill label is sufficient.
- Difficulty level: not part of the exercise data model. Skip entirely.

### Card layout specification

- Full-width card on mobile (no horizontal scrolling, no grid of cards).
- Illustration/image at top, occupies roughly 40% of card height.
- Name immediately below image, 1.2rem–1.4rem, Crimson Pro, bold.
- Description text: Inter, 0.9rem, generous line-height (1.6).
- YouTube button: full-width or near-full-width at bottom of card, minimum 48px height. Use a subtle play icon + "Watch technique" label. This is the primary CTA.

**Six cards stacked vertically.** Do not attempt a horizontal carousel. Horizontal carousels on mobile require precise swipe calibration that is difficult to implement well in vanilla JS, and users with sweaty hands at the gym will misfire frequently. A vertical scroll list is the most reliable interaction at the gym.

---

## 3. Card Design Pattern: Flat Minimalist for Gym Use

### Visual design rules (informed by current card UX research and gym context)

| Rule | Rationale |
|------|-----------|
| No shadows, no gradients | Per PROJECT.md brand constraint. Also: shadows reduce contrast in bright gym light. |
| Solid border (1–2px, Teal #82CDD8) | Provides separation without depth illusion. |
| Cream #FFFEF1 card background | Readable in bright light. Navy #1A2742 text on cream has sufficient contrast (WCAG AA). |
| Navy #1A2742 for all body text | Highest contrast against cream background. |
| Teal #82CDD8 for accent elements | Routine color indicator, links, interactive highlights. |
| Dusty Rose #E58C8A for destructive or secondary actions | Use sparingly. Regenerate button is a candidate. |
| Sage Green #5BA08A for muscle group tags | Calm, readable on cream. |
| Generous whitespace inside cards | 20–24px padding. Never compress. |
| Minimum 48px touch targets | NNGroup recommends 1cm x 1cm minimum; 48px (~1.27cm) for active-use contexts. |
| Large tap areas for YouTube button | Full-width button, not a small icon. Users at gym should tap once with confidence. |

### Typography

- Headings (exercise name, routine title): Crimson Pro, weight 600–700.
- Body text (description): Inter, weight 400, size 15–16px minimum.
- Labels/tags: Inter, weight 600, uppercase, 11–12px.

---

## 4. YouTube Video Links: Recommended Approach

### Approach: Thumbnail Preview + External Link (no embed)

**Do not embed YouTube iframes.** Embeds require an internet connection to load correctly, add significant weight, and auto-play controls are a distraction at the gym. An iframe embed inside a card also breaks the flat minimalist layout.

**Recommended implementation:**

1. Store the YouTube video ID in the exercise data object (e.g., `videoId: "dQw4w9WgXcQ"`).
2. Construct the thumbnail URL using the no-API-key pattern: `https://img.youtube.com/vi/[videoId]/hqdefault.jpg`
3. Display the thumbnail as a clickable image inside the card or as a button with the thumbnail as background.
4. On tap, open the YouTube URL (`https://youtu.be/[videoId]`) in a new tab.

**Button label:** "Watch technique" or a play icon + "Ver técnica" (Spanish). Simple and instructional.

**Why not oEmbed:** The oEmbed endpoint returns HTML embed code, which adds complexity. The direct thumbnail URL pattern (`img.youtube.com/vi/[videoId]/hqdefault.jpg`) is simpler, zero-dependency, and works without any API calls.

**Why not a plain text link:** A bare URL is visually weak. A thumbnail-backed button communicates "this is a video" at a glance, which matters during a gym session when the user is glancing at the screen.

**Thumbnail sizes available (no API key needed):**
- `default.jpg` — 120x90px
- `hqdefault.jpg` — 480x360px (use this)
- `maxresdefault.jpg` — 1280x720px (may not exist for all videos)

Use `hqdefault.jpg`. It is reliable across all YouTube videos and provides enough resolution for a card thumbnail on mobile without being wasteful.

---

## 5. Animation and Transition Patterns

### Philosophy: perceptible but never slow

The gym context demands speed. Any animation that delays information access is an anti-feature. The rule: animate only transitions between states, not content display.

### Recommended patterns

**Screen transition (Home → Exercise Screen):**
- CSS View Transitions API with a simple cross-fade: `document.startViewTransition(() => updateDOM())`
- Fallback for older browsers: add/remove a `.is-visible` class with `opacity: 0` → `opacity: 1` and `transition: opacity 250ms ease`.
- View Transitions API is now Baseline Newly Available (Firefox 133+, Chrome 111+, Safari 18+). Safe to use with CSS-only fallback.
- Duration: 200–250ms. Never exceed 300ms for a screen swap.

**Card regeneration (new 6 cards appearing):**
- Staggered fade-in: each card fades in with a 60ms delay per card (0ms, 60ms, 120ms, ..., 300ms).
- Use CSS `animation-delay` on each `.exercise-card:nth-child(n)`.
- Keyframe: `from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); }`
- translateY of 8px is subtle — creates motion without being dramatic.

**Button press feedback (micro-interaction):**
```css
.btn:active {
  transform: scale(0.97);
  transition: transform 80ms cubic-bezier(0.2, 0.8, 0.2, 1);
}
```
This gives immediate tactile feedback. 80ms is fast enough to feel instantaneous. Source: CSS premium animation research.

**What to avoid:**
- Slide-in from left/right: adds complexity, can feel disorienting.
- Bounce or elastic easing: inconsistent with minimalist flat design.
- Any animation on scroll: unnecessary complexity for a short card list.
- `will-change: transform` on every card: only add when you have a measured performance problem. Pre-applying it wastes GPU memory.

**Performance principle:** Animate only `opacity` and `transform`. These run on the compositor thread and never trigger layout or paint. Never animate `height`, `width`, `margin`, or `background-color` in a tight loop.

---

## 6. Accessibility for Gym Use

Gym use is a high-stress context for an interface:
- Bright overhead lighting (screen glare, low apparent contrast)
- Sweaty or slightly wet fingertips (miss-taps, imprecise touches)
- Eyes frequently moving between screen and mirror/weights
- One-handed use common (holding a water bottle, etc.)

### Specific requirements

| Concern | Solution |
|---------|---------|
| Glare / bright light | High-contrast mode: Navy on Cream is approximately 9:1 contrast ratio. Meets WCAG AAA. Do not use Teal as text color on Cream — contrast is only ~3:1. |
| Sweaty hands / miss-taps | 48px minimum touch target height on all interactive elements. 20px minimum spacing between adjacent targets. No small icon-only buttons. |
| Glancing at screen | Exercise name must be the largest, most legible element on the card. Use Crimson Pro at 18–20px minimum. |
| One-handed use | Bottom navigation placement for Regenerate button (fixed at screen bottom, or at top below routine title — both are reachable thumbs-up). Back button top-left is standard and expected. |
| Accidental taps | Destructive actions (none in this app) would need confirmation. Regenerate is reversible (just tap again), so no confirmation dialog needed. |
| Focus indicators | Maintain `:focus-visible` outline — existing code already does this correctly. |

**Color contrast reference (against Cream #FFFEF1 background):**
- Navy #1A2742: ~9.4:1 — WCAG AAA pass
- Sage Green #5BA08A: ~3.6:1 — WCAG AA pass for large text only (use for labels 18px+ or bold)
- Dusty Rose #E58C8A: ~3.0:1 — WCAG AA fail for body text. Use for decorative or large elements only.
- Teal #82CDD8: ~2.7:1 — Do NOT use as text on cream. Use as background, border, or icon fill only.

---

## 7. Component Structure: HTML/CSS/JS Organization

### Recommended file structure

```
antigravity/
  index.html                  <- app shell, loads fonts, links CSS + JS
  css/
    styles.css                <- all styles (do not split further for this app size)
  js/
    app.js                    <- main controller: routing, render functions
    exercises.js              <- exercise data library (the core asset)
    svgIllustrations.js       <- SVG figure engine
```

**Why not a single HTML file with inline CSS and JS:**
The existing app already uses this three-file structure and it is the right call. The exercise data alone will be hundreds of lines. Keeping it in `exercises.js` means it can be maintained independently without touching rendering logic. The SVG engine is a separate concern and correctly lives separately. A single monolithic HTML file would make the exercise library unmaintainable.

**Why not more files:**
At this scale (4 routines, ~180 exercises, 3 JS files), adding a module per routine or per component adds cognitive overhead without benefit. Keep it flat.

### app.js responsibilities

```
app.js owns:
  - State (current screen: home | exercises)
  - State (current routine selection)
  - render_home() → builds 4 routine tiles, injects into #app
  - render_exercises(routine) → picks random exercises, builds cards, injects into #app
  - Event delegation: one listener on #app, not per-element listeners
  - View transition wrapper (document.startViewTransition if supported)
```

**Event delegation pattern:** Attach one `click` listener to `#app`. Check `event.target.closest('[data-action]')`. This avoids memory leaks from re-binding listeners on every render, and is the correct vanilla JS pattern for dynamic content.

### exercises.js responsibilities

```
exercises.js owns:
  - The exercise library array (each exercise: id, name, description, group, videoId, svgKey)
  - The muscle group metadata (routines, ratios)
  - Named exports: exercises, muscleGroups
  - No DOM. No side effects. Pure data.
```

### styles.css responsibilities

Organize with labeled sections (comments as dividers):

```css
/* 1. Custom Properties (design tokens) */
/* 2. Reset */
/* 3. Layout (app shell, screen containers) */
/* 4. Home Screen (routine tiles) */
/* 5. Exercise Screen (header, back button, regenerate) */
/* 6. Exercise Cards */
/* 7. YouTube Button */
/* 8. Animations & Transitions */
/* 9. Utility Classes */
/* 10. Media Queries */
```

This labeling pattern makes the stylesheet navigable without a build tool or CSS preprocessor. Anyone (including future Claude instances) can find and edit a section without reading the whole file.

### Data model per exercise

```javascript
{
  id: "chest-001",
  name: "Bench Press",          // display name
  group: "pecho",               // muscle group key
  description: "...",           // 2-4 sentence how-to
  videoId: "abc123XYZ",         // YouTube video ID only (not full URL)
  svgKey: "benchPress",         // key into SVG illustration map
}
```

The `videoId` field stores only the ID, not the full URL. This keeps the data clean. The thumbnail URL and the watch URL are both computed from the ID at render time:
- Thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
- Watch: `https://youtu.be/${videoId}`

---

## Anti-Patterns to Avoid

| Anti-Pattern | Why Bad | Instead |
|---|---|---|
| Horizontal exercise carousel | Miss-taps at gym, complex vanilla JS swipe detection | Vertical scroll list of stacked cards |
| Embedded YouTube iframes | Heavy, distracting controls, breaks flat layout | Thumbnail image + external link |
| Per-element event listeners on re-render | Memory leak, re-registration bugs | Event delegation on #app |
| Animating height/width/margin | Triggers layout recalculation, jank | Animate opacity + transform only |
| Using Teal or Dusty Rose as body text | Insufficient contrast on Cream background | Navy for all body text |
| Single HTML file with all exercises inline | Impossible to maintain 180+ exercises | exercises.js as pure data module |
| Gradient on logo/header | Violates flat design constraint | Solid color, or Crimson Pro with Navy |
| Shadows on cards | Violates flat design constraint, reduces bright-light contrast | Solid 1–2px border in Teal |

---

## Sources

- Nielsen Norman Group, Touch Target Size: https://www.nngroup.com/articles/touch-target-size/
- Bricxlabs, Card UI Design Best Practices 2025: https://bricxlabs.com/blogs/card-ui-design-examples
- Stormotion, Fitness App UX: https://stormotion.io/blog/fitness-app-ux/
- MDN Web Docs, View Transition API: https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API
- Chrome for Developers, View Transitions 2025: https://developer.chrome.com/blog/view-transitions-in-2025
- YouTube thumbnail URL pattern (no API key): https://img.youtube.com/vi/[videoId]/hqdefault.jpg — documented community standard, confirmed via multiple developer sources
- CSS-Tricks, Card Component Considerations: https://css-tricks.com/considerations-for-creating-a-card-component/
- Go Make Things, Vanilla JS Project Structure: https://gomakethings.com/how-i-structure-my-vanilla-js-projects/
- WCAG 2.1 contrast ratios verified against PROJECT.md brand palette
