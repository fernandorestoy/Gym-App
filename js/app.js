/**
 * GymUp — App Entry Point
 *
 * Phase 2: Routing state, screen renderers, event delegation.
 * Phase 3 adds: exercise cards, Fisher-Yates recency exclusion, Regenerate button.
 */

import { exercises } from './exercises.js';

// =============================================================================
// ROUTING STATE
// =============================================================================

let currentScreen = 'home';    // 'home' | 'exercise'
let currentRoutine = null;     // null | object from workoutDays

// =============================================================================
// UTILITIES (exported — required by test contract)
// =============================================================================

/**
 * Escape dynamic text before injecting into innerHTML.
 * Prevents XSS from exercise names, descriptions, or routine labels.
 *
 * @param {*} str — value to escape (coerced to string)
 * @returns {string}
 */
export function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Select `count` random items from `source` using a bounded Fisher-Yates
 * partial shuffle. Never mutates the input array.
 *
 * @param {Array} source — input array (not mutated)
 * @param {number} count — number of items to return
 * @param {function} [randFn=Math.random] — injectable RNG for testing
 * @returns {Array} — array of `count` unique items from source
 */
export function pickRandom(source, count, randFn = Math.random) {
  const pool = [...source];
  const safeCount = Math.min(count, pool.length);
  for (let i = pool.length - 1; i > pool.length - 1 - safeCount; i--) {
    const j = Math.floor(randFn() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(pool.length - safeCount);
}

// =============================================================================
// ROUTINE DEFINITIONS (exported — required by test contract)
// =============================================================================

/**
 * The 4 workout routines. Each has:
 *   id     {string} — matches data-routine-id in the DOM
 *   label  {string} — display name shown on tiles and exercise screen
 *   build  {function} — returns an array of exercises with _group set
 *
 * _group must equal the exercises.js group key exactly (English, lowercase).
 *
 * Exercise counts per day (matching test contract):
 *   day1: 1 biceps + 1 triceps + 1 shoulders + 3 abs = 6 total
 *   day2: 3 chest + 3 abs = 6 total
 *   day3: 3 back + 3 abs = 6 total
 *   day4: 3 legs = 3 total
 */
export const workoutDays = [
  {
    id: 'day1',
    label: 'Arms / Shoulders + Abs',
    build() {
      return [
        ...pickRandom(exercises.biceps,    1).map(e => ({ ...e, _group: 'biceps' })),
        ...pickRandom(exercises.triceps,   1).map(e => ({ ...e, _group: 'triceps' })),
        ...pickRandom(exercises.shoulders, 1).map(e => ({ ...e, _group: 'shoulders' })),
        ...pickRandom(exercises.abs,       3).map(e => ({ ...e, _group: 'abs' })),
      ];
    },
  },
  {
    id: 'day2',
    label: 'Chest + Abs',
    build() {
      return [
        ...pickRandom(exercises.chest, 3).map(e => ({ ...e, _group: 'chest' })),
        ...pickRandom(exercises.abs,   3).map(e => ({ ...e, _group: 'abs' })),
      ];
    },
  },
  {
    id: 'day3',
    label: 'Back + Abs',
    build() {
      return [
        ...pickRandom(exercises.back, 3).map(e => ({ ...e, _group: 'back' })),
        ...pickRandom(exercises.abs,  3).map(e => ({ ...e, _group: 'abs' })),
      ];
    },
  },
  {
    id: 'day4',
    label: 'Legs',
    build() {
      return [
        ...pickRandom(exercises.legs, 3).map(e => ({ ...e, _group: 'legs' })),
      ];
    },
  },
];

// =============================================================================
// RENDERERS
// =============================================================================

function renderHome() {
  return `
    <div class="home-screen">
      <h1 class="app-title">GymUp</h1>
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

function render() {
  document.getElementById('app').innerHTML =
    currentScreen === 'home'
      ? renderHome()
      : renderExercise(currentRoutine);
}

// =============================================================================
// DOM BOOTSTRAP — only runs in a browser (not in Node.js test runner)
// =============================================================================

if (typeof document !== 'undefined') {
  // Event delegation — set up once; survives innerHTML re-renders
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

  // Initial render
  render();
}
