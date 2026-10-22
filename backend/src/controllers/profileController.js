import { Profile } from '../models/Profile.js';
import { ApiError } from '../utils/ApiError.js';
import {
  calculateBmi,
  getBmiCategory,
  formatProfileResponse,
} from '../services/bmiService.js';

export async function getProfile(req, res) {
  const profile = await Profile.findOne({ user: req.user.id });

  if (!profile) {
    throw new ApiError(404, 'PROFILE_NOT_FOUND', 'Profile not found');
  }

  res.status(200).json({
    data: {
      profile: formatProfileResponse(profile),
    },
  });
}

export async function updateProfile(req, res) {
  const { heightCm, weightKg, age, gender, experienceLevel } = req.validated.body;

  const bmi = calculateBmi(heightCm, weightKg);
  const bmiCategory = getBmiCategory(bmi);

  const profile = await Profile.findOneAndUpdate(
    { user: req.user.id },
    {
      user: req.user.id,
      heightCm,
      weightKg,
      age,
      gender,
      experienceLevel,
      bmi,
      bmiCategory,
    },
    {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    },
  );

  res.status(200).json({
    data: {
      profile: formatProfileResponse(profile),
    },
  });
}
