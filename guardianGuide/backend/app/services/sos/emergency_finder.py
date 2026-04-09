"""
Fetch nearby emergency services using Overpass API (OpenStreetMap).
Free, no API key required.
"""
import httpx

OVERPASS_URL = "https://overpass-api.de/api/interpreter"

_AMENITY_TYPES = ["police", "hospital", "fire_station", "pharmacy"]

_OVERPASS_QUERY = """
[out:json][timeout:10];
(
  node["amenity"~"{amenities}"]["name"](around:{radius},{lat},{lng});
  way["amenity"~"{amenities}"]["name"](around:{radius},{lat},{lng});
);
out center 10;
"""


async def fetch_nearby_emergency_services(
    lat: float, lng: float, radius_m: int = 3000
) -> list[dict]:
    amenities_re = "|".join(_AMENITY_TYPES)
    query = _OVERPASS_QUERY.format(
        amenities=amenities_re, radius=radius_m, lat=lat, lng=lng
    )
    services = []
    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            resp = await client.post(OVERPASS_URL, data={"data": query})
            resp.raise_for_status()
            elements = resp.json().get("elements", [])
            for el in elements[:20]:
                tags = el.get("tags", {})
                name = tags.get("name") or tags.get("name:en", "Unknown")
                amenity = tags.get("amenity", "other")
                phone = tags.get("phone") or tags.get("contact:phone", "")
                center = el.get("center") or {"lat": el.get("lat", lat), "lon": el.get("lon", lng)}
                services.append({
                    "name": name,
                    "type": amenity,
                    "phone": phone,
                    "lat": center.get("lat"),
                    "lng": center.get("lon"),
                    "address": tags.get("addr:full") or tags.get("addr:street", ""),
                })
    except Exception as exc:
        print(f"[EmergencyFinder] Overpass error: {exc}")
        services = _hardcoded_fallbacks()
    return services


def _hardcoded_fallbacks() -> list[dict]:
    return [
        {"name": "Local Police", "type": "police", "phone": "100", "lat": 0, "lng": 0, "address": ""},
        {"name": "Local Hospital", "type": "hospital", "phone": "108", "lat": 0, "lng": 0, "address": ""},
        {"name": "Fire Station", "type": "fire_station", "phone": "101", "lat": 0, "lng": 0, "address": ""},
    ]
