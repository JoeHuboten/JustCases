import { NextRequest, NextResponse } from 'next/server';

// AI Chat endpoint for intelligent customer support
export async function POST(req: NextRequest) {
  try {
    const { message, chatHistory = [], userName = 'Customer' } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Check if Gemini API key is configured
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Fallback to rule-based responses if no API key
      return NextResponse.json({
        reply: generateFallbackResponse(message, userName),
        isAI: false
      });
    }

    // Build conversation context
    const systemPrompt = `You are a helpful and knowledgeable customer support assistant for Just Cases (justcases.bg), a premium mobile accessories e-commerce store in Bulgaria. You provide accurate, friendly, and professional assistance.

STORE INFORMATION:
━━━━━━━━━━━━━━━━━
Company: Just Cases
Website: justcases.bg
Location: Bulgaria
Languages: Bulgarian (primary), English
Business Hours: Online store open 24/7, support 9 AM - 6 PM (Mon-Fri)

PRODUCT CATALOG:
━━━━━━━━━━━━━━━━━
1. Phone Cases (калъфи за телефон)
   - Premium Leather Cases (genuine leather, card slots) - 45 BGN
   - Crystal Clear Cases (ultra-thin TPU) - 25 BGN
   - Rugged Armor Cases (military-grade protection) - 55 BGN
   - Silicone Cases (soft touch, various colors) - 20-35 BGN
   - Compatible with: iPhone 14/15/16, Samsung S23/S24, Xiaomi, Huawei, Google Pixel

2. Screen Protectors (защитни стъкла)
   - Tempered Glass (9H hardness) - 15 BGN
   - Privacy Screen Protectors - 25 BGN
   - Anti-Blue Light Protectors - 20 BGN
   - Camera Lens Protectors - 10 BGN

3. Wireless Earphones (безжични слушалки)
   - Premium TWS Earbuds - 120-180 BGN
   - Sport Earphones (waterproof) - 80-100 BGN
   - Budget TWS - 40-60 BGN
   - Features: Active Noise Cancelling, Bluetooth 5.3, USB-C charging

4. Chargers & Cables (зарядни и кабели)
   - Fast Chargers 20W-65W - 25-80 BGN
   - USB-C Cables (braided, various lengths) - 15-30 BGN
   - Lightning Cables (MFi certified) - 20-35 BGN
   - Multi-port Chargers - 45-90 BGN
   - Wireless Charging Pads (10W-15W) - 35-60 BGN

5. Power Banks (преносими батерии)
   - 10,000mAh - 45-60 BGN
   - 20,000mAh - 70-95 BGN
   - 30,000mAh - 100-130 BGN
   - Features: Fast charging, multiple ports, LED display

6. Adapters (адаптери)
   - USB-C to USB-A adapters - 10 BGN
   - Multi-port hubs - 35-60 BGN
   - Travel adapters - 25 BGN

SHIPPING & DELIVERY (Доставка):
━━━━━━━━━━━━━━━━━━━━━━━━━
- FREE shipping on orders over 50 BGN
- Standard shipping (under 50 BGN): 5 BGN
- Delivery time: 1-3 business days
- Courier: Speedy, Econt
- Delivery to: Home, office, or Econt/Speedy office
- Order tracking: Available via email and SMS
- Same-day dispatch for orders before 2 PM

PAYMENT METHODS (Начини на плащане):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Credit/Debit Card (Visa, Mastercard) - instant
- PayPal - instant
- Apple Pay - instant
- Google Pay - instant
- Cash on Delivery (наложен платеж) - +3 BGN fee
- Bank Transfer - 1-2 business days
All online payments are 100% secure with SSL encryption

RETURNS & REFUNDS (Връщане и възстановяване):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- 30-day return policy
- Products must be unused and in original packaging
- Free return shipping if product is defective
- Refund processed within 3-5 business days
- Exchange available for different size/color
- To initiate return: Contact support with order number

WARRANTY & GUARANTEES (Гаранция):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- All electronic products: 12-month warranty
- Cases and accessories: 6-month warranty
- Defective products: Free replacement or refund
- Warranty covers manufacturing defects only

ORDER TRACKING (Проследяване на поръчка):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Check "My Orders" section in user account
- Tracking number sent via email and SMS
- Real-time updates from courier
- Estimated delivery date provided
- Contact support with order number for assistance

CUSTOMER SUPPORT (Поддръжка):
━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Email: support@justcases.bg (response within 24 hours)
- Phone: Available in contact section
- Live Chat: AI assistant 24/7, human agents Mon-Fri 9 AM-6 PM
- Social Media: Facebook, Instagram

COMMON QUESTIONS & ANSWERS:
━━━━━━━━━━━━━━━━━━━━━━━━━━
Q: Do you have cases for [specific phone model]?
A: We support iPhone 13/14/15/16, Samsung S21/S22/S23/S24, Xiaomi 12/13/14, Huawei P40/P50, Google Pixel 7/8. Ask customer to specify their exact model.

Q: When will my order arrive?
A: Orders ship same day if placed before 2 PM. Delivery takes 1-3 business days. Provide tracking number if they have order number.

Q: Can I change my order?
A: Yes, if order hasn't shipped yet. Contact us immediately with order number. If already shipped, they can return it within 30 days.

Q: Are your screen protectors easy to apply?
A: Yes, they include installation kit and easy-follow instructions. Bubble-free application guaranteed.

Q: Do wireless earphones work with my phone?
A: Yes, all our wireless earphones use Bluetooth 5.0+ and work with any smartphone.

Q: Is wireless charging compatible with cases?
A: Most of our cases support wireless charging. Check product specifications or ask about specific case.

YOUR COMMUNICATION STYLE:
━━━━━━━━━━━━━━━━━━━━━━━
✓ Be friendly, warm, and professional
✓ Use customer's name when known
✓ Respond in Bulgarian if customer writes in Bulgarian
✓ Use clear, concise language (2-4 sentences)
✓ Provide specific prices, timeframes, and details
✓ If you don't know something specific, say: "Нека проверя това с нашия екип и ще се свържа с вас скоро. Можете да изпратите имейл на support@justcases.bg за детайлна информация."
✓ Always be positive and solution-oriented
✓ End with a helpful question or call-to-action

WHAT NOT TO DO:
━━━━━━━━━━━━━━━━━
✗ Don't make up product prices or specifications
✗ Don't promise things not in this information
✗ Don't provide medical or legal advice
✗ Don't share personal opinions about competitors
✗ Don't give shipping dates beyond 3 business days without checking

Remember: Your goal is to help customers find the perfect accessories, answer their questions accurately, and ensure they have a great shopping experience!`;

    // Build conversation history for Gemini
    const conversationHistory = chatHistory
      .map((msg: any) => {
        const role = msg.sender === 'user' ? 'user' : 'model';
        return {
          role,
          parts: [{ text: msg.text }]
        };
      });

    // Add current user message
    conversationHistory.push({
      role: 'user',
      parts: [{ text: message }]
    });

    // Call Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: systemPrompt }]
          },
          contents: conversationHistory,
          generationConfig: {
            temperature: 0.5, // Lower temperature for more accurate, factual responses
            maxOutputTokens: 400, // Longer responses for detailed answers
            topP: 0.9, // More focused responses
            topK: 40,
          },
          safetySettings: [
            {
              category: 'HARM_CATEGORY_HARASSMENT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            },
            {
              category: 'HARM_CATEGORY_HATE_SPEECH',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            },
            {
              category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            },
            {
              category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            }
          ]
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', errorText);
      return NextResponse.json({
        reply: generateFallbackResponse(message, userName),
        isAI: false
      });
    }

    const data = await response.json();
    const aiReply = data.candidates?.[0]?.content?.parts?.[0]?.text || generateFallbackResponse(message, userName);

    return NextResponse.json({
      reply: aiReply,
      isAI: true
    });

  } catch (error) {
    console.error('Chat AI Error:', error);
    return NextResponse.json({
      reply: 'Извинявам се, имам временни технически проблеми. Моля, опитайте отново след малко.',
      isAI: false
    }, { status: 500 });
  }
}

