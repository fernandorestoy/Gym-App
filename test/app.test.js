import test from "node:test";
import assert from "node:assert/strict";

import { muscleGroups, exercises } from "../js/exercises.js";
import { getSvg } from "../js/svgIllustrations.js";
import { escapeHtml, pickRandom, workoutDays } from "../js/app.js";

const allExercises = Object.values(exercises).flat();
const byId = new Map(allExercises.map((exercise) => [exercise.id, exercise]));

function countGroups(routine) {
  return routine.reduce((counts, exercise) => {
    counts[exercise._group] = (counts[exercise._group] || 0) + 1;
    return counts;
  }, {});
}

test("exercise database has complete, unique exercise definitions", () => {
  assert.equal(muscleGroups.length, 4);
  assert.equal(allExercises.length, 48);

  for (const [groupId, groupExercises] of Object.entries(exercises)) {
    assert.equal(groupExercises.length, 12, `${groupId} should have 12 exercises`);
  }

  assert.equal(byId.size, allExercises.length, "exercise ids must be unique");

  for (const exercise of allExercises) {
    assert.equal(typeof exercise.id, "string");
    assert.equal(typeof exercise.name, "string");
    assert.match(exercise.id, /^[a-z0-9-]+$/);
    assert.equal(typeof exercise.description, 'string');
    assert.equal(typeof exercise.videoId, 'string');
    assert.equal(typeof exercise.svgKey, 'string');
  }
});

test("every exercise renders an inline SVG illustration and unknown ids fall back", () => {
  for (const exercise of allExercises) {
    const svg = getSvg(exercise.id, "#E74C3C");
    assert.match(svg.trim(), /^<svg[\s>]/, `${exercise.id} should render SVG`);
    assert.match(svg, /Exercise illustration/);
  }

  const fallback = getSvg("unknown-exercise", "#E74C3C");
  assert.match(fallback.trim(), /^<svg[\s>]/);
  assert.match(fallback, /Exercise/);
});

test("exercise SVG internals are namespaced by exercise id", () => {
  const squat = getSvg("sentadilla-goblet", "#E74C3C");
  const curl = getSvg("curl-biceps", "#3498DB");

  assert.match(squat, /id="bgGrad-sentadilla-goblet"/);
  assert.match(squat, /fill="url\(#bgGrad-sentadilla-goblet\)"/);
  assert.match(curl, /id="bgGrad-curl-biceps"/);
  assert.match(curl, /fill="url\(#bgGrad-curl-biceps\)"/);
});

test("workout days build the expected muscle-group mix", () => {
  const workoutRoutines = workoutDays.filter(d => d.type === 'workout');

  const expected = {
    push:  { push: 4 },
    pull:  { pull: 5 },
    legs:  { legs: 4 },
    upper: { upper: 5 },
  };

  for (const day of workoutRoutines) {
    const routine = day.build();
    const exp = expected[day.id];
    const total = Object.values(exp).reduce((a, b) => a + b, 0);
    assert.equal(routine.length, total, `${day.id} should produce ${total} exercises`);
    assert.deepEqual(countGroups(routine), exp);
  }
});

test("push day always includes the 3 anchor exercises", () => {
  const pushDay = workoutDays.find(d => d.id === 'push');
  const routine = pushDay.build();
  const ids = routine.map(e => e.id);
  assert.ok(ids.includes('push-001'), 'Overhead Press must always appear');
  assert.ok(ids.includes('push-002'), 'Incline Dumbbell Press must always appear');
  assert.ok(ids.includes('push-003'), 'Dips must always appear');
});

test("pull day always includes the 2 anchor exercises", () => {
  const pullDay = workoutDays.find(d => d.id === 'pull');
  const routine = pullDay.build();
  const ids = routine.map(e => e.id);
  assert.ok(ids.includes('pull-001'), 'Pull-Ups must always appear');
  assert.ok(ids.includes('pull-002'), 'Barbell Row must always appear');
});

test("legs day always includes the 3 anchor exercises", () => {
  const legsDay = workoutDays.find(d => d.id === 'legs');
  const routine = legsDay.build();
  const ids = routine.map(e => e.id);
  assert.ok(ids.includes('legs-001'), 'Back Squat must always appear');
  assert.ok(ids.includes('legs-002'), 'Bulgarian Split Squat must always appear');
  assert.ok(ids.includes('legs-003'), 'Barbell Hip Thrust must always appear');
});

test("pickRandom uses a bounded Fisher-Yates shuffle and never mutates input", () => {
  const source = ["a", "b", "c", "d"];
  const values = [0.99, 0.01, 0.5];
  const selected = pickRandom(source, 3, () => values.shift() ?? 0);

  assert.deepEqual(source, ["a", "b", "c", "d"]);
  assert.equal(selected.length, 3);
  assert.equal(new Set(selected).size, selected.length);
  assert.ok(selected.every((item) => source.includes(item)));
});

test("escapeHtml encodes dynamic text before template rendering", () => {
  assert.equal(
    escapeHtml(`A&B<box>\"quote\"'`),
    "A&amp;B&lt;box&gt;&quot;quote&quot;&#039;"
  );
});
