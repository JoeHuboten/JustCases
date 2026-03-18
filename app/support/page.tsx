'use client';

import { FiMail, FiPhone, FiMessageCircle, FiClock, FiHelpCircle, FiSearch } from 'react-icons/fi';
import ScrollAnimation, { StaggerAnimation } from '@/components/ScrollAnimation';
import Head from 'next/head';
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function SupportPage() {
  const [selectedCategory, setSelectedCategory] = useState('general');
  const { t } = useLanguage();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Клиентска поддръжка Just Cases - Помощ и ЧЗВ",
    "description": "Получете бърза и професионална помощ от нашия екип за поддръжка. Имейл, телефон и онлайн чат поддръжка. ЧЗВ за всички въпроси.",
    "url": "https://justcases.bg/support",
    "mainEntity": {
      "@type": "Organization",
      "name": "Just Cases",
      "description": "Премиум мобилни аксесоари за всички устройства",
      "url": "https://justcases.bg",
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+359888123456",
        "contactType": "customer service",
        "email": "support@justcases.bg",
        "availableLanguage": "Bulgarian"
      }
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Начало",
          "item": "https://justcases.bg"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Поддръжка",
          "item": "https://justcases.bg/support"
        }
      ]
    }
  };

  const faqData = {
    general: [
      { question: t('support.faq.q1'), answer: t('support.faq.a1') },
      { question: t('support.faq.q2'), answer: t('support.faq.a2') },
      { question: t('support.faq.q3'), answer: t('support.faq.a3') },
    ],
    delivery: [
      { question: t('support.faq.q4'), answer: t('support.faq.a4') },
      { question: t('support.faq.q5'), answer: t('support.faq.a5') },
      { question: t('support.faq.q6'), answer: t('support.faq.a6') },
    ],
    returns: [
      { question: t('support.faq.q7'), answer: t('support.faq.a7') },
      { question: t('support.faq.q8'), answer: t('support.faq.a8') },
      { question: t('support.faq.q9'), answer: t('support.faq.a9') },
    ]
  };

  return (
    <>
      <Head>
        <title>Клиентска поддръжка Just Cases - Помощ и ЧЗВ | 24/7 поддръжка</title>
        <meta name="description" content="Получете бърза и професионална помощ от нашия екип за поддръжка. Имейл, телефон и онлайн чат поддръжка. ЧЗВ за всички въпроси относно мобилни аксесоари." />
        <meta name="keywords" content="клиентска поддръжка, помощ, ЧЗВ, Just Cases, мобилни аксесоари, техподдръжка, контакт, въпроси" />
        <meta name="author" content="Just Cases" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="bg" />
        <meta name="revisit-after" content="7 days" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://justcases.bg/support" />
        <meta property="og:title" content="Клиентска поддръжка Just Cases - Помощ и ЧЗВ" />
        <meta property="og:description" content="Получете бърза и професионална помощ от нашия екип за поддръжка. Имейл, телефон и онлайн чат поддръжка. ЧЗВ за всички въпроси." />
        <meta property="og:image" content="https://justcases.bg/og-support.jpg" />
        <meta property="og:site_name" content="Just Cases" />
        <meta property="og:locale" content="bg_BG" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://justcases.bg/support" />
        <meta property="twitter:title" content="Клиентска поддръжка Just Cases - Помощ и ЧЗВ" />
        <meta property="twitter:description" content="Получете бърза и професионална помощ от нашия екип за поддръжка. Имейл, телефон и онлайн чат поддръжка. ЧЗВ за всички въпроси." />
        <meta property="twitter:image" content="https://justcases.bg/og-support.jpg" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://justcases.bg/support" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>
      
      <div className="min-h-screen bg-[#0a0a0f]">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#0a0a0f] to-teal-900/20 py-20">
        <div className="container-custom">
          <ScrollAnimation animation="fadeIn" className="text-center">
            <h1 className="text-5xl font-bold text-white mb-6">{t('support.title')}</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {t('support.subtitle')}
            </p>
          </ScrollAnimation>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16">
        <div className="container-custom">
          <ScrollAnimation animation="fadeIn">
            <h2 className="text-4xl font-bold text-white text-center mb-12">{t('support.contactTitle')}</h2>
          </ScrollAnimation>
          <StaggerAnimation animation="scaleUp" stagger={0.2} className="grid md:grid-cols-3 gap-8">
            <div className="bg-primary rounded-2xl p-8 text-center hover:scale-105 hover:shadow-2xl hover:shadow-accent/20 transition-all duration-300 group">
              <div className="bg-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <FiMail className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4 group-hover:text-accent transition-colors duration-300">{t('support.emailSupport')}</h3>
              <p className="text-gray-300 mb-4 group-hover:text-gray-200 transition-colors duration-300">
                {t('support.emailDesc')}
              </p>
              <a 
                href="mailto:support@justcases.bg"
                className="text-accent hover:text-accent-light transition-colors font-medium hover:scale-105 inline-block"
              >
                support@justcases.bg
              </a>
            </div>

            <div className="bg-primary rounded-2xl p-8 text-center hover:scale-105 hover:shadow-2xl hover:shadow-accent/20 transition-all duration-300 group">
              <div className="bg-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <FiPhone className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4 group-hover:text-accent transition-colors duration-300">{t('support.phoneSupport')}</h3>
              <p className="text-gray-300 mb-4 group-hover:text-gray-200 transition-colors duration-300">
                {t('support.phoneDesc')}
              </p>
              <a 
                href="tel:+359888123456"
                className="text-accent hover:text-accent-light transition-colors font-medium hover:scale-105 inline-block"
              >
                +359 888 123 456
              </a>
            </div>

            <div className="bg-primary rounded-2xl p-8 text-center hover:scale-105 hover:shadow-2xl hover:shadow-accent/20 transition-all duration-300 group">
              <div className="bg-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <FiMessageCircle className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4 group-hover:text-accent transition-colors duration-300">{t('support.emailSupport')}</h3>
              <p className="text-gray-300 mb-4 group-hover:text-gray-200 transition-colors duration-300">
                {t('support.emailSupportDesc')}
              </p>
              <a 
                href="mailto:support@justcases.bg"
                className="inline-block bg-accent text-white px-6 py-2 rounded-lg hover:bg-accent-light hover:scale-105 hover:shadow-lg hover:shadow-accent/30 transition-all duration-300 font-medium transform active:scale-95"
              >
                {t('support.sendEmail')}
              </a>
            </div>
          </StaggerAnimation>
        </div>
      </section>

      {/* Working Hours */}
      <section className="bg-background-secondary py-16">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <ScrollAnimation animation="slideRight">
              <div>
                <h2 className="text-4xl font-bold text-white mb-6">{t('support.workingHours')}</h2>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <FiClock className="text-accent text-xl" />
                    <div>
                      <h3 className="text-white font-bold">{t('support.weekdays')}</h3>
                      <p className="text-gray-300">{t('support.weekdaysHours')}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <FiClock className="text-accent text-xl" />
                    <div>
                      <h3 className="text-white font-bold">{t('support.saturday')}</h3>
                      <p className="text-gray-300">{t('support.saturdayHours')}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <FiClock className="text-accent text-xl" />
                    <div>
                      <h3 className="text-white font-bold">{t('support.sunday')}</h3>
                      <p className="text-gray-300">{t('support.sundayClosed')}</p>
                    </div>
                  </div>
                </div>
                <p className="text-gray-300 mt-6">
                  {t('support.urgentNote')}
                </p>
              </div>
            </ScrollAnimation>
            <ScrollAnimation animation="slideLeft">
              <div className="bg-primary rounded-2xl p-8">
                <div className="text-center">
                  <div className="text-6xl mb-4">⏰</div>
                  <h3 className="text-2xl font-bold text-white mb-4">{t('support.quickSupport')}</h3>
                  <p className="text-gray-300 mb-6">
                    {t('support.quickSupportDesc')}
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-accent">{t('support.avgResponseTime')}</div>
                      <div className="text-sm text-gray-300">{t('support.avgResponse')}</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-accent">{t('support.happyCustomersPercent')}</div>
                      <div className="text-sm text-gray-300">{t('support.happyCustomers')}</div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container-custom">
          <ScrollAnimation animation="fadeIn">
            <h2 className="text-4xl font-bold text-white text-center mb-12">{t('support.faq.title')}</h2>
          </ScrollAnimation>
          
          {/* FAQ Categories */}
          <div className="flex flex-wrap justify-center gap-3 mb-8 p-2 rounded-2xl bg-white/[0.02] border border-white/10 max-w-fit mx-auto">
            <button
              onClick={() => setSelectedCategory('general')}
              aria-pressed={selectedCategory === 'general'}
              className={`px-6 py-3 rounded-xl font-medium border transition-all duration-300 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400/60 ${
                selectedCategory === 'general'
                  ? 'bg-gradient-to-r from-teal-500/80 to-cyan-500/80 text-white border-teal-400/60 shadow-lg shadow-teal-500/30'
                  : 'bg-white/[0.04] text-white/80 border-white/20 hover:bg-white/[0.08] hover:text-white hover:border-teal-400/40'
              }`}
            >
              {t('support.faq.general')}
            </button>
            <button
              onClick={() => setSelectedCategory('delivery')}
              aria-pressed={selectedCategory === 'delivery'}
              className={`px-6 py-3 rounded-xl font-medium border transition-all duration-300 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400/60 ${
                selectedCategory === 'delivery'
                  ? 'bg-gradient-to-r from-teal-500/80 to-cyan-500/80 text-white border-teal-400/60 shadow-lg shadow-teal-500/30'
                  : 'bg-white/[0.04] text-white/80 border-white/20 hover:bg-white/[0.08] hover:text-white hover:border-teal-400/40'
              }`}
            >
              {t('support.faq.delivery')}
            </button>
            <button
              onClick={() => setSelectedCategory('returns')}
              aria-pressed={selectedCategory === 'returns'}
              className={`px-6 py-3 rounded-xl font-medium border transition-all duration-300 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400/60 ${
                selectedCategory === 'returns'
                  ? 'bg-gradient-to-r from-teal-500/80 to-cyan-500/80 text-white border-teal-400/60 shadow-lg shadow-teal-500/30'
                  : 'bg-white/[0.04] text-white/80 border-white/20 hover:bg-white/[0.08] hover:text-white hover:border-teal-400/40'
              }`}
            >
              {t('support.faq.returns')}
            </button>
          </div>

          {/* FAQ Items */}
          <div className="space-y-4">
            {faqData[selectedCategory as keyof typeof faqData].map((item, index) => (
              <div key={index} className="bg-primary rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-3">{item.question}</h3>
                <p className="text-gray-300">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="bg-background-secondary py-16">
        <div className="container-custom">
          <ScrollAnimation animation="fadeIn">
            <h2 className="text-4xl font-bold text-white text-center mb-12">{t('support.form.title')}</h2>
          </ScrollAnimation>
          <div className="max-w-2xl mx-auto">
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white font-medium mb-2">{t('support.form.name')}</label>
                  <input
                    type="text"
                    className="w-full bg-primary border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent"
                    placeholder={t('support.form.namePlaceholder')}
                  />
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">{t('support.form.email')}</label>
                  <input
                    type="email"
                    className="w-full bg-primary border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent"
                    placeholder={t('support.form.emailPlaceholder')}
                  />
                </div>
              </div>
              <div>
                <label className="block text-white font-medium mb-2">{t('support.form.subject')}</label>
                <select className="w-full bg-primary border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent">
                  <option>{t('support.form.subjectGeneral')}</option>
                  <option>{t('support.form.subjectOrder')}</option>
                  <option>{t('support.form.subjectReturn')}</option>
                  <option>{t('support.form.subjectTech')}</option>
                  <option>{t('support.form.subjectOther')}</option>
                </select>
              </div>
              <div>
                <label className="block text-white font-medium mb-2">{t('support.form.message')}</label>
                <textarea
                  rows={6}
                  className="w-full bg-primary border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent"
                  placeholder={t('support.form.messagePlaceholder')}
                ></textarea>
              </div>
                  <button
                    type="submit"
                    className="w-full bg-accent text-white py-4 rounded-lg hover:bg-accent-light hover:scale-105 hover:shadow-lg hover:shadow-accent/30 transition-all duration-300 font-medium transform active:scale-95"
                  >
                    {t('support.form.send')}
                  </button>
            </form>
          </div>
        </div>
      </section>
      </div>
    </>
  );
}
