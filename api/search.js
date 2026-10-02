// api/search.js — GET /api/search?q=moana&page=1
import { tmdbFetch, json, error, ANIM_GENRE } from './_tmdb.js'

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(200).end()

  const q = (req.query.q || '').trim()
  if (!q) return json(res, { results: [], total_pages: 0, total_results: 0 })

  try {
    const page = Number(req.query.page) || 1
    const data = await tmdbFetch(
      '/search/movie',
      { query: q, page, include_adult: false },
      300   // 5 min TTL for search (more dynamic)
    )

    // Optionally soft-filter to animation (keep results if no genre match)
    const animResults = data.results?.filter((m) => m.genre_ids?.includes(ANIM_GENRE))
    const results = animResults?.length > 0 ? animResults : data.results

    json(res, { ...data, results })
  } catch (err) {
    console.error('[/api/search]', err.message)
    error(res, 'Search failed')
  }
}
