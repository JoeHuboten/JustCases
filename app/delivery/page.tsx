'use client';

import { FiTruck, FiMapPin, FiClock, FiPackage, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import ScrollAnimation, { StaggerAnimation } from '@/components/ScrollAnimation';

export default function DeliveryPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#0a0a0f] to-blue-900/20 py-20">
        <div className="container-custom">
          <ScrollAnimation animation="fadeIn" className="text-center">
            <h1 className="text-5xl font-bold text-white mb-6">Детайли за доставка</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Научете всичко за нашите опции за доставка, срокове и условия.
            </p>
          </ScrollAnimation>
        </div>
      </section>

      {/* Delivery Options */}
      <section className="py-16">
        <div className="container-custom">
          <ScrollAnimation animation="fadeIn">
            <h2 className="text-4xl font-bold text-white text-center mb-12">Опции за доставка</h2>
          </ScrollAnimation>
          <StaggerAnimation animation="scaleUp" stagger={0.2} className="grid md:grid-cols-3 gap-8">
            <div className="bg-primary rounded-2xl p-8 text-center hover:scale-105 hover:shadow-2xl hover:shadow-accent/20 transition-all duration-300 group">
              <div className="bg-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <FiTruck className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-accent transition-colors duration-300">Стандартна доставка</h3>
              <div className="text-3xl font-bold text-accent mb-4 group-hover:scale-110 transition-transform duration-300">Безплатно</div>
              <p className="text-gray-300 mb-4 group-hover:text-gray-200 transition-colors duration-300">
                За поръчки над 50 €.
              </p>
              <div className="space-y-2 text-gray-300 group-hover:text-gray-200 transition-colors duration-300">
                <div className="flex items-center justify-center gap-2">
                  <FiClock size={16} />
                  <span>3-5 работни дни</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <FiMapPin size={16} />
                  <span>Цяла България</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <FiPackage size={16} />
                  <span>Следобедна доставка</span>
                </div>
              </div>
            </div>

            <div className="bg-primary rounded-2xl p-8 text-center border-2 border-accent hover:scale-105 hover:shadow-2xl hover:shadow-accent/30 transition-all duration-300 group">
              <div className="bg-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <FiPackage className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-accent transition-colors duration-300">Експресна доставка</h3>
              <div className="text-3xl font-bold text-accent mb-4 group-hover:scale-110 transition-transform duration-300">8.90 €.</div>
              <p className="text-gray-300 mb-4 group-hover:text-gray-200 transition-colors duration-300">
                За всички поръчки
              </p>
              <div className="space-y-2 text-gray-300 group-hover:text-gray-200 transition-colors duration-300">
                <div className="flex items-center justify-center gap-2">
                  <FiClock size={16} />
                  <span>1-2 работни дни</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <FiMapPin size={16} />
                  <span>Цяла България</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <FiPackage size={16} />
                  <span>Приоритетна обработка</span>
                </div>
              </div>
              <div className="mt-4 bg-accent/20 text-accent px-3 py-1 rounded-full text-sm font-medium group-hover:bg-accent/30 transition-colors duration-300">
                Най-популярно
              </div>
            </div>

            <div className="bg-primary rounded-2xl p-8 text-center hover:scale-105 hover:shadow-2xl hover:shadow-accent/20 transition-all duration-300 group">
              <div className="bg-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <FiCheckCircle className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-accent transition-colors duration-300">Доставка в деня</h3>
              <div className="text-3xl font-bold text-accent mb-4 group-hover:scale-110 transition-transform duration-300">15.90 €.</div>
              <p className="text-gray-300 mb-4 group-hover:text-gray-200 transition-colors duration-300">
                Само за София
              </p>
              <div className="space-y-2 text-gray-300 group-hover:text-gray-200 transition-colors duration-300">
                <div className="flex items-center justify-center gap-2">
                  <FiClock size={16} />
                  <span>В същия ден</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <FiMapPin size={16} />
                  <span>Само София</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <FiPackage size={16} />
                  <span>До 18:00</span>
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
            <h2 className="text-4xl font-bold text-white text-center mb-12">Процес на доставка</h2>
          </ScrollAnimation>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl font-bold">1</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Поръчка получена</h3>
              <p className="text-gray-300 text-sm">
                Получаваме вашата поръчка и започваме обработката
              </p>
            </div>
            <div className="text-center">
              <div className="bg-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl font-bold">2</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Обработка</h3>
              <p className="text-gray-300 text-sm">
                Подготвяме и опаковаме вашите продукти
              </p>
            </div>
            <div className="text-center">
              <div className="bg-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl font-bold">3</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Изпращане</h3>
              <p className="text-gray-300 text-sm">
                Предаваме пратката на куриера
              </p>
            </div>
            <div className="text-center">
              <div className="bg-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl font-bold">4</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Доставка</h3>
              <p className="text-gray-300 text-sm">
                Получавате пратката в посочения адрес
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
                <h2 className="text-4xl font-bold text-white mb-6">Зони за доставка</h2>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <FiCheckCircle className="text-accent text-xl mt-1" />
                    <div>
                      <h3 className="text-white font-bold">София</h3>
                      <p className="text-gray-300">Всички райони - доставка в деня налично</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <FiCheckCircle className="text-accent text-xl mt-1" />
                    <div>
                      <h3 className="text-white font-bold">Пловдив, Варна, Бургас</h3>
                      <p className="text-gray-300">1-2 работни дни с експресна доставка</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <FiCheckCircle className="text-accent text-xl mt-1" />
                    <div>
                      <h3 className="text-white font-bold">Други градове</h3>
                      <p className="text-gray-300">3-5 работни дни със стандартна доставка</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <FiAlertCircle className="text-yellow-500 text-xl mt-1" />
                    <div>
                      <h3 className="text-white font-bold">Малки села</h3>
                      <p className="text-gray-300">Може да отнеме допълнително време</p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollAnimation>
            <ScrollAnimation animation="slideLeft">
              <div className="bg-primary rounded-2xl p-8">
                <div className="text-center">
                  <div className="text-6xl mb-4">🚚</div>
                  <h3 className="text-2xl font-bold text-white mb-4">Надеждни куриери</h3>
                  <p className="text-gray-300 mb-6">
                    Работим с най-добрите куриерски компании в България за гарантирана доставка.
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
            <h2 className="text-4xl font-bold text-white text-center mb-12">Важна информация</h2>
          </ScrollAnimation>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-primary rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-4">Условия за доставка</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-3">
                  <FiCheckCircle className="text-accent mt-1" size={16} />
                  <span>Работно време за доставка: 09:00 - 18:00</span>
                </li>
                <li className="flex items-start gap-3">
                  <FiCheckCircle className="text-accent mt-1" size={16} />
                  <span>Необходимо е някой да приеме пратката</span>
                </li>
                <li className="flex items-start gap-3">
                  <FiCheckCircle className="text-accent mt-1" size={16} />
                  <span>При липса на получател, пратката се връща</span>
                </li>
                <li className="flex items-start gap-3">
                  <FiCheckCircle className="text-accent mt-1" size={16} />
                  <span>Възможност за преадресиране до офис на куриера</span>
                </li>
              </ul>
            </div>

            <div className="bg-primary rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-4">Следване на пратка</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-3">
                  <FiCheckCircle className="text-accent mt-1" size={16} />
                  <span>Получавате SMS с номер за проследяване</span>
                </li>
                <li className="flex items-start gap-3">
                  <FiCheckCircle className="text-accent mt-1" size={16} />
                  <span>Възможност за проследяване в реално време</span>
                </li>
                <li className="flex items-start gap-3">
                  <FiCheckCircle className="text-accent mt-1" size={16} />
                  <span>Уведомления за статус на пратката</span>
                </li>
                <li className="flex items-start gap-3">
                  <FiCheckCircle className="text-accent mt-1" size={16} />
                  <span>Възможност за промяна на адреса</span>
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
            <h2 className="text-4xl font-bold text-white mb-6">Въпроси за доставка?</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Ако имате въпроси относно доставката или искате да промените адреса на поръчка, 
              не се колебайте да се свържете с нас.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="mailto:delivery@justcases.bg"
                className="bg-accent text-white px-8 py-4 rounded-lg hover:bg-accent-light hover:scale-105 hover:shadow-lg hover:shadow-accent/30 transition-all duration-300 font-medium transform active:scale-95"
              >
                Пишете ни
              </a>
              <a 
                href="tel:+359888123456"
                className="bg-primary text-white px-8 py-4 rounded-lg hover:bg-primary-light hover:scale-105 hover:shadow-lg transition-all duration-300 font-medium border border-gray-600 transform active:scale-95"
              >
                Обадете се
              </a>
            </div>
          </ScrollAnimation>
        </div>
      </section>
    </div>
  );
}
