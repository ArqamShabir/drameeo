// api/movie.js — GET /api/movie?id=12345
import { tmdbFetch, json, error } from './_tmdb.js'

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(200).end()

  const id = req.query.id
  if (!id) return error(res, 'Movie ID required', 400)

  try {
    const data = await tmdbFetch(
      `/movie/${id}`,
      { append_to_response: 'credits,keywords' },
      3600  // 1h TTL
    )
    json(res, data)
  } catch (err) {
    console.error('[/api/movie]', err.message)
    error(res, 'Failed to fetch movie detail')
  }
}
