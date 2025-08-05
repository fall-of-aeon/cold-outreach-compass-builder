-- Delete campaigns with null chat_session_id values
DELETE FROM campaigns WHERE chat_session_id IS NULL;