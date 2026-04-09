"""Fetch booking confirmation emails from Gmail (read-only)."""
import logging
from supabase import create_client
from app.config import settings

logger = logging.getLogger(__name__)
_supabase = None


def _sb():
    global _supabase
    if _supabase is None and settings.supabase_url and settings.supabase_service_key:
        _supabase = create_client(settings.supabase_url, settings.supabase_service_key)
    return _supabase


async def fetch_booking_emails(user_id: str) -> list[dict]:
    """
    Fetch Gmail booking confirmation emails for a user.
    Requires Gmail token stored in users.gmail_token (JSONB).
    Returns list of {subject, from, date, snippet, body} dicts.
    """
    cli = _sb()
    if not cli:
        return []
    try:
        result = cli.table("users").select("gmail_token").eq("id", user_id).single().execute()
        token_data = result.data.get("gmail_token") if result.data else None
        if not token_data:
            logger.info("[Gmail] No Gmail token for user %s", user_id)
            return []

        from google.oauth2.credentials import Credentials
        from googleapiclient.discovery import build

        creds = Credentials(
            token=token_data.get("access_token"),
            refresh_token=token_data.get("refresh_token"),
            client_id=settings.gmail_client_id,
            client_secret=settings.gmail_client_secret,
            token_uri="https://oauth2.googleapis.com/token",
        )

        service = build("gmail", "v1", credentials=creds)
        query = "subject:(booking OR reservation OR ticket OR confirmation)"
        messages_result = service.users().messages().list(
            userId="me", q=query, maxResults=20
        ).execute()

        emails = []
        for msg_ref in messages_result.get("messages", []):
            msg = service.users().messages().get(
                userId="me", id=msg_ref["id"], format="metadata"
            ).execute()
            headers = {h["name"]: h["value"] for h in msg.get("payload", {}).get("headers", [])}
            emails.append({
                "id": msg_ref["id"],
                "subject": headers.get("Subject", ""),
                "from": headers.get("From", ""),
                "date": headers.get("Date", ""),
                "snippet": msg.get("snippet", ""),
            })
        return emails

    except Exception as exc:
        logger.error("[Gmail] Error fetching emails for user %s: %s", user_id, exc)
        return []
