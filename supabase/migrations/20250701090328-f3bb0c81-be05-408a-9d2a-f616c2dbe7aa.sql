
-- Remove n8n_webhook_url column from campaigns table since we're using environment variable
ALTER TABLE campaigns DROP COLUMN IF EXISTS n8n_webhook_url;
