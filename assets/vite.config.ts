import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // Relative base so the static build works on any host and sub-path
  base: './',
  // Test servers use their own dependency cache so they never invalidate a running `npm run dev`
  cacheDir: process.env.VITE_CACHE_DIR ?? 'node_modules/.vite',
  plugins: [react()],
})
