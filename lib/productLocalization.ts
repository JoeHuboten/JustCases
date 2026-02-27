import { Language } from '@/contexts/LanguageContext';

const bgDescriptionBySlug: Record<string, string> = {
  'premium-silicone-magsafe-case': 'Луксозен силиконов калъф с вградена MagSafe технология. Меко покритие с микрофибърна подплата за максимална защита.',
  'ultra-hybrid-clear-case': 'Кристално прозрачен TPU бъмпер с твърд PC гръб. Показва телефона ви, като същевременно осигурява военен клас защита при изпускане.',
  'defender-series-pro-rugged': 'Максимална здрава защита с покрития за портовете и клипс за колан. Създаден за екстремни условия.',
  'textured-grip-case': 'Калъф с текстуриран захват и персонализируеми панели. Проектиран за максимално сцепление и защита при изпускане.',
  'fashion-impact-case': 'Модерен защитен калъф с рейтинг за падане 6.6ft. С антимикробно покритие и артистични дизайни.',
  'tough-armor-magsafe-case': 'Двуслойна защита с вградена стойка и MagSafe съвместимост. Създаден за максимално абсорбиране на ударите.',
  'screenforce-ultraglass-protector': 'Прецизно изработен протектор с твърдост 9H. Технология с двойна йонна обмяна за по-висока здравина.',
  'glastr-ez-fit-protector': 'Комплект за автоматично подравняване с 9H стъкло. Кристално ясен с олеофобно покритие.',
  'alpha-glass-protector': 'Усилено стъкло с anti-shatter филм. Тествано да издържа на падания и удари.',
  'invisibleshield-glass-elite': 'Премиум стъкло с технология ClearPrint, която прави отпечатъците почти невидими.',
  'alignmaster-privacy-screen': 'Протектор за поверителност с автоматично подравняване при монтаж. Блокира страничния поглед при ъгъл 30°.',
  'onetouch-glass-3pack': 'Премиум стъкло с рамка за монтаж с едно докосване. Комплект от 3 бр. с доживотна гаранция за подмяна.',
  'pro-wireless-earbuds-anc': 'Премиум безжични слушалки с активно шумопотискане, адаптивно аудио и MagSafe кутия за зареждане.',
  'premium-studio-earbuds': 'Премиум слушалки с водещо в индустрията шумопотискане и изключително качество на звука.',
  'galaxy-buds-pro': 'Флагмански слушалки с интелигентно ANC и безпроблемна интеграция в екосистемата.',
  'elite-professional-earbuds': 'Професионални слушалки с регулируемо ANC и превъзходно качество на разговорите.',
  'liberty-nc-wireless-earbuds': 'Флагмански слушалки с адаптивно ANC и LDAC аудио. Изключително съотношение цена-качество.',
  'fit-pro-sports-earbuds': 'Стабилно прилягащи спортни слушалки с активно шумопотискане и мощен бас. Перфектни за спорт.',
  '150w-gan-4port-charger': '150W GaN зарядно с 4 порта и интелигентно разпределение на мощността. Зарежда до 4 устройства едновременно.',
  'usb-c-lightning-cable-mfi': 'MFi сертифициран USB-C към Lightning кабел за бързо зареждане и трансфер на данни.',
  '3in1-wireless-charging-station': 'Безжична зарядна станция за телефон, смарт часовник и слушалки. Бързо 15W MagSafe зареждане.',
  'powerline-iii-usb-c-cable': 'Изключително издръжлив USB-C към USB-C кабел. Тестван за над 35,000 огъвания. 100W бързо зареждане.',
  '45w-gan-wall-charger': 'Компактно 45W GaN зарядно за стена със сгъваем щепсел. Зарежда бързо лаптопи, таблети и телефони.',
  'premium-braided-usb-c-cable': 'Премиум USB-C кабел с двойно найлоново оплитане. Поддържа зареждане до 60W.',
  'powercore-26800-power-bank': 'Преносима батерия с ултра висок капацитет, двойни входни портове и троен USB изход.',
  'maggo-10000-magnetic-power-bank': 'Магнитна безжична преносима батерия с MagSafe съвместимост. Компактна и мощна.',
  '20000-usb-c-pd-power-bank': 'Преносима батерия с 60W USB-C Power Delivery за лаптопи и телефони.',
  '65w-laptop-power-bank-20000': 'Високоскоростна преносима батерия с 65W USB-C PD за MacBook, лаптопи, таблети и телефони.',
  'nano-power-bank-10000': 'Ултракомпактна преносима батерия с вграден USB-C кабел. Мощност в джобен размер.',
  'powerstation-plus-xl-12000': 'Премиум преносима батерия с интегрирани кабели за универсална съвместимост.',
  'apple-power-adapter-usb-c-70w': 'Оригинален Apple USB-C адаптер с 70W мощност за бързо и надеждно зареждане.',
  'ugreen-cd294-45w': 'Компактно зарядно Ugreen CD294 с поддръжка на 45W бързо зареждане.',
  'ugreen-cd361-65w': 'Ugreen CD361 GaN зарядно с 65W изход и бързо USB зареждане.',
  'canyon-oncharge-250-25w': 'Стенен адаптер Canyon OnCharge 250 с 25W мощност и USB/USB-C свързаност.',
  'ttec-smartcharger-20w': 'Компактно зарядно TTEC SmartCharger с 20W мощност за ежедневно бързо зареждане.',
  'canyon-hexagon-65-gan-usb-a-c-65w': 'Canyon Hexagon 65 GaN зарядно с два USB-C и един USB-A порт, 65W изход.',
};

