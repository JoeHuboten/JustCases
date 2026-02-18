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
    console.log('API Key present:', !!apiKey, 'Length:', apiKey?.length);
    
    if (!apiKey) {
      console.error('No API key configured');
      // Fallback to rule-based responses if no API key
      return NextResponse.json({
        reply: generateFallbackResponse(message, userName),
        isAI: false
      });
    }

    // Build conversation context
    const systemPrompt = `You are an AI assistant for Just Cases (justcases.bg), a mobile accessories store in Bulgaria.

🚨 ABSOLUTE CRITICAL RULE - READ THIS FIRST:
YOU MUST NEVER, EVER USE THE SAME RESPONSE TWICE. Every single reply must be COMPLETELY UNIQUE and SPECIFICALLY tailored to what THIS user is asking RIGHT NOW. If you find yourself about to write something that sounds like a template or a generic answer - STOP and rewrite it differently.

❌ FORBIDDEN BEHAVIORS (You will be penalized for these):
- Starting every response with "Здравейте! Добре дошли в Just Cases"
- Listing all products unprompted
- Using phrases like "Мога да ви помогна с..." repeatedly
- Sending the same greeting to different users
- Copy-pasting information from the store data below
- Using bullet points for every answer
- Ending with "Как мога да ви помогна?" every time

✅ WHAT YOU MUST DO INSTEAD:
- Read what the user ACTUALLY asked
- Think about their specific situation
- Craft a unique, conversational response
- Use different words and structures each time
- Be brief and direct when appropriate
- Only give information they asked for
- Vary your tone, length, and style naturally

EXAMPLE - Bad (repetitive):
User: "имате ли калъфи"
Bad: "Здравейте! Добре дошли в Just Cases. Предлагаме калъфи: кожени (45 BGN), силиконови (20-35 BGN), rugged armor (55 BGN). За кой телефон?"

EXAMPLE - Good (unique):
User: "имате ли калъфи"  
Good: "Да, имаме няколко вида - от евтини силиконови до яки кожени с джобчета за карти. Какъв телефон имаш?"

STORE DATA (use only when relevant to the question):
Just Cases - justcases.bg
Contact: support@justcases.bg

Products: Phone cases (20-55 BGN), screen protectors (10-25 BGN), earphones (40-180 BGN), chargers/cables (15-80 BGN), power banks (45-130 BGN), adapters (10-60 BGN)

Supported phones: iPhone 13/14/15/16, Samsung S21/S22/S23/S24, Xiaomi 12/13/14, Huawei P40/P50, Google Pixel 7/8

Policies: Free shipping over 50 BGN, 1-3 day delivery, 30-day returns, 12-month warranty on electronics

Language: Match the user's language (Bulgarian/English)

NOW RESPOND TO THE USER - Make it unique, natural, and directly answer what they asked. NO TEMPLATES!`;

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
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-001:generateContent?key=${apiKey}`;
    console.log('Calling Gemini API...');
    console.log('Message:', message);
    
    const requestBody = {
      systemInstruction: {
        parts: [{ text: systemPrompt }]
      },
      contents: conversationHistory,
      generationConfig: {
        temperature: 1.2, // High creativity but within safe range
        maxOutputTokens: 400,
        topP: 0.95,
        topK: 64
      },
      safetySettings: [
        {
          category: 'HARM_CATEGORY_HARASSMENT',
          threshold: 'BLOCK_NONE'
        },
        {
          category: 'HARM_CATEGORY_HATE_SPEECH',
          threshold: 'BLOCK_NONE'
        },
        {
          category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
          threshold: 'BLOCK_NONE'
        },
        {
          category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
          threshold: 'BLOCK_NONE'
        }
      ]
    };
    
    console.log('Request body contents length:', JSON.stringify(requestBody.contents).length);
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('Response status:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      return NextResponse.json({
        reply: generateFallbackResponse(message, userName),
        isAI: false
      });
    }

    const data = await response.json();
    
    // Log detailed response for debugging
    console.log('Gemini response:', JSON.stringify(data, null, 2));
    
    // Check if response was blocked by safety filters
    if (data.candidates?.[0]?.finishReason === 'SAFETY') {
      console.warn('Response blocked by safety filters');
      const aiReply = "Извинявам се, но не мога да отговоря на този въпрос. Мога да ви помогна с информация за продукти, поръчки и доставка. Имате ли друг въпрос?";
      return NextResponse.json({
        reply: aiReply,
        isAI: true
      });
    }
    
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

// Minimal fallback when AI is unavailable
function generateFallbackResponse(message: string, userName: string): string {
  return `Здравейте! Моментално имаме технически проблем с AI асистента. Моля, изпратете въпроса си на support@justcases.bg или опитайте отново след малко. Благодаря за разбирането!`;
}
