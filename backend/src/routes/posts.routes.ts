import { Router, RequestHandler } from 'express';
import { postsController } from '../controllers/posts.controller';
import { authenticateToken } from '../middleware/auth';
import { checkTrialStatus } from '../middleware/checkTrial';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Check trial status for all routes
router.use(checkTrialStatus as RequestHandler);

// Posts routes
router.post('/posts/publish-now', postsController.publishNow);
router.post('/posts/schedule', postsController.schedulePost);
router.get('/posts', postsController.getPosts);
router.delete('/posts/:id', postsController.deletePost);

export default router;
