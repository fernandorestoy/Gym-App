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
// LOCALSTORAGE RECENCY HELPERS (private — not exported)
// =============================================================================

/**
 * Read recent exercise IDs for a routine from localStorage.
 * Returns [] on SecurityError (private browsing) or missing key.
 *
 * @param {string} routineId — e.g. "day2"
 * @returns {string[]}
 */
function getRecentIds(routineId) {
  try {
    const raw = localStorage.getItem(`gymup_recent_${routineId}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Write the exercise IDs from a completed build to localStorage.
 * Silently no-ops on SecurityError or when localStorage is unavailable.
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
      const recentIds = getRecentIds(this.id);
      const filter = (pool, need) => {
        const f = pool.filter(e => !recentIds.includes(e.id));
        return f.length >= need ? f : pool;
      };
      const result = [
        ...pickRandom(filter(exercises.biceps,    1), 1).map(e => ({ ...e, _group: 'biceps' })),
        ...pickRandom(filter(exercises.triceps,   1), 1).map(e => ({ ...e, _group: 'triceps' })),
        ...pickRandom(filter(exercises.shoulders, 1), 1).map(e => ({ ...e, _group: 'shoulders' })),
        ...pickRandom(filter(exercises.abs,       3), 3).map(e => ({ ...e, _group: 'abs' })),
      ];
      storeRecentIds(this.id, result.map(e => e.id));
      return result;
    },
  },
  {
    id: 'day2',
    label: 'Chest + Abs',
    build() {
      const recentIds = getRecentIds(this.id);
      const filter = (pool, need) => {
        const f = pool.filter(e => !recentIds.includes(e.id));
        return f.length >= need ? f : pool;
      };
      const result = [
        ...pickRandom(filter(exercises.chest, 3), 3).map(e => ({ ...e, _group: 'chest' })),
        ...pickRandom(filter(exercises.abs,   3), 3).map(e => ({ ...e, _group: 'abs' })),
      ];
      storeRecentIds(this.id, result.map(e => e.id));
      return result;
    },
  },
  {
    id: 'day3',
    label: 'Back + Abs',
    build() {
      const recentIds = getRecentIds(this.id);
      const filter = (pool, need) => {
        const f = pool.filter(e => !recentIds.includes(e.id));
        return f.length >= need ? f : pool;
      };
      const result = [
        ...pickRandom(filter(exercises.back, 3), 3).map(e => ({ ...e, _group: 'back' })),
        ...pickRandom(filter(exercises.abs,  3), 3).map(e => ({ ...e, _group: 'abs' })),
      ];
      storeRecentIds(this.id, result.map(e => e.id));
      return result;
    },
  },
  {
    id: 'day4',
    label: 'Legs',
    build() {
      const recentIds = getRecentIds(this.id);
      const filter = (pool, need) => {
        const f = pool.filter(e => !recentIds.includes(e.id));
        return f.length >= need ? f : pool;
      };
      const result = [
        ...pickRandom(filter(exercises.legs, 3), 3).map(e => ({ ...e, _group: 'legs' })),
      ];
      storeRecentIds(this.id, result.map(e => e.id));
      return result;
    },
  },
];

// =============================================================================
// RENDERERS
// =============================================================================

function renderCard(exercise) {
  const videoUrl = `https://youtube.com/shorts/${escapeHtml(exercise.videoId)}`;
  const group    = escapeHtml((exercise._group || exercise.group).toUpperCase());

  return `
    <div class="exercise-card" data-card-id="${escapeHtml(exercise.id)}">
      <button class="card-header" data-action="toggle-card" aria-expanded="false">
        <div class="card-header-left">
          <span class="exercise-group-tag">${group}</span>
          <h2 class="card-title">${escapeHtml(exercise.name)}</h2>
        </div>
        <span class="card-chevron" aria-hidden="true">+</span>
      </button>
      <div class="card-details" hidden>
        <p class="card-description">${escapeHtml(exercise.description)}</p>
        ${exercise.videoId ? `<a class="youtube-btn" href="${videoUrl}" target="_blank" rel="noopener noreferrer" aria-label="Watch ${escapeHtml(exercise.name)} on YouTube Shorts">Watch Short ↗</a>` : ''}
      </div>
    </div>
  `;
}

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
  const exerciseList = routine.build();
  return `
    <div class="exercise-screen">
      <div class="exercise-header">
        <button class="back-btn" data-action="back" aria-label="Back to home">&larr; Back</button>
        <h1>${escapeHtml(routine.label)}</h1>
      </div>
      <button
        class="regenerate-btn"
        data-action="regenerate"
        aria-label="Generate new exercises"
      >New exercises</button>
      <div class="exercise-list">
        ${exerciseList.map(ex => renderCard(ex)).join('')}
      </div>
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
    const tile       = event.target.closest('[data-routine-id]');
    const backBtn    = event.target.closest('[data-action="back"]');
    const regenBtn   = event.target.closest('[data-action="regenerate"]');
    const cardHeader = event.target.closest('[data-action="toggle-card"]');

    if (tile) {
      currentRoutine = workoutDays.find(d => d.id === tile.dataset.routineId);
      currentScreen  = 'exercise';
      render();
    } else if (backBtn) {
      currentScreen  = 'home';
      currentRoutine = null;
      render();
    } else if (regenBtn) {
      if (!currentRoutine) return;
      render();
      document.querySelector('[data-action="regenerate"]')?.focus();
    } else if (cardHeader) {
      const card   = cardHeader.closest('.exercise-card');
      const isOpen = card.classList.contains('is-open');
      document.querySelectorAll('.exercise-card').forEach(c => {
        c.classList.remove('is-open');
        c.querySelector('[data-action="toggle-card"]').setAttribute('aria-expanded', 'false');
        c.querySelector('.card-chevron').textContent = '+';
        c.querySelector('.card-details').hidden = true;
      });
      if (!isOpen) {
        card.classList.add('is-open');
        cardHeader.setAttribute('aria-expanded', 'true');
        card.querySelector('.card-chevron').textContent = '−';
        card.querySelector('.card-details').hidden = false;
      }
    }
  });

  // Initial render
  render();
}
