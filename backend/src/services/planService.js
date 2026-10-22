import { Profile } from '../models/Profile.js';
import { WorkoutPlan } from '../models/WorkoutPlan.js';
import { Exercise } from '../models/Exercise.js';
import { ApiError } from '../utils/ApiError.js';
import { getAgeBand } from './bmiService.js';

export const PLAN_EXERCISE_SELECT =
  'name images trackingType muscleGroup externalId level equipment lowImpact';

export async function getRecommendedPlanForUser(userId) {
  const profile = await Profile.findOne({ user: userId });
  if (!profile) {
    throw new ApiError(
      400,
      'PROFILE_REQUIRED',
      'Please complete your profile to get a recommended workout plan',
    );
  }

  const ageBand = getAgeBand(profile.age);

  const plan = await WorkoutPlan.findOne({
    bmiCategory: profile.bmiCategory,
    experienceLevel: profile.experienceLevel,
    ageBand,
  }).populate('days.exercises.exercise', PLAN_EXERCISE_SELECT);

  if (!plan) {
    throw new ApiError(404, 'NOT_FOUND', 'Recommended workout plan not found');
  }

  return {
    plan: plan.toJSON(),
    why: {
      bmi: profile.bmi,
      bmiCategory: profile.bmiCategory,
      ageBand,
      experienceLevel: profile.experienceLevel,
    },
  };
}
