import { Response } from 'express';
import { AuthRequest } from '../types';
import { postModel } from '../models/post.model';
import { userModel } from '../models/user.model';
import { linkedInService } from '../services/linkedin.service';
import { asyncHandler } from '../middleware/errorHandler';
import { schedulePost } from '../jobs/publishPost.queue';

export const postsController = {
    /**
     * Publish a post immediately
     */
    publishNow: asyncHandler(async (req: AuthRequest, res: Response) => {
        const { content, organizationUrn } = req.body;
        const userId = req.user!.id;

        if (!content || content.trim().length === 0) {
            return res.status(400).json({ error: 'Content is required' });
        }

        if (content.length > 3000) {
            return res.status(400).json({ error: 'Content exceeds 3000 characters' });
        }

        try {
            // Get user with access token
            const user = await userModel.findById(userId);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            // Create post record
            const post = await postModel.create({
                user_id: userId,
                content,
                scheduled_for: new Date(), // Immediate
                status: 'pending',
            });

            // Publish to LinkedIn immediately
            const linkedinPostId = await linkedInService.publishPost(
                user.access_token,
                user.linkedin_id,
                content,
                organizationUrn || undefined
            );

            // Update post status
            const updatedPost = await postModel.updateStatus(
                post.id,
                'published',
                linkedinPostId
            );

            res.json({
                success: true,
                message: 'Post published successfully',
                post: updatedPost,
            });
        } catch (error: any) {
            console.error('Error publishing post:', error);

            // If we created a post record, mark it as failed
            if (req.body.postId) {
                await postModel.updateStatus(
                    req.body.postId,
                    'failed',
                    undefined,
                    error.message
                );
            }

            res.status(500).json({
                error: 'Failed to publish post',
                message: error.message,
            });
        }
    }),

    /**
     * Schedule a post for later
     */
    schedulePost: asyncHandler(async (req: AuthRequest, res: Response) => {
        const { content, scheduledFor, organizationUrn } = req.body;
        const userId = req.user!.id;

        if (!content || content.trim().length === 0) {
            return res.status(400).json({ error: 'Content is required' });
        }

        if (content.length > 3000) {
            return res.status(400).json({ error: 'Content exceeds 3000 characters' });
        }

        if (!scheduledFor) {
            return res.status(400).json({ error: 'Scheduled time is required' });
        }

        const scheduledDate = new Date(scheduledFor);
        if (scheduledDate <= new Date()) {
            return res.status(400).json({ error: 'Scheduled time must be in the future' });
        }

        try {
            // Create post record
            const post = await postModel.create({
                user_id: userId,
                content,
                scheduled_for: scheduledDate,
                status: 'pending',
            });

            // Schedule job with BullMQ
            await schedulePost(post.id, userId, scheduledDate);

            res.json({
                success: true,
                message: 'Post scheduled successfully',
                post,
            });
        } catch (error: any) {
            console.error('Error scheduling post:', error);
            res.status(500).json({
                error: 'Failed to schedule post',
                message: error.message,
            });
        }
    }),

    /**
     * Get all posts for the authenticated user
     */
    getPosts: asyncHandler(async (req: AuthRequest, res: Response) => {
        const userId = req.user!.id;

        try {
            const posts = await postModel.findByUserId(userId);
            res.json({ posts });
        } catch (error: any) {
            console.error('Error fetching posts:', error);
            res.status(500).json({
                error: 'Failed to fetch posts',
                message: error.message,
            });
        }
    }),

    /**
     * Delete a scheduled post
     */
    deletePost: asyncHandler(async (req: AuthRequest, res: Response) => {
        const { id } = req.params;
        const userId = req.user!.id;

        if (!id || isNaN(parseInt(id))) {
            return res.status(400).json({ error: 'Invalid post ID' });
        }

        try {
            // Check if post exists and belongs to user
            const post = await postModel.findById(parseInt(id));

            if (!post) {
                return res.status(404).json({ error: 'Post not found' });
            }

            if (post.user_id !== userId) {
                return res.status(403).json({ error: 'Unauthorized' });
            }

            if (post.status === 'published') {
                return res.status(400).json({ error: 'Cannot delete published posts' });
            }

            // Delete the post
            const deleted = await postModel.delete(parseInt(id), userId);

            if (!deleted) {
                return res.status(500).json({ error: 'Failed to delete post' });
            }

            res.json({
                success: true,
                message: 'Post deleted successfully',
            });
        } catch (error: any) {
            console.error('Error deleting post:', error);
            res.status(500).json({
                error: 'Failed to delete post',
                message: error.message,
            });
        }
    }),
};
