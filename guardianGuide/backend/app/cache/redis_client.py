"""Async Redis with in-memory fallback when Redis is unavailable."""
from __future__ import annotations

import asyncio
import logging
import time
from typing import Any

from app.config import settings

logger = logging.getLogger(__name__)


class RedisClient:
    def __init__(self) -> None:
        self._redis: Any = None
        self._use_redis = False
        self._init_done = False
        self._mem: dict[str, str] = {}
        self._exp: dict[str, float] = {}
        self._lock = asyncio.Lock()

    async def _ensure(self) -> None:
        if self._init_done:
            return
        self._init_done = True
        try:
            import redis.asyncio as redis

            self._redis = redis.from_url(settings.redis_url, decode_responses=True)
            await self._redis.ping()
            self._use_redis = True
            logger.info("Redis connected")
        except Exception as exc:
            logger.warning("Redis unavailable — using in-memory fallback: %s", exc)
            self._redis = None
            self._use_redis = False

    def _mem_get(self, key: str) -> str | None:
        exp = self._exp.get(key)
        if exp is not None and exp < time.time():
            self._mem.pop(key, None)
            self._exp.pop(key, None)
            return None
        return self._mem.get(key)

    def _mem_set(self, key: str, value: str, ttl: int | None) -> None:
        self._mem[key] = value
        if ttl:
            self._exp[key] = time.time() + ttl
        else:
            self._exp.pop(key, None)

    async def get(self, key: str) -> str | None:
        await self._ensure()
        if self._use_redis and self._redis is not None:
            try:
                return await self._redis.get(key)
            except Exception as exc:
                logger.warning("redis get error: %s", exc)
        async with self._lock:
            return self._mem_get(key)

    async def set(self, key: str, value: str, ttl: int | None = None) -> None:
        await self._ensure()
        if self._use_redis and self._redis is not None:
            try:
                if ttl:
                    await self._redis.set(key, value, ex=ttl)
                else:
                    await self._redis.set(key, value)
                return
            except Exception as exc:
                logger.warning("redis set error: %s", exc)
        async with self._lock:
            self._mem_set(key, value, ttl)

    async def delete(self, key: str) -> None:
        await self._ensure()
        if self._use_redis and self._redis is not None:
            try:
                await self._redis.delete(key)
            except Exception as exc:
                logger.warning("redis delete error: %s", exc)
        async with self._lock:
            self._mem.pop(key, None)
            self._exp.pop(key, None)

    async def exists(self, key: str) -> bool:
        val = await self.get(key)
        return val is not None

    async def incr(self, key: str, ttl: int | None = None) -> int:
        """Increment key; set TTL when key is first created."""
        await self._ensure()
        if self._use_redis and self._redis is not None:
            try:
                n = await self._redis.incr(key)
                if n == 1 and ttl:
                    await self._redis.expire(key, ttl)
                return int(n)
            except Exception as exc:
                logger.warning("redis incr error: %s", exc)
        async with self._lock:
            cur = self._mem_get(key)
            n = int(cur) + 1 if cur is not None else 1
            self._mem_set(key, str(n), ttl)
            return n


redis_client = RedisClient()
