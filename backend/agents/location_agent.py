from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class Theatre:
    name: str
    distance_km: float
    area: str | None = None


def find_nearby_theatres(city: str) -> list[Theatre]:
    """
    Dummy implementation (swap with Google Maps Places API later).
    """
    city = (city or "").strip()
    base = [
        Theatre(name="PVR Mall", distance_km=3.0, area="Downtown"),
        Theatre(name="INOX Central", distance_km=5.0, area="Central"),
        Theatre(name="Cinepolis Square", distance_km=7.0, area="Uptown"),
        Theatre(name="IMAX Arena", distance_km=9.5, area="North"),
    ]
    return base if city else []


def filter_by_distance(theatres: list[Theatre], max_distance_km: float) -> list[Theatre]:
    return [t for t in theatres if t.distance_km <= max_distance_km]

