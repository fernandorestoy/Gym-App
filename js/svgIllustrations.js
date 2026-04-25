// ========================================
// ANTIGRAVITY GYM - SVG Illustration Engine
// Composable figure system using joint angles
// ========================================

// Body segment lengths (in SVG units)
const BODY = {
  headRadius: 13,
  neckLen: 6,
  torsoLen: 48,
  upperArmLen: 30,
  forearmLen: 26,
  thighLen: 38,
  shinLen: 34,
  footLen: 14,
  shoulderWidth: 20,
  hipWidth: 14,
  // Rendering widths (thick for anatomical look)
  torsoWidth: 20,
  shoulderLineWidth: 18,
  upperArmWidth: 11,
  forearmWidth: 9,
  thighWidth: 14,
  shinWidth: 10,
  handRadius: 5,
  footRadius: 5,
};

// Convert degrees to radians
function rad(deg) {
  return (deg * Math.PI) / 180;
}

// Calculate endpoint from start point, angle (0=up, 90=right), and length
function endpoint(x, y, angleDeg, length) {
  const a = rad(angleDeg - 90); // -90 so that 0deg = straight up
  return {
    x: x + Math.cos(a) * length,
    y: y + Math.sin(a) * length,
  };
}

// Draw a limb segment with outline for depth (anatomical look)
function limb(x1, y1, x2, y2, width = 10, color = "#D4D4D8") {
  const outlineColor = "rgba(0,0,0,0.25)";
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${outlineColor}" stroke-width="${width + 3}" stroke-linecap="round"/>` +
         `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${width}" stroke-linecap="round"/>`;
}

// Draw the head (filled for anatomical look)
function head(x, y, color = "#D4D4D8") {
  return `<circle cx="${x}" cy="${y}" r="${BODY.headRadius}" fill="${color}" stroke="rgba(0,0,0,0.25)" stroke-width="2"/>`;
}

// Draw a hand/foot circle
function extremity(x, y, r, color) {
  return `<circle cx="${x}" cy="${y}" r="${r}" fill="${color}" stroke="rgba(0,0,0,0.2)" stroke-width="1.5"/>`;
}

// Draw a muscle highlight ellipse (higher opacity for anatomical look)
function muscleHighlight(cx, cy, rx, ry, angle, color) {
  return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" transform="rotate(${angle} ${cx} ${cy})" fill="${color}" opacity="0.5"/>`;
}

// Draw a complete figure given a pose configuration
// pose: { torsoAngle, lShoulderAngle, rShoulderAngle, lElbowAngle, rElbowAngle, lHipAngle, rHipAngle, lKneeAngle, rKneeAngle }
// All angles: 0 = straight up, 180 = straight down, 90 = right, -90/270 = left
function drawFigure(pose, originX, originY, options = {}) {
  const {
    color = "#D4D4D8",
    accentColor = "#E74C3C",
    muscles = [],
    facing = "right", // "right" or "left"
    scale = 1,
  } = options;

  const flip = facing === "left" ? -1 : 1;
  let parts = [];

  // Torso angle (0 = upright)
  const ta = pose.torsoAngle || 0;

  // Hip position (origin = hip)
  const hipX = originX;
  const hipY = originY;

  // Torso top (neck base)
  const neck = endpoint(hipX, hipY, ta, -BODY.torsoLen * scale);

  // Head
  const headPos = endpoint(neck.x, neck.y, ta, -(BODY.neckLen + BODY.headRadius) * scale);

  // Shoulders (offset from neck)
  const lShoulderX = neck.x - BODY.shoulderWidth * scale * flip;
  const lShoulderY = neck.y;
  const rShoulderX = neck.x + BODY.shoulderWidth * scale * flip;
  const rShoulderY = neck.y;

  // Left arm
  const lElbow = endpoint(lShoulderX, lShoulderY, (pose.lShoulderAngle || 180) * flip, BODY.upperArmLen * scale);
  const lHand = endpoint(lElbow.x, lElbow.y, (pose.lElbowAngle || 180) * flip, BODY.forearmLen * scale);

  // Right arm
  const rElbow = endpoint(rShoulderX, rShoulderY, (pose.rShoulderAngle || 180) * flip, BODY.upperArmLen * scale);
  const rHand = endpoint(rElbow.x, rElbow.y, (pose.rElbowAngle || 180) * flip, BODY.forearmLen * scale);

  // Hip joints
  const lHipX = hipX - BODY.hipWidth * scale * flip;
  const lHipY = hipY;
  const rHipX = hipX + BODY.hipWidth * scale * flip;
  const rHipY = hipY;

  // Left leg
  const lKnee = endpoint(lHipX, lHipY, (pose.lHipAngle || 180), BODY.thighLen * scale);
  const lFoot = endpoint(lKnee.x, lKnee.y, (pose.lKneeAngle || 180), BODY.shinLen * scale);

  // Right leg
  const rKnee = endpoint(rHipX, rHipY, (pose.rHipAngle || 180), BODY.thighLen * scale);
  const rFoot = endpoint(rKnee.x, rKnee.y, (pose.rKneeAngle || 180), BODY.shinLen * scale);

  // Muscle highlights (behind figure)
  muscles.forEach((m) => {
    const highlights = getMuscleHighlights(m, {
      neck, hipX, hipY, lShoulderX, lShoulderY, rShoulderX, rShoulderY,
      lElbow, rElbow, lHipX, lHipY, rHipX, rHipY, lKnee, rKnee,
    }, accentColor, scale);
    parts.push(highlights);
  });

  // Draw body parts (order: legs behind, then torso, then arms in front)
  // Legs (thighs thicker than shins)
  parts.push(limb(lHipX, lHipY, lKnee.x, lKnee.y, BODY.thighWidth * scale, color));
  parts.push(limb(lKnee.x, lKnee.y, lFoot.x, lFoot.y, BODY.shinWidth * scale, color));
  parts.push(limb(rHipX, rHipY, rKnee.x, rKnee.y, BODY.thighWidth * scale, color));
  parts.push(limb(rKnee.x, rKnee.y, rFoot.x, rFoot.y, BODY.shinWidth * scale, color));

  // Feet
  parts.push(extremity(lFoot.x, lFoot.y, BODY.footRadius * scale, color));
  parts.push(extremity(rFoot.x, rFoot.y, BODY.footRadius * scale, color));

  // Torso (thick for body mass)
  parts.push(limb(hipX, hipY, neck.x, neck.y, BODY.torsoWidth * scale, color));

  // Shoulder line
  parts.push(limb(lShoulderX, lShoulderY, rShoulderX, rShoulderY, BODY.shoulderLineWidth * scale, color));

  // Arms (upper arm thicker than forearm)
  parts.push(limb(lShoulderX, lShoulderY, lElbow.x, lElbow.y, BODY.upperArmWidth * scale, color));
  parts.push(limb(lElbow.x, lElbow.y, lHand.x, lHand.y, BODY.forearmWidth * scale, color));
  parts.push(limb(rShoulderX, rShoulderY, rElbow.x, rElbow.y, BODY.upperArmWidth * scale, color));
  parts.push(limb(rElbow.x, rElbow.y, rHand.x, rHand.y, BODY.forearmWidth * scale, color));

  // Hands
  parts.push(extremity(lHand.x, lHand.y, BODY.handRadius * scale, color));
  parts.push(extremity(rHand.x, rHand.y, BODY.handRadius * scale, color));

  // Head (filled)
  parts.push(head(headPos.x, headPos.y, color));

  return {
    svg: parts.join(""),
    points: { lHand, rHand, lFoot, rFoot, lElbow, rElbow, lKnee, rKnee, neck, headPos, hipX, hipY, lShoulderX, lShoulderY, rShoulderX, rShoulderY },
  };
}

// Get muscle highlight positions based on body landmarks
function getMuscleHighlights(muscle, pts, color, scale) {
  const s = scale;
  const midTorsoX = (pts.neck.x + pts.hipX) / 2;
  const midTorsoY = (pts.neck.y + pts.hipY) / 2;

  const map = {
    quads: () => {
      const lMid = { x: (pts.lHipX + pts.lKnee.x) / 2, y: (pts.lHipY + pts.lKnee.y) / 2 };
      const rMid = { x: (pts.rHipX + pts.rKnee.x) / 2, y: (pts.rHipY + pts.rKnee.y) / 2 };
      return muscleHighlight(lMid.x, lMid.y, 10 * s, 20 * s, 0, color) +
             muscleHighlight(rMid.x, rMid.y, 10 * s, 20 * s, 0, color);
    },
    glutes: () => muscleHighlight(pts.hipX, pts.hipY - 4 * s, 20 * s, 12 * s, 0, color),
    hamstrings: () => {
      const lMid = { x: (pts.lHipX + pts.lKnee.x) / 2, y: (pts.lHipY + pts.lKnee.y) / 2 };
      const rMid = { x: (pts.rHipX + pts.rKnee.x) / 2, y: (pts.rHipY + pts.rKnee.y) / 2 };
      return muscleHighlight(lMid.x + 3, lMid.y, 8 * s, 18 * s, 0, color) +
             muscleHighlight(rMid.x + 3, rMid.y, 8 * s, 18 * s, 0, color);
    },
    calves: () => {
      const lMid = { x: pts.lKnee.x, y: pts.lKnee.y + 15 * s };
      const rMid = { x: pts.rKnee.x, y: pts.rKnee.y + 15 * s };
      return muscleHighlight(lMid.x, lMid.y, 7 * s, 14 * s, 0, color) +
             muscleHighlight(rMid.x, rMid.y, 7 * s, 14 * s, 0, color);
    },
    adductors: () => muscleHighlight(pts.hipX, pts.hipY + 15 * s, 10 * s, 16 * s, 0, color),
    biceps: () => {
      const lMid = { x: (pts.lShoulderX + pts.lElbow.x) / 2, y: (pts.lShoulderY + pts.lElbow.y) / 2 };
      const rMid = { x: (pts.rShoulderX + pts.rElbow.x) / 2, y: (pts.rShoulderY + pts.rElbow.y) / 2 };
      return muscleHighlight(lMid.x, lMid.y, 7 * s, 14 * s, 0, color) +
             muscleHighlight(rMid.x, rMid.y, 7 * s, 14 * s, 0, color);
    },
    triceps: () => {
      const lMid = { x: (pts.lShoulderX + pts.lElbow.x) / 2 + 3, y: (pts.lShoulderY + pts.lElbow.y) / 2 };
      const rMid = { x: (pts.rShoulderX + pts.rElbow.x) / 2 + 3, y: (pts.rShoulderY + pts.rElbow.y) / 2 };
      return muscleHighlight(lMid.x, lMid.y, 7 * s, 14 * s, 0, color) +
             muscleHighlight(rMid.x, rMid.y, 7 * s, 14 * s, 0, color);
    },
    chest: () => muscleHighlight(midTorsoX, pts.neck.y + 14 * s, 20 * s, 12 * s, 0, color),
    lats: () => muscleHighlight(midTorsoX, midTorsoY, 18 * s, 22 * s, 0, color),
    upperBack: () => muscleHighlight(midTorsoX, pts.neck.y + 12 * s, 18 * s, 12 * s, 0, color),
    lowerBack: () => muscleHighlight(midTorsoX, pts.hipY - 10 * s, 14 * s, 12 * s, 0, color),
    shoulders: () => {
      return muscleHighlight(pts.lShoulderX, pts.lShoulderY, 10 * s, 8 * s, 0, color) +
             muscleHighlight(pts.rShoulderX, pts.rShoulderY, 10 * s, 8 * s, 0, color);
    },
    traps: () => muscleHighlight(pts.neck.x, pts.neck.y - 2, 16 * s, 10 * s, 0, color),
    abs: () => muscleHighlight(midTorsoX, midTorsoY + 8 * s, 10 * s, 18 * s, 0, color),
    obliques: () => {
      return muscleHighlight(midTorsoX - 12 * s, midTorsoY + 5 * s, 8 * s, 16 * s, 10, color) +
             muscleHighlight(midTorsoX + 12 * s, midTorsoY + 5 * s, 8 * s, 16 * s, -10, color);
    },
    forearms: () => {
      const lMid = { x: pts.lElbow.x, y: pts.lElbow.y + 10 * s };
      const rMid = { x: pts.rElbow.x, y: pts.rElbow.y + 10 * s };
      return muscleHighlight(lMid.x, lMid.y, 6 * s, 12 * s, 0, color) +
             muscleHighlight(rMid.x, rMid.y, 6 * s, 12 * s, 0, color);
    },
  };

  return map[muscle] ? map[muscle]() : "";
}

