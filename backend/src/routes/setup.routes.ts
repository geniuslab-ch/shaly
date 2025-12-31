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

      -- Create posts table
      CREATE TABLE IF NOT EXISTS posts (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          content TEXT NOT NULL,
          scheduled_for TIMESTAMP NOT NULL,
          status VARCHAR(50) NOT NULL DEFAULT 'pending',
          linkedin_post_id VARCHAR(255),
          error_message TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Create indexes
      CREATE INDEX IF NOT EXISTS idx_users_linkedin_id ON users(linkedin_id);
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id);
      CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
      CREATE INDEX IF NOT EXISTS idx_posts_scheduled_for ON posts(scheduled_for);
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

export default router;
