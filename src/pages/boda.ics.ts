import type { APIRoute } from 'astro';
import { wedding } from '../data/wedding';
import { buildIcs } from '../lib/ics';

export const GET: APIRoute = ({ site }) => {
  const [ceremony] = wedding.timeline;
  const body = buildIcs([
    {
      uid: 'boda-almu-dani-20270703@boda-app',
      title: `Boda de ${wedding.couple}`,
      start: wedding.startsAt,
      end: wedding.endsAt,
      description: 'Ceremonia 18:30 en Torrelaguna · Celebración en Finca Casa de Oficios.',
      location: `${ceremony.place?.name}, ${ceremony.place?.town}`,
      url: site?.toString(),
    },
  ]);
  return new Response(body, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': 'attachment; filename="boda-almu-dani.ics"',
    },
  });
};
