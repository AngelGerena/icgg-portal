import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Users, ArrowRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { supabase } from '../lib/supabase';

const STATIC_EVENTS = [
  {
    id: 'static-1',
    title_es: 'Oración Matutina',
    date: null,
    time_start: '08:30',
    time_end: null,
    location: '2560 S. Elm Ave. Sanford, FL 32773',
    description: 'Únete a nosotros cada miércoles para un tiempo de oración y comunión.',
    type: 'weekly',
    color: '#3b82f6',
    flyer_url: 'https://www.dropbox.com/scl/fi/nx2yvtadqibyn0ui7ldn1/ICGG-23-of-133.jpg?rlkey=lqvr296qej8eqvqyepl9u77lr&st=y6g398tu&raw=1',
    date_label: 'Cada Miércoles',
    is_weekly: true
  },
  {
    id: 'static-2',
    title_es: 'Estudio Bíblico',
    date: null,
    time_start: '19:30',
    time_end: '21:00',
    location: '2560 S. Elm Ave. Sanford, FL 32773',
    description: 'Profundiza en la Palabra de Dios con nuestra comunidad cada jueves.',
    type: 'weekly',
    color: '#f59e0b',
    flyer_url: 'https://www.dropbox.com/scl/fi/gbb3lkzcqrn7pwz424ryo/ICCG-11-19-53-of-135.jpg?rlkey=5mr4eaq0w91l9odc1cwt5trpy&st=45emqolf&raw=1',
    date_label: 'Cada Jueves',
    is_weekly: true
  },
  {
    id: 'static-3',
    title_es: 'Servicio Dominical',
    date: null,
    time_start: '10:00',
    time_end: '12:30',
    location: '2560 S. Elm Ave. Sanford, FL 32773',
    description: 'Celebra con nosotros cada domingo en un tiempo de adoración y la Palabra.',
    type: 'celebration',
    color: '#10b981',
    flyer_url: 'https://www.dropbox.com/scl/fi/9muoo0s2b2d63f977iea5/FM-1-23-of-38.jpg?rlkey=hezm4qm3ah87atez9fxttty9j&st=mnud5zzd&raw=1',
    date_label: 'Cada Domingo',
    is_weekly: true
  }
];

const TYPE_COLORS: Record<string, string> = {
  weekly: 'bg-blue-500/90 text-white',
  special: 'bg-amber-500/90 text-white',
  celebration: 'bg-green-500/90 text-white',
  youth: 'bg-purple-500/90 text-white',
  kids: 'bg-pink-500/90 text-white',
  conference: 'bg-red-500/90 text-white'
};

const TYPE_LABELS: Record<string, string> = {
  weekly: 'Semanal',
  special: 'Especial',
  celebration: 'Celebración',
  youth: 'Jóvenes',
  kids: 'Niños',
  conference: 'Conferencia'
};

function formatTime(t: string | null) {
  if (!t) return '';
  const [h, m] = t.split(':');
  const hr = parseInt(h);
  const ampm = hr >= 12 ? 'PM' : 'AM';
  return `${hr % 12 || 12}:${m} ${ampm}`;
}

function formatDate(dateStr: string | null, dateLabel?: string) {
  if (dateLabel) return dateLabel;
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('es-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

interface EventItem {
  id: string;
  title_es: string;
  date: string | null;
  time_start: string | null;
  time_end: string | null;
  location: string;
  description: string | null;
  type: string;
  color: string;
  flyer_url: string | null;
  is_weekly: boolean;
  date_label?: string;
}

const Events = () => {
  const { t } = useLanguage();
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();
  const { ref: eventsRef, isVisible: eventsVisible } = useScrollAnimation();
  const { ref: ctaRef, isVisible: ctaVisible } = useScrollAnimation();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const today = new Date().toISOString().split('T')[0];
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .eq('is_active', true)
          .or(`date.gte.${today},is_weekly.eq.true`)
          .order('date', { ascending: true, nullsFirst: false });

        if (error || !data || data.length === 0) {
          setEvents(STATIC_EVENTS as EventItem[]);
        } else {
          setEvents(data);
        }
      } catch {
        setEvents(STATIC_EVENTS as EventItem[]);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  return (
    <section id="calendario-eventos" className="py-20 bg-white" style={{ backgroundColor: '#ffffff', scrollMarginTop: '100px' }}>
      <div className="container mx-auto px-4">
        <div
          ref={headerRef}
          className={`text-center mb-16 transition-all duration-1000 ${headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{t('events.title')}</h2>
          <div className="w-24 h-1 bg-amber-600 mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">{t('events.description')}</p>
        </div>

        <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">{t('events.calendarTitle')}</h3>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
          </div>
        ) : (
          <div ref={eventsRef} className="grid lg:grid-cols-2 gap-8 mb-16">
            {events.map((event, index) => (
              <div
                key={event.id}
                className={`bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-700 overflow-hidden group hover:-translate-y-1 ${eventsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="relative h-48 overflow-hidden">
                  <div className="absolute inset-0 opacity-20" style={{ background: `linear-gradient(135deg, ${event.color}, ${event.color}99)` }}></div>
                  {event.flyer_url ? (
                    <img
                      src={event.flyer_url}
                      alt={event.title_es}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <div className="h-12 w-12 bg-gray-400 rounded"></div>
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-black/60 text-white backdrop-blur-sm">
                      {formatDate(event.date, event.date_label)}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${TYPE_COLORS[event.type] || 'bg-purple-500/90 text-white'}`}>
                      {TYPE_LABELS[event.type] || event.type}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-700 transition-colors">
                    {event.title_es}
                  </h3>
                  <div className="space-y-3 mb-6">
                    {event.date && (
                      <div className="flex items-center space-x-3 text-gray-600">
                        <div className="p-2 rounded-lg bg-blue-100"><Calendar className="h-4 w-4 text-blue-600" /></div>
                        <span className="font-medium">{formatDate(event.date)}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-3 text-gray-600">
                      <div className="p-2 rounded-lg bg-amber-100"><Clock className="h-4 w-4 text-amber-600" /></div>
                      <span className="font-medium">
                        {formatTime(event.time_start)}{event.time_end ? ` — ${formatTime(event.time_end)}` : ''}
                      </span>
                    </div>
                    <div className="flex items-start space-x-3 text-gray-600">
                      <div className="p-2 rounded-lg bg-green-100"><MapPin className="h-4 w-4 text-green-600" /></div>
                      <span className="font-medium text-sm leading-relaxed">{event.location}</span>
                    </div>
                  </div>
                  {event.description && <p className="text-gray-700 leading-relaxed mb-4">{event.description}</p>}
                  <div className="flex items-center space-x-2 text-gray-500">
                    <Users className="h-4 w-4" />
                    <span className="text-sm">{t('events.allWelcome')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div
          ref={ctaRef}
          className={`text-center transition-all duration-1000 ${ctaVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
        >
          <div className="bg-gradient-to-r from-blue-700 to-blue-800 rounded-2xl shadow-xl p-8 text-white max-w-4xl mx-auto hover:shadow-2xl transition-shadow duration-300">
            <h3 className="text-3xl font-bold mb-4">¿Quieres estar al día con nuestros eventos?</h3>
            <p className="text-xl text-blue-100 mb-6">Síguenos en Facebook y nunca te pierdas nuestras actividades especiales</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://www.facebook.com/irenegraciaygloria"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-blue-700 hover:bg-blue-50 px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg inline-flex items-center justify-center space-x-2"
              >
                <span>Seguir en Facebook</span>
                <ArrowRight className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Events;
