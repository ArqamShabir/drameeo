import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, Star } from 'lucide-react'
import clsx from 'clsx'
import useStore        from '@/store/useStore'
import { posterUrl, fallbackPoster } from '@/utils/tmdb'

/**
 * MovieCard — two variants:
 *   wide=false  → poster card (2:3) used in "You Might Like"
 *   wide=true   → landscape card (16:9) used in "Continue Watching"
 */
export default function MovieCard({ movie, wide = false, progress = null }) {
  const navigate      = useNavigate()
  const [imgErr, setImgErr] = useState(false)
  const addFavourite  = useStore((s) => s.addFavourite)
  const removeFavourite = useStore((s) => s.removeFavourite)
  const isFav         = useStore((s) => s.isFavourite(movie?.id))
  const addToHistory  = useStore((s) => s.addToHistory)

  if (!movie) return null

  const imgSrc = imgErr
    ? fallbackPoster
    : wide
    ? (movie.backdrop_path ? `https://image.tmdb.org/t/p/w500${movie.backdrop_path}` : fallbackPoster)
    : posterUrl(movie.poster_path, 'w342')

  const handleClick = () => {
    addToHistory(movie)
    navigate(`/movie/${movie.id}`)
  }

  const toggleFav = (e) => {
    e.stopPropagation()
    isFav ? removeFavourite(movie.id) : addFavourite(movie)
  }

  return (
    <motion.div
      className={clsx(
        'relative flex-shrink-0 cursor-pointer rounded-xl overflow-hidden group',
        wide ? 'w-64 h-36' : 'w-40 h-56',
      )}
      onClick={handleClick}
      whileHover={{ scale: 1.04, y: -4 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
    >
      {/* Poster / Backdrop image */}
      <img
        src={imgSrc}
        alt={movie.title}
        onError={() => setImgErr(true)}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

      {/* Favourite button */}
      <button
        onClick={toggleFav}
        className={clsx(
          'absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full transition-all duration-200',
          'opacity-0 group-hover:opacity-100',
          isFav ? 'text-red-500 bg-red-500/20' : 'text-white/70 bg-black/30 hover:text-red-400'
        )}
      >
        <Heart size={13} fill={isFav ? 'currentColor' : 'none'} />
      </button>

      {/* Bottom info */}
      <div className="absolute bottom-0 left-0 right-0 px-2.5 pb-2.5">
        {/* Rating badge */}
        {movie.vote_average > 0 && (
          <div className="flex items-center gap-1 mb-1">
            <Star size={10} className="text-yellow-400 fill-yellow-400" />
            <span className="text-[10px] text-yellow-400 font-semibold">
              {movie.vote_average?.toFixed(1)}
            </span>
          </div>
        )}

        <p className="text-white text-xs font-semibold leading-tight line-clamp-2">
          {movie.title}
        </p>

        {wide && (
          <p className="text-text-muted text-[10px] mt-0.5">
            {movie.release_date?.slice(0, 4)}
          </p>
        )}

        {/* Progress bar for Continue Watching */}
        {progress !== null && (
          <div className="mt-2 h-0.5 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-accent rounded-full transition-all duration-300"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        )}
      </div>
    </motion.div>
  )
}
