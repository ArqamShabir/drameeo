import { tmdbFetch, json, error, applyRateLimit } from './_tmdb.js'

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (await applyRateLimit(req, res)) return

  const id = req.query.id
  if (!id || isNaN(Number(id))) return error(res, 'Valid movie ID required', 400)

  try {
    const data = await tmdbFetch(`/movie/${id}`, { append_to_response: 'credits,keywords' }, 3600)
    json(res, data)
  } catch (err) {
    console.error('[/api/movie]', err.message)
    error(res, 'Failed to fetch movie detail')
  }
}
