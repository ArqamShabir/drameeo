import { useState }      from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion }         from 'framer-motion'
import { Play, Heart, ArrowLeft, Star, Calendar, Clock } from 'lucide-react'
import TrailerModal       from '@/components/TrailerModal'
import MovieRow           from '@/components/ui/MovieRow'
import Skeleton           from '@/components/ui/Skeleton'
import Badge              from '@/components/ui/Badge'
import { useMovieDetail, useMoviesByCategory } from '@/hooks/useMovies'
import { getSimilarMovies }  from '@/utils/recommend'
import { backdropUrl, posterUrl } from '@/utils/tmdb'
import useStore           from '@/store/useStore'

export default function MovieDetail() {
  const { id }        = useParams()
  const navigate      = useNavigate()
  const [showTrailer, setShowTrailer] = useState(false)

  const { data: movie, isLoading } = useMovieDetail(id)
  const { data: popularData }     = useMoviesByCategory('popular')
  const pool    = popularData?.results ?? []
  const similar = movie ? getSimilarMovies(movie, pool) : []

  const isFav         = useStore((s) => s.isFavourite(Number(id)))
  const addFavourite  = useStore((s) => s.addFavourite)
  const removeFavourite = useStore((s) => s.removeFavourite)
  const addToContinue = useStore((s) => s.addToContinueWatching)
  const addToHistory  = useStore((s) => s.addToHistory)

  const handleWatch = () => {
    if (movie) {
      addToHistory(movie)
      addToContinue(movie)
      setShowTrailer(true)
    }
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <Skeleton className="w-full h-72 rounded-xl2 mb-6" />
        <Skeleton className="w-1/2 h-8 rounded-lg mb-3" />
        <Skeleton className="w-full h-20 rounded-lg" />
      </div>
    )
  }

  if (!movie) return null

  return (
    <>
      <div className="animate-fade-in pb-10">
        {/* Backdrop hero */}
        <div className="relative w-full h-72 md:h-96">
          <img
            src={backdropUrl(movie.backdrop_path, 'w1280')}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-bg-primary/80 to-transparent" />

          {/* Back button */}
          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 btn-icon"
          >
            <ArrowLeft size={16} />
          </button>
        </div>

        {/* Detail content */}
        <div className="px-6 -mt-28 relative z-10">
          <div className="flex gap-6 flex-col md:flex-row">
            {/* Poster */}
            <motion.img
              src={posterUrl(movie.poster_path, 'w342')}
              alt={movie.title}
              className="w-36 md:w-48 rounded-xl2 shadow-card flex-shrink-0 self-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            />

            {/* Info */}
            <motion.div
              className="flex-1 pt-4 md:pt-16"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-white font-bold text-2xl md:text-3xl mb-2">
                {movie.title}
              </h1>

              {/* Meta row */}
              <div className="flex items-center gap-4 mb-3 text-text-secondary text-sm flex-wrap">
                <span className="flex items-center gap-1">
                  <Star size={13} className="text-yellow-400 fill-yellow-400" />
                  {movie.vote_average?.toFixed(1)} / 10
                </span>
                <span className="flex items-center gap-1">
                  <Calendar size={13} />
                  {movie.release_date?.slice(0, 4)}
                </span>
                {movie.runtime && (
                  <span className="flex items-center gap-1">
                    <Clock size={13} />
                    {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
                  </span>
                )}
              </div>

              {/* Genres */}
              <div className="flex gap-2 flex-wrap mb-4">
                {movie.genres?.map((g) => (
                  <Badge key={g.id}>{g.name}</Badge>
                ))}
              </div>

              {/* Overview */}
              <p className="text-text-secondary text-sm leading-relaxed mb-6 max-w-2xl">
                {movie.overview}
              </p>

              {/* Actions */}
              <div className="flex gap-3">
                <button onClick={handleWatch} className="btn-primary">
                  <Play size={14} fill="currentColor" />
                  Watch Trailer
                </button>
                <button
                  onClick={() =>
                    isFav ? removeFavourite(movie.id) : addFavourite(movie)
                  }
                  className={`btn-icon w-auto px-4 gap-2 ${isFav ? 'text-red-400 bg-red-500/15 hover:bg-red-500/25' : ''}`}
                >
                  <Heart size={15} fill={isFav ? 'currentColor' : 'none'} />
                  {isFav ? 'Saved' : 'Save'}
                </button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Similar movies */}
        <div className="mt-10">
          <MovieRow title="You May Also Like" movies={similar} />
        </div>
      </div>

      {/* Trailer modal */}
      {showTrailer && (
        <TrailerModal
          movieId={movie.id}
          title={movie.title}
          onClose={() => setShowTrailer(false)}
        />
      )}
    </>
  )
}
