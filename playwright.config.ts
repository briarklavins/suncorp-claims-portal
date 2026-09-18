import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.E2E_BASE_URL || 'http://localhost:4200';

export default defineConfig({
  testDir: './e2e',
  testMatch: /.*\.e2e-spec\.ts/,
  timeout: 45000,
  expect: { timeout: 10000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI
    ? [['list'], ['junit', { outputFile: 'test-results/e2e-junit.xml' }]]
    : [['list']],
  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    viewport: { width: 1366, height: 900 }
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } }
  ],
  webServer: {
    command: 'npx ng serve --port 4200 --host 127.0.0.1',
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 180000
  }
});
