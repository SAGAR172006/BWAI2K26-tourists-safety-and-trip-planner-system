# GUARDIANGU IDE — CLAUDE CLI MASTER BUILD PROMPT
# ============================================================
# HOW TO USE:
#   1. Open VS Code terminal
#   2. Navigate to project root: cd guardianGuide
#   3. Start Claude CLI: claude
#   4. Paste EVERYTHING below this line into the Claude CLI prompt
# ============================================================

You are a senior full-stack engineer. Your job is to build the complete
GuardianGuide web application from scratch — production ready, no placeholders
in logic, fully working code. You will work autonomously, reading all docs
first, then building feature by feature without stopping.

=============================================================
STEP 0 — READ ALL DOCS BEFORE WRITING A SINGLE LINE OF CODE
=============================================================

Before doing anything else, read these files in this exact order:
1. docs/README.md
2. docs/tech.md
3. docs/design.md
4. docs/architecture.md
5. docs/auth-flow.md
6. docs/ai-pipeline.md
7. docs/sentiment-formula.md
8. docs/two-strike-rule.md
9. docs/security-checklist.md
10. docs/geofencing.md
11. docs/gmail-security-audit.md
12. AI_AUTOPILOT_PROMPTS.md
13. ENV_VARIABLES.md
14. TEAM_ROADMAP.md

Confirm you have read all files before proceeding.

=============================================================
CORE RULES — FOLLOW THESE WITHOUT EXCEPTION
=============================================================

1. NEVER leave a file blank or with just a comment. Every file must have
   complete, working, production-ready code.

2. NEVER use TODO comments. If something needs implementing, implement it.

3. For ALL images and placeholders use this pattern:
   - Logo: a shield SVG icon rendered inline in JSX (no image file needed)
   - Destination slideshow: use these 8 Unsplash static URLs as the data array
     (these never expire and need no API key):
     Paris:     https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800
     Tokyo:     https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800
     Bali:      https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800
     New York:  https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800
     Istanbul:  https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800
     Santorini: https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800
     Kyoto:     https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800
     Dubai:     https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800
   - Any other placeholder image: use https://placehold.co/WIDTHxHEIGHT/111118/6C63FF?text=GuardianGuide

4. Read design.md color system and apply EVERY color as CSS variables.
   Never hardcode hex values in components — always use var(--color-name).

5. Every Python file must have proper error handling with try/except.
   Never let an unhandled exception crash the server.

6. For Leaflet maps: ALWAYS use dynamic import with ssr: false. This is
   non-negotiable — Leaflet breaks Next.js SSR without this.

7. Run these verification commands after each major section:
   Backend: cd backend && python -m py_compile app/main.py (check for syntax errors)
   Frontend: cd frontend && npx tsc --noEmit (check for TypeScript errors)

8. Commit after each completed section:
   git add . && git commit -m "feat: [section name] complete"

=============================================================
BUILD ORDER — EXECUTE IN THIS EXACT SEQUENCE
=============================================================

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 1: BACKEND FOUNDATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Build these files completely:

── backend/app/config.py ──
Use pydantic-settings BaseSettings. Load from .env file.
Include ALL variables from ENV_VARIABLES.md backend section.
Export singleton: settings = Settings()
Add model_config = SettingsConfigDict(env_file=".env", extra="ignore")

── backend/app/cache/redis_client.py ──
Async Redis client using redis.asyncio.
Functions: get(key), set(key, value, ttl=None), delete(key), exists(key), incr(key, ttl)
Connect from settings.REDIS_URL
On connection error: log warning, return None (never crash)

── backend/middleware/auth_guard.py ──
FastAPI dependency that validates Supabase JWT.
Extract Bearer token from Authorization header.
Use supabase-py to verify: supabase.auth.get_user(token)
Return user dict {id, email} on success.
Raise HTTP 401 with clear message on failure.

── backend/middleware/rate_limiter.py ──
Class RateLimiter(max_calls: int, period_seconds: int)
Implements __call__ as FastAPI dependency
Redis key: "rl:{user_id}:{endpoint_name}"
Use Redis INCR + EXPIRE pattern for sliding window
Raise HTTP 429 with Retry-After header when exceeded
Two instances at module level:
  ai_limiter = RateLimiter(max_calls=2, period_seconds=60)
  general_limiter = RateLimiter(max_calls=10, period_seconds=60)

