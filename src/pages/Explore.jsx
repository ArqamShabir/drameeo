import { useState } from 'react'
import { motion }  from 'framer-motion'
import { Filter }  from 'lucide-react'
import MovieCard   from '@/components/ui/MovieCard'
import { RowSkeleton } from '@/components/ui/Skeleton'
import { useMoviesByCategory, useMoviesByGenre } from '@/hooks/useMovies'

const CATEGORIES = [
  { label: 'Popular',     value: 'popular'    },
  { label: 'Top Rated',   value: 'top_rated'  },
  { label: 'Now Playing', value: 'now_playing'},
  { label: 'Upcoming',    value: 'upcoming'   },
]

export default function Explore() {
  const [activeCategory, setActiveCategory] = useState('popular')
  const { data, isLoading } = useMoviesByCategory(activeCategory)
  const movies = data?.results ?? []

  return (
    <div className="p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-white font-bold text-xl">Explore</h1>
        <Filter size={18} className="text-text-muted" />
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 mb-7 flex-wrap">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setActiveCategory(cat.value)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              activeCategory === cat.value
                ? 'bg-accent text-white shadow-glow-sm'
                : 'bg-bg-card text-text-secondary hover:text-white hover:bg-bg-card-hover border border-border-subtle'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="flex gap-4 flex-wrap">
          <RowSkeleton count={8} />
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4"
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show:  { transition: { staggerChildren: 0.04 } },
          }}
        >
          {movies.map((movie) => (
            <motion.div
              key={movie.id}
              className="aspect-[2/3]"
              variants={{
                hidden: { opacity: 0, y: 12 },
                show:   { opacity: 1, y: 0  },
              }}
            >
              <MovieCard movie={movie} stretch />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}
