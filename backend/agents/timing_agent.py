from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime


@dataclass(frozen=True)
class ShowTimeOption:
    label: str
    score: int


def best_show_timings(preference: str | None = None) -> list[str]:
    """
    Dummy implementation:
    - Prefer evening/night by default
    - If preference == "morning", boost morning
    """
    preference = (preference or "").strip().lower()
    candidates = [
        ShowTimeOption("10:30 AM", 40),
        ShowTimeOption("1:15 PM", 55),
        ShowTimeOption("4:30 PM", 70),
        ShowTimeOption("7:15 PM", 95),
        ShowTimeOption("10:00 PM", 90),
    ]

    if preference == "morning":
        candidates = [ShowTimeOption(c.label, c.score + (30 if "AM" in c.label else 0)) for c in candidates]

    # small "weekend" bump in a deterministic way (no timezone dependence needed)
    is_weekend = datetime.now().weekday() >= 5
    if is_weekend:
        candidates = [ShowTimeOption(c.label, c.score + 5) for c in candidates]

    return [c.label for c in sorted(candidates, key=lambda x: x.score, reverse=True)[:3]]

