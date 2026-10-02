import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

// Fix: __dirname is not available in ESM — reconstruct it
const __filename = fileURLToPath(import.meta.url)
const __dirname  = path.dirname(__filename)

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  // Proxy /api/* to Vercel dev runtime when running `npm run dev`
  // This lets you use plain `npm run dev` without needing `vercel dev`
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        // If vercel dev isn't running, API calls just fail gracefully
        // The app still renders with skeleton loaders
      },
    },
  },

  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          motion: ['framer-motion'],
          query:  ['@tanstack/react-query'],
        },
      },
    },
  },
})
