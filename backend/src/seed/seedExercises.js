import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { Exercise } from '../models/Exercise.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SELECTED_DATA_PATH = path.join(__dirname, 'data', 'exercises.selected.json');

export async function seedExercises() {
  const raw = await fs.readFile(SELECTED_DATA_PATH, 'utf-8');
  const exercises = JSON.parse(raw);

  const ops = exercises.map((ex) => ({
    updateOne: {
      filter: { externalId: ex.externalId },
      update: { $set: ex },
      upsert: true,
    },
  }));

  await Exercise.bulkWrite(ops);
  const count = await Exercise.countDocuments();
  console.info(`Seeded exercises: ${count} total in database.`);
  return count;
}
