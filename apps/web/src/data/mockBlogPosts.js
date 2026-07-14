export const MOCK_BLOG_POSTS = [
  {
    id: '1',
    title: 'Bienvenido a MemorIAmobile',
    slug: 'bienvenido-a-memoriamobile',
    content:
      'Estamos emocionados de presentar nuestra plataforma de preservación de recuerdos con IA. En este artículo te contamos cómo empezar a organizar tus fotos, vídeos y notas de voz en una bóveda segura.',
    excerpt: 'Conoce la nueva plataforma de MemorIAmobile y cómo empezar a preservar tus recuerdos.',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80',
    published: true,
    created: '2026-06-15T10:00:00.000Z',
  },
  {
    id: '2',
    title: 'Cómo sincronizar tu teléfono con la web',
    slug: 'sincronizar-telefono-con-web',
    content:
      'La conexión entre la app móvil y la web te permite acceder a tus recuerdos desde cualquier dispositivo. Aquí explicamos el proceso de emparejamiento, permisos y sincronización en segundo plano.',
    excerpt: 'Guía paso a paso para conectar tu móvil y sincronizar fotos y contactos.',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=80',
    published: true,
    created: '2026-06-28T14:30:00.000Z',
  },
  {
    id: '3',
    title: 'Novedades del plan Premium',
    slug: 'novedades-plan-premium',
    content:
      'El plan Premium incluye más almacenamiento, copias de seguridad automáticas y generación de historias con IA. Pronto añadiremos nuevas funciones de exportación y compartición familiar.',
    excerpt: 'Resumen de las mejoras incluidas en la suscripción Premium.',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=80',
    published: false,
    created: '2026-07-02T09:15:00.000Z',
  },
  {
    id: '4',
    title: 'Consejos para organizar tu galería',
    slug: 'consejos-organizar-galeria',
    content:
      'Una buena organización hace que la búsqueda inteligente sea aún más potente. Te compartimos prácticas recomendadas para etiquetar, agrupar por fechas y crear álbumes temáticos.',
    excerpt: 'Buenas prácticas para mantener tu bóveda de recuerdos ordenada.',
    image: 'https://images.unsplash.com/photo-1493863641943-9b5932e25c3f?auto=format&fit=crop&w=1200&q=80',
    published: false,
    created: '2026-07-08T16:45:00.000Z',
  },
];

export function getMockBlogPostById(id) {
  return MOCK_BLOG_POSTS.find((post) => post.id === String(id)) || null;
}

export function getMockBlogPostBySlug(slug) {
  return MOCK_BLOG_POSTS.find((post) => post.slug === slug) || null;
}

export function getPublishedMockBlogPosts() {
  return MOCK_BLOG_POSTS
    .filter((post) => post.published)
    .sort((a, b) => new Date(b.created) - new Date(a.created));
}

export function slugifyTitle(title) {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function formatBlogDate(isoDate) {
  try {
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).format(new Date(isoDate));
  } catch {
    return isoDate;
  }
}
