# Domain Pitfalls: Antigravity Gym App

**Domain:** Personal fitness web app — exercise library with randomized session generation
**Researched:** 2026-04-21
**Confidence:** MEDIUM-HIGH across all areas (verified with multiple sources; gym-specific UX confirmed via fitness UX publications)

---

## Critical Pitfalls

Mistakes that cause rewrites, broken functionality, or a fundamentally bad user experience.

---

### Pitfall 1: Naive Randomization Producing Biased Results

**What goes wrong:** Using `arr.sort(() => Math.random() - 0.5)` — the most commonly copy-pasted shuffle — is mathematically biased. The underlying sort algorithm (quicksort or mergesort) calls the comparator non-uniformly, meaning some exercises appear in certain slots far more often than others. With a 30-exercise library and a 6-pick session, this creates a statistically visible skew: certain exercises feel "sticky" and recur across regenerations.

**Why it happens:** The naive sort-based shuffle is everywhere on Stack Overflow and feels correct. It isn't. Sort-based shuffles violate the assumption that the comparator is a deterministic total order, producing non-uniform permutations.

**Consequences:** The app feels repetitive even with 30+ exercises. This was the core complaint about the old version and would reproduce it exactly.

**Prevention:** Implement the Fisher-Yates (Knuth) shuffle exclusively.

```javascript
function fisherYatesShuffle(array) {
  const arr = [...array]; // never mutate the source library
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function pickExercises(library, count) {
  return fisherYatesShuffle(library).slice(0, count);
}
```

**Detection:** If the same 2–3 exercises appear in most regenerations during development testing, the shuffle is biased.

**Phase/Component:** Addressed in the JS core logic layer, before first render. Non-negotiable from day one.

---

### Pitfall 2: Session-Level Variety Without Cross-Session Memory

**What goes wrong:** A statistically fair shuffle still produces perceived repetition because there is no memory across sessions. If the user opens the app 5 times per week, pure random selection from 30 exercises means ~20% chance any given exercise appears in consecutive sessions. Over time this feels repetitive even if it is mathematically random.

**Why it happens:** "Large library" is conflated with "guaranteed variety." Library size reduces but does not eliminate same-session or next-session repeats.

**Consequences:** The same exercises appear two sessions in a row. The user notices and loses trust in the library size claim.

**Prevention:** Implement a lightweight recency exclusion using `localStorage`. After each session generation, store the IDs of the 6 shown exercises. On next generation, exclude those IDs from the pool before shuffling. This costs ~10 lines of code and zero complexity.

```javascript
const RECENCY_KEY = 'ag_recent_exercises';
const RECENCY_LIMIT = 6; // exclude previous session's picks

function getRecentIds() {
  return JSON.parse(localStorage.getItem(RECENCY_KEY) || '[]');
}

function saveRecentIds(ids) {
  localStorage.setItem(RECENCY_KEY, JSON.stringify(ids));
}

function pickWithRecencyExclusion(library, count) {
  const recent = getRecentIds();
  const eligible = library.filter(ex => !recent.includes(ex.id));
  // fallback: if pool is too small after exclusion, use full library
  const pool = eligible.length >= count ? eligible : library;
  const picks = fisherYatesShuffle(pool).slice(0, count);
  saveRecentIds(picks.map(ex => ex.id));
  return picks;
}
```

**Detection:** During testing, hit "Regenerate" 5–6 times and manually check for repeat exercises across sessions over several days.

**Phase/Component:** Randomization layer, alongside Fisher-Yates implementation.

---

### Pitfall 3: YouTube Links Breaking Over Time (Link Rot)

**What goes wrong:** YouTube videos are deleted, made private, or taken down via copyright strikes constantly. YouTube removes millions of videos monthly. Exercise tutorial videos are particularly vulnerable — many are uploaded by personal trainers who later delete their channel, or by fitness brands that get DMCA-struck for background music.

**Why it happens:** The exercise library is a static JS file. There is no automated check that verifies links are still live. A link that worked on build day can be dead within weeks.

**Consequences:** Users tap a video link and get a "video unavailable" page mid-workout. Broken references in a gym context are high-friction because the user cannot easily troubleshoot.

**Prevention:**
1. **At build time:** Prefer channels with institutional backing (official gym equipment brands, certified PT channels with large subscriber bases, major fitness publications). These are more stable than individual creators.
2. **Use YouTube's privacy-enhanced embed domain (`youtube-nocookie.com`)** if embedding directly — reduces tracking and slightly reduces removal risk from marketing tools.
3. **Store links as external redirects (anchor tags opening in new tab), not embeds** — if a video is removed, the failure is contained to a blank YouTube page, not a broken embedded player inside the card.
4. **Quarterly link audit:** Build a plain checklist in the exercise JS file itself — a comment block listing each video URL. Review it quarterly. A single grep through the file will surface all URLs for batch checking.
5. **Prefer videos that demonstrate the movement generically** (e.g. "how to do a cable row") over brand-specific or personality-specific content.

