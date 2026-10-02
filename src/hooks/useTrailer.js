import { useQuery } from '@tanstack/react-query'
import { getTrailerKey } from '@/utils/tmdb'

/**
 * Fetches a YouTube trailer key for a given TMDB movie ID.
 * Returns: { trailerKey, isLoading, error }
 */
export function useTrailer(movieId) {
  const query = useQuery({
    queryKey: ['trailer', movieId],
    queryFn:  () => getTrailerKey(movieId),
    enabled:  !!movieId,
    staleTime: 60 * 60 * 1000, // trailers don't change — 1h
    gcTime:    24 * 60 * 60 * 1000,
  })

  return {
    trailerKey: query.data?.key ?? null,
    isLoading:  query.isLoading,
    error:      query.error,
  }
}
