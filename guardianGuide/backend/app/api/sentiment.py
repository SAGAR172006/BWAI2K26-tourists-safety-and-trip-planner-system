import asyncio
import hashlib

from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field

from app.cache.sentiment_cache import cache_score, get_cached_score
from app.middleware.auth_guard import get_current_user
from app.middleware.rate_limiter import general_limiter_dep
from app.services.sentiment.foursquare_scraper import fetch_foursquare_data
from app.services.sentiment.hf_sentiment import analyze_sentiment
from app.services.sentiment.score_calculator import calculate_zone_score
from app.services.sentiment.web_sentiment_scraper import fetch_web_sentiment_data

router = APIRouter(prefix="/sentiment", tags=["sentiment"])


class SentimentBody(BaseModel):
    destination: str
    lat: float = Field(default=0.0)
    lng: float = Field(default=0.0)


@router.post("")
async def post_sentiment(
    body: SentimentBody,
    _user: dict = Depends(get_current_user),
    __: None = Depends(general_limiter_dep),
):
    key = hashlib.md5(f"{body.destination}:{body.lat}:{body.lng}".encode()).hexdigest()[:12]
    cached = await get_cached_score(key)
    if cached:
        return {
            "location_id": cached.location_id,
            "destination": cached.destination,
            "venue_score": cached.venue_score,
            "social_score": cached.social_score,
            "final_score": cached.final_score,
            "zone": cached.zone,
            "sample_size": cached.sample_size,
            "confidence": cached.confidence,
        }

    fsq, texts = await asyncio.gather(
        fetch_foursquare_data(body.destination, body.lat, body.lng),
        fetch_web_sentiment_data(body.destination),
        return_exceptions=True,
    )
    if isinstance(fsq, Exception):
        fsq = {"ratings": [3.0], "venue_names": [], "avg_rating": 3.0}
    if isinstance(texts, Exception):
        texts = []

    sentiments = await analyze_sentiment(texts) if texts else []
    result = calculate_zone_score(
        location_id=key,
        destination=body.destination,
        foursquare_ratings=fsq.get("ratings", [3.0]),
        social_sentiments=sentiments,
    )
    await cache_score(key, result)
    return {
        "location_id": result.location_id,
        "destination": result.destination,
        "venue_score": result.venue_score,
        "social_score": result.social_score,
        "final_score": result.final_score,
        "zone": result.zone,
        "sample_size": result.sample_size,
        "confidence": result.confidence,
    }