── backend/middleware/pii_redactor.py ──
Function: redact_pii(text: str) -> str
Use simple regex patterns (avoid presidio dependency complexity):
  Email: replace with [EMAIL]
  Phone: replace with [PHONE]
  Names pattern: not needed (too complex, skip)
Return cleaned text

── backend/app/main.py ──
Complete FastAPI app. Include:
- CORSMiddleware from settings.ALLOWED_ORIGINS
- All routers from api/ folder with /api/v1 prefix
- Global exception handler returning JSON
- Startup event: test Redis, log ready message
- /api/v1/health endpoint inline (simple, no separate file needed)

── backend/app/models/planner_models.py ──
Pydantic models:
  PlannerRequest: from_location, to_location, start_date, end_date,
                  budget, currency, expectations (max 500 chars)
  PlannerResponse: status (success/strike1/strike2), itinerary?,
                   alternatives?, session_id?, min_budget?, message?
  ChatRequest: session_id, message
  ChatResponse: response, suggested_action?

── backend/app/models/zone_models.py ──
  ZoneType: Enum GREEN, WHITE, RED
  SafetyZone: location_hash, destination, geojson, score,
              zone, google_score, social_score, sample_size
  ZoneResponse: type FeatureCollection with features array

── backend/app/models/translate_models.py ──
  TranslateTextRequest: text, source_lang, target_lang
  TranslateTextResponse: translated_text, detected_language?
  TranslateImageResponse: original_text, translated_text

After writing all these, run:
  cd backend && python -m py_compile app/main.py
  cd backend && python -m py_compile app/config.py

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 2: SENTIMENT ENGINE (COMPLETE IMPLEMENTATION)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

These are the files that are currently BLANK. Build them completely.

── backend/app/services/sentiment/foursquare_scraper.py ──

import httpx
import hashlib
import json
from app.config import settings
from app.cache.redis_client import redis_client

FOURSQUARE_SEARCH_URL = "https://api.foursquare.com/v3/places/search"
FOURSQUARE_DETAILS_URL = "https://api.foursquare.com/v3/places/{fsq_id}"

async def fetch_foursquare_data(destination: str, lat: float, lng: float) -> dict:
    cache_key = f"fsq:{hashlib.md5(f'{destination}{lat}{lng}'.encode()).hexdigest()[:10]}"
    
    # Check cache first
    cached = await redis_client.get(cache_key)
    if cached:
        return json.loads(cached)
    
    headers = {
        "Authorization": settings.FOURSQUARE_API_KEY,
        "Accept": "application/json"
    }
    
    ratings = []
    venue_names = []
    
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            # Step 1: Search venues near location
            search_resp = await client.get(
                FOURSQUARE_SEARCH_URL,
                headers=headers,
                params={"ll": f"{lat},{lng}", "radius": 2000, "limit": 20}
            )
            search_resp.raise_for_status()
            venues = search_resp.json().get("results", [])
            
            # Step 2: Get rating for each venue (limit to 10 to save API calls)
            for venue in venues[:10]:
                fsq_id = venue.get("fsq_id")
                name = venue.get("name", "")
                if not fsq_id:
                    continue
                try:
                    detail_resp = await client.get(
                        FOURSQUARE_DETAILS_URL.format(fsq_id=fsq_id),
                        headers=headers,
                        params={"fields": "rating,stats,popularity"}
                    )
                    detail_resp.raise_for_status()
                    detail = detail_resp.json()
                    
                    # Foursquare rating: 0-10, normalize to 1-5
                    raw_rating = detail.get("rating")
                    if raw_rating is not None:
                        normalized = (raw_rating / 10) * 4 + 1  # maps 0-10 to 1-5
                        ratings.append(round(normalized, 2))
                        venue_names.append(name)
                except Exception:
                    continue
    except Exception as e:
        print(f"[Foursquare] Error fetching data for {destination}: {e}")
        # Return neutral fallback on error
        return {"ratings": [3.0], "venue_names": [], "avg_rating": 3.0}
    
    avg = sum(ratings) / len(ratings) if ratings else 3.0
    result = {
        "ratings": ratings,
        "venue_names": venue_names,
        "avg_rating": round(avg, 2)
    }
    
    # Cache for 24 hours
    await redis_client.set(cache_key, json.dumps(result), ttl=86400)
    return result


