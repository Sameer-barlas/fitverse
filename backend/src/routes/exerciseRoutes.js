import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  listExercisesSchema,
  exerciseIdParamSchema,
} from '../validators/exerciseValidators.js';
import {
  listExercises,
  getExerciseFilters,
  getExerciseById,
} from '../controllers/exerciseController.js';

const router = Router();

router.use(protect);

router.get('/', validate(listExercisesSchema), listExercises);
router.get('/filters', getExerciseFilters);
router.get('/:id', validate(exerciseIdParamSchema), getExerciseById);

export default router;
