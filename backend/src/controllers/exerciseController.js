import { Exercise } from '../models/Exercise.js';
import { ApiError } from '../utils/ApiError.js';

export async function listExercises(req, res) {
  const { q, muscleGroup, category, equipment, level, page, limit } = req.validated.query;

  const filter = {};
  if (q) {
    const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    filter.name = { $regex: escaped, $options: 'i' };
  }
  if (muscleGroup) {
    filter.muscleGroup = muscleGroup;
  }
  if (category) {
    filter.category = category;
  }
  if (equipment) {
    filter.equipment = equipment;
  }
  if (level) {
    filter.level = level;
  }

  const skip = (page - 1) * limit;

  const [docs, total] = await Promise.all([
    Exercise.find(filter).sort({ name: 1 }).skip(skip).limit(limit),
    Exercise.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limit) || 1;

  res.status(200).json({
    data: docs.map((d) => d.toJSON()),
    meta: {
      page,
      limit,
      total,
      totalPages,
    },
  });
}

export async function getExerciseFilters(_req, res) {
  const [muscleGroups, categories, equipments, levels] = await Promise.all([
    Exercise.distinct('muscleGroup'),
    Exercise.distinct('category'),
    Exercise.distinct('equipment'),
    Exercise.distinct('level'),
  ]);

  res.status(200).json({
    data: {
      muscleGroups: muscleGroups.sort(),
      categories: categories.sort(),
      equipments: equipments.sort(),
      levels: levels.sort(),
    },
  });
}

export async function getExerciseById(req, res) {
  const { id } = req.validated.params;
  const exercise = await Exercise.findById(id);

  if (!exercise) {
    throw new ApiError(404, 'NOT_FOUND', 'Exercise not found');
  }

  res.status(200).json({
    data: {
      exercise: exercise.toJSON(),
    },
  });
}
