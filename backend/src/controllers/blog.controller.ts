import { Request, Response } from 'express';
import pool from '../config/database';

export const blogController = {
    // Get all published blog posts
    async getPosts(req: Request, res: Response) {
        try {
            const result = await pool.query(
                `SELECT id, title, slug, excerpt, cover_image, author, published_at, created_at
         FROM blog_posts 
         WHERE published = true AND published_at <= NOW()
         ORDER BY published_at DESC`
            );
            res.json({ posts: result.rows });
        } catch (error: any) {
            console.error('Error fetching blog posts:', error);
            res.status(500).json({ error: 'Failed to fetch blog posts' });
        }
    },

    // Get single blog post by slug
    async getPostBySlug(req: Request, res: Response) {
        try {
            const { slug } = req.params;
            const result = await pool.query(
                `SELECT * FROM blog_posts 
         WHERE slug = $1 AND published = true AND published_at <= NOW()`,
                [slug]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'Post not found' });
            }

            res.json({ post: result.rows[0] });
        } catch (error: any) {
            console.error('Error fetching blog post:', error);
            res.status(500).json({ error: 'Failed to fetch blog post' });
        }
    },

    // Admin: Get all posts (including drafts)
    async getAllPosts(req: Request, res: Response) {
        try {
            const result = await pool.query(
                `SELECT * FROM blog_posts ORDER BY created_at DESC`
            );
            res.json({ posts: result.rows });
        } catch (error: any) {
            console.error('Error fetching all blog posts:', error);
            res.status(500).json({ error: 'Failed to fetch blog posts' });
        }
    },

    // Admin: Create new blog post
    async createPost(req: Request, res: Response) {
        try {
            const { title, slug, excerpt, content, cover_image, author, published, published_at } = req.body;

            const result = await pool.query(
                `INSERT INTO blog_posts (title, slug, excerpt, content, cover_image, author, published, published_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *`,
                [title, slug, excerpt, content, cover_image, author || 'Équipe Shaly', published, published_at]
            );

            res.status(201).json({ post: result.rows[0] });
        } catch (error: any) {
            console.error('Error creating blog post:', error);
            if (error.code === '23505') {
                return res.status(400).json({ error: 'Slug already exists' });
            }
            res.status(500).json({ error: 'Failed to create blog post' });
        }
    },

    // Admin: Update blog post
    async updatePost(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { title, slug, excerpt, content, cover_image, author, published, published_at } = req.body;

            const result = await pool.query(
                `UPDATE blog_posts 
         SET title = $1, slug = $2, excerpt = $3, content = $4, cover_image = $5, 
             author = $6, published = $7, published_at = $8
         WHERE id = $9
         RETURNING *`,
                [title, slug, excerpt, content, cover_image, author, published, published_at, id]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'Post not found' });
            }

            res.json({ post: result.rows[0] });
        } catch (error: any) {
            console.error('Error updating blog post:', error);
            res.status(500).json({ error: 'Failed to update blog post' });
        }
    },

    // Admin: Delete blog post
    async deletePost(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const result = await pool.query('DELETE FROM blog_posts WHERE id = $1', [id]);

            if (result.rowCount === 0) {
                return res.status(404).json({ error: 'Post not found' });
            }

            res.json({ success: true });
        } catch (error: any) {
            console.error('Error deleting blog post:', error);
            res.status(500).json({ error: 'Failed to delete blog post' });
        }
    },

    // Get categories
    async getCategories(req: Request, res: Response) {
        try {
            const result = await pool.query('SELECT * FROM blog_categories ORDER BY name');
            res.json({ categories: result.rows });
        } catch (error: any) {
            console.error('Error fetching categories:', error);
            res.status(500).json({ error: 'Failed to fetch categories' });
        }
    },
};
