/**
 * GymUp — App Entry Point
 *
 * Screens: home | exercise | nutrition
 * Workout split: Push / Pull / Legs / Upper Body
 * Push anchors: Overhead Press, Incline DB Press, Dips
 * Pull anchors: Pull-Ups, Barbell Row
 * Legs anchors: Back Squat, Bulgarian Split Squat, Hip Thrust
 */

import { exercises } from './exercises.js';

// =============================================================================
// ROUTING STATE
// =============================================================================

let currentScreen  = 'home';   // 'home' | 'exercise' | 'nutrition'
let currentRoutine = null;     // null | object from workoutDays

// =============================================================================
// UTILITIES (exported — required by test contract)
// =============================================================================

/**
 * Escape dynamic text before injecting into innerHTML.
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
// LOCALSTORAGE HELPERS (private)
// =============================================================================

function getRecentIds(routineId) {
  try {
    const raw = localStorage.getItem(`gymup_recent_${routineId}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function storeRecentIds(routineId, ids) {
  try {
    localStorage.setItem(`gymup_recent_${routineId}`, JSON.stringify(ids));
  } catch { /* SecurityError — private browsing or storage full */ }
}

function getSavedWeight(exerciseId) {
  try {
    return localStorage.getItem(`gymup_weight_${exerciseId}`) || '';
  } catch {
    return '';
  }
}

function saveWeight(exerciseId, value) {
  try {
    localStorage.setItem(`gymup_weight_${exerciseId}`, value);
  } catch { /* SecurityError — ignore silently */ }
}

// =============================================================================
// ROUTINE DEFINITIONS (exported — required by test contract)
// =============================================================================

/**
 * Workout routines + Nutrition tile.
 *
 * type: 'workout' — has build(), appears as exercise screen
 * type: 'nutrition' — no build(), renders nutrition screen
 *
 * Anchor logic (always shown first):
 *   push:  index 0–2 (Overhead Press, Incline DB Press, Dips)       + 2 random from 3–11
 *   pull:  index 0–1 (Pull-Ups, Barbell Row)                        + 3 random from 2–11
 *   legs:  index 0–2 (Back Squat, Bulgarian Split Squat, Hip Thrust) + 2 random from 3–11
 *   upper: guaranteed 2 push + 2 pull + 1 bonus                     = 5 total
 */
