import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  volumeQuerySchema,
  frequencyQuerySchema,
  musclesQuerySchema,
  exerciseProgressParamSchema,
} from '../validators/statsValidators.js';
import {
  getSummary,
  getVolume,
  getFrequency,
  getMuscles,
  getExerciseProgress,
  getPersonalRecords,
} from '../controllers/statsController.js';

const router = Router();

router.use(protect);

router.get('/summary', getSummary);
router.get('/volume', validate(volumeQuerySchema), getVolume);
router.get('/frequency', validate(frequencyQuerySchema), getFrequency);
router.get('/muscles', validate(musclesQuerySchema), getMuscles);
router.get('/personal-records', getPersonalRecords);
router.get(
  '/exercise/:exerciseId',
  validate(exerciseProgressParamSchema),
  getExerciseProgress,
);

export default router;
