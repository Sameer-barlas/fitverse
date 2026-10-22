import { z } from 'zod';

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const volumeQuerySchema = {
  query: z.object({
    weeks: z.coerce
      .number()
      .int('weeks must be an integer')
      .min(1, 'weeks must be between 1 and 12')
      .max(12, 'weeks must be between 1 and 12')
      .default(8),
  }),
};

export const frequencyQuerySchema = {
  query: z.object({
    days: z.coerce
      .number()
      .int('days must be an integer')
      .min(7, 'days must be between 7 and 90')
      .max(90, 'days must be between 7 and 90')
      .default(28),
  }),
};

export const musclesQuerySchema = {
  query: z.object({
    days: z.coerce
      .number()
      .int('days must be an integer')
      .min(7, 'days must be between 7 and 365')
      .max(365, 'days must be between 7 and 365')
      .default(30),
  }),
};

export const exerciseProgressParamSchema = {
  params: z.object({
    exerciseId: z.string().regex(objectIdRegex, 'Invalid exercise ID format'),
  }),
};
