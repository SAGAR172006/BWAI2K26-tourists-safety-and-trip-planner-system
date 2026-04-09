"""
Two-Strike budget guard.
Strike 1: Budget below recommended — warn user.
Strike 2: Budget impossibly low — block planning.
"""
from app.services.planner.budget_validator import is_budget_sufficient
from app.cache.redis_client import redis_client

_STRIKE_KEY = "strikes:{session_id}"
_STRIKE_TTL = 1800  # 30 minutes


async def check_budget_strikes(
    session_id: str,
    budget: float,
    destination: str,
    duration_days: int,
    currency: str = "USD",
) -> dict:
    sufficient, min_budget = is_budget_sufficient(budget, destination, duration_days, currency)

    if sufficient:
        await redis_client.delete(_STRIKE_KEY.format(session_id=session_id))
        return {"status": "ok", "strike_count": 0, "min_budget": min_budget, "message": ""}

    key = _STRIKE_KEY.format(session_id=session_id)
    count_raw = await redis_client.get(key)
    current_count = int(count_raw) if count_raw else 0
    new_count = current_count + 1
    await redis_client.set(key, str(new_count), ttl=_STRIKE_TTL)

    if new_count >= 2:
        return {
            "status": "strike2",
            "strike_count": 2,
            "min_budget": min_budget,
            "message": (
                f"Budget too low. A realistic trip to {destination} for {duration_days} days "
                f"requires at least {currency} {min_budget:,.0f}. "
                "Please increase your budget to continue."
            ),
        }

    return {
        "status": "strike1",
        "strike_count": 1,
        "min_budget": min_budget,
        "message": (
            f"Your budget might be tight. We suggest at least {currency} {min_budget:,.0f} "
            f"for a comfortable trip to {destination}. You can still proceed with limited options."
        ),
    }


async def reset_strikes(session_id: str) -> None:
    await redis_client.delete(_STRIKE_KEY.format(session_id=session_id))
