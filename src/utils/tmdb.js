// ──────────────────────────────────────────────────────────────
// TMDB API utility — all calls go through our Vercel proxy
// so the secret TMDB key never reaches the browser.
// ──────────────────────────────────────────────────────────────

const API_BASE = import.meta.env.VITE_API_BASE || '/api'

/** Low-level fetch wrapper with error handling */
async function apiFetch(path, params = {}) {
  const url = new URL(`${API_BASE}${path}`, window.location.origin)
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null) url.searchParams.set(k, v)
  })
  const res = await fetch(url.toString())
  if (!res.ok) throw new Error(`API ${res.status}: ${path}`)
  return res.json()
}

// ── Endpoints ──────────────────────────────────────────────────

/** Trending animated movies this week */
export const getTrending = (page = 1) =>
  apiFetch('/trending', { page })

/** Popular / top-rated / now-playing by category */
export const getMoviesByCategory = (category = 'popular', page = 1) =>
  apiFetch('/movies', { category, page })

/** Movies by genre (TMDB genre ID) */
export const getMoviesByGenre = (genreId, page = 1) =>
  apiFetch('/movies', { genre: genreId, page })

/** Full-text search */
export const searchMovies = (query, page = 1) =>
  apiFetch('/search', { q: query, page })

/** YouTube trailer key for a movie */
export const getTrailerKey = (movieId) =>
  apiFetch('/trailer', { id: movieId })

/** Flat list of animation genres */
export const getGenres = () =>
  apiFetch('/genres')

/** Single movie detail */
export const getMovieDetail = (movieId) =>
  apiFetch('/movie', { id: movieId })

// ── Image helpers ──────────────────────────────────────────────
const IMG_BASE = 'https://image.tmdb.org/t/p'

export const posterUrl    = (path, size = 'w500')     => path ? `${IMG_BASE}/${size}${path}` : null
export const backdropUrl  = (path, size = 'w1280')    => path ? `${IMG_BASE}/${size}${path}` : null
export const profileUrl   = (path, size = 'w185')     => path ? `${IMG_BASE}/${size}${path}` : null

/** Placeholder when no image is available */
export const fallbackPoster   = '/placeholder-poster.svg'
export const fallbackBackdrop = '/placeholder-backdrop.svg'
