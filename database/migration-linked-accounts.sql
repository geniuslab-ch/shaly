-- Migration: Add linked accounts support for multi-account feature
-- Created: 2026-01-01

-- Create linked_accounts table
CREATE TABLE IF NOT EXISTS linked_accounts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    linkedin_id VARCHAR(255) NOT NULL UNIQUE,
    access_token TEXT NOT NULL,
    refresh_token TEXT,
    token_expires_at TIMESTAMP,
    email VARCHAR(255),
    name VARCHAR(255),
    profile_picture TEXT,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX idx_linked_accounts_user_id ON linked_accounts(user_id);
CREATE INDEX idx_linked_accounts_linkedin_id ON linked_accounts(linkedin_id);

-- Add linked_account_id to posts table
ALTER TABLE posts ADD COLUMN IF NOT EXISTS linked_account_id INTEGER REFERENCES linked_accounts(id) ON DELETE SET NULL;

-- Create index for posts by linked account
CREATE INDEX IF NOT EXISTS idx_posts_linked_account ON posts(linked_account_id);

-- Migrate existing users to linked_accounts
-- Copy all existing users as their primary linked account
INSERT INTO linked_accounts (user_id, linkedin_id, access_token, refresh_token, token_expires_at, email, name, profile_picture, is_primary)
SELECT 
    id,
    linkedin_id,
    access_token,
    refresh_token,
    token_expires_at,
    email,
    name,
    profile_picture,
    true
FROM users
WHERE linkedin_id IS NOT NULL
ON CONFLICT (linkedin_id) DO NOTHING;

-- Update existing posts to reference the primary linked account
UPDATE posts p
SET linked_account_id = la.id
FROM linked_accounts la
WHERE p.user_id = la.user_id
  AND la.is_primary = true
  AND p.linked_account_id IS NULL;

-- Add comments
COMMENT ON TABLE linked_accounts IS 'Stores multiple LinkedIn accounts linked to a single user';
COMMENT ON COLUMN linked_accounts.is_primary IS 'Marks the primary account (original login account)';
COMMENT ON COLUMN posts.linked_account_id IS 'References which linked account was used to create this post';
