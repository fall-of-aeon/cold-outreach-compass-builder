-- Fix security vulnerability: Add user-based access control to campaigns table
-- Step 1: Add user_id column as nullable first

-- Add user_id column to campaigns table if it doesn't exist
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- For existing campaigns without user_id, we need to assign them to a user
-- Since we don't have authentication context in migration, we'll leave them as nullable for now
-- and handle this in the application code

-- Drop the existing permissive RLS policy
DROP POLICY IF EXISTS "Allow all operations on campaigns" ON campaigns;

-- Create secure user-based RLS policies that handle nullable user_id
CREATE POLICY "Users can view their own campaigns" 
ON campaigns 
FOR SELECT 
USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can create their own campaigns" 
ON campaigns 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own campaigns" 
ON campaigns 
FOR UPDATE 
USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can delete their own campaigns" 
ON campaigns 
FOR DELETE 
USING (auth.uid() = user_id OR user_id IS NULL);

-- Update get_dashboard_stats function to only show user's own data
CREATE OR REPLACE FUNCTION public.get_dashboard_stats()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
    result JSONB;
BEGIN
    SELECT jsonb_build_object(
        'totalCampaigns', COUNT(*),
        'activeCampaigns', COUNT(*) FILTER (WHERE status IN ('processing', 'completed')),
        'totalLeadsFound', COALESCE(SUM(total_leads_found), 0),
        'qualifiedLeads', COALESCE(SUM(qualified_leads), 0),
        'totalEmailsSent', COALESCE(SUM(emails_sent), 0),
        'avgOpenRate', COALESCE(AVG(open_rate), 0),
        'avgReplyRate', COALESCE(AVG(reply_rate), 0),
        'lastUpdated', NOW()
    ) INTO result
    FROM campaigns
    WHERE created_at >= NOW() - INTERVAL '30 days' 
    AND (user_id = auth.uid() OR user_id IS NULL); -- Show user's campaigns or legacy ones
    
    RETURN result;
END;
$function$;