export const workoutDays = [
  {
    id: 'push',
    label: 'Push',
    subtitle: 'Day 1',
    type: 'workout',
    build() {
      const recentIds = getRecentIds(this.id);
      const anchors = exercises.push.slice(0, 3);
      const pool    = exercises.push.slice(3);
      const filtered = pool.filter(e => !recentIds.includes(e.id));
      const rand = pickRandom(filtered.length >= 1 ? filtered : pool, 1);
      const result = [...anchors, ...rand].map(e => ({ ...e, _group: 'push' }));
      storeRecentIds(this.id, result.map(e => e.id));
      return result;
    },
  },
  {
    id: 'pull',
    label: 'Pull',
    subtitle: 'Day 2',
    type: 'workout',
    build() {
      const recentIds = getRecentIds(this.id);
      const anchors = exercises.pull.slice(0, 2);
      const pool    = exercises.pull.slice(2);
      const filtered = pool.filter(e => !recentIds.includes(e.id));
      const rand = pickRandom(filtered.length >= 3 ? filtered : pool, 3);
      const result = [...anchors, ...rand].map(e => ({ ...e, _group: 'pull' }));
      storeRecentIds(this.id, result.map(e => e.id));
      return result;
    },
  },
  {
    id: 'legs',
    label: 'Legs',
    subtitle: 'Day 3',
    type: 'workout',
    build() {
      const recentIds = getRecentIds(this.id);
      const anchors = exercises.legs.slice(0, 3);
      const pool    = exercises.legs.slice(3);
      const filtered = pool.filter(e => !recentIds.includes(e.id));
      const rand = pickRandom(filtered.length >= 1 ? filtered : pool, 1);
      const result = [...anchors, ...rand].map(e => ({ ...e, _group: 'legs' }));
      storeRecentIds(this.id, result.map(e => e.id));
      return result;
    },
  },
  {
    id: 'upper',
    label: 'Upper Body',
    subtitle: 'Day 4',
    type: 'workout',
    build() {
      const recentIds = getRecentIds(this.id);
      const pushIds = new Set(['upper-001', 'upper-002', 'upper-005', 'upper-006', 'upper-009', 'upper-011']);
      const pushPool = exercises.upper.filter(e => pushIds.has(e.id));
      const pullPool = exercises.upper.filter(e => !pushIds.has(e.id));
      const filteredPush = pushPool.filter(e => !recentIds.includes(e.id));
      const filteredPull = pullPool.filter(e => !recentIds.includes(e.id));
      const selPush = pickRandom(filteredPush.length >= 2 ? filteredPush : pushPool, 2);
      const selPull = pickRandom(filteredPull.length >= 2 ? filteredPull : pullPool, 2);
      const selectedIds = new Set([...selPush, ...selPull].map(e => e.id));
      const remaining = exercises.upper.filter(e => !selectedIds.has(e.id) && !recentIds.includes(e.id));
      const fifth = pickRandom(
        remaining.length >= 1 ? remaining : exercises.upper.filter(e => !selectedIds.has(e.id)),
        1
      );
      const result = [...selPush, ...selPull, ...fifth].map(e => ({ ...e, _group: 'upper' }));
      storeRecentIds(this.id, result.map(e => e.id));
      return result;
    },
  },
  {
    id: 'nutrition',
    label: 'Nutrition',
    type: 'nutrition',
  },
];

// =============================================================================
// RECIPE DATA
// =============================================================================

