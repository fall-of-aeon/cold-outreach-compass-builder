-- Fix security vulnerability: Remove permissive NULL user_id access from campaigns table

-- Drop existing RLS policies on campaigns table
DROP POLICY IF EXISTS "Users can view their own campaigns" ON campaigns;
DROP POLICY IF EXISTS "Users can create their own campaigns" ON campaigns;
DROP POLICY IF EXISTS "Users can update their own campaigns" ON campaigns;
DROP POLICY IF EXISTS "Users can delete their own campaigns" ON campaigns;

-- Create secure RLS policies for campaigns (without NULL user_id access)
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

-- Update the get_dashboard_stats function to only count user's own campaigns
CREATE OR REPLACE FUNCTION public.get_dashboard_stats()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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
    AND user_id = auth.uid(); -- Only show user's own campaigns
    
    RETURN result;
END;
$function$;