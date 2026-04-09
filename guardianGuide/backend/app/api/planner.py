import json

from fastapi import APIRouter, Depends
from pydantic import BaseModel, ConfigDict, Field

from app.cache.redis_client import redis_client
from app.middleware.auth_guard import get_current_user
from app.middleware.rate_limiter import ai_limiter_dep
from app.services.planner.langgraph_agent import run_chat, run_planner

router = APIRouter(prefix="/planner", tags=["planner"])

_SESSION_PREFIX = "planner_session:"
_SESSION_TTL = 7200


class PlannerBody(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    from_location: str = Field(alias="fromLocation")
    to_location: str = Field(alias="toLocation")
    start_date: str = Field(alias="startDate")
    end_date: str = Field(alias="endDate")
    budget: float
    currency: str = "USD"
    expectations: str = ""
    trip_id: str | None = Field(default=None, alias="tripId")


def _norm_date(s: str) -> str:
    s = s.strip()
    if "T" in s:
        s = s.split("T", 1)[0]
    return s[:10]


@router.post("")
async def create_plan(
    body: PlannerBody,
    user: dict = Depends(get_current_user),
    _: None = Depends(ai_limiter_dep),
):
    start = _norm_date(body.start_date)
    end = _norm_date(body.end_date)
    out = await run_planner(
        from_location=body.from_location,
        to_location=body.to_location,
        start_date=start,
        end_date=end,
        budget=body.budget,
        currency=body.currency,
        expectations=body.expectations,
    )
    sid = out.get("session_id")
    if sid:
        await redis_client.set(
            f"{_SESSION_PREFIX}{sid}",
            json.dumps({"user_id": user["id"], "trip_id": body.trip_id}),
            ttl=_SESSION_TTL,
        )
    return out


class ChatBody(BaseModel):
    message: str


@router.post("/{session_id}/chat")
async def planner_chat(
    session_id: str,
    body: ChatBody,
    user: dict = Depends(get_current_user),
    _: None = Depends(ai_limiter_dep),
):
    raw = await redis_client.get(f"{_SESSION_PREFIX}{session_id}")
    if not raw:
        return {"response": "Session expired. Generate a new itinerary.", "suggested_action": None}
    meta = json.loads(raw)
    if meta.get("user_id") != user["id"]:
        return {"response": "Unauthorized session.", "suggested_action": None}
    return await run_chat(session_id, body.message)


@router.post("/{session_id}/confirm")
async def planner_confirm(
    session_id: str,
    user: dict = Depends(get_current_user),
):
    raw = await redis_client.get(f"{_SESSION_PREFIX}{session_id}")
    if not raw:
        return {"ok": False, "detail": "Session expired"}
    meta = json.loads(raw)
    if meta.get("user_id") != user["id"]:
        return {"ok": False, "detail": "Unauthorized"}
    return {"ok": True, "session_id": session_id}