const bgSpecKeyMap: Record<string, string> = {
  material: 'Материал',
  protection: 'Защита',
  features: 'Функции',
  battery: 'Батерия',
  capacity: 'Капацитет',
  output: 'Изход',
  power: 'Мощност',
  length: 'Дължина',
  thickness: 'Дебелина',
  compatibility: 'Съвместимост',
  ports: 'Портове',
  brand: 'Марка',
  model: 'Модел',
  series: 'Серия',
};

const bgExactValueMap: Record<string, string> = {
  Midnight: 'Тъмно синьо',
  'Storm Blue': 'Буреносно синьо',
  Clay: 'Глина',
  Elderberry: 'Бъз',
  Clear: 'Прозрачен',
  'Matte Black': 'Матово черно',
  Black: 'Черен',
  Blue: 'Син',
  Purple: 'Лилав',
  'Cactus Green': 'Кактусово зелено',
  'Robot Camo': 'Робо камуфлаж',
  Swarm: 'Рояк',
  Damascus: 'Дамаск',
  'Blue Marble': 'Син мрамор',
  'Pink Gradient': 'Розов градиент',
  Gunmetal: 'Графит',
  White: 'Бял',
  Silver: 'Сребрист',
  Graphite: 'Графит',
  'Bora Purple': 'Бора лилав',
  'Titanium Black': 'Титаниево черно',
  'Gold Beige': 'Златисто бежов',
  'Sky Blue': 'Небесно син',
  Pink: 'Розов',
  'Stone Purple': 'Камъково лилав',
  'Sage Gray': 'Сиво-зелен',
  Gray: 'Сив',
  'Silicone with microfiber lining': 'Силикон с микрофибърна подплата',
  'TPU + Polycarbonate': 'TPU + Поликарбонат',
  'Polycarbonate + Synthetic Rubber': 'Поликарбонат + синтетична гума',
  'Polycarbonate with micro-texture grip': 'Поликарбонат с микротекстуриран захват',
  'TPU with EcoShock technology': 'TPU с EcoShock технология',
  '9H Tempered Glass': 'Закалено стъкло 9H',
  'Strengthened Glass': 'Усилено стъкло',
  'Ion Matrix Glass': 'Ion Matrix стъкло',
  'MagSafe Compatible': 'MagSafe съвместим',
  'Air Cushion Technology, MIL-STD 810G': 'Air Cushion технология, MIL-STD 810G',
  'DROP+ Protection, 4X Military Standard': 'DROP+ защита, 4X военен стандарт',
  '6ft Drop Protection': 'Защита при падане от 6ft',
  '6.6ft / 2m Drop Protection': 'Защита при падане 6.6ft / 2m',
  'Air Cushion Technology, Extreme Heavy Duty': 'Air Cushion технология, изключително здрава защита',
  'USB, USB-C': 'USB, USB-C',
  '2x USB-C': '2x USB-C',
  '2x USB-C, USB': '2x USB-C, USB',
  '2x USB-C, USB-A': '2x USB-C, USB-A',
  '6 hours ANC (30 hours with case)': '6 часа ANC (30 часа с кутия)',
  '8 hours (24 hours with case)': '8 часа (24 часа с кутия)',
  '5 hours ANC (18 hours with case)': '5 часа ANC (18 часа с кутия)',
  '5.5 hours ANC (25 hours with case)': '5.5 часа ANC (25 часа с кутия)',
  '10 hours ANC (50 hours with case)': '10 часа ANC (50 часа с кутия)',
  '6 hours ANC (24 hours with case)': '6 часа ANC (24 часа с кутия)',
  '150W Total (2x USB-C, 2x USB-A)': '150W общо (2x USB-C, 2x USB-A)',
  'Up to 20W Fast Charging': 'До 20W бързо зареждане',
  '15W MagSafe Wireless Charging': '15W MagSafe безжично зареждане',
  '100W (USB PD)': '100W (USB PD)',
  '45W USB-C PD': '45W USB-C PD',
  '60W USB PD': '60W USB PD',
  '26800mAh (96.48Wh)': '26800mAh (96.48Wh)',
  '3 USB Ports, 6A Total': '3 USB порта, 6A общо',
  '10000mAh': '10000mAh',
  '15W Wireless + 20W USB-C': '15W безжично + 20W USB-C',
  '20000mAh (74Wh)': '20000mAh (74Wh)',
  '60W USB-C PD + 18W USB-A': '60W USB-C PD + 18W USB-A',
  '20000mAh (72Wh)': '20000mAh (72Wh)',
  '65W USB-C PD': '65W USB-C PD',
  '22.5W USB-C': '22.5W USB-C',
  '12000mAh': '12000mAh',
  '18W': '18W',
  'Soft-Touch Finish': 'Меко покритие',
  'Raised Edges': 'Повдигнати ръбове',
  'Premium Quality': 'Премиум качество',
  'Crystal Clear': 'Кристално прозрачен',
  'Anti-Yellowing': 'Защита от пожълтяване',
  'Wireless Charging': 'Безжично зареждане',
  'Raised Bezels': 'Повдигнати рамки',
  'Port Covers': 'Покрития за портовете',
  'Holster Clip': 'Клипс за колан',
  'Screen Bumper': 'Защитен борд за екрана',
  'Customizable Skins': 'Персонализируеми панели',
  'Textured Grip': 'Текстуриран захват',
  'Raised Camera Ring': 'Повдигнат пръстен за камерата',
  'Antimicrobial Coating': 'Антимикробно покритие',
  'UV Resistant': 'UV устойчивост',
  'Built-in Kickstand': 'Вградена стойка',
  'Dual Layer': 'Двоен слой',
  'Double-Ion Exchange': 'Двойна йонна обмяна',
  'Easy Align Tray': 'Лесна подравняваща рамка',
  'HD Clear': 'HD прозрачност',
  'Anti-Fingerprint': 'Устойчивост на отпечатъци',
  'Auto-Align Kit': 'Комплект за автоматично подравняване',
  'Case Friendly': 'Съвместим с калъфи',
  '2-Pack': 'Комплект от 2 бр.',
  'Anti-Shatter Film': 'Филм против разпадане',
  'Impact Resistant': 'Устойчив на удар',
  'Easy Installation': 'Лесен монтаж',
  'ClearPrint Technology': 'Технология ClearPrint',
  'Impact Protection': 'Защита от удар',
  'Anti-Glare': 'Антирефлексно покритие',
  'Easy Apply': 'Лесно поставяне',
  'Privacy Filter': 'Филтър за поверителност',
  'Auto-Align Tool': 'Инструмент за автоматично подравняване',
  'Anti-Spy': 'Защита от страничен поглед',
  'OneTouch Installation': 'Монтаж с едно докосване',
  '3-Pack': 'Комплект от 3 бр.',
  'Lifetime Warranty': 'Доживотна гаранция',
  'Active Noise Cancellation': 'Активно шумопотискане',
  'Adaptive Audio': 'Адаптивно аудио',
  'Transparency Mode': 'Режим прозрачност',
  'Spatial Audio': 'Пространствено аудио',
  'IPX4 Sweat Resistant': 'IPX4 устойчивост на пот',
  'Industry-Leading ANC': 'Водещо в класа ANC',
  'LDAC Audio': 'LDAC аудио',
  'Speak-to-Chat': 'Speak-to-Chat',
  'Multipoint Connection': 'Многоточкова връзка',
  'IPX4 Water Resistant': 'IPX4 водоустойчивост',
  'Intelligent ANC': 'Интелигентно ANC',
  '360 Audio': '360 аудио',
  'Auto Switch': 'Автоматично превключване',
  'IPX7 Water Resistant': 'IPX7 водоустойчивост',
  'Adjustable ANC': 'Регулируемо ANC',
  '6-Mic Technology': 'Технология с 6 микрофона',
  HearThrough: 'HearThrough',
  'Adaptive ANC 2.0': 'Адаптивно ANC 2.0',
  '11mm Drivers': '11mm драйвери',
  'Active Noise Cancelling': 'Активно шумопотискане',
  'Wingtip Design': 'Дизайн с фиксиращи крилца',
  'GaN Technology': 'GaN технология',
  'PowerIQ 4.0': 'PowerIQ 4.0',
  'Compact Design': 'Компактен дизайн',
  'ActiveShield 2.0': 'ActiveShield 2.0',
  'Foldable Plug': 'Сгъваем щепсел',
  'MFi Certified': 'MFi сертифициран',
  'Fast Charging': 'Бързо зареждане',
  'Data Transfer': 'Пренос на данни',
  'Durable Design': 'Издръжлив дизайн',
  '3-in-1 Charging': '3-в-1 зареждане',
  'Fast Charge': 'Бързо зареждане',
  'LED Indicator': 'LED индикатор',
  'Non-Slip Base': 'Неплъзгаща се основа',
  'Ultra-Durable': 'Ултра издръжлив',
  '35000+ Bend Lifespan': 'Живот над 35 000 огъвания',
  'Double-Braided': 'Двойно оплетен',
  'Compact Size': 'Компактен размер',
  'Universal Compatibility': 'Универсална съвместимост',
  'Double-Braided Nylon': 'Двойно оплетен найлон',
  '2-Year Warranty': '2 години гаранция',
  'Charges iPhone 10x': 'Зарежда iPhone до 10 пъти',
  'MultiProtect Safety': 'MultiProtect защита',
  'Dual Input Ports': 'Двойни входни портове',
  'Foldable Stand': 'Сгъваема стойка',
  'Pass-Through Charging': 'Pass-through зареждане',
  'Laptop Compatible': 'Съвместим с лаптопи',
  'LED Display': 'LED дисплей',
  'Premium Aluminum': 'Премиум алуминий',
  'MacBook Compatible': 'Съвместим с MacBook',
  'Digital Display': 'Дигитален дисплей',
  'Fast Recharge': 'Бързо презареждане',
  '4 Output Ports': '4 изходни порта',
  'Built-in USB-C Cable': 'Вграден USB-C кабел',
  'Ultra Compact': 'Ултра компактен',
  'Built-in Cables': 'Вградени кабели',
  'USB-C & Lightning': 'USB-C и Lightning',
  'Premium Fabric Finish': 'Премиум текстилен финиш',
  'Priority+ Charging': 'Priority+ зареждане',
};

