# ============================================================
# GUARDIANGU IDE — COMPLETE AI IDE AUTOPILOT PROMPTS (UPDATED)
# ============================================================
# ALL DECISIONS BAKED IN — no cross-referencing other files needed
#
# STACK (FINAL — 100% FREE, NO BILLING):
#   LLM:        Gemini 2.0 Flash (Google AI Studio — free)
#   Maps:       Leaflet + OpenStreetMap (free)
#   Places:     Foursquare API v3 (free tier, 1000/day)
#   Images:     Unsplash API (free, 50/hr) + static Unsplash URLs
#   Sentiment:  HuggingFace Inference API (free)
#   Social:     DuckDuckGo + Serper + Wikipedia (free/2500mo)
#   Emergency:  Overpass API / OpenStreetMap (free, no key)
#   Geocoding:  Nominatim / OpenStreetMap (free, no key)
#   Email:      Resend (onboarding@resend.dev — free)
#   SMS:        Twilio (trial $15 credit)
#   Auth:       Supabase + Google OAuth (free)
#   DB:         Supabase PostgreSQL (free tier)
#   Cache:      Redis via Docker (free)
#   Vector DB:  ChromaDB via Docker (free)
#   Tracing:    LangSmith (free developer plan)
#   Deployment: Vercel (frontend, free) + Google Cloud Run (backend, free tier)
#
# REMOVED (required billing):
#   ❌ OpenAI          → replaced with Gemini 2.0 Flash
#   ❌ Google Places   → replaced with Foursquare + Nominatim
#   ❌ Stable Diffusion/Replicate → replaced with Unsplash
#   ❌ Reddit API      → replaced with DuckDuckGo + Serper + Wikipedia
#
# HOW TO USE:
#   Open Cursor/Windsurf/Copilot → paste ONE prompt at a time
#   Wait for generation → review → paste next prompt
#   Order matters — do NOT skip steps
#
# PASTE THIS BEFORE EVERY NEW SESSION:
#   "I am building GuardianGuide — a tourist safety + AI trip planning web app.
#    Stack: Next.js 14 App Router, TypeScript, Tailwind, Supabase, FastAPI Python,
#    Zustand, Leaflet.js, LangGraph, Gemini 2.0 Flash, Foursquare, Unsplash.
#    All docs are in /docs. Follow design.md for UI, tech.md for stack decisions."
# ============================================================


# ============================================================
# PROMPT 0 — PROJECT INITIALIZATION
# ============================================================

"""
TASK: Initialize the complete GuardianGuide project structure.

1. Initialize Next.js frontend:
   npx create-next-app@latest frontend --typescript --tailwind --app --src-dir=false --import-alias="@/*" --no-git

2. Install all frontend dependencies:
   cd frontend && npm install zustand framer-motion react-leaflet leaflet @types/leaflet react-hook-form zod lucide-react react-day-picker @supabase/supabase-js @supabase/ssr date-fns libphonenumber-js

3. Create backend/requirements.txt with:
   fastapi==0.115.0
   uvicorn==0.30.0
   python-dotenv==1.0.0
   pydantic-settings==2.4.0
   supabase==2.7.0
   langchain==0.3.0
   langchain-google-genai==2.0.0
   langgraph==0.2.0
   langsmith==0.1.0
   transformers==4.44.0
   torch==2.4.0
   chromadb==0.5.0
   sentence-transformers==3.0.0
   redis==5.0.0
   duckduckgo-search==6.2.0
   wikipedia==1.4.0
   google-api-python-client==2.140.0
   google-auth-oauthlib==1.2.0
   twilio==9.2.0
   resend==2.0.0
   pillow==10.4.0
   pytesseract==0.3.13
   httpx==0.27.0
   praw==7.7.0
   ragas==0.1.0
   asyncio==3.4.3

4. Create backend/app/__init__.py (empty)

5. Create backend/app/main.py:
   FastAPI app with CORSMiddleware allowing localhost:3000.
   Include placeholder routers. Add /health endpoint returning
   {"status": "ok", "timestamp": current ISO datetime}

6. Create backend/app/config.py using pydantic BaseSettings:
   Load from backend/.env file. Include ALL these variables:
   SUPABASE_URL, SUPABASE_SERVICE_KEY,
   GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET,
   GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REDIRECT_URI,
   GOOGLE_GENERATIVE_AI_API_KEY, LLM_MODEL="gemini-2.0-flash",
   LLM_FALLBACK_MODEL="gemini-1.5-pro",
   FOURSQUARE_API_KEY, UNSPLASH_ACCESS_KEY, SERPER_API_KEY,
   HUGGINGFACE_API_KEY, TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN,
   TWILIO_PHONE_NUMBER, RESEND_API_KEY,
   FROM_EMAIL="onboarding@resend.dev",
   REDIS_URL="redis://localhost:6379",
   LANGSMITH_API_KEY, LANGSMITH_PROJECT="guardianGuide-dev",
   LANGCHAIN_TRACING_V2="true",
   CHROMA_HOST="localhost", CHROMA_PORT=8001,
   NOMINATIM_USER_AGENT="GuardianGuide/1.0",
   APP_ENV="development", ALLOWED_ORIGINS="http://localhost:3000",
   SECRET_KEY, RATE_LIMIT_AI_RPM=2, RATE_LIMIT_GENERAL_RPM=10
   Export: settings = Settings()

7. Create docker-compose.yml in project root:
   Services: redis (redis:7-alpine on port 6379),
   chromadb (chromadb/chroma on port 8001)
   Note: Supabase is hosted — not in docker-compose.

8. Create .gitignore:
   node_modules, .env, .env.local, __pycache__, .next,
   dist, *.pyc, .DS_Store, vector_index/, *.egg-info

9. Create all blank backend folders with __init__.py:
   backend/app/api/
   backend/app/services/planner/
   backend/app/services/sentiment/
   backend/app/services/rag/
   backend/app/services/image_gen/
   backend/app/services/translation/
   backend/app/services/gmail/
   backend/app/middleware/
   backend/app/cache/
   backend/app/models/
   backend/app/evaluation/
   backend/app/evaluation/test_datasets/
   backend/tests/
   backend/data/crime_reports/   (with .gitkeep)
   backend/data/vector_index/    (with .gitkeep)

Verify: cd backend && python -m py_compile app/main.py && echo OK
"""


# ============================================================
# PROMPT 1 — SUPABASE DATABASE MIGRATIONS
# ============================================================

"""
TASK: Create all Supabase SQL migration files in supabase/migrations/.
Each file must have complete SQL with RLS policies.

FILE: 001_create_users.sql
CREATE TABLE public.users (
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

FILE: 002_create_trips.sql
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

FILE: 003_create_itineraries.sql
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

FILE: 004_create_expenses.sql
CREATE TABLE public.expenses (
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

FILE: 005_create_reservations.sql
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

FILE: 006_create_zones.sql
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

FILE: 007_create_spots.sql
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

FILE: 008_create_emergency_contacts.sql
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

FILE: 009_create_visited_places.sql
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

FILE: supabase/seed.sql
-- Sample safety zones for Paris
INSERT INTO public.safety_zones
  (location_hash, destination, geojson, score, zone, venue_score, social_score, sample_size)
VALUES
  ('paris_centre', 'Paris 1st Arrondissement',
   '{"type":"FeatureCollection","features":[]}', 3.8, 'GREEN', 4.0, 3.5, 45),
  ('paris_north', 'Paris 18th Arrondissement',
   '{"type":"FeatureCollection","features":[]}', 2.3, 'WHITE', 2.5, 2.0, 30),
  ('paris_suburb', 'Paris Banlieue Nord',
   '{"type":"FeatureCollection","features":[]}', 1.7, 'RED', 1.5, 2.0, 20);
"""


# ============================================================
# PROMPT 2 — FASTAPI BACKEND FOUNDATION
# ============================================================

