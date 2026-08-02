import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const Contact = () => {
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();
  const { ref: contentRef, isVisible: contentVisible } = useScrollAnimation();
  const { ref: mapRef, isVisible: mapVisible } = useScrollAnimation();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleFormSubmissionWithFallback();
  };

  const handleFormSubmission = async () => {
    setIsSubmitting(true);
    setSubmitMessage('');
    
    try {
      // Use the deployed Supabase function URL
      const response = await fetch('/api/contact-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      // Fallback to direct Supabase function if the proxy doesn't exist
      if (!response.ok && response.status === 404) {
        const supabaseResponse = await fetch('https://your-project.supabase.co/functions/v1/contact-form', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData)
        });
        
        if (supabaseResponse.ok) {
          setSubmitMessage('¡Gracias por tu mensaje! Nos pondremos en contacto contigo pronto.');
          setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
        } else {
          throw new Error('Failed to send message');
        }
      } else if (response.ok) {
        setSubmitMessage('¡Gracias por tu mensaje! Nos pondremos en contacto contigo pronto.');
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setSubmitMessage('Hubo un error enviando tu mensaje. Por favor envía un email directamente a info@icgg.us o llámanos.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Simple email validation
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isFormValid = () => {
    return formData.name.trim() && 
           formData.email.trim() && 
           isValidEmail(formData.email) &&
           formData.subject.trim() && 
           formData.message.trim();
  };

  // Alternative simple email sending function as fallback
  const sendEmailDirectly = async () => {
    const subject = encodeURIComponent(`Contacto desde ICGG.us: ${formData.subject}`);
    const body = encodeURIComponent(`
Nombre: ${formData.name}
Email: ${formData.email}
${formData.phone ? `Teléfono: ${formData.phone}` : ''}

Mensaje:
${formData.message}
    `);

    const mailtoLink = `mailto:icggmedia@gmail.com?subject=${subject}&body=${body}`;
    window.location.href = mailtoLink;
  };

  const handleFormSubmissionWithFallback = async () => {
    if (!isFormValid()) {
      setSubmitMessage('Por favor completa todos los campos requeridos con información válida.');
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/contact-form`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSubmitMessage('¡Gracias por tu mensaje! Nos pondremos en contacto contigo pronto. Bendiciones!');
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      if (window.confirm('El formulario no pudo ser enviado. ¿Te gustaría abrir tu cliente de email para enviar el mensaje directamente?')) {
        sendEmailDirectly();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const originalHandleFormSubmission = async () => {
    try {
      // For development/testing, we'll simulate the email being sent
      console.log('Contact form submission:', formData);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('¡Gracias por tu mensaje! Nos pondremos en contacto contigo pronto.');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Hubo un error enviando tu mensaje. Por favor intenta de nuevo o contactanos directamente.');
    }
  };

  const oldHandleFormSubmission = async () => {
    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/contact-form`;
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('¡Gracias por tu mensaje! Nos pondremos en contacto contigo pronto.');
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Hubo un error enviando tu mensaje. Por favor intenta de nuevo o contactanos directamente.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section id="contact" className="py-20 bg-gray-50" style={{backgroundColor: '#f9fafb'}}>
      <div className="container mx-auto px-4">
        <div
          ref={headerRef}
          className={`text-center mb-16 transition-all duration-1000 ${
            headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t('contact.title')}
          </h2>
          <div className="w-24 h-1 bg-amber-600 mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('contact.description')}
          </p>
        </div>

        <div ref={contentRef} className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className={`transition-all duration-700 ${
            contentVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
          }`}>
            <h3 className="text-3xl font-bold text-gray-900 mb-8">{t('contact.info')}</h3>

            <div className="space-y-6">
              <div className="flex items-start space-x-4 p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
                <div className="bg-blue-700 p-3 rounded-full">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">{t('contact.address')}</h4>
                  <p className="text-gray-700">2560 S. Elm Ave.</p>
                  <p className="text-gray-700">Sanford, FL 32773</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
                <div className="bg-amber-600 p-3 rounded-full">
                  <Mail className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">{t('contact.email')}</h4>
                  <p className="text-gray-700">info@icgg.us</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
                <div className="bg-purple-600 p-3 rounded-full">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">{t('contact.officeHours')}</h4>
                  <p className="text-gray-700">{t('contact.mondayFriday')}</p>
                  <p className="text-gray-700">{t('contact.saturday')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className={`transition-all duration-700 delay-200 ${
            contentVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
          }`}>
            <h3 className="text-3xl font-bold text-gray-900 mb-8">{t('contact.sendMessage')}</h3>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-shadow duration-300">
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('contact.fullName')} *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder={t('contact.fullNamePlaceholder')}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('contact.email')} *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder={t('contact.emailPlaceholder')}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('contact.phone')}
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="(407) 123-4567"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('contact.subject')} *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="">{t('contact.selectSubject')}</option>
                    <option value="prayer">{t('contact.prayer')}</option>
                    <option value="visit">{t('contact.visit')}</option>
                    <option value="ministry">{t('contact.ministryInfo')}</option>
                    <option value="counseling">{t('contact.counseling')}</option>
                    <option value="other">{t('contact.other')}</option>
                  </select>
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                  {t('contact.message')} *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  placeholder={t('contact.messagePlaceholder')}
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
                    <span>{t('contact.sendButton')}</span>
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
              
              {/* Direct Email Link as Backup */}
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600 mb-2">
                  ¿Prefieres enviarnos un email directamente?
                </p>
                <a
                  href="mailto:icggmedia@gmail.com"
                  className="text-blue-600 hover:text-blue-800 font-medium text-sm underline"
                >
                  icggmedia@gmail.com
                </a>
              </div>
            </form>
          </div>
        </div>

        {/* Map Section */}
        <div
          ref={mapRef}
          className={`mt-16 transition-all duration-1000 ${
            mapVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-br from-blue-700 to-blue-800 p-6">
              <h3 className="text-3xl font-bold text-white text-center">{t('contact.directions')}</h3>
            </div>
            <div className="relative w-full h-96">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.8527436897564!2d-81.30037682404614!3d28.77090637560451!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88e7696c7b9c5555%3A0x7890e1f2a3b4c5d6!2s2560%20S%20Elm%20Ave%2C%20Sanford%2C%20FL%2032773!5e0!3m2!1sen!2sus!4v1710000000000!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0"
              ></iframe>
            </div>
            <div className="bg-gray-50 p-6 text-center">
              <a
                href="https://www.google.com/maps/dir/?api=1&destination=2560+S.+Elm+Ave,+Sanford,+FL+32773"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <MapPin className="h-5 w-5" />
                <span>{t('contact.clickMaps')}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;