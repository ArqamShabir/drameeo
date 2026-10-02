import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, Star } from 'lucide-react'
import clsx from 'clsx'
import useStore        from '@/store/useStore'
import { posterUrl, fallbackPoster } from '@/utils/tmdb'

/**
 * MovieCard — three variants:
 *   wide=false, stretch=false → fixed poster card (horizontal scroll rows)
 *   wide=true               → fixed landscape card (Continue Watching)
 *   stretch=true            → fills grid cell (Explore / Favourites grid)
 */
export default function MovieCard({ movie, wide = false, progress = null, stretch = false }) {
  const navigate        = useNavigate()
  const [imgErr, setImgErr] = useState(false)
  const addFavourite    = useStore((s) => s.addFavourite)
  const removeFavourite = useStore((s) => s.removeFavourite)
  const isFav           = useStore((s) => s.isFavourite(movie?.id))
  const addToHistory    = useStore((s) => s.addToHistory)

  if (!movie) return null

  const imgSrc = imgErr
    ? fallbackPoster
    : wide
    ? (movie.backdrop_path
        ? `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`
        : fallbackPoster)
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
        'relative cursor-pointer rounded-xl overflow-hidden group',
        // stretch = fills grid cell, no fixed size
        stretch && 'w-full h-full',
        // fixed sizes for scroll rows
        !stretch && !wide && 'flex-shrink-0 w-36 h-52 sm:w-40 sm:h-56',
        !stretch &&  wide && 'flex-shrink-0 w-56 h-32 sm:w-64 sm:h-36',
      )}
      onClick={handleClick}
      whileHover={{ scale: 1.04, y: -4 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
    >
      {/* Image */}
      <img
        src={imgSrc}
        alt={movie.title}
        onError={() => setImgErr(true)}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

      {/* Favourite — always visible on touch devices, hover on desktop */}
      <button
        onClick={toggleFav}
        aria-label={isFav ? 'Remove from favourites' : 'Add to favourites'}
        className={clsx(
          'absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full transition-all duration-200',
          // Always show on touch (no hover), fade in on desktop hover
          isFav
            ? 'text-red-500 bg-red-500/20 opacity-100'
            : 'text-white/70 bg-black/30 md:opacity-0 md:group-hover:opacity-100 opacity-100'
        )}
      >
        <Heart size={13} fill={isFav ? 'currentColor' : 'none'} />
      </button>

      {/* Bottom info */}
      <div className="absolute bottom-0 left-0 right-0 px-2.5 pb-2.5">
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
