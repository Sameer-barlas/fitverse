import {
  BMI_CATEGORIES,
  EXPERIENCE_LEVELS,
  AGE_BANDS,
  LEVEL_RANK,
  COMPOUND_SLOTS,
  DAY_TEMPLATES,
  SPLITS_BY_DAYS,
  SPLIT_LABELS,
  BMI_LABELS,
  LEVEL_LABELS,
  AGE_LABELS,
  LEVEL_SETS,
  BMI_PRESCRIPTION,
  TIMED_HOLD_DURATION,
  AGE_REST_MODIFIER,
  GUIDELINE_STRINGS,
} from './planTemplates.js';

export function getDaysPerWeek(experienceLevel, bmiCategory, ageBand) {
  if (experienceLevel === 'beginner') {
    return 3;
  }
  if (experienceLevel === 'intermediate') {
    return ageBand === 'senior' ? 3 : 4;
  }
  if (ageBand === 'adult' && bmiCategory !== 'obese') {
    return 5;
  }
  return 4;
}

export function buildGuidelines(experienceLevel, bmiCategory, ageBand, daysPerWeek) {
  const list = [...GUIDELINE_STRINGS.common];
  list.push(GUIDELINE_STRINGS.byLevel[experienceLevel]);
  list.push(GUIDELINE_STRINGS.byBmi[bmiCategory]);
  if (GUIDELINE_STRINGS.byAgeBand[ageBand]) {
    list.push(GUIDELINE_STRINGS.byAgeBand[ageBand]);
  }
  list.push(GUIDELINE_STRINGS.bySchedule[daysPerWeek]);
  return list;
}

export function prescribeExercise(resolvedSlot, exercise, experienceLevel, bmiCategory, ageBand) {
  if (resolvedSlot === 'stretch') {
    return {
      sets: 2,
      repsMin: null,
      repsMax: null,
      durationSec: 30,
      restSec: 15,
    };
  }

  if (resolvedSlot === 'cardio') {
    const isHigherVolumeCardio =
      (bmiCategory === 'overweight' || bmiCategory === 'obese') &&
      (experienceLevel === 'intermediate' || experienceLevel === 'advanced');
    let durationSec = isHigherVolumeCardio ? 900 : 600;
    if (ageBand === 'senior') {
      durationSec = Math.min(durationSec, 600);
    }
    return {
      sets: 1,
      repsMin: null,
      repsMax: null,
      durationSec,
      restSec: 0,
    };
  }

  if (exercise.trackingType === 'time') {
    let sets = LEVEL_SETS[experienceLevel].isolation;
    if (bmiCategory === 'obese') {
      sets = Math.min(sets, 3);
    }
    if (ageBand === 'senior') {
      sets = Math.min(sets, 2);
    }

    let durationSec = TIMED_HOLD_DURATION[experienceLevel];
    if (ageBand === 'senior') {
      durationSec = Math.min(durationSec, 45);
    }

    const restSec = 45 + AGE_REST_MODIFIER[ageBand];
    return {
      sets,
      repsMin: null,
      repsMax: null,
      durationSec,
      restSec,
    };
  }

  const isCompound = COMPOUND_SLOTS.has(resolvedSlot);
  let sets = isCompound
    ? LEVEL_SETS[experienceLevel].compound
    : LEVEL_SETS[experienceLevel].isolation;

  const basePresc = isCompound
    ? BMI_PRESCRIPTION[bmiCategory].compound
    : BMI_PRESCRIPTION[bmiCategory].isolation;

  let { repsMin, repsMax, restSec } = basePresc;

  if (bmiCategory === 'obese') {
    sets = Math.min(sets, 3);
  }

  restSec += AGE_REST_MODIFIER[ageBand];

  if (ageBand === 'senior') {
    sets = Math.min(sets, isCompound ? 3 : 2);
    repsMin = Math.max(repsMin, 8);
    repsMax = Math.max(repsMax, 12);
  }

  return {
    sets,
    repsMin,
    repsMax,
    durationSec: null,
    restSec,
  };
}

