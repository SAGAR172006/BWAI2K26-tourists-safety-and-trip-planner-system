"""Lightweight guard against obvious prompt-injection phrases."""

_INJECTION_HINTS = (
    "ignore previous",
    "ignore all previous",
    "disregard",
    "system prompt",
    "you are now",
    "jailbreak",
    "developer mode",
)


def has_injection_attempt(text: str) -> bool:
    t = text.lower()
    return any(h in t for h in _INJECTION_HINTS)


def wrap_user_input(text: str) -> str:
    return text.strip()[:2000]
