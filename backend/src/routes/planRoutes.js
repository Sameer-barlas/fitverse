import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { listPlansSchema, planIdParamSchema } from '../validators/planValidators.js';
import {
  listPlans,
  getRecommendedPlan,
  getPlanById,
} from '../controllers/planController.js';

const router = Router();

router.use(protect);

router.get('/', validate(listPlansSchema), listPlans);
router.get('/recommended', getRecommendedPlan);
router.get('/:id', validate(planIdParamSchema), getPlanById);

export default router;