**Detection:** Warning sign is any link opening to YouTube's "Video unavailable" screen. Run a quarterly manual spot-check of 10 random links.

**Phase/Component:** Exercise data file (`exercises.js`) — build the link audit system at data-entry time, not as an afterthought.

---

### Pitfall 4: Images Killing Load Speed at the Gym

**What goes wrong:** Fitness apps are used on mobile, often on gym Wi-Fi (shared, slow) or cellular. Unoptimized images — typical PNGs or JPEGs at full resolution — can each be 300KB–2MB. With 6 exercise cards per session, that's 1.8MB–12MB of image data on first load, causing blank cards and perceived brokenness mid-workout.

**Why it happens:** Images are added during content creation without optimization. The developer (or Claude) saves whatever file the source provides without compression or resizing.

**Consequences:** Cards appear blank for several seconds. In a gym environment with limited patience, this reads as "the app is broken." The user regenerates or closes.

**Prevention:**
1. **Maximum image dimensions:** 600×400px for 2x retina display on a 300×200px card. No image should exceed this.
2. **WebP format** where possible — 25–35% smaller than JPEG at equivalent quality. Fall back to JPEG, never PNG for photos.
3. **Compress before adding to project:** Use squoosh.app (free, browser-based) — target under 60KB per image.
4. **Native lazy loading on below-fold images:** `<img loading="lazy">` for cards not visible on initial render. Do NOT lazy-load the first 2 cards (above the fold).
5. **Explicit width/height attributes** on every `<img>` tag to prevent layout shift (CLS) while loading.
6. **Fallback placeholder:** If an image fails to load, show the brand's Navy background with the exercise name in Cream text — never a broken image icon.

**Detection:** Open DevTools Network tab, throttle to "Fast 3G," load the app, and observe image sizes and load times. Any single image over 100KB is a flag.

**Phase/Component:** Image optimization happens during content population (adding exercises to the library). Fallback UI is part of exercise card component.

---

### Pitfall 5: Exercise Card Information Overload

**What goes wrong:** Designers add too much information to each card — muscles worked, difficulty level, equipment needed, reps, sets, rest time, tips, warnings — turning a quick reference into a wall of text. In a gym, the user glances at the card for 3–5 seconds max while walking to the equipment.

**Why it happens:** "More information is more helpful" intuition. Each data field seems useful individually, but competes visually with every other field.

**Consequences:** The visual hierarchy collapses. The user cannot extract the one thing they need (what does this exercise look like, what do I do) quickly. The app feels overwhelming rather than helpful. Research confirms 49% of users abandon apps due to poor design.

**Prevention:** Enforce a strict information hierarchy per card — three tiers only:
- **Tier 1 (always visible, large):** Exercise name + image
- **Tier 2 (secondary, readable):** Brief how-to description (2 sentences max — action-focused, no passive voice)
- **Tier 3 (tap/link):** YouTube video — opens externally, does not live in the card

No difficulty badges, no equipment lists, no muscle diagrams, no rep counts. The PROJECT.md spec is already correct on this — enforce it strictly during implementation.

**Detection:** Show a card to someone unfamiliar with the app. Ask: "What should you do?" If they cannot answer in 5 seconds, the card has too much or wrong hierarchy.

**Phase/Component:** Exercise card component design — enforce before building. Do not add fields "just in case."

---

## Moderate Pitfalls

---

### Pitfall 6: Poor Touch Target Sizing in Gym Conditions

**What goes wrong:** Buttons and interactive elements are sized for a calm desktop user. In a gym: hands are sweaty, the user is standing or between sets, lighting may be bright (causing glare), and attention is split. Tapping errors on small targets cause frustration at exactly the wrong moment.

**Why it happens:** Desktop-first or average-case design. Standard touch targets (32px) pass WCAG but fail real gym conditions.

**Prevention:**
- Minimum touch target: **48×48px** (WCAG recommends 44×44px; add 4px buffer for gym use)
- The "Regenerate" button — the most-used element — should be at minimum 56px tall and full-width or near-full-width on mobile
- Sufficient spacing between interactive elements: minimum 8px gap to prevent adjacent-target misfires with a sweat-covered thumb
- The YouTube link on each card should be a large tap zone (the entire link row, not just the text)
- **High contrast in bright environments:** The brand's Navy (#1A2742) on Cream (#FFFEF1) provides strong contrast. Avoid light-on-light or dark-on-dark combinations anywhere
- Test the app outdoors or under a bright desk lamp — screen glare reveals contrast problems invisible in dim rooms

