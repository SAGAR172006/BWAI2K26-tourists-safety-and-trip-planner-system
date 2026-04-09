"""
LangGraph planner agent using Gemini 2.0 Flash.
Manages multi-turn conversation state across planning phases.
"""
import uuid
import json
import asyncio
from typing import Annotated, TypedDict, Any

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from langgraph.graph import StateGraph, END
from langgraph.graph.message import add_messages

from app.config import settings
from app.middleware.pii_redactor import redact_pii
from app.middleware.prompt_injection_guard import wrap_user_input, has_injection_attempt
from app.services.planner.itinerary_builder import (
    build_itinerary_prompt, build_alternatives_prompt, parse_itinerary_json,
)
from app.services.planner.two_strike_guard import check_budget_strikes


class PlannerState(TypedDict):
    messages: Annotated[list, add_messages]
    session_id: str
    strike_count: int
    budget: float
    currency: str
    destination: str
    duration_days: int
    from_location: str
    start_date: str
    end_date: str
    expectations: str
    itinerary: dict | None
    alternatives: list
    confirmed: bool
    status: str


def _llm() -> ChatGoogleGenerativeAI:
    return ChatGoogleGenerativeAI(
        model=settings.llm_model,
        google_api_key=settings.google_generative_ai_api_key,
        temperature=0.7,
    )


def _generate_node(state: PlannerState) -> PlannerState:
    lm = _llm()
    prompt = build_itinerary_prompt(
        from_location=state["from_location"],
        to_location=state["destination"],
        start_date=state["start_date"],
        end_date=state["end_date"],
        budget=state["budget"],
        currency=state["currency"],
        expectations=state["expectations"],
        duration_days=state["duration_days"],
    )
    resp = lm.invoke([HumanMessage(content=prompt)])
    parsed = parse_itinerary_json(resp.content) or {
        "title": f"Trip to {state['destination']}",
        "days": [], "total_estimated_cost": 0,
        "currency": state["currency"], "summary": resp.content,
    }

    alts: list = []
    try:
        alts_prompt = build_alternatives_prompt(
            json.dumps(parsed), state["from_location"], state["destination"],
            state["budget"], state["currency"], state["duration_days"],
        )
        alts_resp = lm.invoke([HumanMessage(content=alts_prompt)])
        alts_data = parse_itinerary_json(alts_resp.content)
        if isinstance(alts_data, list):
            alts = alts_data[:2]
    except Exception:
        pass

    return {
        **state,
        "itinerary": parsed,
        "alternatives": alts,
        "status": "success",
        "messages": state["messages"] + [AIMessage(content=json.dumps(parsed))],
    }


def _build_graph() -> Any:
    def route(state: PlannerState) -> str:
        return END if state["status"] == "strike2" else "generate"

    g = StateGraph(PlannerState)
    g.add_node("generate", _generate_node)
    g.set_conditional_entry_point(route)
    g.add_edge("generate", END)
    return g.compile()


_GRAPH = _build_graph()


async def run_planner(
    from_location: str, to_location: str,
    start_date: str, end_date: str,
    budget: float, currency: str,
    expectations: str, session_id: str | None = None,
) -> dict:
    if not session_id:
        session_id = str(uuid.uuid4())

    clean_exp = redact_pii(expectations)
    if has_injection_attempt(clean_exp):
        clean_exp = "[filtered]"
    clean_exp = wrap_user_input(clean_exp)

    from datetime import date as _date
    try:
        d1, d2 = _date.fromisoformat(start_date), _date.fromisoformat(end_date)
        duration_days = max((d2 - d1).days, 1)
    except Exception:
        duration_days = 3

    strike_result = await check_budget_strikes(
        session_id=session_id, budget=budget,
        destination=to_location, duration_days=duration_days, currency=currency,
    )

    if strike_result["status"] == "strike2":
        return {
            "status": "strike2", "session_id": session_id,
            "min_budget": strike_result["min_budget"],
            "message": strike_result["message"],
            "itinerary": None, "alternatives": [],
        }

    initial: PlannerState = {
        "messages": [HumanMessage(content=clean_exp)],
        "session_id": session_id,
        "strike_count": strike_result.get("strike_count", 0),
        "budget": budget, "currency": currency,
        "destination": to_location, "duration_days": duration_days,
        "from_location": from_location, "start_date": start_date, "end_date": end_date,
        "expectations": clean_exp,
        "itinerary": None, "alternatives": [], "confirmed": False,
        "status": strike_result["status"],
    }

    loop = asyncio.get_event_loop()
    final = await loop.run_in_executor(None, _GRAPH.invoke, initial)

    return {
        "status": final["status"], "session_id": session_id,
        "itinerary": final.get("itinerary"),
        "alternatives": final.get("alternatives", []),
        "message": strike_result.get("message", ""),
        "min_budget": strike_result.get("min_budget"),
    }


async def run_chat(session_id: str, message: str) -> dict:
    clean = redact_pii(message)
    if has_injection_attempt(clean):
        return {"response": "I can only help with travel planning questions.", "suggested_action": None}

    lm = _llm()
    sys_msg = SystemMessage(content=(
        "You are GuardianGuide, an AI travel assistant. "
        "Help refine itineraries. Be concise and practical."
    ))
    resp = lm.invoke([sys_msg, HumanMessage(content=wrap_user_input(clean))])
    return {"response": resp.content, "suggested_action": None}
