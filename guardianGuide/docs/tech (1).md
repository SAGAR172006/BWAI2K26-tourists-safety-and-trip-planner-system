# tech.md — GuardianGuide Technical Specification

## 1. Stack Overview

Every tool in this stack was chosen with three constraints in mind:
1. **Free tier first** — no paid services unless unavoidable
2. **Hackathon speed** — fast to set up, well-documented
3. **Production-ready architecture** — judges can see it scales

---

## 2. Frontend

### Framework: Next.js 14 (App Router)
- **Why:** File-based routing maps 1:1 to our screen list. Server Components reduce bundle size. API routes mean we don't expose backend URLs to the browser.
- **Version:** 14.x with App Router (not Pages Router)
- **Rendering strategy:** Client Components for interactive screens (map, chat, planner). Server Components for static pages (destination overview, auth layouts).

### Language: TypeScript (strict mode)
- **Why:** Catches bugs at compile time. Shared types between frontend and backend API contracts.
- **Config:** `strict: true` in tsconfig. No `any` types allowed.

### Styling: Tailwind CSS 3.x
- **Why:** Utility-first, no context switching between CSS files and components. Design tokens defined in `tailwind.config.ts`.
- **Custom tokens defined:** color palette, font families, spacing scale, border radius, box shadows (glassmorphism values).

### State Management: Zustand
- **Why:** Simpler than Redux. No boilerplate. Works perfectly with React Server Components (client-side only stores).
- **Stores:**
  - `authStore` — session, user profile, verified status
  - `tripStore` — all trips, active trip ID, trip directory state
  - `plannerStore` — planner form inputs, AI output, strike counter
  - `budgetStore` — expenses array, remaining budget, currency
  - `uiStore` — panel open state, loading flags, modal state
  - `sosStore` — emergency contacts, custom message, SOS trigger state

### Maps: Leaflet.js 1.9.x
- **Why:** Open source, free, no API key required for base map tiles (OpenStreetMap). GeoJSON polygon support built-in.
- **Tile provider:** OpenStreetMap (free) for dev. Optionally Mapbox (free tier 50k requests/month) for production polish.
- **React wrapper:** `react-leaflet` v4 for component-based map rendering.
- **Zone rendering:** GeoJSON polygons with `fillColor` driven by safety score:
  - Score > 3.0 → `#22c55e` (green-500)
  - Score 2.0–3.0 → `#f5f5f5` (neutral white)
  - Score < 2.0 → `#ef4444` (red-500)
- **Fill opacity:** 0.35 — visible without hiding base map detail.

### Animation: Framer Motion
- **Why:** Production-grade animations. Used for destination slideshow, panel slide-in, loading states.
- **Key animations:**
  - Destination card swap: `AnimatePresence` with `initial/exit` opacity + translateX
  - Text transform (0.5s delay after card): same `AnimatePresence` with stagger
  - Side panel: slide from right with glassmorphism blur backdrop
  - "..." loader: custom dot pulse with CSS keyframes

### Date Picker: react-day-picker
- **Why:** Accessible, lightweight, supports date range selection out of the box.
- **Constraint:** Max selectable date = today + 6 months (enforced at component level).

### Forms: react-hook-form + Zod
- **Why:** Minimal re-renders for form inputs. Zod schema validation shared with backend types.

---

## 3. Backend

### Framework: FastAPI (Python 3.11)
- **Why:** Async by default. Auto-generates OpenAPI docs. Best Python framework for AI/ML integration. Native Pydantic support for request validation.
- **Server:** Uvicorn (ASGI)
- **API structure:** All routes under `/api/v1/` prefix. Each feature is its own router module.

### AI Orchestration: LangChain + LangGraph
- **LangChain:** Base abstraction for LLM calls, prompt templates, output parsers.
- **LangGraph:** Stateful agent graph for the planner chatbot. Manages conversation state across:
  - Discovery phase (user inputs)
  - Planning phase (itinerary generation)
  - Customisation phase (pencil button edits)
  - Confirmation phase (booking placeholders)
- **State schema:** Typed TypedDict with fields: `messages`, `budget`, `strike_count`, `itinerary`, `destination`, `confirmed`.

### LLM: OpenAI GPT-4o (via LangChain)
- **Why:** Best reasoning for complex trip planning. LangChain abstraction means we can swap to Claude or Gemini without rewriting logic.
- **Free tier note:** OpenAI has no permanent free tier. Budget: use `gpt-4o-mini` during dev (cheaper), `gpt-4o` for demo. Rate limit enforced in `middleware/rate_limiter.py`.

### Sentiment Analysis: HuggingFace
- **Model:** `cardiffnlp/twitter-roberta-base-sentiment-latest`
- **Why:** Best-in-class for social media text. Free inference API (rate limited) or local inference.
- **Pipeline:** scrape → preprocess → batch inference → score → cache in Redis
- **Formula:** `S = (google_stars_normalized × 0.6) + (social_sentiment_score × 0.4)`
- **Google stars normalization:** raw 1–5 stars → 0–5 scale (no change needed)
- **Social sentiment:** HuggingFace returns POSITIVE/NEGATIVE/NEUTRAL → mapped to 0–5 scale

### Image Generation: Stable Diffusion (via Replicate API)
- **Why:** Replicate has a free tier. No GPU required on our server.
- **Model:** `stability-ai/stable-diffusion-3` on Replicate
- **Trigger rule:** Only called when user clicks confirm on final itinerary. NEVER during re-planning.
- **Prompt template:** `"Photorealistic travel photography of {destination}, golden hour, cinematic, 8k, wide angle"`
- **Cost guard:** `trigger_guard.py` checks `is_replanning` flag. If true, returns cached image or placeholder.

