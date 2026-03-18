-- Safe function to look up chat sender names without self-referencing RLS on profiles.
-- Uses SECURITY DEFINER to bypass RLS and return only safe public info (name + avatar).
CREATE OR REPLACE FUNCTION get_profile_display(user_id UUID)
RETURNS TABLE(full_name TEXT, avatar_url TEXT)
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT p.full_name, p.avatar_url
  FROM profiles p
  WHERE p.id = user_id;
$$;
