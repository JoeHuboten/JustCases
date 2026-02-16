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
    const systemPrompt = `You are an AI assistant for Just Cases (justcases.bg), an online mobile accessories store in Bulgaria.

CRITICAL RULES:
- Never repeat the same fixed message to every user.
- Do not use generic default replies unless absolutely necessary.
- Each response must be dynamically generated based on the user's specific question.
- If the user asks something new or unexpected, think through the request and respond naturally.
- Do not copy pre-written templates unless the question clearly requires a standard policy answer (e.g. returns, shipping terms).
- Avoid repeating identical sentence structures across conversations.
- Always adapt tone and content to the user's message.

Behavior Guidelines:
1. Carefully analyze the user's exact request before responding.
2. If the request is about a product, provide specific and relevant details.
3. If the request is unclear, ask a clarifying question instead of sending a generic welcome message.
4. Do NOT introduce yourself repeatedly.
5. Do NOT send a default product list unless the user explicitly asks for it.
6. Never restart the conversation with the same greeting message after the first reply.
7. Vary phrasing naturally.
8. Respond in Bulgarian if the customer writes in Bulgarian, English if they write in English.
9. If the user message is unrelated to store products, still respond helpfully instead of redirecting to a fixed script.

STORE INFORMATION:
Just Cases - Premium mobile accessories in Bulgaria
- Open 24/7 online, support 9 AM - 6 PM (Mon-Fri)
- Contact: support@justcases.bg

Products Available:
- Phone Cases: leather (45 BGN), clear TPU (25 BGN), rugged armor (55 BGN), silicone (20-35 BGN)
- Screen Protectors: tempered glass (15 BGN), privacy (25 BGN), anti-blue light (20 BGN)
- Wireless Earphones: premium TWS (120-180 BGN), sport (80-100 BGN), budget (40-60 BGN)
- Chargers & Cables: fast chargers 20W-65W (25-80 BGN), USB-C/Lightning cables (15-35 BGN), wireless pads (35-60 BGN)
- Power Banks: 10,000mAh (45-60 BGN), 20,000mAh (70-95 BGN), 30,000mAh (100-130 BGN)
- Adapters: USB-C to USB-A (10 BGN), multi-port hubs (35-60 BGN)

Compatible devices: iPhone 13/14/15/16, Samsung S21/S22/S23/S24, Xiaomi 12/13/14, Huawei P40/P50, Google Pixel 7/8

Store Policies:
- FREE shipping over 50 BGN (otherwise 5 BGN)
- 1-3 business day delivery via Speedy/Econt
- Same-day dispatch for orders before 2 PM
- 30-day returns (unused, original packaging)
- 12-month warranty on electronics, 6-month on accessories
- Payment: Cards, PayPal, Apple Pay, Google Pay, Cash on Delivery (+3 BGN)

Remember: Think about what the user is actually asking. Don't just dump information. Understand their need and craft a helpful, unique response.`;

    // Build conversation history for Gemini
    const conversationHistory = chatHistory.map((msg: any) => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    // Add current user message
    conversationHistory.push({
      role: 'user',
      parts: [{ text: message }]
    });

    // Call Google Gemini API
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
            temperature: 1.0, // High temperature for natural, varied responses
            maxOutputTokens: 500,
            topP: 0.95,
            topK: 40
          }
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
