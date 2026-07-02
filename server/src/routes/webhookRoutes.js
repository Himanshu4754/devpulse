import express from 'express';
import { handleGithubWebhook } from '../controllers/webhookController.js';
import { verifyGithubSignature } from '../middleware/verifyGithubSignature.js';

const router = express.Router();

router.post('/github', verifyGithubSignature, handleGithubWebhook);

export default router;