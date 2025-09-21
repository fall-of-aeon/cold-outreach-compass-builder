-- Fix function search path security issue by setting explicit search paths
-- This addresses the Function Search Path Mutable warning

-- Update all database functions to have explicit search_path
CREATE OR REPLACE FUNCTION public.log_chat_message(p_campaign_id uuid, p_session_id text, p_message text, p_sender text, p_metadata jsonb DEFAULT '{}'::jsonb)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_message_id UUID;
  v_next_order INTEGER;
BEGIN
  -- Verify the user owns the campaign
  IF NOT EXISTS (
    SELECT 1 FROM campaigns 
    WHERE id = p_campaign_id 
    AND user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Access denied: User does not own this campaign';
  END IF;

  -- Get next message order for this session
  SELECT COALESCE(MAX(message_order), 0) + 1 
  INTO v_next_order
  FROM chat_messages 
  WHERE session_id = p_session_id;

  -- Insert the message
  INSERT INTO chat_messages (
    campaign_id,
    session_id,
    message,
    sender,
    metadata,
    message_order
  ) VALUES (
    p_campaign_id,
    p_session_id,
    p_message,
    p_sender,
    p_metadata,
    v_next_order
  ) RETURNING id INTO v_message_id;

  RETURN v_message_id;
END;
$function$;

-- Update other functions with explicit search_path
CREATE OR REPLACE FUNCTION public.get_chat_history(p_session_id text)
 RETURNS TABLE(message_id uuid, sender text, message text, created_at timestamp with time zone, metadata jsonb, message_order integer)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Verify the user has access to messages in this session
  IF NOT EXISTS (
    SELECT 1 FROM chat_messages cm
    JOIN campaigns c ON c.id = cm.campaign_id
    WHERE cm.session_id = p_session_id 
    AND c.user_id = auth.uid()
    LIMIT 1
  ) THEN
    RAISE EXCEPTION 'Access denied: User does not have access to this chat session';
  END IF;

  RETURN QUERY
  SELECT 
    chat_messages.id,
    chat_messages.sender,
    chat_messages.message,
    chat_messages.created_at,
    chat_messages.metadata,
    chat_messages.message_order
  FROM chat_messages 
  JOIN campaigns ON campaigns.id = chat_messages.campaign_id
  WHERE chat_messages.session_id = p_session_id
  AND campaigns.user_id = auth.uid()
  ORDER BY chat_messages.message_order ASC, chat_messages.created_at ASC;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_campaign_session(p_campaign_id uuid, p_session_id text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
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
  SET chat_session_id = p_session_id
  WHERE id = p_campaign_id
  AND user_id = auth.uid();
  
  RETURN FOUND;
END;
$function$;

CREATE OR REPLACE FUNCTION public.log_workflow_event(p_campaign_id uuid, p_event_type text, p_step_name text DEFAULT NULL::text, p_message text DEFAULT NULL::text, p_data jsonb DEFAULT NULL::jsonb)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
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

CREATE OR REPLACE FUNCTION public.update_campaign_progress(p_campaign_id uuid, p_step text, p_progress integer, p_data jsonb DEFAULT NULL::jsonb)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
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

CREATE OR REPLACE FUNCTION public.get_dashboard_stats()
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
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

-- Create rate limiting table for edge functions
CREATE TABLE IF NOT EXISTS public.rate_limits (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    identifier TEXT NOT NULL, -- IP address or user ID
    endpoint TEXT NOT NULL,   -- Which endpoint was called
    request_count INTEGER DEFAULT 1,
    window_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for efficient rate limit lookups
CREATE INDEX IF NOT EXISTS idx_rate_limits_identifier_endpoint ON public.rate_limits(identifier, endpoint);
CREATE INDEX IF NOT EXISTS idx_rate_limits_window_start ON public.rate_limits(window_start);

-- Enable RLS on rate_limits table
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- Create policy to allow service role to manage rate limits
CREATE POLICY "Service role can manage rate limits" 
ON public.rate_limits 
FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);

-- Create function to check and update rate limits
CREATE OR REPLACE FUNCTION public.check_rate_limit(
    p_identifier TEXT,
    p_endpoint TEXT,
    p_max_requests INTEGER DEFAULT 100,
    p_window_minutes INTEGER DEFAULT 60
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
    current_count INTEGER;
    window_start TIMESTAMP WITH TIME ZONE;
BEGIN
    window_start := NOW() - (p_window_minutes || ' minutes')::INTERVAL;
    
    -- Clean up old rate limit records
    DELETE FROM rate_limits 
    WHERE window_start < NOW() - '24 hours'::INTERVAL;
    
    -- Get current count for this identifier/endpoint in the time window
    SELECT COALESCE(SUM(request_count), 0) INTO current_count
    FROM rate_limits
    WHERE identifier = p_identifier
    AND endpoint = p_endpoint
    AND window_start > (NOW() - (p_window_minutes || ' minutes')::INTERVAL);
    
    -- If limit exceeded, return false
    IF current_count >= p_max_requests THEN
        RETURN FALSE;
    END IF;
    
    -- Otherwise, record this request
    INSERT INTO rate_limits (identifier, endpoint, request_count, window_start)
    VALUES (p_identifier, p_endpoint, 1, NOW())
    ON CONFLICT (identifier, endpoint) 
    DO UPDATE SET 
        request_count = rate_limits.request_count + 1,
        updated_at = NOW();
    
    RETURN TRUE;
END;
$function$;