── backend/app/services/sentiment/web_sentiment_scraper.py ──

import httpx
import wikipedia
from duckduckgo_search import DDGS
from app.config import settings

async def fetch_web_sentiment_data(destination: str) -> list[str]:
    texts = []
    
    # SOURCE 1: DuckDuckGo — zero key needed
    try:
        with DDGS() as ddgs:
            queries = [
                f"{destination} safe for tourists 2024",
                f"{destination} travel safety tips",
                f"is {destination} dangerous tourist",
            ]
            for query in queries:
                results = list(ddgs.text(query, max_results=5))
                for r in results:
                    body = r.get("body", "")
                    if body and len(body) > 30:
                        texts.append(body[:300])
    except Exception as e:
        print(f"[DuckDuckGo] Error: {e}")
    
    # SOURCE 2: Serper API — Google results as JSON (2500 free/month)
    try:
        async with httpx.AsyncClient(timeout=8.0) as client:
            resp = await client.post(
                "https://google.serper.dev/search",
                headers={
                    "X-API-KEY": settings.SERPER_API_KEY,
                    "Content-Type": "application/json"
                },
                json={"q": f"{destination} tourist safety review 2024", "num": 10}
            )
            data = resp.json()
            for result in data.get("organic", []):
                snippet = result.get("snippet", "")
                if snippet:
                    texts.append(snippet[:300])
            answer = data.get("answerBox", {}).get("answer", "")
            if answer:
                texts.append(answer[:300])
    except Exception as e:
        print(f"[Serper] Error: {e}")
    
    # SOURCE 3: Wikipedia — factual context, completely free
    try:
        page = wikipedia.page(f"{destination} tourism", auto_suggest=True)
        safety_keywords = ["safe", "crime", "danger", "tourist", "security", "risk", "warning"]
        for para in page.content.split("\n"):
            if any(kw in para.lower() for kw in safety_keywords) and len(para) > 50:
                texts.append(para[:300])
                if len(texts) >= 25:
                    break
    except Exception as e:
        print(f"[Wikipedia] Error: {e}")
    
    # If we got nothing, return a neutral placeholder so pipeline doesn't break
    if not texts:
        texts = [f"{destination} is a popular tourist destination with various attractions."]
    
    return texts[:30]


── backend/app/services/sentiment/hf_sentiment.py ──

import httpx
import asyncio
from app.config import settings

HF_API_URL = "https://api-inference.huggingface.co/models/cardiffnlp/twitter-roberta-base-sentiment-latest"
HEADERS = {"Authorization": f"Bearer {settings.HUGGINGFACE_API_KEY}"}

LABEL_TO_SCORE = {
    "POSITIVE": 5.0,
    "LABEL_2": 5.0,   # Some model versions use LABEL_0/1/2
    "NEUTRAL": 3.0,
    "LABEL_1": 3.0,
    "NEGATIVE": 1.0,
    "LABEL_0": 1.0,
}

async def analyze_sentiment(texts: list[str]) -> list[dict]:
    if not texts:
        return []
    
    results = []
    # Process in batches of 8 to stay within HF limits
    batch_size = 8
    
    async with httpx.AsyncClient(timeout=30.0) as client:
        for i in range(0, len(texts), batch_size):
            batch = texts[i:i + batch_size]
            # Clean texts: remove newlines, truncate to 512 chars (model limit)
            cleaned = [t.replace("\n", " ")[:512] for t in batch]
            
            for attempt in range(2):  # retry once on 503
                try:
                    resp = await client.post(
                        HF_API_URL,
                        headers=HEADERS,
                        json={"inputs": cleaned}
                    )
                    
                    if resp.status_code == 503:
                        # Model is loading — wait and retry
                        await asyncio.sleep(10)
                        continue
                    
                    resp.raise_for_status()
                    batch_results = resp.json()
                    
                    # HF returns list of lists: [[{label, score}, ...], ...]
                    for item_results in batch_results:
                        if isinstance(item_results, list):
                            # Get the highest confidence prediction
                            best = max(item_results, key=lambda x: x.get("score", 0))
                            results.append({
                                "label": best.get("label", "NEUTRAL").upper(),
                                "score": best.get("score", 0.5)
                            })
                        else:
                            results.append({"label": "NEUTRAL", "score": 0.5})
                    break
                    
                except Exception as e:
                    print(f"[HuggingFace] Batch {i} attempt {attempt} error: {e}")
                    if attempt == 1:
                        # Both attempts failed — add neutral for each text in batch
                        results.extend([{"label": "NEUTRAL", "score": 0.5}] * len(batch))
            
            # Small delay between batches to be respectful of rate limits
            if i + batch_size < len(texts):
                await asyncio.sleep(0.5)
    
    return results

