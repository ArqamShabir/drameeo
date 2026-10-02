import { create } from 'zustand'
import { persist }  from 'zustand/middleware'

/**
 * Global Zustand store — persisted to localStorage.
 *
 * Slices:
 *   favourites     — user's saved movies
 *   watchHistory   — movies user has opened / started watching
 *   continueWatching — movies with partial progress
 *   genrePrefs     — genre IDs from onboarding (cold-start)
 *   sidebarOpen    — mobile sidebar toggle
 *   searchQuery    — topbar search input state
 */
const useStore = create(
  persist(
    (set, get) => ({
      // ── Favourites ───────────────────────────────────────
      favourites: [],

      addFavourite: (movie) =>
        set((s) => ({
          favourites: s.favourites.find((m) => m.id === movie.id)
            ? s.favourites
            : [movie, ...s.favourites],
        })),

      removeFavourite: (id) =>
        set((s) => ({
          favourites: s.favourites.filter((m) => m.id !== id),
        })),

      isFavourite: (id) => get().favourites.some((m) => m.id === id),

      // ── Watch History ────────────────────────────────────
      watchHistory: [],

      addToHistory: (movie) =>
        set((s) => ({
          watchHistory: [
            movie,
            ...s.watchHistory.filter((m) => m.id !== movie.id),
          ].slice(0, 50), // keep last 50
        })),

      // ── Continue Watching (progress tracking) ────────────
      continueWatching: [],

      updateProgress: (movieId, progressPct) =>
        set((s) => ({
          continueWatching: s.continueWatching.find((m) => m.id === movieId)
            ? s.continueWatching.map((m) =>
                m.id === movieId ? { ...m, progress: progressPct } : m
              )
            : s.continueWatching,
        })),

      addToContinueWatching: (movie) =>
        set((s) => ({
          continueWatching: [
            { ...movie, progress: 0 },
            ...s.continueWatching.filter((m) => m.id !== movie.id),
          ].slice(0, 20),
        })),

      removeFromContinue: (id) =>
        set((s) => ({
          continueWatching: s.continueWatching.filter((m) => m.id !== id),
        })),

      // ── Genre Preferences (onboarding / cold-start) ──────
      genrePrefs: [],

      setGenrePrefs: (genreIds) => set({ genrePrefs: genreIds }),

      // ── UI State ─────────────────────────────────────────
      sidebarOpen: true,

      toggleSidebar: () =>
        set((s) => ({ sidebarOpen: !s.sidebarOpen })),

      searchQuery: '',

      setSearchQuery: (q) => set({ searchQuery: q }),
    }),
    {
      name: 'drameeo-store',          // localStorage key
      partialize: (s) => ({           // only persist these slices
        favourites:      s.favourites,
        watchHistory:    s.watchHistory,
        continueWatching: s.continueWatching,
        genrePrefs:      s.genrePrefs,
      }),
    }
  )
)

export default useStore