const lunchRecipes = [
  {
    name: 'Steak & Avocado Bowl',
    ingredients: ['Steak', 'Avocado', 'Vegetables'],
    method: 'Season steak with salt and pepper. Sear in a hot pan 3–4 minutes per side for medium. Rest 5 minutes, then slice thin. Plate with sliced avocado and seasonal vegetables.',
    imageUrl: 'https://images.unsplash.com/photo-1659432764759-46ad8acc6527?w=600&auto=format&fit=crop',
  },
  {
    name: 'Turkey Lettuce Wraps',
    ingredients: ['Turkey', 'Avocado', 'Cheese', 'Vegetables'],
    method: 'Lay large lettuce leaves flat. Layer sliced turkey, thin cheese slices, and avocado strips in the center. Add raw vegetables, roll up firmly, and secure with a toothpick. Ready in 5 minutes.',
    imageUrl: 'https://images.unsplash.com/photo-1655556030356-f8457170dd0d?w=600&auto=format&fit=crop',
  },
  {
    name: 'Salmon & Cottage Cheese Plate',
    ingredients: ['Smoked salmon', 'Cottage cheese', 'Vegetables'],
    method: 'Spoon a generous scoop of cottage cheese onto a plate. Drape smoked salmon slices alongside. Add cucumber, tomatoes, or leafy greens. Season with black pepper.',
    imageUrl: 'https://images.unsplash.com/photo-1546970361-407ddc8053fc?w=600&auto=format&fit=crop',
  },
  {
    name: 'Turkey & Cheese Omelette',
    ingredients: ['Eggs', 'Turkey', 'Cheese', 'Vegetables'],
    method: 'Beat 3 eggs with salt. Pour into a hot oiled pan over medium heat. When the edges set, layer diced turkey, cheese, and vegetables on one half. Fold and cook 1 more minute until the cheese melts.',
    imageUrl: 'https://images.unsplash.com/photo-1563690449029-d6e1b8d6003d?w=600&auto=format&fit=crop',
  },
  {
    name: 'Salmon & Egg Scramble',
    ingredients: ['Smoked salmon', 'Eggs', 'Vegetables'],
    method: 'Beat 3 eggs and pour into a lightly oiled pan. Scramble gently over medium-low heat. When almost set, fold in flaked smoked salmon and diced vegetables. Remove from heat — residual heat finishes the eggs.',
    imageUrl: 'https://images.unsplash.com/photo-1765100778131-a4b8f1005e82?w=600&auto=format&fit=crop',
  },
  {
    name: 'Turkey Parmesan Patties',
    ingredients: ['Turkey', 'Eggs', 'Parmesan', 'Vegetables'],
    method: 'Mix ground turkey with one beaten egg, grated parmesan, and diced vegetables. Shape into patties and cook in a pan over medium heat 4–5 minutes per side until cooked through.',
    imageUrl: 'https://images.unsplash.com/photo-1609658938891-32dd655106af?w=600&auto=format&fit=crop',
  },
  {
    name: 'Steak with Fried Egg & Avocado',
    ingredients: ['Steak', 'Eggs', 'Avocado', 'Vegetables'],
    method: 'Sear steak 3 minutes per side, rest and slice thin. Fry 2 eggs in the same pan. Arrange steak, fried eggs, and sliced avocado in a bowl with any vegetables. Season well.',
    imageUrl: 'https://images.unsplash.com/photo-1452967712862-0cca1839ff27?w=600&auto=format&fit=crop',
  },
  {
    name: 'Turkey & Avocado Stack',
    ingredients: ['Turkey', 'Avocado', 'Parmesan', 'Vegetables'],
    method: 'Slice avocado thickly and lay as a base. Top with folded turkey slices and shaved parmesan. Add sliced vegetables on the side. A no-cook, high-protein plate ready in 3 minutes.',
    imageUrl: 'https://images.unsplash.com/photo-1661182260393-a3918d4e8571?w=600&auto=format&fit=crop',
  },
  {
    name: 'Ground Beef & Cottage Cheese Bowl',
    ingredients: ['Ground beef', 'Cottage cheese', 'Vegetables'],
    method: 'Brown ground beef in a pan with diced vegetables and season well. Spoon over a generous scoop of cottage cheese. The warmth from the meat gently softens the cheese into a creamy base.',
    imageUrl: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=600&auto=format&fit=crop',
  },
  {
    name: 'Smoked Salmon & Avocado Plate',
    ingredients: ['Smoked salmon', 'Avocado', 'Vegetables'],
    method: 'Fan sliced avocado across a plate. Arrange smoked salmon alongside, alternating for presentation. Add seasonal vegetables. Finish with black pepper and a squeeze of lemon.',
    imageUrl: 'https://images.unsplash.com/photo-1712334562767-5d366d0c40d9?w=600&auto=format&fit=crop',
  },
  {
    name: 'Turkey Egg Muffins',
    ingredients: ['Turkey', 'Eggs', 'Vegetables', 'Parmesan'],
    method: 'Preheat oven to 180°C. Dice turkey and vegetables. Beat 4 eggs with salt and mix everything together. Pour into a greased muffin tin and top with parmesan. Bake 18–20 minutes until set. Makes 6 muffins.',
    imageUrl: 'https://images.unsplash.com/photo-1471477985614-a55f7db053db?w=600&auto=format&fit=crop',
  },
  {
    name: 'Scrambled Eggs with Avocado & Cheese',
    ingredients: ['Eggs', 'Avocado', 'Cheese', 'Vegetables'],
    method: 'Beat 3 eggs. Scramble in a pan over medium-low heat with diced vegetables until just set — slightly underdone is perfect. Top with sliced avocado and crumbled cheese. Season with salt and pepper.',
    imageUrl: 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=600&auto=format&fit=crop',
  },
  {
    name: 'Grilled Steak & Vegetable Bowl',
    ingredients: ['Steak', 'Vegetables', 'Avocado'],
    method: 'Grill or pan-sear steak to your preferred doneness. Rest 5 minutes, then slice against the grain. Serve over a bed of sautéed or roasted vegetables. Add sliced avocado alongside.',
    imageUrl: 'https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=600&auto=format&fit=crop',
  },
  {
    name: 'Salmon & Cheese Scramble',
    ingredients: ['Smoked salmon', 'Eggs', 'Cottage cheese', 'Vegetables'],
    method: 'Scramble 3 eggs with diced vegetables over medium-low heat. When nearly set, stir in a spoonful of cottage cheese and torn pieces of smoked salmon. The cottage cheese melts into a creamy sauce.',
    imageUrl: 'https://images.unsplash.com/photo-1572862905000-c5b6244027a5?w=600&auto=format&fit=crop',
  },
  {
    name: 'Turkey & Avocado Egg Bake',
    ingredients: ['Turkey', 'Eggs', 'Avocado', 'Parmesan', 'Vegetables'],
    method: 'Preheat oven to 190°C. Mix diced turkey, chopped vegetables, and 4 beaten eggs in a baking dish. Top with sliced avocado and grated parmesan. Bake 20–22 minutes until set and golden.',
    imageUrl: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=600&auto=format&fit=crop',
  },
];