// Draw equipment
function drawDumbbell(x, y, angle = 0, scale = 1) {
  const len = 20 * scale;
  const p1 = endpoint(x, y, angle + 90, -len / 2);
  const p2 = endpoint(x, y, angle + 90, len / 2);
  return `
    <line x1="${p1.x}" y1="${p1.y}" x2="${p2.x}" y2="${p2.y}" stroke="#555" stroke-width="4" stroke-linecap="round"/>
    <rect x="${p1.x - 4}" y="${p1.y - 6}" width="8" height="12" rx="2" fill="#444" stroke="#333" stroke-width="1" transform="rotate(${angle} ${p1.x} ${p1.y})"/>
    <rect x="${p2.x - 4}" y="${p2.y - 6}" width="8" height="12" rx="2" fill="#444" stroke="#333" stroke-width="1" transform="rotate(${angle} ${p2.x} ${p2.y})"/>
  `;
}

function drawBand(x1, y1, x2, y2, color = "#F39C12") {
  const midX = (x1 + x2) / 2;
  const midY = Math.min(y1, y2) - 15;
  return `<path d="M${x1},${y1} Q${midX},${midY} ${x2},${y2}" stroke="${color}" stroke-width="3" stroke-dasharray="6,3" fill="none" opacity="0.7"/>`;
}

function drawCable(x1, y1, x2, y2) {
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#666" stroke-width="2.5" stroke-dasharray="5,3"/>`;
}

function drawBench(x, y, angle = 0, width = 60, height = 10) {
  return `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="4" fill="#8B7D6B" stroke="#6B5D4B" stroke-width="1.5" transform="rotate(${angle} ${x + width/2} ${y + height/2})"/>`;
}

