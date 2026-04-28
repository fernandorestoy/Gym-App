# Technology Stack Research: Antigravity

**Project:** Antigravity — personal workout guidance web app
**Researched:** 2026-04-21
**Confidence:** HIGH (all recommendations verified against official docs, MDN, and multiple credible sources)

---

## Verdict: Stay Vanilla, but Fix the Architecture

Vanilla HTML/CSS/JS is the correct long-term choice for this app. The reason it needs a rebuild is not a stack problem — it is a content and design problem (wrong colors, repeated exercises, no Crimson Pro). No framework is warranted. The existing multi-file structure (exercises.js, app.js, svgIllustrations.js) with ES modules is the right approach and should be kept.

---

## Recommended Stack

### Core Runtime

| Layer | Technology | Rationale |
|-------|------------|-----------|
| Markup | HTML5 (single entry point `index.html`) | Zero overhead. Browser-native. No toolchain. |
| Styles | Vanilla CSS with custom properties | Sufficient for this app's complexity. Container queries and `clamp()` handle all responsive needs natively in 2025. No preprocessor needed. |
| Logic | Vanilla JavaScript, ES Modules (no bundler) | Already in use. ES modules (`import`/`export`) give clean file separation without a build step. Node.js `"type": "module"` is already set in package.json — correct. |
| Data | JS module exporting an array of objects (`exercises.js`) | Correct pattern. Better than JSON: no fetch needed, no async loading, full IDE autocomplete, inline comments. |

### Fonts

| Font | Use | Loading Method |
|------|-----|----------------|
| Crimson Pro | Headings (h1, h2, day titles) | Google Fonts CSS API v2 with `display=swap` |
| Inter | Body, descriptions, labels | Google Fonts CSS API v2 with `display=swap` |

**Implementation (paste in `<head>`):**
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,400;0,600;1,400&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
```

**Note:** The current app only loads Inter. Crimson Pro is missing — this is a brand compliance gap that must be corrected in the rebuild.

### Exercise Images

**Recommended approach: Custom inline SVG figures (what the current app already does — keep and improve it)**

The existing `svgIllustrations.js` engine generates anatomical stick figures programmatically. This is the right architecture for this app because:

- Zero HTTP requests for images (performance at the gym on mobile)
- No licensing fees, no CDN dependency, no broken image URLs
- Fully customizable to match The Ripple Effect color palette
- Scales perfectly at any screen size

**What needs fixing:** The current SVG figures use generic gray tones. They should use brand colors (Navy `#1A2742`, Teal `#82CDD8`) to feel cohesive with the design.

**Do not use:** External image services (ExRx.net screenshots, Google Images, Freepik) — licensing issues, dependency on external URLs, performance hit. Do not use animated GIFs — file size problem on mobile.

**Alternative only if SVG engine is scrapped:** WorkoutLabs (workoutlabs.com) offers licensed exercise illustrations as SVG/PNG — clean, anatomically accurate, professional. However, this adds a licensing cost and makes the exercise library harder to maintain. Stick with the SVG engine.

### YouTube: Links, Not Embeds

**Recommendation: Plain `<a>` links to YouTube videos, not iframes.**

**Rationale:**

Embedding YouTube iframes has serious tradeoffs for this specific app:
1. **Performance:** A single YouTube iframe loads 450KB–1.3MB of JavaScript before the user even clicks play. At the gym on mobile data, this is unacceptable.
2. **Privacy:** Even `youtube-nocookie.com` still sends user data to Google on play — it is not truly privacy-safe. For a personal tool this is a minor concern, but the performance issue alone is decisive.
3. **Complexity:** Managing autoplay behavior, mobile Safari restrictions, and iframe sandboxing adds unnecessary maintenance burden.

**Simple, correct pattern:**
```html
<a href="https://www.youtube.com/watch?v=[ID]" target="_blank" rel="noopener">
  Ver video de demostración
</a>
```

Style it as a button. It opens YouTube in a new tab. The user watches, comes back. Simple, fast, zero dependencies.

**Only use embeds if:** Fer explicitly decides he needs video playback inline without leaving the app. If that becomes a requirement, use the `lite-youtube-embed` web component (paulirish/lite-youtube-embed on GitHub) — a facade pattern that loads a thumbnail image only, triggering the real player on click. It is 224x faster than a direct iframe. But this adds a JS dependency and is unnecessary for the current scope.

### CSS Architecture

**Recommended approach: CSS custom properties + mobile-first media queries, no preprocessor, no framework**

The project already has a solid CSS foundation in `css/styles.css`. It needs to be updated to:

