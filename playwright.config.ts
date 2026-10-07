import { defineConfig, devices } from '@playwright/test';

const viewports = [
  { name: 'mobile-360', viewport: { width: 360, height: 740 }, hasTouch: true, isMobile: true },
  { name: 'mobile-390', viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true },
  { name: 'tablet-768', viewport: { width: 768, height: 1024 }, hasTouch: true, isMobile: true },
  { name: 'desktop-1280', viewport: { width: 1280, height: 800 } },
];

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: 'http://localhost:4321',
    locale: 'es-ES',
    timezoneId: 'Europe/Madrid',
  },
  projects: viewports.map(({ name, ...rest }) => ({
    name,
    use: { ...devices['Desktop Chrome'], ...rest },
  })),
  webServer: {
    command: 'npm run build && npm run preview -- --port 4321',
    url: 'http://localhost:4321',
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