"""
TASK: Build complete FastAPI backend foundation files.

FILE: backend/app/cache/redis_client.py
Async Redis client using redis.asyncio.
Connect from settings.REDIS_URL.
Class RedisClient with methods:
  async get(key: str) -> str | None
  async set(key: str, value: str, ttl: int = None) -> None
  async delete(key: str) -> None
  async exists(key: str) -> bool
  async incr(key: str) -> int
  async expire(key: str, ttl: int) -> None
Handle ConnectionError gracefully — log warning, return None on get.
Export singleton: redis_client = RedisClient()

FILE: backend/app/middleware/auth_guard.py
FastAPI dependency: get_current_user
Extract Bearer token from Authorization header.
Verify with: supabase.auth.get_user(token) using SUPABASE_SERVICE_KEY.
Return dict {id: str, email: str} on success.
Raise HTTPException(401) on failure.
Note: initialize supabase client inside the function using service key.

FILE: backend/app/middleware/rate_limiter.py
Class RateLimiter(max_calls: int, period_seconds: int):
  __call__ is a FastAPI dependency
  Gets user from auth header (optional — fall back to IP if no auth)
  Redis key: "rl:{identifier}:{path}"
  Pattern: INCR key, set EXPIRE on first call (sliding window approx)
  Raise HTTPException(429, detail="Rate limit exceeded. Retry in {period}s")
  Include Retry-After header in 429 response

Module-level instances:
  ai_limiter = RateLimiter(max_calls=2, period_seconds=60)
  general_limiter = RateLimiter(max_calls=10, period_seconds=60)

FILE: backend/app/middleware/pii_redactor.py
Function: redact_pii(text: str) -> str
Use regex to replace:
  Emails: r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}' → [EMAIL]
  Phones: r'[\+]?[(]?[0-9]{1,4}[)]?[-\s\./0-9]{8,14}' → [PHONE]
  Credit cards: r'\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b' → [CARD]
Return cleaned text. Never raise — return original if regex fails.

FILE: backend/app/models/planner_models.py
Pydantic models (using pydantic v2):
  PlannerRequest:
    from_location: str
    to_location: str
    start_date: date
    end_date: date
    budget: float (gt=0)
    currency: str = "USD"
    expectations: str = "" (max_length=500)

  StrikeResponse:
    status: Literal["strike1", "strike2"]
    strike_count: int
    min_budget: float
    message: str
    currency: str

  ItineraryActivity:
    time_of_day: str
    name: str
    description: str
    location: str
    estimated_cost: float
    category: str
    tags: list[str] = []
    maps_url: str = ""

  ItineraryDay:
    day: int
    date: str
    activities: list[ItineraryActivity]

  ItineraryOutput:
    title: str
    days: list[ItineraryDay]
    total_estimated_cost: float
    currency: str
    summary: str

  PlannerResponse:
    status: Literal["success", "strike1", "strike2"]
    itinerary: ItineraryOutput | None = None
    alternatives: list[ItineraryOutput] = []
    session_id: str | None = None
    min_budget: float | None = None
    message: str = ""

  ChatRequest:
    session_id: str
    message: str

  ChatResponse:
    response: str
    suggested_action: str | None = None
    updated_itinerary: ItineraryOutput | None = None

FILE: backend/app/models/zone_models.py
  class ZoneType(str, Enum):
    GREEN = "GREEN"
    WHITE = "WHITE"
    RED = "RED"

  class GeoJSONGeometry(BaseModel):
    type: str
    coordinates: Any

  class ZoneProperties(BaseModel):
    neighborhood: str
    score: float
    zone: ZoneType
    venue_score: float
    social_score: float
    confidence: float
    sample_size: int
    fillColor: str
    fillOpacity: float
    color: str
    weight: int
    opacity: float
    label: str

  class ZoneFeature(BaseModel):
    type: str = "Feature"
    geometry: GeoJSONGeometry
    properties: ZoneProperties

  class ZoneFeatureCollection(BaseModel):
    type: str = "FeatureCollection"
    features: list[ZoneFeature]

FILE: backend/app/models/translate_models.py
  class TranslateTextRequest(BaseModel):
    text: str (max_length=2000)
    source_lang: str = "auto"
    target_lang: str

  class TranslateTextResponse(BaseModel):
    translated_text: str
    source_lang: str
    target_lang: str

  class TranslateImageResponse(BaseModel):
    original_text: str
    translated_text: str
    target_lang: str

FILE: backend/app/main.py (complete version replacing the placeholder):
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.config import settings
from app.cache.redis_client import redis_client
import datetime

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    try:
        await redis_client.set("health_check", "ok", ttl=10)
        print("✅ Redis connected")
    except Exception as e:
        print(f"⚠️  Redis not available: {e}")
    print("🛡️  GuardianGuide API ready")
    yield
    # Shutdown (nothing needed)

app = FastAPI(title="GuardianGuide API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Import and include all routers
from app.api import zones, planner, sentiment, translate, image_gen, gmail_sync, sos
app.include_router(zones.router, prefix="/api/v1")
app.include_router(planner.router, prefix="/api/v1")
app.include_router(sentiment.router, prefix="/api/v1")
app.include_router(translate.router, prefix="/api/v1")
app.include_router(image_gen.router, prefix="/api/v1")
app.include_router(gmail_sync.router, prefix="/api/v1")
app.include_router(sos.router, prefix="/api/v1")

@app.get("/api/v1/health")
async def health():
    redis_ok = await redis_client.exists("health_check")
    return {
        "status": "ok",
        "redis": "connected" if redis_ok else "disconnected",
        "timestamp": datetime.datetime.utcnow().isoformat()
    }

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    from fastapi.responses import JSONResponse
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error", "type": type(exc).__name__}
    )

Verify: cd backend && uvicorn app.main:app --reload --port 8000
Expected: Server starts, GET /api/v1/health returns 200 with redis status
"""


# ============================================================
# PROMPT 3 — FRONTEND FOUNDATION + AUTH SCREENS
# ============================================================

"""
TASK: Build Next.js foundation and complete authentication system.
Read design.md for all colors, fonts, spacing before writing any code.

FILE: frontend/app/globals.css
@import 'leaflet/dist/leaflet.css';
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=DM+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

:root {
  --color-bg-primary: #0A0A0F;
  --color-bg-secondary: #111118;
  --color-bg-elevated: #1A1A24;
  --color-border: #2A2A3A;
  --color-border-strong: #3A3A50;
  --color-text-primary: #F0F0F8;
  --color-text-secondary: #8888A8;
  --color-text-muted: #4A4A6A;
  --color-accent: #6C63FF;
  --color-accent-hover: #7C73FF;
  --color-accent-dim: rgba(108,99,255,0.13);
  --color-zone-green: #22c55e;
  --color-zone-green-bg: rgba(34,197,94,0.10);
  --color-zone-red: #ef4444;
  --color-zone-red-bg: rgba(239,68,68,0.10);
  --color-zone-white: #e2e8f0;
  --color-zone-white-bg: rgba(226,232,240,0.06);
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  --color-info: #3b82f6;
  --color-sos-bg: #0D0000;
  --color-sos-primary: #FF1A1A;
  --color-sos-pulse: #FF4444;
  --color-sos-text: #FFE0E0;
  --font-display: 'Sora', sans-serif;
  --font-body: 'DM Sans', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}

* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
  font-family: var(--font-body);
}
.glass {
  background: rgba(17,17,24,0.72);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255,255,255,0.08);
  box-shadow: 0 8px 32px rgba(0,0,0,0.48);
}
.sos-theme {
  --color-bg-primary: #0D0000;
  background: var(--color-bg-primary) !important;
}
::-webkit-scrollbar { width: 4px; height: 4px; }
::-webkit-scrollbar-track { background: var(--color-bg-secondary); }
::-webkit-scrollbar-thumb { background: var(--color-accent); border-radius: 2px; }

FILE: frontend/app/layout.tsx
Root layout. Import DM Sans + Sora + JetBrains Mono from Google Fonts.
Set metadata. Background color: var(--color-bg-primary).
Wrap in Supabase session provider.

FILE: frontend/lib/supabaseClient.ts
Browser client using createBrowserClient from @supabase/ssr.
Export singleton.

FILE: frontend/lib/supabaseServer.ts
Server client using createServerClient from @supabase/ssr.
Use cookies() from next/headers.

FILE: frontend/middleware.ts
Protect all /app/* routes.
Check: session exists.
Check from public.users: phone_verified=true AND email_verified=true AND first_name IS NOT NULL.
If any missing: redirect to /auth/complete-profile.
If no session: redirect to /auth/login.
Public routes allowed: /auth/*, /api/*, /

FILE: frontend/store/authStore.ts
Zustand. Fields: user, profile, isLoading.
Actions: setUser, setProfile, signOut (calls supabase.auth.signOut).

FILE: frontend/store/tripStore.ts
Zustand. Fields: trips[], activeTripId, isDirectoryOpen.
Actions: setTrips, setActiveTrip, addTrip, deleteTrip, toggleDirectory.
fetchTrips(userId): loads from Supabase trips table ordered by created_at.

FILE: frontend/store/uiStore.ts
Zustand. Fields: isPanelOpen, isLoading, loadingMessage.
Actions: openPanel, closePanel, setLoading.

FILE: frontend/app/(auth)/layout.tsx
Full-screen centered layout, no nav.
Background: radial-gradient(ellipse at center, #1A1A2E 0%, #0A0A0F 70%).
GuardianGuide logo (inline SVG shield) centered at top.

LOGO COMPONENT (use inline in auth layout and TopBar):
const GuardianLogo = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <path d="M14 2L3 7v8c0 6.08 4.72 11.76 11 13 6.28-1.24 11-6.92 11-13V7L14 2z"
      fill="var(--color-accent)" fillOpacity="0.2"
      stroke="var(--color-accent)" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M9 14l3.5 3.5L19 10"
      stroke="var(--color-accent)" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

FILE: frontend/app/(auth)/login/page.tsx
Two options: Google OAuth button + Phone toggle.
Google button: calls supabase.auth.signInWithOAuth({provider:'google',
  options:{redirectTo: window.location.origin + '/auth/callback',
  scopes:'email profile'}})
Phone toggle: reveals PhoneInput.
Design: card max-w-[420px], bg-[var(--color-bg-secondary)],
border border-[var(--color-border)], rounded-2xl, p-8.

FILE: frontend/components/auth/PhoneInput.tsx
Country code selector: searchable dropdown with flag emoji + dial code.
Hardcode top 20 countries + common ones. Use libphonenumber-js to validate.
Submit calls: supabase.auth.signInWithOtp({phone: fullNumber})
On success: router.push('/auth/verify-otp?phone=' + encodeURIComponent(fullNumber))

FILE: frontend/app/(auth)/verify-otp/page.tsx
6 individual input boxes. Auto-focus next on entry. Auto-submit when full.
Resend button (disabled 30s). Show phone number being verified.
Call: supabase.auth.verifyOtp({phone, token: otp, type:'sms'})
On success: router.push('/auth/complete-profile')

FILE: frontend/app/(auth)/verify-email/page.tsx
"Check your inbox" screen. Show masked email.
Poll supabase.auth.getSession every 3 seconds.
When session shows email_confirmed_at: router.push('/app/home')
Resend button calls: supabase.auth.resend({type:'signup', email})

FILE: frontend/app/(auth)/complete-profile/page.tsx
Read session to determine what's missing.
If Google login (email present, no phone):
  Show: First Name + Last Name + PhoneInput
If Phone login (phone present, no email):
  Show: First Name + Last Name + Email input
On submit: UPDATE public.users, then send verification.
Step indicator: 4 dots at top.

FILE: frontend/app/auth/callback/route.ts (Next.js route handler)
Handle OAuth callback from Supabase.
Exchange code for session: supabase.auth.exchangeCodeForSession(code)
Redirect to /auth/complete-profile.

Test complete flow both ways before moving on.
"""


# ============================================================
# PROMPT 4 — TOPBAR + SIDE PANEL + TRIP DIRECTORY
# ============================================================

