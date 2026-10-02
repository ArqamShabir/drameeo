import { tmdbFetch, json, error, applyRateLimit, ANIM_GENRE } from './_tmdb.js'

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(200).end()
  // Search gets a tighter limit — 15 req/10s per IP
  if (await applyRateLimit(req, res, 15, 10)) return

  const q = (req.query.q || '').trim().slice(0, 200) // sanitize length
  if (!q) return json(res, { results: [], total_pages: 0, total_results: 0 })

  try {
    const page = Math.min(Number(req.query.page) || 1, 500)
    const data = await tmdbFetch('/search/movie', { query: q, page, include_adult: false }, 300)
    const animResults = data.results?.filter((m) => m.genre_ids?.includes(ANIM_GENRE))
    json(res, { ...data, results: animResults?.length > 0 ? animResults : data.results })
  } catch (err) {
    console.error('[/api/search]', err.message)
    error(res, 'Search failed')
  }
}
