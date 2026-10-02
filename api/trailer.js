import { tmdbFetch, json, error, applyRateLimit } from './_tmdb.js'

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (await applyRateLimit(req, res)) return

  const id = req.query.id
  if (!id || isNaN(Number(id))) return error(res, 'Valid movie ID required', 400)

  try {
    const data   = await tmdbFetch(`/movie/${id}/videos`, {}, 86400)
    const videos = data.results ?? []
    const trailer =
      videos.find((v) => v.site === 'YouTube' && v.type === 'Trailer' && v.official) ??
      videos.find((v) => v.site === 'YouTube' && v.type === 'Trailer') ??
      videos.find((v) => v.site === 'YouTube' && v.type === 'Teaser') ??
      videos.find((v) => v.site === 'YouTube')
    json(res, { key: trailer?.key ?? null, name: trailer?.name ?? null })
  } catch (err) {
    console.error('[/api/trailer]', err.message)
    error(res, 'Failed to fetch trailer')
  }
}