"""
TASK: Build the app shell visible on every /app/* screen.

FILE: frontend/app/(app)/layout.tsx
Import TopBar, SidePanel, SidePanelOverlay.
Main content: pt-16 (below 64px TopBar), min-h-screen bg-[var(--color-bg-primary)].

FILE: frontend/components/layout/TopBar.tsx
Fixed top bar. Height 64px. z-50.
bg-[var(--color-bg-primary)]/80 backdrop-blur-md border-b border-[var(--color-border)].
Layout:
  LEFT (w-48): GuardianLogo SVG + "GuardianGuide" text (font-display text-lg font-semibold)
  CENTER (flex-1): TripDirectory
  RIGHT (w-48 justify-end): 3-bar menu button (AlignJustify icon, 40×40 rounded-full
    hover:bg-[var(--color-bg-elevated)])
  On mobile (md:hidden): hide TripDirectory in TopBar

FILE: frontend/components/layout/TripDirectory.tsx
File-system style breadcrumb in TopBar center.
"TRIPS/" always shown in text-[var(--color-text-muted)] text-sm font-mono.
Active trip name in text-[var(--color-text-primary)] text-sm font-medium.
Clicking "TRIPS/" opens dropdown showing all trips.
Dropdown item: trip name (left) + trash icon (right) to delete trip.
Last item always: "+ Create a TRIP" in text-[var(--color-accent)].
Creating trip: POST /api/trips, add to tripStore, navigate to /app/home/[id].
Trip name auto-generation: "New Trip 1", "New Trip 2" etc.
Max width 400px, overflow hidden with ellipsis.

FILE: frontend/components/layout/SidePanel.tsx
Fixed right panel, width 320px, full height, z-100.
Apply .glass class (from globals.css).
Framer Motion: AnimatePresence + motion.div:
  initial={{x: '100%', opacity: 0}}
  animate={{x: 0, opacity: 1}}
  exit={{x: '100%', opacity: 0}}
  transition={{type:'spring', damping:25, stiffness:200}}
Content top to bottom:
  - "MENU" label (text-caption text-[var(--color-text-muted)] mb-4)
  - Nav items (each flex items-center gap-3 px-4 py-3 rounded-xl
    hover:bg-[var(--color-bg-elevated)] cursor-pointer):
    HOME (Home icon) → /app/home or /app/home/[activeTripId]
    TRIP PLANNER (Map icon) → /app/planner/[activeTripId]
    ITINERARY (ListChecks icon) → /app/itinerary/[activeTripId]
    SOS (AlertTriangle in text-[var(--color-sos-primary)]) → /app/sos
  - flex-1 spacer
  - USER section bottom: CircleUser icon + full name + "View Profile"
    → /app/user. Avatar if available from authStore.

FILE: frontend/components/layout/SidePanelOverlay.tsx
Fixed full-screen. bg-black/40 backdrop-blur-sm.
z-[99]. onClick closes panel.
AnimatePresence + motion.div opacity 0→1.

FILE: frontend/components/ui/Button.tsx
Variants: primary, secondary, danger, ghost, icon.
Sizes: sm, md, lg.
Use CVA (class-variance-authority) or manual className merging.
primary: bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)]
secondary: border border-[var(--color-border-strong)] hover:border-[var(--color-accent)]
All: rounded-xl font-medium transition-all duration-150.

FILE: frontend/components/ui/Card.tsx
Base card: bg-[var(--color-bg-secondary)] border border-[var(--color-border)]
rounded-xl p-4 or p-6. Accept className prop.

FILE: frontend/components/ui/Badge.tsx
Hashtag badge: bg-[var(--color-accent-dim)] text-[var(--color-accent)]
text-xs px-2 py-0.5 rounded-full font-mono. Shows text like "#Cultural".
"""


# ============================================================
# PROMPT 5 — HOME SCREEN: IDLE STATE
# ============================================================

"""
TASK: Build the Idle Home Screen — shown when no trip is active.

FILE: frontend/app/(app)/home/page.tsx
If tripStore.activeTripId exists: redirect to /app/home/[activeTripId].
Otherwise render IdleHomeScreen.

FILE: frontend/components/home/idle/IdleHomeScreen.tsx
Full viewport layout: calc(100vh - 64px).
Structure: SearchBar centered at top, DestinationSlideshow filling middle,
WaitingSection below the fold.

FILE: frontend/components/home/idle/SearchBar.tsx
Pill-shaped: min-w-[480px] max-w-[600px] w-full mx-auto.
bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-full.
Left: MapPin icon in text-[var(--color-text-muted)].
Input: placeholder "Where to?" no border, bg-transparent, text-[var(--color-text-primary)].
Right: dark search button rounded-full bg-[var(--color-accent)] px-4 py-2.
Debounce 300ms → GET /api/v1/destinations?q={query}.
Dropdown: absolute positioned list below, bg-[var(--color-bg-elevated)],
  each item: flag emoji + city name + country.
On select: router.push('/app/destination/' + id).

FILE: frontend/components/home/idle/DestinationSlideshow.tsx
Hardcode this exact array:
const DESTINATIONS = [
  { id:"paris", name:"Paris", country:"France", emoji:"🇫🇷",
    summary:"The City of Light — iconic architecture, world-class cuisine, and timeless romance.",
    image:"https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&auto=format&fit=crop" },
  { id:"tokyo", name:"Tokyo", country:"Japan", emoji:"🇯🇵",
    summary:"Where ancient temples meet neon-lit streets — a sensory overload in the best way.",
    image:"https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&auto=format&fit=crop" },
  { id:"bali", name:"Bali", country:"Indonesia", emoji:"🇮🇩",
    summary:"Island of the Gods — lush rice terraces, sacred temples, and world-class surf.",
    image:"https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&auto=format&fit=crop" },
  { id:"new-york", name:"New York", country:"USA", emoji:"🇺🇸",
    summary:"The city that never sleeps — endless energy, culture, and skyline magic.",
    image:"https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&auto=format&fit=crop" },
  { id:"istanbul", name:"Istanbul", country:"Turkey", emoji:"🇹🇷",
    summary:"Where East meets West — bazaars, Bosphorus views, and layers of civilization.",
    image:"https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&auto=format&fit=crop" },
  { id:"santorini", name:"Santorini", country:"Greece", emoji:"🇬🇷",
    summary:"Dramatic caldera views, whitewashed villages, and endless Aegean sunsets.",
    image:"https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800&auto=format&fit=crop" },
  { id:"kyoto", name:"Kyoto", country:"Japan", emoji:"🇯🇵",
    summary:"Japan's cultural soul — geisha districts, bamboo groves, and 1600 temples.",
    image:"https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&auto=format&fit=crop" },
  { id:"dubai", name:"Dubai", country:"UAE", emoji:"🇦🇪",
    summary:"Futuristic skyline rising from desert — luxury, ambition, and spectacle.",
    image:"https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&auto=format&fit=crop" },
]

Layout: LEFT 40% = DestinationCard, RIGHT 60% = DestinationText.
AnimatePresence for both. Auto-advance every 4 seconds.
Card animation: exit translateX(-100%) opacity 0 in 400ms,
  enter from translateX(100%) → 0 opacity 1 in 400ms.
Text animation: 500ms delay after card starts.
  exit: translateY(-20px) opacity 0 in 300ms.
  enter: translateY(20px) → 0 opacity 1 in 300ms.
Infinite loop: index = (current + 1) % DESTINATIONS.length.

FILE: frontend/components/home/idle/DestinationCard.tsx
Aspect ratio 4:3. rounded-2xl overflow-hidden.
Next.js Image component with fill + object-cover.
Bottom-left overlay: country emoji in bg-black/50 rounded-full p-1.5.

FILE: frontend/components/home/idle/DestinationText.tsx
pl-12 left-aligned.
Name: text-5xl font-bold font-[var(--font-display)] text-[var(--color-text-primary)].
Country: text-base text-[var(--color-text-secondary)] mt-1.
Summary: text-sm text-[var(--color-text-secondary)] mt-3 leading-relaxed max-w-sm.
Arrow button below: "→" text-[var(--color-accent)] hover underline cursor-pointer.

FILE: frontend/components/home/idle/WaitingSection.tsx
Below fold (after slideshow). Scroll-triggered fade-in via IntersectionObserver.
"Waiting for you to" in text-lg text-[var(--color-text-secondary)].
"PLAN." in text-8xl font-[var(--font-display)] font-black text-[var(--color-text-primary)].
Feature grid below: 3 cards using Card component:
  🗺️ Smart Safety Zones — Real-time AI zone scoring from web sentiment
  🤖 AI Trip Planner — Budget-aware itinerary generation with Gemini
  🚨 Instant SOS — One-tap emergency alerts to contacts + local services
"""


# ============================================================
# PROMPT 6 — ACTIVE HOME SCREEN + SAFETY MAP
# ============================================================

