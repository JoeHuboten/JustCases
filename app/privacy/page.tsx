'use client';

import { FiShield, FiEye, FiLock, FiUser, FiMail, FiDatabase } from 'react-icons/fi';
import ScrollAnimation from '@/components/ScrollAnimation';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#0a0a0f] to-blue-900/20 py-20">
        <div className="container-custom">
          <ScrollAnimation animation="fadeIn" className="text-center">
            <h1 className="text-5xl font-bold text-white mb-6">Политика за поверителност</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Вашата поверителност е важна за нас. Научете как събираме, използваме и защитаваме вашата информация.
            </p>
            <div className="flex items-center justify-center gap-2 mt-6 text-gray-400">
              <FiShield size={16} />
              <span>Последна актуализация: 1 януари 2025 г.</span>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      {/* Privacy Content */}
      <section className="py-16">
        <div className="container-custom max-w-4xl">
          <div className="space-y-12">
            {/* Introduction */}
            <ScrollAnimation animation="fadeIn">
              <div className="bg-primary rounded-2xl p-8">
                <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                  <FiShield className="text-accent" />
                  1. Въведение
                </h2>
                <div className="text-gray-300 space-y-4">
                  <p>
                    Just Cases ("Ние", "Нас", "Наш") се ангажира да защитава вашата поверителност. 
                    Тази Политика за поверителност обяснява как събираме, използваме, разкриваме 
                    и защитаваме вашата информация когато използвате нашия уебсайт и услуги.
                  </p>
                  <p>
                    Като използвате нашия уебсайт, вие се съгласявате със събирането и използването 
                    на информацията в съответствие с тази политика.
                  </p>
                </div>
              </div>
            </ScrollAnimation>

            {/* Information We Collect */}
            <ScrollAnimation animation="fadeIn">
              <div className="bg-primary rounded-2xl p-8">
                <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                  <FiDatabase className="text-accent" />
                  2. Информация, която събираме
                </h2>
                <div className="text-gray-300 space-y-6">
                  <div>
                    <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                      <FiUser className="text-accent" size={20} />
                      2.1 Лична информация
                    </h3>
                    <ul className="list-disc list-inside space-y-2 ml-6">
                      <li>Име и фамилия</li>
                      <li>Имейл адрес</li>
                      <li>Телефонен номер</li>
                      <li>Адрес за доставка и фактуриране</li>
                      <li>Информация за плащане (обработва се безопасно чрез Stripe)</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                      <FiEye className="text-accent" size={20} />
                      2.2 Автоматично събирана информация
                    </h3>
                    <ul className="list-disc list-inside space-y-2 ml-6">
                      <li>IP адрес и местоположение</li>
                      <li>Тип браузър и операционна система</li>
                      <li>Страници, които посещавате</li>
                      <li>Време на посещение</li>
                      <li>Референтиращи уебсайтове</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                      <FiMail className="text-accent" size={20} />
                      2.3 Информация от комуникации
                    </h3>
                    <ul className="list-disc list-inside space-y-2 ml-6">
                      <li>Съобщения от клиентска поддръжка</li>
                      <li>Отзиви и ревюта</li>
                      <li>Участие в анкети</li>
                      <li>Информация от социални мрежи (ако се свържете)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </ScrollAnimation>

            {/* How We Use Information */}
            <ScrollAnimation animation="fadeIn">
              <div className="bg-primary rounded-2xl p-8">
                <h2 className="text-3xl font-bold text-white mb-6">3. Как използваме вашата информация</h2>
                <div className="text-gray-300 space-y-4">
                  <div>
                    <h3 className="text-white font-bold mb-2">3.1 Предоставяне на услуги</h3>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Обработка и изпълнение на поръчки</li>
                      <li>Доставка на продукти</li>
                      <li>Клиентска поддръжка</li>
                      <li>Обработка на плащания</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-white font-bold mb-2">3.2 Подобряване на услугите</h3>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Анализ на използването на уебсайта</li>
                      <li>Подобряване на функционалността</li>
                      <li>Персонализиране на съдържанието</li>
                      <li>Разработване на нови функции</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-white font-bold mb-2">3.3 Комуникация</h3>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Изпращане на потвърждения за поръчки</li>
                      <li>Уведомления за статус на доставка</li>
                      <li>Маркетингови съобщения (с ваше съгласие)</li>
                      <li>Важни обновления за услугите</li>
                    </ul>
                  </div>
                </div>
              </div>
            </ScrollAnimation>

            {/* Information Sharing */}
            <ScrollAnimation animation="fadeIn">
              <div className="bg-primary rounded-2xl p-8">
                <h2 className="text-3xl font-bold text-white mb-6">4. Споделяне на информация</h2>
                <div className="text-gray-300 space-y-4">
                  <p>
                    Ние не продаваме, не отдаваме под наем и не споделяме вашата лична информация 
                    с трети страни, освен в следните случаи:
                  </p>
                  <div>
                    <h3 className="text-white font-bold mb-2">4.1 Сервизни доставчици</h3>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Куриерски компании за доставка</li>
                      <li>Платежни процесори (Stripe)</li>
                      <li>Хостинг доставчици</li>
                      <li>Аналитични услуги (Google Analytics)</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-white font-bold mb-2">4.2 Правни изисквания</h3>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>При изпълнение на съдебни заповеди</li>
                      <li>За защита на нашите права и собственост</li>
                      <li>За защита на безопасността на потребителите</li>
                      <li>При спешни ситуации</li>
                    </ul>
                  </div>
                </div>
              </div>
            </ScrollAnimation>

            {/* Data Security */}
            <ScrollAnimation animation="fadeIn">
              <div className="bg-primary rounded-2xl p-8">
                <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                  <FiLock className="text-accent" />
                  5. Защита на данните
                </h2>
                <div className="text-gray-300 space-y-4">
                  <p>
                    Ние прилагаме подходящи технически и организационни мерки за защита на вашата 
                    лична информация срещу неоторизиран достъп, промяна, разкриване или унищожаване.
                  </p>
                  <div>
                    <h3 className="text-white font-bold mb-2">5.1 Технически мерки</h3>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>SSL криптиране за всички предавания</li>
                      <li>Безопасно съхранение на данни</li>
                      <li>Регулярни резервни копия</li>
                      <li>Мониторинг на системата 24/7</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-white font-bold mb-2">5.2 Организационни мерки</h3>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Ограничен достъп до лични данни</li>
                      <li>Обучение на служителите за поверителност</li>
                      <li>Строги политики за достъп</li>
                      <li>Регулярни аудити на сигурността</li>
                    </ul>
                  </div>
                </div>
              </div>
            </ScrollAnimation>

            {/* Cookies */}
            <ScrollAnimation animation="fadeIn">
              <div className="bg-primary rounded-2xl p-8">
                <h2 className="text-3xl font-bold text-white mb-6">6. Бисквитки (Cookies)</h2>
                <div className="text-gray-300 space-y-4">
                  <p>
                    Използваме бисквитки и подобни технологии за подобряване на вашето изживяване 
                    на нашия уебсайт. Бисквитките са малки файлове, които се съхраняват на вашето устройство.
                  </p>
                  <div>
                    <h3 className="text-white font-bold mb-2">6.1 Типове бисквитки</h3>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li><strong>Необходими:</strong> За основната функционалност на сайта</li>
                      <li><strong>Аналитични:</strong> За анализ на използването (Google Analytics)</li>
                      <li><strong>Функционални:</strong> За запомняне на вашите предпочитания</li>
                      <li><strong>Маркетингови:</strong> За персонализирани реклами</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-white font-bold mb-2">6.2 Управление на бисквитки</h3>
                    <p>
                      Можете да контролирате бисквитките чрез настройките на вашия браузър. 
                      Имайте предвид, че деактивирането на някои бисквитки може да засегне 
                      функционалността на сайта.
                    </p>
                  </div>
                </div>
              </div>
            </ScrollAnimation>

            {/* Your Rights */}
            <ScrollAnimation animation="fadeIn">
              <div className="bg-primary rounded-2xl p-8">
                <h2 className="text-3xl font-bold text-white mb-6">7. Вашите права</h2>
                <div className="text-gray-300 space-y-4">
                  <p>
                    В съответствие с GDPR и българското законодателство, имате следните права:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>Право на достъп:</strong> Можете да поискате копие от вашите лични данни</li>
                    <li><strong>Право на коригиране:</strong> Можете да поискате поправка на неточни данни</li>
                    <li><strong>Право на изтриване:</strong> Можете да поискате изтриване на вашите данни</li>
                    <li><strong>Право на ограничаване:</strong> Можете да ограничите обработката на данните</li>
                    <li><strong>Право на преносимост:</strong> Можете да получите данните в структуриран формат</li>
                    <li><strong>Право на възражение:</strong> Можете да се противопоставите на обработката</li>
                  </ul>
                  <p>
                    За упражняване на тези права, моля свържете се с нас на privacy@justcases.bg
                  </p>
                </div>
              </div>
            </ScrollAnimation>

            {/* Data Retention */}
            <ScrollAnimation animation="fadeIn">
              <div className="bg-primary rounded-2xl p-8">
                <h2 className="text-3xl font-bold text-white mb-6">8. Съхранение на данни</h2>
                <div className="text-gray-300 space-y-4">
                  <p>
                    Съхраняваме вашите лични данни само толкова дълго, колкото е необходимо 
                    за изпълнение на целите, за които са събрани:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>Акаунт информация:</strong> До изтриване на акаунта</li>
                    <li><strong>Поръчки:</strong> 7 години (за счетоводни цели)</li>
                    <li><strong>Маркетингови данни:</strong> До отказ от съгласие</li>
                    <li><strong>Аналитични данни:</strong> 26 месеца (Google Analytics)</li>
                  </ul>
                </div>
              </div>
            </ScrollAnimation>

            {/* Children's Privacy */}
            <ScrollAnimation animation="fadeIn">
              <div className="bg-primary rounded-2xl p-8">
                <h2 className="text-3xl font-bold text-white mb-6">9. Поверителност на децата</h2>
                <div className="text-gray-300 space-y-4">
                  <p>
                    Нашите услуги не са предназначени за деца под 16 години. Ние не събираме 
                    умишлено лична информация от деца под 16 години. Ако установим, че сме 
                    събрали информация от дете под 16 години, ще изтрием тази информация веднага.
                  </p>
                </div>
              </div>
            </ScrollAnimation>

            {/* Changes to Privacy Policy */}
            <ScrollAnimation animation="fadeIn">
              <div className="bg-primary rounded-2xl p-8">
                <h2 className="text-3xl font-bold text-white mb-6">10. Промени в политиката</h2>
                <div className="text-gray-300 space-y-4">
                  <p>
                    Ние можем да актуализираме тази Политика за поверителност от време на време. 
                    Ще уведомим за значителни промени чрез имейл или уведомление на уебсайта. 
                    Препоръчваме ви да преглеждате тази страница периодично за актуализации.
                  </p>
                </div>
              </div>
            </ScrollAnimation>

            {/* Contact */}
            <ScrollAnimation animation="fadeIn">
              <div className="bg-primary rounded-2xl p-8">
                <h2 className="text-3xl font-bold text-white mb-6">11. Контакт</h2>
                <div className="text-gray-300 space-y-4">
                  <p>
                    Ако имате въпроси относно тази Политика за поверителност или искате да 
                    упражните вашите права, моля свържете се с нас:
                  </p>
                  <div className="space-y-2">
                    <p><strong>Имейл:</strong> privacy@justcases.bg</p>
                    <p><strong>Телефон:</strong> +359 888 123 456</p>
                    <p><strong>Адрес:</strong> София, България</p>
                    <p><strong>DPO:</strong> dpo@justcases.bg</p>
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
