import { WorkoutPlan } from '../models/WorkoutPlan.js';
import { Exercise } from '../models/Exercise.js';
import { ApiError } from '../utils/ApiError.js';
import { getRecommendedPlanForUser, PLAN_EXERCISE_SELECT } from '../services/planService.js';

export async function listPlans(req, res) {
  const { bmiCategory, experienceLevel, ageBand } = req.validated.query;

  const filter = {};
  if (bmiCategory) {
    filter.bmiCategory = bmiCategory;
  }
  if (experienceLevel) {
    filter.experienceLevel = experienceLevel;
  }
  if (ageBand) {
    filter.ageBand = ageBand;
  }

  const plans = await WorkoutPlan.find(filter)
    .select('slug name description goal bmiCategory experienceLevel ageBand daysPerWeek')
    .sort({ slug: 1 });

  res.status(200).json({
    data: plans.map((p) => p.toJSON()),
  });
}

export async function getRecommendedPlan(req, res) {
  const result = await getRecommendedPlanForUser(req.user.id);

  res.status(200).json({
    data: result,
  });
}

export async function getPlanById(req, res) {
  const { id } = req.validated.params;

  const plan = await WorkoutPlan.findById(id).populate(
    'days.exercises.exercise',
    PLAN_EXERCISE_SELECT,
  );

  if (!plan) {
    throw new ApiError(404, 'NOT_FOUND', 'Workout plan not found');
  }

  res.status(200).json({
    data: {
      plan: plan.toJSON(),
    },
  });
}
