import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { describe, it, expect, beforeAll } from 'vitest';
import { buildAllPlans, buildSinglePlan } from '../src/seed/planBuilder.js';
import {
  LEVEL_RANK,
  COMPOUND_SLOTS,
  DAY_TEMPLATES,
  BMI_PRESCRIPTION,
  AGE_REST_MODIFIER,
} from '../src/seed/planTemplates.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SELECTED_DATA_PATH = path.join(__dirname, '..', 'src', 'seed', 'data', 'exercises.selected.json');

describe('WorkoutPlan Builder (36 plans)', () => {
  let exercises;
  let exerciseMap;
  let plans;

  beforeAll(async () => {
    const raw = await fs.readFile(SELECTED_DATA_PATH, 'utf-8');
    exercises = JSON.parse(raw);
    exerciseMap = new Map(exercises.map((e) => [e.externalId, e]));
    plans = buildAllPlans(exercises);
  });

  it('builds all 36 deterministic plans without errors', () => {
    expect(plans.length).toBe(36);
    const slugs = new Set(plans.map((p) => p.slug));
    expect(slugs.size).toBe(36);
  });

  it('enforces all WORKOUT_PLAN.md rules across all 36 plans', () => {
    for (const plan of plans) {
      const { bmiCategory, experienceLevel, ageBand, daysPerWeek, days } = plan;

      // Days per week check (§6.1)
      if (experienceLevel === 'beginner') {
        expect(daysPerWeek).toBe(3);
      } else if (experienceLevel === 'intermediate') {
        expect(daysPerWeek).toBe(ageBand === 'senior' ? 3 : 4);
      } else {
        expect(daysPerWeek).toBe(ageBand === 'adult' && bmiCategory !== 'obese' ? 5 : 4);
      }
      expect(days.length).toBe(daysPerWeek);

      const maxAllowedRank =
        ageBand === 'senior' && experienceLevel === 'advanced'
          ? LEVEL_RANK.intermediate
          : LEVEL_RANK[experienceLevel];

      const lowImpactRequired =
        bmiCategory === 'overweight' || bmiCategory === 'obese' || ageBand !== 'adult';

      days.forEach((day, dayIdx) => {
        const expectedSlots = DAY_TEMPLATES[day.title].slots;
        expect(day.exercises.length).toBe(expectedSlots.length);

        // No duplicate exercises in a single day
        const idsToday = day.exercises.map((e) => e.externalId);
        expect(new Set(idsToday).size).toBe(idsToday.length);

        day.exercises.forEach((item, exIdx) => {
          const exDef = exerciseMap.get(item.externalId);
          expect(exDef).toBeDefined();

          // Level cap
          expect(LEVEL_RANK[exDef.level]).toBeLessThanOrEqual(maxAllowedRank);

          // Low impact rule
          if (lowImpactRequired) {
            expect(exDef.lowImpact).toBe(true);
          }

          // Obese cap: max 3 sets
          if (bmiCategory === 'obese') {
            expect(item.sets).toBeLessThanOrEqual(3);
          }

          const isFinisher = exIdx === day.exercises.length - 1;
          if (isFinisher) {
            if (bmiCategory === 'underweight') {
              expect(item.slot).toBe('stretch');
            } else if (bmiCategory === 'normal') {
              expect(item.slot).toBe(dayIdx === daysPerWeek - 1 ? 'cardio' : 'stretch');
            } else {
              expect(item.slot).toBe('cardio');
            }
          }

          // Senior caps
          if (ageBand === 'senior') {
            if (item.slot === 'cardio') {
              expect(item.durationSec).toBeLessThanOrEqual(600);
            } else if (item.slot === 'stretch') {
              expect(item.durationSec).toBe(30);
            } else if (exDef.trackingType === 'time') {
              expect(item.sets).toBeLessThanOrEqual(2);
              expect(item.durationSec).toBeLessThanOrEqual(45);
            } else {
              const isComp = COMPOUND_SLOTS.has(item.slot);
              expect(item.sets).toBeLessThanOrEqual(isComp ? 3 : 2);
              expect(item.repsMin).toBeGreaterThanOrEqual(8);
              expect(item.repsMax).toBeGreaterThanOrEqual(12);
            }
          }

          // Rest calculation check
          if (item.slot === 'stretch') {
            expect(item.restSec).toBe(15);
          } else if (item.slot === 'cardio') {
            expect(item.restSec).toBe(0);
          } else if (exDef.trackingType === 'time') {
            expect(item.restSec).toBe(45 + AGE_REST_MODIFIER[ageBand]);
          } else {
            const isComp = COMPOUND_SLOTS.has(item.slot);
            const baseRest = isComp
              ? BMI_PRESCRIPTION[bmiCategory].compound.restSec
              : BMI_PRESCRIPTION[bmiCategory].isolation.restSec;
            expect(item.restSec).toBe(baseRest + AGE_REST_MODIFIER[ageBand]);
          }
        });
      });
    }
  });

  it('matches Sample A: normal-beginner-adult all 3 days', () => {
    const plan = plans.find((p) => p.slug === 'normal-beginner-adult');
    expect(plan).toBeDefined();
    expect(plan.daysPerWeek).toBe(3);

    const day1 = plan.days[0].exercises.map((e) => ({
      name: e.exerciseName,
      slot: e.slot,
      sets: e.sets,
      repsMin: e.repsMin,
      repsMax: e.repsMax,
      durationSec: e.durationSec,
      restSec: e.restSec,
    }));
    expect(day1).toEqual([
      { name: 'Bodyweight Squat', slot: 'squat', sets: 3, repsMin: 8, repsMax: 12, durationSec: null, restSec: 90 },
      { name: 'Incline Push-Up', slot: 'push_h', sets: 3, repsMin: 8, repsMax: 12, durationSec: null, restSec: 90 },
      { name: 'One-Arm Dumbbell Row', slot: 'pull_h', sets: 3, repsMin: 8, repsMax: 12, durationSec: null, restSec: 90 },
      { name: 'Stiff-Legged Dumbbell Deadlift', slot: 'hinge', sets: 3, repsMin: 8, repsMax: 12, durationSec: null, restSec: 90 },
      { name: 'Plank', slot: 'core', sets: 2, repsMin: null, repsMax: null, durationSec: 30, restSec: 45 },
      { name: "Child's Pose", slot: 'stretch', sets: 2, repsMin: null, repsMax: null, durationSec: 30, restSec: 15 },
    ]);

    const day2 = plan.days[1].exercises.map((e) => ({
      name: e.exerciseName,
      slot: e.slot,
      sets: e.sets,
      repsMin: e.repsMin,
      repsMax: e.repsMax,
      durationSec: e.durationSec,
      restSec: e.restSec,
    }));
    expect(day2).toEqual([
      { name: 'Split Squat with Dumbbells', slot: 'lunge', sets: 3, repsMin: 8, repsMax: 12, durationSec: null, restSec: 90 },
      { name: 'Standing Dumbbell Press', slot: 'push_v', sets: 3, repsMin: 8, repsMax: 12, durationSec: null, restSec: 90 },
      { name: 'Dumbbell Incline Row', slot: 'pull_v', sets: 3, repsMin: 8, repsMax: 12, durationSec: null, restSec: 90 },
      { name: 'Calf Raises - With Bands', slot: 'calves', sets: 2, repsMin: 10, repsMax: 15, durationSec: null, restSec: 60 },
      { name: 'Side Bridge', slot: 'core', sets: 2, repsMin: null, repsMax: null, durationSec: 30, restSec: 45 },
      { name: 'Hamstring Stretch', slot: 'stretch', sets: 2, repsMin: null, repsMax: null, durationSec: 30, restSec: 15 },
    ]);

    const day3 = plan.days[2].exercises.map((e) => ({
      name: e.exerciseName,
      slot: e.slot,
      sets: e.sets,
      repsMin: e.repsMin,
      repsMax: e.repsMax,
      durationSec: e.durationSec,
      restSec: e.restSec,
    }));
    expect(day3).toEqual([
      { name: 'Goblet Squat', slot: 'squat', sets: 3, repsMin: 8, repsMax: 12, durationSec: null, restSec: 90 },
      { name: 'Dumbbell Bench Press', slot: 'push_h', sets: 3, repsMin: 8, repsMax: 12, durationSec: null, restSec: 90 },
      { name: 'Bent Over Two-Dumbbell Row', slot: 'pull_h', sets: 3, repsMin: 8, repsMax: 12, durationSec: null, restSec: 90 },
      { name: 'Band Good Morning', slot: 'hinge', sets: 3, repsMin: 8, repsMax: 12, durationSec: null, restSec: 90 },
      { name: 'Dead Bug', slot: 'core', sets: 2, repsMin: 10, repsMax: 15, durationSec: null, restSec: 60 },
      { name: 'Trail Running/Walking', slot: 'cardio', sets: 1, repsMin: null, repsMax: null, durationSec: 600, restSec: 0 },
    ]);
  });

  it('matches Sample B: obese-advanced-senior days 1 and 2', () => {
    const plan = plans.find((p) => p.slug === 'obese-advanced-senior');
    expect(plan).toBeDefined();
    expect(plan.daysPerWeek).toBe(4);

    const day1 = plan.days[0].exercises.map((e) => ({
      name: e.exerciseName,
      slot: e.slot,
      sets: e.sets,
      repsMin: e.repsMin,
      repsMax: e.repsMax,
      durationSec: e.durationSec,
      restSec: e.restSec,
    }));
    expect(day1).toEqual([
      { name: 'Pushups', slot: 'push_h', sets: 3, repsMin: 10, repsMax: 15, durationSec: null, restSec: 105 },
      { name: 'Two-Arm Kettlebell Row', slot: 'pull_h', sets: 3, repsMin: 10, repsMax: 15, durationSec: null, restSec: 105 },
      { name: 'Dumbbell Shoulder Press', slot: 'push_v', sets: 3, repsMin: 10, repsMax: 15, durationSec: null, restSec: 105 },
      { name: 'Straight-Arm Dumbbell Pullover', slot: 'pull_v', sets: 3, repsMin: 10, repsMax: 15, durationSec: null, restSec: 105 },
      { name: 'Zottman Curl', slot: 'biceps', sets: 2, repsMin: 12, repsMax: 15, durationSec: null, restSec: 90 },
      { name: 'Standing Dumbbell Triceps Extension', slot: 'triceps', sets: 2, repsMin: 12, repsMax: 15, durationSec: null, restSec: 90 },
      { name: 'Trail Running/Walking', slot: 'cardio', sets: 1, repsMin: null, repsMax: null, durationSec: 600, restSec: 0 },
    ]);

    const day2 = plan.days[1].exercises.map((e) => ({
      name: e.exerciseName,
      slot: e.slot,
      sets: e.sets,
      repsMin: e.repsMin,
      repsMax: e.repsMax,
      durationSec: e.durationSec,
      restSec: e.restSec,
    }));
    expect(day2).toEqual([
      { name: 'Bodyweight Squat', slot: 'squat', sets: 3, repsMin: 10, repsMax: 15, durationSec: null, restSec: 105 },
      { name: 'Kettlebell One-Legged Deadlift', slot: 'hinge', sets: 3, repsMin: 10, repsMax: 15, durationSec: null, restSec: 105 },
      { name: 'Dumbbell Step Ups', slot: 'lunge', sets: 3, repsMin: 10, repsMax: 15, durationSec: null, restSec: 105 },
      { name: 'Standing Dumbbell Calf Raise', slot: 'calves', sets: 2, repsMin: 12, repsMax: 15, durationSec: null, restSec: 90 },
      { name: 'Russian Twist', slot: 'core', sets: 2, repsMin: 12, repsMax: 15, durationSec: null, restSec: 90 },
      { name: 'Plank', slot: 'core', sets: 2, repsMin: null, repsMax: null, durationSec: 45, restSec: 75 },
      { name: 'Bicycling', slot: 'cardio', sets: 1, repsMin: null, repsMax: null, durationSec: 600, restSec: 0 },
    ]);
  });

  it('throws a readable error when a slot has no candidate', () => {
    const withoutSquats = exercises.filter((e) => !e.slots.includes('squat'));
    expect(() => buildSinglePlan('normal', 'beginner', 'adult', withoutSquats)).toThrow(
      /no candidate for normal-beginner-adult slot squat/,
    );
  });
});
