import { fileURLToPath } from 'url';
import { connectDB, disconnectDB } from '../config/db.js';
import { seedExercises } from './seedExercises.js';
import { seedPlans } from './seedPlans.js';

export async function runSeed() {
  await seedExercises();
  await seedPlans();
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  connectDB()
    .then(() => runSeed())
    .then(() => disconnectDB())
    .then(() => {
      console.info('Seed completed successfully.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Seed failed:', err);
      process.exit(1);
    });
}
