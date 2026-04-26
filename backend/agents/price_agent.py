from __future__ import annotations

from dataclasses import dataclass

from agents.movie_agent import MovieAvailability


@dataclass(frozen=True)
class PriceQuote:
    theatre: str
    price_inr: int


def compare_prices(movie_data: list[MovieAvailability]) -> list[PriceQuote]:
    """
    Dummy implementation (swap with theatre/booking sources later).
    """
    sample_prices = [220, 180, 250, 199, 275, 210]
    quotes: list[PriceQuote] = []

    for i, item in enumerate(movie_data):
        if not item.available:
            continue
        quotes.append(PriceQuote(theatre=item.theatre.name, price_inr=sample_prices[i % len(sample_prices)]))

    return sorted(quotes, key=lambda x: x.price_inr)

