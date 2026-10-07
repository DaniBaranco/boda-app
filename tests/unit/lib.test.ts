import { describe, expect, it } from 'vitest';
import { getCountdown } from '../../src/lib/countdown';
import { buildIcs } from '../../src/lib/ics';
import { googleCalendarUrl, isValidFormUrl, telHref } from '../../src/lib/links';
import { wedding } from '../../src/data/wedding';

describe('getCountdown', () => {
  it('desglosa días, horas, minutos y segundos', () => {
    const now = new Date('2027-07-01T16:29:30Z');
    expect(getCountdown('2027-07-03T18:30:00+02:00', now)).toEqual({
      days: 2,
      hours: 0,
      minutes: 0,
      seconds: 30,
      done: false,
    });
  });

  it('marca done cuando la fecha ya ha pasado o es inválida', () => {
    expect(getCountdown('2020-01-01', new Date('2021-01-01')).done).toBe(true);
    expect(getCountdown('no-es-fecha').done).toBe(true);
  });
});

describe('isValidFormUrl', () => {
  it.each([
    ['https://forms.gle/abc123', true],
    ['https://docs.google.com/forms/d/e/xyz/viewform', true],
    ['https://docs.google.com/document/d/xyz', false],
    ['http://forms.gle/abc123', false],
    ['https://forms.gle/', false],
    ['https://forms.gle/REEMPLAZAR', false],
    ['https://example.com/forms/abc', false],
    ['', false],
    [undefined, false],
  ])('%s → %s', (url, expected) => {
    expect(isValidFormUrl(url)).toBe(expected);
  });

  it('el formulario de ejemplo sigue desactivado hasta que se configure', () => {
    expect(isValidFormUrl(wedding.formUrl)).toBe(false);
  });
});

describe('telHref', () => {
  it('elimina espacios y separadores', () => {
    expect(telHref('+34 600 123-456')).toBe('tel:+34600123456');
  });
});

describe('googleCalendarUrl', () => {
  it('genera fechas en UTC y codifica los campos', () => {
    const url = new URL(
      googleCalendarUrl({
        title: 'Boda A & D',
        start: '2027-07-03T18:30:00+02:00',
        end: '2027-07-04T04:00:00+02:00',
        location: 'Torrelaguna',
      }),
    );
    expect(url.searchParams.get('dates')).toBe('20270703T163000Z/20270704T020000Z');
    expect(url.searchParams.get('text')).toBe('Boda A & D');
    expect(url.searchParams.get('location')).toBe('Torrelaguna');
  });
});

describe('buildIcs', () => {
  const ics = buildIcs(
    [
      {
        uid: 'boda@test',
        title: 'Boda; Almu, Dani',
        start: '2027-07-03T18:30:00+02:00',
        end: '2027-07-04T04:00:00+02:00',
        description: 'Línea 1\nLínea 2 con un texto bastante largo para forzar el plegado de líneas a 75 octetos según RFC',
      },
    ],
    '2026-01-01T00:00:00Z',
  );

  it('usa CRLF y estructura VCALENDAR válida', () => {
    expect(ics.startsWith('BEGIN:VCALENDAR\r\n')).toBe(true);
    expect(ics.endsWith('END:VCALENDAR\r\n')).toBe(true);
    expect(ics).toContain('DTSTART:20270703T163000Z');
    expect(ics).toContain('DTSTAMP:20260101T000000Z');
  });

  it('escapa caracteres especiales', () => {
    expect(ics).toContain('SUMMARY:Boda\\; Almu\\, Dani');
    expect(ics).toContain('Línea 1\\nLínea 2');
  });

  it('ninguna línea supera 75 octetos', () => {
    const encoder = new TextEncoder();
    for (const line of ics.split('\r\n')) {
      expect(encoder.encode(line).length).toBeLessThanOrEqual(75);
    }
  });
});
