import { tmdbFetch, json, error, applyRateLimit, ANIM_GENRE } from './_tmdb.js'

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (await applyRateLimit(req, res)) return   // 429 already sent

  try {
    const page = Math.min(Number(req.query.page) || 1, 500)
    const data = await tmdbFetch('/trending/movie/week', { page }, 1800)
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
