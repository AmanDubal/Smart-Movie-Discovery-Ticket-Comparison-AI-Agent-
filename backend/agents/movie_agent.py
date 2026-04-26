from __future__ import annotations

from dataclasses import dataclass

from agents.location_agent import Theatre


@dataclass(frozen=True)
class MovieAvailability:
    theatre: Theatre
    movie: str
    available: bool


def currently_running_movies(city: str) -> list[str]:
    """
    Dummy implementation (swap with TMDB + theatre showtimes later).
    """
    if not (city or "").strip():
        return []
    return [
        "Dune: Part Two",
        "Oppenheimer",
        "Kung Fu Panda 4",
        "Godzilla x Kong",
        "Inside Out 2",
    ]


def check_movie_availability(movie_name: str, theatres: list[Theatre]) -> list[MovieAvailability]:
    movie_name = (movie_name or "").strip()
    if not movie_name:
        return []

    available: list[MovieAvailability] = []
    for i, theatre in enumerate(theatres):
        # Dummy rule: make some theatres unavailable deterministically
        is_available = (i % 3) != 2
        available.append(MovieAvailability(theatre=theatre, movie=movie_name, available=is_available))
    return available

