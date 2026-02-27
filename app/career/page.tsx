'use client';

import { FiUsers, FiTarget, FiAward, FiHeart, FiMapPin, FiClock, FiDollarSign } from 'react-icons/fi';
import ScrollAnimation, { StaggerAnimation } from '@/components/ScrollAnimation';
import Head from 'next/head';

export default function CareerPage() {
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
            <h1 className="text-5xl font-bold text-white mb-6">Кариера в Just Cases</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Присъединете се към нашия екип и помогнете ни да революционизираме света на мобилните аксесоари.
            </p>
          </ScrollAnimation>
        </div>
      </section>

      {/* Why Work With Us */}
      <section className="py-16">
        <div className="container-custom">
          <ScrollAnimation animation="fadeIn">
            <h2 className="text-4xl font-bold text-white text-center mb-12">Защо да работите с нас?</h2>
          </ScrollAnimation>
          <StaggerAnimation animation="scaleUp" stagger={0.2} className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center hover:scale-105 transition-all duration-300 group">
              <div className="bg-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <FiUsers className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-accent transition-colors duration-300">Отличен екип</h3>
              <p className="text-gray-300 group-hover:text-gray-200 transition-colors duration-300">
                Работим с талантливи и мотивирани хора, които споделят нашата страст към иновациите.
              </p>
            </div>
            <div className="text-center hover:scale-105 transition-all duration-300 group">
              <div className="bg-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <FiTarget className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-accent transition-colors duration-300">Възможности за растеж</h3>
              <p className="text-gray-300 group-hover:text-gray-200 transition-colors duration-300">
                Предлагаме възможности за професионално развитие и кариерно израстване.
              </p>
            </div>
            <div className="text-center hover:scale-105 transition-all duration-300 group">
              <div className="bg-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <FiAward className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-accent transition-colors duration-300">Конкурентни заплати</h3>
              <p className="text-gray-300 group-hover:text-gray-200 transition-colors duration-300">
                Предлагаме конкурентни заплати и бонуси, базирани на постиженията.
              </p>
            </div>
            <div className="text-center hover:scale-105 transition-all duration-300 group">
              <div className="bg-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <FiHeart className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-accent transition-colors duration-300">Work-life баланс</h3>
              <p className="text-gray-300 group-hover:text-gray-200 transition-colors duration-300">
                Вярваме в здравословен баланс между работа и личен живот.
              </p>
            </div>
          </StaggerAnimation>
        </div>
      </section>

      {/* Open Positions */}
      <section className="bg-background-secondary py-16">
        <div className="container-custom">
          <ScrollAnimation animation="fadeIn">
            <h2 className="text-4xl font-bold text-white text-center mb-12">Отворени позиции</h2>
          </ScrollAnimation>
          <div className="space-y-6">
            <div className="bg-primary rounded-2xl p-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Frontend Developer</h3>
                  <div className="flex flex-wrap gap-4 text-gray-300 mb-4">
                    <div className="flex items-center gap-2">
                      <FiMapPin size={16} />
                      <span>София, България</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiClock size={16} />
                      <span>Пълен работен ден</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiDollarSign size={16} />
                      <span>3000-5000 €.</span>
                    </div>
                  </div>
                  <p className="text-gray-300">
                    Търсим опитен Frontend Developer с познания в React, Next.js и TypeScript. 
                    Ще работите върху подобряването на нашата онлайн платформа.
                  </p>
                </div>
                <button className="bg-accent text-white px-6 py-3 rounded-lg hover:bg-accent-light hover:scale-105 hover:shadow-lg hover:shadow-accent/30 transition-all duration-300 font-medium transform active:scale-95">
                  Кандидатствай
                </button>
              </div>
            </div>

            <div className="bg-primary rounded-2xl p-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">UI/UX Designer</h3>
                  <div className="flex flex-wrap gap-4 text-gray-300 mb-4">
                    <div className="flex items-center gap-2">
                      <FiMapPin size={16} />
                      <span>София, България</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiClock size={16} />
                      <span>Пълен работен ден</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiDollarSign size={16} />
                      <span>2500-4000 €.</span>
                    </div>
                  </div>
                  <p className="text-gray-300">
                    Търсим креативен UI/UX Designer с опит в дизайн на мобилни и уеб приложения. 
                    Ще създавате интуитивни и привлекателни потребителски интерфейси.
                  </p>
                </div>
                <button className="bg-accent text-white px-6 py-3 rounded-lg hover:bg-accent-light hover:scale-105 hover:shadow-lg hover:shadow-accent/30 transition-all duration-300 font-medium transform active:scale-95">
                  Кандидатствай
                </button>
              </div>
            </div>

            <div className="bg-primary rounded-2xl p-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Marketing Specialist</h3>
                  <div className="flex flex-wrap gap-4 text-gray-300 mb-4">
                    <div className="flex items-center gap-2">
                      <FiMapPin size={16} />
                      <span>София, България</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiClock size={16} />
                      <span>Пълен работен ден</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiDollarSign size={16} />
                      <span>2000-3500 €.</span>
                    </div>
                  </div>
                  <p className="text-gray-300">
                    Търсим енергичен Marketing Specialist с опит в дигитален маркетинг и социални мрежи. 
                    Ще развивате нашите маркетингови кампании и онлайн присъствие.
                  </p>
                </div>
                <button className="bg-accent text-white px-6 py-3 rounded-lg hover:bg-accent-light hover:scale-105 hover:shadow-lg hover:shadow-accent/30 transition-all duration-300 font-medium transform active:scale-95">
                  Кандидатствай
                </button>
              </div>
            </div>

            <div className="bg-primary rounded-2xl p-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Customer Support</h3>
                  <div className="flex flex-wrap gap-4 text-gray-300 mb-4">
                    <div className="flex items-center gap-2">
                      <FiMapPin size={16} />
                      <span>София, България</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiClock size={16} />
                      <span>Пълен работен ден</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiDollarSign size={16} />
                      <span>1500-2500 €.</span>
                    </div>
                  </div>
                  <p className="text-gray-300">
                    Търсим приятелски и отзивчив Customer Support представител с отлични комуникативни умения. 
                    Ще помагате на нашите клиенти с техните въпроси и нужди.
                  </p>
                </div>
                <button className="bg-accent text-white px-6 py-3 rounded-lg hover:bg-accent-light hover:scale-105 hover:shadow-lg hover:shadow-accent/30 transition-all duration-300 font-medium transform active:scale-95">
                  Кандидатствай
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
                <h2 className="text-4xl font-bold text-white mb-6">Предимства за служителите</h2>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-accent rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white text-sm font-bold">✓</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">Гъвкаво работно време</h3>
                      <p className="text-gray-300">
                        Възможност за работа от вкъщи и гъвкаво разписание.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="bg-accent rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white text-sm font-bold">✓</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">Здравно осигуряване</h3>
                      <p className="text-gray-300">
                        Пълно здравно осигуряване за вас и семейството ви.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="bg-accent rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white text-sm font-bold">✓</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">Обучения и конференции</h3>
                      <p className="text-gray-300">
                        Бюджет за професионално развитие и участие в конференции.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="bg-accent rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white text-sm font-bold">✓</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">Отпуски и почивки</h3>
                      <p className="text-gray-300">
                        25 дни платен годишен отпуск плюс български празници.
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
                  <h3 className="text-2xl font-bold text-white mb-4">Модерно работно място</h3>
                  <p className="text-gray-300 mb-6">
                    Работим в модерен офис в центъра на София с всички необходими удобства.
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-accent">24/7</div>
                      <div className="text-sm text-gray-300">Достъп до офиса</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-accent">100%</div>
                      <div className="text-sm text-gray-300">Покритие на интернет</div>
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
            <h2 className="text-4xl font-bold text-white text-center mb-12">Процес на кандидатстване</h2>
          </ScrollAnimation>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl font-bold">1</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Изпратете CV</h3>
              <p className="text-gray-300 text-sm">
                Изпратете вашето CV и мотивационно писмо на careers@justcases.bg
              </p>
            </div>
            <div className="text-center">
              <div className="bg-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl font-bold">2</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Първо интервю</h3>
              <p className="text-gray-300 text-sm">
                Кратко телефонно или видео интервю с HR екипа
              </p>
            </div>
            <div className="text-center">
              <div className="bg-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl font-bold">3</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Техническо интервю</h3>
              <p className="text-gray-300 text-sm">
                Встреча с екипа и технически тест (ако е приложимо)
              </p>
            </div>
            <div className="text-center">
              <div className="bg-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl font-bold">4</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Оферта</h3>
              <p className="text-gray-300 text-sm">
                При успешно преминаване получавате оферта за работа
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16">
        <div className="container-custom text-center">
          <ScrollAnimation animation="fadeIn">
            <h2 className="text-4xl font-bold text-white mb-6">Готови да се присъедините?</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Ако не виждате подходяща позиция, но искате да работите с нас, 
              не се колебайте да се свържете с нас.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="mailto:careers@justcases.bg"
                className="bg-accent text-white px-8 py-4 rounded-lg hover:bg-accent-light hover:scale-105 hover:shadow-lg hover:shadow-accent/30 transition-all duration-300 font-medium transform active:scale-95"
              >
                Изпратете CV
              </a>
              <a 
                href="mailto:info@justcases.bg"
                className="bg-primary text-white px-8 py-4 rounded-lg hover:bg-primary-light hover:scale-105 hover:shadow-lg transition-all duration-300 font-medium border border-gray-600 transform active:scale-95"
              >
                Свържете се с нас
              </a>
            </div>
          </ScrollAnimation>
        </div>
      </section>
      </div>
    </>
  );
}
