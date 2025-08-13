-- Fix security vulnerability: Add user-based access control to campaigns table

-- Add user_id column to campaigns table if it doesn't exist
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Update existing campaigns to have a user_id (set to a placeholder for now - these will need manual assignment)
-- In production, you'd want to identify the actual owners
UPDATE campaigns SET user_id = auth.uid() WHERE user_id IS NULL;

-- Make user_id non-nullable now that all records have values
ALTER TABLE campaigns ALTER COLUMN user_id SET NOT NULL;

-- Drop the existing permissive RLS policy
DROP POLICY IF EXISTS "Allow all operations on campaigns" ON campaigns;

-- Create secure user-based RLS policies
CREATE POLICY "Users can view their own campaigns" 
ON campaigns 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own campaigns" 
ON campaigns 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own campaigns" 
ON campaigns 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own campaigns" 
ON campaigns 
FOR DELETE 
USING (auth.uid() = user_id);

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
    AND user_id = auth.uid(); -- Only show authenticated user's campaigns
    
    RETURN result;
END;
$function$;