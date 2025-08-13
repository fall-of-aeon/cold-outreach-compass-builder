-- Fix security vulnerability: Secure chat_messages table based on campaign ownership

-- Drop the existing permissive RLS policy on chat_messages
DROP POLICY IF EXISTS "Allow all operations on chat_messages" ON chat_messages;

-- Create secure RLS policies for chat_messages based on campaign ownership
CREATE POLICY "Users can view chat messages for their own campaigns" 
ON chat_messages 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM campaigns 
    WHERE campaigns.id = chat_messages.campaign_id 
    AND campaigns.user_id = auth.uid()
  )
);

CREATE POLICY "Users can create chat messages for their own campaigns" 
ON chat_messages 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM campaigns 
    WHERE campaigns.id = chat_messages.campaign_id 
    AND campaigns.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update chat messages for their own campaigns" 
ON chat_messages 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM campaigns 
    WHERE campaigns.id = chat_messages.campaign_id 
    AND campaigns.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete chat messages for their own campaigns" 
ON chat_messages 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM campaigns 
    WHERE campaigns.id = chat_messages.campaign_id 
    AND campaigns.user_id = auth.uid()
  )
);

-- Update log_chat_message function to include user verification
CREATE OR REPLACE FUNCTION public.log_chat_message(
  p_campaign_id uuid, 
  p_session_id text, 
  p_message text, 
  p_sender text, 
  p_metadata jsonb DEFAULT '{}'::jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

-- Update get_chat_history function to include user verification
CREATE OR REPLACE FUNCTION public.get_chat_history(p_session_id text)
RETURNS TABLE(
  message_id uuid, 
  sender text, 
  message text, 
  created_at timestamp with time zone, 
  metadata jsonb, 
  message_order integer
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

-- Update update_campaign_session function to include user verification
CREATE OR REPLACE FUNCTION public.update_campaign_session(p_campaign_id uuid, p_session_id text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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