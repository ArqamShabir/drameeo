// ──────────────────────────────────────────────────────────────
// Content-Based Recommendation Engine
//
// Scoring formula:
//   score = (shared genres × 3) + (popularity / 1000) + ratingBonus
//
// Cold-start tiers:
//   0 watched  →  return trending
//   1-2 watched →  filter by top genre
//   3+  watched →  full content-based filter
// ──────────────────────────────────────────────────────────────

/**
 * Score how similar `candidate` is to the user's watch history.
 * @param {Object}   candidate  — TMDB movie object
 * @param {Object[]} history    — array of watched TMDB movie objects
 * @returns {number}
 */
function scoreMovie(candidate, history) {
  return history.reduce((total, watched) => {
    const sharedGenres = candidate.genre_ids.filter(
      (g) => watched.genre_ids?.includes(g)
    ).length

    const popularityBonus = (candidate.popularity || 0) / 1000
    const ratingBonus     = (candidate.vote_average || 0) / 10

    return total + sharedGenres * 3 + popularityBonus + ratingBonus
  }, 0)
}

/**
 * Get the most-watched genre IDs from watch history.
 * @param {Object[]} history
 * @returns {number[]} sorted by frequency
 */
function topGenreIds(history) {
  const freq = {}
  history.forEach((m) =>
    m.genre_ids?.forEach((g) => {
      freq[g] = (freq[g] || 0) + 1
    })
  )
  return Object.entries(freq)
    .sort(([, a], [, b]) => b - a)
    .map(([id]) => Number(id))
}

/**
 * Main recommendation function.
 * @param {Object[]} history     — movies the user has watched / liked
 * @param {Object[]} allMovies   — pool of candidate movies
 * @param {Object[]} trending    — fallback for cold-start
 * @param {number}   limit       — max results to return
 * @returns {Object[]}
 */
export function getRecommendations(history, allMovies, trending, limit = 12) {
  // ── Tier 1: Cold start — no history ───────────────────────
  if (!history || history.length === 0) {
    return (trending || allMovies).slice(0, limit)
  }

  // Exclude already-watched movies
  const watchedIds = new Set(history.map((m) => m.id))
  const pool = allMovies.filter((m) => !watchedIds.has(m.id))

  // ── Tier 2: Warming up — 1-2 watched ──────────────────────
  if (history.length < 3) {
    const [topGenre] = topGenreIds(history)
    return pool
      .filter((m) => m.genre_ids?.includes(topGenre))
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, limit)
  }

  // ── Tier 3: Full content-based filter ─────────────────────
  return pool
    .map((m) => ({ ...m, _score: scoreMovie(m, history) }))
    .sort((a, b) => b._score - a._score)
    .slice(0, limit)
}

/** Utility: get movies similar to ONE movie (for detail page) */
export function getSimilarMovies(movie, allMovies, limit = 8) {
  if (!movie) return []
  const pool = allMovies.filter((m) => m.id !== movie.id)
  return pool
    .map((m) => ({ ...m, _score: scoreMovie(m, [movie]) }))
    .sort((a, b) => b._score - a._score)
    .slice(0, limit)
}
