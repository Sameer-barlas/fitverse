import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { updateProfileSchema } from '../validators/profileValidators.js';
import { getProfile, updateProfile } from '../controllers/profileController.js';

const router = Router();

router.use(protect);

router.get('/', getProfile);
router.put('/', validate(updateProfileSchema), updateProfile);

export default router;
