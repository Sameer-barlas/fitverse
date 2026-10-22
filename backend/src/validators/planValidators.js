import { z } from 'zod';

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const listPlansSchema = {
  query: z.object({
    bmiCategory: z.enum(['underweight', 'normal', 'overweight', 'obese']).optional(),
    experienceLevel: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
    ageBand: z.enum(['adult', 'midlife', 'senior']).optional(),
  }),
};

export const planIdParamSchema = {
  params: z.object({
    id: z.string().regex(objectIdRegex, 'Invalid plan ID format'),
  }),
};
