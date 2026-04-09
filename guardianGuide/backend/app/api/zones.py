import asyncio
import hashlib
import json

import httpx
from fastapi import APIRouter, Depends, Query

from app.cache.redis_client import redis_client
from app.cache.sentiment_cache import cache_score, get_cached_score
from app.config import settings
from app.middleware.auth_guard import get_current_user
from app.middleware.rate_limiter import general_limiter_dep
from app.services.sentiment.foursquare_scraper import fetch_foursquare_data
from app.services.sentiment.hf_sentiment import analyze_sentiment
from app.services.sentiment.score_calculator import calculate_zone_score
from app.services.sentiment.web_sentiment_scraper import fetch_web_sentiment_data
from app.services.sentiment.zone_mapper import build_zone_geojson

router = APIRouter(prefix="/zones", tags=["zones"])


def _location_hash(lat: float, lng: float) -> str:
    key = f"{round(lat, 3)}:{round(lng, 3)}"
    return hashlib.md5(key.encode()).hexdigest()[:12]


async def _reverse_geocode(lat: float, lng: float) -> str:
    try:
        async with httpx.AsyncClient(timeout=8.0) as client:
            resp = await client.get(
                "https://nominatim.openstreetmap.org/reverse",
                params={"lat": lat, "lon": lng, "format": "json"},
                headers={"User-Agent": settings.nominatim_user_agent},
            )
            resp.raise_for_status()
            addr = resp.json().get("address", {})
            return (
                addr.get("city")
                or addr.get("town")
                or addr.get("village")
                or addr.get("county")
                or addr.get("state")
                or "Unknown"
            )
    except Exception:
        return "Unknown"


@router.get("")
async def get_safety_zones(
    lat: float = Query(...),
    lng: float = Query(...),
    destination: str | None = Query(None),
    _user: dict = Depends(get_current_user),
    __: None = Depends(general_limiter_dep),
):
    loc_hash = _location_hash(lat, lng)

    cached_geo = await redis_client.get(f"geojson:{loc_hash}")
    if cached_geo:
        try:
            return json.loads(cached_geo)
        except json.JSONDecodeError:
            pass

    dest = destination or await _reverse_geocode(lat, lng)

    cached_result = await get_cached_score(loc_hash)
    if cached_result is None:
        fsq_task = fetch_foursquare_data(dest, lat, lng)
        web_task = fetch_web_sentiment_data(dest)
        fsq_data, web_texts = await asyncio.gather(
            fsq_task, web_task, return_exceptions=True
        )

        if isinstance(fsq_data, Exception):
            print(f"[zones] foursquare: {fsq_data}")
            fsq_data = {"ratings": [3.0], "venue_names": [], "avg_rating": 3.0}
        if isinstance(web_texts, Exception):
            print(f"[zones] web: {web_texts}")
            web_texts = []

        sentiments = await analyze_sentiment(web_texts) if web_texts else []
        result = calculate_zone_score(
            location_id=loc_hash,
            destination=dest,
            foursquare_ratings=fsq_data.get("ratings", [3.0]),
            social_sentiments=sentiments,
        )
        await cache_score(loc_hash, result)
        cached_result = result

    geojson = await build_zone_geojson(cached_result, lat, lng)
    await redis_client.set(f"geojson:{loc_hash}", json.dumps(geojson), ttl=86400)
    return geojson
