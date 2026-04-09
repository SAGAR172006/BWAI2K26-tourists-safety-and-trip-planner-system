"""Gmail OAuth placeholders — extend with full OAuth flow in production."""
from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse

from app.middleware.auth_guard import get_current_user
from app.services.gmail.gmail_reader import fetch_booking_emails

router = APIRouter(tags=["gmail"])


@router.get("/auth/gmail")
async def gmail_auth_start():
    return JSONResponse(
        {"detail": "Configure GMAIL_CLIENT_ID and redirect to Google OAuth with gmail.readonly scope."},
        status_code=501,
    )


@router.post("/gmail/sync")
async def gmail_sync(_user: dict = Depends(get_current_user)):
    emails = await fetch_booking_emails(_user["id"])
    return {"imported": 0, "preview": len(emails), "emails": emails[:5]}


@router.delete("/auth/gmail")
async def gmail_disconnect(_user: dict = Depends(get_current_user)):
    return {"ok": True}
