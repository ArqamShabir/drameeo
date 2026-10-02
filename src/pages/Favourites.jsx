import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import MovieCard from '@/components/ui/MovieCard'
import useStore  from '@/store/useStore'

export default function Favourites() {
  const favourites = useStore((s) => s.favourites)

  return (
    <div className="p-6 animate-fade-in">
      <h1 className="text-white font-bold text-xl mb-6">Favourites</h1>

      {favourites.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <Heart size={48} className="text-border-card" />
          <p className="text-text-muted text-sm">No favourites yet. Heart a movie to save it here.</p>
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.05 } },
          }}
        >
          {favourites.map((movie) => (
            <motion.div
              key={movie.id}
              variants={{
                hidden: { opacity: 0, scale: 0.92 },
                show:   { opacity: 1, scale: 1     },
              }}
            >
              <MovieCard movie={movie} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}
