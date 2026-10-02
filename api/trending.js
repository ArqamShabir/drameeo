// api/trending.js — GET /api/trending?page=1
import { tmdbFetch, json, error, ANIM_GENRE } from './_tmdb.js'

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(200).end()

  try {
    const page = Number(req.query.page) || 1
    // Trending week, filtered post-fetch to animation genre
    const data = await tmdbFetch('/trending/movie/week', { page }, 1800)

    // Filter to animation-only (genre_ids includes 16)
    const filtered = {
      ...data,
      results: data.results?.filter((m) => m.genre_ids?.includes(ANIM_GENRE)) ?? [],
    }

    json(res, filtered)
  } catch (err) {
    console.error('[/api/trending]', err.message)
    error(res, 'Failed to fetch trending movies')
  }
}
