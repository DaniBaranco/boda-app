import { test } from '@playwright/test';

test.skip(!process.env.SHOTS, 'Solo bajo demanda: SHOTS=1');

for (const scheme of ['light', 'dark'] as const) {
  test(`captura ${scheme}`, async ({ page }, info) => {
    await page.emulateMedia({ colorScheme: scheme, reducedMotion: 'reduce' });
    await page.goto('/');
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 400) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 30));
      }
      window.scrollTo(0, 0);
    });
    await page.screenshot({ path: `test-results/shots/${info.project.name}-${scheme}.png`, fullPage: true });
  });
}
