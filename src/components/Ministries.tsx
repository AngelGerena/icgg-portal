import React, { useState } from 'react';
import { Users, Baby, Music, HandHeart, GraduationCap, Home, Heart, Crown, UserCheck, Flower, Smartphone, Globe, MessageSquare, ChevronDown, ChevronRight, X, Send, Church } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useSiteImage } from '../hooks/useSiteContent';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const Ministries = () => {
  const { t } = useLanguage();
  const pastoraImg = useSiteImage('pastora_photo', '/pastora-irene.jpg');
  const [openMinistries, setOpenMinistries] = useState<number[]>([]);
  const [isChurchFormOpen, setIsChurchFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [formData, setFormData] = useState({
    churchName: '',
    pastorName: '',
    address: '',
    phone: '',
    email: '',
    message: ''
  });

  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();
  const { ref: cardsRef, isVisible: cardsVisible } = useScrollAnimation();
  const { ref: pastorRef, isVisible: pastorVisible } = useScrollAnimation();

  const toggleMinistry = (index: number) => {
    setOpenMinistries(prev => 
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isFormValid = () => {
    return formData.churchName.trim() && 
           formData.pastorName.trim() && 
           formData.address.trim() &&
           formData.phone.trim() &&
           formData.email.trim() && 
           isValidEmail(formData.email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid()) {
      setSubmitMessage('Por favor completa todos los campos requeridos con información válida.');
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage('');
    
    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSubmitMessage('¡Gracias por tu interés! Nos pondremos en contacto contigo pronto para discutir la cobertura ministerial.');
      setFormData({ churchName: '', pastorName: '', address: '', phone: '', email: '', message: '' });
      
      // Close modal after 3 seconds
      setTimeout(() => {
        setIsChurchFormOpen(false);
        setSubmitMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error sending form:', error);
      setSubmitMessage('Hubo un error enviando el formulario. Por favor intenta de nuevo o contactanos directamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const ministries = [
    {
      icon: Users,
      titleKey: 'ministries.adults',
      descriptionKey: 'ministries.adultsDesc',
      color: 'bg-blue-600'
    },
    {
      icon: Baby,
      titleKey: 'ministries.children',
      descriptionKey: 'ministries.childrenDesc',
      color: 'bg-green-600'
    },
    {
      icon: Music,
      titleKey: 'ministries.worship',
      descriptionKey: 'ministries.worshipDesc',
      color: 'bg-purple-600'
    },
    {
      icon: HandHeart,
      titleKey: 'ministries.compassion',
      descriptionKey: 'ministries.compassionDesc',
      color: 'bg-red-600'
    },
    {
      icon: GraduationCap,
      titleKey: 'ministries.youth',
      descriptionKey: 'ministries.youthDesc',
      color: 'bg-orange-600'
    },
    {
      icon: Home,
      titleKey: 'ministries.family',
      descriptionKey: 'ministries.familyDesc',
      color: 'bg-teal-600'
    },
    {
      icon: Heart,
      titleKey: 'ministries.singles',
      descriptionKey: 'ministries.singlesDesc',
      color: 'bg-pink-600'
    },
    {
      icon: Crown,
      titleKey: 'ministries.marriage',
      descriptionKey: 'ministries.marriageDesc',
      color: 'bg-indigo-600'
    },
    {
      icon: UserCheck,
      titleKey: 'ministries.men',
      descriptionKey: 'ministries.menDesc',
      color: 'bg-gray-600'
    },
    {
      icon: Flower,
      titleKey: 'ministries.women',
      descriptionKey: 'ministries.womenDesc',
      color: 'bg-rose-600'
    },
    {
      icon: Globe,
      titleKey: 'ministries.missions',
      descriptionKey: 'ministries.missionsDesc',
      color: 'bg-emerald-600'
    },
    {
      icon: MessageSquare,
      titleKey: 'ministries.evangelism',
      descriptionKey: 'ministries.evangelismDesc',
      color: 'bg-yellow-600'
    },
    {
      icon: Smartphone,
      titleKey: 'ministries.media',
      descriptionKey: 'ministries.mediaDesc',
      color: 'bg-cyan-600'
    }
  ];

  return (
    <section id="ministries" className="py-20 bg-gray-50" style={{backgroundColor: '#f9fafb'}}>
      <div className="container mx-auto px-4">
        <div
          ref={headerRef}
          className={`text-center mb-16 transition-all duration-1000 ${
            headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t('ministries.title')}
          </h2>
          <div className="w-24 h-1 bg-amber-600 mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('ministries.description')}
          </p>
        </div>

        {/* Side-by-Side Accordion Layout */}
        <div
          ref={cardsRef}
          className={`max-w-7xl mx-auto mb-16 transition-all duration-1000 ${
            cardsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          {/* Expand All / Collapse All Buttons */}
          <div className="flex justify-center space-x-4 mb-6">
            <button
              onClick={() => setOpenMinistries(ministries.map((_, index) => index))}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
            >
              Expandir Todos
            </button>
            <button
              onClick={() => setOpenMinistries([])}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
            >
              Colapsar Todos
            </button>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {ministries.slice(0, Math.ceil(ministries.length / 2)).map((ministry, index) => {
                const IconComponent = ministry.icon;
                const isOpen = openMinistries.includes(index);
                
                return (
                  <div key={index} className="border-b border-gray-200 last:border-b-0">
                    {/* Accordion Header */}
                    <button
                      onClick={() => toggleMinistry(index)}
                      className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:bg-gray-50"
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`${ministry.color} p-2 rounded-full`}>
                          <IconComponent className="h-5 w-5 text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 text-left">
                          {t(ministry.titleKey)}
                        </h3>
                      </div>
                      <div className="flex-shrink-0">
                        {isOpen ? (
                          <ChevronDown className="h-4 w-4 text-gray-500 transition-transform duration-200" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-gray-500 transition-transform duration-200" />
                        )}
                      </div>
                    </button>
                    
                    {/* Accordion Content */}
                    <div 
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <div className="px-6 pb-4">
                        <div className="pl-10">
                          <p className="text-gray-700 leading-relaxed text-sm">
                            {t(ministry.descriptionKey)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Right Column */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {ministries.slice(Math.ceil(ministries.length / 2)).map((ministry, index) => {
                const IconComponent = ministry.icon;
                const actualIndex = index + Math.ceil(ministries.length / 2);
                const isOpen = openMinistries.includes(actualIndex);
                
                return (
                  <div key={actualIndex} className="border-b border-gray-200 last:border-b-0">
                    {/* Accordion Header */}
                    <button
                      onClick={() => toggleMinistry(actualIndex)}
                      className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:bg-gray-50"
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`${ministry.color} p-2 rounded-full`}>
                          <IconComponent className="h-5 w-5 text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 text-left">
                          {t(ministry.titleKey)}
                        </h3>
                      </div>
                      <div className="flex-shrink-0">
                        {isOpen ? (
                          <ChevronDown className="h-4 w-4 text-gray-500 transition-transform duration-200" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-gray-500 transition-transform duration-200" />
                        )}
                      </div>
                    </button>
                    
                    {/* Accordion Content */}
                    <div 
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <div className="px-6 pb-4">
                        <div className="pl-10">
                          <p className="text-gray-700 leading-relaxed text-sm">
                            {t(ministry.descriptionKey)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Pastor Section */}
        <div
          ref={pastorRef}
          className={`transition-all duration-1000 ${
            pastorVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto transform transition-all duration-500 hover:shadow-2xl">
            <h3 className="text-3xl font-bold text-gray-900 mb-6 text-left">{t('ministries.pastor')}</h3>
            <div className="grid md:grid-cols-3 gap-8 items-center">
              <div className="md:col-span-1">
                <img
                  src={pastoraImg}
                  alt="Pastora Irene Familia"
                  className="w-48 h-48 rounded-full mx-auto object-cover object-top shadow-lg border-4 border-amber-600"
                  style={{ objectPosition: '50% 20%' }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const fallback = target.nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
                {/* Fallback for broken images */}
                <div className="w-48 h-48 rounded-full mx-auto bg-gray-200 hidden items-center justify-center shadow-lg">
                  <div className="text-center text-gray-500">
                    <div className="w-16 h-16 bg-gray-400 rounded-full mx-auto mb-2"></div>
                    <p className="text-sm">Pastora Irene</p>
                  </div>
                </div>
              </div>
              <div className="md:col-span-2 text-left">
                <h4 className="text-2xl font-bold text-gray-900 mb-2">Pastora Irene Familia</h4>
                <p className="text-lg text-blue-700 mb-4">{t('ministries.pastorTitle')}</p>
                <p className="text-gray-700 leading-relaxed">
                  {t('ministries.pastorDesc')}
                </p>
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-3 mb-3">
                    <img 
                      src="https://www.dropbox.com/scl/fi/nznseuulz7qa8x5obsd8s/RC-LOGO?rlkey=m3g581avitwzwt2fqicn74k78&st=52ks85v2&raw=1"
                      alt="Reacción en Cadena Ministries Logo"
                      className="w-8 h-8 object-contain"
                    />
                    <h5 className="text-lg font-bold text-gray-900">Reacción en Cadena Ministries</h5>
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    La Pastora Irene Familia lidera Reacción en Cadena Ministries, el concilio bajo el cual opera nuestra iglesia. 
                    Este ministerio de cobertura pastoral cuenta actualmente con 25 iglesias bajo su liderazgo espiritual, 
                    proporcionando dirección, mentoría y apoyo ministerial a pastores y congregaciones comprometidos con 
                    la expansión del Reino de Dios. Reacción en Cadena Ministries se dedica a formar líderes íntegros, 
                    establecer iglesias saludables y promover la unidad en el Cuerpo de Cristo.
                  </p>
                  <button
                    onClick={() => setIsChurchFormOpen(true)}
                    className="inline-flex items-center space-x-2 bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    <Church className="h-5 w-5" />
                    <span>Solicitar Cobertura Ministerial</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Church Application Modal */}
      {isChurchFormOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 overflow-y-auto"
          onClick={() => setIsChurchFormOpen(false)}
        >
          <div className="min-h-screen flex items-center justify-center p-4">
            <div 
              className="relative max-w-2xl w-full bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setIsChurchFormOpen(false)}
                className="absolute top-4 right-4 z-10 bg-gray-100 hover:bg-gray-200 text-gray-600 p-2 rounded-full transition-all duration-200 shadow-lg"
              >
                <X className="h-6 w-6" />
              </button>
              
              {/* Modal Header */}
              <div className="bg-blue-700 text-white px-8 py-6 rounded-t-xl">
                <div className="flex items-center space-x-3">
                  <Church className="h-8 w-8" />
                  <div>
                    <h3 className="text-2xl font-bold">Solicitud de Cobertura Ministerial</h3>
                    <p className="text-blue-200">Reacción en Cadena Ministries</p>
                  </div>
                </div>
              </div>
              
              {/* Modal Content */}
              <div className="p-8">
                <p className="text-gray-700 mb-6 leading-relaxed">
                  Si su iglesia está interesada en formar parte de Reacción en Cadena Ministries y recibir 
                  cobertura pastoral, por favor complete el siguiente formulario. Nos pondremos en contacto 
                  con usted para discutir los próximos pasos.
                </p>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="churchName" className="block text-sm font-semibold text-gray-700 mb-2">
                        Nombre de su Iglesia *
                      </label>
                      <input
                        type="text"
                        id="churchName"
                        name="churchName"
                        value={formData.churchName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Nombre completo de la iglesia"
                      />
                    </div>
                    <div>
                      <label htmlFor="pastorName" className="block text-sm font-semibold text-gray-700 mb-2">
                        Nombre y Apellido del Pastor *
                      </label>
                      <input
                        type="text"
                        id="pastorName"
                        name="pastorName"
                        value={formData.pastorName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Nombre completo del pastor principal"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-2">
                      Dirección *
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Dirección completa de la iglesia"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                        Número de Teléfono *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="(000) 000-0000"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                        Correo Electrónico *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="pastor@iglesia.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                      Mensaje (Opcional)
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                      placeholder="Comparta cualquier información adicional sobre su iglesia, visión ministerial, o preguntas que tenga sobre la cobertura pastoral..."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || !isFormValid()}
                    className={`w-full px-6 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 shadow-lg ${
                      isSubmitting || !isFormValid() 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-orange-600 hover:bg-orange-700 text-white'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Enviando...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5" />
                        <span>Enviar Solicitud</span>
                      </>
                    )}
                  </button>
                  
                  {/* Success/Error Message */}
                  {submitMessage && (
                    <div className={`mt-4 p-4 rounded-lg ${
                      submitMessage.includes('Gracias') 
                        ? 'bg-green-100 text-green-800 border border-green-200' 
                        : 'bg-red-100 text-red-800 border border-red-200'
                    }`}>
                      <p className="text-sm">{submitMessage}</p>
                    </div>
                  )}
                </form>
                
                {/* Contact Information */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-600 text-center">
                    Para más información, puede contactarnos directamente a{' '}
                    <a href="mailto:info@encadena.org" className="text-blue-600 hover:text-blue-800 font-medium underline">
                      info@encadena.org
                    </a>
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

export default Ministries;
