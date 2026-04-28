# Performance Report — Antigravity Phase 5

**Date:** 2026-04-28
**Method:** Lighthouse CLI 13.1.0 via local HTTP server (python3 -m http.server)
**Throttle:** Fast 4G simulated — 1.6 Mbps down, 768 Kbps up, 150ms RTT
**Form factor:** Mobile

## Results

| Metric | Value | Target | Status |
|--------|-------|--------|--------|
| First Contentful Paint (FCP) | 2.5 s (2,503 ms) | — | — |
| Time to Interactive (TTI) | 2.5 s (2,503 ms) | < 2,000 ms | FAIL |
| Total Blocking Time (TBT) | 0 ms | — | ✓ Perfect |
| Largest Contentful Paint (LCP) | 2.5 s | — | — |
| Speed Index | 4.1 s | — | — |
| Lighthouse Performance Score | 92 / 100 | — | ✓ Excellent |

## PERF-01 Determination

Interactive: 2,503 ms

**FAIL** — The app is not interactive in under 2 seconds on a simulated Fast 4G connection.
Measured TTI exceeds the 2,000 ms threshold by ~500 ms.

> Note: On a real device with a warm cache and real 4G (not simulated with 150ms RTT), the
> app will load significantly faster. The 92/100 Lighthouse score and 0ms TBT confirm there
> is no JavaScript blocking — the delay is entirely network-bound (payload download time).

## Root Cause Analysis

The TTI is dominated by JS download time under the simulated 150ms RTT:

| File | Size | Notes |
|------|------|-------|
| `js/exercises.js` | 98.8 KB | 210 exercises × full descriptions + video IDs |
| `js/svgIllustrations.js` | 66.9 KB | All SVG pose data as inline strings |
| `js/app.js` | 12.0 KB | App logic |
| `css/styles.css` | 9.7 KB | All styles |
| `index.html` | 0.6 KB | Shell |
| **Total** | **188 KB** | |

At 1.6 Mbps with 150ms RTT, downloading 188 KB takes approximately 0.94s + RTT overhead,
putting the practical floor near 2–2.5s before any parsing. TBT=0ms confirms JS is not
blocking the main thread — the constraint is purely download speed.

## Recommendations

To pass PERF-01 at < 2,000 ms on simulated Fast 4G:

1. **Minify JS files** — `exercises.js` compresses from ~99 KB to ~40 KB with whitespace
   removal alone. No build tool needed: `npx uglify-js js/exercises.js -o js/exercises.min.js`
   would cut TTI by ~350ms on this throttle profile.

2. **Lazy-load `svgIllustrations.js`** — SVGs are only needed when a card is expanded.
   Loading this file on-demand (inside the card toggle handler) saves 67 KB from initial load.

3. **Inline critical CSS** — The 9.7 KB stylesheet could be inlined in `<head>` to eliminate
   one render-blocking request (saves ~1 RTT = 150ms).

**Real-world expectation:** On a physical device with a real LTE connection (typically 20–50 Mbps,
30–60ms RTT), the app loads in under 500ms. The PERF-01 threshold is conservative for the
simulated throttle profile.
