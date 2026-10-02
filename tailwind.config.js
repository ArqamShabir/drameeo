/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Core backgrounds
        'bg-primary':   '#0d0d1e',
        'bg-secondary': '#12121e',
        'bg-card':      '#1a1a2e',
        'bg-card-hover':'#1f1f38',
        'bg-overlay':   'rgba(13,13,30,0.85)',

        // Accent / Brand purple
        accent: {
          DEFAULT: '#7c3aed',
          light:   '#8b5cf6',
          lighter: '#a78bfa',
          dim:     'rgba(124,58,237,0.15)',
        },

        // Text
        'text-primary':   '#ffffff',
        'text-secondary': '#9ca3af',
        'text-muted':     '#6b7280',

        // Borders
        'border-subtle': 'rgba(255,255,255,0.06)',
        'border-card':   'rgba(255,255,255,0.10)',
      },

      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },

      backgroundImage: {
        'gradient-sidebar':
          'linear-gradient(180deg, #12121e 0%, #0d0d1e 100%)',
        'gradient-card':
          'linear-gradient(to top, rgba(13,13,30,0.95) 0%, rgba(13,13,30,0.4) 60%, transparent 100%)',
        'gradient-hero':
          'linear-gradient(90deg, rgba(13,13,30,0.95) 40%, transparent 100%)',
        'gradient-outer':
          'linear-gradient(135deg, #4c1d95 0%, #7c3aed 50%, #4c1d95 100%)',
      },

      boxShadow: {
        card:   '0 4px 24px rgba(0,0,0,0.4)',
        glow:   '0 0 24px rgba(124,58,237,0.35)',
        'glow-sm': '0 0 12px rgba(124,58,237,0.25)',
      },

      borderRadius: {
        xl2: '1.25rem',
        xl3: '1.5rem',
      },

      animation: {
        shimmer: 'shimmer 1.5s infinite',
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },

      keyframes: {
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition:  '200% 0' },
        },
        fadeIn: {
          '0%':   { opacity: 0 },
          '100%': { opacity: 1 },
        },
        slideUp: {
          '0%':   { opacity: 0, transform: 'translateY(16px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
