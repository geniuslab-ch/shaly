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

export default router;
