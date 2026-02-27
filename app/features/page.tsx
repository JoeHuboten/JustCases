'use client';

import { FiShield, FiZap, FiSmartphone, FiHeadphones, FiBattery, FiWifi } from 'react-icons/fi';
import ScrollAnimation, { StaggerAnimation } from '@/components/ScrollAnimation';
import Head from 'next/head';

export default function FeaturesPage() {
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
            <span className="text-eyebrow">Защо Just Cases</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 heading-display heading-glow">Функции на Just Cases</h1>
            <p className="text-lead max-w-3xl mx-auto">
              Открийте защо нашите премиум мобилни аксесоари са изборът на хиляди клиенти по целия свят.
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
              <span className="text-eyebrow">Основни</span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 heading-display">Основни функции</h2>
            </div>
          </ScrollAnimation>
          <StaggerAnimation animation="scaleUp" stagger={0.15} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card-interactive p-8 text-center group">
              <div className="bg-gradient-to-br from-accent to-accent-dark rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg shadow-accent/30">
                <FiShield className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-accent transition-colors duration-300">Максимална защита</h3>
              <p className="text-slate-400 group-hover:text-slate-300 transition-colors duration-300">
                Нашите калъфи и защитни стъкла осигуряват военен стандарт защита срещу падания, 
                драскотини и ежедневно износване, като същевременно запазват елегантния дизайн.
              </p>
            </div>

            <div className="card-interactive p-8 text-center group">
              <div className="bg-gradient-to-br from-accent to-accent-dark rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg shadow-accent/30">
                <FiZap className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-accent transition-colors duration-300">Бързо зареждане</h3>
              <p className="text-slate-400 group-hover:text-slate-300 transition-colors duration-300">
                Безжичните заряди и power bank-овете ни поддържат най-новите стандарти за бързо зареждане, 
                включително Qi, MagSafe и USB-C Power Delivery.
              </p>
            </div>

            <div className="card-interactive p-8 text-center group">
              <div className="bg-gradient-to-br from-accent to-accent-dark rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg shadow-accent/30">
                <FiSmartphone className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-accent transition-colors duration-300">Универсална съвместимост</h3>
              <p className="text-slate-400 group-hover:text-slate-300 transition-colors duration-300">
                Поддържаме всички основни марки и модели устройства - iPhone, Samsung, Google Pixel, 
                OnePlus и много други, с точни размери и перфектно прилягане.
              </p>
            </div>

            <div className="card-interactive p-8 text-center group">
              <div className="bg-gradient-to-br from-accent to-accent-dark rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg shadow-accent/30">
                <FiHeadphones className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-accent transition-colors duration-300">Премиум звук</h3>
              <p className="text-slate-400 group-hover:text-slate-300 transition-colors duration-300">
                Нашите слушалки и безжични зарядни станции осигуряват кристално чист звук и 
                безпроблемно зареждане с най-високо качество на звука.
              </p>
            </div>

            <div className="card-interactive p-8 text-center group">
              <div className="bg-gradient-to-br from-accent to-accent-dark rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg shadow-accent/30">
                <FiBattery className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-accent transition-colors duration-300">Дълготрайна батерия</h3>
              <p className="text-slate-400 group-hover:text-slate-300 transition-colors duration-300">
                Power bank-овете ни имат висококачествени литиево-йонни батерии с дълъг живот, 
                интелигентни защитни схеми и LED индикатори за нивото на заряд.
              </p>
            </div>

            <div className="card-interactive p-8 text-center group">
              <div className="bg-gradient-to-br from-accent to-accent-dark rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg shadow-accent/30">
                <FiWifi className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-accent transition-colors duration-300">Безжична технология</h3>
              <p className="text-slate-400 group-hover:text-slate-300 transition-colors duration-300">
                Всички наши безжични продукти използват най-новите Bluetooth и Qi стандарти за 
                стабилна връзка и ефективно зареждане без кабели.
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
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 heading-display">Най-новите технологии</h2>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-accent rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white text-sm font-bold">1</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">Магнитен MagSafe дизайн</h3>
                      <p className="text-gray-300">
                        Перфектно прилягане с магнитни прикрепки за стабилно зареждане и аксесоари.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="bg-accent rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white text-sm font-bold">2</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">Активна защита</h3>
                      <p className="text-gray-300">
                        Интелигентни сензори и защитни материали, които се адаптират към различни условия.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="bg-accent rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white text-sm font-bold">3</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">Екологично производство</h3>
                      <p className="text-gray-300">
                        Използваме рециклирани материали и екологично чисти процеси в производството.
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
                  <h3 className="text-2xl font-bold text-white mb-4">Лабораторно тестване</h3>
                  <p className="text-slate-400 mb-6">
                    Всеки продукт преминава през строги тестове за издръжливост, безопасност и производителност.
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-accent/10 rounded-xl p-4 border border-accent/20">
                      <div className="text-2xl font-bold text-accent">1000+</div>
                      <div className="text-sm text-slate-400">Тестови цикли</div>
                    </div>
                    <div className="bg-accent/10 rounded-xl p-4 border border-accent/20">
                      <div className="text-2xl font-bold text-accent">24/7</div>
                      <div className="text-sm text-slate-400">Мониторинг</div>
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
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 heading-display">Стандарти за качество</h2>
            </div>
          </ScrollAnimation>
          <StaggerAnimation animation="fadeIn" stagger={0.1} className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="card-interactive p-6 text-center group">
              <div className="bg-gradient-to-br from-accent to-accent-dark rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-accent/30">
                <span className="text-white text-2xl font-bold">CE</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">CE сертификация</h3>
              <p className="text-slate-400 text-sm">
                Съответствие с европейските стандарти за безопасност
              </p>
            </div>
            <div className="card-interactive p-6 text-center group">
              <div className="bg-gradient-to-br from-accent to-accent-dark rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-accent/30">
                <span className="text-white text-2xl font-bold">FCC</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">FCC одобрение</h3>
              <p className="text-slate-400 text-sm">
                Съответствие с американските стандарти за радиовълни
              </p>
            </div>
            <div className="card-interactive p-6 text-center group">
              <div className="bg-gradient-to-br from-accent to-accent-dark rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-accent/30">
                <span className="text-white text-2xl font-bold">IP</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">IP68 защита</h3>
              <p className="text-slate-400 text-sm">
                Пълна защита срещу прах и вода
              </p>
            </div>
            <div className="card-interactive p-6 text-center group">
              <div className="bg-gradient-to-br from-accent to-accent-dark rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-accent/30">
                <span className="text-white text-2xl font-bold">ISO</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">ISO 9001</h3>
              <p className="text-slate-400 text-sm">
                Международен стандарт за управление на качеството
              </p>
            </div>
          </StaggerAnimation>
        </div>
      </section>
      </div>
    </>
  );
}
