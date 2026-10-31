import react from '@vitejs/plugin-react'
import { execSync } from 'node:child_process'
import { readdirSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { defineConfig, type Plugin } from 'vite'
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

// Content Security Policy and referrer policy as meta tags: GitHub Pages allows no own headers.
// Build only, the dev server needs an inline script for React Fast Refresh (AC-13.2, AC-13.3, TD-17)
export const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self'",
  "font-src 'self'",
  "img-src 'self' data:",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'none'",
].join('; ')

// Preloads the regular "72" font, so text switches to it early on phones (AC-08.2)
function preloadMainFont(): Plugin {
  return {
    name: 'preload-main-font',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler: (_html, ctx) => {
        const font = Object.keys(ctx.bundle ?? {}).find((file) =>
          /\/72-Regular-(?!full)[\w-]+\.woff2$/.test(file),
        )
        if (!font) return []
        return [
          {
            tag: 'link',
            attrs: {
              rel: 'preload',
              href: `./${font}`,
              as: 'font',
              type: 'font/woff2',
              crossorigin: '',
            },
            injectTo: 'head',
          },
        ]
      },
    },
  }
}

// UI5 loads the theme parameters in a chain of requests before it renders; preloading those of
// the default theme lets them load in parallel with the app (AC-08.2)
function preloadDefaultTheme(): Plugin {
  return {
    name: 'preload-default-theme',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler: (_html, ctx) =>
        Object.values(ctx.bundle ?? {})
          .filter(
            (chunk) =>
              chunk.type === 'chunk' &&
              chunk.isDynamicEntry &&
              chunk.moduleIds.some((id) =>
                /\/themes\/sap_horizon\/parameters-bundle\.css/.test(id),
              ),
          )
          .map((chunk) => ({
            tag: 'link',
            attrs: { rel: 'modulepreload', href: `./${chunk.fileName}`, crossorigin: '' },
            injectTo: 'head' as const,
          })),
    },
  }
}

function securityMetaTags(): Plugin {
  return {
    name: 'security-meta-tags',
    apply: 'build',
    transformIndexHtml: () => [
      {
        tag: 'meta',
        attrs: { 'http-equiv': 'Content-Security-Policy', content: CONTENT_SECURITY_POLICY },
        injectTo: 'head-prepend',
      },
      {
        tag: 'meta',
        attrs: { name: 'referrer', content: 'strict-origin-when-cross-origin' },
        injectTo: 'head-prepend',
      },
    ],
  }
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
  plugins: [react(), securityMetaTags(), preloadMainFont(), preloadDefaultTheme()],
})
