import { defineConfig } from '@playwright/test';

const isLiveJmapRun = process.env.E2E_LIVE_JMAP === '1';

if (isLiveJmapRun && process.env.CI) {
  throw new Error('Live JMAP tests are local-only and cannot run in CI.');
}
if (isLiveJmapRun && !process.env.JMAP_TOKEN) {
  throw new Error('JMAP_TOKEN is required to run the live JMAP tests.');
}

export default defineConfig({
  testDir: isLiveJmapRun ? './tests/live' : './tests/e2e',
  testMatch: '**/*.e2e.ts',
  fullyParallel: false,
  workers: 1,
  retries: isLiveJmapRun ? 0 : process.env.CI ? 2 : 0,
  timeout: isLiveJmapRun ? 120_000 : 30_000,
  expect: { timeout: isLiveJmapRun ? 15_000 : 5_000 },
  reporter: process.env.CI ? [['line'], ['html', { open: 'never' }]] : 'list',
  outputDir: isLiveJmapRun ? 'test-results-live' : 'test-results',
  use: {
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: process.env.CI ? 'retain-on-failure' : 'off'
  }
});
