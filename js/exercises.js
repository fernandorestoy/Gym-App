/**
 * Exercise Database — Antigravity
 *
 * Structure: grouped object keyed by training split
 * Groups: push | pull | legs | upper
 *
 * Per-exercise fields:
 *   id          {string}  Stable kebab-case ID, prefixed by group, zero-padded. e.g. "push-001"
 *                         Unique across the entire library. Never reassigned once set.
 *   name        {string}  Display name in English. Title case.
 *   group       {string}  Must match the parent key exactly. e.g. "push"
 *   description {string}  2–4 sentences. Action-focused how-to. No "you should" — direct imperative.
 *   videoId     {string}  YouTube video ID only (not full URL). e.g. "dQw4w9WgXcQ"
 *                         Thumbnail computed as: https://img.youtube.com/vi/${videoId}/hqdefault.jpg
 *                         Watch URL computed as: https://youtu.be/${videoId}
 *   svgKey      {string}  Key into svgIllustrations map. Spanish kebab-case. e.g. "press-pecho-plano"
 */

export const muscleGroups = ['push', 'pull', 'legs', 'upper'];

export const exercises = {

  push: [
    // === ANCHORS — always shown in every Push session (index 0–2) ===
    {
      id: "push-001",
      name: "Standing Dumbbell Overhead Press",
      group: "push",
      description: "Stand with feet shoulder-width apart, hold dumbbells at shoulder height with palms facing forward. Press both dumbbells straight overhead to full lockout, then lower with control back to shoulder height. Keep your core braced and glutes squeezed throughout — avoid arching your lower back as the weight rises. Standing demands more stabilizer activation than the seated version.",
      videoId: "qEwKCR5JCog",
      svgKey: "press-militar-mancuernas",
    },
    {
      id: "push-002",
      name: "Incline Dumbbell Press",
      group: "push",
      description: "Set a bench to 30–45 degrees, hold dumbbells at shoulder height, and press them overhead to full extension. Lower with control until your elbows are slightly below bench level for a full chest stretch. The incline angle shifts emphasis to the upper chest and front deltoids. Keep your shoulder blades pinched together throughout.",
      videoId: "nwUjPJR5wxw",
      svgKey: "press-inclinado-mancuernas",
    },
    {
      id: "push-003",
      name: "Dips",
      group: "push",
      description: "Grip parallel bars, straighten your arms, and lower your body until your elbows reach 90 degrees or your chest gets a deep stretch. Lean slightly forward to emphasize the lower chest, or stay upright to target the triceps more. Press back up to full lockout without swinging. Add weight via a belt once bodyweight becomes easy for sets of 10.",
      videoId: "2z8JmcrW-As",
      svgKey: "fondos-paralelas",
    },
    // === RANDOM POOL — 3 picked per session from exercises below (index 3–11) ===
    {
      id: "push-004",
      name: "Flat Barbell Bench Press",
      group: "push",
      description: "Lie flat on a bench, grip the bar slightly wider than shoulder-width, and unrack it over your chest. Lower the bar with control to mid-chest, touching lightly, then press it back up to full lockout. Keep your shoulder blades pinched together and feet flat on the floor throughout. The premier compound movement for overall chest mass.",
      videoId: "hWbUlkb5Ms4",
      svgKey: "press-pecho-plano",
    },
    {
      id: "push-005",
      name: "Seated Dumbbell Shoulder Press",
      group: "push",
      description: "Sit on an upright bench, hold dumbbells at shoulder height with palms facing forward, and press them overhead to full extension. Lower with control until the dumbbells are at ear level. Drive both weights up simultaneously and avoid flaring the elbows forward excessively. The seated position supports the spine and allows heavier loading.",
      videoId: "HzIiNhHhhtA",
      svgKey: "press-hombros-mancuernas",
    },
    {
      id: "push-006",
      name: "Close-Grip Bench Press",
      group: "push",
      description: "Lie on a flat bench and grip the bar at shoulder-width or slightly narrower. Lower the bar to your lower chest, keeping your elbows tucked closer to your torso than in a standard bench press. Press explosively to full lockout. This places maximum tension on the triceps while still engaging the chest and front deltoids.",
      videoId: "vEUyEOVn3yM",
      svgKey: "press-pecho-agarre-cerrado",
    },
    {
      id: "push-007",
      name: "Push Press",
      group: "push",
      description: "Stand with the bar at your collarbone, dip your knees slightly, then use leg drive to initiate the press overhead. As your legs extend, drive the bar to full lockout. Lower the bar back to your shoulders under control. The leg drive lets you press significantly more weight than a strict overhead press — a true full-body compound movement.",
      videoId: "a8HQo8z20Uo",
      svgKey: "press-empuje",
    },
    {
      id: "push-008",
      name: "Decline Barbell Bench Press",
      group: "push",
      description: "Set the bench to a 15–30 degree decline and secure your legs. Grip the bar slightly wider than shoulder-width and lower it to your lower chest. Press back to full lockout. The decline angle increases lower pectoral fiber activation and reduces shoulder strain for many lifters.",
      videoId: "LfyQBUKR8SE",
      svgKey: "press-declinado-barra",
    },
    {
      id: "push-009",
      name: "Arnold Press",
      group: "push",
      description: "Sit holding dumbbells in front of your shoulders with palms facing you, as if finishing a curl. As you press the weights overhead, rotate your palms outward so they face forward at the top. Reverse the rotation as you lower. This rotating path recruits all three deltoid heads and produces exceptional shoulder development.",
      videoId: "6K_N9AGhItQ",
      svgKey: "press-arnold",
    },
    {
      id: "push-010",
      name: "Incline Barbell Bench Press",
      group: "push",
      description: "Set the bench to 30–45 degrees, grip the bar slightly wider than shoulder-width, and lower it to your upper chest just below your collarbone. Press back to full lockout. The incline targets the clavicular head of the pectorals and the front deltoids more heavily than the flat bench. Keep your shoulder blades retracted throughout.",
      videoId: "jPLdzuHckI8",
      svgKey: "press-inclinado-barra",
    },
    {
      id: "push-011",
      name: "Dumbbell Floor Press",
      group: "push",
      description: "Lie flat on the floor holding dumbbells at chest height. Press them up to full extension, then lower until your upper arms gently contact the floor. The floor removes leg drive and limits the range of motion, forcing the triceps and chest to do all the work. Excellent for building lockout strength and shoulder-joint safety.",
      videoId: "uUGDRwge4F8",
      svgKey: "press-pecho-suelo",
    },
    {
      id: "push-012",
      name: "Cable Crossover",
      group: "push",
      description: "Set both cable pulleys to mid-chest height, grip a handle in each hand, and stand in a slight split stance in the center. With a soft bend in your elbows, bring both handles together in front of your chest in a wide arc, squeezing your pecs hard at the peak. Return slowly, feeling a full stretch across the chest at the start position. The constant cable tension loads the chest through the entire range of motion.",
      videoId: "taI4XduLpTk",
      svgKey: "crossover-cables",
    },
  ],

  pull: [
    // === ANCHORS — always shown in every Pull session (index 0–1) ===
    {
      id: "pull-001",
      name: "Pull-Ups",
      group: "pull",
      description: "Hang from a bar with an overhand grip just wider than shoulder-width. Pull your chest toward the bar by driving your elbows down and back, squeezing your lats hard at the top. Lower yourself slowly to a full dead hang before the next rep. Add weight via a belt once bodyweight is manageable for sets of 8 or more.",
      videoId: "OEXosPwzFdc",
      svgKey: "dominadas",
    },
    {
      id: "pull-002",
      name: "Barbell Bent-Over Row",
      group: "pull",
      description: "Hinge at the hips until your torso is nearly parallel to the floor, grip the bar just outside your legs, and row it toward your lower chest or upper abdomen. Drive your elbows back and squeeze your shoulder blades together at the top. Lower the bar with control. This is the primary exercise for building mid-back thickness.",
      videoId: "UL8ZcK64KxA",
      svgKey: "remo-barra",
    },
    // === RANDOM POOL — 4 picked per session from exercises below (index 2–11) ===
    {
      id: "pull-003",
      name: "Lat Pulldown",
      group: "pull",
      description: "Grip the cable bar wider than shoulder-width, sit with your thighs secured under the pad, and pull the bar to your upper chest while leaning back slightly. Drive your elbows down toward your hips and squeeze your lats at the bottom. Return the bar with control to full arm extension. A controlled eccentric builds serious lat width.",
      videoId: "SALxEARiMkw",
      svgKey: "jalan-polea",
    },
    {
      id: "pull-004",
      name: "Seated Cable Row",
      group: "pull",
      description: "Sit at the cable row station with feet planted on the platform and pull the handle toward your lower abdomen. Keep your torso upright and avoid using momentum — the movement should be pure upper-back contraction. Hold briefly at full contraction, then extend your arms slowly for a full stretch. Pull with your elbows, not your hands.",
      videoId: "vwHG9Jfu4sw",
      svgKey: "remo-polea-sentado",
    },
    {
      id: "pull-005",
      name: "T-Bar Row",
      group: "pull",
      description: "Stand over the T-bar with feet shoulder-width apart, hinge forward to roughly 45 degrees, and pull the handle toward your lower chest. Keep your lower back neutral and drive your elbows back and wide for maximum lat stretch and contraction. Lower the weight with control. T-bar rows are especially effective for mid-back thickness and density.",
      videoId: "TyLoy3n_a10",
      svgKey: "remo-t",
    },
    {
      id: "pull-006",
      name: "Single-Arm Dumbbell Row",
      group: "pull",
      description: "Place one knee and one hand on a bench, hold a dumbbell in your free hand, and row it up toward your hip by driving your elbow back. Keep your back flat and avoid rotating your torso. Lower the dumbbell to a full stretch before the next rep. The unilateral nature allows heavier loading and corrects strength imbalances between sides.",
      videoId: "qN54-QNO1eQ",
      svgKey: "remo-mancuerna",
    },
    {
      id: "pull-007",
      name: "Pendlay Row",
      group: "pull",
      description: "Set up like a bent-over row but lower the bar completely to the floor between every rep. From a dead stop, explosively pull the bar to your lower chest, then lower it back to the floor with control. The dead stop eliminates momentum and forces each rep to begin with maximum force, building explosive back strength.",
      videoId: "Weu9HMHdiDA",
      svgKey: "remo-pendlay",
    },
    {
      id: "pull-008",
      name: "Incline Dumbbell Row",
      group: "pull",
      description: "Set an incline bench to 45 degrees and lie face-down with your chest against the pad, holding a dumbbell in each hand. With your chest fully supported, row both dumbbells up toward your hips by driving your elbows back, squeezing your shoulder blades together at the top. Lower with full control to a complete stretch. The chest support eliminates lower-back fatigue so you can focus entirely on upper-back contraction.",
      videoId: "r3XuBVmCXCg",
      svgKey: "remo-inclinado-bilateral",
    },
    {
      id: "pull-009",
      name: "Dumbbell Deadlift",
      group: "pull",
      description: "Stand with dumbbells hanging in front of your thighs, feet hip-width apart. Hinge at the hips and push your knees slightly out as you lower the dumbbells along your legs toward the floor, keeping your back flat and chest tall. Drive through your heels to return to standing and squeeze your glutes hard at lockout. Builds the same total-body posterior-chain strength as the barbell deadlift.",
      videoId: "YxHCB38WNZI",
      svgKey: "peso-muerto-mancuernas",
    },
    {
      id: "pull-010",
      name: "Chin-Ups",
      group: "pull",
      description: "Hang from the bar with an underhand grip (palms facing you) at shoulder-width. Pull yourself up until your chin clears the bar, actively curling your elbows toward your chest. The supinated grip increases biceps involvement compared to a pull-up. Lower under control to a full dead hang. Add weight via a belt when bodyweight becomes easy.",
      videoId: "e1YSApl-QcM",
      svgKey: "dominadas-supinas",
    },
    {
      id: "pull-011",
      name: "Rack Pull",
      group: "pull",
      description: "Set the safety bars of a power rack to knee height and deadlift from this elevated position. Grip the bar just outside your legs, brace hard, and stand up to full lockout. The shortened range of motion lets you overload the top portion of the deadlift pattern, building upper-back and trap strength with very heavy weights.",
      videoId: "e11lVmLsvFU",
      svgKey: "jalones-polea-alta",
    },
    {
      id: "pull-012",
      name: "Renegade Row",
      group: "pull",
      description: "Get into a push-up position holding two dumbbells, feet wide for stability. Row one dumbbell up to your hip while pressing the other into the floor, then alternate sides. Keep your hips level and core braced — avoid rotating as you row. This compound movement trains back strength and anti-rotation core stability simultaneously.",
      videoId: "2S0-TUnB56g",
      svgKey: "remo-renegado",
    },
  ],

  legs: [
    // === ANCHORS — always shown in every Legs session (index 0–2) ===
    {
      id: "legs-001",
      name: "Back Squat",
      group: "legs",
      description: "Position the barbell across your upper traps, step back, and stand with feet shoulder-width apart. Sit back and down until your thighs are parallel to the floor or below, keeping your chest up and knees tracking over your toes. Drive through your heels to stand. The back squat is the cornerstone of lower-body strength development.",
      videoId: "SW_C1A-rejs",
      svgKey: "sentadilla-trasera",
    },
    {
      id: "legs-002",
      name: "Bulgarian Split Squat",
      group: "legs",
      description: "Place your rear foot on a bench behind you and hold dumbbells or a barbell across your back. Lower your hips straight down until your front thigh is parallel to the floor, keeping your torso upright. Drive through your front heel to return to standing. This unilateral exercise exposes strength asymmetries and demands significant hip-flexor mobility.",
      videoId: "uODWo4YqbT8",
      svgKey: "sentadilla-bulgara",
    },
    {
      id: "legs-003",
      name: "Dumbbell Hip Thrust",
      group: "legs",
      description: "Sit against a bench with a dumbbell held vertically on your hips and feet flat on the floor at shoulder-width. Drive through your heels to thrust your hips up until your torso is parallel to the floor, squeezing your glutes hard at lockout. Lower your hips without letting them touch the floor, then repeat. The most direct and effective exercise for maximum glute development.",
      videoId: "mvBTGx5zu6I",
      svgKey: "empuje-cadera",
    },
    // === RANDOM POOL — 3 picked per session from exercises below (index 3–11) ===
    {
      id: "legs-004",
      name: "Romanian Deadlift",
      group: "legs",
      description: "Stand holding a barbell at hip height, push your hips back while lowering the bar along your legs, feeling a deep stretch in your hamstrings. Keep your back flat and a soft bend in your knees throughout. Drive your hips forward to return to standing. The RDL is the premier exercise for hamstring and glute hypertrophy.",
      videoId: "CBOhr6H7BEY",
      svgKey: "peso-muerto-rumano",
    },
    {
      id: "legs-005",
      name: "Leg Press",
      group: "legs",
      description: "Sit in the leg press machine with your feet shoulder-width apart on the platform. Lower the sled until your knees reach 90 degrees while keeping your lower back flat against the pad. Push through your heels to extend your legs, stopping just short of knee lockout. Higher foot placement targets glutes and hamstrings; lower placement emphasizes quads.",
      videoId: "EotSw18oR9w",
      svgKey: "prensa-piernas",
    },
    {
      id: "legs-006",
      name: "Walking Lunges",
      group: "legs",
      description: "Hold dumbbells at your sides or place a barbell across your back. Step forward into a lunge, lowering your rear knee toward the floor, then drive through your front heel and bring your rear foot forward to the next step. Keep your torso upright throughout. Walking lunges challenge balance, hip mobility, and unilateral leg strength simultaneously.",
      videoId: "Pbmj6xPo-Hw",
      svgKey: "zancadas-caminando",
    },
    {
      id: "legs-007",
      name: "Hack Squat",
      group: "legs",
      description: "Load the hack squat machine, position your shoulders under the pads and feet at shoulder-width on the platform, and release the safety handles. Lower your hips until your thighs reach parallel, then drive through your feet to push the platform back up. The guided path allows you to overload the quadriceps with reduced spinal stress.",
      videoId: "g9i05umL5vc",
      svgKey: "sentadilla-hack",
    },
    {
      id: "legs-008",
      name: "Goblet Squat",
      group: "legs",
      description: "Hold a dumbbell or kettlebell vertically against your chest with both hands, feet shoulder-width apart and toes turned out slightly. Sit back and down into a deep squat, keeping your elbows inside your knees and your torso upright. Drive through your heels to return to standing. Excellent for reinforcing squat mechanics and quad development.",
      videoId: "lRYBbchqxtI",
      svgKey: "sentadilla-goblet",
    },
    {
      id: "legs-009",
      name: "Step-Ups",
      group: "legs",
      description: "Hold dumbbells at your sides and place one foot on a sturdy box at knee height. Step up by driving through your front heel, fully extending your hip and knee at the top. Lower your trailing foot back to the floor under control. The height of the box increases range of motion — a higher box means greater glute and quad demand.",
      videoId: "wGoKb6mPJzU",
      svgKey: "subida-escalon",
    },
    {
      id: "legs-010",
      name: "Dumbbell Sumo Squat",
      group: "legs",
      description: "Stand with feet wider than shoulder-width, toes pointing out 45 degrees, and hold a single dumbbell vertically with both hands between your legs. Sit straight down into a deep squat, keeping your chest tall and knees tracking over your toes. Drive through your heels to return to standing. The wide stance targets the inner thighs, glutes, and quads in the same pattern as the sumo deadlift.",
      videoId: "Zx2dSGEiSOE",
      svgKey: "sentadilla-sumo",
    },
    {
      id: "legs-011",
      name: "Single-Leg Romanian Deadlift",
      group: "legs",
      description: "Stand on one leg holding a dumbbell in the opposite hand. Hinge at the hip, extending your free leg behind you as you lower the dumbbell toward the floor, keeping your back flat. Drive through your planted heel to return upright. Challenges single-leg hamstring strength, balance, and hip stability that bilateral exercises often hide.",
      videoId: "J1ojvq3ftqM",
      svgKey: "peso-muerto-rumano-unilateral",
    },
    {
      id: "legs-012",
      name: "Reverse Lunge",
      group: "legs",
      description: "Hold dumbbells at your sides or use a barbell, then step one foot back and lower your rear knee toward the floor. Your front shin should remain roughly vertical. Drive through your front heel to return to standing. The reverse lunge places less stress on the knee than a forward lunge and gives you greater control of the descent.",
      videoId: "QOVaHwm-Q6U",
      svgKey: "zancada-inversa",
    },
  ],

  upper: [
    {
      id: "upper-001",
      name: "Barbell Bench Press",
      group: "upper",
      description: "Lie flat on a bench, grip the bar slightly wider than shoulder-width, and unrack it over your chest. Lower the bar with control to mid-chest, then press it back to full lockout. Retract your shoulder blades and keep your feet flat throughout. The foundational compound movement for upper-body pressing strength.",
      videoId: "hWbUlkb5Ms4",
      svgKey: "press-pecho-plano",
    },
    {
      id: "upper-002",
      name: "Overhead Press",
      group: "upper",
      description: "Stand with feet shoulder-width apart, grip the bar just outside your shoulders, and press it from your upper chest to full lockout overhead. Keep your core braced and glutes squeezed throughout. Lower the bar back to your collarbone with control. The premier standing compound movement for shoulder strength and stability.",
      videoId: "2yjwXTZQDDI",
      svgKey: "press-militar",
    },
    {
      id: "upper-003",
      name: "Pull-Ups",
      group: "upper",
      description: "Hang from a bar with an overhand grip just wider than shoulder-width. Pull your chest toward the bar by driving your elbows down and back, squeezing your lats at the top. Lower slowly to a full dead hang before the next rep. The best bodyweight exercise for upper-back width and vertical pulling strength.",
      videoId: "OEXosPwzFdc",
      svgKey: "dominadas",
    },
    {
      id: "upper-004",
      name: "Barbell Row",
      group: "upper",
      description: "Hinge at the hips until your torso is nearly parallel to the floor, grip the bar just outside your legs, and row it toward your lower chest. Drive your elbows back and squeeze your shoulder blades at the top. Lower the bar with control. The primary horizontal pulling movement for building mid-back thickness.",
      videoId: "UL8ZcK64KxA",
      svgKey: "remo-barra",
    },
    {
      id: "upper-005",
      name: "Incline Dumbbell Press",
      group: "upper",
      description: "Set a bench to 30–45 degrees, hold dumbbells at shoulder height, and press them to full extension. Lower with control until your elbows are slightly below bench level. The incline targets the upper chest and front deltoids. Keep your shoulder blades pinched together throughout.",
      videoId: "nwUjPJR5wxw",
      svgKey: "press-inclinado-mancuernas",
    },
    {
      id: "upper-006",
      name: "Dips",
      group: "upper",
      description: "Grip parallel bars, straighten your arms, and lower your body until your elbows reach 90 degrees. Lean slightly forward to emphasize the chest; stay upright for more triceps focus. Press back to full lockout without swinging. A highly effective compound exercise for the entire pushing chain.",
      videoId: "2z8JmcrW-As",
      svgKey: "fondos-paralelas",
    },
    {
      id: "upper-007",
      name: "Seated Cable Row",
      group: "upper",
      description: "Sit at the cable row station with feet planted on the platform and pull the handle to your lower abdomen. Keep your torso upright and avoid using momentum — pure upper-back contraction drives the movement. Hold briefly at full contraction, then extend your arms slowly for a full stretch.",
      videoId: "vwHG9Jfu4sw",
      svgKey: "remo-polea-sentado",
    },
    {
      id: "upper-008",
      name: "Lat Pulldown",
      group: "upper",
      description: "Grip the cable bar wider than shoulder-width, sit with thighs secured under the pad, and pull the bar to your upper chest while leaning back slightly. Drive your elbows down toward your hips and squeeze your lats at the bottom. Return the bar with control to full arm extension.",
      videoId: "SALxEARiMkw",
      svgKey: "jalan-polea",
    },
    {
      id: "upper-009",
      name: "Dumbbell Shoulder Press",
      group: "upper",
      description: "Sit on an upright bench, hold dumbbells at shoulder height with palms facing forward, and press them overhead to full extension. Lower with control until the dumbbells are at ear level. Avoid flaring the elbows forward excessively. Builds balanced shoulder strength and size across all three deltoid heads.",
      videoId: "HzIiNhHhhtA",
      svgKey: "press-hombros-mancuernas",
    },
    {
      id: "upper-010",
      name: "Single-Arm Dumbbell Row",
      group: "upper",
      description: "Place one knee and hand on a bench, hold a dumbbell in your free hand, and row it toward your hip by driving your elbow back. Keep your back flat and avoid rotating your torso. Lower the dumbbell to a full stretch before the next rep. The unilateral nature corrects side-to-side strength imbalances effectively.",
      videoId: "qN54-QNO1eQ",
      svgKey: "remo-mancuerna",
    },
    {
      id: "upper-011",
      name: "Close-Grip Bench Press",
      group: "upper",
      description: "Lie on a flat bench and grip the bar at shoulder-width or slightly narrower. Lower the bar to your lower chest, keeping your elbows tucked closer to your torso than a standard bench press. Press explosively to full lockout. Places maximum tension on the triceps while still engaging the chest and front deltoids.",
      videoId: "vEUyEOVn3yM",
      svgKey: "press-pecho-agarre-cerrado",
    },
    {
      id: "upper-012",
      name: "T-Bar Row",
      group: "upper",
      description: "Stand over the T-bar with feet shoulder-width apart, hinge forward to roughly 45 degrees, and pull the handle toward your lower chest. Keep your lower back neutral and drive your elbows back and wide for maximum lat stretch and contraction. Lower with control. Highly effective for building mid-back thickness and density.",
      videoId: "TyLoy3n_a10",
      svgKey: "remo-t",
    },
  ],

};