"""
TASK: Build the Active Home Screen with Leaflet safety map and list cards.
CRITICAL: Leaflet MUST use dynamic import with ssr: false or it WILL crash.

FILE: frontend/app/(app)/home/[tripId]/page.tsx
Fetch from Supabase: trip, itinerary, reservations, tourist_spots.
Pass to ActiveHomeScreen. If no itinerary yet: show empty state with
link to /app/planner/[tripId].

FILE: frontend/components/home/active/ActiveHomeScreen.tsx
Desktop (lg+): grid grid-cols-[55fr_45fr] gap-6 px-6 pt-6.
Left: scrollable — Reservations, MustVisitCard, MustAvoidCard, AlreadyVisitedCard.
Right: sticky top-20 — SafetyMiniMap + ZoneLegend.
Mobile: single column, map first.

FILE: frontend/components/home/active/SafetyMiniMap.tsx
MUST use dynamic import:
  const SafetyMapInner = dynamic(() => import('./SafetyMapInner'), { ssr: false })
  export function SafetyMiniMap(props) { return <SafetyMapInner {...props} /> }

FILE: frontend/components/home/active/SafetyMapInner.tsx
(This is the actual Leaflet component — never SSR'd)
import { MapContainer, TileLayer, GeoJSON, CircleMarker, Popup } from 'react-leaflet'
import L from 'leaflet'
Props: lat, lng, zones (GeoJSON FeatureCollection | null), height?: string
Map height: 400px desktop, 280px mobile.
TileLayer: https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
GeoJSON layer: style prop reads feature.properties (fillColor, fillOpacity etc.)
  onEachFeature: bindPopup with neighborhood + score + zone label.
User location: CircleMarker radius=8, color var(--color-accent), fillOpacity=0.8.
CSS pulse animation on user dot: @keyframes mapPulse in globals.css.
Fetch zones on mount: GET /api/v1/zones?lat={lat}&lng={lng}&destination={name}.
Refresh every 10 minutes: setInterval(() => fetchZones(), 600000).
Show Spinner while zones loading. Show map with no overlays if zones null.

FILE: frontend/components/home/active/ZoneLegend.tsx
Small row of 3 items below map: thin text-xs text-[var(--color-text-muted)].
🟢 Safe (>3.0) | ⚪ Neutral (2.0–3.0) | 🔴 Avoid (<2.0)

FILE: frontend/components/home/active/MustVisitCard.tsx
Card with header: "Must Visit" (text-sm font-semibold) + ArrowRight button → /app/must-visit/[tripId].
Top 10 tourist_spots where zone='GREEN' or rating >= 4.0.
Each item: PlaceListItem.
Loading: Spinner. Empty: "No safe spots data yet."

FILE: frontend/components/home/active/PlaceListItem.tsx
flex justify-between items-center h-12 px-1 border-b border-[var(--color-border)] last:border-0.
Left: MapPin icon (14px text-[var(--color-text-muted)]) + name text-sm.
Right: two icon buttons (40px hit area each):
  ✓ CheckCircle — onClick: POST /api/visits {spot_name, trip_id} → move to visited.
  → ExternalLink — onClick: window.open(maps_url, '_blank').
Hover row: bg-[var(--color-bg-elevated)].

FILE: frontend/components/home/active/MustAvoidCard.tsx
Same structure as MustVisitCard.
Shows spots where zone='RED' or rating < 2.5.
Name text in text-[var(--color-zone-red)].
Header: "Must Avoid" + → to /app/must-avoid/[tripId].

FILE: frontend/components/home/active/AlreadyVisitedCard.tsx
Shows visited_places for this trip from Supabase.
Header: "Already Visited". No tick button (already done). Only → for maps.
Dimmed appearance: opacity-60.

FILE: frontend/components/home/active/ReservationsPanel.tsx
Header: "Reservations" + "+ Manual" button (top right, ghost variant).
Group by type: flights, trains, buses, hotels.
Section headers: small uppercase label. Each card below.
"+ Manual" opens ManualReservationForm modal.

FILE: frontend/components/home/active/TransportCard.tsx
flex gap-3 p-3 bg-[var(--color-bg-elevated)] rounded-xl border border-[var(--color-border)].
Icon: Plane/Train/Bus in text-[var(--color-accent)].
Route: "{from} → {to}" font-medium.
Date + amount in text-sm text-[var(--color-text-secondary)].
Confirmation number: font-mono text-xs text-[var(--color-text-muted)].

FILE: frontend/components/home/active/StayCard.tsx
Same structure. Hotel icon. Name + check-in → check-out + amount.

FILE: frontend/components/home/active/ManualReservationForm.tsx
Modal (fixed overlay + centered card).
Textarea: "Paste your reservation details, confirmation email content, or type details manually..."
Submit: POST /api/v1/reservations/parse-text {text, trip_id}.
Backend uses Gemini to extract type, dates, amount, confirmation number.
Show extracted card preview. User confirms → save to Supabase reservations.

FILE: frontend/components/home/active/FloatingSosButton.tsx
Fixed bottom-right. 64×64px circle.
bg-[var(--color-sos-primary)] text-white rounded-full shadow-lg.
AlertTriangle icon 28px.
CSS pulse animation: box-shadow 0 0 0 0 rgba(255,26,26,0.7) → 0 0 0 24px rgba(255,26,26,0).
z-[90]. onClick: router.push('/app/sos').
Only render on active home screen (pass prop or check route).

Also build full-page list views:
FILE: frontend/app/(app)/must-visit/[tripId]/page.tsx
Categorized list of all GREEN zone spots.
Group by category: Food | Stay | Entertainment | Cultural | Art | Shopping | Nature.
Each group: section header + PlaceListItem list.
Back button top-left. Same card + PlaceListItem design.

FILE: frontend/app/(app)/must-avoid/[tripId]/page.tsx
Same structure but for RED zone spots.
"""


# ============================================================
# PROMPT 7 — DESTINATION OVERVIEW PAGE
# ============================================================

"""
TASK: Build Destination Overview page — shown after search selection.
Read design.md section D for exact layout specs.

FILE: frontend/app/api/destinations/route.ts
GET /api/destinations?q={query}
Fetch Google Places Autocomplete: 
  Since we avoided Google billing, use Nominatim instead:
  GET https://nominatim.openstreetmap.org/search
  Params: q={query}, format=json, limit=5, addressdetails=1
  Map to: [{id: place_id, name: display_name_city, country, lat, lng}]
  Add User-Agent: GuardianGuide/1.0 header.

GET /api/destinations/[id]/route.ts  
Fetch details from Nominatim by place_id.
Also fetch images from Unsplash:
  GET https://api.unsplash.com/search/photos
  Headers: Authorization: Client-ID {NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}
  Params: query="{destinationName} travel landmark", per_page=3, orientation=landscape
Return combined: {name, country, lat, lng, summary, images:[url1,url2,url3]}
Fallback if Unsplash fails: use static Unsplash URLs from the destination array.

Add to frontend/.env.local:
  NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=your_key_here

FILE: frontend/app/(app)/destination/[destinationId]/page.tsx
Fetch destination data from /api/destinations/[destinationId].
Render DestinationOverview.

FILE: frontend/components/destination/DestinationOverview.tsx
Full page, no extra padding.
Structure: image grid → summary → bottom nav buttons.

FILE: frontend/components/destination/DestinationGrid.tsx
CSS Grid layout:
  Desktop: grid-cols-[60fr_40fr] h-[60vh] gap-2.
  Large image left: w-full h-full object-cover rounded-l-2xl.
  Two stacked images right: grid-rows-2 gap-2, each rounded-r-xl.
  If only 1 image (Unsplash fallback): full width, 40vh height.
Destination name overlay on large image:
  Absolute bottom-left p-6. text-4xl font-black font-[var(--font-display)].
  text-shadow: 0 2px 20px rgba(0,0,0,0.8).
  Country flag below name.

FILE: frontend/components/destination/DestinationSummary.tsx
Below grid. px-6 py-4.
Summary paragraph: text-base text-[var(--color-text-secondary)] leading-relaxed.
Safety score badge: colored Circle + score text + zone label.
Fetches zone score: GET /api/v1/sentiment {destination, lat, lng}.

FILE: frontend/components/destination/DestinationStaticMap.tsx
Dynamic import (ssr:false). Small Leaflet map: w-[280px] h-[180px] rounded-xl.
No zones — just OpenStreetMap centered on destination.
scrollWheelZoom=false, dragging=false, zoomControl=false.
Shows a simple marker at destination center.

FILE: frontend/components/destination/BackButton.tsx
Absolute bottom-left of page. p-6.
"← Back" ghost button. onClick: router.back().

FILE: frontend/components/destination/ContinueButton.tsx
Absolute bottom-right of page. p-6.
"continue →" button: bg-[var(--color-bg-elevated)] border border-[var(--color-border-strong)] px-6 py-3 rounded-xl.
Hover: border-[var(--color-accent)].
onClick: router.push('/app/planner/' + activeTripId + '?destination=' + destinationId + '&name=' + destinationName)
If no active trip: create one first, then navigate.
"""


# ============================================================
# PROMPT 8 — TRIP PLANNER SCREEN (FRONTEND)
# ============================================================