def map_sentiment_to_score(sentiment: dict) -> float:
    label = sentiment.get("label", "NEUTRAL").upper()
    confidence = sentiment.get("score", 0.5)
    
    base = LABEL_TO_SCORE.get(label, 3.0)
    
    # Weight by confidence: high confidence → closer to base value
    # Low confidence → pulled toward neutral (3.0)
    weighted = base * confidence + 3.0 * (1 - confidence)
    return round(weighted, 2)


── backend/app/services/sentiment/score_calculator.py ──
THIS FILE IS CURRENTLY BLANK. Build it completely:

from dataclasses import dataclass
from .hf_sentiment import map_sentiment_to_score

@dataclass
class SentimentResult:
    location_id: str
    destination: str
    venue_score: float        # Foursquare normalized 1-5
    social_score: float       # HuggingFace mapped 1-5
    final_score: float        # S = (venue × 0.6) + (social × 0.4)
    zone: str                 # GREEN | WHITE | RED
    sample_size: int
    confidence: float         # 0.0 to 1.0

def calculate_zone_score(
    location_id: str,
    destination: str,
    foursquare_ratings: list[float],   # normalized 1-5 ratings
    social_sentiments: list[dict],      # [{"label": "POSITIVE", "score": 0.94}]
) -> SentimentResult:
    
    # STEP 1: Venue score from Foursquare (already normalized 1-5)
    if foursquare_ratings:
        venue_score = sum(foursquare_ratings) / len(foursquare_ratings)
    else:
        venue_score = 3.0  # neutral fallback
    venue_score = round(venue_score, 2)
    
    # STEP 2: Social score — map HuggingFace output to 1-5 scale
    if social_sentiments:
        mapped_scores = [map_sentiment_to_score(s) for s in social_sentiments]
        social_score = sum(mapped_scores) / len(mapped_scores)
    else:
        social_score = 3.0  # neutral fallback
    social_score = round(social_score, 2)
    
    # STEP 3: THE FORMULA — S = (venue × 0.6) + (social × 0.4)
    # This is the core formula from sentiment-formula.md
    # Foursquare ratings carry more weight (0.6) as structured data
    # Social/web sentiment carries less weight (0.4) as unstructured
    final_score = (venue_score * 0.6) + (social_score * 0.4)
    final_score = round(final_score, 2)
    
    # STEP 4: Zone assignment thresholds from geofencing.md
    if final_score > 3.0:
        zone = "GREEN"
    elif final_score >= 2.0:
        zone = "WHITE"
    else:
        zone = "RED"
    
    # STEP 5: Confidence based on sample size
    # 100+ samples = full confidence, fewer = proportional
    total_samples = len(foursquare_ratings) + len(social_sentiments)
    confidence = min(total_samples / 100.0, 1.0)
    confidence = round(confidence, 2)
    
    return SentimentResult(
        location_id=location_id,
        destination=destination,
        venue_score=venue_score,
        social_score=social_score,
        final_score=final_score,
        zone=zone,
        sample_size=total_samples,
        confidence=confidence
    )

def get_zone_display_config(zone: str) -> dict:
    """Returns Leaflet styling config for a zone."""
    configs = {
        "GREEN": {
            "fillColor": "#22c55e",
            "fillOpacity": 0.35,
            "color": "#22c55e",
            "weight": 1,
            "opacity": 0.7
        },
        "WHITE": {
            "fillColor": "#e2e8f0",
            "fillOpacity": 0.20,
            "color": "#e2e8f0",
            "weight": 1,
            "opacity": 0.5
        },
        "RED": {
            "fillColor": "#ef4444",
            "fillOpacity": 0.35,
            "color": "#ef4444",
            "weight": 1,
            "opacity": 0.7
        }
    }
    return configs.get(zone, configs["WHITE"])


── backend/app/services/sentiment/zone_mapper.py ──
THIS FILE IS CURRENTLY BLANK. Build it completely:

