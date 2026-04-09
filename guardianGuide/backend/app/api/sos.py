from datetime import datetime, timezone

from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel

from app.config import settings
from app.middleware.auth_guard import get_current_user
from app.middleware.rate_limiter import general_limiter_dep
from app.services.sos.emergency_finder import fetch_nearby_emergency_services
from app.services.sos.sos_sender import send_sos_alerts

router = APIRouter(prefix="/sos", tags=["sos"])


@router.get("/emergency-contacts")
async def emergency_contacts(
    lat: float = Query(...),
    lng: float = Query(...),
    _: None = Depends(general_limiter_dep),
):
    services = await fetch_nearby_emergency_services(lat, lng, radius_m=3000)
    grouped: dict[str, list[dict]] = {"police": [], "hospital": [], "fire_station": []}
    for s in services:
        t = s.get("type", "other")
        if t in grouped:
            grouped[t].append(
                {"name": s.get("name"), "phone": s.get("phone") or "112", "lat": s.get("lat"), "lng": s.get("lng")}
            )
    if not any(grouped.values()):
        grouped = {
            "police": [{"name": "Emergency", "phone": "112", "lat": lat, "lng": lng}],
            "hospital": [{"name": "Medical", "phone": "112", "lat": lat, "lng": lng}],
            "fire_station": [{"name": "Fire", "phone": "112", "lat": lat, "lng": lng}],
        }
    return grouped


class Coordinates(BaseModel):
    lat: float
    lng: float


class SosBody(BaseModel):
    coordinates: Coordinates
    timestamp: str | None = None
    message: str | None = None


@router.post("")
async def post_sos(
    body: SosBody,
    user: dict = Depends(get_current_user),
    _: None = Depends(general_limiter_dep),
):
    ts = body.timestamp or datetime.now(timezone.utc).isoformat()
    msg = body.message or (
        f"EMERGENCY — user {user['id']} at {body.coordinates.lat},{body.coordinates.lng} at {ts}"
    )
    result = await send_sos_alerts(
        user_id=user["id"],
        user_email=user.get("email") or "unknown@user.local",
        lat=body.coordinates.lat,
        lng=body.coordinates.lng,
        message=msg,
        contact_ids=[],
    )
    n = len(result.get("sms_sent", [])) + len(result.get("email_sent", []))
    return {"sent_to": n, "status": "ok", "detail": result}
