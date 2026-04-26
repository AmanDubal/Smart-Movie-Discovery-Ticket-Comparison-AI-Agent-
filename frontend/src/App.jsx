import { useMemo, useState } from 'react'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000'

function Badge({ children, tone = 'slate' }) {
  const cls = useMemo(() => {
    const base =
      'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset'
    const tones = {
      slate: 'bg-slate-50 text-slate-700 ring-slate-200',
      green: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
      violet: 'bg-violet-50 text-violet-700 ring-violet-200',
      amber: 'bg-amber-50 text-amber-800 ring-amber-200',
      red: 'bg-rose-50 text-rose-700 ring-rose-200',
    }
    return `${base} ${tones[tone] || tones.slate}`
  }, [tone])
  return <span className={cls}>{children}</span>
}

function Card({ title, children, right }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-start justify-between gap-4">
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
        {right}
      </div>
      {children}
    </div>
  )
}

export default function App() {
  const [movieName, setMovieName] = useState('')
  const [city, setCity] = useState('')
  const [preference, setPreference] = useState('cheapest')
  const [maxDistanceKm, setMaxDistanceKm] = useState(12)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [data, setData] = useState(null)

  async function onSearch(e) {
    e.preventDefault()
    setError('')
    setData(null)
    setLoading(true)

    try {
      const url = new URL('/find-movie/', API_BASE)
      url.searchParams.set('movie_name', movieName.trim())
      url.searchParams.set('city', city.trim())
      url.searchParams.set('preference', preference)
      url.searchParams.set('max_distance_km', String(maxDistanceKm))

      const res = await fetch(url.toString())
      const json = await res.json()
      if (!res.ok) {
        throw new Error(json?.detail?.[0]?.msg || json?.detail || 'Request failed')
      }
      setData(json)
    } catch (err) {
      setError(err?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-full bg-gradient-to-b from-slate-50 to-white">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <header className="mb-8">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <Badge tone="violet">Multi-agent</Badge>
            <Badge tone="green">FastAPI + SQLite</Badge>
            <Badge>React + Tailwind</Badge>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Smart Movie Discovery & Ticket Comparison
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">
            Find nearby theatres, check availability, compare prices, optimize show timings, and get
            one best recommendation based on your preference.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Card
              title="Search"
              right={
                <span className="text-xs text-slate-500">
                  API: <span className="font-mono">{API_BASE}</span>
                </span>
              }
            >
              <form className="space-y-4" onSubmit={onSearch}>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-700">
                    Movie name
                  </label>
                  <input
                    value={movieName}
                    onChange={(e) => setMovieName(e.target.value)}
                    placeholder="e.g. Dune: Part Two"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-700">City</label>
                  <input
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Mumbai"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
                    required
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-700">
                      Preference
                    </label>
                    <select
                      value={preference}
                      onChange={(e) => setPreference(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
                    >
                      <option value="cheapest">Cheapest</option>
                      <option value="nearest">Nearest</option>
                      <option value="timing">Best timing</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-700">
                      Max distance (km)
                    </label>
                    <input
                      type="number"
                      value={maxDistanceKm}
                      min={1}
                      max={50}
                      onChange={(e) => setMaxDistanceKm(Number(e.target.value))}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? 'Searching…' : 'Find best option'}
                </button>

                {error ? (
                  <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800">
                    {error}
                  </div>
                ) : null}

                <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
                  Tip: for now, theatre availability/prices are dummy data. You’ll upgrade to TMDB +
                  Maps + booking integrations later.
                </div>
              </form>
            </Card>
          </div>

          <div className="lg:col-span-3">
            {!data ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center text-sm text-slate-600">
                Enter a movie + city and click <span className="font-semibold">Find best option</span>.
              </div>
            ) : data.status !== 'ok' ? (
              <Card
                title="No recommendation yet"
                right={<Badge tone={data.status === 'not_available' ? 'amber' : 'red'}>{data.status}</Badge>}
              >
                <p className="text-sm text-slate-700">{data.message}</p>
                {Array.isArray(data.running_movies) && data.running_movies.length ? (
                  <div className="mt-4">
                    <div className="mb-2 text-xs font-semibold text-slate-900">Running movies</div>
                    <div className="flex flex-wrap gap-2">
                      {data.running_movies.slice(0, 8).map((m) => (
                        <Badge key={m}>{m}</Badge>
                      ))}
                    </div>
                  </div>
                ) : null}
              </Card>
            ) : (
              <div className="space-y-6">
                <Card
                  title="Recommended option"
                  right={<Badge tone="green">best match</Badge>}
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-xl bg-slate-50 p-4">
                      <div className="text-xs font-medium text-slate-600">Theatre</div>
                      <div className="mt-1 text-lg font-semibold text-slate-900">
                        {data.recommended_theatre}
                      </div>
                      <div className="mt-2 text-xs text-slate-600">
                        Preference: <span className="font-mono">{data.preference}</span>
                      </div>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-4">
                      <div className="text-xs font-medium text-slate-600">Lowest price</div>
                      <div className="mt-1 text-lg font-semibold text-slate-900">
                        ₹{data.lowest_price}
                      </div>
                      <div className="mt-2 text-xs text-slate-600">
                        City: <span className="font-mono">{data.city}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="mb-2 text-xs font-semibold text-slate-900">Best timings</div>
                    <div className="flex flex-wrap gap-2">
                      {data.best_timings.map((t) => (
                        <Badge key={t} tone="violet">
                          {t}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <a
                      href={data.booking_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-violet-500"
                    >
                      Book tickets
                    </a>
                    <button
                      type="button"
                      onClick={() => navigator.clipboard.writeText(data.booking_url)}
                      className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50"
                    >
                      Copy booking link
                    </button>
                  </div>
                </Card>

                <Card title="Price comparison">
                  <div className="overflow-hidden rounded-xl border border-slate-200">
                    <table className="w-full border-collapse text-left text-sm">
                      <thead className="bg-slate-50 text-xs font-semibold text-slate-600">
                        <tr>
                          <th className="px-4 py-3">Theatre</th>
                          <th className="px-4 py-3">Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.comparisons.map((row, idx) => (
                          <tr
                            key={`${row.theatre}-${idx}`}
                            className="border-t border-slate-200"
                          >
                            <td className="px-4 py-3 text-slate-900">{row.theatre}</td>
                            <td className="px-4 py-3 font-semibold text-slate-900">
                              ₹{row.price}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>

                <Card title="Nearby theatres (dummy)">
                  <div className="grid gap-3 sm:grid-cols-2">
                    {data.theatres.map((t) => (
                      <div
                        key={t.name}
                        className="rounded-xl border border-slate-200 bg-white p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="text-sm font-semibold text-slate-900">{t.name}</div>
                            <div className="mt-1 text-xs text-slate-600">{t.area}</div>
                          </div>
                          <Badge tone="slate">{t.distance_km} km</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}
          </div>
        </div>

        <footer className="mt-10 border-t border-slate-200 pt-6 text-xs text-slate-500">
          Backend saves each search + recommendation in SQLite (
          <span className="font-mono">backend/movie_agent_system.db</span> by default).
        </footer>
      </div>
    </div>
  )
}
