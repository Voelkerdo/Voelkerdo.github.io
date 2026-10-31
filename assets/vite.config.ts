import react from '@vitejs/plugin-react'
import { execSync } from 'node:child_process'
import { readdirSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { defineConfig } from 'vite'
import { buildStats, buildTransports, parseCommits } from './src/data/transportLog.ts'

const version = (pkg: string): string =>
  (JSON.parse(readFileSync(`node_modules/${pkg}/package.json`, 'utf8')) as { version: string })
    .version

/** Output of a git command; empty without git or history */
function git(args: string): string {
  try {
    return execSync(`git ${args}`, { stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .trim()
  } catch {
    return ''
  }
}

function commit(): string {
  return git('rev-parse --short HEAD') || 'unknown'
}

function filesIn(dir: string): string[] {
  return readdirSync(dir, { recursive: true, encoding: 'utf8' })
    .filter((file) => /\.(ts|tsx)$/.test(file))
    .map((file) => readFileSync(join(dir, file), 'utf8'))
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

// The site's change requests as SAP transports, plus spec-driven numbers (AC-02.7, AC-02.8, TD-16)
const transports = buildTransports(
  parseCommits(git('log --reverse --format=%ad%x09%s --date=short')),
)
const transportLog = {
  transports,
  stats: buildStats(
    transports,
    readFileSync('../specs/03-tasks.md', 'utf8'),
    filesIn('tests'),
    Number(git('rev-list --count HEAD')) || 0,
  ),
}

// https://vite.dev/config/
export default defineConfig({
  // Relative base so the static build works on any host and sub-path
  base: './',
  // Test servers use their own dependency cache so they never invalidate a running `npm run dev`
  cacheDir: process.env.VITE_CACHE_DIR ?? 'node_modules/.vite',
  resolve: {
    alias: {
      // Self-hosted SAP font "72" (AC-13.1, styles/fonts.css)
      '@sap-fonts': resolve(
        'node_modules/@sap-theming/theming-base-content/content/Base/baseLib/baseTheme/fonts',
      ),
    },
  },
  define: {
    __SYSTEM_INFO__: JSON.stringify(systemInfo),
    __TRANSPORT_LOG__: JSON.stringify(transportLog),
  },
  plugins: [react()],
})
