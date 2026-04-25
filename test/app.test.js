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
  assert.equal(muscleGroups.length, 7);
  assert.equal(allExercises.length, 108);

  for (const [groupId, groupExercises] of Object.entries(exercises)) {
    assert.equal(groupExercises.length, 18, `${groupId} should have 18 exercises`);
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
    assert.match(svg, /Ilustración del ejercicio/);
  }

  const fallback = getSvg("unknown-exercise", "#E74C3C");
  assert.match(fallback.trim(), /^<svg[\s>]/);
  assert.match(fallback, /Ejercicio/);
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
  const expected = {
    day1: { biceps: 1, triceps: 1, shoulders: 1, abs: 3 },
    day2: { chest: 3, abs: 3 },
    day3: { back: 3, abs: 3 },
    day4: { legs: 3 },
  };

  for (const day of workoutDays) {
    const routine = day.build();
    assert.equal(routine.length, Object.values(expected[day.id]).reduce((a, b) => a + b, 0), `${day.id} should produce the expected number of exercises`);
    assert.deepEqual(countGroups(routine), expected[day.id]);
  }
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
