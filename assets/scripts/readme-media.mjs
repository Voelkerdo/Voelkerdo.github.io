// Screenshots and the time travel GIF for the repository README, from the production build
// (AC-15.5, tech spec §9c). Needs ffmpeg. Run in assets/: npm run readme:media
import { chromium } from '@playwright/test'
import { execFileSync, spawn } from 'node:child_process'
import { mkdirSync, mkdtempSync, readdirSync, rmSync, statSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const OUT = '../.github/readme'
const DIST = 'node_modules/.readme-dist'
const PORT = 4190
// Loopback only, never exposed to the network
const HOST = '127.0.0.1'
const BASE = `http://${HOST}:${PORT}/`
const VIEWPORT = { width: 1280, height: 780 }
const MAX_GIF_BYTES = 3 * 1024 * 1024

const env = { ...process.env, VITE_CACHE_DIR: 'node_modules/.vite-readme' }

console.log('Building …')
execFileSync('npx', ['vite', 'build', '--outDir', DIST, '--emptyOutDir'], { env, stdio: 'ignore' })

const preview = spawn(
  'npx',
  ['vite', 'preview', '--outDir', DIST, '--host', HOST, '--port', String(PORT), '--strictPort'],
  {
    env,
    stdio: 'ignore',
  },
)

/** Polls with the browser until the preview answers */
async function waitForServer(browser) {
  const page = await browser.newPage()
  try {
    for (let i = 0; i < 60; i++) {
      try {
        if ((await page.goto(BASE, { timeout: 2000 }))?.ok()) return
      } catch {
        // not up yet
      }
      await page.waitForTimeout(250)
    }
    throw new Error('preview server did not start')
  } finally {
    await page.close()
  }
}

/** Overview page with all cards entered and the pointer out of the way */
async function openOverview(page) {
  await page.goto(BASE)
  await page.locator('.bento-cell').nth(4).waitFor()
  await page.evaluate(() => document.fonts.ready)
  await page.mouse.move(0, 0)
  await page.waitForTimeout(2500)
}

const browser = await chromium.launch()
try {
  await waitForServer(browser)
  mkdirSync(OUT, { recursive: true })

  // Hero screenshots, light and dark (AC-15.1)
  for (const scheme of ['light', 'dark']) {
    const page = await browser.newPage({
      viewport: VIEWPORT,
      deviceScaleFactor: 2,
      colorScheme: scheme,
      reducedMotion: 'no-preference',
    })
    await openOverview(page)
    await page.screenshot({ path: join(OUT, `hero-${scheme}.png`) })
    await page.close()
    console.log(`hero-${scheme}.png`)
  }

  // Time travel: 2026 → 1992 (SAP Classic) and back (AC-15.2)
  const videoDir = mkdtempSync(join(tmpdir(), 'readme-video-'))
  const context = await browser.newContext({
    viewport: VIEWPORT,
    colorScheme: 'light',
    reducedMotion: 'no-preference',
    recordVideo: { dir: videoDir, size: VIEWPORT },
  })
  const startedAt = Date.now()
  const page = await context.newPage()
  await openOverview(page)
  const clipStart = (Date.now() - startedAt) / 1000
  await page.getByTestId('shell-avatar').click()
  await page.waitForTimeout(700)
  await page.locator('ui5-user-menu-item[data-action="settings"]').click()
  await page.waitForTimeout(1200)
  await page.locator('[data-theme-id="classic"]').click()
  await page.locator('html[data-theme="classic"]').waitFor({ state: 'attached' })
  await page.waitForTimeout(1200)
  await page.keyboard.press('Escape')
  await page.mouse.move(0, 0)
  await page.waitForTimeout(2500)
  const clipEnd = (Date.now() - startedAt) / 1000
  await context.close()

  const video = join(
    videoDir,
    readdirSync(videoDir).find((file) => file.endsWith('.webm')),
  )
  const gif = join(OUT, 'time-travel.gif')
  const filters = (width, colors) =>
    `fps=15,scale=${width}:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=${colors}:stats_mode=diff[p];[b][p]paletteuse=dither=bayer:bayer_scale=4:diff_mode=rectangle`
  // Smaller variants until the GIF fits the size limit
  for (const [width, colors] of [
    [960, 160],
    [880, 128],
    [800, 96],
  ]) {
    execFileSync('ffmpeg', [
      '-y',
      '-loglevel',
      'error',
      '-ss',
      String(Math.max(0, clipStart - 0.3)),
      '-to',
      String(clipEnd),
      '-i',
      video,
      '-vf',
      filters(width, colors),
      '-loop',
      '0',
      gif,
    ])
    if (statSync(gif).size <= MAX_GIF_BYTES) break
  }
  rmSync(videoDir, { recursive: true, force: true })
  console.log(`time-travel.gif (${(statSync(gif).size / 1024 / 1024).toFixed(2)} MB)`)
} finally {
  await browser.close()
  preview.kill()
}
