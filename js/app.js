// ========================================
// ANTIGRAVITY GYM - Main Application
// 4-Day Workout Routine (intercalated)
// ========================================

import { muscleGroups, exercises } from "./exercises.js";

const app = document.getElementById("app");

// ---- Muscle group label map ----
const groupLabels = {
  "hombros":         { name: "Hombros",           color: "#F39C12" },
  "brazos":          { name: "Brazos",             color: "#3498DB" },
  "pecho":           { name: "Pecho",              color: "#2ECC71" },
  "espalda":         { name: "Espalda",            color: "#9B59B6" },
  "core":            { name: "Abdominales",        color: "#1ABC9C" },
  "gluteos-piernas": { name: "Piernas",            color: "#E74C3C" },
  "gluteos":         { name: "Glúteos",            color: "#E74C3C" },
  "cuadriceps":      { name: "Cuádriceps",         color: "#E67E22" },
  "isquiotibiales":  { name: "Isquiotibiales",     color: "#D35400" },
};

// ---- Helpers ----

function pickRandom(arr, count) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

// Tag exercises with their muscle group id
function tag(list, groupId) {
  return list.map((ex) => ({ ...ex, _group: groupId }));
}

// Intercalate: weave arrays together [a1, b1, a2, b2, a3, b3...]
function intercalate(...arrays) {
  const result = [];
  const maxLen = Math.max(...arrays.map((a) => a.length));
  for (let i = 0; i < maxLen; i++) {
    for (const arr of arrays) {
      if (i < arr.length) result.push(arr[i]);
    }
  }
  return result;
}

function equipmentLabel(eq) {
  const map = { mancuernas: "Mancuernas", maquina: "Máquina", cintas: "Cintas" };
  return map[eq] || eq;
}

function equipmentClass(eq) {
  return eq;
}

function getGroupColor(exercise) {
  if (exercise._group && groupLabels[exercise._group]) {
    return groupLabels[exercise._group].color;
  }
  for (const group of muscleGroups) {
    const groupExercises = exercises[group.id] || [];
    if (groupExercises.some((e) => e.id === exercise.id)) {
      return group.color;
    }
  }
  return "#888";
}

function getGroupLabel(exercise) {
  if (exercise._group && groupLabels[exercise._group]) {
    return groupLabels[exercise._group];
  }
  return { name: "Ejercicio", color: "#888" };
}

// ---- Workout Day Definitions ----

const workoutDays = [
  {
    id: "day1",
    dayNum: 1,
    name: "Hombros y Brazos",
    icon: "🙆",
    color: "#F39C12",
    description: "2 hombros + 1 brazo + 3 abdominales",
    build() {
      const shoulders = tag(pickRandom(exercises["hombros"], 2), "hombros");
      const arms = tag(pickRandom(exercises["brazos"], 1), "brazos");
      const abs = tag(pickRandom(exercises["core"], 3), "core");
      // Intercalate: shoulder, abs, shoulder, abs, arm, abs
      const main = [...shoulders, ...arms]; // 3 items
      return intercalate(main, abs);
    },
  },
  {
    id: "day2",
    dayNum: 2,
    name: "Pecho",
    icon: "🏋️",
    color: "#2ECC71",
    description: "3 pecho + 3 abdominales",
    build() {
      const chest = tag(pickRandom(exercises["pecho"], 3), "pecho");
      const abs = tag(pickRandom(exercises["core"], 3), "core");
      return intercalate(chest, abs);
    },
  },
  {
    id: "day3",
    dayNum: 3,
    name: "Espalda",
    icon: "🔄",
    color: "#9B59B6",
    description: "3 espalda + 3 abdominales",
    build() {
      const back = tag(pickRandom(exercises["espalda"], 3), "espalda");
      const abs = tag(pickRandom(exercises["core"], 3), "core");
      return intercalate(back, abs);
    },
  },
  {
    id: "day4",
    dayNum: 4,
    name: "Piernas",
    icon: "🦵",
    color: "#E74C3C",
    description: "2 glúteos + 2 cuádriceps + 1 isquio + 1 core",
    build() {
      const legs = exercises["gluteos-piernas"];
      const gluteIds = [
        "abduccion-cadera", "patada-gluteo-polea", "clamshell-banda",
        "puente-gluteos-banda", "monster-walk", "aduccion-cadera",
      ];
      const hamstringIds = [
        "peso-muerto-rumano-mancuernas", "curl-isquiotibiales", "peso-muerto-banda",
      ];
      const quadExercises = legs.filter(
        (e) => !gluteIds.includes(e.id) && !hamstringIds.includes(e.id)
      );
      const gluteExercises = legs.filter((e) => gluteIds.includes(e.id));
      const hamstringExercises = legs.filter((e) => hamstringIds.includes(e.id));

      const glutes = tag(pickRandom(gluteExercises, 2), "gluteos");
      const quads = tag(pickRandom(quadExercises, 2), "cuadriceps");
      const hams = tag(pickRandom(hamstringExercises, 1), "isquiotibiales");
      const core = tag(pickRandom(exercises["core"], 1), "core");
      // Intercalate: glute, quad, glute, quad, ham, core
      return intercalate(glutes, quads, hams, core);
    },
  },
];