1. Replace the dark theme variables with The Ripple Effect palette
2. Add Crimson Pro for heading elements
3. Use `clamp()` for fluid typography (eliminates most font-size media queries)
4. Use CSS Grid for the exercise card layout

**Brand palette to wire as CSS variables:**
```css
:root {
  --color-navy:       #1A2742;
  --color-teal:       #82CDD8;
  --color-cream:      #FFFEF1;
  --color-dusty-rose: #E58C8A;
  --color-sage:       #5BA08A;
}
```

**Do not use:** Tailwind CSS — requires a build step and is unnecessary overhead for a one-person personal tool. Bootstrap — too heavy, opinionated, fights against a minimalist custom design. CSS-in-JS — not applicable in vanilla JS context.

---

## File Architecture

The rebuild should use the same multi-file structure, slightly clarified:

```
index.html              ← entry point (minimal shell)
css/
  styles.css            ← all styles, brand palette, responsive layout
js/
  exercises.js          ← exercise database (array of objects, 30+ per group)
  svgIllustrations.js   ← SVG figure engine
  app.js                ← routing, random selection, DOM rendering
```

**Do not consolidate everything into one HTML file.** The current `antigravity.html` monolith (162KB) is hard to navigate and maintain. The multi-file structure in `js/` is cleaner.

---

## Data Structure: Exercise Database

**Recommended: JS module exporting an array of objects, one object per exercise**

Current structure in `exercises.js` is correct. Each exercise object should have:

```javascript
{
  id: "sentadilla-goblet",          // kebab-case string, unique across all groups
  name: "Sentadilla Goblet",        // display name
  group: "gluteos-piernas",         // muscle group id
  equipment: "mancuernas",          // enum: "mancuernas" | "maquina" | "cintas" | "cuerpo"
  description: "...",               // one sentence overview
  steps: ["...", "..."],            // ordered how-to steps
  tips: "...",                      // one coaching tip
  youtube: "https://youtu.be/...",  // verified YouTube URL (short format preferred)
  svg: "sentadilla-goblet",         // key into SVG illustration map (or inline SVG function)
}
```

**Do not use JSON files loaded via `fetch()`** — async loading means exercises might not be ready when the page renders, requiring loading states and error handling that add unnecessary complexity. A JS module resolves synchronously at parse time.

---

## What NOT to Use

| Technology | Why Not |
|------------|---------|
| React / Vue / Svelte | Requires build step, npm dependency hell, overkill for a 4-screen personal tool |
| Tailwind CSS | Build step required; fights against a custom minimalist design |
| Bootstrap | Too opinionated; overrides needed constantly; adds ~30KB of unused CSS |
| YouTube iframes | 450KB–1.3MB payload per embed; kills mobile performance |
| External image APIs | Creates CDN dependency; potential licensing issues; URL rot |
| JSON + fetch() for exercise data | Requires async handling; JS module is simpler and synchronous |
| localStorage for state | Not needed — the app has no persistent state (no tracking) |
| Service workers / PWA | Adds significant complexity; not required unless offline mode is wanted |
| TypeScript | Requires a build step; not maintainable by a non-developer |

---

## Current App: Gaps to Fix in Rebuild

| Issue | Current State | Required State |
|-------|--------------|----------------|
| Brand colors | Dark theme (#0D0D0D, #1A1A2E) | Ripple Effect palette (Cream, Navy, Teal) |
| Typography | Inter only | Crimson Pro (headings) + Inter (body) |
| Exercise library | ~18 per group | 30+ per group (per PROJECT.md requirement) |
| File structure | Monolithic `antigravity.html` (162KB) + separate `js/` files | Use the `js/` multi-file structure exclusively; drop the monolith |
| SVG figure colors | Generic gray | Brand-colored (Teal/Navy figure on Cream background) |
| YouTube | Not implemented in multi-file version | Plain link per exercise (not embed) |

---

## Sources

- MDN Web Docs — ES Modules: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules
- MDN Web Docs — Responsive Design: https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Responsive_Design
- Google Fonts CSS API v2: https://developers.google.com/fonts/docs/css2
- lite-youtube-embed (Paul Irish): https://github.com/paulirish/lite-youtube-embed
- YouTube embed best practices (web.dev): https://web.dev/articles/embed-best-practices
- YouTube privacy-enhanced mode analysis: https://www.stefanjudis.com/notes/the-lie-of-youtubes-privacy-enhanced-embed-mode/
- Vanilla JS resurgence 2025 (DEV Community): https://dev.to/arkhan/why-vanilla-javascript-is-making-a-comeback-in-2025-4939
- free-exercise-db (open source exercise JSON): https://github.com/yuhonas/free-exercise-db
- WorkoutLabs exercise illustration licensing: https://workoutlabs.com/exercise-illustrations-licensing/
