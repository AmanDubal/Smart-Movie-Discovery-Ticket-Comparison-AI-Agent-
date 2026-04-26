from __future__ import annotations

from urllib.parse import quote_plus


def booking_redirect_url(theatre: str, movie_name: str, city: str) -> str:
    """
    Dummy redirect generator (swap with BookMyShow / Paytm / theatre deep-links later).
    """
    q = quote_plus(f"{movie_name} {theatre} {city}".strip())
    return f"https://www.google.com/search?q={q}+book+tickets"