"""
TASK: Build complete Trip Planner screen including Two-Strike UI.
Read design.md section E and two-strike-rule.md.

FILE: frontend/store/plannerStore.ts
Zustand store:
  inputs: { fromLocation:'', toLocation:'', startDate:Date|null,
    endDate:Date|null, budget:0, currency:'USD', expectations:'' }
  strikeCount: 0 | 1 | 2
  minBudget: number | null
  isLoading: boolean
  loadingStartTime: number | null
  itinerary: ItineraryOutput | null
  alternatives: ItineraryOutput[]
  messages: {role:'user'|'assistant', content:string}[]
  sessionId: string | null
  isConfirmed: boolean
  Actions: setInput, setStrike, setMinBudget, setItinerary,
    setAlternatives, addMessage, setSessionId, setConfirmed,
    setLoading, reset

FILE: frontend/app/(app)/planner/[tripId]/page.tsx
Read tripId from params. Read destination + name from searchParams.
Request geolocation on mount: navigator.geolocation.getCurrentPosition.
Pre-fill plannerStore.inputs.toLocation from searchParams.destination.
Render PlannerScreen.

FILE: frontend/components/planner/PlannerScreen.tsx
Desktop (lg+): grid grid-cols-[45fr_55fr] h-[calc(100vh-64px)] gap-0.
Left: overflow-y-auto sticky-like input panel.
Right: overflow-y-auto output panel.
Mobile: flex-col, inputs top, output below.

FILE: frontend/components/planner/PlannerInputPanel.tsx
Scrollable on mobile. p-6 flex flex-col gap-5.
Stack order: row(From+To) → Duration → Budget → Expectations → GenerateBtn.

FILE: frontend/components/planner/FromInput.tsx
Label "FROM" text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider.
Input: editable text, pre-filled from GPS reverse geocode.
If geolocation pending: show "Detecting location..." placeholder.
Reverse geocode: GET https://nominatim.openstreetmap.org/reverse?lat=&lon=&format=json
Extract city name from address.city or address.town.

FILE: frontend/components/planner/ToInput.tsx
Same styling as FromInput. Label "TO".
Pre-filled from URL param. Editable.
Swap button between From and To: ⇄ icon, onClick swap values.

FILE: frontend/components/planner/DurationPicker.tsx
Label "DURATION".
Display: "{N} nights, {M} days ({start} – {end})" or "Select dates".
Click opens react-day-picker DateRange mode in a Popover.
Constraints: minDate=today, maxDate=addMonths(today,6).
Highlighted range: custom CSS using --color-accent.
Close popover on second date selected.

FILE: frontend/components/planner/BudgetInput.tsx
Label "BUDGET".
Row: currency select (48px wide, shows flag+code) + number input (flex-1).
Currencies: USD 🇺🇸, EUR 🇪🇺, GBP 🇬🇧, INR 🇮🇳, JPY 🇯🇵, AUD 🇦🇺,
  CAD 🇨🇦, SGD 🇸🇬, AED 🇦🇪, THB 🇹🇭.
Read strikeCount from plannerStore.

Strike 0 (clean): normal input styling.

Strike 1: yellow warning banner below input:
  bg-[var(--color-warning)]/10 border border-[var(--color-warning)]/30 rounded-lg p-3 text-sm.
  "⚠️ Suggested minimum for {destination}: {currency}{minBudget}"
  Input still enabled.

Strike 2: red banner + input DISABLED:
  bg-[var(--color-error)]/10 border border-[var(--color-error)]/30 rounded-lg p-3 text-sm.
  "❌ Budget too low. Minimum required: {currency}{minBudget}"
  Input value shows: "Min: {currency}{minBudget}" text-[var(--color-text-muted)].
  Input: disabled, opacity-50, cursor-not-allowed.

FILE: frontend/components/planner/ExpectationsTextbox.tsx
Label "EXPECTATIONS" with "(optional, max 500 chars)".
Textarea: bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-xl p-3.
min-h-[80px] max-h-[200px]. Grows with content via onInput height recalc.
Character counter bottom-right: "{n}/500".
normal: text-[var(--color-text-muted)].
> 450: text-[var(--color-warning)].
= 500: text-[var(--color-error)].
Hard limit: maxLength=500.

FILE: frontend/components/planner/GenerateButton.tsx
Full width. py-4. text-base font-semibold.
Text: "generate itinerary →"
Style: bg-[var(--color-bg-elevated)] border border-[var(--color-border-strong)]
  rounded-xl hover:border-[var(--color-accent)] transition-colors.
Disabled when: strikeCount===2 OR any required field empty OR isLoading.
Disabled: opacity-40 cursor-not-allowed.
onClick: validate → dispatch to API via usePlanner hook.

FILE: frontend/hooks/usePlanner.ts
Hook managing the full planner flow.
generateItinerary(inputs):
  1. Set isLoading=true, record loadingStartTime=Date.now()
  2. POST /api/v1/planner with all inputs (from plannerStore)
  3. If response.status === 'strike1': setStrike(1), setMinBudget, setLoading(false)
  4. If response.status === 'strike2': setStrike(2), setMinBudget, setLoading(false)
  5. If response.status === 'success':
     a. Wait until 15 seconds have passed since loadingStartTime (enforce min loading)
     b. setItinerary, setAlternatives, setSessionId, setLoading(false)
sendChatMessage(message):
  POST /api/v1/planner/{sessionId}/chat {message}
  Append user message to plannerStore.messages before request.
  Append AI response after.
confirmItinerary():
  POST /api/v1/planner/{sessionId}/confirm
  setConfirmed(true)

FILE: frontend/components/planner/LoadingAnimation.tsx
Three dots. Each: 12px circle bg-[var(--color-accent)] rounded-full.
Framer Motion: each dot scale 1→1.5→1, stagger 150ms.
Text below: "Planning your perfect trip..." text-sm text-[var(--color-text-secondary)].
Note: this only SHOWS at 15s. The actual wait is enforced in usePlanner hook.

FILE: frontend/components/planner/PlannerOutputPanel.tsx
bg-[var(--color-bg-secondary)] border-l border-[var(--color-border)] p-6.
Before generation: show destination images (3-grid from Unsplash) + welcome text.
During loading: LoadingAnimation centered (vertically + horizontally).
After generation: images stay top, ItineraryResult, then alternatives, then (if confirmed) BookingPlaceholders.

FILE: frontend/components/planner/ItineraryResult.tsx
Heading "Your Perfect Trip" text-2xl font-bold font-[var(--font-display)] mb-4.
Budget summary bar: spent/total with color coding.
For each day: collapsible section with date header.
Each activity: flex gap-3 py-3 border-b border-[var(--color-border)].
  Left dot: colored by time_of_day (morning=yellow, afternoon=blue, evening=purple).
  Content: name (font-medium) + description (text-sm text-secondary) + location link + cost.
  Tags: Badge components at bottom.

FILE: frontend/components/planner/AlternativeItinerary.tsx
opacity-70 hover:opacity-100 transition-opacity.
Card with "Alternative {N}" label + Pencil icon top-right.
Shows summary and total cost. Pencil click: plannerStore set active alternative → open ChatWindow.

FILE: frontend/components/planner/ChatWindow.tsx
Chat interface. Fixed height within output panel.
Messages: user right (bg-[var(--color-accent)]/20), AI left (bg-[var(--color-bg-elevated)]).
Input: ChatInput component at bottom.
"Confirm this itinerary" button when AI response contains confirmation cue.
Auto-scroll to bottom on new message.

FILE: frontend/components/planner/BookingPlaceholders.tsx
Shown after confirmation. mt-8 border-t border-[var(--color-border)] pt-8.
Heading "Book Your Trip" text-xl font-bold.
Grid of 4 cards: ✈️ Flights → skyscanner.net, 🚆 Trains → 12go.asia,
  🚌 Buses → busbud.com, 🏨 Hotels → booking.com.
Each card: icon + service name + "Book Now →" link. Opens in new tab.
Pre-fill destination in URLs where possible.
"""


# ============================================================
# PROMPT 9 — LANGGRAPH PLANNER + TWO-STRIKE BACKEND (GEMINI)
# ============================================================

"""
TASK: Build complete LangGraph planner agent using Gemini 2.0 Flash (FREE).
Read ai-pipeline.md and two-strike-rule.md fully before coding.

FILE: backend/app/services/planner/langgraph_agent.py

from typing import TypedDict, Literal, Annotated
from langgraph.graph import StateGraph, END
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage, SystemMessage, AIMessage
from app.config import settings
from app.middleware.pii_redactor import redact_pii
import uuid, json

# LLM INITIALIZATION — Gemini, completely free
llm = ChatGoogleGenerativeAI(
    model=settings.LLM_MODEL,
    google_api_key=settings.GOOGLE_GENERATIVE_AI_API_KEY,
    temperature=0.7,
    convert_system_message_to_human=True  # Required for Gemini
)
llm_pro = ChatGoogleGenerativeAI(
    model=settings.LLM_FALLBACK_MODEL,
    google_api_key=settings.GOOGLE_GENERATIVE_AI_API_KEY,
    temperature=0.5,
    convert_system_message_to_human=True
)

class PlannerState(TypedDict):
    session_id: str
    messages: list
    from_location: str
    to_location: str
    start_date: str
    end_date: str
    duration_days: int
    budget: float
    currency: str
    min_budget: float
    strike_count: int           # 0, 1, or 2
    expectations: str
    itinerary: dict | None
    alternatives: list
    confirmed: bool
    is_replanning: bool         # True = skip image gen, reduce cost
    error: str | None

PLANNER_SYSTEM_PROMPT = """You are GuardianGuide's AI trip planner. Plan a
{duration_days}-night trip from {from_location} to {to_location}.
Budget: {budget} {currency}.
User expectations: [USER_INPUT]{expectations}[/USER_INPUT]

STRICT RULES:
1. Total costs across ALL days must NOT exceed {budget} {currency}.
2. Every activity must include: name, description, location, estimated_cost, time_of_day, category.
3. Include transport between locations within each day.
4. Recommend specific real hotels/restaurants (by name) within budget.
5. Return ONLY valid JSON, no markdown, no explanation, no code fences.

Return this exact JSON structure:
{{
  "title": "Trip title",
  "days": [
    {{
      "day": 1,
      "date": "2024-12-20",
      "activities": [
        {{
          "time_of_day": "morning",
          "name": "Activity name",
          "description": "Brief description",
          "location": "Specific location name",
          "estimated_cost": 25.00,
          "category": "cultural",
          "tags": ["#Cultural", "#MidRange"],
          "maps_url": "https://maps.google.com/?q=location+name"
        }}
      ]
    }}
  ],
  "total_estimated_cost": 1450.00,
  "currency": "{currency}",
  "summary": "One paragraph trip overview"
}}"""

async def validate_budget_node(state: PlannerState) -> PlannerState:
    from app.services.planner.budget_validator import calculate_min_budget
    min_b = await calculate_min_budget(
        state["to_location"], state["duration_days"], state["currency"]
    )
    state["min_budget"] = min_b
    if state["budget"] < min_b:
        state["strike_count"] = state.get("strike_count", 0) + 1
    return state

async def generate_plan_node(state: PlannerState) -> PlannerState:
    clean_expectations = redact_pii(state["expectations"])
    prompt = PLANNER_SYSTEM_PROMPT.format(
        duration_days=state["duration_days"],
        from_location=state["from_location"],
        to_location=state["to_location"],
        budget=state["budget"],
        currency=state["currency"],
        expectations=clean_expectations
    )
    try:
        response = await llm_pro.ainvoke([HumanMessage(content=prompt)])
        raw = response.content.strip()
        # Remove any accidental code fences Gemini might add
        if raw.startswith("```"):
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]
        itinerary = json.loads(raw)
        state["itinerary"] = itinerary
    except Exception as e:
        print(f"[Planner] Error generating plan: {e}")
        state["error"] = str(e)
        state["itinerary"] = None
    return state

async def generate_alternatives_node(state: PlannerState) -> PlannerState:
    from app.services.planner.itinerary_builder import generate_alternatives
    if state["itinerary"]:
        state["alternatives"] = await generate_alternatives(state, llm)
    return state

async def tag_activities_node(state: PlannerState) -> PlannerState:
    from app.services.planner.tag_engine import tag_itinerary
    if state["itinerary"]:
        state["itinerary"] = tag_itinerary(state["itinerary"])
    for alt in state.get("alternatives", []):
        tag_itinerary(alt)
    return state

async def chat_responder_node(state: PlannerState) -> PlannerState:
    context = json.dumps(state.get("itinerary", {}), indent=2)
    sys_msg = f"""You are helping customize a trip itinerary.
