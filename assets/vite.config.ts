import react from '@vitejs/plugin-react'
import { execSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { defineConfig } from 'vite'

const version = (pkg: string): string =>
  (JSON.parse(readFileSync(`node_modules/${pkg}/package.json`, 'utf8')) as { version: string })
    .version

function commit(): string {
  try {
    return execSync('git rev-parse --short HEAD', { stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .trim()
  } catch {
    return 'unknown'
  }
}

// Shown in Settings › System; determined at build time, never maintained by hand (REQ-12, TD-15)
const systemInfo = {
  versions: {
    react: version('react'),
    typescript: version('typescript'),
    vite: version('vite'),
    ui5: version('@ui5/webcomponents'),
    motion: version('motion'),
  },
  buildDate: new Date().toISOString().slice(0, 10),
  commit: commit(),
}

// https://vite.dev/config/
export default defineConfig({
  // Relative base so the static build works on any host and sub-path
  base: './',
  // Test servers use their own dependency cache so they never invalidate a running `npm run dev`
  cacheDir: process.env.VITE_CACHE_DIR ?? 'node_modules/.vite',
  define: { __SYSTEM_INFO__: JSON.stringify(systemInfo) },
  plugins: [react()],
})
