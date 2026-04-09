"""
Image fetcher using Unsplash static URLs — free, no API key required.
Name kept as stable_diffusion.py for import compatibility, but uses Unsplash.
"""
import httpx
from app.config import settings

_KNOWN_IMAGES: dict[str, list[str]] = {
    "paris": [
        "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800",
        "https://images.unsplash.com/photo-1499856871958-5b9357976b82?w=800",
        "https://images.unsplash.com/photo-1520939817895-060bdaf4fe1b?w=800",
    ],
    "tokyo": [
        "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800",
        "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=800",
        "https://images.unsplash.com/photo-1513407030348-c983a97b98d8?w=800",
    ],
    "bali": [
        "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800",
        "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800",
        "https://images.unsplash.com/photo-1558005137-d9619a5c539f?w=800",
    ],
    "new york": [
        "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800",
        "https://images.unsplash.com/photo-1541336032412-2048a678540d?w=800",
        "https://images.unsplash.com/photo-1534430480872-3498386e7856?w=800",
    ],
    "istanbul": [
        "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800",
        "https://images.unsplash.com/photo-1559561853-08451507673a?w=800",
    ],
    "santorini": [
        "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800",
        "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800",
    ],
    "kyoto": [
        "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800",
        "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800",
    ],
    "dubai": [
        "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800",
        "https://images.unsplash.com/photo-1526495124232-a04e1849168c?w=800",
    ],
}
_FALLBACK = "https://placehold.co/800x600/111118/6C63FF?text=GuardianGuide"


async def fetch_destination_image(destination: str) -> list[str]:
    """
    Returns 1–3 image URLs for a destination.
    First checks known static Unsplash URLs (no API key needed).
    Falls back to Unsplash Search API if access key is configured.
    """
    dest_lower = destination.lower()
    for key, urls in _KNOWN_IMAGES.items():
        if key in dest_lower:
            return urls

    # Try Unsplash API if key is available
    if settings.unsplash_access_key:
        try:
            async with httpx.AsyncClient(timeout=8.0) as client:
                resp = await client.get(
                    "https://api.unsplash.com/search/photos",
                    params={
                        "query": f"{destination} travel landmark",
                        "per_page": 3,
                        "orientation": "landscape",
                    },
                    headers={"Authorization": f"Client-ID {settings.unsplash_access_key}"},
                )
                resp.raise_for_status()
                results = resp.json().get("results", [])
                urls = [r["urls"]["regular"] for r in results if r.get("urls")]
                if urls:
                    return urls
        except Exception as e:
            print(f"[Unsplash] Error: {e}")

    return [_FALLBACK]
