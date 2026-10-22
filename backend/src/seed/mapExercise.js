export function deriveMuscleGroup(primaryMuscle, category) {
  if (category === 'cardio') {
    return 'cardio';
  }

  const muscle = (primaryMuscle || '').toLowerCase();

  if (muscle === 'chest') {
    return 'chest';
  }
  if (['lats', 'middle back', 'lower back', 'traps'].includes(muscle)) {
    return 'back';
  }
  if (['shoulders', 'neck'].includes(muscle)) {
    return 'shoulders';
  }
  if (['biceps', 'triceps', 'forearms'].includes(muscle)) {
    return 'arms';
  }
  if (['quadriceps', 'hamstrings', 'glutes', 'calves', 'abductors', 'adductors'].includes(muscle)) {
    return 'legs';
  }
  if (muscle === 'abdominals') {
    return 'core';
  }

  return 'core';
}

export function mapExercise(rawExercise, selectionItem) {
  let level = selectionItem.level;
  if (!level) {
    const rawLevel = (rawExercise.level || 'beginner').toLowerCase();
    level = rawLevel === 'expert' ? 'advanced' : rawLevel;
  }

  let trackingType = selectionItem.tracking;
  if (!trackingType) {
    if (rawExercise.category === 'cardio' || rawExercise.category === 'stretching') {
      trackingType = 'time';
    } else {
      trackingType = 'reps';
    }
  }

  const primaryMuscle = (rawExercise.primaryMuscles && rawExercise.primaryMuscles[0]) || '';
  const muscleGroup = deriveMuscleGroup(primaryMuscle, rawExercise.category);

  return {
    externalId: rawExercise.id,
    name: rawExercise.name,
    category: rawExercise.category,
    level,
    force: rawExercise.force || null,
    mechanic: rawExercise.mechanic || null,
    equipment: (rawExercise.equipment || 'other').toLowerCase(),
    primaryMuscles: rawExercise.primaryMuscles || [],
    secondaryMuscles: rawExercise.secondaryMuscles || [],
    muscleGroup,
    trackingType,
    lowImpact: Boolean(selectionItem.lowImpact),
    slots: selectionItem.slots || [],
    instructions: rawExercise.instructions || [],
    images: rawExercise.images || [],
  };
}
