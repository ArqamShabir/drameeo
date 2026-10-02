import { useState } from 'react'
import HeroBanner  from '@/components/HeroBanner'
import MovieRow    from '@/components/ui/MovieRow'
import { useTrending, useMoviesByCategory } from '@/hooks/useMovies'
import { useRecommendations }               from '@/hooks/useRecommendations'
import useStore from '@/store/useStore'

export default function Home() {
  const continueWatching = useStore((s) => s.continueWatching)

  const { data: trendingData,   isLoading: loadingTrending  } = useTrending()
  const { data: popularData,    isLoading: loadingPopular   } = useMoviesByCategory('popular')
  const { data: topRatedData,   isLoading: loadingTopRated  } = useMoviesByCategory('top_rated')
  const { data: nowPlayingData, isLoading: loadingNowPlaying} = useMoviesByCategory('now_playing')

  const trending   = trendingData?.results  ?? []
  const popular    = popularData?.results   ?? []
  const topRated   = topRatedData?.results  ?? []
  const nowPlaying = nowPlayingData?.results ?? []
  const allMovies  = [...popular, ...topRated, ...nowPlaying]

  const recommended = useRecommendations(allMovies, trending)

  return (
    <div className="animate-fade-in pb-8">
      {/* Hero Banner */}
      <HeroBanner movies={trending} isLoading={loadingTrending} />

      {/* Continue Watching */}
      {continueWatching.length > 0 && (
        <MovieRow
          title="Continue Watching"
          movies={continueWatching}
          wide
          showProgress
          onSeeAll={() => {}}
        />
      )}

      {/* You Might Like (recommendations) */}
      <MovieRow
        title="You Might Like"
        movies={recommended}
        isLoading={loadingPopular}
        onSeeAll={() => {}}
      />

      {/* Now Playing */}
      <MovieRow
        title="Now Playing"
        movies={nowPlaying}
        isLoading={loadingNowPlaying}
        onSeeAll={() => {}}
      />

      {/* Top Rated */}
      <MovieRow
        title="Top Rated Animation"
        movies={topRated}
        isLoading={loadingTopRated}
        onSeeAll={() => {}}
      />

      {/* Popular */}
      <MovieRow
        title="Popular This Week"
        movies={popular}
        isLoading={loadingPopular}
        onSeeAll={() => {}}
      />
    </div>
  )
}
