import { defineConfig, devices } from '@playwright/test'

const PORT = 5174
// Production build for the security tests, outside of dist/ (TD-18)
const SECURITY_PORT = 4180
const SECURITY_DIST = 'node_modules/.security-dist'

export default defineConfig({
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  // The CI runner is slower and has fewer cores: fewer workers, one retry for timing-sensitive tests
  workers: process.env.CI ? 2 : undefined,
  retries: process.env.CI ? 1 : 0,
  reporter: 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', testDir: 'tests/e2e', use: { ...devices['Desktop Chrome'] } },
    {
      name: 'security',
      testDir: 'tests/security',
      use: { ...devices['Desktop Chrome'], baseURL: `http://localhost:${SECURITY_PORT}` },
    },
  ],
  webServer: [
    {
      command: `VITE_CACHE_DIR=node_modules/.vite-e2e npx vite --port ${PORT} --strictPort`,
      url: `http://localhost:${PORT}`,
      reuseExistingServer: false,
    },
    {
      command: `VITE_CACHE_DIR=node_modules/.vite-security npx vite build --outDir ${SECURITY_DIST} --emptyOutDir && npx vite preview --outDir ${SECURITY_DIST} --port ${SECURITY_PORT} --strictPort`,
      url: `http://localhost:${SECURITY_PORT}`,
      reuseExistingServer: false,
    },
  ],
})