// =============================================================================
// CORE FINISHER EXERCISES (Push + Legs days only)
// =============================================================================

const coreExercises = [
  {
    id: 'core-001',
    name: 'Hanging Leg Raise',
    group: 'core',
    description: 'Hang from a pull-up bar with arms fully extended. Keeping legs straight (or slightly bent), raise them until parallel to the floor. Lower slowly under control. Targets lower abs.',
    videoId: 'Pr1ieGZ5atk',
    svgKey: 'core-hanging',
  },
  {
    id: 'core-002',
    name: 'Ab Wheel Rollout',
    group: 'core',
    description: 'Kneel on the floor holding an ab wheel. Brace your core and roll forward until your body is parallel to the ground. Pull back using your abs, not your hips. Gold standard anti-extension.',
    videoId: 'PwqJTPsI6i0',
    svgKey: 'core-abwheel',
  },
  {
    id: 'core-003',
    name: 'Pallof Press',
    group: 'core',
    description: 'Set a cable at chest height. Stand perpendicular to the cable and hold the handle at your chest. Press it straight out, hold 2 seconds, then bring back. Resists rotation — builds true core stability.',
    videoId: 'axgv7H_VQOo',
    svgKey: 'core-pallof',
  },
  {
    id: 'core-004',
    name: 'Cable Crunch',
    group: 'core',
    description: 'Attach a rope to the high cable. Kneel facing the machine, holding the rope behind your head. Crunch down toward the floor, rounding your spine. The cable allows progressive overload unlike most ab exercises.',
    videoId: 'aBd6T01PBqw',
    svgKey: 'core-cable-crunch',
  },
  {
    id: 'core-005',
    name: 'Dragon Flag',
    group: 'core',
    description: 'Lie on a bench and grip it behind your head. Lift your entire body into a straight-line position on your shoulder blades. Lower your body slowly while keeping it rigid. Advanced full-body core challenge.',
    videoId: '7fRemwjcXOQ',
    svgKey: 'core-dragon-flag',
  },
];

// =============================================================================
// RENDERERS
// =============================================================================

function renderRecipeCard(recipe) {
  return `
    <div class="recipe-card-body">
      <h3>${escapeHtml(recipe.name)}</h3>
      <ul class="recipe-ingredients">
        ${recipe.ingredients.map(ing => `<li>${escapeHtml(ing)}</li>`).join('')}
      </ul>
      <p class="recipe-method">${escapeHtml(recipe.method)}</p>
    </div>
  `;
}