Current itinerary: {context}
Budget: {state['budget']} {state['currency']}
Answer questions, suggest changes, and provide travel tips.
When user is satisfied, end with: "Your itinerary is confirmed! ✅"
Keep responses concise and actionable."""
    messages = [HumanMessage(content=m["content"])
                if m["role"] == "user" else AIMessage(content=m["content"])
                for m in state.get("messages", [])]
    try:
        response = await llm.ainvoke([HumanMessage(content=sys_msg)] + messages)
        state["messages"].append({"role": "assistant", "content": response.content})
    except Exception as e:
        state["messages"].append({"role": "assistant",
            "content": "I encountered an issue. Please try again."})
    return state

def route_after_validation(state: PlannerState) -> Literal["generate","warn","block"]:
    strikes = state.get("strike_count", 0)
    if state["budget"] >= state["min_budget"]:
        return "generate"
    return "warn" if strikes == 1 else "block"

# Build the graph
workflow = StateGraph(PlannerState)
workflow.add_node("validate", validate_budget_node)
workflow.add_node("generate", generate_plan_node)
workflow.add_node("alternatives", generate_alternatives_node)
workflow.add_node("tag", tag_activities_node)
workflow.add_node("chat", chat_responder_node)
workflow.set_entry_point("validate")
workflow.add_conditional_edges("validate", route_after_validation, {
    "generate": "generate", "warn": END, "block": END
})
workflow.add_edge("generate", "alternatives")
workflow.add_edge("alternatives", "tag")
workflow.add_edge("tag", END)
workflow.add_edge("chat", END)
planner_graph = workflow.compile()

async def run_planner(inputs: dict) -> PlannerState:
    from datetime import datetime
    start = datetime.strptime(inputs["start_date"], "%Y-%m-%d")
    end = datetime.strptime(inputs["end_date"], "%Y-%m-%d")
    duration = (end - start).days
    initial_state = PlannerState(
        session_id=str(uuid.uuid4()),
        messages=[], from_location=inputs["from_location"],
        to_location=inputs["to_location"],
        start_date=inputs["start_date"], end_date=inputs["end_date"],
        duration_days=duration, budget=inputs["budget"],
        currency=inputs.get("currency","USD"), min_budget=0,
        strike_count=0, expectations=inputs.get("expectations",""),
        itinerary=None, alternatives=[], confirmed=False,
        is_replanning=inputs.get("is_replanning", False), error=None
    )
    return await planner_graph.ainvoke(initial_state)

FILE: backend/app/services/planner/budget_validator.py
async def calculate_min_budget(destination: str, duration_days: int, currency: str) -> float:
  Use a hardcoded continent/region lookup table as primary source
  (avoids any API call, instant, reliable):
  COST_BY_REGION = {
    "western_europe": {"hotel": 120, "food": 50, "transport": 30, "activities": 40},
    "eastern_europe": {"hotel": 60, "food": 25, "transport": 15, "activities": 20},
    "southeast_asia": {"hotel": 40, "food": 15, "transport": 10, "activities": 20},
    "south_asia": {"hotel": 35, "food": 12, "transport": 8, "activities": 15},
    "east_asia": {"hotel": 100, "food": 40, "transport": 25, "activities": 35},
    "middle_east": {"hotel": 150, "food": 60, "transport": 30, "activities": 50},
    "north_america": {"hotel": 130, "food": 60, "transport": 35, "activities": 45},
    "latin_america": {"hotel": 60, "food": 25, "transport": 15, "activities": 25},
    "africa": {"hotel": 70, "food": 30, "transport": 20, "activities": 30},
    "oceania": {"hotel": 140, "food": 65, "transport": 40, "activities": 50},
    "default": {"hotel": 80, "food": 35, "transport": 20, "activities": 30},
  }
  DESTINATION_TO_REGION mapping: 300+ cities mapped to regions.
  Calculate: base = (hotel + food + transport + activities) * duration_days
  Add 20% buffer: min_budget = base * 1.20
  Convert to user currency using simple hardcoded rates table (approximate).
  Return float.

FILE: backend/app/services/planner/tag_engine.py
Complete implementation:
  TAGS_BY_CATEGORY = {
    "food": ["#LocalDining"], "restaurant": ["#LocalDining"],
    "street food": ["#StreetFood"], "fine dining": ["#FineFood"],
    "hotel": ["#MidRangeStay"], "hostel": ["#BudgetStay"],
    "luxury hotel": ["#LuxuryStay"],
    "museum": ["#Cultural"], "temple": ["#Cultural"], "church": ["#Cultural"],
    "beach": ["#Relaxation"], "hiking": ["#Adventure"], "sport": ["#Adventure"],
    "shopping": ["#Shopping"], "market": ["#Shopping"],
    "park": ["#Nature"], "garden": ["#Nature"],
  }
  def get_cost_tag(cost: float, currency: str) -> str:
    USD equivalent thresholds: <20=#Budget, <80=#MidRange, else=#Splurge
  def tag_activity(activity: dict) -> list[str]:
    tags from category keywords + cost tag
  def tag_itinerary(itinerary: dict) -> dict:
    mutates and returns itinerary with tags added to each activity

FILE: backend/app/services/planner/itinerary_builder.py
async def generate_alternatives(state: PlannerState, llm) -> list[dict]:
  Generate 2 alternatives with different focus angles.
  Alternative 1 prompt: same budget, maximize local/cultural experiences, avoid tourist traps
  Alternative 2 prompt: same budget, adventure/outdoor focus, active experiences
  Each: separate LLM call, same JSON format as main itinerary.
  Tag each with tag_itinerary.
  Return list of 2 itinerary dicts. Return [] on error.

FILE: backend/app/api/planner.py
Complete FastAPI router:
  POST /api/v1/planner — run planner, return response based on strike state
  POST /api/v1/planner/{session_id}/chat — continue chat
  POST /api/v1/planner/{session_id}/confirm — confirm + save to Supabase
Store session state in Redis (TTL: 2 hours):
  Key: "session:{session_id}", Value: JSON-serialized PlannerState
"""


# ============================================================
# PROMPT 10 — SENTIMENT ENGINE + ZONES API (COMPLETE)
# ============================================================

"""
TASK: Build the complete sentiment pipeline using FREE services only.
NO Google Places. NO Reddit. NO billing.

Stack used:
  Venue data:    Foursquare API v3 (free, 1000/day)
  Social data:   DuckDuckGo + Serper + Wikipedia (free/2500mo)
  Sentiment:     HuggingFace Inference API (free)
  Geocoding:     Nominatim/OpenStreetMap (free, no key)
  Formula:       S = (venue_score × 0.6) + (social_score × 0.4)

Build these files in full — they are currently blank:

FILE: backend/app/services/sentiment/foursquare_scraper.py
[Full implementation — see CLAUDE_CLI_MASTER_PROMPT.md Section 2]
Functions: fetch_foursquare_data(destination, lat, lng) -> dict
Returns: {ratings: [float], venue_names: [str], avg_rating: float}
Cache in Redis 24hr. Normalize Foursquare 0-10 rating to 1-5 scale.

FILE: backend/app/services/sentiment/web_sentiment_scraper.py
[Full implementation — see CLAUDE_CLI_MASTER_PROMPT.md Section 2]
Functions: fetch_web_sentiment_data(destination) -> list[str]
3 sources: DuckDuckGo (no key), Serper (SERPER_API_KEY), Wikipedia.
Returns max 30 text snippets. Fallback to neutral if all fail.

FILE: backend/app/services/sentiment/hf_sentiment.py
[Full implementation — see CLAUDE_CLI_MASTER_PROMPT.md Section 2]
Functions: analyze_sentiment(texts) -> list[dict], map_sentiment_to_score(sentiment) -> float
Batches of 8. Retry on 503. Fallback to neutral on total failure.

FILE: backend/app/services/sentiment/score_calculator.py
[Full implementation from CLAUDE_CLI_MASTER_PROMPT.md Section 2]
THE FORMULA: S = (venue_score × 0.6) + (social_score × 0.4)
Zone thresholds: GREEN > 3.0, WHITE 2.0-3.0, RED < 2.0
Export: calculate_zone_score(), get_zone_display_config()

FILE: backend/app/services/sentiment/zone_mapper.py
[Full implementation — see CLAUDE_CLI_MASTER_PROMPT.md Section 2]
Functions: fetch_boundary_geojson(destination) -> dict | None
           create_circle_polygon(lat, lng, radius_km) -> dict
           build_zone_geojson(result, lat, lng) -> dict
Nominatim usage: 1s delay between calls (respect usage policy).

FILE: backend/app/cache/sentiment_cache.py
[Full implementation — see CLAUDE_CLI_MASTER_PROMPT.md Section 2]
get_cached_score(location_hash) -> SentimentResult | None
cache_score(location_hash, result) -> None (TTL: 86400s)

FILE: backend/app/api/zones.py
[Full implementation — see CLAUDE_CLI_MASTER_PROMPT.md Section 2]
GET /api/v1/zones?lat={lat}&lng={lng}&destination={name}
Complete pipeline: cache check → reverse geocode → parallel fetch →
HuggingFace sentiment → score calculation → GeoJSON build → cache → return.

FILE: backend/app/api/sentiment.py
POST /api/v1/sentiment {destination, lat, lng}
Auth required. Rate limited (general).
Runs full pipeline, returns SentimentResult as dict.

Verify:
  cd backend && python -c "
  from app.services.sentiment.score_calculator import calculate_zone_score
  result = calculate_zone_score('test', 'Paris', [4.2, 3.8, 4.5], [{'label':'POSITIVE','score':0.9}])
  print(f'Score: {result.final_score}, Zone: {result.zone}')
  assert result.zone == 'GREEN', f'Expected GREEN, got {result.zone}'
  print('score_calculator: PASS')
  "
"""


