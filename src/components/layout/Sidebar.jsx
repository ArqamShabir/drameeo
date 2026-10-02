import { NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Home, Compass, Layers, Heart,
  Play, Clock, FolderOpen, Download,
  Settings, LogOut, Film, Menu, X,
} from 'lucide-react'
import clsx     from 'clsx'
import useStore from '@/store/useStore'

const NAV_TOP = [
  { to: '/',           icon: Home,      label: 'Home'         },
  { to: '/explore',    icon: Compass,   label: 'Explore'      },
  { to: '/genres',     icon: Layers,    label: 'Genres'       },
  { to: '/favourites', icon: Heart,     label: 'Favourites'   },
]

const NAV_LIBRARY = [
  { to: '/continue',   icon: Play,      label: 'Continue Watching' },
  { to: '/recent',     icon: Clock,     label: 'Recently Added'    },
  { to: '/collections',icon: FolderOpen,label: 'My Collections'    },
  { to: '/downloads',  icon: Download,  label: 'Downloads'         },
]

function NavItem({ to, icon: Icon, label, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        clsx(
          'nav-item',
          isActive && 'active'
        )
      }
    >
      <Icon size={16} />
      <span>{label}</span>
    </NavLink>
  )
}

export default function Sidebar() {
  const sidebarOpen   = useStore((s) => s.sidebarOpen)
  const toggleSidebar = useStore((s) => s.toggleSidebar)
  const navigate      = useNavigate()

  const sidebarContent = (
    <div className="flex flex-col h-full py-5 px-3">
      {/* Logo */}
      <div className="flex items-center justify-between px-2 mb-8">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center shadow-glow-sm">
            <Film size={16} className="text-white" />
          </div>
          <span className="text-white font-bold text-lg tracking-tight">Drameeo</span>
        </div>
        {/* Toggle button — visible on mobile only */}
        <button
          onClick={toggleSidebar}
          className="lg:hidden text-text-secondary hover:text-white transition-colors"
        >
          {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Primary Nav */}
      <nav className="flex flex-col gap-1">
        {NAV_TOP.map((item) => (
          <NavItem key={item.to} {...item} />
        ))}
      </nav>

      {/* Divider */}
      <div className="my-5 border-t border-border-subtle" />

      {/* Library Nav */}
      <nav className="flex flex-col gap-1">
        {NAV_LIBRARY.map((item) => (
          <NavItem key={item.to} {...item} />
        ))}
      </nav>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Divider */}
      <div className="mb-4 border-t border-border-subtle" />

      {/* Settings */}
      <NavItem to="/settings" icon={Settings} label="Settings" />

      {/* Logout */}
      <button className="nav-item w-full text-left mt-1">
        <LogOut size={16} />
        <span>Logout</span>
      </button>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-[220px] min-h-screen bg-bg-secondary border-r border-border-subtle flex-shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile overlay sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="lg:hidden fixed inset-0 bg-black/60 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleSidebar}
            />
            {/* Drawer */}
            <motion.aside
              className="lg:hidden fixed left-0 top-0 bottom-0 w-[220px] bg-bg-secondary border-r border-border-subtle z-50"
              initial={{ x: -240 }}
              animate={{ x: 0 }}
              exit={{ x: -240 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