import httpx
import asyncio
import math
from .score_calculator import SentimentResult, get_zone_display_config

NOMINATIM_URL = "https://nominatim.openstreetmap.org/search"

async def fetch_boundary_geojson(destination: str) -> dict | None:
    """Fetch city boundary polygon from Nominatim (OpenStreetMap). Free, no key."""
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get(
                NOMINATIM_URL,
                params={
                    "q": destination,
                    "format": "json",
                    "polygon_geojson": 1,
                    "limit": 1,
                    "featuretype": "city"
                },
                headers={"User-Agent": "GuardianGuide/1.0 travel-safety-app"}
            )
            resp.raise_for_status()
            results = resp.json()
            
            if results and results[0].get("geojson"):
                geojson = results[0]["geojson"]
                # Nominatim returns Polygon or MultiPolygon — both work with Leaflet
                return geojson
    except Exception as e:
        print(f"[Nominatim] Error fetching boundary for {destination}: {e}")
    return None

def create_circle_polygon(lat: float, lng: float, radius_km: float = 2.0, points: int = 32) -> dict:
    """
    Fallback: create a circular polygon approximation when Nominatim has no boundary.
    Uses the Haversine formula to calculate perimeter points.
    """
    coords = []
    for i in range(points):
        angle = math.radians(float(i) / points * 360)
        # Approximate degrees per km
        delta_lat = (radius_km / 111.0) * math.cos(angle)
        delta_lng = (radius_km / (111.0 * math.cos(math.radians(lat)))) * math.sin(angle)
        coords.append([lng + delta_lng, lat + delta_lat])
    
    # Close the polygon (first point = last point)
    coords.append(coords[0])
    
    return {
        "type": "Polygon",
        "coordinates": [coords]
    }

async def build_zone_geojson(
    result: SentimentResult,
    lat: float,
    lng: float
) -> dict:
    """
    Builds a GeoJSON FeatureCollection from a SentimentResult.
    This is what gets sent to the Leaflet map frontend.
    """
    # Respect Nominatim usage policy: max 1 request/second
    await asyncio.sleep(1)
    boundary = await fetch_boundary_geojson(result.destination)
    
    if boundary is None:
        # Fallback: use circle polygon
        boundary = create_circle_polygon(lat, lng, radius_km=2.0)
    
    style = get_zone_display_config(result.zone)
    
    feature = {
        "type": "Feature",
        "geometry": boundary,
        "properties": {
            "neighborhood": result.destination,
            "score": result.final_score,
            "zone": result.zone,
            "venue_score": result.venue_score,
            "social_score": result.social_score,
            "confidence": result.confidence,
            "sample_size": result.sample_size,
            # Leaflet style properties
            "fillColor": style["fillColor"],
            "fillOpacity": style["fillOpacity"],
            "color": style["color"],
            "weight": style["weight"],
            "opacity": style["opacity"],
            # Human-readable label for popup
            "label": get_zone_label(result.zone, result.final_score)
        }
    }
    
    return {
        "type": "FeatureCollection",
        "features": [feature]
    }

def get_zone_label(zone: str, score: float) -> str:
    labels = {
        "GREEN": f"✅ Safe Zone (Score: {score})",
        "WHITE": f"⚪ Neutral Zone (Score: {score})",
        "RED": f"🔴 Caution Zone (Score: {score})"
    }
    return labels.get(zone, f"Zone Score: {score}")


── backend/app/api/zones.py ──
THIS FILE IS CURRENTLY BLANK. Build it completely:

import hashlib
import json
from fastapi import APIRouter, Depends, Query
from app.cache.redis_client import redis_client
from app.cache.sentiment_cache import get_cached_score, cache_score
from app.services.sentiment.foursquare_scraper import fetch_foursquare_data
from app.services.sentiment.web_sentiment_scraper import fetch_web_sentiment_data
from app.services.sentiment.hf_sentiment import analyze_sentiment
from app.services.sentiment.score_calculator import calculate_zone_score
from app.services.sentiment.zone_mapper import build_zone_geojson
from app.middleware.auth_guard import get_current_user
from app.middleware.rate_limiter import general_limiter
import asyncio

router = APIRouter(prefix="/zones", tags=["zones"])

