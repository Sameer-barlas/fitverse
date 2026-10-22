import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { Exercise } from '../models/Exercise.js';
import { WorkoutPlan } from '../models/WorkoutPlan.js';
import { buildAllPlans } from './planBuilder.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SELECTED_DATA_PATH = path.join(__dirname, 'data', 'exercises.selected.json');

export async function seedPlans() {
  const raw = await fs.readFile(SELECTED_DATA_PATH, 'utf-8');
  const selectedExercises = JSON.parse(raw);

  const dbExercises = await Exercise.find({});
  const idMap = new Map(dbExercises.map((e) => [e.externalId, e._id]));

  const builtPlans = buildAllPlans(selectedExercises);

  const ops = builtPlans.map((plan) => {
    const daysWithRefs = plan.days.map((day) => ({
      dayNumber: day.dayNumber,
      title: day.title,
      focus: day.focus,
      exercises: day.exercises.map((item) => {
        const exerciseObjectId = idMap.get(item.externalId);
        if (!exerciseObjectId) {
          throw new Error(`Exercise externalId "${item.externalId}" not found in DB. Seed exercises first.`);
        }
        return {
          order: item.order,
          exercise: exerciseObjectId,
          sets: item.sets,
          repsMin: item.repsMin,
          repsMax: item.repsMax,
          durationSec: item.durationSec,
          restSec: item.restSec,
        };
      }),
    }));

    const docData = {
      slug: plan.slug,
      name: plan.name,
      description: plan.description,
      goal: plan.goal,
      bmiCategory: plan.bmiCategory,
      experienceLevel: plan.experienceLevel,
      ageBand: plan.ageBand,
      daysPerWeek: plan.daysPerWeek,
      guidelines: plan.guidelines,
      days: daysWithRefs,
    };

    return {
      updateOne: {
        filter: { slug: plan.slug },
        update: { $set: docData },
        upsert: true,
      },
    };
  });

  await WorkoutPlan.bulkWrite(ops);
  const count = await WorkoutPlan.countDocuments();
  console.info(`Seeded workout plans: ${count} total in database.`);
  return count;
}
