CREATE TABLE public.trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'New Trip',
  destination TEXT,
  destination_id TEXT,
  status TEXT DEFAULT 'idle'
    CHECK (status IN ('idle','planning','active','completed')),
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, name)
);
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
CREATE POLICY "trips_own_data" ON public.trips
  FOR ALL USING (auth.uid() = user_id);
