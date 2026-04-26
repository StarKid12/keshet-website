-- Re-enable admin invitation flow.
-- Existing admins pre-approve an email. The owner of that email signs up at
-- /signup and is automatically made an admin via this trigger; the approval
-- entry is consumed. Signups for non-approved emails are rejected at the DB.

CREATE TABLE IF NOT EXISTS public.approved_emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  added_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.approved_emails ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins manage approved_emails" ON public.approved_emails;
CREATE POLICY "Admins manage approved_emails" ON public.approved_emails
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  approved BOOLEAN;
BEGIN
  SELECT EXISTS(
    SELECT 1 FROM public.approved_emails WHERE lower(email) = lower(NEW.email)
  ) INTO approved;

  IF NOT approved THEN
    RAISE EXCEPTION 'Email % is not pre-approved. Ask an existing admin to invite you.', NEW.email;
  END IF;

  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'admin'
  );

  DELETE FROM public.approved_emails WHERE lower(email) = lower(NEW.email);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
