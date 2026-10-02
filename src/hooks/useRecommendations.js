import { useMemo } from 'react'
import useStore              from '@/store/useStore'
import { getRecommendations } from '@/utils/recommend'

/**
 * Returns recommended movies based on watch history.
 *
 * @param {Object[]} allMovies   — full pool from TMDB
 * @param {Object[]} trending    — trending fallback for cold start
 * @param {number}   limit
 */
export function useRecommendations(allMovies = [], trending = [], limit = 12) {
  const watchHistory = useStore((s) => s.watchHistory)
  const genrePrefs   = useStore((s) => s.genrePrefs)

  return useMemo(() => {
    // Augment history with genre prefs from onboarding (cold-start bridge)
    const syntheticHistory =
      genrePrefs.length > 0 && watchHistory.length === 0
        ? [{ genre_ids: genrePrefs, popularity: 0, vote_average: 0 }]
        : watchHistory

    return getRecommendations(syntheticHistory, allMovies, trending, limit)
  }, [watchHistory, genrePrefs, allMovies, trending, limit])
}
