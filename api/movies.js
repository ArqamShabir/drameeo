// api/movies.js — GET /api/movies?category=popular&genre=16&page=1
import { tmdbFetch, json, error, ANIM_GENRE } from './_tmdb.js'

const VALID_CATEGORIES = ['popular', 'top_rated', 'now_playing', 'upcoming']

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(200).end()

  try {
    const page     = Number(req.query.page) || 1
    const genreId  = req.query.genre ? Number(req.query.genre) : ANIM_GENRE
    const category = VALID_CATEGORIES.includes(req.query.category)
      ? req.query.category
      : 'popular'

    const data = await tmdbFetch(
      `/movie/${category}`,
      { with_genres: genreId, page },
      3600  // 1h TTL
    )

    json(res, data)
  } catch (err) {
    console.error('[/api/movies]', err.message)
    error(res, 'Failed to fetch movies')
  }
}
