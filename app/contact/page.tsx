'use client';

import { useState } from 'react';
import { FiMail, FiPhone, FiMapPin, FiClock, FiSend } from 'react-icons/fi';
import ScrollAnimation, { StaggerAnimation } from '@/components/ScrollAnimation';
import { useLanguage } from '@/contexts/LanguageContext';
import { apiFetch } from '@/lib/client-api';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await apiFetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || t('contact.form.errorDefault'));
      }

      setSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      // Auto-hide success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('contact.form.errorDefault'));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#0a0a0f] to-blue-900/20 py-20">
        <div className="container-custom">
          <ScrollAnimation animation="fadeIn" className="text-center">
            <h1 className="text-5xl font-heading font-bold text-white mb-6">{t('contact.title')}</h1>
            <p className="text-xl text-white/60 max-w-3xl mx-auto font-body">
              {t('contact.subtitle')}
            </p>
          </ScrollAnimation>
        </div>
      </section>

      {/* Contact Info & Form */}
      <section className="py-16">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <ScrollAnimation animation="slideRight">
              <div>
                <h2 className="text-3xl font-heading font-bold text-white mb-8">{t('contact.info.title')}</h2>
                <StaggerAnimation animation="fadeIn" stagger={0.1} className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-500 rounded-full p-3">
                      <FiMail className="text-white text-xl" />
                    </div>
                    <div>
                      <h3 className="text-white font-heading font-semibold mb-1">{t('contact.info.email')}</h3>
                      <p className="text-white/60 font-body">support@justcases.com</p>
                      <p className="text-white/60 font-body">info@justcases.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-500 rounded-full p-3">
                      <FiPhone className="text-white text-xl" />
                    </div>
                    <div>
                      <h3 className="text-white font-heading font-semibold mb-1">{t('contact.info.phone')}</h3>
                      <p className="text-white/60 font-body">+359 888 123 456</p>
                      <p className="text-white/60 font-body">+359 888 987 654</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-500 rounded-full p-3">
                      <FiMapPin className="text-white text-xl" />
                    </div>
                    <div>
                      <h3 className="text-white font-heading font-semibold mb-1">{t('contact.info.address')}</h3>
                      <p className="text-white/60 font-body">
                        {t('contact.info.addressLine1')}<br />
                        {t('contact.info.addressLine2')}<br />
                        {t('contact.info.addressLine3')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-500 rounded-full p-3">
                      <FiClock className="text-white text-xl" />
                    </div>
                    <div>
                      <h3 className="text-white font-heading font-semibold mb-1">{t('contact.info.workingHours')}</h3>
                      <p className="text-white/60 font-body">{t('contact.info.weekdays')}</p>
                      <p className="text-white/60 font-body">{t('contact.info.saturday')}</p>
                      <p className="text-white/60 font-body">{t('contact.info.sunday')}</p>
                    </div>
                  </div>
                </StaggerAnimation>

                {/* FAQ Section */}
                <div className="mt-12">
                  <ScrollAnimation animation="fadeIn">
                    <h3 className="text-2xl font-heading font-bold text-white mb-6">{t('contact.faq.title')}</h3>
                  </ScrollAnimation>
                  <StaggerAnimation animation="slideUp" stagger={0.1} className="space-y-4">
                    <div className="bg-white/[0.02] border border-white/10 p-4 rounded-lg">
                      <h4 className="text-white font-heading font-semibold mb-2">{t('contact.faq.q1')}</h4>
                      <p className="text-white/60 text-sm font-body">
                        {t('contact.faq.a1')}
                      </p>
                    </div>
                    <div className="bg-white/[0.02] border border-white/10 p-4 rounded-lg">
                      <h4 className="text-white font-heading font-semibold mb-2">{t('contact.faq.q2')}</h4>
                      <p className="text-white/60 text-sm font-body">
                        {t('contact.faq.a2')}
                      </p>
                    </div>
                    <div className="bg-white/[0.02] border border-white/10 p-4 rounded-lg">
                      <h4 className="text-white font-heading font-semibold mb-2">{t('contact.faq.q3')}</h4>
                      <p className="text-white/60 text-sm font-body">
                        {t('contact.faq.a3')}
                      </p>
                    </div>
                  </StaggerAnimation>
                </div>
              </div>
            </ScrollAnimation>

            {/* Contact Form */}
            <ScrollAnimation animation="slideLeft">
              <div>
                <h2 className="text-3xl font-heading font-bold text-white mb-8">{t('contact.form.title')}</h2>
                
                {/* Success Message */}
                {success && (
                  <div className="mb-6 bg-green-500/10 border border-green-500 text-green-400 px-4 py-3 rounded-lg font-body">
                    {t('contact.form.success')}
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className="mb-6 bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-lg font-body">
                    ✗ {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-white font-heading font-semibold mb-2">
                      {t('contact.form.name')}
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full bg-white/[0.03] text-white px-4 py-3 rounded-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 font-body"
                      placeholder={t('contact.form.namePlaceholder')}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-white font-heading font-semibold mb-2">
                      {t('contact.form.email')}
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full bg-white/[0.03] text-white px-4 py-3 rounded-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 font-body"
                      placeholder={t('contact.form.emailPlaceholder')}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-white font-heading font-semibold mb-2">
                      {t('contact.form.subject')}
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full bg-white/[0.03] text-white px-4 py-3 rounded-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 font-body"
                      placeholder={t('contact.form.subjectPlaceholder')}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-white font-heading font-semibold mb-2">
                      {t('contact.form.message')}
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full bg-white/[0.03] text-white px-4 py-3 rounded-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 resize-none font-body"
                      placeholder={t('contact.form.messagePlaceholder')}
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed font-body"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>{t('contact.form.sending')}</span>
                      </>
                    ) : (
                      <>
                        <FiSend />
                        <span>{t('contact.form.send')}</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="bg-white/[0.02] py-16">
        <div className="container-custom">
          <ScrollAnimation animation="fadeIn">
            <h2 className="text-3xl font-heading font-bold text-white text-center mb-8">{t('contact.map.title')}</h2>
          </ScrollAnimation>
          <ScrollAnimation animation="scaleUp" delay={0.3}>
            <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-8 text-center">
              <div className="text-6xl mb-4">🗺️</div>
              <h3 className="text-2xl font-heading font-bold text-white mb-4">{t('contact.map.visitStore')}</h3>
              <p className="text-white/60 mb-6 font-body">
                {t('contact.map.visitStoreText')}
              </p>
              <div className="bg-white/[0.03] border border-white/10 rounded-lg p-6 max-w-md mx-auto">
                <p className="text-white font-heading font-semibold mb-2">{t('contact.map.flagshipStore')}</p>
                <p className="text-white/60 text-sm font-body">
                  {t('contact.info.addressLine1')}<br />
                  {t('contact.info.addressLine2')}<br />
                  {t('contact.info.addressLine3')}
                </p>
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </section>
    </div>
  );
}