function renderCard(exercise) {
  const videoUrl    = `https://youtu.be/${escapeHtml(exercise.videoId)}`;
  const thumbUrl    = `https://img.youtube.com/vi/${escapeHtml(exercise.videoId)}/hqdefault.jpg`;
  const group       = escapeHtml((exercise._group || exercise.group).toUpperCase());
  const savedWeight = getSavedWeight(exercise.id);

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
        <p class="sets-formula">Sets: 10 · 8 · 6</p>
        <p class="card-description">${escapeHtml(exercise.description)}</p>
        ${exercise.videoId ? `
        <a class="youtube-btn" href="${videoUrl}" target="_blank" rel="noopener noreferrer" aria-label="Watch ${escapeHtml(exercise.name)} on YouTube">
          <img class="youtube-btn__thumbnail" src="${thumbUrl}" alt="" loading="lazy" width="320" height="180" />
          <span class="youtube-btn__label">Watch video</span>
        </a>` : ''}
        <div class="weight-tracker">
          <label class="weight-label" for="weight-${escapeHtml(exercise.id)}">Weight logged:</label>
          <div class="weight-input-row">
            <input
              id="weight-${escapeHtml(exercise.id)}"
              class="weight-input"
              type="text"
              data-exercise-id="${escapeHtml(exercise.id)}"
              value="${escapeHtml(savedWeight)}"
              placeholder="e.g. 60 kg"
              inputmode="decimal"
            />
            <button class="weight-save-btn" data-action="save-weight" data-exercise-id="${escapeHtml(exercise.id)}">
              Save
            </button>
          </div>
          ${savedWeight ? `<p class="weight-saved-note">Last session: ${escapeHtml(savedWeight)}</p>` : '<p class="weight-saved-note" hidden></p>'}
        </div>
      </div>
    </div>
  `;
}

const tileImages = {
  push:      'assets/muscle-arm.png?v=2',
  pull:      'assets/muscle-back.png?v=2',
  legs:      'assets/muscle-leg.png?v=2',
  upper:     'assets/muscle-chest.png?v=2',
  nutrition: '5.png?v=3',
};

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
            ${tileImages[day.id]
              ? `<img class="tile-icon" src="${tileImages[day.id]}" alt="" aria-hidden="true" />`
              : `<span class="tile-emoji" aria-hidden="true">🥗</span>`}
            <span class="tile-label">${escapeHtml(day.label)}</span>
            ${day.subtitle ? `<span class="tile-subtitle">${escapeHtml(day.subtitle)}</span>` : ''}
          </button>
        `).join('')}
      </div>
    </div>
  `;
}

function renderExercise(routine) {
  const exerciseList = routine.build();
  const showCore = routine.id === 'push' || routine.id === 'legs';
  const coreEx = showCore ? coreExercises[Math.floor(Math.random() * coreExercises.length)] : null;

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
        ${exerciseList.map(ex => `
          <div class="exercise-pair">
            ${renderCard(ex)}
          </div>
        `).join('')}
      </div>
      ${coreEx ? `
      <div class="core-finisher-section">
        <p class="core-finisher-label">Core Finisher</p>
        <div class="exercise-pair">
          ${renderCard({ ...coreEx, _group: 'core' })}
        </div>
      </div>` : ''}
      <div class="cardio-footer">
        <span class="cardio-label">Finish with</span>
        <p class="cardio-text">Incline Walking + Running</p>
      </div>
    </div>
  `;
}

function renderNutrition() {
  return `
    <div class="nutrition-screen">
      <div class="exercise-header">
        <button class="back-btn" data-action="back" aria-label="Back to home">&larr; Back</button>
        <h1>Nutrition</h1>
      </div>

      <div class="reminder-card if-card">
        <h2 class="reminder-title">Intermittent Fasting</h2>
        <div class="if-window">
          <div class="if-block eat">
            <span class="if-time">12:00 PM → 8:00 PM</span>
            <span class="if-label">Eat</span>
          </div>
          <div class="if-block fast">
            <span class="if-time">8:00 PM → 12:00 PM</span>
            <span class="if-label">Fast</span>
          </div>
        </div>
      </div>

      <div class="reminder-card">
        <h2 class="reminder-title">Daily Rules</h2>
        <div class="reminders-grid">
          <div class="reminder-item">🔥 Food is fuel</div>
          <div class="reminder-item">🚫 No alcohol</div>
          <div class="reminder-item">💧 Drink water</div>
          <div class="reminder-item">😴 Sleep 8 hours</div>
        </div>
      </div>

      <div class="recipe-section">
        <h2 class="reminder-title">Recipe Generator</h2>
        <p class="recipe-intro">High-protein recipes using only your allowed ingredients.</p>
        <button class="regenerate-btn" data-action="get-recipe">Get a Lunch Recipe</button>
        <div id="recipe-card" class="recipe-card" hidden></div>
      </div>
    </div>
  `;
}

