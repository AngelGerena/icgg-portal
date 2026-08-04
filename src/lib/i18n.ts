import { useLang } from './providers';
import type { Lang } from './types';

type Dict = Record<string, { es: string; en: string }>;

export const STR: Dict = {
  // nav / sections
  'nav.main': { es: 'Principal', en: 'Main' },
  'nav.content': { es: 'Contenido', en: 'Content' },
  'nav.intelligence': { es: 'Inteligencia', en: 'Intelligence' },
  'nav.system': { es: 'Sistema', en: 'System' },
  'today': { es: 'Panel de Hoy', en: 'Today' },
  'inbox': { es: 'Mensajes', en: 'Messages' },
  'prayer': { es: 'Peticiones de Oración', en: 'Prayer Requests' },
  'site': { es: 'Editor del Sitio', en: 'Site Editor' },
  'events': { es: 'Eventos', en: 'Events' },
  'media': { es: 'Biblioteca de Medios', en: 'Media Library' },
  'sermons': { es: 'Predicaciones', en: 'Sermons' },
  'ai': { es: 'Estudio del Blog', en: 'Blog Studio' },
  'autopilot': { es: 'Piloto Automático', en: 'Autopilot' },
  'settings': { es: 'Ajustes', en: 'Settings' },
  'audit': { es: 'Registro de Actividad', en: 'Activity Log' },
  // subtitles
  'today.sub': { es: 'Lo que necesita tu atención hoy', en: 'What needs your attention today' },
  'inbox.sub': { es: 'Mensajes del formulario de contacto', en: 'Contact form messages' },
  'prayer.sub': { es: 'Confidencial — solo el equipo pastoral', en: 'Confidential — pastoral team only' },
  'site.sub': { es: 'Edita el contenido del sitio sin romperlo', en: 'Edit site content safely' },
  'events.sub': { es: 'Sube flyers y comparte en segundos', en: 'Upload flyers and share in seconds' },
  'media.sub': { es: 'Fotos, flyers y logos', en: 'Photos, flyers, and logos' },
  'sermons.sub': { es: 'Archivo de la Pastora Irene', en: "Pastora Irene's archive" },
  'ai.sub': { es: 'Genera contenido en español e inglés', en: 'Generate content in Spanish and English' },
  'autopilot.sub': { es: 'Publicación automática con tu aprobación', en: 'Automatic posting with your approval' },
  'settings.sub': { es: 'Ajustes del sitio y del ministerio', en: 'Site and ministry settings' },
  'audit.sub': { es: 'Todo lo que cambió y quién lo cambió', en: 'Everything that changed and who changed it' },
  // common
  'save': { es: 'Guardar', en: 'Save' },
  'saving': { es: 'Guardando…', en: 'Saving…' },
  'saved': { es: 'Guardado', en: 'Saved' },
  'cancel': { es: 'Cancelar', en: 'Cancel' },
  'delete': { es: 'Eliminar', en: 'Delete' },
  'edit': { es: 'Editar', en: 'Edit' },
  'create': { es: 'Crear', en: 'Create' },
  'publish': { es: 'Publicar', en: 'Publish' },
  'published': { es: 'Publicado', en: 'Published' },
  'draft': { es: 'Borrador', en: 'Draft' },
  'new': { es: 'Nuevo', en: 'New' },
  'share': { es: 'Compartir', en: 'Share' },
  'close': { es: 'Cerrar', en: 'Close' },
  'loading': { es: 'Cargando…', en: 'Loading…' },
  'signout': { es: 'Cerrar sesión', en: 'Sign out' },
  'signin': { es: 'Iniciar sesión', en: 'Sign in' },
  'featured': { es: 'Destacado', en: 'Featured' },
  'live': { es: 'En vivo', en: 'Live' },
  // login
  'login.title': { es: 'Portal Administrativo', en: 'Admin Portal' },
  'login.sub': { es: 'Inicia sesión para administrar el sitio de ICGG', en: 'Sign in to manage the ICGG site' },
  'login.email': { es: 'Correo electrónico', en: 'Email' },
  'login.password': { es: 'Contraseña', en: 'Password' },
  'login.error': { es: 'Correo o contraseña incorrectos.', en: 'Incorrect email or password.' },
  'login.notadmin': { es: 'Esta cuenta no tiene acceso al portal.', en: 'This account does not have portal access.' },
  'login.noconfig': { es: 'El portal no está configurado. Falta la conexión a Supabase.', en: 'Portal not configured — Supabase connection missing.' },
  // today
  'today.greeting': { es: 'Buen día', en: 'Good day' },
  'today.decisions': { es: 'Requiere tu decisión', en: 'Needs your decision' },
  'today.threethings': { es: 'Lo más importante ahora', en: 'Most important now' },
  'today.allclear': { es: 'Todo al día', en: 'All caught up' },
  'today.allclear.sub': { es: 'No hay nada pendiente. Buen trabajo.', en: 'Nothing pending. Nice work.' },
  'stat.unread': { es: 'sin leer', en: 'unread' },
  'stat.newprayers': { es: 'nuevas', en: 'new' },
  'stat.scheduled': { es: 'programadas', en: 'scheduled' },
  'stat.liveEvents': { es: 'publicados', en: 'live' },
  // empties
  'empty.events': { es: 'Sin eventos aún', en: 'No events yet' },
  'empty.events.sub': { es: 'Crea tu primer evento y compártelo por WhatsApp, SMS o redes.', en: 'Create your first event and share it via WhatsApp, SMS, or social.' },
  'empty.prayers': { es: 'Sin peticiones', en: 'No requests' },
  'empty.prayers.sub': { es: 'Las peticiones del sitio aparecerán aquí.', en: 'Requests from the site will appear here.' },
  'empty.inbox': { es: 'Sin mensajes', en: 'No messages' },
  'empty.inbox.sub': { es: 'Los mensajes del formulario de contacto aparecerán aquí.', en: 'Contact form messages will appear here.' },
  'empty.media': { es: 'Sin archivos', en: 'No files' },
  'empty.media.sub': { es: 'Sube fotos y flyers para usarlos en el sitio.', en: 'Upload photos and flyers to use on the site.' },
};

export function t(key: string, lang: Lang): string {
  const e = STR[key];
  return e ? e[lang] : key;
}

export function useT() {
  const { lang } = useLang();
  return (key: string) => t(key, lang);
}

/** pick a bilingual field with Spanish fallback */
export function pick<T extends Record<string, any>>(row: T, base: string, lang: Lang): string {
  const primary = lang === 'en' ? row[`${base}_en`] : row[`${base}_es`];
  return primary ?? row[`${base}_es`] ?? row[base] ?? '';
}
