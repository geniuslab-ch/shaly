-- Migration: Add timezone support for users
-- Created: 2026-01-01

-- Add timezone column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS timezone VARCHAR(50) DEFAULT 'Europe/Zurich';

-- Add comment
COMMENT ON COLUMN users.timezone IS 'User timezone for displaying local times (IANA timezone format)';

-- Update existing users to default timezone
UPDATE users SET timezone = 'Europe/Zurich' WHERE timezone IS NULL;
