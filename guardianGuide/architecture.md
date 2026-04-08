# architecture.md — GuardianGuide System Architecture

## 1. High-Level Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        USER (Browser)                        │
│                    Next.js Frontend :3000                    │
│   Auth │ Home │ Destination │ Planner │ Itinerary │ SOS     │
└────────────────────────────┬────────────────────────────────┘
                             │ HTTPS
           ┌─────────────────┼─────────────────┐
           │                 │                 │
    ┌──────▼──────┐  ┌───────▼──────┐  ┌──────▼──────┐
    │  Supabase   │  │  FastAPI     │  │  Gmail API  │
    │  (Auth+DB)  │  │  Backend     │  │  (Google)   │
    │  :5432      │  │  :8000       │  │             │
    └──────┬──────┘  └───────┬──────┘  └─────────────┘
           │                 │
           │          ┌──────┴──────────────────────┐
           │          │     AI Services Layer        │
           │          │  LangGraph │ HuggingFace     │
           │          │  Stable SD │ ChromaDB (RAG)  │
           │          └──────┬──────────────────────-┘
           │                 │
           │          ┌──────▼──────┐
           │          │    Redis    │
           │          │   Cache     │
           └──────────┘  :6379      │
                         └──────────┘
```

---

## 2. Authentication Architecture

### Flow: Multi-Step Cross-Verification

```
Option A (Google OAuth):
  1. User clicks "Continue with Google"
  2. Supabase Auth → Google OAuth → returns email (auto-verified)
  3. Frontend: check if phone_verified = false in users table
  4. Redirect → /auth/complete-profile
  5. Collect: first_name, last_name, phone (with country code)
  6. Send OTP via Supabase Auth (Twilio)
  7. User verifies OTP → phone_verified = true
  8. Redirect → /app/home

Option B (Phone Number):
  1. User enters country code + phone number
  2. Supabase sends OTP SMS
  3. User verifies OTP → phone_verified = true
  4. Redirect → /auth/complete-profile
  5. Collect: first_name, last_name, email
  6. Supabase sends verification email
  7. User clicks link → email_verified = true
  8. Redirect → /app/home
