-- Migration: Add media support to posts
-- Created: 2026-01-01

-- Add media columns to posts table
ALTER TABLE posts 
ADD COLUMN IF NOT EXISTS article_url TEXT,
ADD COLUMN IF NOT EXISTS media_urls TEXT[],
ADD COLUMN IF NOT EXISTS media_type VARCHAR(20) DEFAULT 'text';

-- Add comments
COMMENT ON COLUMN posts.article_url IS 'URL of shared article (for article posts)';
COMMENT ON COLUMN posts.media_urls IS 'Array of media URLs (images or video from Cloudinary)';
COMMENT ON COLUMN posts.media_type IS 'Type of post: text, article, image, or video';

-- Add index for media type queries
CREATE INDEX IF NOT EXISTS idx_posts_media_type ON posts(media_type);
