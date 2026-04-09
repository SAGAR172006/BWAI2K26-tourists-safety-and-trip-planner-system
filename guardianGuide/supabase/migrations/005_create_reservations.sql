CREATE TABLE public.reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL
    CHECK (type IN ('flight','train','bus','hotel','dorm','other')),
  source TEXT DEFAULT 'manual'
    CHECK (source IN ('manual','gmail','ai')),
  details JSONB NOT NULL DEFAULT '{}',
  confirmation_number TEXT,
  check_in DATE,
  check_out DATE,
  amount NUMERIC(10,2),
  currency TEXT DEFAULT 'USD',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE NULLS NOT DISTINCT (user_id, confirmation_number)
);
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "reservations_own_data" ON public.reservations
  FOR ALL USING (auth.uid() = user_id);
