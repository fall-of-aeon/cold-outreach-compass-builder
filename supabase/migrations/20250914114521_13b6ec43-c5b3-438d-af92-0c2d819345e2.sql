-- Enable real-time updates for campaigns table
ALTER TABLE campaigns REPLICA IDENTITY FULL;

-- Add campaigns table to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE campaigns;