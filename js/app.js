/**
 * Antigravity — App Entry Point
 *
 * Phase 1: Import verification only.
 * Phase 2 adds: routing state, render_home(), event delegation.
 * Phase 3 adds: render_exercises(routine), Fisher-Yates shuffle, localStorage recency exclusion.
 */

import { exercises } from './exercises.js';

// Phase 1 verification: confirm exercises loaded correctly.
// Remove this block in Phase 2 when render_home() replaces it.
console.log(
  '[Antigravity] exercises loaded:',
  Object.keys(exercises).length, 'groups,',
  Object.values(exercises).flat().length, 'exercises'
);
