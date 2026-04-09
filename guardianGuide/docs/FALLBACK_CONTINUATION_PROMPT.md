# GUARDIANGU IDE — FALLBACK CONTINUATION PROMPT
# ============================================================
# USE THIS WHEN:
#   - Claude CLI hits context limit mid-build
#   - Switching to Cursor / Windsurf / GitHub Copilot
#   - Starting a new Claude CLI session to continue
#
# HOW TO USE:
#   1. Paste this ENTIRE file into the new AI session
#   2. The AI will read the current state and continue
#   3. Never start from scratch — always continue from checkpoint
# ============================================================

You are a senior full-stack engineer continuing work on GuardianGuide.
A previous AI session was building this project and stopped mid-way.
Your job is to assess what's done and complete everything remaining.

=============================================================
STEP 1 — ORIENT YOURSELF (do this before anything else)
=============================================================

Read these files to understand the full project:
1. docs/README.md           — project overview
2. docs/tech.md             — tech stack decisions
3. docs/design.md           — UI/UX spec (colors, typography, layouts)
4. docs/architecture.md     — system architecture
5. PROGRESS.md              — what was completed last session (if exists)
6. CLAUDE_CLI_MASTER_PROMPT.md — the original build instructions

After reading, do a full audit of the codebase:

BACKEND AUDIT — for each file, determine: COMPLETE | PARTIAL | EMPTY | MISSING
Check these:
  backend/app/main.py
  backend/app/config.py
  backend/app/cache/redis_client.py
  backend/app/cache/sentiment_cache.py
  backend/app/middleware/auth_guard.py
  backend/app/middleware/rate_limiter.py
  backend/app/middleware/pii_redactor.py
  backend/app/services/sentiment/foursquare_scraper.py
  backend/app/services/sentiment/web_sentiment_scraper.py
  backend/app/services/sentiment/hf_sentiment.py
  backend/app/services/sentiment/score_calculator.py
  backend/app/services/sentiment/zone_mapper.py
  backend/app/services/planner/langgraph_agent.py
  backend/app/services/planner/two_strike_guard.py
  backend/app/services/planner/budget_validator.py
  backend/app/services/planner/itinerary_builder.py
  backend/app/services/planner/tag_engine.py
  backend/app/services/image_gen/unsplash_fetcher.py
  backend/app/services/image_gen/trigger_guard.py
  backend/app/services/translation/text_translator.py
  backend/app/services/translation/ocr_translator.py
  backend/app/services/gmail/gmail_reader.py
  backend/app/services/gmail/booking_parser.py
  backend/app/services/gmail/supabase_updater.py
  backend/app/api/zones.py
  backend/app/api/planner.py
  backend/app/api/sentiment.py
  backend/app/api/translate.py
  backend/app/api/image_gen.py
  backend/app/api/gmail_sync.py
  backend/app/api/sos.py

FRONTEND AUDIT — same check:
  frontend/app/layout.tsx
  frontend/app/globals.css
  frontend/middleware.ts
  frontend/store/authStore.ts
  frontend/store/tripStore.ts
  frontend/store/plannerStore.ts
  frontend/store/budgetStore.ts
  frontend/store/uiStore.ts
  frontend/store/sosStore.ts
  frontend/lib/supabaseClient.ts
  frontend/app/(auth)/login/page.tsx
  frontend/app/(auth)/verify-otp/page.tsx
  frontend/app/(auth)/complete-profile/page.tsx
  frontend/app/(auth)/verify-email/page.tsx
  frontend/components/auth/PhoneInput.tsx
  frontend/components/auth/OtpInput.tsx
  frontend/components/layout/TopBar.tsx
  frontend/components/layout/SidePanel.tsx
  frontend/components/layout/TripDirectory.tsx
  frontend/app/(app)/home/page.tsx
  frontend/app/(app)/home/[tripId]/page.tsx
  frontend/components/home/idle/IdleHomeScreen.tsx
  frontend/components/home/idle/DestinationSlideshow.tsx
  frontend/components/home/idle/SearchBar.tsx
  frontend/components/home/idle/WaitingSection.tsx
  frontend/components/home/active/ActiveHomeScreen.tsx
  frontend/components/home/active/SafetyMiniMap.tsx
  frontend/components/home/active/MustVisitCard.tsx
  frontend/components/home/active/MustAvoidCard.tsx
  frontend/components/home/active/AlreadyVisitedCard.tsx
  frontend/components/home/active/ReservationsPanel.tsx
  frontend/app/(app)/destination/[destinationId]/page.tsx
  frontend/app/(app)/planner/[tripId]/page.tsx
  frontend/components/planner/PlannerScreen.tsx
  frontend/components/planner/BudgetInput.tsx
  frontend/components/planner/LoadingAnimation.tsx
  frontend/components/planner/ChatWindow.tsx
  frontend/app/(app)/itinerary/[tripId]/page.tsx
  frontend/app/(app)/sos/page.tsx
  frontend/app/(app)/user/page.tsx

