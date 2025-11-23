// Playwright configuration for E2E tests
module.exports = {
  testDir: '.',
  timeout: 30000,
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [['list'], ['json', { outputFile: 'qa/reports/e2e-results.json' }]],
  use: {
    baseURL: 'http://localhost:8000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        browserName: 'chromium',
        viewport: { width: 1920, height: 1080 },
      },
    },
  ],
  webServer: {
    command: 'python3 -m http.server 8000 --directory src/frontend',
    port: 8000,
    timeout: 120000,
    reuseExistingServer: !process.env.CI,
  },
};
