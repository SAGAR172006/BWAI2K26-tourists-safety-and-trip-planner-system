import hashlib
import json

import httpx

from app.cache.redis_client import redis_client
from app.config import settings

FOURSQUARE_SEARCH_URL = "https://api.foursquare.com/v3/places/search"
FOURSQUARE_DETAILS_URL = "https://api.foursquare.com/v3/places/{fsq_id}"


async def fetch_foursquare_data(destination: str, lat: float, lng: float) -> dict:
    cache_key = f"fsq:{hashlib.md5(f'{destination}{lat}{lng}'.encode()).hexdigest()[:10]}"
    cached = await redis_client.get(cache_key)
    if cached:
        try:
            return json.loads(cached)
        except json.JSONDecodeError:
            pass

    if not settings.foursquare_api_key:
        return {"ratings": [3.0], "venue_names": [], "avg_rating": 3.0}

    ratings: list[float] = []
    venue_names: list[str] = []
    headers = {
        "Authorization": settings.foursquare_api_key,
        "Accept": "application/json",
    }

    try:
        async with httpx.AsyncClient(timeout=12.0) as client:
            search_resp = await client.get(
                FOURSQUARE_SEARCH_URL,
                headers=headers,
                params={"ll": f"{lat},{lng}", "radius": 2000, "limit": 15},
            )
            search_resp.raise_for_status()
            venues = search_resp.json().get("results", [])

            for venue in venues[:8]:
                fsq_id = venue.get("fsq_id")
                name = venue.get("name", "")
                if not fsq_id:
                    continue
                try:
                    detail_resp = await client.get(
                        FOURSQUARE_DETAILS_URL.format(fsq_id=fsq_id),
                        headers=headers,
                        params={"fields": "rating"},
                    )
                    detail_resp.raise_for_status()
                    detail = detail_resp.json()
                    raw_rating = detail.get("rating")
                    if raw_rating is not None:
                        normalized = (raw_rating / 10) * 4 + 1
                        ratings.append(round(normalized, 2))
                        venue_names.append(name)
                except Exception:
                    continue
    except Exception as exc:
        print(f"[Foursquare] {exc}")
        return {"ratings": [3.0], "venue_names": [], "avg_rating": 3.0}

    avg = sum(ratings) / len(ratings) if ratings else 3.0
    result = {
        "ratings": ratings or [3.0],
        "venue_names": venue_names,
        "avg_rating": round(avg, 2),
    }
    await redis_client.set(cache_key, json.dumps(result), ttl=86400)
    return result
