import os

migrations = {
    "001_create_users.sql": """CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT UNIQUE,
  email_verified BOOLEAN DEFAULT false,
  phone_verified BOOLEAN DEFAULT false,
  dob DATE,
  gender TEXT CHECK (gender IN ('male','female','non-binary','prefer_not_to_say')),
  vault TEXT,
  avatar_url TEXT,
  gmail_token JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_own_data" ON public.users
  FOR ALL USING (auth.uid() = id);
-- Auto-create user profile on auth signup:
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, email_verified)
  VALUES (NEW.id, NEW.email, NEW.email_confirmed_at IS NOT NULL)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
""",
    "002_create_trips.sql": """CREATE TABLE public.trips (
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
""",
    "003_create_itineraries.sql": """CREATE TABLE public.itineraries (
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
""",
    "004_create_expenses.sql": """CREATE TABLE public.expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  amount NUMERIC(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  description TEXT NOT NULL,
  category TEXT,
  expense_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "expenses_own_data" ON public.expenses
  FOR ALL USING (auth.uid() = user_id);
""",
    "005_create_reservations.sql": """CREATE TABLE public.reservations (
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
""",
    "006_create_zones.sql": """CREATE TABLE public.safety_zones (
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
""",
    "007_create_spots.sql": """CREATE TABLE public.tourist_spots (
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
""",
    "008_create_emergency_contacts.sql": """CREATE TABLE public.emergency_contacts (
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
""",
    "009_create_visited_places.sql": """CREATE TABLE public.visited_places (
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
"""
}

os.makedirs("c:/BWAI2K26-tourists-safety-and-trip-planner-system/guardianGuide/supabase/migrations", exist_ok=True)
for filename, content in migrations.items():
    with open(f"c:/BWAI2K26-tourists-safety-and-trip-planner-system/guardianGuide/supabase/migrations/{filename}", "w") as f:
        f.write(content)

print("Migrations generated successfully.")
