import datetime
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api import gmail_sync, image_gen, planner, sentiment, sos, translate, zones
from app.cache.redis_client import redis_client
from app.config import settings

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(_app: FastAPI):
    try:
        await redis_client.set("health_check", "ok", ttl=15)
        logger.info("Startup: cache ping OK")
    except Exception as exc:
        logger.warning("Startup cache: %s", exc)
    yield


app = FastAPI(title="GuardianGuide API", version="1.0.0", lifespan=lifespan)

_origins = [o.strip() for o in settings.allowed_origins.split(",") if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=_origins or ["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(zones.router, prefix="/api/v1")
app.include_router(planner.router, prefix="/api/v1")
app.include_router(sentiment.router, prefix="/api/v1")
app.include_router(translate.router, prefix="/api/v1")
app.include_router(image_gen.router, prefix="/api/v1")
app.include_router(sos.router, prefix="/api/v1")
app.include_router(gmail_sync.router, prefix="/api/v1")


@app.get("/api/v1/health")
async def health():
    ok = await redis_client.exists("health_check")
    return {
        "status": "ok",
        "redis": "connected" if ok else "degraded",
        "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat(),
    }


@app.exception_handler(Exception)
async def global_exc(_request, exc: Exception):
    logger.exception("Unhandled error: %s", exc)
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error", "type": type(exc).__name__},
    )
