import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Sidebar      from '@/components/layout/Sidebar'
import Topbar       from '@/components/layout/Topbar'
import Home         from '@/pages/Home'
import Explore      from '@/pages/Explore'
import Genres       from '@/pages/Genres'
import Favourites   from '@/pages/Favourites'
import MovieDetail  from '@/pages/MovieDetail'

export default function App() {
  return (
    <BrowserRouter>
      {/* Outer wrapper — matches the purple gradient background in UI */}
      <div className="flex h-screen w-screen overflow-hidden bg-bg-primary">
        {/* Fixed Sidebar */}
        <Sidebar />

        {/* Main area — scrollable */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Topbar />
          <main className="flex-1 overflow-y-auto overflow-x-hidden bg-bg-primary">
            <Routes>
              <Route path="/"           element={<Home />} />
              <Route path="/explore"    element={<Explore />} />
              <Route path="/genres"     element={<Genres />} />
              <Route path="/favourites" element={<Favourites />} />
              <Route path="/movie/:id"  element={<MovieDetail />} />
              <Route path="*"           element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  )
}
