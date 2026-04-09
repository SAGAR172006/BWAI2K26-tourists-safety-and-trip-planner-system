"""Parse booking confirmation emails into structured reservation data."""
import re
from datetime import datetime


def parse_bookings(emails: list[dict]) -> list[dict]:
    bookings = []
    for email in emails:
        subject = email.get("subject", "").lower()
        snippet = email.get("snippet", "").lower()
        combined = subject + " " + snippet

        booking_type = _detect_type(combined)
        if not booking_type:
            continue

        booking = {
            "type": booking_type,
            "source": "gmail",
            "details": {
                "subject": email.get("subject", ""),
                "from": email.get("from", ""),
                "date": email.get("date", ""),
                "snippet": email.get("snippet", ""),
            },
            "confirmation_number": _extract_confirmation(email.get("snippet", "")),
        }
        bookings.append(booking)

    return bookings


def _detect_type(text: str) -> str | None:
    if any(w in text for w in ("flight", "airline", "airways", "boarding")):
        return "flight"
    if any(w in text for w in ("hotel", "resort", "inn", "check-in", "check in")):
        return "hotel"
    if any(w in text for w in ("train", "rail", "irctc", "amtrak")):
        return "train"
    if any(w in text for w in ("bus", "greyhound", "coach")):
        return "bus"
    return None


def _extract_confirmation(text: str) -> str | None:
    patterns = [
        r"confirmation[\s#:]*([A-Z0-9]{5,12})",
        r"booking[\s#:]*([A-Z0-9]{5,12})",
        r"reference[\s#:]*([A-Z0-9]{5,12})",
        r"PNR[\s#:]*([A-Z0-9]{5,10})",
    ]
    for pattern in patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            return match.group(1).upper()
    return None
