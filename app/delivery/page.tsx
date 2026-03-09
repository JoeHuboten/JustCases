'use client';

import { FiTruck, FiMapPin, FiClock, FiPackage, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import ScrollAnimation, { StaggerAnimation } from '@/components/ScrollAnimation';
import { useLanguage } from '@/contexts/LanguageContext';

export default function DeliveryPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#0a0a0f] to-blue-900/20 py-20">
        <div className="container-custom">
          <ScrollAnimation animation="fadeIn" className="text-center">
            <h1 className="text-5xl font-bold text-white mb-6">{t('delivery.title')}</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {t('delivery.subtitle')}
            </p>
          </ScrollAnimation>
        </div>
      </section>

      {/* Delivery Options */}
      <section className="py-16">
        <div className="container-custom">
          <ScrollAnimation animation="fadeIn">
            <h2 className="text-4xl font-bold text-white text-center mb-12">{t('delivery.options')}</h2>
          </ScrollAnimation>
          <StaggerAnimation animation="scaleUp" stagger={0.2} className="grid md:grid-cols-3 gap-8">
            <div className="bg-primary rounded-2xl p-8 text-center hover:scale-105 hover:shadow-2xl hover:shadow-accent/20 transition-all duration-300 group">
              <div className="bg-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <FiTruck className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-accent transition-colors duration-300">{t('delivery.standard')}</h3>
              <div className="text-3xl font-bold text-accent mb-4 group-hover:scale-110 transition-transform duration-300">{t('delivery.standard.price')}</div>
              <p className="text-gray-300 mb-4 group-hover:text-gray-200 transition-colors duration-300">
                {t('delivery.standard.condition')}
              </p>
              <div className="space-y-2 text-gray-300 group-hover:text-gray-200 transition-colors duration-300">
                <div className="flex items-center justify-center gap-2">
                  <FiClock size={16} />
                  <span>{t('delivery.standard.time')}</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <FiMapPin size={16} />
                  <span>{t('delivery.standard.area')}</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <FiPackage size={16} />
                  <span>{t('delivery.standard.note')}</span>
                </div>
              </div>
            </div>

            <div className="bg-primary rounded-2xl p-8 text-center border-2 border-accent hover:scale-105 hover:shadow-2xl hover:shadow-accent/30 transition-all duration-300 group">
              <div className="bg-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <FiPackage className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-accent transition-colors duration-300">{t('delivery.express')}</h3>
              <div className="text-3xl font-bold text-accent mb-4 group-hover:scale-110 transition-transform duration-300">{t('delivery.express.price')}</div>
              <p className="text-gray-300 mb-4 group-hover:text-gray-200 transition-colors duration-300">
                {t('delivery.express.condition')}
              </p>
              <div className="space-y-2 text-gray-300 group-hover:text-gray-200 transition-colors duration-300">
                <div className="flex items-center justify-center gap-2">
                  <FiClock size={16} />
                  <span>{t('delivery.express.time')}</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <FiMapPin size={16} />
                  <span>{t('delivery.standard.area')}</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <FiPackage size={16} />
                  <span>{t('delivery.express.note')}</span>
                </div>
              </div>
              <div className="mt-4 bg-accent/20 text-accent px-3 py-1 rounded-full text-sm font-medium group-hover:bg-accent/30 transition-colors duration-300">
                {t('delivery.express.badge')}
              </div>
            </div>

            <div className="bg-primary rounded-2xl p-8 text-center hover:scale-105 hover:shadow-2xl hover:shadow-accent/20 transition-all duration-300 group">
              <div className="bg-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <FiCheckCircle className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-accent transition-colors duration-300">{t('delivery.sameDay')}</h3>
              <div className="text-3xl font-bold text-accent mb-4 group-hover:scale-110 transition-transform duration-300">{t('delivery.sameDay.price')}</div>
              <p className="text-gray-300 mb-4 group-hover:text-gray-200 transition-colors duration-300">
                {t('delivery.sameDay.condition')}
              </p>
              <div className="space-y-2 text-gray-300 group-hover:text-gray-200 transition-colors duration-300">
                <div className="flex items-center justify-center gap-2">
                  <FiClock size={16} />
                  <span>{t('delivery.sameDay.time')}</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <FiMapPin size={16} />
                  <span>{t('delivery.sameDay.condition')}</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <FiPackage size={16} />
                  <span>{t('delivery.sameDay.note')}</span>
                </div>
              </div>
            </div>
          </StaggerAnimation>
        </div>
      </section>

      {/* Delivery Process */}
      <section className="bg-background-secondary py-16">
        <div className="container-custom">
          <ScrollAnimation animation="fadeIn">
            <h2 className="text-4xl font-bold text-white text-center mb-12">{t('delivery.process.title')}</h2>
          </ScrollAnimation>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl font-bold">1</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{t('delivery.process.received')}</h3>
              <p className="text-gray-300 text-sm">
                {t('delivery.process.receivedDesc')}
              </p>
            </div>
            <div className="text-center">
              <div className="bg-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl font-bold">2</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{t('delivery.process.processing')}</h3>
              <p className="text-gray-300 text-sm">
                {t('delivery.process.processingDesc')}
              </p>
            </div>
            <div className="text-center">
              <div className="bg-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl font-bold">3</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{t('delivery.process.shipping')}</h3>
              <p className="text-gray-300 text-sm">
                {t('delivery.process.shippingDesc')}
              </p>
            </div>
            <div className="text-center">
              <div className="bg-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl font-bold">4</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{t('delivery.process.delivered')}</h3>
              <p className="text-gray-300 text-sm">
                {t('delivery.process.deliveredDesc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Delivery Areas */}
      <section className="py-16">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <ScrollAnimation animation="slideRight">
              <div>
                <h2 className="text-4xl font-bold text-white mb-6">{t('delivery.zones.title')}</h2>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <FiCheckCircle className="text-accent text-xl mt-1" />
                    <div>
                      <h3 className="text-white font-bold">{t('delivery.zones.sofia')}</h3>
                      <p className="text-gray-300">{t('delivery.zones.sofiaDesc')}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <FiCheckCircle className="text-accent text-xl mt-1" />
                    <div>
                      <h3 className="text-white font-bold">{t('delivery.zones.bigCities')}</h3>
                      <p className="text-gray-300">{t('delivery.zones.bigCitiesDesc')}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <FiCheckCircle className="text-accent text-xl mt-1" />
                    <div>
                      <h3 className="text-white font-bold">{t('delivery.zones.otherCities')}</h3>
                      <p className="text-gray-300">{t('delivery.zones.otherCitiesDesc')}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <FiAlertCircle className="text-yellow-500 text-xl mt-1" />
                    <div>
                      <h3 className="text-white font-bold">{t('delivery.zones.villages')}</h3>
                      <p className="text-gray-300">{t('delivery.zones.villagesDesc')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollAnimation>
            <ScrollAnimation animation="slideLeft">
              <div className="bg-primary rounded-2xl p-8">
                <div className="text-center">
                  <div className="text-6xl mb-4">🚚</div>
                  <h3 className="text-2xl font-bold text-white mb-4">{t('delivery.couriers')}</h3>
                  <p className="text-gray-300 mb-6">
                    {t('delivery.couriersDesc')}
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between bg-gray-800 rounded-lg p-3">
                      <span className="text-white">Speedy</span>
                      <div className="bg-accent rounded-full w-4 h-4"></div>
                    </div>
                    <div className="flex items-center justify-between bg-gray-800 rounded-lg p-3">
                      <span className="text-white">Econt</span>
                      <div className="bg-accent rounded-full w-4 h-4"></div>
                    </div>
                    <div className="flex items-center justify-between bg-gray-800 rounded-lg p-3">
                      <span className="text-white">DHL</span>
                      <div className="bg-accent rounded-full w-4 h-4"></div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      {/* Important Information */}
      <section className="bg-background-secondary py-16">
        <div className="container-custom">
          <ScrollAnimation animation="fadeIn">
            <h2 className="text-4xl font-bold text-white text-center mb-12">{t('delivery.importantInfo')}</h2>
          </ScrollAnimation>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-primary rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-4">{t('delivery.conditions.title')}</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-3">
                  <FiCheckCircle className="text-accent mt-1" size={16} />
                  <span>{t('delivery.conditions.item1')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <FiCheckCircle className="text-accent mt-1" size={16} />
                  <span>{t('delivery.conditions.item2')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <FiCheckCircle className="text-accent mt-1" size={16} />
                  <span>{t('delivery.conditions.item3')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <FiCheckCircle className="text-accent mt-1" size={16} />
                  <span>{t('delivery.conditions.item4')}</span>
                </li>
              </ul>
            </div>

            <div className="bg-primary rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-4">{t('delivery.tracking.title')}</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-3">
                  <FiCheckCircle className="text-accent mt-1" size={16} />
                  <span>{t('delivery.tracking.item1')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <FiCheckCircle className="text-accent mt-1" size={16} />
                  <span>{t('delivery.tracking.item2')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <FiCheckCircle className="text-accent mt-1" size={16} />
                  <span>{t('delivery.tracking.item3')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <FiCheckCircle className="text-accent mt-1" size={16} />
                  <span>{t('delivery.tracking.item4')}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16">
        <div className="container-custom text-center">
          <ScrollAnimation animation="fadeIn">
            <h2 className="text-4xl font-bold text-white mb-6">{t('delivery.questions')}</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              {t('delivery.questionsDesc')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="mailto:delivery@justcases.bg"
                className="bg-accent text-white px-8 py-4 rounded-lg hover:bg-accent-light hover:scale-105 hover:shadow-lg hover:shadow-accent/30 transition-all duration-300 font-medium transform active:scale-95"
              >
                {t('delivery.writeUs')}
              </a>
              <a 
                href="tel:+359888123456"
                className="bg-primary text-white px-8 py-4 rounded-lg hover:bg-primary-light hover:scale-105 hover:shadow-lg transition-all duration-300 font-medium border border-gray-600 transform active:scale-95"
              >
                {t('delivery.callUs')}
              </a>
            </div>
          </ScrollAnimation>
        </div>
      </section>
    </div>
  );
}
