"""Redact common PII patterns from free text."""
import re


def redact_pii(text: str) -> str:
    if not text:
        return text
    try:
        out = re.sub(
            r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}",
            "[EMAIL]",
            text,
        )
        out = re.sub(
            r"[\+]?[(]?[0-9]{1,4}[)]?[-\s\./0-9]{8,14}",
            "[PHONE]",
            out,
        )
        out = re.sub(
            r"\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b",
            "[CARD]",
            out,
        )
        return out
    except Exception:
        return text
