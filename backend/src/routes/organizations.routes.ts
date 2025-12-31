import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { getOrganizations } from '../controllers/organizations.controller';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get user's organizations
router.get('/', getOrganizations);

export default router;
