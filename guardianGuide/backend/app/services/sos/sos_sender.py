"""Send SOS alerts via Twilio SMS and Resend email."""
import logging

import httpx
from supabase import create_client

from app.config import settings

logger = logging.getLogger(__name__)
_supabase = None


def _client():
    global _supabase  # noqa: PLW0603
    if _supabase is None and settings.supabase_url and settings.supabase_service_key:
        _supabase = create_client(settings.supabase_url, settings.supabase_service_key)
    return _supabase


async def send_sos_alerts(
    user_id: str,
    user_email: str,
    lat: float,
    lng: float,
    message: str,
    contact_ids: list[str],
) -> dict:
    maps_link = f"https://maps.google.com/maps?q={lat},{lng}"
    full_message = f"{message}\n\nLive location: {maps_link}"

    contacts = _get_emergency_contacts(user_id)
    sms_results, email_results = [], []

    for contact in contacts:
        if contact.get("phone"):
            ok = await _send_sms(contact["phone"], full_message)
            sms_results.append({"name": contact["name"], "phone": contact["phone"], "sent": ok})
        if contact.get("email"):
            ok = await _send_email(contact["email"], contact["name"], user_email, full_message)
            email_results.append({"name": contact["name"], "email": contact["email"], "sent": ok})

    return {
        "status": "sent",
        "location": {"lat": lat, "lng": lng},
        "sms_sent": sms_results,
        "email_sent": email_results,
        "maps_link": maps_link,
    }


def _get_emergency_contacts(user_id: str) -> list[dict]:
    cli = _client()
    if not cli:
        return []
    try:
        result = (
            cli.table("emergency_contacts")
            .select("name,phone,email")
            .eq("user_id", user_id)
            .execute()
        )
        return result.data or []
    except Exception as exc:
        logger.error("[SOS] Failed to fetch emergency contacts: %s", exc)
        return []


async def _send_sms(to_phone: str, message: str) -> bool:
    if not settings.twilio_account_sid or not settings.twilio_auth_token:
        logger.warning("[SOS] Twilio not configured — SMS not sent")
        return False
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.post(
                f"https://api.twilio.com/2010-04-01/Accounts/{settings.twilio_account_sid}/Messages.json",
                auth=(settings.twilio_account_sid, settings.twilio_auth_token),
                data={
                    "From": settings.twilio_phone_number,
                    "To": to_phone,
                    "Body": message,
                },
            )
            resp.raise_for_status()
            return True
    except Exception as exc:
        logger.error("[SOS] SMS failed to %s: %s", to_phone, exc)
        return False


async def _send_email(to_email: str, to_name: str, from_user: str, message: str) -> bool:
    if not settings.resend_api_key:
        logger.warning("[SOS] Resend not configured — email not sent")
        return False
    text_body = f"Emergency alert from {from_user}:\n\n{message}"
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.post(
                "https://api.resend.com/emails",
                headers={"Authorization": f"Bearer {settings.resend_api_key}"},
                json={
                    "from": settings.from_email,
                    "to": [to_email],
                    "subject": "EMERGENCY SOS — GuardianGuide",
                    "text": text_body,
                    "html": (
                        "<h2>EMERGENCY SOS</h2>"
                        f"<p>Alert from <strong>{from_user}</strong>:</p>"
                        f"<p>{message.replace(chr(10), '<br>')}</p>"
                    ),
                },
            )
            resp.raise_for_status()
            return True
    except Exception as exc:
        logger.error("[SOS] Email failed to %s: %s", to_email, exc)
        return False
