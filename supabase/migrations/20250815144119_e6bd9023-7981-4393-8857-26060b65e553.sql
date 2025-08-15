-- Fix critical security vulnerabilities in workflow_events and dashboard_cache tables

-- 1. Secure workflow_events table
-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Allow all operations on workflow_events" ON workflow_events;

-- Create restrictive RLS policies for workflow_events
CREATE POLICY "Users can view workflow events for their own campaigns" 
ON workflow_events 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM campaigns 
    WHERE campaigns.id = workflow_events.campaign_id 
    AND campaigns.user_id = auth.uid()
  )
);

CREATE POLICY "Users can create workflow events for their own campaigns" 
ON workflow_events 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM campaigns 
    WHERE campaigns.id = workflow_events.campaign_id 
    AND campaigns.user_id = auth.uid()
  )
);

-- 2. Secure dashboard_cache table
-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Allow all operations on dashboard_cache" ON dashboard_cache;

-- Add user_id column to dashboard_cache for proper user isolation
ALTER TABLE dashboard_cache ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create user-specific RLS policies for dashboard_cache
CREATE POLICY "Users can view their own cache data" 
ON dashboard_cache 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own cache data" 
ON dashboard_cache 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cache data" 
ON dashboard_cache 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cache data" 
ON dashboard_cache 
FOR DELETE 
USING (auth.uid() = user_id);

-- 3. Update log_workflow_event function with proper authorization
CREATE OR REPLACE FUNCTION public.log_workflow_event(p_campaign_id uuid, p_event_type text, p_step_name text DEFAULT NULL::text, p_message text DEFAULT NULL::text, p_data jsonb DEFAULT NULL::jsonb)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
    event_id UUID;
BEGIN
    -- Verify the user owns the campaign
    IF NOT EXISTS (
        SELECT 1 FROM campaigns 
        WHERE id = p_campaign_id 
        AND user_id = auth.uid()
    ) THEN
        RAISE EXCEPTION 'Access denied: User does not own this campaign';
    END IF;

    INSERT INTO workflow_events (campaign_id, event_type, step_name, message, data)
    VALUES (p_campaign_id, p_event_type, p_step_name, p_message, p_data)
    RETURNING id INTO event_id;
    
    RETURN event_id;
END;
$function$;

-- 4. Update other database functions with proper search_path
CREATE OR REPLACE FUNCTION public.update_campaign_progress(p_campaign_id uuid, p_step text, p_progress integer, p_data jsonb DEFAULT NULL::jsonb)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
    -- Verify the user owns the campaign
    IF NOT EXISTS (
        SELECT 1 FROM campaigns 
        WHERE id = p_campaign_id 
        AND user_id = auth.uid()
    ) THEN
        RAISE EXCEPTION 'Access denied: User does not own this campaign';
    END IF;

    UPDATE campaigns 
    SET 
        workflow_step = p_step,
        workflow_progress = p_progress,
        updated_at = NOW()
    WHERE id = p_campaign_id
    AND user_id = auth.uid();
    
    -- Log the progress event
    PERFORM log_workflow_event(p_campaign_id, 'step_progress', p_step, 
        format('Progress: %s%% - %s', p_progress, p_step), p_data);
END;
$function$;