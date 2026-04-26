from __future__ import annotations

import json
from dataclasses import asdict
from datetime import datetime, timezone

from agents.booking_agent import booking_redirect_url
from agents.location_agent import filter_by_distance, find_nearby_theatres
from agents.movie_agent import check_movie_availability, currently_running_movies
from agents.price_agent import compare_prices
from agents.timing_agent import best_show_timings
from database import db_conn


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def recommend_movie_option(
    movie_name: str,
    city: str,
    preference: str = "cheapest",
    max_distance_km: float = 12.0,
):
    theatres = find_nearby_theatres(city)
    theatres = filter_by_distance(theatres, max_distance_km=max_distance_km)
    availability = check_movie_availability(movie_name, theatres)
    price_quotes = compare_prices(availability)
    timings = best_show_timings(preference=preference)

    if not theatres:
        payload = {
            "status": "no_theatres",
            "message": "No theatres found for this city.",
            "city": city,
            "movie_name": movie_name,
            "results": [],
        }
        return payload

    if not price_quotes:
        payload = {
            "status": "not_available",
            "message": "Movie not available in nearby theatres (dummy availability).",
            "city": city,
            "movie_name": movie_name,
            "results": [
                {"theatre": t.name, "distance_km": t.distance_km, "available": a.available}
                for t, a in zip(theatres, availability)
            ],
            "running_movies": currently_running_movies(city),
        }
        return payload

    # Decide final recommendation based on preference
    preference_norm = (preference or "").strip().lower()
    if preference_norm == "nearest":
        # pick nearest theatre among those that have a price quote
        quote_theatres = {q.theatre for q in price_quotes}
        nearest = min((t for t in theatres if t.name in quote_theatres), key=lambda t: t.distance_km)
        chosen_theatre = nearest.name
        chosen_price = next(q.price_inr for q in price_quotes if q.theatre == chosen_theatre)
    elif preference_norm in ("best_timing", "timing", "best time"):
        # in dummy mode, prices sorted; choose mid-price as "timing-friendly" to vary output
        chosen = price_quotes[len(price_quotes) // 2]
        chosen_theatre, chosen_price = chosen.theatre, chosen.price_inr
    else:
        # default cheapest
        chosen_theatre, chosen_price = price_quotes[0].theatre, price_quotes[0].price_inr

    booking_url = booking_redirect_url(theatre=chosen_theatre, movie_name=movie_name, city=city)

    payload = {
        "status": "ok",
        "city": city,
        "movie_name": movie_name,
        "preference": preference_norm or "cheapest",
        "recommended_theatre": chosen_theatre,
        "lowest_price": chosen_price,
        "best_timings": timings,
        "booking_url": booking_url,
        "comparisons": [{"theatre": q.theatre, "price": q.price_inr} for q in price_quotes],
        "theatres": [asdict(t) for t in theatres],
        "running_movies": currently_running_movies(city),
    }

    # Persist to SQLite
    with db_conn() as conn:
        cur = conn.execute(
            """
            INSERT INTO searches (movie_name, city, preference, created_at)
            VALUES (?, ?, ?, ?)
            """,
            (movie_name.strip(), city.strip(), payload["preference"], _now_iso()),
        )
        search_id = cur.lastrowid
        conn.execute(
            """
            INSERT INTO recommendations
              (search_id, recommended_theatre, lowest_price, best_timings_json, payload_json, created_at)
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            (
                search_id,
                chosen_theatre,
                int(chosen_price),
                json.dumps(timings),
                json.dumps(payload),
                _now_iso(),
            ),
        )

    return payload

