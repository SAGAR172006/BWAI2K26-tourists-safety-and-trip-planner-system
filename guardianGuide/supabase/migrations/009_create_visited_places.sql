CREATE TABLE public.visited_places (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  spot_id UUID REFERENCES public.tourist_spots(id),
  name TEXT NOT NULL,
  category TEXT,
  visited_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.visited_places ENABLE ROW LEVEL SECURITY;
CREATE POLICY "visited_own_data" ON public.visited_places
  FOR ALL USING (auth.uid() = user_id);
