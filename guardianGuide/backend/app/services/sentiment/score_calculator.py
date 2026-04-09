from dataclasses import dataclass

from app.services.sentiment.hf_sentiment import map_sentiment_to_score


@dataclass
class SentimentResult:
    location_id: str
    destination: str
    venue_score: float
    social_score: float
    final_score: float
    zone: str
    sample_size: int
    confidence: float


def calculate_zone_score(
    location_id: str,
    destination: str,
    foursquare_ratings: list[float],
    social_sentiments: list[dict],
) -> SentimentResult:
    if foursquare_ratings:
        venue_score = round(sum(foursquare_ratings) / len(foursquare_ratings), 2)
    else:
        venue_score = 3.0

    if social_sentiments:
        mapped = [map_sentiment_to_score(s) for s in social_sentiments]
        social_score = round(sum(mapped) / len(mapped), 2)
    else:
        social_score = 3.0

    final_score = round((venue_score * 0.6) + (social_score * 0.4), 2)

    if final_score > 3.0:
        zone = "GREEN"
    elif final_score >= 2.0:
        zone = "WHITE"
    else:
        zone = "RED"

    total_samples = len(foursquare_ratings) + len(social_sentiments)
    confidence = round(min(total_samples / 100.0, 1.0), 2)

    return SentimentResult(
        location_id=location_id,
        destination=destination,
        venue_score=venue_score,
        social_score=social_score,
        final_score=final_score,
        zone=zone,
        sample_size=total_samples,
        confidence=confidence,
    )


def get_zone_display_config(zone: str) -> dict:
    configs = {
        "GREEN": {
            "fillColor": "#22c55e",
            "fillOpacity": 0.35,
            "color": "#22c55e",
            "weight": 1,
            "opacity": 0.7,
        },
        "WHITE": {
            "fillColor": "#e2e8f0",
            "fillOpacity": 0.2,
            "color": "#e2e8f0",
            "weight": 1,
            "opacity": 0.5,
        },
        "RED": {
            "fillColor": "#ef4444",
            "fillOpacity": 0.35,
            "color": "#ef4444",
            "weight": 1,
            "opacity": 0.7,
        },
    }
    return configs.get(zone, configs["WHITE"])
