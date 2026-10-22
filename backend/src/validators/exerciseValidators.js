import { z } from 'zod';

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const listExercisesSchema = {
  query: z.object({
    q: z.string().trim().optional(),
    muscleGroup: z
      .enum(['chest', 'back', 'shoulders', 'arms', 'legs', 'core', 'cardio'])
      .optional(),
    category: z
      .enum([
        'strength',
        'stretching',
        'cardio',
        'plyometrics',
        'powerlifting',
        'strongman',
        'olympic weightlifting',
      ])
      .optional(),
    equipment: z.string().trim().toLowerCase().optional(),
    level: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
  }),
};

export const exerciseIdParamSchema = {
  params: z.object({
    id: z.string().regex(objectIdRegex, 'Invalid exercise ID format'),
  }),
};
