import express from 'express';
import { getMetrics } from '../controllers/metricsController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/:id/metrics', protect, getMetrics);

export default router;