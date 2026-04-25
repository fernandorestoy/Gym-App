/**
 * Exercise Database — Antigravity
 *
 * Structure: grouped object keyed by muscle group
 * Groups: chest | back | biceps | triceps | shoulders | abs | legs
 *
 * Per-exercise fields:
 *   id          {string}  Stable kebab-case ID, prefixed by group, zero-padded. e.g. "chest-001"
 *                         Unique across the entire library. Never reassigned once set.
 *   name        {string}  Display name in English. Title case.
 *   group       {string}  Must match the parent key exactly. e.g. "chest"
 *   description {string}  2–4 sentences. Action-focused how-to. No "you should" — direct imperative.
 *   videoId     {string}  YouTube video ID only (not full URL). e.g. "dQw4w9WgXcQ"
 *                         Thumbnail computed as: https://img.youtube.com/vi/${videoId}/hqdefault.jpg
 *                         Watch URL computed as: https://youtu.be/${videoId}
 *   svgKey      {string}  Key into svgIllustrations map. camelCase. e.g. "benchPress"
 */

export const muscleGroups = ['chest', 'back', 'biceps', 'triceps', 'shoulders', 'abs', 'legs'];

export const exercises = {

  chest: [
    {
      id: "chest-001",
      name: "Flat Barbell Bench Press",
      group: "chest",
      description: "Lie flat on a bench, grip the bar slightly wider than shoulder-width, and unrack it over your chest. Lower the bar with control to mid-chest, touching lightly, then press it back up to full lockout. Keep your shoulder blades pinched together and feet flat on the floor throughout.",
      videoId: "4Y2ZdHCOXok",
      svgKey: "benchPress",
    },
    {
      id: "chest-002",
      name: "Incline Barbell Bench Press",
      group: "chest",
      description: "Set a bench to 30–45 degrees, grip the bar slightly wider than shoulder-width, and lower it to your upper chest. Press back up powerfully while keeping your elbows at roughly 60–75 degrees from your torso. The incline angle shifts emphasis to the upper (clavicular) head of the pec.",
      videoId: "NsEbXsTwas8",
      svgKey: "inclineBenchPress",
    },
    {
      id: "chest-003",
      name: "Dumbbell Flat Fly",
      group: "chest",
      description: "Lie on a flat bench holding dumbbells above your chest with a slight bend in your elbows. Lower the weights in a wide arc until you feel a deep stretch across your chest, then squeeze them back together at the top. Maintain the same elbow angle throughout — this is not a pressing movement.",
      videoId: "eozdVDA78K0",
      svgKey: "dumbbellFly",
    },
  ],

  back: [
    {
      id: "back-001",
      name: "Barbell Bent-Over Row",
      group: "back",
      description: "Hinge at the hips until your torso is roughly parallel to the floor, keeping your lower back flat. Pull the bar into your lower abdomen by driving your elbows back and squeezing your shoulder blades together. Lower with control and avoid using momentum from your legs.",
      videoId: "FWJR5Ve8bnQ",
      svgKey: "bentOverRow",
    },
    {
      id: "back-002",
      name: "Pull-Up",
      group: "back",
      description: "Hang from a bar with an overhand grip slightly wider than shoulder-width. Pull yourself up until your chin clears the bar by driving your elbows down toward your hips. Lower slowly under control — the descent is where much of the back development happens.",
      videoId: "eGo4IYlbE5g",
      svgKey: "pullUp",
    },
    {
      id: "back-003",
      name: "Lat Pulldown",
      group: "back",
      description: "Sit at a cable machine with your thighs secured under the pad and grip the bar slightly wider than shoulder-width. Pull the bar down to your upper chest by driving your elbows toward your hips while leaning back slightly. Squeeze your lats at the bottom and return the bar slowly to full arm extension.",
      videoId: "CAwf7n6Luuc",
      svgKey: "latPulldown",
    },
  ],

  biceps: [
    {
      id: "biceps-001",
      name: "Barbell Curl",
      group: "biceps",
      description: "Stand holding a barbell with an underhand grip at shoulder width, arms fully extended. Curl the bar up toward your shoulders by contracting your biceps, keeping your elbows pinned to your sides. Lower the bar slowly back to full extension — do not swing your torso.",
      videoId: "LY1V6UbRHFM",
      svgKey: "barbellCurl",
    },
    {
      id: "biceps-002",
      name: "Dumbbell Hammer Curl",
      group: "biceps",
      description: "Hold dumbbells at your sides with a neutral (palms-facing-in) grip. Curl both dumbbells simultaneously up toward your shoulders without rotating your wrists. This neutral grip targets the brachialis and brachioradialis alongside the biceps for overall arm thickness.",
      videoId: "zC3nLlEvin4",
      svgKey: "hammerCurl",
    },
    {
      id: "biceps-003",
      name: "Incline Dumbbell Curl",
      group: "biceps",
      description: "Set a bench to 60–70 degrees, sit back against it, and let your arms hang straight down. Curl the dumbbells up while keeping your upper arms stationary and perpendicular to the floor throughout. The incline position pre-stretches the long head of the biceps for a greater range of motion.",
      videoId: "soxrZlIl35U",
      svgKey: "inclineDumbbellCurl",
    },
  ],

  triceps: [
    {
      id: "triceps-001",
      name: "Triceps Rope Pushdown",
      group: "triceps",
      description: "Stand at a cable machine with the rope attached to the high pulley. Keeping your upper arms pinned to your sides, push the rope down and apart until your arms are fully extended. Squeeze your triceps hard at the bottom before slowly returning to the start position.",
      videoId: "vB5OHsJ3EME",
      svgKey: "ropePushdown",
    },
    {
      id: "triceps-002",
      name: "Overhead Triceps Extension (Dumbbell)",
      group: "triceps",
      description: "Hold one dumbbell with both hands and raise it overhead to full extension. Lower the dumbbell behind your head by bending at the elbows, keeping your upper arms vertical and close to your ears. Press back up to full extension — this overhead position maximally stretches the long head of the triceps.",
      videoId: "YbX7Wd8jQ-Q",
      svgKey: "overheadExtension",
    },
    {
      id: "triceps-003",
      name: "Close-Grip Bench Press",
      group: "triceps",
      description: "Lie flat on a bench and grip the bar with your hands shoulder-width apart or slightly narrower. Lower the bar to your lower chest while keeping your elbows close to your torso at roughly 45 degrees. Press back up to lockout — the narrow grip shifts the load from the pecs to the triceps.",
      videoId: "cXbSJHtjrQQ",
      svgKey: "closeGripBenchPress",
    },
  ],

  shoulders: [
    {
      id: "shoulders-001",
      name: "Dumbbell Overhead Press",
      group: "shoulders",
      description: "Sit or stand holding dumbbells at shoulder height with palms facing forward. Press the dumbbells overhead to full arm extension, bringing them together slightly at the top. Lower with control back to shoulder height — avoid arching your lower back by bracing your core throughout.",
      videoId: "qEwKCR5JCog",
      svgKey: "dumbbellOverheadPress",
    },
    {
      id: "shoulders-002",
      name: "Dumbbell Lateral Raise",
      group: "shoulders",
      description: "Stand holding dumbbells at your sides with a slight bend in your elbows. Raise the dumbbells out to your sides until your arms are parallel to the floor, leading with your elbows. Lower slowly — resist gravity on the way down for greater medial deltoid development.",
      videoId: "3VcKaXpzqRo",
      svgKey: "lateralRaise",
    },
    {
      id: "shoulders-003",
      name: "Face Pull",
      group: "shoulders",
      description: "Attach a rope to a cable machine at face height. Pull the rope toward your face by driving your elbows back and outward, separating your hands as the rope reaches your forehead. This exercise directly targets the rear delts and external rotators — crucial for shoulder health and posture.",
      videoId: "rep-qVOkqgk",
      svgKey: "facePull",
    },
  ],

  abs: [
    {
      id: "abs-001",
      name: "Plank",
      group: "abs",
      description: "Start in a push-up position but rest on your forearms instead of your hands. Keep your body in a straight line from head to heels by squeezing your core, glutes, and quads simultaneously. Hold for the target duration — do not let your hips sag or pike upward.",
      videoId: "ASdvN_XEl_c",
      svgKey: "plank",
    },
    {
      id: "abs-002",
      name: "Cable Crunch",
      group: "abs",
      description: "Kneel at a cable machine with the rope attachment at the high pulley. Hold the rope beside your head and crunch your elbows toward your knees by flexing your spine — not by pulling with your arms. The movement is entirely spinal flexion; your hips stay stationary throughout.",
      videoId: "2fbujeH3F0E",
      svgKey: "cableCrunch",
    },
    {
      id: "abs-003",
      name: "Hanging Leg Raise",
      group: "abs",
      description: "Hang from a pull-up bar with your arms fully extended and your body still. Raise your legs by flexing your hips and rounding your lower back slightly at the top — this posterior pelvic tilt ensures the abs do the work, not just the hip flexors. Lower slowly without swinging.",
      videoId: "hdng3Nm1x_E",
      svgKey: "hangingLegRaise",
    },
  ],

  legs: [
    {
      id: "legs-001",
      name: "Barbell Back Squat",
      group: "legs",
      description: "Position the bar across your upper traps, step back, and set your feet shoulder-width apart with toes slightly out. Descend by pushing your knees out in line with your toes and sitting your hips back and down until your thighs are parallel to the floor or below. Drive through your entire foot to stand back up.",
      videoId: "ultWZbUMPL8",
      svgKey: "backSquat",
    },
    {
      id: "legs-002",
      name: "Romanian Deadlift",
      group: "legs",
      description: "Stand holding a barbell at hip height with an overhand grip. Hinge at your hips while keeping your back flat, pushing your hips backward as the bar travels down your thighs to mid-shin level. Drive your hips forward to return to standing — feel the stretch in your hamstrings at the bottom.",
      videoId: "JCXUYuzwNrM",
      svgKey: "romanianDeadlift",
    },
    {
      id: "legs-003",
      name: "Leg Press",
      group: "legs",
      description: "Sit in the leg press machine with your feet shoulder-width apart on the platform. Lower the platform toward your chest until your thighs reach 90 degrees, then press back up to near-full extension — stop just short of locking out your knees. Keep your lower back flat against the pad throughout.",
      videoId: "IZxyjW7MPJQ",
      svgKey: "legPress",
    },
  ],

};
