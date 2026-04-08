# GuardianGuide 🛡️
### Smart Tourist Safety & AI Trip Planning Platform

GuardianGuide is a web-based travel companion that merges hyper-personalized AI trip planning with real-time location-aware safety monitoring. It acts as a "Guardian" throughout every journey — proactively keeping users in safe zones while building perfect itineraries within budget.

---

## What It Does

| Feature | Description |
|---|---|
| 🗺️ Safety Mini-Map | Live Leaflet map with Green/White/Red zones based on sentiment scoring |
| 🤖 AI Trip Planner | LangGraph-powered chatbot that plans trips, enforces budgets, and books reservations |
| 📊 Sentiment Engine | Scores locations using Google Reviews + Reddit data via HuggingFace |
| 🚨 SOS System | One-click emergency alerts with live coordinates to contacts + local services |
| 📧 Gmail Sync | Automatically fetches booking confirmations and adds them to your trip |
| 💰 Budget Tracker | Real-time expense tracking with itinerary re-planning on budget change |

---

## Tech Stack (Quick Reference)

```
Frontend   →  Next.js 14 (App Router) + TypeScript + Tailwind CSS + Zustand
Backend    →  FastAPI (Python) + LangGraph + HuggingFace + Redis
Database   →  Supabase (PostgreSQL + RLS + Auth)
Maps       →  Leaflet.js + GeoJSON polygons
AI Models  →  LangGraph agent, HuggingFace sentiment, Stable Diffusion
Evaluation →  LangSmith tracing + Ragas metrics
DevOps     →  Docker + GitHub Actions + Vercel (frontend)
```

---

## Project Structure (Top Level)

```
guardianGuide/
├── frontend/         # Next.js web application
├── backend/          # FastAPI Python AI services
├── supabase/         # Database migrations + RLS policies
├── docs/             # All documentation (you are here)
└── docker-compose.yml
```

---

## Quick Start (Local Development)

### Prerequisites
- Node.js 20+
- Python 3.11+
- Docker Desktop
- pnpm (`npm install -g pnpm`)

### Step 1 — Clone and install
```bash
git clone https://github.com/your-org/guardianGuide.git
cd guardianGuide
```

### Step 2 — Set up environment variables
```bash
# Copy the template files — NEVER commit real values
cp .env.example .env.local
cp backend/.env.example backend/.env
```
Fill in values in `.env.local` and `backend/.env` (see `docs/security-checklist.md` for what each key does).

### Step 3 — Start the full local stack
```bash
docker-compose up -d        # Starts Redis + Supabase local
cd frontend && pnpm install && pnpm dev   # Frontend on :3000
cd backend && pip install -r requirements.txt && uvicorn app.main:app --reload  # Backend on :8000
```

### Step 4 — Run Supabase migrations
```bash
npx supabase db push        # Applies all migrations in /supabase/migrations/
```

---

## Environment Variables Reference

### Frontend (`frontend/.env.local`)
```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_GOOGLE_CLIENT_ID=
NEXT_PUBLIC_MAPBOX_TOKEN=         # For Leaflet tile layer
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Backend (`backend/.env`)
```env
SUPABASE_URL=
SUPABASE_SERVICE_KEY=             # Server-side only, never expose to frontend
OPENAI_API_KEY=                   # For LangGraph LLM calls
HUGGINGFACE_API_KEY=
GOOGLE_API_KEY=                   # For Places/Reviews API
REDDIT_CLIENT_ID=
REDDIT_CLIENT_SECRET=
GMAIL_CLIENT_ID=
GMAIL_CLIENT_SECRET=
LANGSMITH_API_KEY=
REDIS_URL=redis://localhost:6379
STABLE_DIFFUSION_API_KEY=
```

> ⚠️ **Never hardcode any of the above values. Store in .env files only. See `docs/security-checklist.md`.**

---

## Key Documentation Files

| File | Purpose |
|---|---|
| `docs/tech.md` | Full technical stack decisions + justifications |
| `docs/design.md` | UI/UX design system, color tokens, component patterns |
| `docs/architecture.md` | System architecture + data flow diagrams |
| `docs/auth-flow.md` | Multi-step authentication logic |
| `docs/ai-pipeline.md` | LangGraph + RAG + Stable Diffusion pipeline |
| `docs/sentiment-formula.md` | Zone scoring formula + implementation |
| `docs/two-strike-rule.md` | Budget guardrail logic |
| `docs/golden-loop.md` | LangSmith + Ragas evaluation system |
| `docs/security-checklist.md` | Security + privacy requirements |
| `docs/geofencing.md` | Map zones + Leaflet GeoJSON implementation |
| `docs/gmail-security-audit.md` | Gmail API credential safety |
| `docs/hackathon-demo-script.md` | 5-minute judge presentation flow |

---

## Team + Hackathon Context

- **Event:** BuildWithAI – INNOVATEX 4.0, Presidency University, Bengaluru
- **Duration:** 24-hour hackathon
- **Mode:** Hybrid (Offline + Online)
- **Goal:** Working MVP demonstrating all 5 AI pillars within 24 hours
