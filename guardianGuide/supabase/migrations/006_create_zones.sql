CREATE TABLE public.safety_zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location_hash TEXT NOT NULL UNIQUE,
  destination TEXT NOT NULL,
  geojson JSONB NOT NULL DEFAULT '{}',
  score NUMERIC(3,2),
  zone TEXT CHECK (zone IN ('GREEN','WHITE','RED')),
  venue_score NUMERIC(3,2),
  social_score NUMERIC(3,2),
  sample_size INTEGER DEFAULT 0,
  last_updated TIMESTAMPTZ DEFAULT NOW()
);
-- Public read (no auth needed for map display)
ALTER TABLE public.safety_zones DISABLE ROW LEVEL SECURITY;
