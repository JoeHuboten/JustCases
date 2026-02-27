'use client';

import { FiShoppingCart, FiCreditCard, FiTruck, FiPackage, FiCheckCircle } from 'react-icons/fi';
import ScrollAnimation, { StaggerAnimation } from '@/components/ScrollAnimation';
import Head from 'next/head';

export default function WorksPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Как работи Just Cases - Процес на поръчка и доставка",
    "description": "Научете как лесно и бързо можете да намерите и поръчате идеалните мобилни аксесоари за вашето устройство. 4-стъпков процес на поръчка.",
    "url": "https://justcases.bg/works",
    "mainEntity": {
      "@type": "Organization",
      "name": "Just Cases",
      "description": "Премиум мобилни аксесоари за всички устройства",
      "url": "https://justcases.bg"
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
          "name": "Как работи",
          "item": "https://justcases.bg/works"
        }
      ]
    }
  };

  return (
    <>
      <Head>
        <title>Как работи Just Cases - Процес на поръчка и доставка | 4 лесни стъпки</title>
        <meta name="description" content="Научете как лесно и бързо можете да намерите и поръчате идеалните мобилни аксесоари за вашето устройство. 4-стъпков процес: изберете продукт, платете безопасно, получите бърза доставка, насладете се." />
        <meta name="keywords" content="как да поръчам, процес на поръчка, доставка, плащане, мобилни аксесоари, Just Cases, онлайн пазаруване, безопасно плащане" />
        <meta name="author" content="Just Cases" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="bg" />
        <meta name="revisit-after" content="7 days" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://justcases.bg/works" />
        <meta property="og:title" content="Как работи Just Cases - Процес на поръчка и доставка" />
        <meta property="og:description" content="Научете как лесно и бързо можете да намерите и поръчате идеалните мобилни аксесоари за вашето устройство. 4-стъпков процес на поръчка." />
        <meta property="og:image" content="https://justcases.bg/og-works.jpg" />
        <meta property="og:site_name" content="Just Cases" />
        <meta property="og:locale" content="bg_BG" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://justcases.bg/works" />
        <meta property="twitter:title" content="Как работи Just Cases - Процес на поръчка и доставка" />
        <meta property="twitter:description" content="Научете как лесно и бързо можете да намерите и поръчате идеалните мобилни аксесоари за вашето устройство. 4-стъпков процес на поръчка." />
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
      <header className="bg-gradient-to-r from-[#0a0a0f] to-blue-900/20 py-20">
        <div className="container-custom">
          <ScrollAnimation animation="fadeIn" className="text-center">
            <h1 className="text-5xl font-bold text-white mb-6">Как работи Just Cases</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Открийте как лесно и бързо можете да намерите и поръчате идеалните мобилни аксесоари за вашето устройство.
            </p>
          </ScrollAnimation>
        </div>
      </header>

      {/* How It Works Steps */}
      <main className="py-16">
        <div className="container-custom">
          <ScrollAnimation animation="fadeIn">
            <h2 className="text-4xl font-bold text-white text-center mb-12">Процес на поръчка</h2>
          </ScrollAnimation>
          <StaggerAnimation animation="scaleUp" stagger={0.2} className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center hover:scale-105 transition-all duration-300 group">
              <div className="bg-accent rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                <FiShoppingCart className="text-white text-2xl" />
              </div>
              <div className="bg-accent text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-4 text-sm font-bold group-hover:scale-125 transition-all duration-300">
                1
              </div>
              <h3 className="text-xl font-bold text-white mb-4 group-hover:text-accent transition-colors duration-300">Изберете продукт</h3>
              <p className="text-gray-300 group-hover:text-gray-200 transition-colors duration-300">
                Разгледайте нашата колекция и намерете идеалния аксесоар за вашето устройство. 
                Използвайте филтрите за бързо намиране на това, което търсите.
              </p>
            </div>

            <div className="text-center hover:scale-105 transition-all duration-300 group">
              <div className="bg-accent rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                <FiCreditCard className="text-white text-2xl" />
              </div>
              <div className="bg-accent text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-4 text-sm font-bold group-hover:scale-125 transition-all duration-300">
                2
              </div>
              <h3 className="text-xl font-bold text-white mb-4 group-hover:text-accent transition-colors duration-300">Безопасно плащане</h3>
              <p className="text-gray-300 group-hover:text-gray-200 transition-colors duration-300">
                Добавете продуктите в количката и платете безопасно с вашата кредитна карта, 
                PayPal или други поддържани методи за плащане.
              </p>
            </div>

            <div className="text-center hover:scale-105 transition-all duration-300 group">
              <div className="bg-accent rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                <FiTruck className="text-white text-2xl" />
              </div>
              <div className="bg-accent text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-4 text-sm font-bold group-hover:scale-125 transition-all duration-300">
                3
              </div>
              <h3 className="text-xl font-bold text-white mb-4 group-hover:text-accent transition-colors duration-300">Бърза доставка</h3>
              <p className="text-gray-300 group-hover:text-gray-200 transition-colors duration-300">
                Обработваме поръчката ви в рамките на 24 часа и я изпращаме с надежден куриер. 
                Получавате проследяване в реално време.
              </p>
            </div>

            <div className="text-center hover:scale-105 transition-all duration-300 group">
              <div className="bg-accent rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                <FiCheckCircle className="text-white text-2xl" />
              </div>
              <div className="bg-accent text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-4 text-sm font-bold group-hover:scale-125 transition-all duration-300">
                4
              </div>
              <h3 className="text-xl font-bold text-white mb-4 group-hover:text-accent transition-colors duration-300">Насладете се</h3>
              <p className="text-gray-300 group-hover:text-gray-200 transition-colors duration-300">
                Получете вашите нови аксесоари и се насладете на подобреното изживяване с вашето устройство. 
                Ако не сте доволни, имаме 30-дневна гаранция за връщане.
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
                <h2 className="text-4xl font-bold text-white mb-6">Защо да изберете нас?</h2>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-accent rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                      <FiPackage className="text-white text-sm" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">Безплатна доставка</h3>
                      <p className="text-gray-300">
                        Безплатна доставка за всички поръчки над 50 €. в България.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="bg-accent rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                      <FiCheckCircle className="text-white text-sm" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">30-дневна гаранция</h3>
                      <p className="text-gray-300">
                        Ако не сте доволни от покупката си, можете да върнете продукта в рамките на 30 дни.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="bg-accent rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                      <FiTruck className="text-white text-sm" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">Бърза обработка</h3>
                      <p className="text-gray-300">
                        Обработваме поръчките в рамките на 24 часа и ги изпращаме веднага.
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
                  <h3 className="text-2xl font-bold text-white mb-4">Следещо на поръчки</h3>
                  <p className="text-gray-300 mb-6">
                    Получавайте актуализации в реално време за статуса на вашата поръчка.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between bg-gray-800 rounded-lg p-3">
                      <span className="text-white text-sm">Поръчка получена</span>
                      <div className="bg-accent rounded-full w-4 h-4"></div>
                    </div>
                    <div className="flex items-center justify-between bg-gray-800 rounded-lg p-3">
                      <span className="text-white text-sm">В обработка</span>
                      <div className="bg-accent rounded-full w-4 h-4"></div>
                    </div>
                    <div className="flex items-center justify-between bg-gray-800 rounded-lg p-3">
                      <span className="text-white text-sm">Изпратена</span>
                      <div className="bg-gray-600 rounded-full w-4 h-4"></div>
                    </div>
                    <div className="flex items-center justify-between bg-gray-800 rounded-lg p-3">
                      <span className="text-white text-sm">Доставена</span>
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
            <h2 className="text-4xl font-bold text-white text-center mb-12">Опции за доставка</h2>
          </ScrollAnimation>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-primary rounded-2xl p-8 text-center hover:scale-105 hover:shadow-2xl hover:shadow-accent/20 transition-all duration-300 group">
              <div className="bg-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <FiTruck className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4 group-hover:text-accent transition-colors duration-300">Стандартна доставка</h3>
              <p className="text-gray-300 mb-4 group-hover:text-gray-200 transition-colors duration-300">
                3-5 работни дни
              </p>
              <div className="text-2xl font-bold text-accent group-hover:scale-110 transition-transform duration-300">Безплатно</div>
              <p className="text-gray-400 text-sm mt-2">за поръчки над 50 €.</p>
            </div>

            <div className="bg-primary rounded-2xl p-8 text-center border-2 border-accent hover:scale-105 hover:shadow-2xl hover:shadow-accent/30 transition-all duration-300 group">
              <div className="bg-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <FiPackage className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4 group-hover:text-accent transition-colors duration-300">Експресна доставка</h3>
              <p className="text-gray-300 mb-4 group-hover:text-gray-200 transition-colors duration-300">
                1-2 работни дни
              </p>
              <div className="text-2xl font-bold text-accent group-hover:scale-110 transition-transform duration-300">8.90 €.</div>
              <p className="text-gray-400 text-sm mt-2">за всички поръчки</p>
              <div className="mt-4 bg-accent/20 text-accent px-3 py-1 rounded-full text-sm font-medium group-hover:bg-accent/30 transition-colors duration-300">
                Най-популярно
              </div>
            </div>

            <div className="bg-primary rounded-2xl p-8 text-center hover:scale-105 hover:shadow-2xl hover:shadow-accent/20 transition-all duration-300 group">
              <div className="bg-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <FiCheckCircle className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4 group-hover:text-accent transition-colors duration-300">Доставка в деня</h3>
              <p className="text-gray-300 mb-4 group-hover:text-gray-200 transition-colors duration-300">
                В същия ден (София)
              </p>
              <div className="text-2xl font-bold text-accent group-hover:scale-110 transition-transform duration-300">15.90 €.</div>
              <p className="text-gray-400 text-sm mt-2">само за София</p>
            </div>
          </div>
        </div>
      </section>

      {/* Payment Methods */}
      <section className="bg-background-secondary py-16">
        <div className="container-custom">
          <ScrollAnimation animation="fadeIn">
            <h2 className="text-4xl font-bold text-white text-center mb-12">Методи за плащане</h2>
          </ScrollAnimation>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="bg-primary rounded-xl p-6 hover:scale-105 hover:shadow-lg hover:shadow-accent/20 transition-all duration-300 group">
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">💳</div>
              <h3 className="text-white font-bold group-hover:text-accent transition-colors duration-300">Кредитни карти</h3>
              <p className="text-gray-300 text-sm group-hover:text-gray-200 transition-colors duration-300">Visa, Mastercard</p>
            </div>
            <div className="bg-primary rounded-xl p-6 hover:scale-105 hover:shadow-lg hover:shadow-accent/20 transition-all duration-300 group">
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">📱</div>
              <h3 className="text-white font-bold group-hover:text-accent transition-colors duration-300">Apple Pay</h3>
              <p className="text-gray-300 text-sm group-hover:text-gray-200 transition-colors duration-300">Безжично плащане</p>
            </div>
            <div className="bg-primary rounded-xl p-6 hover:scale-105 hover:shadow-lg hover:shadow-accent/20 transition-all duration-300 group">
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">🔵</div>
              <h3 className="text-white font-bold group-hover:text-accent transition-colors duration-300">Google Pay</h3>
              <p className="text-gray-300 text-sm group-hover:text-gray-200 transition-colors duration-300">Безжично плащане</p>
            </div>
            <div className="bg-primary rounded-xl p-6 hover:scale-105 hover:shadow-lg hover:shadow-accent/20 transition-all duration-300 group">
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">💰</div>
              <h3 className="text-white font-bold group-hover:text-accent transition-colors duration-300">PayPal</h3>
              <p className="text-gray-300 text-sm group-hover:text-gray-200 transition-colors duration-300">Безопасно плащане</p>
            </div>
          </div>
        </div>
      </section>
      </div>
    </>
  );
}