### RAG (Retrieval-Augmented Generation): LangChain + Chroma
- **Purpose:** Give the planner chatbot access to current crime/safety reports for accurate zone scoring.
- **Vector DB:** ChromaDB (local, free, no external service needed)
- **Embedding model:** `sentence-transformers/all-MiniLM-L6-v2` (free, runs locally)
- **Documents ingested:** Crime reports PDFs, tourism safety bulletins, travel advisories
- **Retrieval:** Top-3 most relevant chunks injected into planner system prompt

### Caching: Redis
- **Version:** Redis 7.x (Docker container)
- **What gets cached:**
  - Sentiment scores per location: 24-hour TTL (avoid redundant scraping)
  - Rate limit counters: 60-second sliding window
  - Session tokens: matches Supabase session expiry
- **Client:** `redis-py` async client

### Translation: HuggingFace
- **Text translation model:** `Helsinki-NLP/opus-mt-{src}-{tgt}` (language-specific)
- **OCR:** `pytesseract` + Pillow for image-to-text
- **Rate limit:** 2 requests per minute per user (enforced in middleware)

---

## 4. Database: Supabase

### Why Supabase
- Free tier: 500MB database, 2GB bandwidth, 50,000 monthly active users
- Built-in Auth (Google OAuth + Phone OTP) saves weeks of work
- Row Level Security (RLS) at database level — not application level
- Realtime subscriptions for live location updates

### Auth Strategy
- **Google OAuth:** Supabase handles the OAuth flow. Email auto-verified.
- **Phone OTP:** Supabase Auth + Twilio integration. Country code + number → OTP SMS.
- **Mandatory cross-verification:** Custom middleware in `middleware.ts` checks that both email AND phone are verified before allowing access to `/app/*` routes. If either is missing, redirects to `/auth/complete-profile`.

### Row Level Security (RLS) Policy Pattern
Every table follows this pattern:
```sql
-- Users can only read/write their own rows
CREATE POLICY "owner_only" ON table_name
  FOR ALL USING (auth.uid() = user_id);
```
No exceptions. Server-side admin operations use `SUPABASE_SERVICE_KEY` (never exposed to frontend).

### Key Tables
| Table | Purpose |
|---|---|
| `users` | Profile + verified flags + vault |
| `trips` | Trip metadata (name, status, destination) |
| `itineraries` | Full itinerary JSON + tags + budget |
| `expenses` | Individual expense records |
| `reservations` | Flight/train/stay bookings (manual + Gmail-synced) |
| `safety_zones` | GeoJSON polygons + sentiment score per zone |
| `tourist_spots` | POIs with category, coords, rating |
| `emergency_contacts` | Up to 3 contacts per user |
| `visited_places` | Places marked visited by user |

---

## 5. Security Layer

### Rate Limiting (Redis-based)
```python
# Pattern: {user_id}:{endpoint} → request count
# TTL: 60 seconds sliding window
# Limit: 2 requests/minute for AI endpoints
# Limit: 10 requests/minute for data endpoints
```

### PII Redaction (before LLM calls)
- Strip: full names, exact addresses, phone numbers, email addresses
- Replace with: `[NAME]`, `[ADDRESS]`, `[PHONE]`
- Library: `presidio-analyzer` (Microsoft, free, open-source)

### Prompt Injection Protection
- All user input wrapped in delimiters: `[USER_INPUT]...[/USER_INPUT]`
- System message placed in `system` role (never injectable by user)
- Budget logic lives in system message — not in user message

### JWT Validation
- Every FastAPI request validates Supabase JWT in `auth_guard.py`
- Token extracted from `Authorization: Bearer {token}` header
- Validated against Supabase public key (no DB call needed)

---

## 6. Gmail API Integration

### OAuth Scope
- Request only: `https://www.googleapis.com/auth/gmail.readonly`
- Never request write access. Read-only is sufficient.

### What We Fetch
- Search query: `subject:(booking OR reservation OR ticket OR confirmation) after:{trip_start_date}`
- Parse: flight confirmations, hotel bookings, train tickets
- Match against active trip itinerary dates and destination

### Security
- Gmail OAuth token stored in Supabase (encrypted at rest)
- Token never logged, never sent to LLM
- Full audit in `docs/gmail-security-audit.md`

---

## 7. DevOps

### Local Development
```bash
docker-compose up -d    # Redis + Supabase local emulator
pnpm dev                # Next.js frontend :3000
uvicorn app.main:app    # FastAPI backend :8000
```

### Deployment (Free Tier)
| Service | Platform | Free Tier |
|---|---|---|
| Frontend | Vercel | Free (hobby) |
| Backend | Google Cloud Run | 2M requests/month free |
| Database | Supabase | 500MB free |
| Cache | Upstash Redis | 10k commands/day free |
| Vector DB | Chroma (local) or Pinecone free tier | Free |

### CI/CD
- On PR: lint + typecheck + unit tests (GitHub Actions)
- On merge to main: auto-deploy frontend to Vercel
- Backend: manual deploy (docker build + push to GCR)

---

## 8. Performance Targets

| Metric | Target |
|---|---|
| First Contentful Paint | < 1.5s |
| Map render (Leaflet) | < 2s |
| Sentiment score (cached) | < 100ms |
| Sentiment score (fresh) | < 8s |
| AI itinerary generation | 15–45s (with loading animation) |
| Image generation | 10–20s (Stable Diffusion) |
| SOS trigger to sent | < 3s |