**Detection:** Use the app standing up, with one hand, tapping quickly. Any element that requires a second attempt is too small or too close to another target.

**Phase/Component:** CSS/styling phase. Establish touch target minimums as CSS variables from the start.

---

### Pitfall 7: YouTube Autoplay and Embedding in Mobile Browsers

**What goes wrong:** If YouTube videos are embedded via `<iframe>` directly in exercise cards, autoplay fails silently on iOS Safari (requires prior user interaction), and some mobile browsers block cross-origin iframes entirely. The embedded player also adds significant page weight and can interfere with scroll behavior on mobile.

**Why it happens:** Embedding feels more seamless than linking. Developers default to `<iframe>` without testing on real iOS devices.

**Consequences:** Videos that play on desktop fail on iPhone. The embed occupies card space even when broken. Scroll hijacking from the iframe disrupts the card layout.

**Prevention:** Do not embed YouTube iframes in exercise cards. Use anchor links (`<a href="..." target="_blank" rel="noopener">`) styled as a prominent "Watch video" button. This approach:
- Works on 100% of devices
- Does not add iframe overhead
- Contains breakage — a dead link opens YouTube, not a broken embed inside the card
- Avoids all autoplay policy conflicts

If embedding is ever reconsidered: use `youtube-nocookie.com` domain, add `loading="lazy"` to the iframe, and never use `autoplay=1`.

**Detection:** Test on a real iPhone in Safari (not Chrome on iOS) — this is the most restrictive mobile browser environment.

**Phase/Component:** Exercise card component — link approach decided before HTML is written.

---

### Pitfall 8: JS Exercise Data Structure Becoming Unmaintainable

**What goes wrong:** The exercise library starts as a single flat array in a JS file. It works at 20 exercises. At 120+ exercises (30 per muscle group × 4 groups), the file becomes a long, unstructured scroll. Adding a new exercise requires finding the right location manually, and bugs (wrong muscle group, missing field) are easy to introduce and hard to detect.

**Why it happens:** The simplest structure is chosen early and never revisited. One large array feels manageable at first.

**Consequences:** Content maintenance becomes error-prone. A muscle group assignment error means the wrong exercises appear in a session. Missing YouTube links produce undefined errors silently.

**Prevention:**
1. **Group by muscle from the start.** Use a top-level object keyed by muscle group, each containing its array:
```javascript
const EXERCISES = {
  chest: [ { id: 'chest_01', name: '...', description: '...', image: '...', video: '...' }, ... ],
  back:  [ ... ],
  abs:   [ ... ],
  arms:  [ ... ],
  shoulders: [ ... ],
  legs:  [ ... ]
};
```
2. **Required fields enforced by convention** — every exercise object must have: `id`, `name`, `description`, `image`, `video`. Document this at the top of the file as a comment schema.
3. **Unique, stable IDs** for each exercise (e.g. `chest_01`, `back_07`) — needed for the recency exclusion system (Pitfall 2) and any future debugging.
4. **Validate on load (dev only):** A small self-checking function that runs in development and logs warnings for any exercise missing required fields.

**Detection:** If adding a new exercise requires scrolling through 100+ lines to find the right group, the structure needs refactoring.

**Phase/Component:** Data architecture — establish correct structure before any exercises are added. Refactoring 120 objects is painful; designing correctly for 5 is trivial.

---

## Minor Pitfalls

---

### Pitfall 9: Images Blurry on Retina Displays

**What goes wrong:** Images are sized for standard displays (1x pixel ratio). On retina screens (iPhone, modern Android, MacBook), they appear blurry or pixelated because the browser stretches 1x images to fill 2x pixel density.

**Prevention:** Store all images at 2x the intended display size. If a card image displays at 300px wide, the source image should be 600px wide minimum. No `srcset` complexity needed given the simple, static nature of this app — just always use 2x source dimensions.

**Detection:** View the app on a MacBook Retina screen or iPhone — blurry images are immediately visible.

**Phase/Component:** Content population phase — check resolution before adding each image.

---

### Pitfall 10: Regenerate Causing Jarring Layout Shifts

**What goes wrong:** When the user taps "Regenerate," the new set of 6 exercises renders instantly, causing the entire card grid to re-paint. If exercise names vary in length or image dimensions differ, cards resize, causing the page to jump and potentially scrolling the user away from where they were.

