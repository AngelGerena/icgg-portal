import React, { useEffect } from 'react';
import { Radio, Calendar, Clock, Users, ArrowRight, ThumbsUp } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const LiveStream = () => {
  const { t } = useLanguage();

  // Load Elfsight script dynamically
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://elfsightcdn.com/platform.js';
    script.async = true;
    document.head.appendChild(script);

    return () => {
      // Cleanup script if component unmounts
      const existingScript = document.querySelector('script[src="https://elfsightcdn.com/platform.js"]');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

  // Load EmbedVid.io script dynamically
  useEffect(() => {
    const embedvidScript = document.createElement('script');
    embedvidScript.type = 'text/javascript';
    embedvidScript.id = 'embedvidio-9fe4eff8-41f9-4d54-aa6c-1d1d2f213aec-widget';
    embedvidScript.src = 'https://www.embedvid.io/embedjs/embedvidio.js';
    
    // Check if script already exists
    if (!document.getElementById('embedvidio-9fe4eff8-41f9-4d54-aa6c-1d1d2f213aec-widget')) {
      const firstScript = document.getElementsByTagName('script')[0];
      firstScript.parentNode?.insertBefore(embedvidScript, firstScript);
    }

    return () => {
      // Cleanup script if component unmounts
      const existingEmbedScript = document.getElementById('embedvidio-9fe4eff8-41f9-4d54-aa6c-1d1d2f213aec-widget');
      if (existingEmbedScript) {
        existingEmbedScript.parentNode?.removeChild(existingEmbedScript);
      }
    };
  }, []);

  return (
    <section id="live" className="py-20 bg-gray-50 scroll-mt-24" style={{backgroundColor: '#f9fafb'}}>
      <div className="container mx-auto px-4">
        {/* Live Stream Section Header */}
        <div id="livestream" className="text-center mb-8 scroll-mt-24">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t('live.title')}
          </h2>
          <div className="w-24 h-1 bg-amber-600 mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('live.description')}
          </p>
        </div>

        {/* Live Stream Embed */}
        <div className="max-w-7xl mx-auto mb-12">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-700 to-blue-800 p-6 text-white">
              <div className="flex items-center justify-center space-x-3">
                <Radio className="h-6 w-6 text-red-400 animate-pulse" />
                <h3 className="text-2xl font-bold">{t('live.serviceTitle')}</h3>
              </div>
            </div>
            
            {/* Full Width EmbedVid.io Live Stream */}
            <div className="relative bg-gray-900 p-4">
              <div className="aspect-video overflow-hidden relative bg-gray-900 rounded-lg max-w-6xl mx-auto">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div 
                    id="embedvidio-9fe4eff8-41f9-4d54-aa6c-1d1d2f213aec"
                    className="w-full h-full"
                    style={{ minHeight: '300px' }}
                  ></div>
                </div>
              </div>
            </div>
            
            {/* Service Information */}
            <div className="bg-white p-8 text-center border-t border-gray-200">
              <div className="max-w-4xl mx-auto">
                <div className="text-center">
                  <div className="bg-blue-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="text-2xl font-bold text-gray-900 mb-4">Únete a Nosotros</h4>
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    Experimenta la adoración y la enseñanza bíblica en vivo desde la comodidad de tu hogar o únete a nosotros en persona.
                  </p>
                  <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <div className="flex items-center justify-center space-x-2 mb-2">
                        <Calendar className="h-5 w-5 text-blue-700" />
                        <span className="font-semibold text-blue-900">Domingos</span>
                      </div>
                      <p className="text-blue-800 text-lg font-bold">10:00 AM</p>
                      <p className="text-blue-700 text-sm">Servicio Principal</p>
                    </div>
                    <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                      <div className="flex items-center justify-center space-x-2 mb-2">
                        <Calendar className="h-5 w-5 text-amber-700" />
                        <span className="font-semibold text-amber-900">Jueves</span>
                      </div>
                      <p className="text-amber-800 text-lg font-bold">7:30 PM</p>
                      <p className="text-amber-700 text-sm">Estudio Bíblico</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Event Calendar Section */}
            <div id="calendar" className="mt-6 bg-gray-50 p-6 rounded-lg">
              <div className="text-center mb-6">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  {t('events.calendarTitle')}
                </h2>
                <div className="w-24 h-1 bg-amber-600 mx-auto mb-6"></div>
                <p className="text-xl text-gray-600">{t('events.calendarDescription')}</p>
              </div>
              <div className="w-full">
                <div 
                  className="elfsight-app-2dde9675-3e45-4096-8bee-71440c06bbf4" 
                  data-elfsight-app-lazy
                  style={{ minHeight: '400px', width: '100%' }}
                ></div>
                <noscript>
                  <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
                    <div className="text-center text-gray-600">
                      <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <p className="font-semibold">Calendar requires JavaScript</p>
                      <p className="text-sm">Please enable JavaScript to view our events calendar</p>
                    </div>
                  </div>
                </noscript>
              </div>
            </div>
              
            {/* Schedule Information */}
            <div className="m-6 bg-gradient-to-r from-blue-700 to-blue-800 rounded-lg p-6 text-white">
              <h4 className="text-2xl font-bold mb-4 flex items-center justify-center">
                <Radio className="h-6 w-6 text-red-400 animate-pulse mr-2" />
                Horarios de Transmisión En Vivo
              </h4>
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-xl font-semibold">Domingos @ 10:00 AM</span>
                </div>
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-xl font-semibold">Jueves @ 7:30 PM</span>
                </div>
              </div>
              
              {/* Live Stream Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="https://www.facebook.com/irenegraciaygloria"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                  style={{ 
                    backgroundColor: '#1877F2',
                    transition: 'background-color 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#166FE5';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#1877F2';
                  }}
                >
                  <Radio className="h-6 w-6 animate-pulse" />
                  <span>Ver En Vivo en Facebook</span>
                </a>
                <a
                  href="https://www.youtube.com/watch?v=Zb4fbOPN2pQ"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  <Radio className="h-6 w-6 animate-pulse" />
                  <span>Ver En Vivo en YouTube</span>
                </a>
              </div>
            </div>
            
            <div className="mx-6 mb-6 text-center">
              <p className="text-gray-600 mb-4">
                Cuando no estemos en vivo, visita nuestra página de Facebook
              </p>
              <a
                href="https://www.facebook.com/irenegraciaygloria"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                style={{ 
                  backgroundColor: '#1877F2',
                  transition: 'background-color 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#166FE5';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#1877F2';
                }}
              >
                <ThumbsUp className="h-6 w-6" />
                <span>Visita Nuestra Página de Facebook</span>
              </a>
            </div>
          </div>
        </div>

        {/* Schedule Information */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center">
              <div className="bg-blue-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-white" />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-center space-x-2">
                  <Clock className="h-5 w-5 text-blue-700" />
                  <span className="text-lg font-semibold text-gray-800">10:00 AM</span>
                </div>
                <p className="text-gray-700">{t('live.mainService')}</p>
                <div className="inline-flex items-center space-x-2 bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
                  <Radio className="h-4 w-4" />
                  <span>{t('live.liveLabel')}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center">
              <div className="bg-amber-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-white" />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-center space-x-2">
                  <Clock className="h-5 w-5 text-amber-600" />
                  <span className="text-lg font-semibold text-gray-800">7:30 PM</span>
                </div>
                <p className="text-gray-700">{t('live.bibleStudy')}</p>
                <p className="text-gray-700">{t('live.prayerPraise')}</p>
                <div className="inline-flex items-center space-x-2 bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
                  <Radio className="h-4 w-4" />
                  <span>{t('live.liveLabel')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 bg-gradient-to-r from-blue-700 to-blue-800 rounded-xl p-8 text-white text-center">
          <h3 className="text-3xl font-bold mb-4 text-white">{t('live.cantAttend')}</h3>
          <p className="text-xl mb-6 text-blue-100">
            {t('live.cantAttendDesc')}
          </p>
          <p className="text-blue-200 mb-4">
            {t('live.scheduleInfo')}
          </p>
          <p className="text-blue-200">
            Experimenta la adoración y la enseñanza desde la comodidad de tu hogar. Pero no dejes de congregarte, es muy importante que te congregues. (Heb. 10:25)
          </p>
        </div>
      </div>
    </section>
  );
};

export default LiveStream;