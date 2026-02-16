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
    const systemPrompt = `You are a friendly customer support assistant for Just Cases (justcases.bg), a mobile accessories store in Bulgaria. Be natural, conversational, and helpful - not robotic.

ABOUT THE STORE:
Just Cases sells premium mobile accessories online in Bulgaria. We're open 24/7 online, with support available 9 AM - 6 PM (Mon-Fri).

WHAT WE SELL:
- Phone Cases: leather (45 BGN), clear TPU (25 BGN), rugged armor (55 BGN), silicone (20-35 BGN)
- Screen Protectors: tempered glass (15 BGN), privacy (25 BGN), anti-blue light (20 BGN)
- Wireless Earphones: premium TWS (120-180 BGN), sport (80-100 BGN), budget (40-60 BGN)
- Chargers & Cables: fast chargers 20W-65W (25-80 BGN), USB-C/Lightning cables (15-35 BGN), wireless pads (35-60 BGN)
- Power Banks: 10,000mAh (45-60 BGN), 20,000mAh (70-95 BGN), 30,000mAh (100-130 BGN)
- Adapters: USB-C to USB-A (10 BGN), multi-port hubs (35-60 BGN)

We support: iPhone 13/14/15/16, Samsung S21/S22/S23/S24, Xiaomi 12/13/14, Huawei P40/P50, Google Pixel 7/8

KEY POLICIES:
- FREE shipping over 50 BGN (otherwise 5 BGN)
- 1-3 business day delivery via Speedy/Econt
- Same-day dispatch for orders before 2 PM
- 30-day returns (unused, original packaging)
- 12-month warranty on electronics, 6-month on accessories
- Payment: Cards, PayPal, Apple Pay, Google Pay, Cash on Delivery (+3 BGN)
- Contact: support@justcases.bg

HOW TO RESPOND:
- Be conversational and natural, not scripted
- Respond in Bulgarian if the customer writes in Bulgarian, English if they write in English
- Use the customer's name if you know it
- Think about what they're really asking and give a thoughtful answer
- If they ask something unrelated to our store (like math, weather, general questions), politely let them know you're here to help with Just Cases products and orders
- Don't just list facts - understand their need and help them find the right solution
- Keep responses concise but complete (2-4 sentences usually)
- Be warm and helpful, like talking to a friend

Remember: You're here to genuinely help customers, not just recite information. Listen to what they need and respond naturally.`;

    // Build conversation history for OpenAI
    const messages = [
      {
        role: 'system',
        content: systemPrompt
      },
      ...chatHistory.map((msg: any) => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
      })),
      {
        role: 'user',
        content: message
      }
    ];

    // Call OpenAI ChatGPT API
    const response = await fetch(
      'https://api.openai.com/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: messages,
          temperature: 0.9, // Higher temperature for more natural, varied responses
          max_tokens: 500, // Longer responses for thoughtful answers
          presence_penalty: 0.6, // Encourage diverse responses
          frequency_penalty: 0.3 // Reduce repetition
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', errorText);
      return NextResponse.json({
        reply: generateFallbackResponse(message, userName),
        isAI: false
      });
    }

    const data = await response.json();
    const aiReply = data.choices?.[0]?.message?.content || generateFallbackResponse(message, userName);

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

// Simple fallback when AI is not available
function generateFallbackResponse(message: string, userName: string): string {
  const lowerMessage = message.toLowerCase();
  
  // Basic greeting response
  if (lowerMessage.includes('здравей') || lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
    return `Здравейте${userName !== 'Customer' ? ', ' + userName : ''}! 👋 Добре дошли в Just Cases - вашият магазин за качествени мобилни аксесоари. Как мога да ви помогна днес?`;
  }
  
  // Off-topic detection
  const offTopicPatterns = [
    /\d+\s*[\+\-\*\/×÷]\s*\d+/,
    /колко (е|са|прави).*[\+\-\*\/]/i,
    /what is.*[\+\-\*\/]/i,
    /(време|weather|температура|новини|news|политика|рецепта|медицинск|правен)/i,
  ];
  
  if (offTopicPatterns.some(pattern => pattern.test(lowerMessage))) {
    return 'Извинявам се, но мога да помагам само с въпроси относно Just Cases - нашите продукти, поръчки, доставка и политики. Имате ли такъв въпрос? 😊';
  }
  
  // Generic helpful response
  return `Благодаря за съобщението! Мога да ви помогна с информация за нашите калъфи, защитни стъкла, слушалки, зарядни устройства и други аксесоари. Също така можете да питате за цени, доставка, връщане или поръчки. За какво се интересувате?`;
}
