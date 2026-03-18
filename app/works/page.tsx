'use client';

import { FiShoppingCart, FiCreditCard, FiTruck, FiPackage, FiCheckCircle } from 'react-icons/fi';
import ScrollAnimation, { StaggerAnimation } from '@/components/ScrollAnimation';
import Head from 'next/head';
import { useLanguage } from '@/contexts/LanguageContext';

export default function WorksPage() {
  const { t } = useLanguage();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": t('works.meta.title'),
    "description": t('works.meta.description'),
    "url": "https://justcases.bg/works",
    "mainEntity": {
      "@type": "Organization",
      "name": "Just Cases",
      "description": t('works.meta.orgDescription'),
      "url": "https://justcases.bg"
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": t('nav.home'),
          "item": "https://justcases.bg"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": t('works.title'),
          "item": "https://justcases.bg/works"
        }
      ]
    }
  };

  return (
    <>
      <Head>
        <title>{t('works.meta.fullTitle')}</title>
        <meta name="description" content={t('works.meta.description')} />
        <meta name="keywords" content={t('works.meta.keywords')} />
        <meta name="author" content="Just Cases" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="bg" />
        <meta name="revisit-after" content="7 days" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://justcases.bg/works" />
        <meta property="og:title" content={t('works.meta.title')} />
        <meta property="og:description" content={t('works.meta.description')} />
        <meta property="og:image" content="https://justcases.bg/og-works.jpg" />
        <meta property="og:site_name" content="Just Cases" />
        <meta property="og:locale" content="bg_BG" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://justcases.bg/works" />
        <meta property="twitter:title" content={t('works.meta.title')} />
        <meta property="twitter:description" content={t('works.meta.description')} />
        <meta property="twitter:image" content="https://justcases.bg/og-works.jpg" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://justcases.bg/works" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>
      
      <div className="min-h-screen bg-[#0a0a0f]">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-[#0a0a0f] to-teal-900/20 py-20">
        <div className="container-custom">
          <ScrollAnimation animation="fadeIn" className="text-center">
            <h1 className="text-5xl font-bold text-white mb-6">{t('works.title')}</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {t('works.subtitle')}
            </p>
          </ScrollAnimation>
        </div>
      </header>

      {/* How It Works Steps */}
      <main className="py-16">
        <div className="container-custom">
          <ScrollAnimation animation="fadeIn">
            <h2 className="text-4xl font-bold text-white text-center mb-12">{t('works.process.title')}</h2>
          </ScrollAnimation>
          <StaggerAnimation animation="scaleUp" stagger={0.2} className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center hover:scale-105 transition-all duration-300 group">
              <div className="bg-accent rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                <FiShoppingCart className="text-white text-2xl" />
              </div>
              <div className="bg-accent text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-4 text-sm font-bold group-hover:scale-125 transition-all duration-300">
                1
              </div>
              <h3 className="text-xl font-bold text-white mb-4 group-hover:text-accent transition-colors duration-300">{t('works.process.step1')}</h3>
              <p className="text-gray-300 group-hover:text-gray-200 transition-colors duration-300">
                {t('works.process.step1Desc')}
              </p>
            </div>

            <div className="text-center hover:scale-105 transition-all duration-300 group">
              <div className="bg-accent rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                <FiCreditCard className="text-white text-2xl" />
              </div>
              <div className="bg-accent text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-4 text-sm font-bold group-hover:scale-125 transition-all duration-300">
                2
              </div>
              <h3 className="text-xl font-bold text-white mb-4 group-hover:text-accent transition-colors duration-300">{t('works.process.step2')}</h3>
              <p className="text-gray-300 group-hover:text-gray-200 transition-colors duration-300">
                {t('works.process.step2Desc')}
              </p>
            </div>

            <div className="text-center hover:scale-105 transition-all duration-300 group">
              <div className="bg-accent rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                <FiTruck className="text-white text-2xl" />
              </div>
              <div className="bg-accent text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-4 text-sm font-bold group-hover:scale-125 transition-all duration-300">
                3
              </div>
              <h3 className="text-xl font-bold text-white mb-4 group-hover:text-accent transition-colors duration-300">{t('works.process.step3')}</h3>
              <p className="text-gray-300 group-hover:text-gray-200 transition-colors duration-300">
                {t('works.process.step3Desc')}
              </p>
            </div>

            <div className="text-center hover:scale-105 transition-all duration-300 group">
              <div className="bg-accent rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                <FiCheckCircle className="text-white text-2xl" />
              </div>
              <div className="bg-accent text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-4 text-sm font-bold group-hover:scale-125 transition-all duration-300">
                4
              </div>
              <h3 className="text-xl font-bold text-white mb-4 group-hover:text-accent transition-colors duration-300">{t('works.process.step4')}</h3>
              <p className="text-gray-300 group-hover:text-gray-200 transition-colors duration-300">
                {t('works.process.step4Desc')}
              </p>
            </div>
          </StaggerAnimation>
        </div>
      </main>

      {/* Features Section */}
      <section className="bg-background-secondary py-16">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <ScrollAnimation animation="slideRight">
              <div>
                <h2 className="text-4xl font-bold text-white mb-6">{t('works.why.title')}</h2>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-accent rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                      <FiPackage className="text-white text-sm" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">{t('works.why.freeDelivery')}</h3>
                      <p className="text-gray-300">
                        {t('works.why.freeDeliveryDesc')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="bg-accent rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                      <FiCheckCircle className="text-white text-sm" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">{t('works.why.guarantee')}</h3>
                      <p className="text-gray-300">
                        {t('works.why.guaranteeDesc')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="bg-accent rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                      <FiTruck className="text-white text-sm" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">{t('works.why.fastProcessing')}</h3>
                      <p className="text-gray-300">
                        {t('works.why.fastProcessingDesc')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollAnimation>
            <ScrollAnimation animation="slideLeft">
              <div className="bg-primary rounded-2xl p-8">
                <div className="text-center">
                  <div className="text-6xl mb-4">📦</div>
                  <h3 className="text-2xl font-bold text-white mb-4">{t('works.tracking.title')}</h3>
                  <p className="text-gray-300 mb-6">
                    {t('works.tracking.subtitle')}
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between bg-gray-800 rounded-lg p-3">
                      <span className="text-white text-sm">{t('works.tracking.received')}</span>
                      <div className="bg-accent rounded-full w-4 h-4"></div>
                    </div>
                    <div className="flex items-center justify-between bg-gray-800 rounded-lg p-3">
                      <span className="text-white text-sm">{t('works.tracking.processing')}</span>
                      <div className="bg-accent rounded-full w-4 h-4"></div>
                    </div>
                    <div className="flex items-center justify-between bg-gray-800 rounded-lg p-3">
                      <span className="text-white text-sm">{t('works.tracking.shipped')}</span>
                      <div className="bg-gray-600 rounded-full w-4 h-4"></div>
                    </div>
                    <div className="flex items-center justify-between bg-gray-800 rounded-lg p-3">
                      <span className="text-white text-sm">{t('works.tracking.delivered')}</span>
                      <div className="bg-gray-600 rounded-full w-4 h-4"></div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      {/* Delivery Options */}
      <section className="py-16">
        <div className="container-custom">
          <ScrollAnimation animation="fadeIn">
            <h2 className="text-4xl font-bold text-white text-center mb-12">{t('works.deliveryOptions')}</h2>
          </ScrollAnimation>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-primary rounded-2xl p-8 text-center hover:scale-105 hover:shadow-2xl hover:shadow-accent/20 transition-all duration-300 group">
              <div className="bg-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <FiTruck className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4 group-hover:text-accent transition-colors duration-300">{t('works.delivery.standard')}</h3>
              <p className="text-gray-300 mb-4 group-hover:text-gray-200 transition-colors duration-300">
                {t('works.delivery.standardTime')}
              </p>
              <div className="text-2xl font-bold text-accent group-hover:scale-110 transition-transform duration-300">{t('works.delivery.free')}</div>
              <p className="text-gray-400 text-sm mt-2">{t('works.delivery.freeAbove')}</p>
            </div>

            <div className="bg-primary rounded-2xl p-8 text-center border-2 border-accent hover:scale-105 hover:shadow-2xl hover:shadow-accent/30 transition-all duration-300 group">
              <div className="bg-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <FiPackage className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4 group-hover:text-accent transition-colors duration-300">{t('works.delivery.express')}</h3>
              <p className="text-gray-300 mb-4 group-hover:text-gray-200 transition-colors duration-300">
                {t('works.delivery.expressTime')}
              </p>
              <div className="text-2xl font-bold text-accent group-hover:scale-110 transition-transform duration-300">{t('works.delivery.expressPrice')}</div>
              <p className="text-gray-400 text-sm mt-2">{t('works.delivery.forAll')}</p>
              <div className="mt-4 bg-accent/20 text-accent px-3 py-1 rounded-full text-sm font-medium group-hover:bg-accent/30 transition-colors duration-300">
                {t('works.delivery.popular')}
              </div>
            </div>

            <div className="bg-primary rounded-2xl p-8 text-center hover:scale-105 hover:shadow-2xl hover:shadow-accent/20 transition-all duration-300 group">
              <div className="bg-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <FiCheckCircle className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4 group-hover:text-accent transition-colors duration-300">{t('works.delivery.sameDay')}</h3>
              <p className="text-gray-300 mb-4 group-hover:text-gray-200 transition-colors duration-300">
                {t('works.delivery.sameDayTime')}
              </p>
              <div className="text-2xl font-bold text-accent group-hover:scale-110 transition-transform duration-300">{t('works.delivery.sameDayPrice')}</div>
              <p className="text-gray-400 text-sm mt-2">{t('works.delivery.sameDayOnly')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Payment Methods */}
      <section className="bg-background-secondary py-16">
        <div className="container-custom">
          <ScrollAnimation animation="fadeIn">
            <h2 className="text-4xl font-bold text-white text-center mb-12">{t('works.paymentMethods')}</h2>
          </ScrollAnimation>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="bg-primary rounded-xl p-6 hover:scale-105 hover:shadow-lg hover:shadow-accent/20 transition-all duration-300 group">
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">💳</div>
              <h3 className="text-white font-bold group-hover:text-accent transition-colors duration-300">{t('works.payment.cards')}</h3>
              <p className="text-gray-300 text-sm group-hover:text-gray-200 transition-colors duration-300">{t('works.payment.cardsType')}</p>
            </div>
            <div className="bg-primary rounded-xl p-6 hover:scale-105 hover:shadow-lg hover:shadow-accent/20 transition-all duration-300 group">
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">📱</div>
              <h3 className="text-white font-bold group-hover:text-accent transition-colors duration-300">{t('works.payment.applePay')}</h3>
              <p className="text-gray-300 text-sm group-hover:text-gray-200 transition-colors duration-300">{t('works.payment.wireless')}</p>
            </div>
            <div className="bg-primary rounded-xl p-6 hover:scale-105 hover:shadow-lg hover:shadow-accent/20 transition-all duration-300 group">
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">🔵</div>
              <h3 className="text-white font-bold group-hover:text-accent transition-colors duration-300">{t('works.payment.googlePay')}</h3>
              <p className="text-gray-300 text-sm group-hover:text-gray-200 transition-colors duration-300">{t('works.payment.wireless')}</p>
            </div>
            <div className="bg-primary rounded-xl p-6 hover:scale-105 hover:shadow-lg hover:shadow-accent/20 transition-all duration-300 group">
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">💰</div>
              <h3 className="text-white font-bold group-hover:text-accent transition-colors duration-300">{t('works.payment.paypal')}</h3>
              <p className="text-gray-300 text-sm group-hover:text-gray-200 transition-colors duration-300">{t('works.payment.secure')}</p>
            </div>
          </div>
        </div>
      </section>
      </div>
    </>
  );
}