const bgWordMap: Record<string, string> = {
  Premium: 'Премиум',
  Wireless: 'Безжично',
  Charging: 'зареждане',
  Fast: 'Бързо',
  Technology: 'технология',
  Compatible: 'съвместим',
  Compact: 'Компактен',
  Design: 'дизайн',
  Resistant: 'устойчив',
  Protection: 'защита',
  Transparent: 'Прозрачен',
  Clear: 'Ясен',
  Built: 'Създаден',
  Plug: 'щепсел',
  Display: 'дисплей',
  Cable: 'кабел',
  Charger: 'зарядно',
  Ultra: 'Ултра',
  Durable: 'издръжлив',
};

function applyWordTranslations(value: string): string {
  let translated = value;
  for (const [word, bgWord] of Object.entries(bgWordMap)) {
    const regExp = new RegExp(`\\b${word}\\b`, 'g');
    translated = translated.replace(regExp, bgWord);
  }
  return translated;
}

function translateBgValue(value: string): string {
  if (!value) return value;
  if (bgExactValueMap[value]) {
    return bgExactValueMap[value];
  }

  if (value.includes(', ')) {
    return value
      .split(', ')
      .map((part) => translateBgValue(part.trim()))
      .join(', ');
  }

  return applyWordTranslations(value);
}

export function localizeProductDescription(
  slug: string,
  description: string | null | undefined,
  language: Language
): string {
  if (!description) return '';
  if (language !== 'bg') return description;
  return bgDescriptionBySlug[slug] || description;
}

export function localizeProductOption(
  option: string,
  language: Language
): string {
  if (!option || language !== 'bg') return option;
  return translateBgValue(option);
}

export function localizeSpecificationKey(
  key: string,
  language: Language
): string {
  if (language !== 'bg') return key;
  return bgSpecKeyMap[key] || key;
}

export function localizeSpecificationValue(
  value: string | string[],
  language: Language
): string | string[] {
  if (language !== 'bg') return value;

  if (Array.isArray(value)) {
    return value.map((entry) => translateBgValue(entry));
  }

  return translateBgValue(value);
}
