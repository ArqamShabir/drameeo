import { tmdbFetch, json, error, applyRateLimit } from './_tmdb.js'

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (await applyRateLimit(req, res)) return

  try {
    const data = await tmdbFetch('/genre/movie/list', {}, 7 * 24 * 3600)
    json(res, data)
  } catch (err) {
    console.error('[/api/genres]', err.message)
    error(res, 'Failed to fetch genres')
  }
}
