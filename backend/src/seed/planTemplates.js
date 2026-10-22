export const BMI_CATEGORIES = ['underweight', 'normal', 'overweight', 'obese'];
export const EXPERIENCE_LEVELS = ['beginner', 'intermediate', 'advanced'];
export const AGE_BANDS = ['adult', 'midlife', 'senior'];

export const LEVEL_RANK = {
  beginner: 1,
  intermediate: 2,
  advanced: 3,
};

export const COMPOUND_SLOTS = new Set([
  'squat',
  'hinge',
  'lunge',
  'push_h',
  'push_v',
  'pull_h',
  'pull_v',
]);

export const ISOLATION_SLOTS = new Set(['shoulder', 'biceps', 'triceps', 'calves', 'core']);

export const DAY_TEMPLATES = {
  'Full Body A': {
    title: 'Full Body A',
    focus: 'Squat, horizontal push & pull, hinge, core',
    slots: ['squat', 'push_h', 'pull_h', 'hinge', 'core', 'finisher'],
  },
  'Full Body B': {
    title: 'Full Body B',
    focus: 'Lunge, vertical push & pull, calves, core',
    slots: ['lunge', 'push_v', 'pull_v', 'calves', 'core', 'finisher'],
  },
  "Full Body A'": {
    title: "Full Body A'",
    focus: 'Squat, horizontal push & pull, hinge, core',
    slots: ['squat', 'push_h', 'pull_h', 'hinge', 'core', 'finisher'],
  },
  'Upper A': {
    title: 'Upper A',
    focus: 'Chest, back, shoulders, arms',
    slots: ['push_h', 'pull_h', 'push_v', 'pull_v', 'biceps', 'triceps', 'finisher'],
  },
  'Lower A': {
    title: 'Lower A',
    focus: 'Quads, hamstrings, glutes, calves, core',
    slots: ['squat', 'hinge', 'lunge', 'calves', 'core', 'core', 'finisher'],
  },
  'Upper B': {
    title: 'Upper B',
    focus: 'Upper body strength & shoulder isolation',
    slots: ['push_h', 'pull_v', 'push_v', 'pull_h', 'shoulder', 'triceps', 'finisher'],
  },
  'Lower B': {
    title: 'Lower B',
    focus: 'Posterior chain, legs, calves, core',
    slots: ['hinge', 'squat', 'lunge', 'calves', 'core', 'core', 'finisher'],
  },
  Push: {
    title: 'Push',
    focus: 'Chest, shoulders, triceps',
    slots: ['push_h', 'push_h', 'push_v', 'shoulder', 'triceps', 'triceps', 'finisher'],
  },
  Pull: {
    title: 'Pull',
    focus: 'Back, biceps, core',
    slots: ['pull_v', 'pull_h', 'pull_h', 'biceps', 'biceps', 'core', 'finisher'],
  },
  Legs: {
    title: 'Legs',
    focus: 'Quads, hamstrings, glutes, calves, core',
    slots: ['squat', 'hinge', 'lunge', 'squat', 'calves', 'core', 'finisher'],
  },
  Upper: {
    title: 'Upper',
    focus: 'Full upper body compound & isolation',
    slots: ['push_h', 'pull_h', 'push_v', 'pull_v', 'shoulder', 'biceps', 'triceps', 'finisher'],
  },
  Lower: {
    title: 'Lower',
    focus: 'Full lower body & core stability',
    slots: ['hinge', 'squat', 'lunge', 'calves', 'core', 'core', 'finisher'],
  },
};

export const SPLITS_BY_DAYS = {
  3: ['Full Body A', 'Full Body B', "Full Body A'"],
  4: ['Upper A', 'Lower A', 'Upper B', 'Lower B'],
  5: ['Push', 'Pull', 'Legs', 'Upper', 'Lower'],
};

export const SPLIT_LABELS = {
  3: 'Full Body 3×/week',
  4: 'Upper/Lower 4×/week',
  5: 'Push/Pull/Legs/Upper/Lower 5×/week',
};

export const BMI_LABELS = {
  underweight: 'Underweight',
  normal: 'Normal',
  overweight: 'Overweight',
  obese: 'Obese',
};

export const LEVEL_LABELS = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};

export const AGE_LABELS = {
  adult: 'Ages 18–39',
  midlife: 'Ages 40–54',
  senior: 'Ages 55–80',
};

export const LEVEL_SETS = {
  beginner: { compound: 3, isolation: 2 },
  intermediate: { compound: 4, isolation: 3 },
  advanced: { compound: 4, isolation: 3 },
};

export const BMI_PRESCRIPTION = {
  underweight: {
    goal: 'Build strength & muscle',
    compound: { repsMin: 6, repsMax: 10, restSec: 120 },
    isolation: { repsMin: 8, repsMax: 12, restSec: 90 },
  },
  normal: {
    goal: 'Balanced strength & fitness',
    compound: { repsMin: 8, repsMax: 12, restSec: 90 },
    isolation: { repsMin: 10, repsMax: 15, restSec: 60 },
  },
  overweight: {
    goal: 'Strength + general fitness',
    compound: { repsMin: 10, repsMax: 15, restSec: 60 },
    isolation: { repsMin: 12, repsMax: 15, restSec: 45 },
  },
  obese: {
    goal: 'Safe, low-impact start',
    compound: { repsMin: 10, repsMax: 15, restSec: 75 },
    isolation: { repsMin: 12, repsMax: 15, restSec: 60 },
  },
};

export const TIMED_HOLD_DURATION = {
  beginner: 30,
  intermediate: 45,
  advanced: 60,
};

export const AGE_REST_MODIFIER = {
  adult: 0,
  midlife: 15,
  senior: 30,
};

export const GUIDELINE_STRINGS = {
  common: [
    'Equipment: a pair of dumbbells (adjustable is best), resistance bands, a mat and a sturdy chair or bench. A doorway pull-up bar is optional and only used in advanced plans.',
    'Warm up for 5–8 minutes before every session: easy walking or marching, arm circles, bodyweight squats.',
    'Progress gradually: when you reach the top of the rep range on every set with good form, add a little weight (or use a stronger band) next session.',
    'Stop if you feel sharp pain, dizziness or unusual shortness of breath.',
  ],
  byLevel: {
    beginner:
      'Focus on form first. For the first 2 weeks pick a weight that leaves 2–3 reps in reserve.',
    intermediate: 'Finish each set with about 1–2 reps in reserve.',
    advanced: 'Take a lighter week (about half the sets) every 6–8 weeks to recover.',
  },
  byBmi: {
    underweight:
      'Your goal is to build strength and muscle. Take the full rest between sets, eat enough and sleep 7–9 hours so you recover.',
    normal:
      'Your goal is balanced strength and fitness: strength work first, with a cardio finisher on your last training day.',
    overweight:
      'Your goal is strength plus general fitness. Shorter rests keep your heart rate up, and walking on rest days counts too.',
    obese:
      'Your goal is a safe, low-impact start. There is no jumping or running. Take longer rests whenever you need them and build up gradually.',
  },
  byAgeBand: {
    adult: null,
    midlife:
      'You get an extra 15 seconds of rest between sets. Spend 8–10 minutes on your warm-up to look after your joints.',
    senior:
      'You get an extra 30 seconds of rest between sets. Move slowly and under control, and keep a chair or wall within reach for balance. Check with your doctor before starting a new exercise program.',
  },
  bySchedule: {
    3: 'Suggested days: Monday, Wednesday, Friday.',
    4: 'Suggested days: Monday, Tuesday, Thursday, Friday.',
    5: 'Suggested days: Monday to Wednesday, then Friday and Saturday.',
  },
};
