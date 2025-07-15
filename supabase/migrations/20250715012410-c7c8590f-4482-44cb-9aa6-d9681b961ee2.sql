
-- 1. Add chat_session_id to campaigns table
ALTER TABLE campaigns 
ADD COLUMN chat_session_id TEXT UNIQUE;

-- 2. Create enhanced chat_messages table
CREATE TABLE public.chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  message TEXT NOT NULL CHECK (char_length(message) <= 10000),
  sender TEXT NOT NULL CHECK (sender IN ('user', 'assistant')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  metadata JSONB DEFAULT '{}',
  message_order INTEGER NOT NULL DEFAULT 0
);

-- 3. Create optimized indexes
CREATE INDEX idx_chat_messages_session_order ON chat_messages(session_id, message_order);
CREATE INDEX idx_chat_messages_campaign_recent ON chat_messages(campaign_id, created_at DESC);
CREATE INDEX idx_chat_messages_created_at ON chat_messages(created_at);

-- 4. Enable RLS
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- 5. Create proper RLS policy (using public access for now since campaigns don't have user_id)
CREATE POLICY "Allow all operations on chat_messages" 
  ON public.chat_messages 
  FOR ALL 
  USING (true);

-- 6. Add helpful function for chat history
CREATE OR REPLACE FUNCTION get_chat_history(p_session_id TEXT)
RETURNS TABLE (
  message_id UUID,
  sender TEXT,
  message TEXT,
  created_at TIMESTAMPTZ,
  metadata JSONB,
  message_order INTEGER
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    id,
    sender,
    message,
    created_at,
    metadata,
    message_order
  FROM chat_messages 
  WHERE session_id = p_session_id
  ORDER BY message_order ASC, created_at ASC;
END;
$$;

-- 7. Add function to log chat messages
CREATE OR REPLACE FUNCTION log_chat_message(
  p_campaign_id UUID,
  p_session_id TEXT,
  p_message TEXT,
  p_sender TEXT,
  p_metadata JSONB DEFAULT '{}'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_message_id UUID;
  v_next_order INTEGER;
BEGIN
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
$$;

-- 8. Update campaigns table with session when chat starts
CREATE OR REPLACE FUNCTION update_campaign_session(
  p_campaign_id UUID,
  p_session_id TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE campaigns 
  SET chat_session_id = p_session_id
  WHERE id = p_campaign_id;
  
  RETURN FOUND;
END;
$$;
