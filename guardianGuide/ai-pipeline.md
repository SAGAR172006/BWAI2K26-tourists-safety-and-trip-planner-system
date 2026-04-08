— AI Pipeline Documentation

## The 5 Pillars Implementation

### Pillar 3: LangGraph Planner Agent

```python
# State definition
class PlannerState(TypedDict):
    messages: list[BaseMessage]
    destination: str
    origin: str
    duration: str          # "5 nights, 6 days (Dec 20 - Dec 26)"
    budget: float
    currency: str
    min_budget: float
    strike_count: int      # 0, 1, or 2
    expectations: str
    itinerary: dict | None
    alternatives: list[dict]
    confirmed: bool
    is_replanning: bool    # CRITICAL: blocks image gen when True

# Graph construction
from langgraph.graph import StateGraph, END

graph = StateGraph(PlannerState)
graph.add_node("validate_budget", validate_budget_node)
graph.add_node("strike_handler", strike_handler_node)
graph.add_node("generate_plan", generate_plan_node)
graph.add_node("tag_activities", tag_activities_node)
graph.add_node("chat_responder", chat_responder_node)
graph.add_node("confirm_handler", confirm_handler_node)

graph.set_entry_point("validate_budget")
graph.add_conditional_edges("validate_budget", route_budget, {
    "pass": "generate_plan",
    "strike": "strike_handler"
})
graph.add_conditional_edges("strike_handler", route_strike, {
    "warn": END,           # Return warning to user, wait for re-input
    "block": END           # Return hard block, do not proceed
})
graph.add_edge("generate_plan", "tag_activities")
graph.add_edge("tag_activities", END)
```

### Pillar 4: Stable Diffusion — Trigger Guard

```python
# services/image_gen/trigger_guard.py

async def maybe_generate_image(state: PlannerState, destination: str) -> str:
    """
    ONLY generate image on final confirmation.
    SKIP during any re-planning to save API costs.
    """
    if state["is_replanning"]:
        # Return cached image from Supabase storage if exists
        cached = await get_cached_image(destination)
        if cached:
            return cached
        return "/placeholders/destination-default.jpg"
    
    if not state["confirmed"]:
        return "/placeholders/destination-default.jpg"
    
    # Only reaches here on first confirmed plan
    prompt = f"Photorealistic travel photography of {destination}, \
               golden hour lighting, cinematic composition, 8k resolution, \
               wide angle lens, professional travel magazine style"
    
    image_url = await call_replicate_stable_diffusion(prompt)
    await cache_image(destination, image_url)  # Cache for future re-plans
    return image_url
```

### Pillar 5: Budget Re-planning + Hashtag Tags

```python
# services/planner/tag_engine.py

CATEGORY_TAGS = {
    "accommodation": ["#BudgetStay", "#MidRangeStay", "#LuxuryStay"],
    "food": ["#StreetFood", "#LocalDining", "#FineFood"],
    "transport": ["#PublicTransit", "#TaxiRide", "#RentedVehicle"],
    "activity": ["#Cultural", "#Adventure", "#Relaxation", "#Shopping"],
    "attraction": ["#MustSee", "#HiddenGem", "#Touristy"],
}

def tag_activity(activity: dict, budget_level: str) -> list[str]:
    """Assign hashtags based on cost and category"""
    tags = []
    cost = activity.get("estimated_cost", 0)
    category = activity.get("category", "activity")
    
    if cost < 20:
        tags.append("#Budget")
    elif cost < 80:
        tags.append("#MidRange")
    else:
        tags.append("#Splurge")
    
    tags.extend(get_category_tags(category, budget_level))
    return tags
```

---