**Prevention:**
- Fix card dimensions in CSS — cards should always be the same height regardless of content length
- Use CSS `min-height` on description text areas so cards don't collapse when descriptions are short
- Implement a brief CSS transition on the card grid (150ms opacity fade) to mask the re-render — this also signals to the user that the content has changed

**Detection:** Tap Regenerate rapidly 5–6 times. Any visible jump or scroll position change indicates a layout shift.

**Phase/Component:** CSS layout + Regenerate JS logic.

---

### Pitfall 11: "Feels Like the Same App Every Time" Without Visual Feedback

**What goes wrong:** The app generates a new set of exercises, but because the visual design is identical each time (same colors, same layout, same card structure), the user cannot tell at a glance that something has changed. This amplifies the perception of repetitiveness even when the exercises are different.

**Prevention:** A subtle visual cue on regeneration — a brief card animation (slide in, fade in, or a one-time color flash on the Regenerate button) confirms the change happened. The content itself changing is not always perceptible at a glance.

**Detection:** Show the app to someone and ask them to regenerate. Ask: "Did the exercises change?" If they are unsure without reading all six names, the feedback is insufficient.

**Phase/Component:** Regenerate interaction logic — add after core functionality is working.

---

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|---|---|---|
| Exercise data file creation | Unmaintainable flat structure (Pitfall 8) | Use grouped object structure with schema from day one |
| Adding 120+ exercises | Missing fields, wrong groups, broken video links | Validate required fields on each entry; audit links before marking complete |
| Randomization logic | Biased shuffle (Pitfall 1) | Fisher-Yates only; never sort-based shuffle |
| Randomization logic | Cross-session repeats (Pitfall 2) | localStorage recency exclusion — implement alongside shuffle |
| Card component design | Information overload (Pitfall 5) | Three-tier hierarchy; no extra fields "just in case" |
| Image sourcing | Slow load / blurry retina (Pitfalls 4, 9) | Compress to <60KB; source at 2x dimensions |
| YouTube integration | Embedding on mobile (Pitfall 7) | Anchor links only; no iframes in cards |
| YouTube integration | Link rot (Pitfall 3) | Prefer institutional channels; quarterly audit checklist |
| CSS/styling | Small touch targets (Pitfall 6) | 48px minimum; full-width Regenerate button |
| Regenerate interaction | Layout shift (Pitfall 10) | Fixed card heights in CSS from the start |

---

## Confidence Notes

- **Randomization (Pitfalls 1, 2):** HIGH confidence. Fisher-Yates bias is mathematically documented; recency exclusion is a standard pattern.
- **YouTube pitfalls (3, 7):** HIGH confidence. Autoplay policies are documented by Google; link rot rate is a known real-world problem.
- **Image handling (4, 9):** HIGH confidence. Web performance standards are well-established.
- **Exercise card UX (5, 11):** MEDIUM-HIGH confidence. Based on multiple fitness app UX research sources; gym-specific conditions (sweat, glare) are underserved in published research but consistent across practitioner accounts.
- **Touch targets in gym conditions (6):** MEDIUM confidence. WCAG minimums are documented; the gym-specific buffer (+4px) is a reasoned addition, not published standard.
- **JS data structure (8):** HIGH confidence. Standard software engineering pattern; specific to this project's scale.

---

## Sources

- Fisher-Yates algorithm: [DEV Community](https://dev.to/tanvir_azad/fisher-yates-shuffle-the-right-way-to-randomize-an-array-4d2p), [Wikipedia](https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle)
- Fitness app UX mistakes: [MadAppGang](https://madappgang.com/blog/the-best-fitness-app-design-examples-and-typical-mistakes/), [Sport Fitness Apps](https://www.sportfitnessapps.com/blog/5-uiux-mistakes-in-fitness-apps-to-avoid)
- YouTube embed parameters: [Google Developers](https://developers.google.com/youtube/player_parameters), [YouTube NoCookie guide](https://www.ignite.video/en/articles/basics/youtube-no-cookie)
- YouTube mobile autoplay: [lite-youtube-embed issue tracker](https://github.com/paulirish/lite-youtube-embed/issues/6)
- Responsive images / retina: [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Responsive_images), [Cloudinary](https://cloudinary.com/guides/web-performance/react-lazy-loading-images)
- JS data structure efficiency: [GeeksforGeeks](https://geeksforgeeks.org/array-vs-object-efficiency-in-javascript)
- Fitness app gym-environment UX: [Stormotion](https://stormotion.io/blog/fitness-app-ux/), [Eastern Peak](https://easternpeak.com/blog/fitness-app-design-best-practices/)
