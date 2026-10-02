import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Loader2 } from 'lucide-react'
import { useTrailer } from '@/hooks/useTrailer'

/**
 * Full-screen dark overlay modal with YouTube iframe embed.
 * @param {number|null} movieId — pass null to close
 * @param {string}      title
 * @param {function}    onClose
 */
export default function TrailerModal({ movieId, title, onClose }) {
  const { trailerKey, isLoading } = useTrailer(movieId)

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/85 backdrop-blur-md"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />

        {/* Modal card */}
        <motion.div
          className="relative w-full max-w-4xl bg-bg-card rounded-xl2 overflow-hidden shadow-card border border-border-card"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1,   opacity: 1, y: 0  }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 280, damping: 25 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-border-subtle">
            <h3 className="text-white font-semibold text-sm truncate max-w-xs">
              {title} — Official Trailer
            </h3>
            <button
              onClick={onClose}
              className="btn-icon flex-shrink-0"
            >
              <X size={16} />
            </button>
          </div>

          {/* Video area */}
          <div className="relative aspect-video bg-black">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 size={32} className="text-accent animate-spin" />
              </div>
            )}

            {!isLoading && trailerKey ? (
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0&modestbranding=1`}
                title={`${title} Trailer`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : !isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-text-muted text-sm">No trailer available.</p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
