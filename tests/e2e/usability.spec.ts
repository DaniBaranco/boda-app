import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('sin violaciones de accesibilidad (WCAG 2.2 AA)', async ({ page }) => {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'])
    .analyze();
  expect(results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(' | ')}`)).toEqual(
    [],
  );
});

test('modo oscuro sin problemas de contraste', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  const results = await new AxeBuilder({ page }).withTags(['wcag2aa']).analyze();
  expect(results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(' | ')}`)).toEqual(
    [],
  );
});

test('sin scroll horizontal', async ({ page }) => {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});

test('áreas táctiles de al menos 44×44 px', async ({ page }) => {
  const small = await page.evaluate(() => {
    const els = document.querySelectorAll<HTMLElement>('a, button, summary, [role="link"]');
    return [...els]
      .filter((el) => {
        const style = getComputedStyle(el);
        if (style.display === 'none' || style.visibility === 'hidden') return false;
        if (el.closest('[popover]:not(:popover-open)')) return false;
        if (el.classList.contains('skip-link')) return false;
        // Los enlaces en línea dentro de un párrafo están exentos (WCAG 2.5.8).
        if (el.tagName === 'A' && el.closest('p') && !el.classList.contains('btn')) return false;
        const r = el.getBoundingClientRect();
        return r.width > 0 && (r.width < 44 || r.height < 44);
      })
      .map((el) => {
        const r = el.getBoundingClientRect();
        return `${el.tagName.toLowerCase()} "${(el.textContent ?? el.getAttribute('aria-label') ?? '').trim().slice(0, 30)}" ${Math.round(r.width)}×${Math.round(r.height)}`;
      });
  });
  expect(small).toEqual([]);
});

test('la navegación lleva a cada sección y la marca como activa', async ({ page }) => {
  const nav = page.getByRole('navigation', { name: 'Secciones' });
  for (const [label, id] of [
    ['Plan', 'plan'],
    ['Bus', 'bus'],
    ['Dudas', 'dudas'],
    ['Confirmar', 'confirmar'],
  ] as const) {
    const link = nav.getByRole('link', { name: label, exact: true });
    await link.click();
    await expect(page).toHaveURL(new RegExp(`#${id}$`));
    await expect(page.locator(`#${id}`)).toBeInViewport();
    await expect(link).toHaveAttribute('aria-current', 'location');
  }
});

test('la navegación no tapa el contenido de las secciones', async ({ page }) => {
  const nav = page.getByRole('navigation', { name: 'Secciones' });
  await nav.getByRole('link', { name: 'Confirmar', exact: true }).click();
  const heading = page.locator('#confirmar h2');
  await expect(heading).toBeInViewport();
  const [navBox, headBox] = await Promise.all([nav.boundingBox(), heading.boundingBox()]);
  expect(navBox && headBox).toBeTruthy();
  const overlaps = headBox!.y < navBox!.y + navBox!.height && headBox!.y + headBox!.height > navBox!.y;
  expect(overlaps).toBe(false);
});

test('la cuenta atrás se actualiza en cliente', async ({ page }) => {
  const days = page.locator('[data-countdown] [data-unit="days"]');
  await expect(days).not.toHaveText('');
  expect(Number(await days.textContent())).toBeGreaterThanOrEqual(0);
});

test('el CTA de confirmación queda desactivado mientras no haya formulario', async ({ page }) => {
  const cta = page.locator('[data-rsvp]');
  await expect(cta).toHaveAttribute('aria-disabled', 'true');
  await expect(page.locator('#rsvp-soon')).toBeVisible();
});

test('el menú de calendario se abre y ofrece el .ics', async ({ page }) => {
  await page.getByRole('button', { name: /calendario/i }).first().click();
  const ics = page.getByRole('link', { name: /\.ics|apple|outlook/i });
  await expect(ics).toBeVisible();
  const res = await page.request.get('/boda.ics');
  expect(res.ok()).toBe(true);
  expect(res.headers()['content-type']).toContain('text/calendar');
  expect(await res.text()).toContain('BEGIN:VEVENT');
});

test('las preguntas frecuentes funcionan como acordeón exclusivo', async ({ page }) => {
  const items = page.locator('#dudas details');
  await expect(items.first()).toHaveAttribute('open', '');
  await items.nth(1).locator('summary').click();
  await expect(items.nth(1)).toHaveAttribute('open', '');
  await expect(items.first()).not.toHaveAttribute('open', '');
});

test('la galería se puede recorrer con los puntos', async ({ page }) => {
  const dots = page.locator('#lugares [data-go]');
  const count = await dots.count();
  expect(count).toBeGreaterThan(1);
  await dots.nth(count - 1).scrollIntoViewIfNeeded();
  await dots.nth(count - 1).click();
  await expect(dots.nth(count - 1)).toHaveAttribute('aria-current', 'true');
});

test('favicon y manifest existen', async ({ page }) => {
  for (const path of ['/favicon.svg', '/manifest.webmanifest', '/apple-touch-icon.png']) {
    expect((await page.request.get(path)).ok(), path).toBe(true);
  }
});
