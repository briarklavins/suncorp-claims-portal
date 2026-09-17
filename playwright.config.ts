import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e/src',
  testMatch: '**/*.e2e-spec.ts',
  timeout: 45000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['junit', { outputFile: 'test-results/e2e-results.xml' }], ['list']] : 'list',
  use: {
    baseURL: process.env.E2E_BASE_URL || 'http://localhost:4200',
    trace: 'on-first-retry',
    viewport: { width: 1366, height: 900 }
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } }
  ],
  webServer: process.env.E2E_BASE_URL ? undefined : {
    command: 'npm start -- --port 4200',
    url: 'http://localhost:4200',
    reuseExistingServer: !process.env.CI,
    timeout: 180000
  }
});
