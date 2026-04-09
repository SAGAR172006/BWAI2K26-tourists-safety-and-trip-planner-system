"""Save parsed Gmail bookings to Supabase reservations table."""
from supabase import create_client

from app.config import settings

_supabase = None


def _sb():
    global _supabase
    if _supabase is None and settings.supabase_url and settings.supabase_service_key:
        _supabase = create_client(settings.supabase_url, settings.supabase_service_key)
    return _supabase


async def save_bookings_to_supabase(
    user_id: str, trip_id: str, bookings: list[dict]
) -> list[dict]:
    cli = _sb()
    if not cli:
        return []
    saved = []
    for booking in bookings:
        try:
            record = {
                "user_id": user_id,
                "trip_id": trip_id,
                "type": booking["type"],
                "source": "gmail",
                "details": booking["details"],
                "confirmation_number": booking.get("confirmation_number"),
            }
            result = cli.table("reservations").upsert(
                record,
                on_conflict="user_id,confirmation_number",
                ignore_duplicates=True,
            ).execute()
            if result.data:
                saved.append(result.data[0])
        except Exception as exc:
            print(f"[SupabaseUpdater] Error saving booking: {exc}")
    return saved