=============================================================
STEP 2 — RUN SYNTAX CHECKS ON EXISTING CODE
=============================================================

Run these commands to find any broken files from the previous session:

  cd backend && python -m py_compile app/main.py 2>&1
  cd backend && python -m py_compile app/config.py 2>&1
  cd frontend && npx tsc --noEmit 2>&1 | head -50

Fix any syntax errors before adding new code.
A broken import in one file can cascade and break everything else.

=============================================================
STEP 3 — COMPLETE REMAINING FILES
=============================================================

Based on your audit, complete all PARTIAL, EMPTY, and MISSING files.
Follow the exact specifications in CLAUDE_CLI_MASTER_PROMPT.md for each file.

Priority order (most critical first):
1. Backend foundation (config, redis, middleware) — nothing works without these
2. score_calculator.py and zone_mapper.py — core algorithm files
3. zones.py API endpoint — needed for map to work
4. Frontend foundation (globals.css, layout, stores) — needed for all screens
5. Auth screens — users can't access anything without this
6. Home screen (idle + active) — first thing judges see
7. Planner screen — main feature
8. Remaining screens (itinerary, SOS, user)

=============================================================
STEP 4 — CRITICAL RULES (same as master prompt)
=============================================================

1. NEVER leave a file incomplete. If you can't finish it, write a comment
   at the top: "// INCOMPLETE: stopped at [function name]" so the next
   session knows exactly where to continue.

2. For images: use Unsplash static URLs (no API key needed):
   Paris:     https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800
   Tokyo:     https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800
   Bali:      https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800
   New York:  https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800
   Istanbul:  https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800
   Santorini: https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800
   Kyoto:     https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800
   Dubai:     https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800
   Generic:   https://placehold.co/800x600/111118/6C63FF?text=GuardianGuide

3. Logo: always inline SVG shield, never an image file.

4. Leaflet maps: ALWAYS dynamic import with ssr: false.

5. All colors: CSS variables from design.md. Never hardcode hex.

6. LLM: use Gemini (ChatGoogleGenerativeAI) not OpenAI.

7. Images: use Unsplash API (unsplash_fetcher.py) not Stable Diffusion.

8. Emergency contacts: use Overpass API not Google Places.

9. Social sentiment: use web_sentiment_scraper.py not Reddit.

=============================================================
STEP 5 — BEFORE STOPPING
=============================================================

When you are about to hit context limit or finish:

1. Run final checks:
   cd backend && python -m py_compile app/main.py
   cd frontend && npx tsc --noEmit

2. Update PROGRESS.md with current state

3. Commit everything:
   git add .
   git commit -m "wip: continuation session - [what you completed]"

4. Print a clear summary:
   COMPLETED THIS SESSION: [list files]
   STILL REMAINING: [list files]
   NEXT SESSION SHOULD START WITH: [specific file/function]

=============================================================
START: Read PROGRESS.md first, then run the audit, then build.
=============================================================
