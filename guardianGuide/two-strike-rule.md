— Budget Guardrail Logic

## The Two-Strike System

The two-strike rule exists for two reasons:
1. Protect users from planning an impossible trip
2. Prevent wasted LLM API calls (saves cost)

## States

```
State 0: CLEAN         → User hasn't submitted yet
State 1: STRIKE_1      → Budget too low (first time). Warning shown. LLM proceeds cautiously.
State 2: STRIKE_2      → Budget too low again. Input BLOCKED. LLM call BLOCKED.
```

## min_suggested_budget Calculation

```python
# services/planner/budget_validator.py

async def calculate_min_budget(destination: str, duration_days: int, currency: str) -> float:
    """
    Fetches real-world costs and calculates the minimum viable budget.
    Components: accommodation + food + local transport + entry fees + 20% buffer
    """
    
    # Fetch average costs (from Google Places price_level + cached data)
    avg_hotel_per_night = await get_avg_accommodation_cost(destination)
    avg_meals_per_day = await get_avg_food_cost(destination)
    avg_local_transport = await get_avg_transport_cost(destination)
    avg_entry_fees = await get_avg_activity_cost(destination)
    
    base_cost = (
        avg_hotel_per_night * duration_days +
        avg_meals_per_day * duration_days +
        avg_local_transport * duration_days +
        avg_entry_fees * duration_days
    )
    
    # 20% buffer for safety
    min_budget = base_cost * 1.20
    
    # Convert to user's currency
    return await convert_currency(min_budget, "USD", currency)
```

## Frontend Behavior (BudgetInput.tsx)

```typescript
// Strike 1 behavior
if (userBudget < minBudget && strikeCount === 0) {
  setStrikeCount(1)
  setStrikeState("warn")
  // Show: "⚠️ Suggested minimum for {destination}: {currency}{minBudget}"
  // Input stays enabled. User can change it.
  // LLM call proceeds but with budget_warning=true flag
}

// Strike 2 behavior  
if (userBudget < minBudget && strikeCount === 1) {
  setStrikeCount(2)
  setStrikeState("block")
  setInputDisabled(true)
  // Show: "❌ Budget too low. Minimum required: {currency}{minBudget}"
  // Input is DISABLED. User cannot submit.
  // Inside the input box: "Keep budget above {currency}{minBudget}"
  // Generate button: disabled, grayed out
}
```

---