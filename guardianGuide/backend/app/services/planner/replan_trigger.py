"""Decides if a full LLM replan is needed or just a local edit."""

_REPLAN_KEYWORDS = [
    "change destination", "different country", "new budget",
    "start over", "completely different", "change everything",
    "new trip", "different dates",
]


def should_trigger_replan(user_message: str, current_itinerary: dict | None) -> bool:
    if current_itinerary is None:
        return True
    lower = user_message.lower()
    return any(kw in lower for kw in _REPLAN_KEYWORDS)