export function buildSinglePlan(bmiCategory, experienceLevel, ageBand, exercises) {
  const slug = `${bmiCategory}-${experienceLevel}-${ageBand}`;
  const daysPerWeek = getDaysPerWeek(experienceLevel, bmiCategory, ageBand);
  const levelCap =
    ageBand === 'senior' && experienceLevel === 'advanced' ? 'intermediate' : experienceLevel;
  const lowOnly =
    bmiCategory === 'overweight' || bmiCategory === 'obese' || ageBand !== 'adult';

  const used = {};
  const splitDayNames = SPLITS_BY_DAYS[daysPerWeek];

  const days = splitDayNames.map((dayName, dayIndex) => {
    const template = DAY_TEMPLATES[dayName];
    const picked = new Set();

    const dayExercises = template.slots.map((rawSlot, idx) => {
      let resolvedSlot = rawSlot;
      if (rawSlot === 'finisher') {
        if (bmiCategory === 'underweight') {
          resolvedSlot = 'stretch';
        } else if (bmiCategory === 'normal') {
          resolvedSlot = dayIndex === daysPerWeek - 1 ? 'cardio' : 'stretch';
        } else {
          resolvedSlot = 'cardio';
        }
      }

      let pool = exercises.filter(
        (e) =>
          e.slots.includes(resolvedSlot) &&
          LEVEL_RANK[e.level] <= LEVEL_RANK[levelCap] &&
          (!lowOnly || e.lowImpact),
      );

      // Stable sort by level DESC
      pool = pool
        .map((item, index) => ({ item, index }))
        .sort((a, b) => {
          const rankDiff = LEVEL_RANK[b.item.level] - LEVEL_RANK[a.item.level];
          return rankDiff !== 0 ? rankDiff : a.index - b.index;
        })
        .map((entry) => entry.item);

      if (pool.length === 0) {
        throw new Error(`no candidate for ${slug} slot ${resolvedSlot}`);
      }

      const start = used[resolvedSlot] || 0;
      let pick = null;
      for (let offset = 0; offset < pool.length; offset++) {
        const candidate = pool[(start + offset) % pool.length];
        if (!picked.has(candidate.externalId)) {
          pick = candidate;
          break;
        }
      }

      if (!pick) {
        throw new Error(`all candidates already used today for ${slug} slot ${resolvedSlot}`);
      }

      used[resolvedSlot] = start + 1;
      picked.add(pick.externalId);

      const prescription = prescribeExercise(
        resolvedSlot,
        pick,
        experienceLevel,
        bmiCategory,
        ageBand,
      );

      return {
        order: idx + 1,
        externalId: pick.externalId,
        exerciseName: pick.name,
        slot: resolvedSlot,
        ...prescription,
      };
    });

    return {
      dayNumber: dayIndex + 1,
      title: template.title,
      focus: template.focus,
      exercises: dayExercises,
    };
  });

  const goal = BMI_PRESCRIPTION[bmiCategory].goal;
  const splitLabel = SPLIT_LABELS[daysPerWeek];
  const name = `${BMI_LABELS[bmiCategory]} · ${LEVEL_LABELS[experienceLevel]} · ${AGE_LABELS[ageBand]} — ${splitLabel}`;
  const description = `${goal} program using a ${splitLabel} home-equipment split tailored for ${BMI_LABELS[bmiCategory].toLowerCase()} BMI and ${AGE_LABELS[ageBand].toLowerCase()}.`;
  const guidelines = buildGuidelines(experienceLevel, bmiCategory, ageBand, daysPerWeek);

  return {
    slug,
    name,
    description,
    goal,
    bmiCategory,
    experienceLevel,
    ageBand,
    daysPerWeek,
    guidelines,
    days,
  };
}

export function buildAllPlans(exercises) {
  const plans = [];
  for (const bmiCategory of BMI_CATEGORIES) {
    for (const experienceLevel of EXPERIENCE_LEVELS) {
      for (const ageBand of AGE_BANDS) {
        plans.push(buildSinglePlan(bmiCategory, experienceLevel, ageBand, exercises));
      }
    }
  }
  return plans;
}
