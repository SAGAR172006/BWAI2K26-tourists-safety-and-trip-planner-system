import asyncio
import math

import httpx

from app.config import settings
from app.services.sentiment.score_calculator import SentimentResult, get_zone_display_config

NOMINATIM_SEARCH = "https://nominatim.openstreetmap.org/search"


async def fetch_boundary_geojson(destination: str) -> dict | None:
    try:
        async with httpx.AsyncClient(timeout=12.0) as client:
            resp = await client.get(
                NOMINATIM_SEARCH,
                params={
                    "q": destination,
                    "format": "json",
                    "polygon_geojson": 1,
                    "limit": 1,
                },
                headers={"User-Agent": settings.nominatim_user_agent},
            )
            resp.raise_for_status()
            results = resp.json()
            if results and results[0].get("geojson"):
                return results[0]["geojson"]
    except Exception as exc:
        print(f"[Nominatim boundary] {exc}")
    return None


def create_circle_polygon(
    lat: float, lng: float, radius_km: float = 2.0, points: int = 32
) -> dict:
    coords = []
    for i in range(points):
        angle = math.radians(float(i) / points * 360)
        delta_lat = (radius_km / 111.0) * math.cos(angle)
        delta_lng = (radius_km / (111.0 * max(math.cos(math.radians(lat)), 0.01))) * math.sin(
            angle
        )
        coords.append([lng + delta_lng, lat + delta_lat])
    coords.append(coords[0])
    return {"type": "Polygon", "coordinates": [coords]}


def _zone_label(zone: str, score: float) -> str:
    labels = {
        "GREEN": f"Safe zone (score {score})",
        "WHITE": f"Neutral zone (score {score})",
        "RED": f"Caution zone (score {score})",
    }
    return labels.get(zone, f"Zone score {score}")


async def build_zone_geojson(result: SentimentResult, lat: float, lng: float) -> dict:
    await asyncio.sleep(1.0)
    boundary = await fetch_boundary_geojson(result.destination)
    if boundary is None:
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
            "fillColor": style["fillColor"],
            "fillOpacity": style["fillOpacity"],
            "color": style["color"],
            "weight": style["weight"],
            "opacity": style["opacity"],
            "label": _zone_label(result.zone, result.final_score),
        },
    }
    return {"type": "FeatureCollection", "features": [feature]}
