import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Bell, Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import useStore      from '@/store/useStore'
import { useSearch } from '@/hooks/useMovies'
import { posterUrl } from '@/utils/tmdb'

export default function Topbar() {
  const navigate       = useNavigate()
  const toggleSidebar  = useStore((s) => s.toggleSidebar)
  const searchQuery    = useStore((s) => s.searchQuery)
  const setSearchQuery = useStore((s) => s.setSearchQuery)
  const [focused, setFocused] = useState(false)
  const inputRef       = useRef(null)

  const { data: searchResults } = useSearch(searchQuery)
  const results = searchResults?.results?.slice(0, 6) ?? []

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (!inputRef.current?.closest('.search-container')?.contains(e.target)) {
        setFocused(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSelect = (movie) => {
    setSearchQuery('')
    setFocused(false)
    navigate(`/movie/${movie.id}`)
  }

  return (
    <header className="flex items-center gap-4 px-6 py-4 bg-bg-primary/80 backdrop-blur-sm border-b border-border-subtle flex-shrink-0 z-30">
      {/* Mobile menu toggle */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden text-text-secondary hover:text-white transition-colors"
      >
        <Menu size={20} />
      </button>

      {/* Search bar */}
      <div className="search-container relative flex-1 max-w-lg">
        <div className="relative">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
          />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            placeholder="Search for films, directors, or actors..."
            className="w-full bg-bg-card border border-border-subtle rounded-xl
                       pl-9 pr-10 py-2.5 text-sm text-white placeholder-text-muted
                       focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30
                       transition-all duration-200"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-white"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Search dropdown */}
        <AnimatePresence>
          {focused && results.length > 0 && (
            <motion.div
              className="absolute top-full mt-2 left-0 right-0 bg-bg-card border border-border-card rounded-xl shadow-card overflow-hidden z-50"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
            >
              {results.map((movie) => (
                <button
                  key={movie.id}
                  onClick={() => handleSelect(movie)}
                  className="flex items-center gap-3 w-full px-3 py-2.5 hover:bg-white/5 transition-colors text-left"
                >
                  <img
                    src={posterUrl(movie.poster_path, 'w92')}
                    alt={movie.title}
                    className="w-8 h-11 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-white text-sm font-medium truncate">{movie.title}</p>
                    <p className="text-text-muted text-xs">{movie.release_date?.slice(0, 4)}</p>
                  </div>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-3 ml-auto">
        {/* Notification bell */}
        <button className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-bg-card border border-border-subtle text-text-secondary hover:text-white hover:border-accent/30 transition-all">
          <Bell size={16} />
          {/* Red dot */}
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-bg-primary" />
        </button>

        {/* User avatar */}
        <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-accent/40 cursor-pointer hover:border-accent transition-colors flex-shrink-0">
          <img
            src="https://api.dicebear.com/8.x/avataaars/svg?seed=drameeo&backgroundColor=b6e3f4"
            alt="User avatar"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </header>
  )
}
