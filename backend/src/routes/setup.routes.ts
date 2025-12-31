import express from 'express';
import pool from '../config/database';

const router = express.Router();

// TEMPORARY - Remove after running once!
router.get('/setup-database', async (req, res) => {
    try {
        const schema = `
      -- Create users table
      CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          email VARCHAR(255) UNIQUE,
          linkedin_id VARCHAR(255) UNIQUE NOT NULL,
          name VARCHAR(255),
          profile_picture_url TEXT,
          access_token TEXT NOT NULL,
          refresh_token TEXT,
          token_expires_at TIMESTAMP,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Create scheduled_posts table (correct name used by models)
      CREATE TABLE IF NOT EXISTS scheduled_posts (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          content TEXT NOT NULL,
          media_urls TEXT[],
          scheduled_for TIMESTAMP NOT NULL,
          status VARCHAR(50) NOT NULL DEFAULT 'pending',
          linkedin_post_id VARCHAR(255),
          error_message TEXT,
          organization_id VARCHAR(255),
          publish_as VARCHAR(50) DEFAULT 'person',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          published_at TIMESTAMP
      );

      -- Create indexes
      CREATE INDEX IF NOT EXISTS idx_users_linkedin_id ON users(linkedin_id);
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_scheduled_posts_user_id ON scheduled_posts(user_id);
      CREATE INDEX IF NOT EXISTS idx_scheduled_posts_status ON scheduled_posts(status);
      CREATE INDEX IF NOT EXISTS idx_scheduled_posts_scheduled_for ON scheduled_posts(scheduled_for);
      CREATE INDEX IF NOT EXISTS idx_scheduled_posts_organization_id ON scheduled_posts(organization_id);
    `;

        // Execute schema
        await pool.query(schema);

        res.json({
            success: true,
            message: 'Database tables created successfully!'
        });
    } catch (error: any) {
        console.error('Database setup error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// TEMPORARY - Reset database (drops and recreates tables)
router.get('/reset-database', async (req, res) => {
    try {
        const resetSchema = `
      -- Drop existing tables
      DROP TABLE IF EXISTS scheduled_posts CASCADE;
      DROP TABLE IF EXISTS users CASCADE;

      -- Create users table
      CREATE TABLE users (
          id SERIAL PRIMARY KEY,
          email VARCHAR(255) UNIQUE,
          linkedin_id VARCHAR(255) UNIQUE NOT NULL,
          name VARCHAR(255),
          profile_picture_url TEXT,
          access_token TEXT NOT NULL,
          refresh_token TEXT,
          token_expires_at TIMESTAMP,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Create scheduled_posts table with ALL columns
      CREATE TABLE scheduled_posts (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          content TEXT NOT NULL,
          media_urls TEXT[],
          scheduled_for TIMESTAMP NOT NULL,
          status VARCHAR(50) NOT NULL DEFAULT 'pending',
          linkedin_post_id VARCHAR(255),
          error_message TEXT,
          organization_id VARCHAR(255),
          publish_as VARCHAR(50) DEFAULT 'person',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          published_at TIMESTAMP
      );

      -- Create indexes
      CREATE INDEX idx_users_linkedin_id ON users(linkedin_id);
      CREATE INDEX idx_users_email ON users(email);
      CREATE INDEX idx_scheduled_posts_user_id ON scheduled_posts(user_id);
      CREATE INDEX idx_scheduled_posts_status ON scheduled_posts(status);
      CREATE INDEX idx_scheduled_posts_scheduled_for ON scheduled_posts(scheduled_for);
      CREATE INDEX idx_scheduled_posts_organization_id ON scheduled_posts(organization_id);
    `;

        // Execute schema
        await pool.query(resetSchema);

        res.json({
            success: true,
            message: 'Database reset successfully! All tables recreated with complete schema.'
        });
    } catch (error: any) {
        console.error('Database reset error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// TEMPORARY - Migrate blog schema
router.get('/migrate-blog', async (req, res) => {
    try {
        const blogSchema = `
      -- Create blog posts table
      CREATE TABLE IF NOT EXISTS blog_posts (
          id SERIAL PRIMARY KEY,
          title VARCHAR(500) NOT NULL,
          slug VARCHAR(500) UNIQUE NOT NULL,
          excerpt TEXT,
          content TEXT NOT NULL,
          cover_image TEXT,
          author VARCHAR(255) DEFAULT 'Équipe Shaly',
          published BOOLEAN DEFAULT false,
          published_at TIMESTAMP,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Create blog categories table
      CREATE TABLE IF NOT EXISTS blog_categories (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          slug VARCHAR(255) UNIQUE NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Create blog post categories junction table
      CREATE TABLE IF NOT EXISTS blog_post_categories (
          post_id INTEGER REFERENCES blog_posts(id) ON DELETE CASCADE,
          category_id INTEGER REFERENCES blog_categories(id) ON DELETE CASCADE,
          PRIMARY KEY (post_id, category_id)
      );

      -- Create indexes
      CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
      CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published);
      CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at);
      CREATE INDEX IF NOT EXISTS idx_blog_categories_slug ON blog_categories(slug);

      -- Insert default categories
      INSERT INTO blog_categories (name, slug) VALUES
          ('LinkedIn Tips', 'linkedin-tips'),
          ('Marketing', 'marketing'),
          ('Productivité', 'productivite'),
          ('Social Media', 'social-media'),
          ('Automatisation', 'automatisation')
      ON CONFLICT (slug) DO NOTHING;
    `;

        await pool.query(blogSchema);

        res.json({
            success: true,
            message: 'Blog schema migrated successfully!'
        });
    } catch (error: any) {
        console.error('Blog migration error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// TEMPORARY - Import blog article without authentication
router.post('/import-article', async (req, res) => {
    try {
        const { title, slug, excerpt, content, cover_image, author, published, published_at } = req.body;

        const result = await pool.query(
            `INSERT INTO blog_posts (title, slug, excerpt, content, cover_image, author, published, published_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
            [title, slug, excerpt, content, cover_image, author || 'Équipe Shaly', published, published_at]
        );

        res.status(201).json({
            success: true,
            post: result.rows[0]
        });
    } catch (error: any) {
        console.error('Error importing blog article:', error);
        if (error.code === '23505') {
            return res.status(400).json({ error: 'Slug already exists' });
        }
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

export default router;
