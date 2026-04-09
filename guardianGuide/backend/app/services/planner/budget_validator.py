"""Budget validator — estimates minimum viable budget for a trip."""

_DAILY_COST_BY_REGION: dict[str, float] = {
    "paris": 200, "france": 180, "london": 220, "uk": 200,
    "tokyo": 150, "japan": 140, "bali": 60, "indonesia": 55,
    "new york": 250, "usa": 200, "istanbul": 80, "turkey": 75,
    "santorini": 200, "greece": 130, "kyoto": 140, "dubai": 250,
    "uae": 230, "india": 40, "bangkok": 60, "thailand": 55,
    "singapore": 200, "barcelona": 160, "spain": 130, "rome": 160,
    "italy": 140, "amsterdam": 200, "netherlands": 180,
}
_DEFAULT_DAILY_COST = 120


def estimate_minimum_budget(destination: str, duration_days: int, currency: str = "USD") -> float:
    dest_lower = destination.lower()
    daily_cost = _DEFAULT_DAILY_COST
    for region, cost in _DAILY_COST_BY_REGION.items():
        if region in dest_lower:
            daily_cost = cost
            break
    min_usd = daily_cost * duration_days
    usd_rates: dict[str, float] = {
        "USD": 1.0, "EUR": 0.92, "GBP": 0.79, "INR": 83.0, "JPY": 150.0,
        "AUD": 1.52, "CAD": 1.36, "SGD": 1.34, "AED": 3.67,
        "THB": 35.0, "IDR": 15500.0, "TRY": 32.0,
    }
    rate = usd_rates.get(currency.upper(), 1.0)
    return round(min_usd * rate, 2)


def is_budget_sufficient(
    budget: float, destination: str, duration_days: int, currency: str = "USD"
) -> tuple[bool, float]:
    min_budget = estimate_minimum_budget(destination, duration_days, currency)
    return budget >= (min_budget * 0.7), min_budget
