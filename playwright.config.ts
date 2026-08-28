import { defineConfig } from '@playwright/test';

const externalBaseUrl = process.env.APC_BASE_URL;

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30_000,
  expect: { timeout: 5_000 },
  use: {
    baseURL: externalBaseUrl || 'http://127.0.0.1:4173',
    browserName: 'chromium',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure'
  },
  webServer: externalBaseUrl ? undefined : {
    command: 'node scripts/serve-site.mjs',
    port: 4173,
    reuseExistingServer: false
  }
});
