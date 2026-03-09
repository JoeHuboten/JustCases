'use client';

import { FiShield, FiZap, FiSmartphone, FiHeadphones, FiBattery, FiWifi } from 'react-icons/fi';
import ScrollAnimation, { StaggerAnimation } from '@/components/ScrollAnimation';
import Head from 'next/head';
import { useLanguage } from '@/contexts/LanguageContext';

export default function FeaturesPage() {
  const { t } = useLanguage();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Функции на Just Cases - Премиум мобилни аксесоари",
    "description": "Открийте защо нашите премиум мобилни аксесоари са изборът на хиляди клиенти. Максимална защита, бързо зареждане, универсална съвместимост и много повече.",
    "url": "https://justcases.bg/features",
    "mainEntity": {
      "@type": "Organization",
      "name": "Just Cases",
      "description": "Премиум мобилни аксесоари за всички устройства",
      "url": "https://justcases.bg",
      "logo": "https://justcases.bg/logo.png",
      "sameAs": [
        "https://facebook.com/justcases",
        "https://instagram.com/justcases",
        "https://twitter.com/justcases"
      ]
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
          "name": "Функции",
          "item": "https://justcases.bg/features"
        }
      ]
    }
  };

  return (
    <>
      <Head>
        <title>Функции на Just Cases - Премиум мобилни аксесоари | Максимална защита и бързо зареждане</title>
        <meta name="description" content="Открийте защо нашите премиум мобилни аксесоари са изборът на хиляди клиенти. Максимална защита, бързо зареждане, универсална съвместимост, премиум звук, дълготрайна батерия и безжична технология." />
        <meta name="keywords" content="мобилни аксесоари, защитни калъфи, безжично зареждане, слушалки, power bank, iPhone аксесоари, Samsung аксесоари, премиум качество, Just Cases" />
        <meta name="author" content="Just Cases" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="bg" />
        <meta name="revisit-after" content="7 days" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://justcases.bg/features" />
        <meta property="og:title" content="Функции на Just Cases - Премиум мобилни аксесоари" />
        <meta property="og:description" content="Открийте защо нашите премиум мобилни аксесоари са изборът на хиляди клиенти. Максимална защита, бързо зареждане, универсална съвместимост и много повече." />
        <meta property="og:image" content="https://justcases.bg/og-features.jpg" />
        <meta property="og:site_name" content="Just Cases" />
        <meta property="og:locale" content="bg_BG" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://justcases.bg/features" />
        <meta property="twitter:title" content="Функции на Just Cases - Премиум мобилни аксесоари" />
        <meta property="twitter:description" content="Открийте защо нашите премиум мобилни аксесоари са изборът на хиляди клиенти. Максимална защита, бързо зареждане, универсална съвместимост и много повече." />
        <meta property="twitter:image" content="https://justcases.bg/og-features.jpg" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://justcases.bg/features" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>
      
      <div className="min-h-screen bg-[#0a0a0f]">
      {/* Hero Section */}
      <header className="relative py-24 overflow-hidden">
        {/* Background effects */}
        <div className="absolute top-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl opacity-30 animate-pulse" />
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl opacity-20" />
        <div className="container-custom relative">
          <ScrollAnimation animation="fadeIn" className="text-center">
            <span className="text-eyebrow">{t('features.eyebrow')}</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 heading-display heading-glow">{t('features.title')}</h1>
            <p className="text-lead max-w-3xl mx-auto">
              {t('features.subtitle')}
            </p>
          </ScrollAnimation>
        </div>
      </header>

      {/* Section Divider */}
      <div className="container-custom">
        <div className="divider-glow" />
      </div>

      {/* Main Features */}
      <main className="py-20">
        <div className="container-custom">
          <ScrollAnimation animation="fadeIn">
            <div className="text-center mb-14">
              <span className="text-eyebrow">{t('features.coreTitle')}</span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 heading-display">{t('features.coreTitle')}</h2>
            </div>
          </ScrollAnimation>
          <StaggerAnimation animation="scaleUp" stagger={0.15} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card-interactive p-8 text-center group">
              <div className="bg-gradient-to-br from-accent to-accent-dark rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg shadow-accent/30">
                <FiShield className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-accent transition-colors duration-300">{t('features.core.protection')}</h3>
              <p className="text-slate-400 group-hover:text-slate-300 transition-colors duration-300">
                {t('features.core.protectionDesc')}
              </p>
            </div>

            <div className="card-interactive p-8 text-center group">
              <div className="bg-gradient-to-br from-accent to-accent-dark rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg shadow-accent/30">
                <FiZap className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-accent transition-colors duration-300">{t('features.core.charging')}</h3>
              <p className="text-slate-400 group-hover:text-slate-300 transition-colors duration-300">
                {t('features.core.chargingDesc')}
              </p>
            </div>

            <div className="card-interactive p-8 text-center group">
              <div className="bg-gradient-to-br from-accent to-accent-dark rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg shadow-accent/30">
                <FiSmartphone className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-accent transition-colors duration-300">{t('features.core.compatibility')}</h3>
              <p className="text-slate-400 group-hover:text-slate-300 transition-colors duration-300">
                {t('features.core.compatibilityDesc')}
              </p>
            </div>

            <div className="card-interactive p-8 text-center group">
              <div className="bg-gradient-to-br from-accent to-accent-dark rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg shadow-accent/30">
                <FiHeadphones className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-accent transition-colors duration-300">{t('features.core.sound')}</h3>
              <p className="text-slate-400 group-hover:text-slate-300 transition-colors duration-300">
                {t('features.core.soundDesc')}
              </p>
            </div>

            <div className="card-interactive p-8 text-center group">
              <div className="bg-gradient-to-br from-accent to-accent-dark rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg shadow-accent/30">
                <FiBattery className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-accent transition-colors duration-300">{t('features.core.battery')}</h3>
              <p className="text-slate-400 group-hover:text-slate-300 transition-colors duration-300">
                {t('features.core.batteryDesc')}
              </p>
            </div>

            <div className="card-interactive p-8 text-center group">
              <div className="bg-gradient-to-br from-accent to-accent-dark rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg shadow-accent/30">
                <FiWifi className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-accent transition-colors duration-300">{t('features.core.wireless')}</h3>
              <p className="text-slate-400 group-hover:text-slate-300 transition-colors duration-300">
                {t('features.core.wirelessDesc')}
              </p>
            </div>
          </StaggerAnimation>
        </div>
      </main>

      {/* Section Divider */}
      <div className="container-custom">
        <div className="divider-gradient" />
      </div>

      {/* Technology Section */}
      <section className="relative py-20 section-fade-top">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent pointer-events-none" />
        <div className="container-custom relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <ScrollAnimation animation="slideRight">
              <div>
                <span className="text-eyebrow">Иновации</span>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 heading-display">{t('features.techTitle')}</h2>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-accent rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white text-sm font-bold">1</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">{t('features.tech.magsafe')}</h3>
                      <p className="text-gray-300">
                        {t('features.tech.magsafeDesc')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="bg-accent rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white text-sm font-bold">2</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">{t('features.tech.activeDef')}</h3>
                      <p className="text-gray-300">
                        {t('features.tech.activeDefDesc')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="bg-accent rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white text-sm font-bold">3</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">{t('features.tech.eco')}</h3>
                      <p className="text-gray-300">
                        {t('features.tech.ecoDesc')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollAnimation>
            <ScrollAnimation animation="slideLeft">
              <div className="card-interactive p-8">
                <div className="text-center">
                  <div className="text-6xl mb-4 filter drop-shadow-2xl">🔬</div>
                  <h3 className="text-2xl font-bold text-white mb-4">{t('features.tech.labTesting')}</h3>
                  <p className="text-slate-400 mb-6">
                    Всеки продукт преминава през строги тестове за издръжливост, безопасност и производителност.
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-accent/10 rounded-xl p-4 border border-accent/20">
                      <div className="text-2xl font-bold text-accent">1000+</div>
                      <div className="text-sm text-slate-400">{t('features.tech.testCycles')}</div>
                    </div>
                    <div className="bg-accent/10 rounded-xl p-4 border border-accent/20">
                      <div className="text-2xl font-bold text-accent">24/7</div>
                      <div className="text-sm text-slate-400">{t('features.tech.monitoring')}</div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="container-custom">
        <div className="divider-gradient" />
      </div>

      {/* Quality Standards */}
      <section className="py-20">
        <div className="container-custom">
          <ScrollAnimation animation="fadeIn">
            <div className="text-center mb-14">
              <span className="text-eyebrow">Сертификации</span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 heading-display">{t('features.quality')}</h2>
            </div>
          </ScrollAnimation>
          <StaggerAnimation animation="fadeIn" stagger={0.1} className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="card-interactive p-6 text-center group">
              <div className="bg-gradient-to-br from-accent to-accent-dark rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-accent/30">
                <span className="text-white text-2xl font-bold">CE</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{t('features.quality.ce')}</h3>
              <p className="text-slate-400 text-sm">
                {t('features.quality.ceDesc')}
              </p>
            </div>
            <div className="card-interactive p-6 text-center group">
              <div className="bg-gradient-to-br from-accent to-accent-dark rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-accent/30">
                <span className="text-white text-2xl font-bold">FCC</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{t('features.quality.fcc')}</h3>
              <p className="text-slate-400 text-sm">
                {t('features.quality.fccDesc')}
              </p>
            </div>
            <div className="card-interactive p-6 text-center group">
              <div className="bg-gradient-to-br from-accent to-accent-dark rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-accent/30">
                <span className="text-white text-2xl font-bold">IP</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{t('features.quality.ip68')}</h3>
              <p className="text-slate-400 text-sm">
                {t('features.quality.ip68Desc')}
              </p>
            </div>
            <div className="card-interactive p-6 text-center group">
              <div className="bg-gradient-to-br from-accent to-accent-dark rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-accent/30">
                <span className="text-white text-2xl font-bold">ISO</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{t('features.quality.iso')}</h3>
              <p className="text-slate-400 text-sm">
                {t('features.quality.isoDesc')}
              </p>
            </div>
          </StaggerAnimation>
        </div>
      </section>
      </div>
    </>
  );
}
