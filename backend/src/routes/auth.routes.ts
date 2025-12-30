import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// OAuth routes
router.get('/linkedin', authController.initiateAuth);
router.get('/linkedin/callback', authController.handleCallback);

// Protected routes
router.get('/status', authenticateToken, authController.checkStatus);

export default router;
