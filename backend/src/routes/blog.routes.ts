import express from 'express';
import { blogController } from '../controllers/blog.controller';

const router = express.Router();

// Public routes
router.get('/posts', blogController.getPosts);
router.get('/posts/:slug', blogController.getPostBySlug);
router.get('/categories', blogController.getCategories);

// Admin routes (TODO: add authentication middleware)
router.get('/admin/posts', blogController.getAllPosts);
router.post('/admin/posts', blogController.createPost);
router.put('/admin/posts/:id', blogController.updatePost);
router.delete('/admin/posts/:id', blogController.deletePost);

export default router;
