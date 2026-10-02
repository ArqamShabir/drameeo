import { useState } from 'react'
import MovieRow    from '@/components/ui/MovieRow'
import { useGenres, useMoviesByGenre } from '@/hooks/useMovies'
import Skeleton from '@/components/ui/Skeleton'

export default function Genres() {
  const { data: genreData, isLoading: loadingGenres } = useGenres()
  const genres = genreData?.genres ?? []

  const [activeGenre, setActiveGenre] = useState(null)
  const { data: moviesData, isLoading: loadingMovies } = useMoviesByGenre(activeGenre?.id)
  const movies = moviesData?.results ?? []

  return (
    <div className="p-6 animate-fade-in">
      <h1 className="text-white font-bold text-xl mb-6">Genres</h1>

      {/* Genre chips */}
      {loadingGenres ? (
        <div className="flex gap-2 flex-wrap mb-8">
          {Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={i} className="w-20 h-8 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="flex gap-2 flex-wrap mb-8">
          {genres.map((genre) => (
            <button
              key={genre.id}
              onClick={() => setActiveGenre(genre)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeGenre?.id === genre.id
                  ? 'bg-accent text-white shadow-glow-sm'
                  : 'bg-bg-card text-text-secondary hover:text-white border border-border-subtle'
              }`}
            >
              {genre.name}
            </button>
          ))}
        </div>
      )}

      {/* Movies for selected genre */}
      {activeGenre ? (
        <MovieRow
          title={activeGenre.name}
          movies={movies}
          isLoading={loadingMovies}
        />
      ) : (
        <div className="flex items-center justify-center h-48">
          <p className="text-text-muted text-sm">Select a genre to browse movies.</p>
        </div>
      )}
    </div>
  )
}