def get_location_hash(lat: float, lng: float) -> str:
    key = f"{round(lat, 3)}:{round(lng, 3)}"
    return hashlib.md5(key.encode()).hexdigest()[:12]

@router.get("")
async def get_safety_zones(
    lat: float = Query(..., description="Latitude"),
    lng: float = Query(..., description="Longitude"),
    destination: str = Query(None, description="Destination name (optional, improves results)"),
    user=Depends(get_current_user),
    _=Depends(general_limiter)
):
    location_hash = get_location_hash(lat, lng)
    
    # STEP 1: Check full GeoJSON cache in Redis (24hr TTL)
    cached_geojson = await redis_client.get(f"geojson:{location_hash}")
    if cached_geojson:
        return json.loads(cached_geojson)
    
    # STEP 2: Reverse geocode to get destination name if not provided
    if not destination:
        destination = await reverse_geocode(lat, lng)
    
    # STEP 3: Check sentiment score cache
    cached_result = await get_cached_score(location_hash)
    
    if not cached_result:
        # STEP 4: Fetch data from all sources in parallel
        foursquare_task = fetch_foursquare_data(destination, lat, lng)
        web_task = fetch_web_sentiment_data(destination)
        
        fsq_data, web_texts = await asyncio.gather(
            foursquare_task, web_task,
            return_exceptions=True
        )
        
        # Handle exceptions from parallel tasks
        if isinstance(fsq_data, Exception):
            print(f"[Zones] Foursquare failed: {fsq_data}")
            fsq_data = {"ratings": [3.0], "venue_names": [], "avg_rating": 3.0}
        if isinstance(web_texts, Exception):
            print(f"[Zones] Web scraper failed: {web_texts}")
            web_texts = []
        
        # STEP 5: Run HuggingFace sentiment on web texts
        sentiments = await analyze_sentiment(web_texts) if web_texts else []
        
        # STEP 6: Calculate zone score using the formula
        # S = (venue_score × 0.6) + (social_score × 0.4)
        result = calculate_zone_score(
            location_id=location_hash,
            destination=destination,
            foursquare_ratings=fsq_data.get("ratings", [3.0]),
            social_sentiments=sentiments
        )
        
        # STEP 7: Cache the sentiment result
        await cache_score(location_hash, result)
        cached_result = result
    
    # STEP 8: Build GeoJSON from result
    geojson = await build_zone_geojson(cached_result, lat, lng)
    
    # STEP 9: Cache the full GeoJSON for 24 hours
    await redis_client.set(
        f"geojson:{location_hash}",
        json.dumps(geojson),
        ttl=86400
    )
    
    return geojson

async def reverse_geocode(lat: float, lng: float) -> str:
    """Use Nominatim to get city name from coordinates."""
    import httpx
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            resp = await client.get(
                "https://nominatim.openstreetmap.org/reverse",
                params={"lat": lat, "lon": lng, "format": "json"},
                headers={"User-Agent": "GuardianGuide/1.0"}
            )
            data = resp.json()
            address = data.get("address", {})
            city = (address.get("city") or address.get("town") or
                   address.get("village") or address.get("county") or "Unknown")
            return city
    except Exception:
        return "Unknown"


── backend/app/cache/sentiment_cache.py ──

import json
from app.cache.redis_client import redis_client
from app.services.sentiment.score_calculator import SentimentResult

async def get_cached_score(location_hash: str) -> SentimentResult | None:
    raw = await redis_client.get(f"sentiment:{location_hash}")
    if not raw:
        return None
    try:
        data = json.loads(raw)
        return SentimentResult(**data)
    except Exception:
        return None

async def cache_score(location_hash: str, result: SentimentResult) -> None:
    data = {
        "location_id": result.location_id,
        "destination": result.destination,
        "venue_score": result.venue_score,
        "social_score": result.social_score,
        "final_score": result.final_score,
        "zone": result.zone,
        "sample_size": result.sample_size,
        "confidence": result.confidence
    }
    await redis_client.set(f"sentiment:{location_hash}", json.dumps(data), ttl=86400)

