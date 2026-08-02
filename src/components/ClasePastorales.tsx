import React, { useState, useEffect } from 'react';
import { BookOpen, Heart, Users, MessageCircle, X, DollarSign, Smartphone } from 'lucide-react';
import { useSiteImage } from '../hooks/useSiteContent';

const ClasePastorales = () => {
  const pastoraImg = useSiteImage('pastora_photo', '/pastora-irene.jpg');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Check if URL has #registro or #inscripcion hash
    const checkHash = () => {
      const hash = window.location.hash;
      if (hash === '#registro' || hash === '#inscripcion') {
        setIsModalOpen(true);
      }
    };

    // Check on mount
    checkHash();

    // Listen for hash changes
    window.addEventListener('hashchange', checkHash);

    return () => {
      window.removeEventListener('hashchange', checkHash);
    };
  }, []);

  return (
    <section id="clase-pastorales" className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Clase Pastorales ~ Mentoría Pastoral
          </h2>
          <div className="w-24 h-1 bg-amber-600 mx-auto mb-6"></div>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-start mb-16">
            <div className="flex flex-col items-center">
              <div className="w-64 h-64 rounded-full overflow-hidden shadow-2xl mb-6 border-4 border-amber-600">
                <img
                  src={pastoraImg}
                  alt="Pastora - Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">Pastora Irene Familia</h3>
              <p className="text-lg text-amber-600 font-semibold">Iglesia Cristiana Gracia y Gloria</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 border-t-4 border-amber-600">
              <div className="mb-6">
                <Heart className="h-12 w-12 text-amber-600 mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Bendiciones a todos</h3>
              </div>

              <div className="space-y-6 text-gray-700 leading-relaxed">
                <p className="text-lg">
                  Desde lo más profundo de mi corazón como pastora, he sentido el llamado de abrir este espacio de Clases Pastorales ~ Mentoría Pastoral, creado para toda persona que desee acercarse y conocer aquello que muchas veces no se percibe desde afuera: el verdadero corazón pastoral. No es una formación para convertirse en pastor, sino un lugar seguro para comprender cómo piensa, siente y ama un pastor; cómo ora, cómo presenta a su gente delante de Dios y cómo camina junto a otros en tiempos de alegría y también en medio de las pruebas.
                </p>

                <p className="text-lg">
                  Este es un espacio de acompañamiento y crecimiento, donde no existen requisitos especiales, solo un corazón dispuesto a aprender, a madurar espiritualmente y a dejarse edificar por Dios. Aquí caminamos juntos, crecemos juntos y aprendemos a mirar el servicio y la fe con mayor profundidad y sensibilidad.
                </p>
              </div>
            </div>
          </div>

          <div id="que-aprenderas" className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-xl shadow-xl p-8 md:p-12 text-white mb-12">
            <h3 className="text-3xl font-bold mb-6 text-center">¿Qué aprenderás en estas clases?</h3>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="flex items-start space-x-4">
                <div className="bg-white/20 rounded-lg p-3 flex-shrink-0">
                  <BookOpen className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-2">Experiencias Reales</h4>
                  <p className="text-white/90">Compartiremos vivencias auténticas del ministerio pastoral</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-white/20 rounded-lg p-3 flex-shrink-0">
                  <Heart className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-2">Principios Bíblicos</h4>
                  <p className="text-white/90">Fundamentos sólidos basados en la Palabra de Dios</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-white/20 rounded-lg p-3 flex-shrink-0">
                  <MessageCircle className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-2">Dinámicas de Diálogo</h4>
                  <p className="text-white/90">Espacios para reflexión y conversación significativa</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-white/20 rounded-lg p-3 flex-shrink-0">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-2">Enseñanza Práctica</h4>
                  <p className="text-white/90">Herramientas aplicables a la vida cotidiana y el servicio</p>
                </div>
              </div>
            </div>

            <p className="text-lg text-center text-white/95 leading-relaxed">
              En estas clases compartiremos experiencias reales, principios bíblicos, dinámicas de diálogo, tiempos de reflexión y enseñanza práctica que te ayudarán a ver la iglesia, el servicio y el liderazgo con nuevos ojos. Aprenderás a desarrollar empatía, madurez espiritual y una relación más profunda con Dios y con los demás.
            </p>
          </div>

          <div id="invitacion-especial" className="bg-white rounded-xl shadow-lg p-8 md:p-12 border-l-4 border-amber-600">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Una Invitación Especial</h3>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Si deseas crecer en tu fe, fortalecer tu carácter cristiano y entender mejor el llamado pastoral, este espacio es para ti. Te invito con amor a ser parte de esta experiencia que transformará tu manera de servir, amar y caminar en el propósito de Dios.
            </p>

            <div className="text-center mt-8">
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center space-x-2 bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <Heart className="h-5 w-5" />
                <span>Más Información</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-50 overflow-y-auto"
          onClick={() => setIsModalOpen(false)}
        >
          <div className="min-h-screen flex items-center justify-center p-4">
            <div
              className="relative max-w-2xl w-full bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 z-10 bg-gray-100 hover:bg-gray-200 text-gray-600 p-2 rounded-full transition-all duration-200 shadow-lg"
              >
                <X className="h-6 w-6" />
              </button>

              <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-8 py-6 rounded-t-xl">
                <div className="flex items-center space-x-3">
                  <BookOpen className="h-8 w-8" />
                  <div>
                    <h3 className="text-2xl font-bold">Inscripción - Clase Pastorales ~ Mentoría Pastoral</h3>
                    <p className="text-white/90">Información y Registro</p>
                  </div>
                </div>
              </div>

              <div className="p-8">
                <div className="mb-8">
                  <h4 className="text-2xl font-bold text-gray-900 mb-4">Detalles del Curso</h4>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Las Clases Pastorales son un espacio especial de Mentoría Pastoral diseñado para aquellos que desean comprender el corazón pastoral, crecer en su fe y desarrollar una relación más profunda con Dios y los demás.
                  </p>
                </div>

                <div className="bg-amber-50 border-2 border-amber-600 rounded-lg p-6 mb-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-amber-600 p-3 rounded-full">
                      <DollarSign className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h5 className="text-xl font-bold text-gray-900 mb-2">Costo de Inscripción</h5>
                      <p className="text-3xl font-bold text-amber-600 mb-2">$200 por persona</p>
                      <p className="text-gray-700 text-sm">
                        Este costo cubre todos los materiales del curso, acceso a recursos educativos y certificado de participación.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border-2 border-blue-600 rounded-lg p-6 mb-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-600 p-3 rounded-full">
                      <Smartphone className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h5 className="text-xl font-bold text-gray-900 mb-3">Pago por Zelle</h5>
                      <p className="text-gray-700 mb-3">
                        Realiza tu pago de forma rápida y segura usando Zelle:
                      </p>
                      <div className="bg-white rounded-lg p-4 border border-blue-300 mb-4">
                        <p className="text-sm text-gray-600 mb-2">Enviar pago a:</p>
                        <p className="text-2xl font-bold text-blue-600 mb-1">386-216-5619</p>
                        <p className="text-xs text-gray-500">Incluye tu nombre completo en el mensaje y correo electrónico</p>
                      </div>
                      <a
                        href="https://www.zellepay.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg w-full justify-center"
                      >
                        <Smartphone className="h-5 w-5" />
                        <span>Abrir Zelle</span>
                      </a>
                      <p className="text-xs text-gray-600 mt-3 text-center">
                        Si no tienes Zelle, puedes configurarlo a través de tu banco
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <h5 className="text-lg font-bold text-gray-900 mb-3">Instrucciones de Pago</h5>
                  <ol className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <span className="font-bold text-amber-600 mr-2">1.</span>
                      <span>Abre tu aplicación de Zelle en tu banco o aplicación bancaria</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-bold text-amber-600 mr-2">2.</span>
                      <span>Selecciona "Enviar dinero" e ingresa el número: <strong>386-216-5619</strong></span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-bold text-amber-600 mr-2">3.</span>
                      <span>Ingresa el monto de <strong>$200.00</strong></span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-bold text-amber-600 mr-2">4.</span>
                      <span>En el mensaje, incluye tu <strong>nombre completo y correo electrónico</strong> para poder identificar tu pago</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-bold text-amber-600 mr-2">5.</span>
                      <span>Confirma y envía el pago</span>
                    </li>
                  </ol>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-600 text-center">
                    Para más información o ayuda con el proceso de inscripción, contáctanos a través de la sección de contacto o llámanos directamente.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ClasePastorales;
