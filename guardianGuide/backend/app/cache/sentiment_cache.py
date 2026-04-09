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
        "confidence": result.confidence,
    }
    await redis_client.set(f"sentiment:{location_hash}", json.dumps(data), ttl=86400)
