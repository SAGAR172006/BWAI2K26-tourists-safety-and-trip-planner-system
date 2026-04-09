CREATE TABLE public.itineraries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  content JSONB NOT NULL DEFAULT '{}',
  alternatives JSONB DEFAULT '[]',
  total_budget NUMERIC(12,2),
  currency TEXT DEFAULT 'USD',
  confirmed BOOLEAN DEFAULT false,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.itineraries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "itineraries_own_data" ON public.itineraries
  FOR ALL USING (auth.uid() = user_id);