// ---- Render: Home Screen (4-Day Selector) ----

function renderHome() {
  const buttons = workoutDays
    .map(
      (day) => `
    <button class="muscle-btn" data-day="${day.id}" style="border-color: ${day.color}30;">
      <span class="icon">${day.icon}</span>
      <span class="label">Día ${day.dayNum}</span>
      <span class="day-detail">${day.name}</span>
    </button>`
    )
    .join("");

  app.innerHTML = `
    <div class="home-screen">
      <p class="home-title">Elige tu día de entrenamiento</p>
      <div class="muscle-grid">${buttons}</div>
    </div>`;

  app.querySelectorAll(".muscle-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      renderDay(btn.dataset.day);
    });
  });
}

// ---- Render: Day Exercises ----

function renderDay(dayId) {
  const day = workoutDays.find((d) => d.id === dayId);
  if (!day) return;

  const selected = day.build();

  const cards = selected
    .map((ex, i) => {
      const color = getGroupColor(ex);
      const group = getGroupLabel(ex);
      const steps = ex.steps.map((s) => `<li>${s}</li>`).join("");

      // YouTube search URL filtered to short videos (< 4 min), sp=EgIYAQ%3D%3D
      const query = encodeURIComponent(ex.name + " ejercicio como hacer");
      const ytUrl = `https://www.youtube.com/results?search_query=${query}&sp=EgIYAQ%3D%3D`;

      return `
      <div class="exercise-card" style="--accent-color: ${color};">
        <div class="card-header" data-index="${i}">
          <span class="card-number">${i + 1}</span>
          <span class="card-title">${ex.name}</span>
          <span class="group-badge" style="background: ${group.color}22; color: ${group.color};">${group.name}</span>
          <span class="equipment-badge ${equipmentClass(ex.equipment)}">${equipmentLabel(ex.equipment)}</span>
          <span class="card-arrow">&#9654;</span>
        </div>
        <div class="card-body">
          <div class="card-body-inner">
            <a class="yt-btn" href="${ytUrl}" target="_blank" rel="noopener noreferrer">
              <span class="yt-icon">&#9654;</span>
              <span class="yt-text">
                <span class="yt-label">Ver tutorial</span>
                <span class="yt-sub">Videos cortos en YouTube</span>
              </span>
              <span class="yt-logo">▶ YouTube</span>
            </a>
            <p class="exercise-description">${ex.description}</p>
            <ol class="steps-list">${steps}</ol>
            ${ex.tips ? `<div class="exercise-tip"><strong>Tip:</strong> ${ex.tips}</div>` : ""}
          </div>
        </div>
      </div>`;
    })
    .join("");

  app.innerHTML = `
    <div class="exercise-screen">
      <div class="exercise-header">
        <button class="btn-back">&#8592; Volver</button>
        <h2 class="exercise-group-title" style="color: ${day.color};">Día ${day.dayNum}: ${day.name}</h2>
      </div>
      <p class="day-description">${day.description}</p>
      <button class="btn-refresh">
        <span class="refresh-icon">&#8635;</span> Nueva rutina
      </button>
      <div class="exercise-list">${cards}</div>
    </div>`;

  app.querySelector(".btn-back").addEventListener("click", renderHome);
  app.querySelector(".btn-refresh").addEventListener("click", () => renderDay(dayId));

  // Accordion toggle
  app.querySelectorAll(".card-header").forEach((header) => {
    header.addEventListener("click", () => {
      const card = header.parentElement;
      const body = card.querySelector(".card-body");
      const isOpen = card.classList.contains("open");

      app.querySelectorAll(".exercise-card.open").forEach((openCard) => {
        if (openCard !== card) {
          openCard.classList.remove("open");
          openCard.querySelector(".card-body").style.maxHeight = null;
        }
      });

      if (isOpen) {
        card.classList.remove("open");
        body.style.maxHeight = null;
      } else {
        card.classList.add("open");
        body.style.maxHeight = body.scrollHeight + "px";
      }
    });
  });
}

// ---- Init ----
renderHome();
