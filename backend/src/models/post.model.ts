import pool from '../config/database';
import { ScheduledPost } from '../types';

export const postModel = {
    /**
     * Create a new scheduled post
     */
    async create(postData: {
        user_id: number;
        content: string;
        media_urls?: string[];
        scheduled_for: Date;
        status?: string;
    }): Promise<ScheduledPost> {
        const result = await pool.query(
            `INSERT INTO scheduled_posts (user_id, content, media_urls, scheduled_for, status)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
            [
                postData.user_id,
                postData.content,
                postData.media_urls || [],
                postData.scheduled_for,
                postData.status || 'pending',
            ]
        );
        return result.rows[0];
    },

    /**
     * Get all posts for a user
     */
    async findByUserId(userId: number): Promise<ScheduledPost[]> {
        const result = await pool.query(
            `SELECT * FROM scheduled_posts 
       WHERE user_id = $1 
       ORDER BY created_at DESC`,
            [userId]
        );
        return result.rows;
    },

    /**
     * Get a single post by ID
     */
    async findById(postId: number): Promise<ScheduledPost | null> {
        const result = await pool.query(
            'SELECT * FROM scheduled_posts WHERE id = $1',
            [postId]
        );
        return result.rows[0] || null;
    },

    /**
     * Update post status
     */
    async updateStatus(
        postId: number,
        status: 'pending' | 'published' | 'failed',
        linkedinPostId?: string,
        errorMessage?: string
    ): Promise<ScheduledPost> {
        const result = await pool.query(
            `UPDATE scheduled_posts 
       SET status = $1, 
           linkedin_post_id = $2, 
           error_message = $3,
           published_at = CASE WHEN $1 = 'published' THEN NOW() ELSE published_at END
       WHERE id = $4
       RETURNING *`,
            [status, linkedinPostId, errorMessage, postId]
        );
        return result.rows[0];
    },

    /**
     * Delete a post
     */
    async delete(postId: number, userId: number): Promise<boolean> {
        const result = await pool.query(
            'DELETE FROM scheduled_posts WHERE id = $1 AND user_id = $2',
            [postId, userId]
        );
        return result.rowCount ? result.rowCount > 0 : false;
    },

    /**
     * Find pending posts that should be published
     */
    async findPendingPosts(): Promise<ScheduledPost[]> {
        const result = await pool.query(
            `SELECT * FROM scheduled_posts 
       WHERE status = 'pending' 
       AND scheduled_for <= NOW()
       ORDER BY scheduled_for ASC`
        );
        return result.rows;
    },
};
