<!-- GSD:project-start source:PROJECT.md -->
## Project

**Antigravity**

Antigravity is a personal web-based workout guidance app for Fernando Restoy. It presents 4 muscle-group routines, randomly generating 6 exercises per session from a library of 30+ exercises per muscle group. Each exercise includes a description, a quality image showing start and end position, and a YouTube video link. The app is a tool for daily gym use — not a data tracker, but a visual exercise guide.

**Core Value:** Every session surfaces 6 varied, well-explained exercises so Fer never repeats the same workout and always knows exactly how to perform each movement.

### Constraints

- **Tech Stack**: Vanilla HTML/CSS/JS only — Fer is a non-developer, must remain simple to maintain
- **No backend**: All data (exercise library) lives in the JS file — no server, no database
- **Design**: Must follow The Ripple Effect brand palette strictly — no other colors
- **Performance**: Must load fast — Fer uses it at the gym on any device
<!-- GSD:project-end -->

<!-- GSD:stack-start source:research/STACK.md -->
## Technology Stack

## Verdict: Stay Vanilla, but Fix the Architecture
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
### Exercise Images
- Zero HTTP requests for images (performance at the gym on mobile)
- No licensing fees, no CDN dependency, no broken image URLs
- Fully customizable to match The Ripple Effect color palette
- Scales perfectly at any screen size
### YouTube: Links, Not Embeds
### CSS Architecture
## File Architecture
## Data Structure: Exercise Database
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
## Current App: Gaps to Fix in Rebuild
| Issue | Current State | Required State |
|-------|--------------|----------------|
| Brand colors | Dark theme (#0D0D0D, #1A1A2E) | Ripple Effect palette (Cream, Navy, Teal) |
| Typography | Inter only | Crimson Pro (headings) + Inter (body) |
| Exercise library | ~18 per group | 30+ per group (per PROJECT.md requirement) |
| File structure | Monolithic `antigravity.html` (162KB) + separate `js/` files | Use the `js/` multi-file structure exclusively; drop the monolith |
| SVG figure colors | Generic gray | Brand-colored (Teal/Navy figure on Cream background) |
| YouTube | Not implemented in multi-file version | Plain link per exercise (not embed) |
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
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

Conventions not yet established. Will populate as patterns emerge during development.
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

Architecture not yet mapped. Follow existing patterns found in the codebase.
<!-- GSD:architecture-end -->

<!-- GSD:skills-start source:skills/ -->
## Project Skills

No project skills found. Add skills to any of: `.claude/skills/`, `.agents/skills/`, `.cursor/skills/`, or `.github/skills/` with a `SKILL.md` index file.
<!-- GSD:skills-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->



<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