// Fallback rule-based responses when AI is not available
function generateFallbackResponse(message: string, userName: string): string {
  const lowerMessage = message.toLowerCase();
  
  // Greeting
  if (lowerMessage.includes('здравей') || lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('добър')) {
    return `Здравейте${userName !== 'Customer' ? ', ' + userName : ''}! 👋 Добре дошли в Just Cases. Как мога да ви помогна днес? Можете да попитате за продукти, цени, доставка или поръчки.`;
  }
  
  // Price questions
  if (lowerMessage.includes('цена') || lowerMessage.includes('колко струва') || lowerMessage.includes('price') || lowerMessage.includes('cost')) {
    return 'Нашите продукти са с отлични цени: Калъфи 20-55 лв, Защитни стъкла 10-25 лв, Слушалки 40-180 лв, Зарядни 15-80 лв, Power Banks 45-130 лв. За кой продукт се интересувате?';
  }
  
  // Shipping questions
  if (lowerMessage.includes('доставка') || lowerMessage.includes('shipping') || lowerMessage.includes('колко време') || lowerMessage.includes('кога ще пристигне')) {
    return 'Доставката е БЕЗПЛАТНА при поръчки над 50 лв! Под 50 лв - само 5 лв. Експресна доставка за 1-3 работни дни със Speedy или Econt. Поръчки до 14:00 се изпращат същия ден. 📦';
  }
  
  // Return/warranty questions
  if (lowerMessage.includes('връщане') || lowerMessage.includes('return') || lowerMessage.includes('гаранция') || lowerMessage.includes('warranty') || lowerMessage.includes('замяна')) {
    return 'Имаме 30-дневна политика за връщане на неизползвани продукти. Всички електронни устройства имат 12-месечна гаранция. При дефект - безплатна замяна или възстановяване на сумата до 5 дни. Какъв проблем имате?';
  }
  
  // Payment questions
  if (lowerMessage.includes('плащане') || lowerMessage.includes('payment') || lowerMessage.includes('как да платя') || lowerMessage.includes('карта')) {
    return 'Приемаме: 💳 Карта (Visa/Mastercard), PayPal, Apple Pay, Google Pay - моментално обработване. 📦 Наложен платеж (+3 лв) при доставка. Всички плащания са 100% защитени. Как предпочитате да платите?';
  }
  
  // Product questions - cases
  if (lowerMessage.includes('калъф') || lowerMessage.includes('кейс') || lowerMessage.includes('case') || lowerMessage.includes('протектор')) {
    return 'Предлагаме: Premium кожени калъфи (45 лв), Прозрачни силиконови (25 лв), Защитни armor калъфи (55 лв). Поддържаме iPhone 14/15/16, Samsung S23/S24, Xiaomi, Huawei. За кой модел телефон търсите?';
  }
  
  // Product questions - screen protectors
  if (lowerMessage.includes('стъкло') || lowerMessage.includes('екран') || lowerMessage.includes('screen')) {
    return 'Защитни стъкла: Tempered Glass 9H (15 лв), Privacy стъкла (25 лв), Anti-Blue Light (20 лв). Включват инсталационен комплект за лесно поставяне без мехурчета. За кой телефон ви трябва?';
  }
  
  // Product questions - earphones
  if (lowerMessage.includes('слушалки') || lowerMessage.includes('earphones') || lowerMessage.includes('наушници') || lowerMessage.includes('bluetooth')) {
    return 'Безжични слушалки: Premium TWS с ANC 120-180 лв, Спортни водоустойчиви 80-100 лв, Budget TWS 40-60 лв. Всички с Bluetooth 5.3, USB-C зареждане. Търсите спортни или за ежедневие?';
  }
  
  // Product questions - chargers
  if (lowerMessage.includes('зарядно') || lowerMessage.includes('charger') || lowerMessage.includes('кабел') || lowerMessage.includes('cable')) {
    return 'Бързи зарядни 20W-65W (25-80 лв), USB-C/Lightning кабели (15-35 лв), Безжични зарядни пад 10W-15W (35-60 лв). За iPhone или Android устройство?';
  }
  
  // Product questions - power banks
  if (lowerMessage.includes('power bank') || lowerMessage.includes('батерия') || lowerMessage.includes('преносима') || lowerMessage.includes('powerbank')) {
    return 'Power Banks: 10,000mAh (45-60 лв), 20,000mAh (70-95 лв), 30,000mAh (100-130 лв). С бързо зареждане, множество портове и LED дисплей. Каква капацитет ви трябва?';
  }
  
  // Phone model questions
  if (lowerMessage.includes('iphone') || lowerMessage.includes('samsung') || lowerMessage.includes('xiaomi') || lowerMessage.includes('huawei')) {
    return 'Имаме аксесоари за: iPhone 13/14/15/16 (всички модели), Samsung S21/S22/S23/S24, Xiaomi 12/13/14, Huawei P40/P50, Google Pixel 7/8. Уточнете точния модел на вашия телефон за най-добри препоръки.';
  }
  
  // Order tracking
  if (lowerMessage.includes('поръчка') || lowerMessage.includes('order') || lowerMessage.includes('проследяване') || lowerMessage.includes('track') || lowerMessage.includes('къде е')) {
    return 'Проследете поръчката си в секция "Моите поръчки" след влизане в профила си. Ще получите tracking номер по имейл и SMS. Имате ли номер на поръчка?';
  }
  
  // Stock/availability questions
  if (lowerMessage.includes('наличност') || lowerMessage.includes('налични') || lowerMessage.includes('stock') || lowerMessage.includes('available') || lowerMessage.includes('има ли')) {
    return 'Повечето продукти са налични и се изпращат същия ден при поръчка до 14:00. За конкретни модели/цветове, моля уточнете какво търсите и ще проверя веднага.';
  }
  
  // Help/support questions
  if (lowerMessage.includes('помощ') || lowerMessage.includes('help') || lowerMessage.includes('проблем') || lowerMessage.includes('въпрос') || lowerMessage.includes('support')) {
    return `${userName !== 'Customer' ? userName + ', ' : ''}с удоволствие ще ви помогна! 😊 Можете да ме питате за продукти, цени, доставка, плащане или поръчки. Какво конкретно ви интересува?`;
  }
  
  // Contact questions
  if (lowerMessage.includes('контакт') || lowerMessage.includes('contact') || lowerMessage.includes('телефон') || lowerMessage.includes('имейл') || lowerMessage.includes('email')) {
    return 'Свържете се с нас: 📧 support@justcases.bg, 💬 Live chat (24/7 AI, 9-18ч човек Пн-Пт). Отговаряме на имейли до 24 часа. Как мога да ви помогна направо сега?';
  }
  
  // Discount/promo questions
  if (lowerMessage.includes('отстъпка') || lowerMessage.includes('промоция') || lowerMessage.includes('discount') || lowerMessage.includes('promo') || lowerMessage.includes('намаление')) {
    return 'Имаме редовни промоции и намаления до 36%! Безплатна доставка при поръчки над 50 лв е постоянна оферта. Следете ни за специални оферти. Какво ви интересува?';
  }
  
  // Product questions - general
  if (lowerMessage.includes('продукт') || lowerMessage.includes('защита') || lowerMessage.includes('product')) {
    return 'Предлагаме широка гама от висококачествени аксесоари: Калъфи, Защитни стъкла, Слушалки, Зарядни, Power Banks, Кабели. За кой телефон търсите аксесоари?';
  }
  
  // Default response
  return `Благодаря за съобщението! Мога да ви помогна с информация за: 📱 Продукти и цени, 🚚 Доставка (1-3 дни), 💳 Плащане, 🔄 Връщане (30 дни), 📦 Проследяване на поръчки. За какво се интересувате?`;
}
