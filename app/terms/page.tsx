'use client';

import { FiFileText, FiCalendar, FiShield, FiAlertCircle } from 'react-icons/fi';
import ScrollAnimation from '@/components/ScrollAnimation';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#0a0a0f] to-blue-900/20 py-20">
        <div className="container-custom">
          <ScrollAnimation animation="fadeIn" className="text-center">
            <h1 className="text-5xl font-bold text-white mb-6">Условия за ползване</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Моля, прочетете внимателно тези условия преди да използвате нашите услуги.
            </p>
            <div className="flex items-center justify-center gap-2 mt-6 text-gray-400">
              <FiCalendar size={16} />
              <span>Последна актуализация: 1 януари 2025 г.</span>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-16">
        <div className="container-custom max-w-4xl">
          <div className="space-y-12">
            {/* Introduction */}
            <ScrollAnimation animation="fadeIn">
              <div className="bg-primary rounded-2xl p-8">
                <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                  <FiFileText className="text-accent" />
                  1. Въведение
                </h2>
                <div className="text-gray-300 space-y-4">
                  <p>
                    Добре дошли в Just Cases! Тези условия за ползване ("Условия") регулират използването на нашия уебсайт 
                    и услуги, предоставяни от Just Cases ("Ние", "Нас", "Наш").
                  </p>
                  <p>
                    Като използвате нашия уебсайт или поръчвате продукти от нас, вие се съгласявате да бъдете обвързани 
                    с тези Условия. Ако не се съгласявате с някоя част от тези условия, моля не използвайте нашите услуги.
                  </p>
                </div>
              </div>
            </ScrollAnimation>

            {/* Definitions */}
            <ScrollAnimation animation="fadeIn">
              <div className="bg-primary rounded-2xl p-8">
                <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                  <FiShield className="text-accent" />
                  2. Определения
                </h2>
                <div className="text-gray-300 space-y-4">
                  <div>
                    <h3 className="text-white font-bold mb-2">"Ние", "Нас", "Наш"</h3>
                    <p>Отнася се до Just Cases и нашите служители, агенти и партньори.</p>
                  </div>
                  <div>
                    <h3 className="text-white font-bold mb-2">"Вие", "Ваш"</h3>
                    <p>Отнася се до вас като потребител на нашия уебсайт или клиент.</p>
                  </div>
                  <div>
                    <h3 className="text-white font-bold mb-2">"Услуги"</h3>
                    <p>Всички услуги, предоставяни от нас, включително продажба на продукти и доставка.</p>
                  </div>
                  <div>
                    <h3 className="text-white font-bold mb-2">"Продукти"</h3>
                    <p>Всички мобилни аксесоари и свързани продукти, продавани от нас.</p>
                  </div>
                </div>
              </div>
            </ScrollAnimation>

            {/* Orders and Payment */}
            <ScrollAnimation animation="fadeIn">
              <div className="bg-primary rounded-2xl p-8">
                <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                  <FiAlertCircle className="text-accent" />
                  3. Поръчки и плащания
                </h2>
                <div className="text-gray-300 space-y-4">
                  <div>
                    <h3 className="text-white font-bold mb-2">3.1 Поръчки</h3>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Всички поръчки са предмет на потвърждение и наличност на продуктите</li>
                      <li>Ние запазваме правото да откажем или отменим поръчка по наша преценка</li>
                      <li>Цените могат да се променят без предварително уведомление</li>
                      <li>Всички цени са в български лева и включват ДДС</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-white font-bold mb-2">3.2 Плащания</h3>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Приемаме плащания с кредитни карти, PayPal, Apple Pay и Google Pay</li>
                      <li>Плащането се изисква преди обработката на поръчката</li>
                      <li>Всички плащания се обработват безопасно чрез Stripe</li>
                      <li>При неуспешно плащане поръчката се отменя автоматично</li>
                    </ul>
                  </div>
                </div>
              </div>
            </ScrollAnimation>

            {/* Delivery */}
            <ScrollAnimation animation="fadeIn">
              <div className="bg-primary rounded-2xl p-8">
                <h2 className="text-3xl font-bold text-white mb-6">4. Доставка</h2>
                <div className="text-gray-300 space-y-4">
                  <div>
                    <h3 className="text-white font-bold mb-2">4.1 Срокове за доставка</h3>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Стандартна доставка: 3-5 работни дни</li>
                      <li>Експресна доставка: 1-2 работни дни</li>
                      <li>Доставка в деня: само за София</li>
                      <li>Сроковете са приблизителни и могат да се променят</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-white font-bold mb-2">4.2 Риск и собственост</h3>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Рискът за продуктите преминава към вас при доставка</li>
                      <li>Собствеността преминава при пълно плащане</li>
                      <li>Вие отговаряте за проверката на пратката при получаване</li>
                    </ul>
                  </div>
                </div>
              </div>
            </ScrollAnimation>

            {/* Returns and Refunds */}
            <ScrollAnimation animation="fadeIn">
              <div className="bg-primary rounded-2xl p-8">
                <h2 className="text-3xl font-bold text-white mb-6">5. Връщане и възстановяване</h2>
                <div className="text-gray-300 space-y-4">
                  <div>
                    <h3 className="text-white font-bold mb-2">5.1 Право на връщане</h3>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Имате 30 дни от получаване за връщане на продукта</li>
                      <li>Продуктът трябва да бъде в оригиналното си състояние</li>
                      <li>Всички аксесоари и документи трябва да бъдат включени</li>
                      <li>Разходите за връщане са за ваша сметка</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-white font-bold mb-2">5.2 Възстановяване</h3>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Възстановяването се извършва в рамките на 5-7 работни дни</li>
                      <li>Парите се връщат по същия начин на плащане</li>
                      <li>При частично връщане се възстановява пропорционалната сума</li>
                    </ul>
                  </div>
                </div>
              </div>
            </ScrollAnimation>

            {/* Warranty */}
            <ScrollAnimation animation="fadeIn">
              <div className="bg-primary rounded-2xl p-8">
                <h2 className="text-3xl font-bold text-white mb-6">6. Гаранция</h2>
                <div className="text-gray-300 space-y-4">
                  <div>
                    <h3 className="text-white font-bold mb-2">6.1 Гаранция на продуктите</h3>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Всички продукти имат гаранция от производителя</li>
                      <li>Гаранцията покрива производствени дефекти</li>
                      <li>Гаранцията не покрива увреждания от неправилно използване</li>
                      <li>За гаранционни случаи се свържете с нас</li>
                    </ul>
                  </div>
                </div>
              </div>
            </ScrollAnimation>

            {/* Limitation of Liability */}
            <ScrollAnimation animation="fadeIn">
              <div className="bg-primary rounded-2xl p-8">
                <h2 className="text-3xl font-bold text-white mb-6">7. Ограничение на отговорността</h2>
                <div className="text-gray-300 space-y-4">
                  <p>
                    В максималната степен, разрешена от закона, Just Cases не носи отговорност за:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Косвени, случайни или последващи щети</li>
                    <li>Загуба на печалба или данни</li>
                    <li>Увреждания на устройства от използване на нашите продукти</li>
                    <li>Забавяния в доставката поради форс мажорни обстоятелства</li>
                  </ul>
                </div>
              </div>
            </ScrollAnimation>

            {/* Privacy */}
            <ScrollAnimation animation="fadeIn">
              <div className="bg-primary rounded-2xl p-8">
                <h2 className="text-3xl font-bold text-white mb-6">8. Поверителност</h2>
                <div className="text-gray-300 space-y-4">
                  <p>
                    Вашата поверителност е важна за нас. Моля, прочетете нашата 
                    <a href="/privacy" className="text-accent hover:text-accent-light underline"> Политика за поверителност</a> 
                    за да разберете как събираме, използваме и защитаваме вашата информация.
                  </p>
                </div>
              </div>
            </ScrollAnimation>

            {/* Changes to Terms */}
            <ScrollAnimation animation="fadeIn">
              <div className="bg-primary rounded-2xl p-8">
                <h2 className="text-3xl font-bold text-white mb-6">9. Промени в условията</h2>
                <div className="text-gray-300 space-y-4">
                  <p>
                    Ние запазваме правото да променяме тези условия по всяко време. 
                    Промените влизат в сила веднага след публикуването им на уебсайта. 
                    Вашето продължаващо използване на услугите след промените означава 
                    приемане на новите условия.
                  </p>
                </div>
              </div>
            </ScrollAnimation>

            {/* Contact */}
            <ScrollAnimation animation="fadeIn">
              <div className="bg-primary rounded-2xl p-8">
                <h2 className="text-3xl font-bold text-white mb-6">10. Контакт</h2>
                <div className="text-gray-300 space-y-4">
                  <p>
                    Ако имате въпроси относно тези условия, моля свържете се с нас:
                  </p>
                  <div className="space-y-2">
                    <p><strong>Имейл:</strong> legal@justcases.bg</p>
                    <p><strong>Телефон:</strong> +359 888 123 456</p>
                    <p><strong>Адрес:</strong> София, България</p>
                  </div>
                </div>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>
    </div>
  );
}
