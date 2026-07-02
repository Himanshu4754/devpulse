import express from 'express';
import { compareRepositories } from '../controllers/comparisonController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/compare', protect, compareRepositories);

export default router;