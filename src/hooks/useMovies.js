import { useQuery } from '@tanstack/react-query'
import {
  getTrending,
  getMoviesByCategory,
  getMoviesByGenre,
  searchMovies,
  getGenres,
  getMovieDetail,
} from '@/utils/tmdb'
import { getCached, setCached } from '@/utils/cache'

// ── Helper: wrap react-query with localStorage fallback ────────
function withLocalFallback(queryKey, fetchFn, ttlMs = 24 * 60 * 60 * 1000) {
  const cacheKey = queryKey.join('_')
  return {
    queryKey,
    queryFn: async () => {
      try {
        const data = await fetchFn()
        setCached(cacheKey, data, ttlMs)
        return data
      } catch (err) {
        const cached = getCached(cacheKey)
        if (cached) return cached          // stale-but-valid fallback
        throw err
      }
    },
  }
}

// ── Hooks ──────────────────────────────────────────────────────

export function useTrending(page = 1) {
  return useQuery({
    ...withLocalFallback(['trending', page], () => getTrending(page)),
    staleTime: 5 * 60 * 1000,
  })
}

export function useMoviesByCategory(category = 'popular', page = 1) {
  return useQuery({
    ...withLocalFallback(
      ['movies', category, page],
      () => getMoviesByCategory(category, page)
    ),
    staleTime: 10 * 60 * 1000,
  })
}

export function useMoviesByGenre(genreId, page = 1) {
  return useQuery({
    ...withLocalFallback(
      ['genre', genreId, page],
      () => getMoviesByGenre(genreId, page)
    ),
    enabled: !!genreId,
    staleTime: 10 * 60 * 1000,
  })
}

export function useSearch(query, page = 1) {
  return useQuery({
    queryKey: ['search', query, page],
    queryFn:  () => searchMovies(query, page),
    enabled:  query.trim().length > 2,
    staleTime: 2 * 60 * 1000,
  })
}

export function useGenres() {
  return useQuery({
    ...withLocalFallback(['genres'], getGenres, 7 * 24 * 60 * 60 * 1000), // 7 days
    staleTime: 7 * 24 * 60 * 60 * 1000,
  })
}

export function useMovieDetail(id) {
  return useQuery({
    ...withLocalFallback(['movie', id], () => getMovieDetail(id)),
    enabled: !!id,
    staleTime: 30 * 60 * 1000,
  })
}
