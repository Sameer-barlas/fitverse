import mongoose from 'mongoose';
import { connectDB, disconnectDB } from '../src/config/db.js';
import { Exercise } from '../src/models/Exercise.js';
import { WorkoutPlan } from '../src/models/WorkoutPlan.js';
import { User } from '../src/models/User.js';
import { Profile } from '../src/models/Profile.js';
import { WorkoutLog } from '../src/models/WorkoutLog.js';
import { calculateBmi, getBmiCategory } from '../src/services/bmiService.js';
import app from '../src/app.js';

async function runLiveAtlasTests() {
  console.info('=== STARTING LIVE MONGODB ATLAS TEST ===');
  await connectDB();

  const ping = await mongoose.connection.db.admin().ping();
  console.info('[PASS] DB Ping:', ping);

  const exCount = await Exercise.countDocuments();
  console.info(`[CHECK] Exercise count in Atlas: ${exCount}`);
  if (exCount !== 76) {
    throw new Error(`Expected 76 exercises in Atlas, found ${exCount}`);
  }
  console.info('[PASS] 76 exercises present in MongoDB Atlas.');

  const planCount = await WorkoutPlan.countDocuments();
  console.info(`[CHECK] WorkoutPlan count in Atlas: ${planCount}`);
  if (planCount !== 36) {
    throw new Error(`Expected 36 workout plans in Atlas, found ${planCount}`);
  }
  console.info('[PASS] 36 workout plans present in MongoDB Atlas.');

  const samplePlan = await WorkoutPlan.findOne({ slug: 'normal-beginner-adult' }).populate(
    'days.exercises.exercise',
  );
  console.info(
    `[PASS] Sample plan retrieved: "${samplePlan.name}" (${samplePlan.daysPerWeek} days)`,
  );
  const firstEx = samplePlan.days[0].exercises[0].exercise;
  console.info(
    `[PASS] Day 1 Exercise 1 populated correctly: "${firstEx.name}" (ID: ${firstEx.id})`,
  );

  const testEmail = `atlas_test_${Date.now()}@example.com`;
  console.info(`[CHECK] Testing Write/Read/Delete cycle with test user: ${testEmail}`);

  const user = await User.create({
    name: 'Atlas Tester',
    email: testEmail,
    password: 'password123',
  });
  console.info(`[PASS] User created with ID: ${user.id}`);

  const bmi = calculateBmi(178, 73.2);
  const bmiCategory = getBmiCategory(bmi);
  const profile = await Profile.create({
    user: user._id,
    heightCm: 178,
    weightKg: 73.2,
    age: 29,
    gender: 'male',
    experienceLevel: 'beginner',
    bmi,
    bmiCategory,
  });
  console.info(`[PASS] Profile created with ID: ${profile.id}, BMI: ${bmi} (${bmiCategory})`);

  const log = await WorkoutLog.create({
    user: user._id,
    date: '2026-10-18',
    title: 'Atlas Verification Session',
    entries: [
      {
        exercise: firstEx._id,
        sets: [{ reps: 10, weightKg: 0 }],
      },
    ],
  });
  console.info(`[PASS] WorkoutLog created with ID: ${log.id}`);

  console.info('[CHECK] Starting Express server to test live HTTP endpoints...');
  const server = await new Promise((resolve) => {
    const s = app.listen(0, () => resolve(s));
  });
  const port = server.address().port;
  console.info(`[PASS] Express server listening on ephemeral port ${port}`);

  try {
    const healthRes = await fetch(`http://localhost:${port}/api/health`);
    if (healthRes.status !== 200) throw new Error('Health failed');
    console.info('[PASS] GET /api/health -> 200 OK');
  } finally {
    await new Promise((resolve) => server.close(resolve));
    await WorkoutLog.deleteOne({ _id: log._id });
    await Profile.deleteOne({ _id: profile._id });
    await User.deleteOne({ _id: user._id });
    console.info('[PASS] Cleaned up temporary test documents.');
    await disconnectDB();
  }

  console.info('=== ALL LIVE ATLAS INTEGRATION TESTS PASSED SUCCESSFULLY! ===');
}

runLiveAtlasTests().catch((err) => {
  console.error('Live Atlas test failed:', err);
  process.exit(1);
});
