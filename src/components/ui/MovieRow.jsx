import { useRef } from 'react'
import { ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import MovieCard    from './MovieCard'
import { RowSkeleton } from './Skeleton'
import useStore from '@/store/useStore'

export default function MovieRow({
  title,
  movies = [],
  isLoading = false,
  wide = false,
  showProgress = false,
  onSeeAll,
}) {
  const rowRef           = useRef(null)
  const continueWatching = useStore((s) => s.continueWatching)

  return (
    <section className="mb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 px-4 sm:px-6">
        <h2 className="text-white font-semibold text-sm sm:text-base tracking-tight">
          {title}
        </h2>
        {onSeeAll && (
          <button
            onClick={onSeeAll}
            className="flex items-center gap-1 text-xs text-text-secondary hover:text-accent-lighter transition-colors"
          >
            See All <ChevronRight size={14} />
          </button>
        )}
      </div>

      {/* Cards row — touch-scroll friendly */}
      <div
        ref={rowRef}
        className="flex gap-3 sm:gap-4 overflow-x-auto pb-2 px-4 sm:px-6 scroll-smooth"
        style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
      >
        {isLoading ? (
          <RowSkeleton count={wide ? 4 : 5} wide={wide} />
        ) : movies.length === 0 ? (
          <p className="text-text-muted text-sm px-1 py-4">Nothing here yet.</p>
        ) : (
          movies.map((movie, i) => {
            const cwEntry = continueWatching.find((m) => m.id === movie.id)
            return (
              <motion.div
                key={movie.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.3 }}
                className="flex-shrink-0"
              >
                <MovieCard
                  movie={movie}
                  wide={wide}
                  progress={showProgress ? (cwEntry?.progress ?? 20) : null}
                />
              </motion.div>
            )
          })
        )}
      </div>
    </section>
  )
}