```

### Middleware Guard (`frontend/middleware.ts`)
```
/app/* routes → check session exists
             → check users.phone_verified = true
             → check users.email_verified = true
             → if any false → redirect to /auth/complete-profile
```

### Supabase Auth Tables (auto-managed)
- `auth.users` — Supabase manages, includes email/phone/provider
- `public.users` — Our custom extension with: name, DOB, gender, vault, phone_verified, email_verified

---

## 3. Trip Directory System

### Data Model
```
users (1)
  └── trips (many)
        ├── name: string (unique per user, auto-named "New Trip N")
        ├── status: "idle" | "planning" | "active" | "completed"
        ├── destination: string
        ├── start_date / end_date
        └── itinerary_id (FK → itineraries)
```

### Frontend State
```
tripStore {
  trips: Trip[]                  // All user trips (fetched on login)
  activeTripId: string | null    // Currently selected trip
  isDirectoryOpen: boolean       // File-system UI state
}
```

### Directory UI Logic
```
TopBar → TripDirectory component:
  TRIPS/                         ← fixed root
    ├── "Paris Adventure"        ← trip 1 (click to activate)
    ├── "Tokyo 2025"             ← trip 2
    └── + Create a TRIP          ← always last, creates new trip

On "Create a TRIP" click:
  1. POST /api/trips { name: "New Trip N" }
  2. tripStore.setActiveTrip(newTripId)
  3. Navigate to /app/home/{newTripId}
  4. Show Idle State (no itinerary yet)
```

---

## 4. Safety Zone Architecture (The 5-Pillar Core)

### Pillar 1 + 2 Combined: Sentiment → Zones

```
SCORING PIPELINE (runs on backend, cached in Redis):

Step 1: Fetch data for location
  ├── Google Places API → get neighborhood POIs + reviews
  │     └── Extract star ratings (1–5 scale)
  └── Reddit API → search "r/travel + destination + safety"
        └── Fetch top 50 posts/comments

Step 2: HuggingFace sentiment inference
  ├── Google reviews text → sentiment model → POSITIVE/NEGATIVE/NEUTRAL
  │     └── Map to 0–5: POS=5, NEU=3, NEG=1
  └── Reddit posts text → same model → same mapping

Step 3: Score calculation
  └── S = (google_normalized_score × 0.6) + (social_score × 0.4)

Step 4: Zone assignment
  ├── S > 3.0  → GREEN  (Safe, visit recommended)
  ├── 2.0–3.0  → WHITE  (Neutral, proceed with awareness)
  └── S < 2.0  → RED    (Avoid, redirect to nearest green)

Step 5: Store in Supabase safety_zones table
  └── GeoJSON polygon + score + zone_color + last_updated

Step 6: Cache in Redis
  └── Key: "zone:{location_hash}" TTL: 86400s (24 hours)
```

### Leaflet Map Rendering
```
Frontend fetches: GET /api/zones?lat={lat}&lng={lng}&radius=2km

Response: GeoJSON FeatureCollection {
  features: [
    {
      type: "Feature",
      geometry: { type: "Polygon", coordinates: [...] },
      properties: { score: 3.7, zone: "GREEN", neighborhood: "Montmartre" }
    }
  ]
}

Leaflet renders each feature with:
  fillColor: zone === "GREEN" ? "#22c55e" : zone === "RED" ? "#ef4444" : "#e2e8f0"
  fillOpacity: 0.35
  weight: 1
  color: same as fillColor at opacity 0.7
```

---

## 5. AI Planner Architecture (LangGraph)

### State Machine
```
States: IDLE → INPUT_COLLECTING → VALIDATING_BUDGET → PLANNING → CUSTOMISING → CONFIRMING → DONE

Transitions:
  INPUT_COLLECTING → VALIDATING_BUDGET  (on generate click)
  VALIDATING_BUDGET → PLANNING          (budget passes)
  VALIDATING_BUDGET → STRIKE_1          (budget < min, first time)
  STRIKE_1 → VALIDATING_BUDGET          (user re-enters budget)
  STRIKE_1 → STRIKE_2                   (budget still < min)
  STRIKE_2 → [BLOCKED]                  (API call blocked, UI disabled)
  PLANNING → CUSTOMISING                (user clicks pencil on itinerary)
  CUSTOMISING → CONFIRMING              (user types "confirm" or clicks confirm)
  CONFIRMING → DONE                     (booking placeholders shown)
```

### LangGraph Node Definitions
```python
# Nodes in the graph:
nodes = {
  "validate_budget":   validates UserBudget against min_suggested_budget,
  "strike_handler":    increments strike_count, returns warning or block,
  "generate_plan":     calls LLM with RAG context to generate itinerary,
  "generate_alts":     generates 2 alternative itineraries,
  "tag_activities":    assigns hashtags to each activity,
  "chat_responder":    handles free-form customisation chat,
  "confirm_handler":   finalises itinerary, triggers image generation,
  "image_trigger":     calls Stable Diffusion (ONLY if not replanning),
}
```

### Budget Guardrail Logic (Two-Strike)
```
min_suggested_budget calculation:
  1. Fetch average hotel cost for destination (Google/Booking.com scrape)
  2. Fetch average daily meal cost (Google Places price_level)
  3. Fetch average transport cost (Skyscanner API or Google Flights estimate)
  4. Sum × duration + 20% buffer = min_suggested_budget

Strike 1: UserBudget < min_suggested_budget
  → Warning UI shown
  → LLM call PROCEEDS but notes budget constraint
  → strike_count = 1

Strike 2: User re-submits with budget still < min_suggested_budget
  → Input field DISABLED
  → Hard error UI: "Minimum budget for {destination} is {min}"
  → LLM call BLOCKED (saves API cost)
  → strike_count = 2
```

---

## 6. Gmail Integration Architecture

```
User grants Gmail readonly scope
         │
         ▼
Gmail OAuth token stored in Supabase (encrypted)
         │
         ▼
Periodic sync (on itinerary page load):
  POST /api/gmail/sync { trip_id, start_date, destination }
         │
         ▼
gmail_reader.py:
  Search: "subject:(booking OR reservation OR confirmation) after:{start_date}"
  Fetch: email body HTML → parse with BeautifulSoup
         │
         ▼
booking_parser.py:
  Extract: booking reference, service type, date, cost, confirmation number
  Classify: flight | train | bus | hotel | other
  Match: does this match the trip destination + dates?
         │
         ▼
If match:
  supabase_updater.py:
    INSERT INTO reservations (trip_id, type, details, source='gmail')
    ON CONFLICT (confirmation_number) DO NOTHING  ← prevents duplicates
```

---

## 7. SOS Architecture

```
User triggers SOS (button click)
         │
         ▼
Frontend: sosStore.triggerSOS()
  1. Get current GPS coordinates (navigator.geolocation)
  2. Get current timestamp
  3. Build SOS message from custom template:
     "{name} is in an emergency situation!
      Location: {lat}, {lng}
      Time: {timestamp}
      Google Maps: https://maps.google.com/?q={lat},{lng}"
         │
         ▼
POST /api/sos {
  user_id, coordinates, timestamp, contacts: [contact1, contact2, contact3]
}
         │
         ▼
Backend sos handler:
  1. Fetch user's emergency_contacts from Supabase
  2. For each contact:
     ├── Send SMS via Twilio (phone number)
     └── Send email via SendGrid or Resend (email address)
  3. Also display local emergency numbers on SOS screen
     └── Fetched by: GET /api/emergency-contacts?lat={lat}&lng={lng}
         Uses Google Places API: type=police, type=hospital, type=fire_station
```

---

## 8. Data Flow Diagram: Creating a Trip

```
1. User clicks "+ Create a TRIP"
           ↓
2. POST /api/trips → Supabase INSERT trips
           ↓
3. Home shows Idle State
           ↓
4. User types in "Where to?" search bar
           ↓
5. GET /api/destinations?q={query}
   → Google Places Autocomplete
           ↓
6. User selects destination
   → Navigate to /destination/{id}
           ↓
7. Destination Overview Page loads:
   → GET /api/zones (Leaflet static map)
   → GET /api/destinations/{id}/summary
   → (Images: pre-generated or generate on first view)
           ↓
8. User clicks "continue -->"
   → Navigate to /planner/{tripId}?destination={id}
           ↓
9. Planner Screen:
   → TO field pre-filled
   → FROM field: browser geolocation
           ↓
10. User fills inputs → clicks "Generate Itinerary"
    → POST /api/planner (LangGraph)
    → 15s minimum loading animation
           ↓
11. Itinerary rendered in right panel
    → Alternative itineraries below
           ↓
12. User customises via chat
    → PUT /api/planner/{sessionId}
           ↓
13. User confirms
    → PATCH /api/trips/{tripId} { status: "active", itinerary_id }
    → POST /api/generate-image (Stable Diffusion)
    → Navigate to /app/home/{tripId} (Active State)
```

---

## 9. Environment Architecture

### Local Development
```
:3000  →  Next.js (pnpm dev)
:8000  →  FastAPI (uvicorn)
:5432  →  Supabase local (Docker)
:6379  →  Redis (Docker)
:8001  →  ChromaDB (Docker)
```

### Production
```
Vercel        →  Next.js frontend
Cloud Run     →  FastAPI backend (Docker container)
Supabase.io   →  Hosted PostgreSQL + Auth
Upstash       →  Hosted Redis
Replicate     →  Stable Diffusion API
```
