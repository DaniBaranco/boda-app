export interface Place {
  name: string;
  town: string;
  mapsUrl: string;
}

export interface TimelineItem {
  id: string;
  time: string;
  title: string;
  description: string;
  icon: string;
  place?: Place;
}

export interface Faq {
  question: string;
  answer: string;
}

export interface Contact {
  name: string;
  phone: string;
}

const maps = (destination: string) =>
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination).replace(/%20/g, '+')}`;

export const wedding = {
  couple: 'Almu & Dani',
  names: ['Almu', 'Dani'] as const,
  /** Hora de inicio de la ceremonia en Madrid (CEST, UTC+2). */
  startsAt: '2027-07-03T18:30:00+02:00',
  endsAt: '2027-07-04T05:00:00+02:00',
  dateLabel: 'Sábado, 3 de julio de 2027',
  shortDate: '03 · 07 · 2027',
  rsvpDeadline: '2027-06-03',
  rsvpDeadlineLabel: '3 de junio de 2027',
  /** Sustituye por la URL real del formulario de Google (forms.gle o docs.google.com/forms). */
  formUrl: 'https://forms.gle/REEMPLAZAR_CON_FORM_REAL',
  /** Formulario específico del autobús. Vacío = se usa el formulario general. */
  busFormUrl: '',
  timeline: [
    {
      id: 'ceremonia',
      time: '18:30',
      title: 'Ceremonia',
      icon: '⛪',
      description: 'El momento más importante del día. Llega con tiempo para coger buen sitio.',
      place: {
        name: 'Iglesia de Santa María Magdalena',
        town: 'Torrelaguna, Madrid',
        mapsUrl: maps('Iglesia de Santa Maria Magdalena Torrelaguna Madrid'),
      },
    },
    {
      id: 'coctel',
      time: '20:00',
      title: 'Recepción y cóctel',
      icon: '🥂',
      description: 'Brindis de bienvenida en los jardines de la finca. Empieza lo bueno.',
      place: {
        name: 'Finca Casa de Oficios',
        town: 'Torremocha del Jarama, Madrid',
        mapsUrl: maps('Finca Casa de Oficios Torremocha del Jarama Madrid'),
      },
    },
    {
      id: 'banquete',
      time: 'A continuación',
      title: 'Banquete',
      icon: '🍽️',
      description:
        'Habrá menú vegetariano, vegano e infantil. Indícanoslo en el formulario de confirmación.',
    },
    {
      id: 'fiesta',
      time: 'Hasta que el cuerpo aguante',
      title: '¡Fiesta!',
      icon: '🪩',
      description: 'Baile, música y alguna sorpresa. El autobús de vuelta te espera.',
    },
  ] satisfies TimelineItem[],
  bus: {
    outbound: {
      time: '17:00',
      from: 'Junto al Metro Sainz de Baranda',
      address: 'C/ Doctor Esquerdo, 109 · Madrid',
      mapsUrl: maps('Estacion de Metro Sainz de Baranda Madrid'),
      route: ['Punto de recogida', 'Iglesia', 'Finca'],
    },
    returns: ['03:00', '05:00'],
    returnTo: 'Finca → mismo punto de recogida',
  },
  preboda: {
    dateLabel: 'Viernes, 2 de julio de 2027',
    time: '20:00 – 00:00',
    place: {
      name: 'The Irish Rover',
      town: 'Av. de Brasil, 7 · Madrid',
      mapsUrl: maps('The Irish Rover Avenida de Brasil 7 Madrid'),
    },
    description: 'Unas cañas la noche antes para ir calentando motores. ¡Pásate aunque sea un rato!',
  },
  faqs: [
    {
      question: '¿Hay autobús de ida y vuelta?',
      answer:
        'Sí. Sale a las 17:00 desde Sainz de Baranda, pasa por la iglesia y termina en la finca. A la vuelta hay dos salidas: 03:00 y 05:00. Indícalo en el formulario para reservar plaza.',
    },
    {
      question: 'Tengo alergias o intolerancias, ¿qué hago?',
      answer:
        'En el formulario hay un campo para contárnoslas. Se lo pasaremos al catering para que lo tenga en cuenta.',
    },
    {
      question: '¿Hay menú vegetariano, vegano o infantil?',
      answer: 'Sí, los tres. Solo tienes que indicarlo al confirmar asistencia.',
    },
    {
      question: '¿Hasta cuándo puedo confirmar?',
      answer:
        'Hasta el 3 de junio de 2027. Nos ayuda muchísimo para cerrar mesas, menús y autobús.',
    },
  ] satisfies Faq[],
  contacts: [
    { name: 'Almu', phone: '+34 600 123 456' },
    { name: 'Dani', phone: '+34 600 654 321' },
  ] satisfies Contact[],
} as const;

export type Wedding = typeof wedding;
