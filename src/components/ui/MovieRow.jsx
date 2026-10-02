import { useRef } from 'react'
import { ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import MovieCard    from './MovieCard'
import { RowSkeleton } from './Skeleton'
import useStore from '@/store/useStore'

/**
 * Horizontally scrollable row of movie cards.
 * Props:
 *   title      — section heading
 *   movies     — array of TMDB movie objects
 *   isLoading  — show skeleton while fetching
 *   wide       — use landscape (16:9) cards
 *   showProgress — show progress bar (continue watching)
 *   onSeeAll   — optional callback for "See All" button
 */
export default function MovieRow({
  title,
  movies = [],
  isLoading = false,
  wide = false,
  showProgress = false,
  onSeeAll,
}) {
  const rowRef            = useRef(null)
  const continueWatching  = useStore((s) => s.continueWatching)

  return (
    <section className="mb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 px-6">
        <h2 className="text-white font-semibold text-base tracking-tight">
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

      {/* Cards row */}
      <div
        ref={rowRef}
        className="scroll-row px-6"
        style={{ scrollbarWidth: 'none' }}
      >
        {isLoading ? (
          <RowSkeleton count={wide ? 4 : 5} wide={wide} />
        ) : movies.length === 0 ? (
          <p className="text-text-muted text-sm px-1">Nothing here yet.</p>
        ) : (
          movies.map((movie, i) => {
            const cwEntry = continueWatching.find((m) => m.id === movie.id)
            return (
              <motion.div
                key={movie.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.3 }}
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
