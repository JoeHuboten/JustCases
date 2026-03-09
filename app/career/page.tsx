'use client';

import { FiUsers, FiTarget, FiAward, FiHeart, FiMapPin, FiClock, FiDollarSign } from 'react-icons/fi';
import ScrollAnimation, { StaggerAnimation } from '@/components/ScrollAnimation';
import Head from 'next/head';
import { useLanguage } from '@/contexts/LanguageContext';

export default function CareerPage() {
  const { t } = useLanguage();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Кариера в Just Cases - Работни места и възможности",
    "description": "Присъединете се към екипа на Just Cases! Открийте отворени позиции, предимства и възможности за професионално развитие в иновативната компания за мобилни аксесоари.",
    "url": "https://justcases.bg/career",
    "mainEntity": {
      "@type": "Organization",
      "name": "Just Cases",
      "description": "Премиум мобилни аксесоари за всички устройства",
      "url": "https://justcases.bg",
      "hiringOrganization": {
        "@type": "Organization",
        "name": "Just Cases"
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
          "name": "Кариера",
          "item": "https://justcases.bg/career"
        }
      ]
    }
  };

  return (
    <>
      <Head>
        <title>Кариера в Just Cases - Работни места и възможности | Присъединете се към екипа</title>
        <meta name="description" content="Присъединете се към екипа на Just Cases! Открийте отворени позиции, предимства и възможности за професионално развитие в иновативната компания за мобилни аксесоари." />
        <meta name="keywords" content="кариера, работни места, Just Cases, работа, позиции, развитие, екип, мобилни аксесоари, технология, иновации" />
        <meta name="author" content="Just Cases" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="bg" />
        <meta name="revisit-after" content="7 days" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://justcases.bg/career" />
        <meta property="og:title" content="Кариера в Just Cases - Работни места и възможности" />
        <meta property="og:description" content="Присъединете се към екипа на Just Cases! Открийте отворени позиции, предимства и възможности за професионално развитие в иновативната компания за мобилни аксесоари." />
        <meta property="og:image" content="https://justcases.bg/og-career.jpg" />
        <meta property="og:site_name" content="Just Cases" />
        <meta property="og:locale" content="bg_BG" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://justcases.bg/career" />
        <meta property="twitter:title" content="Кариера в Just Cases - Работни места и възможности" />
        <meta property="twitter:description" content="Присъединете се към екипа на Just Cases! Открийте отворени позиции, предимства и възможности за професионално развитие в иновативната компания за мобилни аксесоари." />
        <meta property="twitter:image" content="https://justcases.bg/og-career.jpg" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://justcases.bg/career" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>
      
      <div className="min-h-screen bg-[#0a0a0f]">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#0a0a0f] to-blue-900/20 py-20">
        <div className="container-custom">
          <ScrollAnimation animation="fadeIn" className="text-center">
            <h1 className="text-5xl font-bold text-white mb-6">{t('career.title')}</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {t('career.subtitle')}
            </p>
          </ScrollAnimation>
        </div>
      </section>

      {/* Why Work With Us */}
      <section className="py-16">
        <div className="container-custom">
          <ScrollAnimation animation="fadeIn">
            <h2 className="text-4xl font-bold text-white text-center mb-12">{t('career.whyWork')}</h2>
          </ScrollAnimation>
          <StaggerAnimation animation="scaleUp" stagger={0.2} className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center hover:scale-105 transition-all duration-300 group">
              <div className="bg-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <FiUsers className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-accent transition-colors duration-300">{t('career.benefit.team')}</h3>
              <p className="text-gray-300 group-hover:text-gray-200 transition-colors duration-300">
                {t('career.benefit.teamDesc')}
              </p>
            </div>
            <div className="text-center hover:scale-105 transition-all duration-300 group">
              <div className="bg-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <FiTarget className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-accent transition-colors duration-300">{t('career.benefit.growth')}</h3>
              <p className="text-gray-300 group-hover:text-gray-200 transition-colors duration-300">
                {t('career.benefit.growthDesc')}
              </p>
            </div>
            <div className="text-center hover:scale-105 transition-all duration-300 group">
              <div className="bg-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <FiAward className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-accent transition-colors duration-300">{t('career.benefit.salary')}</h3>
              <p className="text-gray-300 group-hover:text-gray-200 transition-colors duration-300">
                {t('career.benefit.salaryDesc')}
              </p>
            </div>
            <div className="text-center hover:scale-105 transition-all duration-300 group">
              <div className="bg-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <FiHeart className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-accent transition-colors duration-300">{t('career.benefit.balance')}</h3>
              <p className="text-gray-300 group-hover:text-gray-200 transition-colors duration-300">
                {t('career.benefit.balanceDesc')}
              </p>
            </div>
          </StaggerAnimation>
        </div>
      </section>

      {/* Open Positions */}
      <section className="bg-background-secondary py-16">
        <div className="container-custom">
          <ScrollAnimation animation="fadeIn">
            <h2 className="text-4xl font-bold text-white text-center mb-12">{t('career.openPositions')}</h2>
          </ScrollAnimation>
          <div className="space-y-6">
            <div className="bg-primary rounded-2xl p-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">{t('career.position.frontend')}</h3>
                  <div className="flex flex-wrap gap-4 text-gray-300 mb-4">
                    <div className="flex items-center gap-2">
                      <FiMapPin size={16} />
                      <span>{t('career.position.location')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiClock size={16} />
                      <span>{t('career.position.type')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiDollarSign size={16} />
                      <span>{t('career.position.frontendSalary')}</span>
                    </div>
                  </div>
                  <p className="text-gray-300">
                    {t('career.position.frontendDesc')}
                  </p>
                </div>
                <button className="bg-accent text-white px-6 py-3 rounded-lg hover:bg-accent-light hover:scale-105 hover:shadow-lg hover:shadow-accent/30 transition-all duration-300 font-medium transform active:scale-95">
                  {t('career.position.apply')}
                </button>
              </div>
            </div>

            <div className="bg-primary rounded-2xl p-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">{t('career.position.uiux')}</h3>
                  <div className="flex flex-wrap gap-4 text-gray-300 mb-4">
                    <div className="flex items-center gap-2">
                      <FiMapPin size={16} />
                      <span>{t('career.position.location')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiClock size={16} />
                      <span>{t('career.position.type')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiDollarSign size={16} />
                      <span>{t('career.position.uiuxSalary')}</span>
                    </div>
                  </div>
                  <p className="text-gray-300">
                    {t('career.position.uiuxDesc')}
                  </p>
                </div>
                <button className="bg-accent text-white px-6 py-3 rounded-lg hover:bg-accent-light hover:scale-105 hover:shadow-lg hover:shadow-accent/30 transition-all duration-300 font-medium transform active:scale-95">
                  {t('career.position.apply')}
                </button>
              </div>
            </div>

            <div className="bg-primary rounded-2xl p-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">{t('career.position.marketing')}</h3>
                  <div className="flex flex-wrap gap-4 text-gray-300 mb-4">
                    <div className="flex items-center gap-2">
                      <FiMapPin size={16} />
                      <span>{t('career.position.location')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiClock size={16} />
                      <span>{t('career.position.type')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiDollarSign size={16} />
                      <span>{t('career.position.marketingSalary')}</span>
                    </div>
                  </div>
                  <p className="text-gray-300">
                    {t('career.position.marketingDesc')}
                  </p>
                </div>
                <button className="bg-accent text-white px-6 py-3 rounded-lg hover:bg-accent-light hover:scale-105 hover:shadow-lg hover:shadow-accent/30 transition-all duration-300 font-medium transform active:scale-95">
                  {t('career.position.apply')}
                </button>
              </div>
            </div>

            <div className="bg-primary rounded-2xl p-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">{t('career.position.support')}</h3>
                  <div className="flex flex-wrap gap-4 text-gray-300 mb-4">
                    <div className="flex items-center gap-2">
                      <FiMapPin size={16} />
                      <span>{t('career.position.location')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiClock size={16} />
                      <span>{t('career.position.type')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiDollarSign size={16} />
                      <span>{t('career.position.supportSalary')}</span>
                    </div>
                  </div>
                  <p className="text-gray-300">
                    {t('career.position.supportDesc')}
                  </p>
                </div>
                <button className="bg-accent text-white px-6 py-3 rounded-lg hover:bg-accent-light hover:scale-105 hover:shadow-lg hover:shadow-accent/30 transition-all duration-300 font-medium transform active:scale-95">
                  {t('career.position.apply')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <ScrollAnimation animation="slideRight">
              <div>
                <h2 className="text-4xl font-bold text-white mb-6">{t('career.perks.title')}</h2>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-accent rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white text-sm font-bold">✓</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">{t('career.perk.flexTime')}</h3>
                      <p className="text-gray-300">
                        {t('career.perk.flexTimeDesc')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="bg-accent rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white text-sm font-bold">✓</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">{t('career.perk.health')}</h3>
                      <p className="text-gray-300">
                        {t('career.perk.healthDesc')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="bg-accent rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white text-sm font-bold">✓</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">{t('career.perk.training')}</h3>
                      <p className="text-gray-300">
                        {t('career.perk.trainingDesc')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="bg-accent rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white text-sm font-bold">✓</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">{t('career.perk.vacation')}</h3>
                      <p className="text-gray-300">
                        {t('career.perk.vacationDesc')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollAnimation>
            <ScrollAnimation animation="slideLeft">
              <div className="bg-primary rounded-2xl p-8">
                <div className="text-center">
                  <div className="text-6xl mb-4">🏢</div>
                  <h3 className="text-2xl font-bold text-white mb-4">{t('career.perk.office')}</h3>
                  <p className="text-gray-300 mb-6">
                    {t('career.perk.officeDesc')}
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-accent">24/7</div>
                      <div className="text-sm text-gray-300">{t('career.perk.officeAccess')}</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-accent">100%</div>
                      <div className="text-sm text-gray-300">{t('career.perk.internet')}</div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      {/* Application Process */}
      <section className="bg-background-secondary py-16">
        <div className="container-custom">
          <ScrollAnimation animation="fadeIn">
            <h2 className="text-4xl font-bold text-white text-center mb-12">{t('career.process.title')}</h2>
          </ScrollAnimation>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl font-bold">1</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{t('career.process.step1')}</h3>
              <p className="text-gray-300 text-sm">
                {t('career.process.step1Desc')}
              </p>
            </div>
            <div className="text-center">
              <div className="bg-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl font-bold">2</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{t('career.process.step2')}</h3>
              <p className="text-gray-300 text-sm">
                {t('career.process.step2Desc')}
              </p>
            </div>
            <div className="text-center">
              <div className="bg-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl font-bold">3</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{t('career.process.step3')}</h3>
              <p className="text-gray-300 text-sm">
                {t('career.process.step3Desc')}
              </p>
            </div>
            <div className="text-center">
              <div className="bg-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl font-bold">4</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{t('career.process.step4')}</h3>
              <p className="text-gray-300 text-sm">
                {t('career.process.step4Desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16">
        <div className="container-custom text-center">
          <ScrollAnimation animation="fadeIn">
            <h2 className="text-4xl font-bold text-white mb-6">{t('career.ready')}</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              {t('career.readyDesc')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="mailto:careers@justcases.bg"
                className="bg-accent text-white px-8 py-4 rounded-lg hover:bg-accent-light hover:scale-105 hover:shadow-lg hover:shadow-accent/30 transition-all duration-300 font-medium transform active:scale-95"
              >
                {t('career.sendCV')}
              </a>
              <a 
                href="mailto:info@justcases.bg"
                className="bg-primary text-white px-8 py-4 rounded-lg hover:bg-primary-light hover:scale-105 hover:shadow-lg transition-all duration-300 font-medium border border-gray-600 transform active:scale-95"
              >
                {t('career.contactUs')}
              </a>
            </div>
          </ScrollAnimation>
        </div>
      </section>
      </div>
    </>
  );
}