/**
 * Apply staggered animation-delay to each .exercise-card after a render.
 */
function applyCardStagger() {
  document.querySelectorAll('.exercise-card').forEach((card, index) => {
    card.style.animationDelay = `${index * 80}ms`;
  });
}

function render() {
  const doRender = () => {
    document.getElementById('app').innerHTML =
      currentScreen === 'home'
        ? renderHome()
        : currentScreen === 'nutrition'
          ? renderNutrition()
          : renderExercise(currentRoutine);
    applyCardStagger();
  };

  if (document.startViewTransition) {
    document.startViewTransition(doRender);
  } else {
    doRender();
  }
}

// =============================================================================
// DOM BOOTSTRAP — only runs in a browser (not in Node.js test runner)
// =============================================================================

if (typeof document !== 'undefined') {
  const appEl = document.getElementById('app');

  // Click delegation — survives innerHTML re-renders
  appEl.addEventListener('click', (event) => {
    const tile       = event.target.closest('[data-routine-id]');
    const backBtn    = event.target.closest('[data-action="back"]');
    const regenBtn   = event.target.closest('[data-action="regenerate"]');
    const cardHeader = event.target.closest('[data-action="toggle-card"]');
    const weightBtn  = event.target.closest('[data-action="save-weight"]');
    const recipeBtn  = event.target.closest('[data-action="get-recipe"]');

    if (tile) {
      const day = workoutDays.find(d => d.id === tile.dataset.routineId);
      if (!day) return;
      currentRoutine = day;
      currentScreen  = day.type === 'nutrition' ? 'nutrition' : 'exercise';
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

    } else if (weightBtn) {
      const id    = weightBtn.dataset.exerciseId;
      const input = appEl.querySelector(`.weight-input[data-exercise-id="${id}"]`);
      if (!input) return;
      const value = input.value.trim();
      saveWeight(id, value);
      const note = weightBtn.closest('.weight-tracker').querySelector('.weight-saved-note');
      if (note) {
        note.textContent = value ? `Last session: ${value}` : '';
        note.hidden = !value;
      }
      weightBtn.textContent = 'Saved ✓';
      setTimeout(() => { weightBtn.textContent = 'Save'; }, 1500);

    } else if (recipeBtn) {
      const recipe = lunchRecipes[Math.floor(Math.random() * lunchRecipes.length)];
      const card   = document.getElementById('recipe-card');
      if (!card) return;
      card.hidden = false;
      card.innerHTML = renderRecipeCard(recipe);
    }
  });

  // Save weight on Enter key inside any weight input
  appEl.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter') return;
    const input = event.target.closest('.weight-input');
    if (!input) return;
    event.preventDefault();
    const id    = input.dataset.exerciseId;
    const value = input.value.trim();
    saveWeight(id, value);
    const tracker = input.closest('.weight-tracker');
    const note = tracker?.querySelector('.weight-saved-note');
    if (note) {
      note.textContent = value ? `Last session: ${value}` : '';
      note.hidden = !value;
    }
    const btn = tracker?.querySelector('.weight-save-btn');
    if (btn) {
      btn.textContent = 'Saved ✓';
      setTimeout(() => { btn.textContent = 'Save'; }, 1500);
    }
  });

  // Initial render
  render();
}
