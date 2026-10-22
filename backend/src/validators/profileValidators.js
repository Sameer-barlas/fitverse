import { z } from 'zod';

export const updateProfileSchema = {
  body: z.object({
    heightCm: z
      .number({ required_error: 'Height is required' })
      .min(100, 'Height must be at least 100 cm')
      .max(250, 'Height cannot exceed 250 cm'),
    weightKg: z
      .number({ required_error: 'Weight is required' })
      .min(30, 'Weight must be at least 30 kg')
      .max(300, 'Weight cannot exceed 300 kg'),
    age: z
      .number({ required_error: 'Age is required' })
      .int('Age must be an integer')
      .min(18, 'Age must be between 18 and 80')
      .max(80, 'Age must be between 18 and 80'),
    gender: z.enum(['male', 'female', 'other'], {
      required_error: 'Gender is required',
      invalid_type_error: 'Gender must be male, female, or other',
    }),
    experienceLevel: z.enum(['beginner', 'intermediate', 'advanced'], {
      required_error: 'Experience level is required',
      invalid_type_error: 'Experience level must be beginner, intermediate, or advanced',
    }),
  }),
};
