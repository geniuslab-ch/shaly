-- Add organization support to scheduled_posts table
ALTER TABLE scheduled_posts 
ADD COLUMN IF NOT EXISTS organization_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS publish_as VARCHAR(50) DEFAULT 'person';

-- Add index for organization_id  
CREATE INDEX IF NOT EXISTS idx_scheduled_posts_organization_id ON scheduled_posts(organization_id);

COMMENT ON COLUMN scheduled_posts.organization_id IS 'LinkedIn organization URN (e.g., urn:li:organization:12345)';
COMMENT ON COLUMN scheduled_posts.publish_as IS 'Publication target: person or organization';
