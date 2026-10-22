export function calculateBmi(heightCm, weightKg) {
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  return Number(bmi.toFixed(1));
}

export function getBmiCategory(bmi) {
  if (bmi < 18.5) {
    return 'underweight';
  }
  if (bmi <= 24.9) {
    return 'normal';
  }
  if (bmi <= 29.9) {
    return 'overweight';
  }
  return 'obese';
}

export function getAgeBand(age) {
  if (age <= 39) {
    return 'adult';
  }
  if (age <= 54) {
    return 'midlife';
  }
  return 'senior';
}

export function getHealthyWeightRangeKg(heightCm) {
  const heightM = heightCm / 100;
  const min = Number((18.5 * heightM * heightM).toFixed(1));
  const max = Number((24.9 * heightM * heightM).toFixed(1));
  return { min, max };
}

export function formatProfileResponse(profileDoc) {
  const profile = profileDoc.toJSON ? profileDoc.toJSON() : { ...profileDoc };
  return {
    ...profile,
    ageBand: getAgeBand(profile.age),
    healthyWeightRangeKg: getHealthyWeightRangeKg(profile.heightCm),
  };
}
