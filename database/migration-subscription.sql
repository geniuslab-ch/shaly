-- Add subscription and trial fields to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS trial_start_date TIMESTAMP;
ALTER TABLE users ADD COLUMN IF NOT EXISTS trial_end_date TIMESTAMP;
ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_status VARCHAR(50) DEFAULT 'trial';
ALTER TABLE users ADD COLUMN IF NOT EXISTS stripe_customer_id VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS stripe_subscription_id VARCHAR(255);

-- Create index on subscription status for faster queries
CREATE INDEX IF NOT EXISTS idx_users_subscription_status ON users(subscription_status);

-- Update existing users to have trial period
UPDATE users 
SET 
  trial_start_date = created_at,
  trial_end_date = created_at + INTERVAL '14 days',
  subscription_status = CASE 
    WHEN created_at < NOW() - INTERVAL '14 days' THEN 'trial_expired'
    ELSE 'trial'
  END
WHERE trial_start_date IS NULL;
