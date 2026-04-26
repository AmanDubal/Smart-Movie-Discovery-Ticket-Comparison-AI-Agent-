from __future__ import annotations

from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from pydantic import BaseModel

from agents.recommendation_agent import recommend_movie_option
from database import init_db


app = FastAPI(title="Smart Movie Discovery Agent")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


class FindMovieResponse(BaseModel):
    status: str


@app.on_event("startup")
def _startup():
    init_db()


@app.get("/")
def home():
    return HTMLResponse(
        """
        <!doctype html>
        <html lang="en">
          <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>Movie AI Agent Backend</title>
            <style>
              body { font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif; margin: 40px; color: #0f172a; }
              .card { max-width: 720px; border: 1px solid #e2e8f0; border-radius: 16px; padding: 20px; background: #fff; }
              a.btn { display: inline-block; padding: 10px 14px; border-radius: 12px; text-decoration: none; margin-right: 10px; }
              .primary { background: #0f172a; color: #fff; }
              .secondary { background: #f1f5f9; color: #0f172a; }
              code { background: #f1f5f9; padding: 2px 6px; border-radius: 8px; }
              .muted { color: #475569; }
            </style>
          </head>
          <body>
            <div class="card">
              <h2 style="margin:0 0 8px;">Movie AI Agent Backend is running</h2>
              <p class="muted" style="margin:0 0 16px;">
                This is the API server. For the full website UI, open your Vite frontend (usually
                <code>http://127.0.0.1:5173</code>).
              </p>
              <div style="margin: 14px 0 18px;">
                <a class="btn primary" href="/docs">Open API Docs</a>
                <a class="btn secondary" href="/find-movie/?movie_name=Dune%3A%20Part%20Two&city=Mumbai&preference=cheapest&max_distance_km=12">Try sample request</a>
              </div>
              <div class="muted" style="font-size: 14px;">
                Endpoint: <code>GET /find-movie/</code>
              </div>
            </div>
          </body>
        </html>
        """.strip()
    )


@app.get("/find-movie/", response_model=dict)
def find_movie(
    movie_name: str = Query(..., min_length=1),
    city: str = Query(..., min_length=1),
    preference: str = Query("cheapest", pattern="^(cheapest|nearest|timing|best_timing|best time)?$"),
    max_distance_km: float = Query(12.0, ge=0.5, le=50.0),
):
    return recommend_movie_option(
        movie_name=movie_name,
        city=city,
        preference=preference,
        max_distance_km=max_distance_km,
    )

