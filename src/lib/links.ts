const FORM_HOSTS = ['forms.gle', 'docs.google.com'];

/** Devuelve true solo si es un enlace real de Google Forms (no un placeholder). */
export function isValidFormUrl(value: string | undefined | null): value is string {
  if (!value || /REEMPLAZAR|TODO|XXX/i.test(value)) return false;
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' || !FORM_HOSTS.includes(url.hostname)) return false;
    if (url.hostname === 'docs.google.com') return url.pathname.startsWith('/forms/');
    return url.pathname.length > 1;
  } catch {
    return false;
  }
}

export function telHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, '')}`;
}

function toGoogleDate(iso: string): string {
  return new Date(iso).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

export function googleCalendarUrl(opts: {
  title: string;
  start: string;
  end: string;
  details?: string;
  location?: string;
}): string {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: opts.title,
    dates: `${toGoogleDate(opts.start)}/${toGoogleDate(opts.end)}`,
  });
  if (opts.details) params.set('details', opts.details);
  if (opts.location) params.set('location', opts.location);
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
