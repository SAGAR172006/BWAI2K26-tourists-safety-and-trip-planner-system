"""
Guard that prevents image generation during re-planning cycles.
Only trigger on first itinerary confirmation, never on re-plans.
"""
from app.cache.redis_client import redis_client

_CONFIRMED_KEY = "img_confirmed:{session_id}"
_TTL = 3600


async def is_image_generation_allowed(session_id: str, is_replanning: bool) -> bool:
    if is_replanning:
        return False
    already_generated = await redis_client.exists(_CONFIRMED_KEY.format(session_id=session_id))
    return not already_generated


async def mark_image_generated(session_id: str) -> None:
    await redis_client.set(_CONFIRMED_KEY.format(session_id=session_id), "1", ttl=_TTL)
