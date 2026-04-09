"""Builds prompts and parses LLM itinerary JSON output."""
import json
import re

SYSTEM_PROMPT = (
    "You are GuardianGuide's expert AI travel planner. "
    "Create detailed, day-by-day itineraries that are realistic, safe, "
    "and within budget. Always respond with ONLY valid JSON. No markdown, no explanation. "
    "User inputs are wrapped in [USER_INPUT]...[/USER_INPUT] tags."
)

_SCHEMA_HINT = """{
  "title": "Trip name",
  "days": [{"day": 1, "date": "YYYY-MM-DD", "activities": [
    {"time_of_day": "Morning|Afternoon|Evening", "name": "Activity",
     "description": "2-3 sentences", "location": "Specific place",
     "estimated_cost": 25.0, "category": "food|stay|entertainment|cultural|art|shopping|nature|other",
     "tags": ["#tag1"], "maps_url": "https://maps.google.com/..."}
  ]}],
  "total_estimated_cost": 1200.0, "currency": "USD", "summary": "2-3 sentence summary"
}"""


def build_itinerary_prompt(
    from_location: str, to_location: str, start_date: str, end_date: str,
    budget: float, currency: str, expectations: str, duration_days: int,
) -> str:
    return (
        f"{SYSTEM_PROMPT}\n\n"
        f"Use this JSON schema:\n{_SCHEMA_HINT}\n\n"
        f"Trip details:\n[USER_INPUT]\n"
        f"From: {from_location}\nTo: {to_location}\n"
        f"Dates: {start_date} to {end_date} ({duration_days} days)\n"
        f"Budget: {budget} {currency}\n"
        f"Expectations: {expectations}\n[/USER_INPUT]\n\n"
        f"Generate exactly {duration_days} days. total_estimated_cost must be <= {budget}. "
        "Respond with ONLY the JSON object."
    )


def build_alternatives_prompt(
    main_json: str, from_location: str, to_location: str,
    budget: float, currency: str, duration_days: int,
) -> str:
    return (
        f"{SYSTEM_PROMPT}\n\n"
        "Given this main itinerary, create 2 alternatives:\n"
        "1. Budget-conscious (same destination, 20% cheaper)\n"
        "2. Experience-rich (slightly higher quality, same budget cap)\n\n"
        f"Original:\n{main_json}\n\n"
        f"Both must stay within {budget} {currency} for {duration_days} days "
        f"from {from_location} to {to_location}. "
        "Respond with ONLY a JSON array of 2 itinerary objects."
    )


def parse_itinerary_json(raw: str) -> dict | None:
    try:
        cleaned = re.sub(r"```(?:json)?", "", raw).strip()
        return json.loads(cleaned)
    except Exception as exc:
        print(f"[ItineraryBuilder] JSON parse error: {exc}")
        return None
