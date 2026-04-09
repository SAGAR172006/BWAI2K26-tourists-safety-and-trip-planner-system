"""Rate limiting via Redis INCR + EXPIRE (memory fallback)."""
from collections.abc import Callable
from typing import Any

from fastapi import Depends, HTTPException, Request

from app.cache.redis_client import redis_client
from app.middleware.auth_guard import get_optional_user


class RateLimiter:
    def __init__(self, max_calls: int, period_seconds: int) -> None:
        self.max_calls = max_calls
        self.period_seconds = period_seconds


def _limiter_dep(limiter: RateLimiter) -> Callable[..., Any]:
    async def _inner(request: Request, user: dict | None = Depends(get_optional_user)) -> None:
        ident = user["id"] if user else (request.client.host if request.client else "anon")
        path = request.url.path
        key = f"rl:{ident}:{path}"
        n = await redis_client.incr(key, ttl=limiter.period_seconds)
        if n > limiter.max_calls:
            raise HTTPException(
                status_code=429,
                detail=f"Rate limit exceeded. Retry in {limiter.period_seconds}s",
                headers={"Retry-After": str(limiter.period_seconds)},
            )

    return _inner


ai_limiter_dep = _limiter_dep(RateLimiter(max_calls=2, period_seconds=60))
general_limiter_dep = _limiter_dep(RateLimiter(max_calls=60, period_seconds=60))
