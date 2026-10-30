import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // Relative base so the static build works on any host and sub-path (TD-5)
  base: './',
  plugins: [react()],
})
