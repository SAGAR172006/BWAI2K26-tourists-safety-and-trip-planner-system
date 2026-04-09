import hashlib
import json

import httpx

from app.cache.redis_client import redis_client
from app.config import settings

UNSPLASH_SEARCH_URL = "https://api.unsplash.com/search/photos"

STATIC_IMAGES: dict[str, list[str]] = {
    "paris": ["https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800"],
    "tokyo": ["https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800"],
    "bali": ["https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800"],
    "new york": ["https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800"],
    "istanbul": ["https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800"],
    "santorini": ["https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800"],
    "kyoto": ["https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800"],
    "dubai": ["https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800"],
}


def get_fallback_images(destination: str) -> list[str]:
    key = destination.lower()
    for dest, urls in STATIC_IMAGES.items():
        if dest in key:
            return urls
    slug = destination.lower().replace(" ", "-")[:40]
    return [f"https://placehold.co/800x500/111118/6C63FF?text={slug}"]


async def fetch_destination_images(destination: str, count: int = 3) -> list[str]:
    cache_key = f"images:{hashlib.md5(destination.lower().encode()).hexdigest()[:10]}"
    cached = await redis_client.get(cache_key)
    if cached:
        try:
            return json.loads(cached)
        except json.JSONDecodeError:
            pass

    if not settings.unsplash_access_key:
        urls = get_fallback_images(destination)[:count]
        return urls

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get(
                UNSPLASH_SEARCH_URL,
                headers={"Authorization": f"Client-ID {settings.unsplash_access_key}"},
                params={
                    "query": f"{destination} travel landmark tourism",
                    "per_page": count,
                    "orientation": "landscape",
                },
            )
            resp.raise_for_status()
            data = resp.json()
            urls = [p["urls"]["regular"] for p in data.get("results", [])]
            if urls:
                await redis_client.set(cache_key, json.dumps(urls), ttl=604800)
                return urls
    except Exception as exc:
        print(f"[Unsplash] {exc}")

    return get_fallback_images(destination)[:count]
