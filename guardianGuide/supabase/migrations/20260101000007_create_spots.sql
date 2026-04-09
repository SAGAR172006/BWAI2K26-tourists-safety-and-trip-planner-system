CREATE TABLE public.tourist_spots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  destination TEXT NOT NULL,
  name TEXT NOT NULL,
  category TEXT CHECK (
    category IN ('food','stay','entertainment','cultural',
                 'art','shopping','nature','other')
  ),
  address TEXT,
  lat NUMERIC(10,7),
  lng NUMERIC(10,7),
  foursquare_id TEXT,
  rating NUMERIC(3,2),
  zone TEXT,
  maps_url TEXT,
  last_updated TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.tourist_spots DISABLE ROW LEVEL SECURITY;