# ============================================================
# PROMPT 11 — ITINERARY SCREEN + EXPENSES
# ============================================================

"""
TASK: Build Itinerary screen and Expenses management.
Read design.md section F for layout specs.

FILE: frontend/store/budgetStore.ts
Zustand:
  expenses: Expense[]
  totalBudget: number
  currency: string
  totalSpent: computed as sum of expenses[].amount
  Actions: addExpense, updateExpense, deleteExpense, fetchExpenses(tripId)
  fetchExpenses: loads from Supabase expenses table for tripId

FILE: frontend/app/(app)/itinerary/[tripId]/page.tsx
Fetch: trip + itinerary + expenses + reservations from Supabase.
Render ItineraryScreen.

FILE: frontend/components/itinerary/ItineraryScreen.tsx
Desktop (lg+): grid grid-cols-2 gap-6 p-6.
Left: BudgetSummaryCard + SpendingCard + ReservationsPanel (same as home).
Right: ToDoList.
Mobile: single column.

FILE: frontend/components/itinerary/BudgetSummaryCard.tsx
bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl p-6.
Label "TOTAL BUDGET" uppercase tracking-widest text-xs text-[var(--color-text-muted)].
Amount: itinerary.total_budget in text-4xl font-bold font-mono text-[var(--color-accent)].
Currency below: text-sm text-[var(--color-text-secondary)].
Trip dates + duration below.

FILE: frontend/components/itinerary/SpendingCard.tsx
Header: "Spendings" (font-semibold) + ArrowRight → /app/itinerary/[tripId]/expenses.
totalSpent / totalBudget display.
Progress bar: w-full h-2 bg-[var(--color-bg-elevated)] rounded-full.
  Inner: width = (totalSpent/totalBudget)*100% max 100%.
  Color: green if <80%, yellow if 80-100%, red if >100%.
Last 3 expenses as mini-rows: date | description | amount.

FILE: frontend/app/(app)/itinerary/[tripId]/expenses/page.tsx
Full-width list. Header: "All Expenses" + "+" button top-right.
Sorted by date descending.
Each row: date | category icon | description | amount.
Click row: inline edit (expand to form).
"+" click: show AddExpenseForm at top.
Form: amount input, description input, category select, date picker.
Save: POST/PATCH to Supabase expenses.

FILE: frontend/components/itinerary/ToDoList.tsx
Title "To-Do List" + trip day range.
Grouped by day (collapsible accordions).
Each item: ToDoItem.

FILE: frontend/components/itinerary/ToDoItem.tsx
flex gap-3 items-start py-3 border-b border-[var(--color-border)] last:border-0.
Checkbox: onClick toggles done state (local state, not persisted for MVP).
When done: line-through text + opacity-50.
Content: name font-medium + description text-sm text-secondary.
Bottom row: MapPin location text + cost font-mono text-xs + Badge tags.
"""


# ============================================================
# PROMPT 12 — SOS SCREEN + USER PROFILE
# ============================================================

"""
TASK: Build SOS screen (completely different red theme) and User Profile.
Read design.md sections G and H carefully.

FILE: frontend/store/sosStore.ts
Zustand:
  emergencyContacts: EmergencyContact[]  (from Supabase)
  customMessage: string (default template)
  isSending: boolean
  lastSentAt: Date | null
  Actions: setContacts, setCustomMessage, triggerSOS(lat, lng)
  Default message template:
    "{name} is in an emergency situation!\nLocation: {lat}, {lng}\nTime: {time}\nGoogle Maps: https://maps.google.com/?q={lat},{lng}"

FILE: frontend/app/(app)/sos/page.tsx
Apply sos-theme class to outermost div.
No standard TopBar — render SosScreen directly.
Back button top-left: "← Back to Safety".

FILE: frontend/components/sos/SosScreen.tsx
Full screen. Background: var(--color-sos-bg). Color: var(--color-sos-text).
Header: "EMERGENCY" text-4xl font-black font-[var(--font-display)] text-[var(--color-sos-primary)].
GuardianLogo SVG with red fill.
Contains: EmergencyDirectory + ContactButton.
Get user GPS on mount.

FILE: frontend/components/sos/EmergencyDirectory.tsx
Fetches: GET /api/v1/sos/emergency-contacts?lat={lat}&lng={lng}.
Uses Overpass API on backend — finds police, hospital, fire_station nearby.
Each service: large card, bg: rgba(255,26,26,0.08), border: rgba(255,26,26,0.3).
Service name: text-lg font-bold.
Phone number: text-3xl font-mono text-[var(--color-sos-primary)].
onClick: window.location.href = 'tel:' + phone.
Loading: skeleton cards. No data: show generic numbers (112, 100, 101 etc).

FILE: frontend/components/sos/ContactButton.tsx
Full width. Height 80px. mt-8.
Background: var(--color-sos-primary). rounded-2xl.
Text: "SEND ALERT TO MY CONTACTS" text-xl font-black.
CSS pulse: @keyframes sosPulse {
  0% { box-shadow: 0 0 0 0 rgba(255,26,26,0.7); }
  70% { box-shadow: 0 0 0 24px rgba(255,26,26,0); }
  100% { box-shadow: 0 0 0 0 rgba(255,26,26,0); }
}
animation: sosPulse 1.5s infinite.
onClick: get GPS → build message from sosStore.customMessage template
  → POST /api/v1/sos {coordinates, timestamp}
  → Show "✅ Alert sent to {N} contacts" confirmation.
Disable for 30s after sending (prevent spam).

FILE: backend/app/api/sos.py
GET /api/v1/sos/emergency-contacts?lat={lat}&lng={lng}
  Query Overpass API for police, hospital, fire_station within 3000m.
  Return dict: {police, hospital, fire_station} each with name, phone.
  Fallback if Overpass fails or no results: return generic numbers.

POST /api/v1/sos {coordinates: {lat, lng}, timestamp: str}
  Auth required.
  Get user from Supabase (name + emergency_contacts).
  Build message from default template with real values.
  For each contact with phone: send SMS via Twilio.
  For each contact with email: send email via Resend (FROM: onboarding@resend.dev).
  Return {sent_to: N, status: "ok"}.

FILE: frontend/app/(app)/user/page.tsx
No TripDirectory in TopBar (user screen is trip-agnostic).
Render UserScreen.

FILE: frontend/components/user/UserScreen.tsx
Desktop: grid grid-cols-[35fr_65fr] gap-8 p-6.
Left: ProfilePicture.
Right: ProfileForm + CredentialsVault + EmergencyContacts + CustomSosMessage.
Mobile: single column, avatar centered.

FILE: frontend/components/user/ProfilePicture.tsx
160×160px circle. overflow-hidden. relative.
Next.js Image or avatar letter-fallback (first letter of name in accent color).
Camera icon overlay on hover: absolute inset-0 bg-black/50 flex items-center justify-center.
onClick: file input click. On file select: upload to Supabase storage "avatars/{userId}".
Update users.avatar_url after upload.

FILE: frontend/components/user/ProfileForm.tsx
Fields: first_name, last_name, email (disabled+verified badge), phone (disabled+verified),
  dob (optional), gender (optional dropdown).
Save: PATCH public.users. Show success toast.
Verified badge: ✓ text-[var(--color-success)] next to verified fields.

FILE: frontend/components/user/CredentialsVault.tsx
Label "Private Notes & Credentials" + "Stored securely" subtitle.
Textarea: font-mono bg-[var(--color-bg-elevated)] border border-[var(--color-border)].
Toggle show/hide: Eye/EyeOff icon. When hidden: blur-sm.
Auto-save on blur (debounce 1s): PATCH users.vault.

FILE: frontend/components/user/EmergencyContacts.tsx
Label "Emergency Contacts (max 3)".
3 slots. Empty slot: "+ Add Contact" dashed border placeholder.
Each filled: EmergencyContactForm.
Save updates sosStore.emergencyContacts.

FILE: frontend/components/user/CustomSosMessage.tsx
Label "SOS Alert Message".
Textarea with pre-filled default from sosStore.
Token highlighting: {name}, {coordinates}, {timestamp} in text-[var(--color-accent)].
Use a contenteditable div or textarea with overlay for highlighting.
Save: updates sosStore.customMessage.
"""


# ============================================================
# PROMPT 13 — GMAIL + TRANSLATION BACKEND
# ============================================================

