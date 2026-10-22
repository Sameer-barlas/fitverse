import { z } from 'zod';
import { isValidDateString, isNotAfterTomorrow } from '../utils/dates.js';

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

const setSchema = z.object({
  reps: z
    .number()
    .int('Reps must be an integer')
    .min(1, 'Reps must be at least 1')
    .max(200, 'Reps cannot exceed 200')
    .nullable()
    .optional(),
  weightKg: z
    .number()
    .min(0, 'Weight cannot be negative')
    .max(1000, 'Weight cannot exceed 1000 kg')
    .optional(),
  durationSec: z
    .number()
    .int('Duration must be an integer')
    .min(1, 'Duration must be at least 1 second')
    .max(36000, 'Duration cannot exceed 36000 seconds')
    .nullable()
    .optional(),
});

const entrySchema = z.object({
  exercise: z.string().regex(objectIdRegex, 'Invalid exercise ID'),
  notes: z.string().trim().max(200, 'Entry notes cannot exceed 200 characters').optional().default(''),
  sets: z
    .array(setSchema)
    .min(1, 'At least 1 set is required')
    .max(20, 'Cannot exceed 20 sets per exercise'),
});

export const createOrUpdateLogSchema = {
  body: z
    .object({
      date: z
        .string({ required_error: 'Date is required' })
        .refine(isValidDateString, 'Invalid calendar date (expected YYYY-MM-DD)')
        .refine(isNotAfterTomorrow, 'Date cannot be later than tomorrow'),
      title: z.string().trim().max(80, 'Title cannot exceed 80 characters').optional().default(''),
      notes: z.string().trim().max(500, 'Notes cannot exceed 500 characters').optional().default(''),
      planDay: z
        .object({
          plan: z.string().regex(objectIdRegex, 'Invalid plan ID'),
          dayNumber: z.number().int().min(1).max(7),
        })
        .nullable()
        .optional()
        .default(null),
      entries: z
        .array(entrySchema)
        .min(1, 'At least 1 exercise entry is required')
        .max(20, 'Cannot exceed 20 exercises per workout'),
    })
    .superRefine((data, ctx) => {
      const seen = new Set();
      data.entries.forEach((entry, idx) => {
        if (seen.has(entry.exercise)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['entries', idx, 'exercise'],
            message: 'Duplicate exercise in the same workout session is not allowed',
          });
        }
        seen.add(entry.exercise);
      });
    }),
};

export const listLogsSchema = {
  query: z.object({
    from: z.string().refine(isValidDateString, 'Invalid from date').optional(),
    to: z.string().refine(isValidDateString, 'Invalid to date').optional(),
    exerciseId: z.string().regex(objectIdRegex, 'Invalid exercise ID').optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
  }),
};

export const logIdParamSchema = {
  params: z.object({
    id: z.string().regex(objectIdRegex, 'Invalid log ID format'),
  }),
};
