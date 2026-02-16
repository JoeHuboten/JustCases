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

    // Check if OpenAI API key is configured
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      // Fallback to rule-based responses if no API key
      return NextResponse.json({
        reply: generateFallbackResponse(message, userName),
        isAI: false
      });
    }

    // Build conversation context
    const systemPrompt = `You are a helpful customer support assistant for Just Cases, a premium mobile accessories e-commerce store in Bulgaria. 

Store Information:
- We sell phone cases, screen protectors, wireless earphones, chargers, cables, power banks, and adapters
- We offer free shipping on orders over 50 BGN
- Standard delivery takes 2-3 business days
- We accept payment via card, PayPal, Apple Pay, and cash on delivery
- 30-day return policy for unused items
- Warranty on all electronic products
- Bulgarian language is primary, but you can respond in English if needed

Your role:
- Be friendly, professional, and helpful
- Answer questions about products, shipping, returns, and orders
- Help customers find the right accessories for their devices
- Provide accurate information about prices and availability
- If you don't know something, politely say so and offer to connect them with a human agent
- Keep responses concise and clear (2-4 sentences max)

Respond in Bulgarian if the customer writes in Bulgarian, otherwise match their language.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...chatHistory.map((msg: any) => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
      })),
      { role: 'user', content: message }
    ];

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // Using cost-effective model
        messages: messages,
        max_tokens: 300,
        temperature: 0.7,
        presence_penalty: 0.6,
        frequency_penalty: 0.3,
      }),
    });

    if (!response.ok) {
      console.error('OpenAI API error:', await response.text());
      return NextResponse.json({
        reply: generateFallbackResponse(message, userName),
        isAI: false
      });
    }

    const data = await response.json();
    const aiReply = data.choices[0]?.message?.content || generateFallbackResponse(message, userName);

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
  
  // Shipping questions
  if (lowerMessage.includes('доставка') || lowerMessage.includes('shipping') || lowerMessage.includes('колко време')) {
    return 'Стандартната доставка отнема 2-3 работни дни. Безплатна доставка при поръчки над 50 лв. Имате ли конкретна поръчка, която искате да проследите?';
  }
  
  // Return/warranty questions
  if (lowerMessage.includes('връщане') || lowerMessage.includes('return') || lowerMessage.includes('гаранция') || lowerMessage.includes('warranty')) {
    return 'Имаме 30-дневна политика за връщане на неизползвани продукти и гаранция на всички електронни артикули. Какъв проблем имате с вашия продукт?';
  }
  
  // Payment questions
  if (lowerMessage.includes('плащане') || lowerMessage.includes('payment') || lowerMessage.includes('как да платя')) {
    return 'Приемаме плащане с карта, PayPal, Apple Pay и наложен платеж. Всички методи са напълно защитени. Как бихте искали да платите?';
  }
  
  // Product questions
  if (lowerMessage.includes('продукт') || lowerMessage.includes('калъф') || lowerMessage.includes('кейс') || lowerMessage.includes('case') || lowerMessage.includes('защита')) {
    return 'Предлагаме широка гама от калъфи за всички популярни телефонни модели, както и аксесоари като защитни стъкла, слушалки и зарядни устройства. За кой модел телефон търсите?';
  }
  
  // Order tracking
  if (lowerMessage.includes('поръчка') || lowerMessage.includes('order') || lowerMessage.includes('проследяване') || lowerMessage.includes('track')) {
    return 'Можете да проследите вашата поръчка на страницата "Моите поръчки" в профила си. Имате ли номер на поръчка, който искате да проверя?';
  }
  
  // Greeting
  if (lowerMessage.includes('здравей') || lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('помощ') || lowerMessage.includes('help')) {
    return `Здравейте${userName !== 'Customer' ? ', ' + userName : ''}! Радвам се да ви помогна с каквото имате нужда. Имате ли въпрос относно продукт, поръчка или доставка?`;
  }
  
  // Default response
  return 'Благодаря за вашето съобщение! Нашият екип прегледа въпроса ви. Можете ли да ми дадете малко повече детайли, за да ви помогна по-добре?';
}
