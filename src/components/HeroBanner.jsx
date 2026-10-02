import { useState, useEffect, useCallback } from 'react'
import { useNavigate }     from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Download, MoreHorizontal, Flame } from 'lucide-react'
import Badge                from '@/components/ui/Badge'
import { HeroBannerSkeleton } from '@/components/ui/Skeleton'
import { backdropUrl }      from '@/utils/tmdb'
import useStore             from '@/store/useStore'

const GENRE_NAMES = {
  28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy',
  80: 'Crime',  99: 'Documentary', 18: 'Drama', 10751: 'Family',
  14: 'Fantasy', 36: 'History', 27: 'Horror', 10402: 'Music',
  9648: 'Mystery', 10749: 'Romance', 878: 'Sci-Fi', 10770: 'TV Movie',
  53: 'Thriller', 10752: 'War', 37: 'Western',
}

/** Auto-rotating hero banner matching the reference UI */
export default function HeroBanner({ movies = [], isLoading = false }) {
  const navigate         = useNavigate()
  const [current, setCurrent] = useState(0)
  const addToHistory     = useStore((s) => s.addToHistory)
  const addToContinue    = useStore((s) => s.addToContinueWatching)

  const slides = movies.slice(0, 5)
  const movie  = slides[current]

  // Auto-rotate every 5s
  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % slides.length)
  }, [slides.length])

  useEffect(() => {
    if (slides.length === 0) return
    const id = setInterval(next, 5000)
    return () => clearInterval(id)
  }, [next, slides.length])

  if (isLoading) return <HeroBannerSkeleton />
  if (!movie)    return null

  const backdropSrc = backdropUrl(movie.backdrop_path, 'w1280')
  const genres = (movie.genre_ids ?? []).slice(0, 2).map((id) => GENRE_NAMES[id]).filter(Boolean)

  const handleWatch = () => {
    addToHistory(movie)
    addToContinue(movie)
    navigate(`/movie/${movie.id}`)
  }

  return (
    <div
      className="relative w-full h-64 sm:h-80 md:h-96 rounded-xl overflow-hidden
                 mx-3 sm:mx-6 mb-4 sm:mb-6 mt-3 sm:mt-4"
      style={{ width: 'calc(100% - 1.5rem)' }}
    >

      {/* Backdrop image */}
      <AnimatePresence mode="wait">
        <motion.img
          key={movie.id}
          src={backdropSrc}
          alt={movie.title}
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        />
      </AnimatePresence>

      {/* Left-to-right gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/60 to-transparent" />
      {/* Bottom gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={movie.id + '_content'}
          className="absolute inset-0 flex flex-col justify-center px-4 sm:px-8 max-w-xl"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          {/* Now Trending chip */}
          <div className="flex items-center gap-1.5 mb-3">
            <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/15 rounded-full px-3 py-1">
              <Flame size={12} className="text-orange-400" />
              <span className="text-white text-xs font-medium">Now Trending</span>
            </div>
          </div>

          {/* Genre badges */}
          {genres.length > 0 && (
            <div className="flex gap-2 mb-3">
              {genres.map((g) => (
                <Badge key={g} variant="outline">{g}</Badge>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="text-white font-bold text-lg sm:text-2xl md:text-3xl leading-tight mb-2 line-clamp-2">
            {movie.title}
          </h1>

          {/* Overview — hidden on very small screens */}
          <p className="hidden sm:block text-white/60 text-sm leading-relaxed mb-5 line-clamp-2 max-w-sm">
            {movie.overview}
          </p>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button onClick={handleWatch} className="btn-primary">
              <Play size={14} fill="currentColor" />
              Watch Now
            </button>
            <button className="btn-icon">
              <Download size={15} />
            </button>
            <button className="btn-icon">
              <MoreHorizontal size={15} />
            </button>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Dot indicators */}
      <div className="absolute bottom-4 right-6 flex gap-1.5">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === current ? 'w-6 bg-accent' : 'w-1.5 bg-white/30 hover:bg-white/60'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
