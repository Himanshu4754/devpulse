import express from 'express';
import { body } from 'express-validator';
import { connect, list, getOne, refresh } from '../controllers/repositoryController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validate.js';
import { syncLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.use(protect);

router.post(
  '/',
  syncLimiter,
  [
    body('githubToken').notEmpty().withMessage('GitHub token is required'),
    body('fullName').matches(/^[\w.-]+\/[\w.-]+$/).withMessage('Format must be owner/repo')
  ],
  validate,
  connect
);

router.get('/', list);
router.get('/:id', getOne);
router.post('/:id/refresh', syncLimiter, refresh);

export default router;