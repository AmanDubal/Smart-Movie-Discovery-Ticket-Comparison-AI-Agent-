# Smart Movie Discovery & Ticket Comparison AI Agent

Multi-agent movie discovery + showtime/price comparison demo.

## What you get

- **Backend (FastAPI + SQLite)**: `backend/`
  - `/find-movie/` combines location → availability → price → timing → recommendation → booking link
  - Persists searches + recommendation payloads in SQLite
- **Frontend (React + Tailwind)**: `frontend/`
  - Full website UI (movie + city + preference + distance)
  - Calls the backend and shows result cards + booking redirect

## Folder structure

```
movie-agent-system/
  backend/
    agents/
    main.py
    database.py
    requirements.txt
    .env.example
  frontend/
    src/
    tailwind.config.cjs
    postcss.config.cjs
    package.json
    .env.example
```

## Run (Windows)

### 1) Backend

From `movie-agent-system/backend/`:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt

# optional: create a real .env (or just skip; defaults to ./movie_agent_system.db)
copy .env.example .env

uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

Open API docs at `http://127.0.0.1:8000/docs`.

### 2) Frontend

From `movie-agent-system/frontend/`:

```powershell
npm install

# optional: configure backend base URL
copy .env.example .env

npm run dev
```

Vite will print a local URL (usually `http://127.0.0.1:5173`).

## Notes

- Current data (theatres, availability, prices, timings) is **dummy** so the pipeline is easy to run locally.
- Upgrade paths:
  - **Google Maps Places API** for nearby theatres
  - **TMDB API** for movies
  - booking deep links (BookMyShow / Paytm / theatre sites)

