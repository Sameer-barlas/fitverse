import { Router } from 'express';
import healthRoutes from './healthRoutes.js';
import authRoutes from './authRoutes.js';
import profileRoutes from './profileRoutes.js';
import exerciseRoutes from './exerciseRoutes.js';
import planRoutes from './planRoutes.js';
import logRoutes from './logRoutes.js';
import statsRoutes from './statsRoutes.js';

const router = Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/profile', profileRoutes);
router.use('/exercises', exerciseRoutes);
router.use('/plans', planRoutes);
router.use('/logs', logRoutes);
router.use('/stats', statsRoutes);

export default router;
