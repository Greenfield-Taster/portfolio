import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  use: { baseURL: 'http://localhost:4173', trace: 'on-first-retry' },
  // The `chromium-headless-shell` binary failed to download on this
  // machine (network timeouts against the Playwright CDN). Pin the
  // `chromium` channel so tests launch the full Chrome for Testing build
  // (already installed) headlessly instead of the separate shell binary.
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], channel: 'chromium' },
    },
  ],
  webServer: {
    command: 'npm run build && npm run preview -- --port 4173',
    cwd: './frontend',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
})