function drawMachinePad(x, y, w = 30, h = 14) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="5" fill="#8B7D6B" stroke="#6B5D4B" stroke-width="1.5"/>`;
}

// Arrow between two positions
function drawArrow(x1, y1, x2, y2, color = "#666") {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const headLen = 8;
  const p1 = {
    x: x2 - headLen * Math.cos(angle - Math.PI / 6),
    y: y2 - headLen * Math.sin(angle - Math.PI / 6),
  };
  const p2 = {
    x: x2 - headLen * Math.cos(angle + Math.PI / 6),
    y: y2 - headLen * Math.sin(angle + Math.PI / 6),
  };
  return `
    <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="2" stroke-dasharray="4,3"/>
    <polygon points="${x2},${y2} ${p1.x},${p1.y} ${p2.x},${p2.y}" fill="${color}"/>
  `;
}

// Label text
function label(x, y, text, color = "#888", size = 9) {
  return `<text x="${x}" y="${y}" text-anchor="middle" fill="${color}" font-family="Inter, sans-serif" font-size="${size}" font-weight="600">${text}</text>`;
}

// ============================================================
// POSE DEFINITIONS for all exercises
// Angles: 0=up, 90=right, 180=down, 270=left
// ============================================================

const poses = {
  // ---- GLÚTEOS Y PIERNAS ----
  "sentadilla-goblet": {
    start: { torsoAngle: 0, lShoulderAngle: 160, rShoulderAngle: 160, lElbowAngle: 80, rElbowAngle: 80, lHipAngle: 180, rHipAngle: 180, lKneeAngle: 180, rKneeAngle: 180 },
    end: { torsoAngle: 15, lShoulderAngle: 160, rShoulderAngle: 160, lElbowAngle: 70, rElbowAngle: 70, lHipAngle: 120, rHipAngle: 120, lKneeAngle: 100, rKneeAngle: 100 },
    muscles: ["quads", "glutes"],
    equipment: "dumbbell-chest",
  },
  "zancada-caminando": {
    start: { torsoAngle: 0, lShoulderAngle: 180, rShoulderAngle: 180, lElbowAngle: 180, rElbowAngle: 180, lHipAngle: 180, rHipAngle: 180, lKneeAngle: 180, rKneeAngle: 180 },
    end: { torsoAngle: 0, lShoulderAngle: 180, rShoulderAngle: 180, lElbowAngle: 180, rElbowAngle: 180, lHipAngle: 150, rHipAngle: 210, lKneeAngle: 180, rKneeAngle: 110 },
    muscles: ["quads", "glutes"],
    equipment: "dumbbells-sides",
  },
  "peso-muerto-rumano-mancuernas": {
    start: { torsoAngle: 0, lShoulderAngle: 180, rShoulderAngle: 180, lElbowAngle: 180, rElbowAngle: 180, lHipAngle: 180, rHipAngle: 180, lKneeAngle: 180, rKneeAngle: 180 },
    end: { torsoAngle: 70, lShoulderAngle: 180, rShoulderAngle: 180, lElbowAngle: 180, rElbowAngle: 180, lHipAngle: 180, rHipAngle: 180, lKneeAngle: 170, rKneeAngle: 170 },
    muscles: ["hamstrings", "glutes"],
    equipment: "dumbbells-front",
  },
  "sentadilla-sumo": {
    start: { torsoAngle: 0, lShoulderAngle: 180, rShoulderAngle: 180, lElbowAngle: 180, rElbowAngle: 180, lHipAngle: 195, rHipAngle: 165, lKneeAngle: 180, rKneeAngle: 180 },
    end: { torsoAngle: 5, lShoulderAngle: 180, rShoulderAngle: 180, lElbowAngle: 180, rElbowAngle: 180, lHipAngle: 215, rHipAngle: 145, lKneeAngle: 120, rKneeAngle: 120 },
    muscles: ["adductors", "glutes"],
    equipment: "dumbbell-center",
  },
  "step-up": {
    start: { torsoAngle: 0, lShoulderAngle: 180, rShoulderAngle: 180, lElbowAngle: 180, rElbowAngle: 180, lHipAngle: 180, rHipAngle: 120, lKneeAngle: 180, rKneeAngle: 100 },
    end: { torsoAngle: 0, lShoulderAngle: 180, rShoulderAngle: 180, lElbowAngle: 180, rElbowAngle: 180, lHipAngle: 180, rHipAngle: 180, lKneeAngle: 180, rKneeAngle: 180 },
    muscles: ["quads", "glutes"],
    equipment: "dumbbells-sides",
    extraDraw: (fig, isEnd) => isEnd ? "" : drawBench(fig.points.rFoot.x - 25, fig.points.rFoot.y - 2, 0, 50, 6),
  },
  "sentadilla-bulgara": {
    start: { torsoAngle: 5, lShoulderAngle: 180, rShoulderAngle: 180, lElbowAngle: 180, rElbowAngle: 180, lHipAngle: 165, rHipAngle: 210, lKneeAngle: 170, rKneeAngle: 130 },
    end: { torsoAngle: 15, lShoulderAngle: 180, rShoulderAngle: 180, lElbowAngle: 180, rElbowAngle: 180, lHipAngle: 130, rHipAngle: 230, lKneeAngle: 100, rKneeAngle: 80 },
    muscles: ["quads", "glutes"],
    equipment: "dumbbells-sides",
  },
  "prensa-piernas": {
    start: { torsoAngle: -30, lShoulderAngle: 140, rShoulderAngle: 140, lElbowAngle: 180, rElbowAngle: 180, lHipAngle: 100, rHipAngle: 100, lKneeAngle: 90, rKneeAngle: 90 },
    end: { torsoAngle: -30, lShoulderAngle: 140, rShoulderAngle: 140, lElbowAngle: 180, rElbowAngle: 180, lHipAngle: 140, rHipAngle: 140, lKneeAngle: 160, rKneeAngle: 160 },
    muscles: ["quads", "glutes"],
    equipment: "machine",
  },
  "extension-cuadriceps": {
    start: { torsoAngle: -20, lShoulderAngle: 140, rShoulderAngle: 140, lElbowAngle: 180, rElbowAngle: 180, lHipAngle: 130, rHipAngle: 130, lKneeAngle: 100, rKneeAngle: 100 },
    end: { torsoAngle: -20, lShoulderAngle: 140, rShoulderAngle: 140, lElbowAngle: 180, rElbowAngle: 180, lHipAngle: 130, rHipAngle: 130, lKneeAngle: 170, rKneeAngle: 170 },
    muscles: ["quads"],
    equipment: "machine",
  },
  "curl-isquiotibiales": {
    start: { torsoAngle: 90, lShoulderAngle: 90, rShoulderAngle: 90, lElbowAngle: 180, rElbowAngle: 180, lHipAngle: 180, rHipAngle: 180, lKneeAngle: 180, rKneeAngle: 180 },
    end: { torsoAngle: 90, lShoulderAngle: 90, rShoulderAngle: 90, lElbowAngle: 180, rElbowAngle: 180, lHipAngle: 180, rHipAngle: 180, lKneeAngle: 100, rKneeAngle: 100 },
    muscles: ["hamstrings"],
    equipment: "machine",
  },
  "hack-squat": {
    start: { torsoAngle: -20, lShoulderAngle: 80, rShoulderAngle: 80, lElbowAngle: 170, rElbowAngle: 170, lHipAngle: 180, rHipAngle: 180, lKneeAngle: 180, rKneeAngle: 180 },
    end: { torsoAngle: -10, lShoulderAngle: 80, rShoulderAngle: 80, lElbowAngle: 170, rElbowAngle: 170, lHipAngle: 130, rHipAngle: 130, lKneeAngle: 100, rKneeAngle: 100 },
    muscles: ["quads", "glutes"],
    equipment: "machine",
  },
  "aduccion-cadera": {
    start: { torsoAngle: -15, lShoulderAngle: 140, rShoulderAngle: 140, lElbowAngle: 180, rElbowAngle: 180, lHipAngle: 220, rHipAngle: 140, lKneeAngle: 180, rKneeAngle: 180 },
    end: { torsoAngle: -15, lShoulderAngle: 140, rShoulderAngle: 140, lElbowAngle: 180, rElbowAngle: 180, lHipAngle: 190, rHipAngle: 170, lKneeAngle: 180, rKneeAngle: 180 },
    muscles: ["adductors"],
    equipment: "machine",
  },
  "abduccion-cadera": {
    start: { torsoAngle: -15, lShoulderAngle: 140, rShoulderAngle: 140, lElbowAngle: 180, rElbowAngle: 180, lHipAngle: 190, rHipAngle: 170, lKneeAngle: 180, rKneeAngle: 180 },
    end: { torsoAngle: -15, lShoulderAngle: 140, rShoulderAngle: 140, lElbowAngle: 180, rElbowAngle: 180, lHipAngle: 220, rHipAngle: 140, lKneeAngle: 180, rKneeAngle: 180 },
    muscles: ["glutes"],
    equipment: "machine",
  },
  "patada-gluteo-polea": {
    start: { torsoAngle: 15, lShoulderAngle: 160, rShoulderAngle: 160, lElbowAngle: 130, rElbowAngle: 130, lHipAngle: 180, rHipAngle: 180, lKneeAngle: 180, rKneeAngle: 170 },
    end: { torsoAngle: 20, lShoulderAngle: 160, rShoulderAngle: 160, lElbowAngle: 130, rElbowAngle: 130, lHipAngle: 180, rHipAngle: 130, lKneeAngle: 180, rKneeAngle: 150 },
    muscles: ["glutes"],
    equipment: "cable-ankle",
  },
  "sentadilla-banda": {
    start: { torsoAngle: 0, lShoulderAngle: 160, rShoulderAngle: 160, lElbowAngle: 130, rElbowAngle: 130, lHipAngle: 180, rHipAngle: 180, lKneeAngle: 180, rKneeAngle: 180 },
    end: { torsoAngle: 15, lShoulderAngle: 160, rShoulderAngle: 160, lElbowAngle: 130, rElbowAngle: 130, lHipAngle: 120, rHipAngle: 120, lKneeAngle: 100, rKneeAngle: 100 },
    muscles: ["quads", "glutes"],
    equipment: "band-knees",
  },
  "peso-muerto-banda": {
    start: { torsoAngle: 0, lShoulderAngle: 180, rShoulderAngle: 180, lElbowAngle: 180, rElbowAngle: 180, lHipAngle: 180, rHipAngle: 180, lKneeAngle: 180, rKneeAngle: 180 },
    end: { torsoAngle: 60, lShoulderAngle: 180, rShoulderAngle: 180, lElbowAngle: 180, rElbowAngle: 180, lHipAngle: 180, rHipAngle: 180, lKneeAngle: 170, rKneeAngle: 170 },
    muscles: ["hamstrings", "glutes", "lowerBack"],
    equipment: "band-feet",
  },
  "clamshell-banda": {
    start: { torsoAngle: 90, lShoulderAngle: 90, rShoulderAngle: 0, lElbowAngle: 180, rElbowAngle: 90, lHipAngle: 120, rHipAngle: 120, lKneeAngle: 100, rKneeAngle: 100 },
    end: { torsoAngle: 90, lShoulderAngle: 90, rShoulderAngle: 0, lElbowAngle: 180, rElbowAngle: 90, lHipAngle: 120, rHipAngle: 80, lKneeAngle: 100, rKneeAngle: 100 },
    muscles: ["glutes"],
    equipment: "band-knees",
  },
  "puente-gluteos-banda": {
    start: { torsoAngle: 85, lShoulderAngle: 90, rShoulderAngle: 90, lElbowAngle: 180, rElbowAngle: 180, lHipAngle: 110, rHipAngle: 110, lKneeAngle: 80, rKneeAngle: 80 },
    end: { torsoAngle: 60, lShoulderAngle: 90, rShoulderAngle: 90, lElbowAngle: 180, rElbowAngle: 180, lHipAngle: 130, rHipAngle: 130, lKneeAngle: 80, rKneeAngle: 80 },
    muscles: ["glutes"],
    equipment: "band-knees",
  },
  "monster-walk": {
    start: { torsoAngle: 5, lShoulderAngle: 160, rShoulderAngle: 160, lElbowAngle: 130, rElbowAngle: 130, lHipAngle: 175, rHipAngle: 185, lKneeAngle: 165, rKneeAngle: 165 },
    end: { torsoAngle: 5, lShoulderAngle: 160, rShoulderAngle: 160, lElbowAngle: 130, rElbowAngle: 130, lHipAngle: 155, rHipAngle: 205, lKneeAngle: 165, rKneeAngle: 165 },
    muscles: ["glutes"],
    equipment: "band-ankles",
  },

  // ---- BRAZOS ----
  "curl-biceps": {
    start: { torsoAngle: 0, lShoulderAngle: 180, rShoulderAngle: 180, lElbowAngle: 180, rElbowAngle: 180, lHipAngle: 180, rHipAngle: 180, lKneeAngle: 180, rKneeAngle: 180 },
    end: { torsoAngle: 0, lShoulderAngle: 170, rShoulderAngle: 170, lElbowAngle: 50, rElbowAngle: 50, lHipAngle: 180, rHipAngle: 180, lKneeAngle: 180, rKneeAngle: 180 },
    muscles: ["biceps"],
    equipment: "dumbbells-sides",
  },
  "curl-martillo": {
    start: { torsoAngle: 0, lShoulderAngle: 180, rShoulderAngle: 180, lElbowAngle: 180, rElbowAngle: 180, lHipAngle: 180, rHipAngle: 180, lKneeAngle: 180, rKneeAngle: 180 },
    end: { torsoAngle: 0, lShoulderAngle: 170, rShoulderAngle: 170, lElbowAngle: 55, rElbowAngle: 55, lHipAngle: 180, rHipAngle: 180, lKneeAngle: 180, rKneeAngle: 180 },
    muscles: ["biceps", "forearms"],
    equipment: "dumbbells-sides",
  },
  "extension-triceps-overhead": {
    start: { torsoAngle: 0, lShoulderAngle: 10, rShoulderAngle: 10, lElbowAngle: 0, rElbowAngle: 0, lHipAngle: 180, rHipAngle: 180, lKneeAngle: 180, rKneeAngle: 180 },
    end: { torsoAngle: 0, lShoulderAngle: 10, rShoulderAngle: 10, lElbowAngle: 220, rElbowAngle: 220, lHipAngle: 180, rHipAngle: 180, lKneeAngle: 180, rKneeAngle: 180 },
    muscles: ["triceps"],
    equipment: "dumbbell-overhead",
  },
  "curl-concentrado": {
    start: { torsoAngle: 30, lShoulderAngle: 180, rShoulderAngle: 180, lElbowAngle: 180, rElbowAngle: 180, lHipAngle: 100, rHipAngle: 100, lKneeAngle: 100, rKneeAngle: 100 },
    end: { torsoAngle: 30, lShoulderAngle: 170, rShoulderAngle: 180, lElbowAngle: 60, rElbowAngle: 180, lHipAngle: 100, rHipAngle: 100, lKneeAngle: 100, rKneeAngle: 100 },
    muscles: ["biceps"],
    equipment: "dumbbell-single",
  },
  "kickback-triceps": {
    start: { torsoAngle: 70, lShoulderAngle: 170, rShoulderAngle: 70, lElbowAngle: 180, rElbowAngle: 100, lHipAngle: 180, rHipAngle: 180, lKneeAngle: 180, rKneeAngle: 180 },
    end: { torsoAngle: 70, lShoulderAngle: 170, rShoulderAngle: 70, lElbowAngle: 180, rElbowAngle: 70, lHipAngle: 180, rHipAngle: 180, lKneeAngle: 180, rKneeAngle: 180 },
    muscles: ["triceps"],
    equipment: "dumbbell-single-r",
  },
  "curl-zottman": {
    start: { torsoAngle: 0, lShoulderAngle: 180, rShoulderAngle: 180, lElbowAngle: 180, rElbowAngle: 180, lHipAngle: 180, rHipAngle: 180, lKneeAngle: 180, rKneeAngle: 180 },
    end: { torsoAngle: 0, lShoulderAngle: 170, rShoulderAngle: 170, lElbowAngle: 50, rElbowAngle: 50, lHipAngle: 180, rHipAngle: 180, lKneeAngle: 180, rKneeAngle: 180 },
    muscles: ["biceps", "forearms"],
    equipment: "dumbbells-sides",
  },
  "curl-maquina-biceps": {
    start: { torsoAngle: -15, lShoulderAngle: 150, rShoulderAngle: 150, lElbowAngle: 170, rElbowAngle: 170, lHipAngle: 130, rHipAngle: 130, lKneeAngle: 100, rKneeAngle: 100 },
    end: { torsoAngle: -15, lShoulderAngle: 150, rShoulderAngle: 150, lElbowAngle: 60, rElbowAngle: 60, lHipAngle: 130, rHipAngle: 130, lKneeAngle: 100, rKneeAngle: 100 },
    muscles: ["biceps"],
    equipment: "machine",
  },
  "extension-triceps-maquina": {
    start: { torsoAngle: -15, lShoulderAngle: 150, rShoulderAngle: 150, lElbowAngle: 100, rElbowAngle: 100, lHipAngle: 130, rHipAngle: 130, lKneeAngle: 100, rKneeAngle: 100 },
    end: { torsoAngle: -15, lShoulderAngle: 150, rShoulderAngle: 150, lElbowAngle: 170, rElbowAngle: 170, lHipAngle: 130, rHipAngle: 130, lKneeAngle: 100, rKneeAngle: 100 },
    muscles: ["triceps"],
    equipment: "machine",
  },
  "curl-predicador-maquina": {
    start: { torsoAngle: 10, lShoulderAngle: 130, rShoulderAngle: 130, lElbowAngle: 170, rElbowAngle: 170, lHipAngle: 130, rHipAngle: 130, lKneeAngle: 100, rKneeAngle: 100 },
    end: { torsoAngle: 10, lShoulderAngle: 130, rShoulderAngle: 130, lElbowAngle: 60, rElbowAngle: 60, lHipAngle: 130, rHipAngle: 130, lKneeAngle: 100, rKneeAngle: 100 },
    muscles: ["biceps"],
    equipment: "machine",
  },
  "dip-asistido": {
    start: { torsoAngle: 0, lShoulderAngle: 250, rShoulderAngle: 110, lElbowAngle: 270, rElbowAngle: 90, lHipAngle: 180, rHipAngle: 180, lKneeAngle: 150, rKneeAngle: 150 },
    end: { torsoAngle: 10, lShoulderAngle: 210, rShoulderAngle: 150, lElbowAngle: 220, rElbowAngle: 140, lHipAngle: 180, rHipAngle: 180, lKneeAngle: 130, rKneeAngle: 130 },
    muscles: ["triceps", "chest"],
    equipment: "machine",
  },
  "curl-scott-maquina": {
    start: { torsoAngle: 15, lShoulderAngle: 130, rShoulderAngle: 130, lElbowAngle: 160, rElbowAngle: 160, lHipAngle: 130, rHipAngle: 130, lKneeAngle: 100, rKneeAngle: 100 },
    end: { torsoAngle: 15, lShoulderAngle: 130, rShoulderAngle: 130, lElbowAngle: 55, rElbowAngle: 55, lHipAngle: 130, rHipAngle: 130, lKneeAngle: 100, rKneeAngle: 100 },
    muscles: ["biceps"],
    equipment: "machine",
  },
  "press-frances-maquina": {
    start: { torsoAngle: 85, lShoulderAngle: 0, rShoulderAngle: 0, lElbowAngle: 0, rElbowAngle: 0, lHipAngle: 130, rHipAngle: 130, lKneeAngle: 110, rKneeAngle: 110 },
    end: { torsoAngle: 85, lShoulderAngle: 0, rShoulderAngle: 0, lElbowAngle: 260, rElbowAngle: 260, lHipAngle: 130, rHipAngle: 130, lKneeAngle: 110, rKneeAngle: 110 },
    muscles: ["triceps"],
    equipment: "machine",
  },
  "curl-cable": {
    start: { torsoAngle: 0, lShoulderAngle: 180, rShoulderAngle: 180, lElbowAngle: 180, rElbowAngle: 180, lHipAngle: 180, rHipAngle: 180, lKneeAngle: 180, rKneeAngle: 180 },
    end: { torsoAngle: 0, lShoulderAngle: 175, rShoulderAngle: 175, lElbowAngle: 50, rElbowAngle: 50, lHipAngle: 180, rHipAngle: 180, lKneeAngle: 180, rKneeAngle: 180 },
    muscles: ["biceps"],
    equipment: "cable-low",
  },
  "pushdown-triceps": {
    start: { torsoAngle: 5, lShoulderAngle: 170, rShoulderAngle: 170, lElbowAngle: 80, rElbowAngle: 80, lHipAngle: 180, rHipAngle: 180, lKneeAngle: 180, rKneeAngle: 180 },
    end: { torsoAngle: 5, lShoulderAngle: 170, rShoulderAngle: 170, lElbowAngle: 175, rElbowAngle: 175, lHipAngle: 180, rHipAngle: 180, lKneeAngle: 180, rKneeAngle: 180 },
    muscles: ["triceps"],
    equipment: "cable-high",
  },
  "curl-banda": {
    start: { torsoAngle: 0, lShoulderAngle: 180, rShoulderAngle: 180, lElbowAngle: 180, rElbowAngle: 180, lHipAngle: 180, rHipAngle: 180, lKneeAngle: 180, rKneeAngle: 180 },
    end: { torsoAngle: 0, lShoulderAngle: 175, rShoulderAngle: 175, lElbowAngle: 50, rElbowAngle: 50, lHipAngle: 180, rHipAngle: 180, lKneeAngle: 180, rKneeAngle: 180 },
    muscles: ["biceps"],
    equipment: "band-feet",
  },
  "extension-banda-overhead": {
    start: { torsoAngle: 0, lShoulderAngle: 10, rShoulderAngle: 10, lElbowAngle: 220, rElbowAngle: 220, lHipAngle: 180, rHipAngle: 180, lKneeAngle: 180, rKneeAngle: 180 },
    end: { torsoAngle: 0, lShoulderAngle: 10, rShoulderAngle: 10, lElbowAngle: 0, rElbowAngle: 0, lHipAngle: 180, rHipAngle: 180, lKneeAngle: 180, rKneeAngle: 180 },
    muscles: ["triceps"],
    equipment: "band-feet",
  },
  "curl-inverso-polea": {
    start: { torsoAngle: 0, lShoulderAngle: 180, rShoulderAngle: 180, lElbowAngle: 180, rElbowAngle: 180, lHipAngle: 180, rHipAngle: 180, lKneeAngle: 180, rKneeAngle: 180 },
    end: { torsoAngle: 0, lShoulderAngle: 175, rShoulderAngle: 175, lElbowAngle: 55, rElbowAngle: 55, lHipAngle: 180, rHipAngle: 180, lKneeAngle: 180, rKneeAngle: 180 },
    muscles: ["forearms", "biceps"],
    equipment: "cable-low",
  },
  "extension-triceps-banda": {
    start: { torsoAngle: 5, lShoulderAngle: 170, rShoulderAngle: 170, lElbowAngle: 80, rElbowAngle: 80, lHipAngle: 180, rHipAngle: 180, lKneeAngle: 180, rKneeAngle: 180 },
    end: { torsoAngle: 5, lShoulderAngle: 170, rShoulderAngle: 170, lElbowAngle: 175, rElbowAngle: 175, lHipAngle: 180, rHipAngle: 180, lKneeAngle: 180, rKneeAngle: 180 },
    muscles: ["triceps"],
    equipment: "band-high",
  },

  // ---- PECHO ----
  "press-pecho-plano": {
    start: { torsoAngle: 85, lShoulderAngle: 250, rShoulderAngle: 250, lElbowAngle: 270, rElbowAngle: 270, lHipAngle: 130, rHipAngle: 130, lKneeAngle: 110, rKneeAngle: 110 },
    end: { torsoAngle: 85, lShoulderAngle: 270, rShoulderAngle: 270, lElbowAngle: 0, rElbowAngle: 0, lHipAngle: 130, rHipAngle: 130, lKneeAngle: 110, rKneeAngle: 110 },
    muscles: ["chest"],
    equipment: "dumbbells-hands",
  },
  "press-inclinado-mancuernas": {
    start: { torsoAngle: 65, lShoulderAngle: 260, rShoulderAngle: 260, lElbowAngle: 270, rElbowAngle: 270, lHipAngle: 140, rHipAngle: 140, lKneeAngle: 100, rKneeAngle: 100 },
    end: { torsoAngle: 65, lShoulderAngle: 280, rShoulderAngle: 280, lElbowAngle: 350, rElbowAngle: 350, lHipAngle: 140, rHipAngle: 140, lKneeAngle: 100, rKneeAngle: 100 },
    muscles: ["chest", "shoulders"],
    equipment: "dumbbells-hands",
  },
  "aperturas-mancuernas": {
    start: { torsoAngle: 85, lShoulderAngle: 250, rShoulderAngle: 250, lElbowAngle: 260, rElbowAngle: 260, lHipAngle: 130, rHipAngle: 130, lKneeAngle: 110, rKneeAngle: 110 },
    end: { torsoAngle: 85, lShoulderAngle: 270, rShoulderAngle: 270, lElbowAngle: 350, rElbowAngle: 350, lHipAngle: 130, rHipAngle: 130, lKneeAngle: 110, rKneeAngle: 110 },
    muscles: ["chest"],
    equipment: "dumbbells-hands",
  },
  "press-declinado-mancuernas": {
    start: { torsoAngle: 100, lShoulderAngle: 240, rShoulderAngle: 240, lElbowAngle: 280, rElbowAngle: 280, lHipAngle: 130, rHipAngle: 130, lKneeAngle: 100, rKneeAngle: 100 },
    end: { torsoAngle: 100, lShoulderAngle: 270, rShoulderAngle: 270, lElbowAngle: 350, rElbowAngle: 350, lHipAngle: 130, rHipAngle: 130, lKneeAngle: 100, rKneeAngle: 100 },
    muscles: ["chest"],
    equipment: "dumbbells-hands",
  },
  "pullover-mancuerna": {
    start: { torsoAngle: 85, lShoulderAngle: 270, rShoulderAngle: 270, lElbowAngle: 350, rElbowAngle: 350, lHipAngle: 130, rHipAngle: 130, lKneeAngle: 110, rKneeAngle: 110 },
    end: { torsoAngle: 85, lShoulderAngle: 350, rShoulderAngle: 350, lElbowAngle: 350, rElbowAngle: 350, lHipAngle: 130, rHipAngle: 130, lKneeAngle: 110, rKneeAngle: 110 },
    muscles: ["chest", "lats"],
    equipment: "dumbbell-overhead",
  },
  "squeeze-press": {
    start: { torsoAngle: 85, lShoulderAngle: 255, rShoulderAngle: 255, lElbowAngle: 270, rElbowAngle: 270, lHipAngle: 130, rHipAngle: 130, lKneeAngle: 110, rKneeAngle: 110 },
    end: { torsoAngle: 85, lShoulderAngle: 270, rShoulderAngle: 270, lElbowAngle: 355, rElbowAngle: 355, lHipAngle: 130, rHipAngle: 130, lKneeAngle: 110, rKneeAngle: 110 },
    muscles: ["chest"],
    equipment: "dumbbells-hands",
  },
  "press-pecho-maquina": {
    start: { torsoAngle: -10, lShoulderAngle: 140, rShoulderAngle: 140, lElbowAngle: 100, rElbowAngle: 100, lHipAngle: 130, rHipAngle: 130, lKneeAngle: 100, rKneeAngle: 100 },
    end: { torsoAngle: -10, lShoulderAngle: 90, rShoulderAngle: 90, lElbowAngle: 90, rElbowAngle: 90, lHipAngle: 130, rHipAngle: 130, lKneeAngle: 100, rKneeAngle: 100 },
    muscles: ["chest"],
    equipment: "machine",
  },
  "pec-deck": {
    start: { torsoAngle: -10, lShoulderAngle: 270, rShoulderAngle: 90, lElbowAngle: 270, rElbowAngle: 90, lHipAngle: 130, rHipAngle: 130, lKneeAngle: 100, rKneeAngle: 100 },
    end: { torsoAngle: -10, lShoulderAngle: 195, rShoulderAngle: 165, lElbowAngle: 195, rElbowAngle: 165, lHipAngle: 130, rHipAngle: 130, lKneeAngle: 100, rKneeAngle: 100 },
    muscles: ["chest"],
    equipment: "machine",
  },
  "press-inclinado-maquina": {
    start: { torsoAngle: -15, lShoulderAngle: 110, rShoulderAngle: 110, lElbowAngle: 100, rElbowAngle: 100, lHipAngle: 130, rHipAngle: 130, lKneeAngle: 100, rKneeAngle: 100 },
    end: { torsoAngle: -15, lShoulderAngle: 60, rShoulderAngle: 60, lElbowAngle: 70, rElbowAngle: 70, lHipAngle: 130, rHipAngle: 130, lKneeAngle: 100, rKneeAngle: 100 },
    muscles: ["chest", "shoulders"],
    equipment: "machine",
  },
  "crossover-maquina": {
    start: { torsoAngle: 5, lShoulderAngle: 240, rShoulderAngle: 120, lElbowAngle: 250, rElbowAngle: 110, lHipAngle: 180, rHipAngle: 180, lKneeAngle: 180, rKneeAngle: 180 },
    end: { torsoAngle: 5, lShoulderAngle: 200, rShoulderAngle: 160, lElbowAngle: 200, rElbowAngle: 160, lHipAngle: 180, rHipAngle: 180, lKneeAngle: 180, rKneeAngle: 180 },
    muscles: ["chest"],
    equipment: "cable-both",
  },
  "smith-press-pecho": {
    start: { torsoAngle: 85, lShoulderAngle: 250, rShoulderAngle: 250, lElbowAngle: 270, rElbowAngle: 270, lHipAngle: 130, rHipAngle: 130, lKneeAngle: 110, rKneeAngle: 110 },
    end: { torsoAngle: 85, lShoulderAngle: 270, rShoulderAngle: 270, lElbowAngle: 0, rElbowAngle: 0, lHipAngle: 130, rHipAngle: 130, lKneeAngle: 110, rKneeAngle: 110 },
    muscles: ["chest"],
    equipment: "machine",
  },
  "press-declinado-maquina": {
    start: { torsoAngle: -10, lShoulderAngle: 150, rShoulderAngle: 150, lElbowAngle: 110, rElbowAngle: 110, lHipAngle: 130, rHipAngle: 130, lKneeAngle: 100, rKneeAngle: 100 },
    end: { torsoAngle: -10, lShoulderAngle: 100, rShoulderAngle: 100, lElbowAngle: 100, rElbowAngle: 100, lHipAngle: 130, rHipAngle: 130, lKneeAngle: 100, rKneeAngle: 100 },
    muscles: ["chest"],
    equipment: "machine",
  },
  "crossover-cables": {
    start: { torsoAngle: 10, lShoulderAngle: 230, rShoulderAngle: 130, lElbowAngle: 240, rElbowAngle: 120, lHipAngle: 175, rHipAngle: 185, lKneeAngle: 180, rKneeAngle: 180 },
    end: { torsoAngle: 10, lShoulderAngle: 195, rShoulderAngle: 165, lElbowAngle: 200, rElbowAngle: 160, lHipAngle: 175, rHipAngle: 185, lKneeAngle: 180, rKneeAngle: 180 },
    muscles: ["chest"],
    equipment: "cable-both",
  },
  "press-bandas-pecho": {
    start: { torsoAngle: 0, lShoulderAngle: 120, rShoulderAngle: 120, lElbowAngle: 100, rElbowAngle: 100, lHipAngle: 180, rHipAngle: 180, lKneeAngle: 180, rKneeAngle: 180 },
    end: { torsoAngle: 0, lShoulderAngle: 95, rShoulderAngle: 95, lElbowAngle: 95, rElbowAngle: 95, lHipAngle: 180, rHipAngle: 180, lKneeAngle: 180, rKneeAngle: 180 },
    muscles: ["chest"],
    equipment: "band-back",
  },
  "aperturas-cables-bajo": {
    start: { torsoAngle: 5, lShoulderAngle: 200, rShoulderAngle: 160, lElbowAngle: 200, rElbowAngle: 160, lHipAngle: 180, rHipAngle: 180, lKneeAngle: 180, rKneeAngle: 180 },
    end: { torsoAngle: 5, lShoulderAngle: 310, rShoulderAngle: 50, lElbowAngle: 310, rElbowAngle: 50, lHipAngle: 180, rHipAngle: 180, lKneeAngle: 180, rKneeAngle: 180 },
    muscles: ["chest"],
    equipment: "cable-both",
  },
  "aperturas-cables-alto": {
    start: { torsoAngle: 5, lShoulderAngle: 240, rShoulderAngle: 120, lElbowAngle: 240, rElbowAngle: 120, lHipAngle: 180, rHipAngle: 180, lKneeAngle: 180, rKneeAngle: 180 },
    end: { torsoAngle: 10, lShoulderAngle: 195, rShoulderAngle: 165, lElbowAngle: 195, rElbowAngle: 165, lHipAngle: 180, rHipAngle: 180, lKneeAngle: 180, rKneeAngle: 180 },
    muscles: ["chest"],
    equipment: "cable-both",
  },
  "press-inclinado-cable": {
    start: { torsoAngle: -20, lShoulderAngle: 130, rShoulderAngle: 130, lElbowAngle: 100, rElbowAngle: 100, lHipAngle: 140, rHipAngle: 140, lKneeAngle: 100, rKneeAngle: 100 },
    end: { torsoAngle: -20, lShoulderAngle: 60, rShoulderAngle: 60, lElbowAngle: 60, rElbowAngle: 60, lHipAngle: 140, rHipAngle: 140, lKneeAngle: 100, rKneeAngle: 100 },
    muscles: ["chest"],
    equipment: "cable-low",
  },
  "cruce-cable-unilateral": {
    start: { torsoAngle: 5, lShoulderAngle: 240, rShoulderAngle: 160, lElbowAngle: 250, rElbowAngle: 160, lHipAngle: 180, rHipAngle: 180, lKneeAngle: 180, rKneeAngle: 180 },
    end: { torsoAngle: 5, lShoulderAngle: 170, rShoulderAngle: 160, lElbowAngle: 170, rElbowAngle: 160, lHipAngle: 180, rHipAngle: 180, lKneeAngle: 180, rKneeAngle: 180 },
    muscles: ["chest"],
    equipment: "cable-single",
  },

  // ---- ESPALDA ----
  "remo-mancuerna": {
    start: { torsoAngle: 65, lShoulderAngle: 170, rShoulderAngle: 180, lElbowAngle: 180, rElbowAngle: 180, lHipAngle: 180, rHipAngle: 180, lKneeAngle: 170, rKneeAngle: 170 },
    end: { torsoAngle: 65, lShoulderAngle: 50, rShoulderAngle: 180, lElbowAngle: 100, rElbowAngle: 180, lHipAngle: 180, rHipAngle: 180, lKneeAngle: 170, rKneeAngle: 170 },
    muscles: ["lats", "biceps"],
    equipment: "dumbbell-single",
  },
  "remo-inclinado-bilateral": {
    start: { torsoAngle: 55, lShoulderAngle: 180, rShoulderAngle: 180, lElbowAngle: 180, rElbowAngle: 180, lHipAngle: 180, rHipAngle: 180, lKneeAngle: 170, rKneeAngle: 170 },
    end: { torsoAngle: 55, lShoulderAngle: 60, rShoulderAngle: 60, lElbowAngle: 100, rElbowAngle: 100, lHipAngle: 180, rHipAngle: 180, lKneeAngle: 170, rKneeAngle: 170 },
    muscles: ["lats", "upperBack"],
    equipment: "dumbbells-sides",
  },
  "peso-muerto-mancuernas": {
    start: { torsoAngle: 0, lShoulderAngle: 180, rShoulderAngle: 180, lElbowAngle: 180, rElbowAngle: 180, lHipAngle: 180, rHipAngle: 180, lKneeAngle: 180, rKneeAngle: 180 },
    end: { torsoAngle: 65, lShoulderAngle: 180, rShoulderAngle: 180, lElbowAngle: 180, rElbowAngle: 180, lHipAngle: 160, rHipAngle: 160, lKneeAngle: 155, rKneeAngle: 155 },
    muscles: ["lowerBack", "hamstrings", "glutes"],
    equipment: "dumbbells-front",
  },
  "pullover-espalda": {
    start: { torsoAngle: 85, lShoulderAngle: 270, rShoulderAngle: 270, lElbowAngle: 350, rElbowAngle: 350, lHipAngle: 130, rHipAngle: 130, lKneeAngle: 110, rKneeAngle: 110 },
    end: { torsoAngle: 85, lShoulderAngle: 350, rShoulderAngle: 350, lElbowAngle: 350, rElbowAngle: 350, lHipAngle: 130, rHipAngle: 130, lKneeAngle: 110, rKneeAngle: 110 },
    muscles: ["lats"],
    equipment: "dumbbell-overhead",
  },
  "remo-kroc": {
    start: { torsoAngle: 60, lShoulderAngle: 180, rShoulderAngle: 180, lElbowAngle: 180, rElbowAngle: 180, lHipAngle: 180, rHipAngle: 180, lKneeAngle: 170, rKneeAngle: 170 },
    end: { torsoAngle: 50, lShoulderAngle: 40, rShoulderAngle: 180, lElbowAngle: 80, rElbowAngle: 180, lHipAngle: 180, rHipAngle: 180, lKneeAngle: 170, rKneeAngle: 170 },
    muscles: ["lats", "upperBack"],
    equipment: "dumbbell-single",
  },
  "encogimientos-mancuernas": {
    start: { torsoAngle: 0, lShoulderAngle: 190, rShoulderAngle: 170, lElbowAngle: 185, rElbowAngle: 175, lHipAngle: 180, rHipAngle: 180, lKneeAngle: 180, rKneeAngle: 180 },
    end: { torsoAngle: -3, lShoulderAngle: 230, rShoulderAngle: 130, lElbowAngle: 210, rElbowAngle: 150, lHipAngle: 180, rHipAngle: 180, lKneeAngle: 180, rKneeAngle: 180 },
    muscles: ["traps"],
    equipment: "dumbbells-sides",
  },
  "jalon-pecho": {
    start: { torsoAngle: -10, lShoulderAngle: 340, rShoulderAngle: 20, lElbowAngle: 350, rElbowAngle: 10, lHipAngle: 130, rHipAngle: 130, lKneeAngle: 100, rKneeAngle: 100 },
    end: { torsoAngle: -5, lShoulderAngle: 240, rShoulderAngle: 120, lElbowAngle: 270, rElbowAngle: 90, lHipAngle: 130, rHipAngle: 130, lKneeAngle: 100, rKneeAngle: 100 },
    muscles: ["lats"],
    equipment: "cable-high",
  },
  "remo-sentado-maquina": {
    start: { torsoAngle: -5, lShoulderAngle: 100, rShoulderAngle: 100, lElbowAngle: 100, rElbowAngle: 100, lHipAngle: 130, rHipAngle: 130, lKneeAngle: 160, rKneeAngle: 160 },
    end: { torsoAngle: -5, lShoulderAngle: 180, rShoulderAngle: 180, lElbowAngle: 200, rElbowAngle: 200, lHipAngle: 130, rHipAngle: 130, lKneeAngle: 160, rKneeAngle: 160 },
    muscles: ["lats", "upperBack"],
    equipment: "cable-mid",
  },
  "jalon-agarre-cerrado": {
    start: { torsoAngle: -10, lShoulderAngle: 350, rShoulderAngle: 10, lElbowAngle: 360, rElbowAngle: 0, lHipAngle: 130, rHipAngle: 130, lKneeAngle: 100, rKneeAngle: 100 },
    end: { torsoAngle: -5, lShoulderAngle: 200, rShoulderAngle: 160, lElbowAngle: 230, rElbowAngle: 130, lHipAngle: 130, rHipAngle: 130, lKneeAngle: 100, rKneeAngle: 100 },
    muscles: ["lats"],
    equipment: "cable-high",
  },
  "remo-tbar": {
    start: { torsoAngle: 55, lShoulderAngle: 170, rShoulderAngle: 170, lElbowAngle: 180, rElbowAngle: 180, lHipAngle: 180, rHipAngle: 180, lKneeAngle: 170, rKneeAngle: 170 },
    end: { torsoAngle: 50, lShoulderAngle: 60, rShoulderAngle: 60, lElbowAngle: 100, rElbowAngle: 100, lHipAngle: 180, rHipAngle: 180, lKneeAngle: 170, rKneeAngle: 170 },
    muscles: ["lats", "upperBack"],
    equipment: "machine",
  },
  "pulldown-brazos-rectos": {
    start: { torsoAngle: 10, lShoulderAngle: 50, rShoulderAngle: 50, lElbowAngle: 50, rElbowAngle: 50, lHipAngle: 180, rHipAngle: 180, lKneeAngle: 180, rKneeAngle: 180 },
    end: { torsoAngle: 10, lShoulderAngle: 170, rShoulderAngle: 170, lElbowAngle: 170, rElbowAngle: 170, lHipAngle: 180, rHipAngle: 180, lKneeAngle: 180, rKneeAngle: 180 },
    muscles: ["lats"],
    equipment: "cable-high",
  },
  "hiperextension": {
    start: { torsoAngle: 120, lShoulderAngle: 170, rShoulderAngle: 170, lElbowAngle: 130, rElbowAngle: 130, lHipAngle: 180, rHipAngle: 180, lKneeAngle: 180, rKneeAngle: 180 },
    end: { torsoAngle: 80, lShoulderAngle: 170, rShoulderAngle: 170, lElbowAngle: 130, rElbowAngle: 130, lHipAngle: 180, rHipAngle: 180, lKneeAngle: 180, rKneeAngle: 180 },
    muscles: ["lowerBack", "glutes"],
    equipment: "none",
  },
  "remo-cable": {
    start: { torsoAngle: -5, lShoulderAngle: 100, rShoulderAngle: 100, lElbowAngle: 100, rElbowAngle: 100, lHipAngle: 130, rHipAngle: 130, lKneeAngle: 160, rKneeAngle: 160 },
    end: { torsoAngle: -5, lShoulderAngle: 175, rShoulderAngle: 175, lElbowAngle: 195, rElbowAngle: 195, lHipAngle: 130, rHipAngle: 130, lKneeAngle: 160, rKneeAngle: 160 },
    muscles: ["lats"],
    equipment: "cable-mid",
  },
  "face-pull": {
    start: { torsoAngle: 0, lShoulderAngle: 95, rShoulderAngle: 95, lElbowAngle: 95, rElbowAngle: 95, lHipAngle: 180, rHipAngle: 180, lKneeAngle: 180, rKneeAngle: 180 },
    end: { torsoAngle: 0, lShoulderAngle: 280, rShoulderAngle: 80, lElbowAngle: 300, rElbowAngle: 60, lHipAngle: 180, rHipAngle: 180, lKneeAngle: 180, rKneeAngle: 180 },
    muscles: ["upperBack", "shoulders"],
    equipment: "cable-high",
  },
  "jalon-banda": {
    start: { torsoAngle: 0, lShoulderAngle: 10, rShoulderAngle: 10, lElbowAngle: 10, rElbowAngle: 10, lHipAngle: 130, rHipAngle: 130, lKneeAngle: 180, rKneeAngle: 180 },
    end: { torsoAngle: 0, lShoulderAngle: 200, rShoulderAngle: 160, lElbowAngle: 230, rElbowAngle: 130, lHipAngle: 130, rHipAngle: 130, lKneeAngle: 180, rKneeAngle: 180 },
    muscles: ["lats"],
    equipment: "band-high",
  },
  "remo-bajo-cable": {
    start: { torsoAngle: -5, lShoulderAngle: 100, rShoulderAngle: 100, lElbowAngle: 100, rElbowAngle: 100, lHipAngle: 130, rHipAngle: 130, lKneeAngle: 160, rKneeAngle: 160 },
    end: { torsoAngle: -5, lShoulderAngle: 175, rShoulderAngle: 175, lElbowAngle: 200, rElbowAngle: 200, lHipAngle: 130, rHipAngle: 130, lKneeAngle: 160, rKneeAngle: 160 },
    muscles: ["upperBack"],
    equipment: "cable-mid",
  },
  "pullover-cable": {
    start: { torsoAngle: 10, lShoulderAngle: 50, rShoulderAngle: 50, lElbowAngle: 50, rElbowAngle: 50, lHipAngle: 180, rHipAngle: 180, lKneeAngle: 180, rKneeAngle: 180 },
    end: { torsoAngle: 10, lShoulderAngle: 175, rShoulderAngle: 175, lElbowAngle: 175, rElbowAngle: 175, lHipAngle: 180, rHipAngle: 180, lKneeAngle: 180, rKneeAngle: 180 },
    muscles: ["lats"],
    equipment: "cable-high",
  },
  "remo-alto-cable": {
    start: { torsoAngle: 5, lShoulderAngle: 80, rShoulderAngle: 80, lElbowAngle: 80, rElbowAngle: 80, lHipAngle: 180, rHipAngle: 180, lKneeAngle: 180, rKneeAngle: 180 },
    end: { torsoAngle: 5, lShoulderAngle: 280, rShoulderAngle: 80, lElbowAngle: 300, rElbowAngle: 60, lHipAngle: 180, rHipAngle: 180, lKneeAngle: 180, rKneeAngle: 180 },
    muscles: ["upperBack", "traps"],
    equipment: "cable-high",
  },

  // ---- HOMBROS ----
  "press-militar-mancuernas": {
    start: { torsoAngle: 0, lShoulderAngle: 280, rShoulderAngle: 80, lElbowAngle: 270, rElbowAngle: 90, lHipAngle: 180, rHipAngle: 180, lKneeAngle: 180, rKneeAngle: 180 },
    end: { torsoAngle: 0, lShoulderAngle: 350, rShoulderAngle: 10, lElbowAngle: 350, rElbowAngle: 10, lHipAngle: 180, rHipAngle: 180, lKneeAngle: 180, rKneeAngle: 180 },
    muscles: ["shoulders"],
    equipment: "dumbbells-hands",
  },
  "elevacion-lateral": {
    start: { torsoAngle: 0, lShoulderAngle: 190, rShoulderAngle: 170, lElbowAngle: 190, rElbowAngle: 170, lHipAngle: 180, rHipAngle: 180, lKneeAngle: 180, rKneeAngle: 180 },
    end: { torsoAngle: 0, lShoulderAngle: 270, rShoulderAngle: 90, lElbowAngle: 270, rElbowAngle: 90, lHipAngle: 180, rHipAngle: 180, lKneeAngle: 180, rKneeAngle: 180 },
    muscles: ["shoulders"],
    equipment: "dumbbells-sides",
  },
  "elevacion-frontal": {
    start: { torsoAngle: 0, lShoulderAngle: 170, rShoulderAngle: 170, lElbowAngle: 170, rElbowAngle: 170, lHipAngle: 180, rHipAngle: 180, lKneeAngle: 180, rKneeAngle: 180 },
    end: { torsoAngle: 0, lShoulderAngle: 90, rShoulderAngle: 90, lElbowAngle: 90, rElbowAngle: 90, lHipAngle: 180, rHipAngle: 180, lKneeAngle: 180, rKneeAngle: 180 },
    muscles: ["shoulders"],
    equipment: "dumbbells-front",
  },
  "pajaros-reversefly": {
    start: { torsoAngle: 70, lShoulderAngle: 180, rShoulderAngle: 180, lElbowAngle: 180, rElbowAngle: 180, lHipAngle: 180, rHipAngle: 180, lKneeAngle: 170, rKneeAngle: 170 },
    end: { torsoAngle: 70, lShoulderAngle: 280, rShoulderAngle: 80, lElbowAngle: 280, rElbowAngle: 80, lHipAngle: 180, rHipAngle: 180, lKneeAngle: 170, rKneeAngle: 170 },
    muscles: ["shoulders", "upperBack"],
    equipment: "dumbbells-sides",
  },
  "press-arnold": {
    start: { torsoAngle: 0, lShoulderAngle: 200, rShoulderAngle: 160, lElbowAngle: 310, rElbowAngle: 50, lHipAngle: 180, rHipAngle: 180, lKneeAngle: 180, rKneeAngle: 180 },
    end: { torsoAngle: 0, lShoulderAngle: 350, rShoulderAngle: 10, lElbowAngle: 350, rElbowAngle: 10, lHipAngle: 180, rHipAngle: 180, lKneeAngle: 180, rKneeAngle: 180 },
    muscles: ["shoulders"],
    equipment: "dumbbells-hands",
  },
  "encogimientos-hombros": {
    start: { torsoAngle: 0, lShoulderAngle: 190, rShoulderAngle: 170, lElbowAngle: 185, rElbowAngle: 175, lHipAngle: 180, rHipAngle: 180, lKneeAngle: 180, rKneeAngle: 180 },
    end: { torsoAngle: -3, lShoulderAngle: 230, rShoulderAngle: 130, lElbowAngle: 210, rElbowAngle: 150, lHipAngle: 180, rHipAngle: 180, lKneeAngle: 180, rKneeAngle: 180 },
    muscles: ["traps"],
    equipment: "dumbbells-sides",
  },
  "press-hombro-maquina": {
    start: { torsoAngle: -10, lShoulderAngle: 280, rShoulderAngle: 80, lElbowAngle: 270, rElbowAngle: 90, lHipAngle: 130, rHipAngle: 130, lKneeAngle: 100, rKneeAngle: 100 },
    end: { torsoAngle: -10, lShoulderAngle: 345, rShoulderAngle: 15, lElbowAngle: 345, rElbowAngle: 15, lHipAngle: 130, rHipAngle: 130, lKneeAngle: 100, rKneeAngle: 100 },
    muscles: ["shoulders"],
    equipment: "machine",
  },
  "elevacion-lateral-maquina": {
    start: { torsoAngle: -10, lShoulderAngle: 190, rShoulderAngle: 170, lElbowAngle: 200, rElbowAngle: 160, lHipAngle: 130, rHipAngle: 130, lKneeAngle: 100, rKneeAngle: 100 },
    end: { torsoAngle: -10, lShoulderAngle: 270, rShoulderAngle: 90, lElbowAngle: 270, rElbowAngle: 90, lHipAngle: 130, rHipAngle: 130, lKneeAngle: 100, rKneeAngle: 100 },
    muscles: ["shoulders"],
    equipment: "machine",
  },
  "reverse-pec-deck": {
    start: { torsoAngle: -10, lShoulderAngle: 100, rShoulderAngle: 100, lElbowAngle: 100, rElbowAngle: 100, lHipAngle: 130, rHipAngle: 130, lKneeAngle: 100, rKneeAngle: 100 },
    end: { torsoAngle: -10, lShoulderAngle: 260, rShoulderAngle: 100, lElbowAngle: 260, rElbowAngle: 100, lHipAngle: 130, rHipAngle: 130, lKneeAngle: 100, rKneeAngle: 100 },
    muscles: ["shoulders", "upperBack"],
    equipment: "machine",
  },
  "smith-press-hombro": {
    start: { torsoAngle: -10, lShoulderAngle: 280, rShoulderAngle: 80, lElbowAngle: 270, rElbowAngle: 90, lHipAngle: 130, rHipAngle: 130, lKneeAngle: 100, rKneeAngle: 100 },
    end: { torsoAngle: -10, lShoulderAngle: 350, rShoulderAngle: 10, lElbowAngle: 350, rElbowAngle: 10, lHipAngle: 130, rHipAngle: 130, lKneeAngle: 100, rKneeAngle: 100 },
    muscles: ["shoulders"],
    equipment: "machine",
  },
  "maquina-encogimientos": {
    start: { torsoAngle: 0, lShoulderAngle: 190, rShoulderAngle: 170, lElbowAngle: 185, rElbowAngle: 175, lHipAngle: 180, rHipAngle: 180, lKneeAngle: 180, rKneeAngle: 180 },
    end: { torsoAngle: -3, lShoulderAngle: 230, rShoulderAngle: 130, lElbowAngle: 210, rElbowAngle: 150, lHipAngle: 180, rHipAngle: 180, lKneeAngle: 180, rKneeAngle: 180 },
    muscles: ["traps"],
    equipment: "machine",
  },
  "press-sentado-maquina-hombro": {
    start: { torsoAngle: -10, lShoulderAngle: 280, rShoulderAngle: 80, lElbowAngle: 270, rElbowAngle: 90, lHipAngle: 130, rHipAngle: 130, lKneeAngle: 100, rKneeAngle: 100 },
    end: { torsoAngle: -10, lShoulderAngle: 345, rShoulderAngle: 15, lElbowAngle: 345, rElbowAngle: 15, lHipAngle: 130, rHipAngle: 130, lKneeAngle: 100, rKneeAngle: 100 },
    muscles: ["shoulders"],
    equipment: "machine",
  },
  "elevacion-lateral-cable": {
    start: { torsoAngle: 0, lShoulderAngle: 190, rShoulderAngle: 170, lElbowAngle: 190, rElbowAngle: 170, lHipAngle: 180, rHipAngle: 180, lKneeAngle: 180, rKneeAngle: 180 },
    end: { torsoAngle: 0, lShoulderAngle: 270, rShoulderAngle: 90, lElbowAngle: 270, rElbowAngle: 90, lHipAngle: 180, rHipAngle: 180, lKneeAngle: 180, rKneeAngle: 180 },
    muscles: ["shoulders"],
    equipment: "cable-low",
  },
  "face-pull-cable": {
    start: { torsoAngle: 0, lShoulderAngle: 95, rShoulderAngle: 95, lElbowAngle: 95, rElbowAngle: 95, lHipAngle: 180, rHipAngle: 180, lKneeAngle: 180, rKneeAngle: 180 },
    end: { torsoAngle: 0, lShoulderAngle: 280, rShoulderAngle: 80, lElbowAngle: 300, rElbowAngle: 60, lHipAngle: 180, rHipAngle: 180, lKneeAngle: 180, rKneeAngle: 180 },
    muscles: ["shoulders", "upperBack"],
    equipment: "cable-high",
  },
  "elevacion-frontal-banda": {
    start: { torsoAngle: 0, lShoulderAngle: 170, rShoulderAngle: 170, lElbowAngle: 170, rElbowAngle: 170, lHipAngle: 180, rHipAngle: 180, lKneeAngle: 180, rKneeAngle: 180 },
    end: { torsoAngle: 0, lShoulderAngle: 90, rShoulderAngle: 90, lElbowAngle: 90, rElbowAngle: 90, lHipAngle: 180, rHipAngle: 180, lKneeAngle: 180, rKneeAngle: 180 },
    muscles: ["shoulders"],
    equipment: "band-feet",
  },
  "press-banda-hombros": {
    start: { torsoAngle: 0, lShoulderAngle: 280, rShoulderAngle: 80, lElbowAngle: 270, rElbowAngle: 90, lHipAngle: 180, rHipAngle: 180, lKneeAngle: 180, rKneeAngle: 180 },
    end: { torsoAngle: 0, lShoulderAngle: 350, rShoulderAngle: 10, lElbowAngle: 350, rElbowAngle: 10, lHipAngle: 180, rHipAngle: 180, lKneeAngle: 180, rKneeAngle: 180 },
    muscles: ["shoulders"],
    equipment: "band-feet",
  },
  "rotacion-externa-banda": {
    start: { torsoAngle: 0, lShoulderAngle: 180, rShoulderAngle: 170, lElbowAngle: 180, rElbowAngle: 90, lHipAngle: 180, rHipAngle: 180, lKneeAngle: 180, rKneeAngle: 180 },
    end: { torsoAngle: 0, lShoulderAngle: 180, rShoulderAngle: 170, lElbowAngle: 180, rElbowAngle: 170, lHipAngle: 180, rHipAngle: 180, lKneeAngle: 180, rKneeAngle: 180 },
    muscles: ["shoulders"],
    equipment: "band-side",
  },
  "pull-apart-banda": {
    start: { torsoAngle: 0, lShoulderAngle: 100, rShoulderAngle: 80, lElbowAngle: 100, rElbowAngle: 80, lHipAngle: 180, rHipAngle: 180, lKneeAngle: 180, rKneeAngle: 180 },
    end: { torsoAngle: 0, lShoulderAngle: 260, rShoulderAngle: 100, lElbowAngle: 260, rElbowAngle: 100, lHipAngle: 180, rHipAngle: 180, lKneeAngle: 180, rKneeAngle: 180 },
    muscles: ["shoulders", "upperBack"],
    equipment: "band-front",
  },

  // ---- CORE / ABDOMINALES ----
  "crunch-mancuerna": {
    start: { torsoAngle: 85, lShoulderAngle: 160, rShoulderAngle: 160, lElbowAngle: 120, rElbowAngle: 120, lHipAngle: 110, rHipAngle: 110, lKneeAngle: 80, rKneeAngle: 80 },
    end: { torsoAngle: 60, lShoulderAngle: 160, rShoulderAngle: 160, lElbowAngle: 120, rElbowAngle: 120, lHipAngle: 110, rHipAngle: 110, lKneeAngle: 80, rKneeAngle: 80 },
    muscles: ["abs"],
    equipment: "dumbbell-chest",
  },
  "russian-twist": {
    start: { torsoAngle: 50, lShoulderAngle: 130, rShoulderAngle: 130, lElbowAngle: 130, rElbowAngle: 130, lHipAngle: 110, rHipAngle: 110, lKneeAngle: 90, rKneeAngle: 90 },
    end: { torsoAngle: 50, lShoulderAngle: 200, rShoulderAngle: 200, lElbowAngle: 200, rElbowAngle: 200, lHipAngle: 110, rHipAngle: 110, lKneeAngle: 90, rKneeAngle: 90 },
    muscles: ["obliques", "abs"],
    equipment: "dumbbell-chest",
  },
  "plancha-remo": {
    start: { torsoAngle: 80, lShoulderAngle: 180, rShoulderAngle: 180, lElbowAngle: 180, rElbowAngle: 180, lHipAngle: 80, rHipAngle: 80, lKneeAngle: 180, rKneeAngle: 180 },
    end: { torsoAngle: 80, lShoulderAngle: 50, rShoulderAngle: 180, lElbowAngle: 100, rElbowAngle: 180, lHipAngle: 80, rHipAngle: 80, lKneeAngle: 180, rKneeAngle: 180 },
    muscles: ["abs", "lats"],
    equipment: "dumbbells-hands",
  },
  "woodchop-mancuerna": {
    start: { torsoAngle: 5, lShoulderAngle: 320, rShoulderAngle: 320, lElbowAngle: 320, rElbowAngle: 320, lHipAngle: 180, rHipAngle: 180, lKneeAngle: 180, rKneeAngle: 180 },
    end: { torsoAngle: 20, lShoulderAngle: 160, rShoulderAngle: 160, lElbowAngle: 160, rElbowAngle: 160, lHipAngle: 175, rHipAngle: 175, lKneeAngle: 170, rKneeAngle: 170 },
    muscles: ["obliques", "abs"],
    equipment: "dumbbell-overhead",
  },
  "farmers-carry": {
    start: { torsoAngle: 0, lShoulderAngle: 180, rShoulderAngle: 180, lElbowAngle: 180, rElbowAngle: 180, lHipAngle: 180, rHipAngle: 180, lKneeAngle: 180, rKneeAngle: 180 },
    end: { torsoAngle: 0, lShoulderAngle: 180, rShoulderAngle: 180, lElbowAngle: 180, rElbowAngle: 180, lHipAngle: 155, rHipAngle: 210, lKneeAngle: 180, rKneeAngle: 155 },
    muscles: ["abs", "traps", "forearms"],
    equipment: "dumbbells-sides",
  },
  "side-bend": {
    start: { torsoAngle: 0, lShoulderAngle: 180, rShoulderAngle: 350, lElbowAngle: 180, rElbowAngle: 350, lHipAngle: 180, rHipAngle: 180, lKneeAngle: 180, rKneeAngle: 180 },
    end: { torsoAngle: -35, lShoulderAngle: 180, rShoulderAngle: 350, lElbowAngle: 180, rElbowAngle: 350, lHipAngle: 180, rHipAngle: 180, lKneeAngle: 180, rKneeAngle: 180 },
    muscles: ["obliques"],
    equipment: "dumbbell-single",
  },
  "crunch-maquina": {
    start: { torsoAngle: -15, lShoulderAngle: 340, rShoulderAngle: 340, lElbowAngle: 300, rElbowAngle: 300, lHipAngle: 130, rHipAngle: 130, lKneeAngle: 100, rKneeAngle: 100 },
    end: { torsoAngle: 30, lShoulderAngle: 340, rShoulderAngle: 340, lElbowAngle: 300, rElbowAngle: 300, lHipAngle: 130, rHipAngle: 130, lKneeAngle: 100, rKneeAngle: 100 },
    muscles: ["abs"],
    equipment: "machine",
  },
  "rotacion-torso-maquina": {
    start: { torsoAngle: -25, lShoulderAngle: 110, rShoulderAngle: 110, lElbowAngle: 100, rElbowAngle: 100, lHipAngle: 130, rHipAngle: 130, lKneeAngle: 100, rKneeAngle: 100 },
    end: { torsoAngle: 25, lShoulderAngle: 110, rShoulderAngle: 110, lElbowAngle: 100, rElbowAngle: 100, lHipAngle: 130, rHipAngle: 130, lKneeAngle: 100, rKneeAngle: 100 },
    muscles: ["obliques"],
    equipment: "machine",
  },
  "elevacion-piernas-romana": {
    start: { torsoAngle: 0, lShoulderAngle: 270, rShoulderAngle: 90, lElbowAngle: 180, rElbowAngle: 180, lHipAngle: 180, rHipAngle: 180, lKneeAngle: 180, rKneeAngle: 180 },
    end: { torsoAngle: 0, lShoulderAngle: 270, rShoulderAngle: 90, lElbowAngle: 180, rElbowAngle: 180, lHipAngle: 100, rHipAngle: 100, lKneeAngle: 100, rKneeAngle: 100 },
    muscles: ["abs"],
    equipment: "machine",
  },
  "ab-roller-maquina": {
    start: { torsoAngle: 40, lShoulderAngle: 100, rShoulderAngle: 100, lElbowAngle: 100, rElbowAngle: 100, lHipAngle: 120, rHipAngle: 120, lKneeAngle: 180, rKneeAngle: 180 },
    end: { torsoAngle: 80, lShoulderAngle: 80, rShoulderAngle: 80, lElbowAngle: 80, rElbowAngle: 80, lHipAngle: 80, rHipAngle: 80, lKneeAngle: 180, rKneeAngle: 180 },
    muscles: ["abs"],
    equipment: "none",
  },
  "hiperextension-inversa": {
    start: { torsoAngle: 90, lShoulderAngle: 90, rShoulderAngle: 90, lElbowAngle: 180, rElbowAngle: 180, lHipAngle: 230, rHipAngle: 230, lKneeAngle: 180, rKneeAngle: 180 },
    end: { torsoAngle: 90, lShoulderAngle: 90, rShoulderAngle: 90, lElbowAngle: 180, rElbowAngle: 180, lHipAngle: 180, rHipAngle: 180, lKneeAngle: 180, rKneeAngle: 180 },
    muscles: ["lowerBack", "glutes"],
    equipment: "machine",
  },
  "crunch-polea-alta": {
    start: { torsoAngle: -5, lShoulderAngle: 340, rShoulderAngle: 340, lElbowAngle: 300, rElbowAngle: 300, lHipAngle: 120, rHipAngle: 120, lKneeAngle: 180, rKneeAngle: 180 },
    end: { torsoAngle: 50, lShoulderAngle: 340, rShoulderAngle: 340, lElbowAngle: 300, rElbowAngle: 300, lHipAngle: 120, rHipAngle: 120, lKneeAngle: 180, rKneeAngle: 180 },
    muscles: ["abs"],
    equipment: "cable-high",
  },
  "pallof-press": {
    start: { torsoAngle: 0, lShoulderAngle: 150, rShoulderAngle: 150, lElbowAngle: 80, rElbowAngle: 80, lHipAngle: 180, rHipAngle: 180, lKneeAngle: 170, rKneeAngle: 170 },
    end: { torsoAngle: 0, lShoulderAngle: 90, rShoulderAngle: 90, lElbowAngle: 90, rElbowAngle: 90, lHipAngle: 180, rHipAngle: 180, lKneeAngle: 170, rKneeAngle: 170 },
    muscles: ["abs", "obliques"],
    equipment: "cable-mid",
  },
  "woodchop-cable": {
    start: { torsoAngle: 0, lShoulderAngle: 320, rShoulderAngle: 320, lElbowAngle: 320, rElbowAngle: 320, lHipAngle: 180, rHipAngle: 180, lKneeAngle: 175, rKneeAngle: 175 },
    end: { torsoAngle: 20, lShoulderAngle: 150, rShoulderAngle: 150, lElbowAngle: 150, rElbowAngle: 150, lHipAngle: 175, rHipAngle: 175, lKneeAngle: 170, rKneeAngle: 170 },
    muscles: ["obliques"],
    equipment: "cable-high",
  },
  "crunch-cable": {
    start: { torsoAngle: 0, lShoulderAngle: 340, rShoulderAngle: 340, lElbowAngle: 300, rElbowAngle: 300, lHipAngle: 180, rHipAngle: 180, lKneeAngle: 180, rKneeAngle: 180 },
    end: { torsoAngle: 40, lShoulderAngle: 340, rShoulderAngle: 340, lElbowAngle: 300, rElbowAngle: 300, lHipAngle: 180, rHipAngle: 180, lKneeAngle: 180, rKneeAngle: 180 },
    muscles: ["abs"],
    equipment: "cable-high",
  },
  "anti-rotacion-banda": {
    start: { torsoAngle: 0, lShoulderAngle: 150, rShoulderAngle: 150, lElbowAngle: 80, rElbowAngle: 80, lHipAngle: 180, rHipAngle: 180, lKneeAngle: 170, rKneeAngle: 170 },
    end: { torsoAngle: 0, lShoulderAngle: 90, rShoulderAngle: 90, lElbowAngle: 90, rElbowAngle: 90, lHipAngle: 180, rHipAngle: 180, lKneeAngle: 170, rKneeAngle: 170 },
    muscles: ["abs", "obliques"],
    equipment: "band-side",
  },
  "dead-bug-banda": {
    start: { torsoAngle: 85, lShoulderAngle: 0, rShoulderAngle: 0, lElbowAngle: 0, rElbowAngle: 0, lHipAngle: 90, rHipAngle: 90, lKneeAngle: 90, rKneeAngle: 90 },
    end: { torsoAngle: 85, lShoulderAngle: 350, rShoulderAngle: 0, lElbowAngle: 350, rElbowAngle: 0, lHipAngle: 90, rHipAngle: 120, lKneeAngle: 90, rKneeAngle: 150 },
    muscles: ["abs"],
    equipment: "band-hands",
  },
  "plancha-banda": {
    start: { torsoAngle: 80, lShoulderAngle: 180, rShoulderAngle: 180, lElbowAngle: 180, rElbowAngle: 180, lHipAngle: 80, rHipAngle: 80, lKneeAngle: 180, rKneeAngle: 180 },
    end: { torsoAngle: 80, lShoulderAngle: 230, rShoulderAngle: 130, lElbowAngle: 180, rElbowAngle: 180, lHipAngle: 80, rHipAngle: 80, lKneeAngle: 180, rKneeAngle: 180 },
    muscles: ["abs"],
    equipment: "band-arms",
  },
};

// ============================================================
// MAIN EXPORT: Generate SVG illustration for an exercise
// ============================================================

export function getSvg(exerciseId, accentColor = "#E74C3C") {
  const poseData = poses[exerciseId];

  if (!poseData) {
    return getFallbackSvg(accentColor);
  }

  // Start figure: lighter/transparent anatomical silhouette
  const startFig = drawFigure(poseData.start, 110, 160, {
    color: "#B8A898",
    accentColor: accentColor + "30",
    muscles: poseData.muscles || [],
    scale: 0.82,
  });

  // End figure: solid anatomical silhouette with bright muscle highlights
  const endFig = drawFigure(poseData.end, 300, 160, {
    color: "#9C8878",
    accentColor,
    muscles: poseData.muscles || [],
    scale: 0.82,
  });

  // Equipment drawing on end figure
  let equipSvg = "";
  const eq = poseData.equipment || "none";
  if (eq.includes("dumbbell")) {
    if (eq === "dumbbells-sides" || eq === "dumbbells-front" || eq === "dumbbells-hands") {
      equipSvg += drawDumbbell(endFig.points.lHand.x, endFig.points.lHand.y, 0, 0.7);
      equipSvg += drawDumbbell(endFig.points.rHand.x, endFig.points.rHand.y, 0, 0.7);
      equipSvg += drawDumbbell(startFig.points.lHand.x, startFig.points.lHand.y, 0, 0.7);
      equipSvg += drawDumbbell(startFig.points.rHand.x, startFig.points.rHand.y, 0, 0.7);
    } else if (eq === "dumbbell-single" || eq === "dumbbell-single-r") {
      const hand = eq === "dumbbell-single-r" ? "rHand" : "lHand";
      equipSvg += drawDumbbell(endFig.points[hand].x, endFig.points[hand].y, 0, 0.7);
      equipSvg += drawDumbbell(startFig.points[hand].x, startFig.points[hand].y, 0, 0.7);
    } else if (eq === "dumbbell-chest" || eq === "dumbbell-overhead" || eq === "dumbbell-center") {
      const hx = (endFig.points.lHand.x + endFig.points.rHand.x) / 2;
      const hy = (endFig.points.lHand.y + endFig.points.rHand.y) / 2;
      equipSvg += drawDumbbell(hx, hy, 90, 0.8);
      const shx = (startFig.points.lHand.x + startFig.points.rHand.x) / 2;
      const shy = (startFig.points.lHand.y + startFig.points.rHand.y) / 2;
      equipSvg += drawDumbbell(shx, shy, 90, 0.8);
    }
  } else if (eq.includes("band") || eq.includes("cable")) {
    // Draw cable/band lines
    if (eq === "cable-low" || eq === "band-feet") {
      equipSvg += drawCable(startFig.points.lHand.x, startFig.points.lHand.y, startFig.points.lFoot.x, startFig.points.lFoot.y + 10);
      equipSvg += drawCable(endFig.points.lHand.x, endFig.points.lHand.y, endFig.points.lFoot.x, endFig.points.lFoot.y + 10);
    } else if (eq === "cable-high" || eq === "band-high") {
      equipSvg += drawCable(startFig.points.lHand.x, startFig.points.lHand.y, startFig.points.lHand.x, 10);
      equipSvg += drawCable(endFig.points.lHand.x, endFig.points.lHand.y, endFig.points.lHand.x, 10);
    } else if (eq === "cable-mid" || eq === "band-side") {
      equipSvg += drawCable(startFig.points.lHand.x, startFig.points.lHand.y, 10, startFig.points.lHand.y);
      equipSvg += drawCable(endFig.points.lHand.x, endFig.points.lHand.y, 10 + 190, endFig.points.lHand.y);
    } else if (eq === "cable-both") {
      equipSvg += drawCable(startFig.points.lHand.x, startFig.points.lHand.y, 10, 20);
      equipSvg += drawCable(startFig.points.rHand.x, startFig.points.rHand.y, 210, 20);
      equipSvg += drawCable(endFig.points.lHand.x, endFig.points.lHand.y, 200, 20);
      equipSvg += drawCable(endFig.points.rHand.x, endFig.points.rHand.y, 400, 20);
    } else if (eq === "band-knees") {
      equipSvg += drawBand(startFig.points.lKnee.x, startFig.points.lKnee.y, startFig.points.rKnee.x, startFig.points.rKnee.y, "#F39C12");
      equipSvg += drawBand(endFig.points.lKnee.x, endFig.points.lKnee.y, endFig.points.rKnee.x, endFig.points.rKnee.y, "#F39C12");
    } else if (eq === "band-ankles") {
      equipSvg += drawBand(startFig.points.lFoot.x, startFig.points.lFoot.y, startFig.points.rFoot.x, startFig.points.rFoot.y, "#F39C12");
      equipSvg += drawBand(endFig.points.lFoot.x, endFig.points.lFoot.y, endFig.points.rFoot.x, endFig.points.rFoot.y, "#F39C12");
    } else if (eq === "cable-ankle") {
      equipSvg += drawCable(startFig.points.rFoot.x, startFig.points.rFoot.y, 10, startFig.points.rFoot.y + 10);
      equipSvg += drawCable(endFig.points.rFoot.x, endFig.points.rFoot.y, 200, endFig.points.rFoot.y + 10);
    } else if (eq === "cable-single") {
      equipSvg += drawCable(startFig.points.lHand.x, startFig.points.lHand.y, 10, 20);
      equipSvg += drawCable(endFig.points.lHand.x, endFig.points.lHand.y, 200, 20);
    } else if (eq === "band-back") {
      equipSvg += drawBand(startFig.points.lHand.x, startFig.points.lHand.y, startFig.points.rHand.x, startFig.points.rHand.y, "#F39C12");
      equipSvg += drawBand(endFig.points.lHand.x, endFig.points.lHand.y, endFig.points.rHand.x, endFig.points.rHand.y, "#F39C12");
    } else if (eq === "band-front") {
      equipSvg += drawBand(startFig.points.lHand.x, startFig.points.lHand.y, startFig.points.rHand.x, startFig.points.rHand.y, "#F39C12");
      equipSvg += drawBand(endFig.points.lHand.x, endFig.points.lHand.y, endFig.points.rHand.x, endFig.points.rHand.y, "#F39C12");
    } else if (eq === "band-hands" || eq === "band-arms") {
      equipSvg += drawBand(startFig.points.lHand.x, startFig.points.lHand.y, startFig.points.rHand.x, startFig.points.rHand.y, "#F39C12");
      equipSvg += drawBand(endFig.points.lHand.x, endFig.points.lHand.y, endFig.points.rHand.x, endFig.points.rHand.y, "#F39C12");
    }
  }

  // Extra drawing (bench, etc.)
  let extraSvg = "";
  if (poseData.extraDraw) {
    extraSvg += poseData.extraDraw(startFig, false) || "";
    extraSvg += poseData.extraDraw(endFig, true) || "";
  }

  // Movement arrow
  const arrowSvg = drawArrow(170, 140, 230, 140, accentColor + "88");

  return `<svg viewBox="0 0 400 280" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Exercise illustration">
    <defs>
      <style>text { user-select: none; }</style>
      <linearGradient id="bgGrad-${exerciseId}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#F0EBE3"/>
        <stop offset="100%" stop-color="#E4DDD4"/>
      </linearGradient>
    </defs>
    <rect width="400" height="260" rx="10" fill="url(#bgGrad-${exerciseId})"/>
    <line x1="200" y1="15" x2="200" y2="245" stroke="#D5CEC5" stroke-width="1" stroke-dasharray="4,4"/>
    ${extraSvg}
    ${equipSvg}
    ${startFig.svg}
    ${endFig.svg}
    ${arrowSvg}
    <rect x="60" y="262" width="100" height="18" rx="4" fill="#333340"/>
    ${label(110, 274, "START", "#999", 10)}
    <rect x="240" y="262" width="120" height="18" rx="4" fill="${accentColor}33"/>
    ${label(300, 274, "END", accentColor, 10)}
  </svg>`;
}

function getFallbackSvg(accentColor) {
  const fig = drawFigure(
    { torsoAngle: 0, lShoulderAngle: 230, rShoulderAngle: 130, lElbowAngle: 240, rElbowAngle: 120, lHipAngle: 180, rHipAngle: 180, lKneeAngle: 180, rKneeAngle: 180 },
    200, 160,
    { color: "#9C8878", accentColor, muscles: [], scale: 1 }
  );
  return `<svg viewBox="0 0 400 280" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Exercise illustration">
    <rect width="400" height="260" rx="10" fill="#F0EBE3"/>
    ${fig.svg}
    ${label(200, 274, "Exercise", "#888", 11)}
  </svg>`;
}
