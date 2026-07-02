import express from 'express';
import { getInsights, regenerateInsights } from '../controllers/insightController.js';
import { protect } from '../middleware/authMiddleware.js';
import { insightLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.get('/:id/insights', protect, getInsights);
router.post('/:id/insights/regenerate', protect, insightLimiter, regenerateInsights);

export default router;