"""
TASK: Build Gmail sync and translation services using only free APIs.
Read gmail-security-audit.md fully before coding.

FILE: backend/app/services/gmail/gmail_reader.py
Class GmailReader:
  authenticate(user_id): fetch gmail_token from Supabase users table.
    Build Credentials from stored token dict.
    If expired: refresh using google.oauth2.credentials.Credentials.refresh().
    Store refreshed token back to Supabase.
  
  async fetch_booking_emails(start_date, destination) -> list[dict]:
    query = f"subject:(booking OR reservation OR ticket OR confirmation) after:{start_date:%Y/%m/%d}"
    Use Gmail API: service.users().messages().list(userId='me', q=query, maxResults=20)
    For each message: get full message body.
    Return: [{id, subject, body_text, date, from_email}]
    NEVER log email body. NEVER pass raw email to LLM.

FILE: backend/app/services/gmail/booking_parser.py
Function: parse_booking(email: dict) -> dict | None
Use ONLY regex — no LLM for parsing (PII safety + cost):
  confirmation_patterns = [r'confirmation[:\s#]+([A-Z0-9]{5,12})', r'booking[:\s#]+([A-Z0-9]{5,12})', r'PNR[:\s:]+([A-Z0-9]{5,8})']
  date_pattern = r'\b(\d{1,2}[\s/-]\w{3,9}[\s/-]\d{2,4})\b'
  amount_pattern = r'(?:USD|EUR|GBP|INR|[$€£₹])\s*(\d+(?:[,.]\d{2})?)'
  type_keywords = {'flight':['flight','airline','airways'],
    'hotel':['hotel','resort','inn','accommodation'],
    'train':['train','rail','amtrak','eurostar'],
    'bus':['bus','coach','greyhound']}
Return structured dict or None if no booking detected.

FILE: backend/app/services/gmail/supabase_updater.py
async sync_bookings_to_db(trip_id, user_id, bookings) -> int:
  INSERT each booking into reservations with source='gmail'.
  ON CONFLICT (user_id, confirmation_number) DO NOTHING.
  Return count of newly inserted rows.

FILE: backend/app/api/gmail_sync.py
GET /api/v1/auth/gmail → redirect to Google OAuth with gmail.readonly scope.
GET /api/v1/auth/gmail/callback → exchange code, store token in users.gmail_token.
POST /api/v1/gmail/sync {trip_id} → full sync pipeline. Auth required.
DELETE /api/v1/auth/gmail → revoke token + clear from Supabase.

FILE: backend/app/services/translation/text_translator.py
async translate_text(text, source_lang, target_lang) -> str:
  Use HuggingFace Inference API.
  Model: Helsinki-NLP/opus-mt-{source_lang}-{target_lang}
  POST https://api-inference.huggingface.co/models/Helsinki-NLP/opus-mt-{src}-{tgt}
  Body: {"inputs": text}
  If model not found (404): try opus-mt-mul-en as fallback.
  Return translated string.

FILE: backend/app/services/translation/ocr_translator.py
async extract_text(image_bytes) -> str:
  PIL.Image.open → pytesseract.image_to_string(lang='osd').
  Return extracted text (may be empty string — handle gracefully).

FILE: backend/app/api/translate.py
POST /api/v1/translate/text — auth + 2/min rate limit.
POST /api/v1/translate/image — multipart upload, auth + 2/min rate limit.
FROM_EMAIL is onboarding@resend.dev — already set in config.
"""


# ============================================================
# PROMPT 14 — UNSPLASH IMAGE SERVICE (REPLACES STABLE DIFFUSION)
# ============================================================

"""
TASK: Build image service using Unsplash API (free, 50 req/hr).
Note: We are NOT using Stable Diffusion or Replicate. Free Unsplash only.

FILE: backend/app/services/image_gen/unsplash_fetcher.py
import httpx, json, hashlib
from app.config import settings
from app.cache.redis_client import redis_client

UNSPLASH_SEARCH_URL = "https://api.unsplash.com/search/photos"

async def fetch_destination_images(destination: str, count: int = 3) -> list[str]:
    cache_key = f"images:{hashlib.md5(destination.lower().encode()).hexdigest()[:10]}"
    cached = await redis_client.get(cache_key)
    if cached:
        return json.loads(cached)
    
    try:
        async with httpx.AsyncClient(timeout=8.0) as client:
            resp = await client.get(
                UNSPLASH_SEARCH_URL,
                headers={"Authorization": f"Client-ID {settings.UNSPLASH_ACCESS_KEY}"},
                params={
                    "query": f"{destination} travel landmark tourism",
                    "per_page": count,
                    "orientation": "landscape",
                    "content_filter": "high"
                }
            )
            resp.raise_for_status()
            data = resp.json()
            urls = [photo["urls"]["regular"] for photo in data.get("results", [])]
            if urls:
                await redis_client.set(cache_key, json.dumps(urls), ttl=604800)  # 7 days
                return urls
    except Exception as e:
        print(f"[Unsplash] Error: {e}")
    
    return get_fallback_images(destination)

def get_fallback_images(destination: str) -> list[str]:
    # Hardcoded URLs for the 8 main destinations (no API key needed)
    STATIC_IMAGES = {
        "paris": ["https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800"],
        "tokyo": ["https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800"],
        "bali": ["https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800"],
        "new york": ["https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800"],
        "istanbul": ["https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800"],
        "santorini": ["https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800"],
        "kyoto": ["https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800"],
        "dubai": ["https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800"],
    }
    key = destination.lower()
    for dest, urls in STATIC_IMAGES.items():
        if dest in key:
            return urls
    # Generic travel placeholder
    slug = destination.lower().replace(" ", "-")
    return [f"https://placehold.co/800x500/111118/6C63FF?text={slug}"]

FILE: backend/app/services/image_gen/trigger_guard.py
# Simplified — no is_replanning gate needed (Unsplash is free)
async def get_destination_images(destination: str, count: int = 3) -> list[str]:
    return await fetch_destination_images(destination, count)

FILE: backend/app/api/image_gen.py
GET /api/v1/images?destination={name}&count={n}
Auth required. General rate limit.
Calls trigger_guard.get_destination_images().
Returns: {images: [url1, url2, url3]}
"""


# ============================================================
# PROMPT 15 — LANGSMITH + RAGAS EVALUATION
# ============================================================

"""
TASK: Build evaluation pipeline (Golden Loop). Read golden-loop.md.

FILE: backend/app/evaluation/langsmith_tracer.py
from langsmith import traceable, Client
client = Client()

Decorator @traceable wrapping run_planner function.
Log Two-Strike events as client.create_feedback with key="budget_strike".
Log zone scores as client.create_feedback with key="sentiment_score".
Tags: ["production", "planner"].

FILE: backend/app/evaluation/ragas_evaluator.py
Load test datasets from evaluation/test_datasets/.
Run evaluate() with metrics: context_precision, faithfulness, answer_relevancy.
Target thresholds: precision>0.90, faithfulness>0.95, relevancy>0.85.
Print results table. Return dict of scores.

FILE: backend/app/evaluation/test_datasets/sentiment_test.json
5 test cases as JSON array. Each:
{question, contexts: [str], answer: str, ground_truth: str}
Use realistic fictional data for Paris, Tokyo, Bali, New York, Istanbul.

FILE: backend/app/evaluation/test_datasets/planner_test.json
5 test cases: valid budget, strike1 (20% below min), strike2 (50% below min),
normal Paris 5-day $1500, luxury Tokyo 7-day $5000.

FILE: backend/Makefile
eval:
	cd backend && python -m app.evaluation.ragas_evaluator
test:
	cd backend && pytest tests/ -v --tb=short
run:
	cd backend && uvicorn app.main:app --reload --port 8000
install:
	cd backend && pip install -r requirements.txt
"""


# ============================================================
# PROMPT 16 — FINAL INTEGRATION + RESPONSIVE POLISH
# ============================================================

"""
TASK: Connect all pieces, fix responsiveness, prepare for demo.
Run through hackathon-demo-script.md step by step.

NEXT.JS API ROUTES (proxy layer — prevent direct backend exposure):

FILE: frontend/app/api/trips/route.ts
GET: fetch all trips for current user from Supabase.
POST: create new trip {name, user_id}.

FILE: frontend/app/api/trips/[tripId]/route.ts
GET: fetch single trip with itinerary + reservations.
PATCH: update trip (name, status, destination).
DELETE: delete trip.

FILE: frontend/app/api/planner/route.ts
POST: proxy to backend /api/v1/planner.
Add user auth token to request headers.

FILE: frontend/app/api/zones/route.ts
GET: proxy to backend /api/v1/zones.
Pass through lat, lng, destination params.

FILE: frontend/app/api/destinations/route.ts
GET /api/destinations?q={query}: Nominatim search.
GET /api/destinations/[id]: details + Unsplash images.

FILE: frontend/app/api/sos/route.ts
POST: proxy to backend /api/v1/sos.
GET emergency-contacts: proxy to backend.

FILE: frontend/app/api/reservations/parse-text/route.ts
POST {text, trip_id}: use Gemini to extract booking info.
System prompt: extract type, dates, amount, confirmation from text.
Return structured reservation object.

INTEGRATION FIXES — run through and fix all of these:

1. Auth complete both flows (Google + Phone).
2. TripDirectory creates trips with unique names.
3. SearchBar → Destination page → "continue →" → Planner (destination pre-filled).
4. Budget Strike 1 warning shows. Strike 2 disables input.
5. Loading shows minimum 15 seconds.
6. Itinerary renders with tags and Maps links.
7. Leaflet map loads (no SSR errors) and shows zone colors.
8. Must Visit tick moves to Visited.
9. SOS ContactButton sends (test in dev with your own number).
10. User profile saves all fields.

RESPONSIVE — verify at 375px width:
- Mobile nav: TopBar has logo + 3-bar only (no directory).
- Directory accessible via panel instead.
- Home active: map full width at top, lists below.
- Planner: single column, inputs then output.
- All text readable, no overflow.

TYPESCRIPT — run: cd frontend && npx tsc --noEmit
Fix ALL errors. Common issues:
  - Leaflet types: add @types/leaflet, declare module for leaflet in types.d.ts.
  - dynamic import: add type annotation for the imported component.
  - Supabase: use Database generic type from generated types.

FINAL DEPLOY CHECK:
  cd frontend && npm run build
  Fix any build errors.
  cd backend && uvicorn app.main:app --port 8000 (check startup logs)
  GET localhost:8000/api/v1/health → should return {status: ok}

COMMIT:
  git add .
  git commit -m "feat: GuardianGuide complete — production ready"
  git push origin main
"""
