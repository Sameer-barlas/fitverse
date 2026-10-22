import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  createOrUpdateLogSchema,
  listLogsSchema,
  logIdParamSchema,
} from '../validators/logValidators.js';
import {
  createLog,
  listLogs,
  getLogById,
  updateLog,
  deleteLog,
} from '../controllers/logController.js';

const router = Router();

router.use(protect);

router.post('/', validate(createOrUpdateLogSchema), createLog);
router.get('/', validate(listLogsSchema), listLogs);
router.get('/:id', validate(logIdParamSchema), getLogById);
router.put(
  '/:id',
  validate({ ...logIdParamSchema, ...createOrUpdateLogSchema }),
  updateLog,
);
router.delete('/:id', validate(logIdParamSchema), deleteLog);

export default router;
