import { Router } from 'express';
import { postsController } from '../controllers/posts.controller';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Posts routes
router.post('/posts/publish-now', postsController.publishNow);
router.post('/posts/schedule', postsController.schedulePost);
router.get('/posts', postsController.getPosts);
router.delete('/posts/:id', postsController.deletePost);

export default router;
