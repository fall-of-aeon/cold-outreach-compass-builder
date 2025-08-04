-- Fix the ambiguous column reference in get_chat_history function
CREATE OR REPLACE FUNCTION public.get_chat_history(p_session_id text)
 RETURNS TABLE(message_id uuid, sender text, message text, created_at timestamp with time zone, metadata jsonb, message_order integer)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    chat_messages.id,
    chat_messages.sender,
    chat_messages.message,
    chat_messages.created_at,
    chat_messages.metadata,
    chat_messages.message_order
  FROM chat_messages 
  WHERE chat_messages.session_id = p_session_id
  ORDER BY chat_messages.message_order ASC, chat_messages.created_at ASC;
END;
$function$