import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright replaces Protractor (removed with Angular 15). `npm run e2e` starts
 * `ng serve` and runs the specs under e2e/ against it.
 */
export default defineConfig({
  testDir: './e2e',
  testMatch: /.*\.e2e-spec\.ts/,
  timeout: 45000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['list'], ['junit', { outputFile: 'test-results/e2e-junit.xml' }]] : 'list',
  use: {
    baseURL: 'http://localhost:4200',
    trace: 'retain-on-failure',
    viewport: { width: 1366, height: 900 }
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } }
  ],
  webServer: {
    command: 'npx ng serve --port 4200',
    url: 'http://localhost:4200',
    reuseExistingServer: !process.env.CI,
    timeout: 180000
  }
});
