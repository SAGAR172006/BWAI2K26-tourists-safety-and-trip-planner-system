CREATE TABLE public.emergency_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  sort_order INTEGER DEFAULT 1 CHECK (sort_order BETWEEN 1 AND 3),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.emergency_contacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "emergency_contacts_own_data" ON public.emergency_contacts
  FOR ALL USING (auth.uid() = user_id);
-- Enforce max 3 contacts per user:
CREATE OR REPLACE FUNCTION check_emergency_contact_limit()
RETURNS TRIGGER AS $$
BEGIN
  IF (SELECT COUNT(*) FROM public.emergency_contacts
      WHERE user_id = NEW.user_id) >= 3 THEN
    RAISE EXCEPTION 'Maximum 3 emergency contacts allowed';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER enforce_contact_limit
  BEFORE INSERT ON public.emergency_contacts
  FOR EACH ROW EXECUTE FUNCTION check_emergency_contact_limit();