After writing all sentiment files, run:
  cd backend && python -c "from app.services.sentiment.score_calculator import calculate_zone_score; print('score_calculator OK')"
  cd backend && python -c "from app.api.zones import router; print('zones router OK')"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 3: AI PLANNER BACKEND
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Follow Prompt 9 from AI_AUTOPILOT_PROMPTS.md exactly.
Key override: use ChatGoogleGenerativeAI (Gemini) not OpenAI.
Complete these files with full working code:
  - services/planner/langgraph_agent.py
  - services/planner/two_strike_guard.py
  - services/planner/budget_validator.py
  - services/planner/itinerary_builder.py
  - services/planner/tag_engine.py
  - api/planner.py

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 4: REMAINING BACKEND (SOS, TRANSLATE, GMAIL, IMAGES)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Follow Prompts 12, 13, 14 from AI_AUTOPILOT_PROMPTS.md.
Key overrides:
  - Images: use unsplash_fetcher.py (not stable_diffusion.py)
  - Emergency contacts: use Overpass API (not Google Places)
  - Email: use FROM_EMAIL=onboarding@resend.dev

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 5: FRONTEND FOUNDATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Follow Prompt 3 from AI_AUTOPILOT_PROMPTS.md.
Key rules:
- Logo: inline SVG shield icon, never an image file
- All colors: CSS variables from design.md, never hardcoded hex
- Font: import Sora (free on Google Fonts, similar to Clash Display)
  and DM Sans for body text

── frontend/app/globals.css ──
Apply EVERY color variable from design.md.
Include glassmorphism utility class.
Include SOS theme class.
Include custom scrollbar (thin, dark, accent thumb).
Include Leaflet CSS import: @import 'leaflet/dist/leaflet.css';

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 6: ALL SCREENS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Follow Prompts 4, 5, 6, 7, 8, 11, 12 in order.
Build every screen completely — no placeholder JSX.

For the destination slideshow use this hardcoded data array
(put directly in DestinationSlideshow.tsx):

const DESTINATIONS = [
  { id: "paris", name: "Paris", country: "France", emoji: "🇫🇷",
    summary: "The City of Light — iconic architecture, world-class cuisine, and timeless romance.",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&auto=format&fit=crop" },
  { id: "tokyo", name: "Tokyo", country: "Japan", emoji: "🇯🇵",
    summary: "Where ancient temples meet neon-lit streets — a sensory overload in the best way.",
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&auto=format&fit=crop" },
  { id: "bali", name: "Bali", country: "Indonesia", emoji: "🇮🇩",
    summary: "Island of the Gods — lush rice terraces, sacred temples, and world-class surf.",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&auto=format&fit=crop" },
  { id: "new-york", name: "New York", country: "USA", emoji: "🇺🇸",
    summary: "The city that never sleeps — endless energy, culture, and skyline magic.",
    image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&auto=format&fit=crop" },
  { id: "istanbul", name: "Istanbul", country: "Turkey", emoji: "🇹🇷",
    summary: "Where East meets West — bazaars, Bosphorus views, and layers of civilization.",
    image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&auto=format&fit=crop" },
  { id: "santorini", name: "Santorini", country: "Greece", emoji: "🇬🇷",
    summary: "Dramatic caldera views, whitewashed villages, and Aegean sunsets.",
    image: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800&auto=format&fit=crop" },
  { id: "kyoto", name: "Kyoto", country: "Japan", emoji: "🇯🇵",
    summary: "Japan's cultural soul — geisha districts, bamboo groves, and 1600 temples.",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&auto=format&fit=crop" },
  { id: "dubai", name: "Dubai", country: "UAE", emoji: "🇦🇪",
    summary: "Futuristic skyline rising from desert — luxury, ambition, and spectacle.",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&auto=format&fit=crop" },
]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 7: FINAL INTEGRATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Follow Prompt 16 from AI_AUTOPILOT_PROMPTS.md.
After completing, run:
  cd frontend && npx tsc --noEmit
  cd backend && python -m pytest tests/ -v --tb=short

Fix ALL TypeScript errors and ALL failing tests before stopping.

=============================================================
WHEN YOU HIT CONTEXT LIMIT
=============================================================

If you are running low on context, before stopping:
1. List every file you have completed
2. List every file still remaining
3. Write a PROGRESS.md file in project root with:
   - Completed sections
   - Remaining sections
   - Last file you were working on
   - Any important decisions made
   - Any errors encountered and how you fixed them
4. Commit everything: git add . && git commit -m "wip: progress checkpoint"

=============================================================
START NOW. Read the docs, then begin Section 1.
=============================================================
