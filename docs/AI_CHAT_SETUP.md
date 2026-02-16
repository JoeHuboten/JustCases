# AI Chat Assistant Setup Guide

The live chat on Just Cases now features an AI-powered assistant using **Google Gemini** that can help customers 24/7 with questions about products, shipping, returns, and orders.

## Features

✨ **Smart AI Responses**
- Powered by Google's Gemini 1.5 Flash model
- Answers customer questions in real-time
- Understands context from chat history
- Responds in Bulgarian or English
- Knows about store policies, products, and shipping

🔄 **Fallback System**
- Works without API key using rule-based responses
- Graceful error handling
- Always provides helpful answers

🌍 **Multilingual Support**
- Primary language: Bulgarian
- Also supports English
- Automatically detects user language

## Setup

### 1. Get Google Gemini API Key (Optional)

The chat works without an API key, but for full AI capabilities:

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key

### 2. Add to Environment Variables

Add to your `.env` or `.env.local` file:

```env
GEMINI_API_KEY="your-api-key-here"
```

### 3. Test the Chat

1. Open your website
2. Click the chat button (bottom right)
3. Enter your name and email
4. Start chatting!

## How It Works

### With API Key (Full AI)
- Uses Google's Gemini 1.5 Flash model
- Fast and cost-effective responses
- Context-aware conversations
- Understands complex questions
- Maintains conversation history

### Without API Key (Fallback)
- Rule-based smart responses
- Handles common questions:
  - Shipping information
  - Return policy
  - Payment methods
  - Product inquiries
  - Order tracking

## API Endpoint

**POST** `/api/chat/ai`

Request body:
```json
{
  "message": "Какви телефонни калъфи имате?",
  "chatHistory": [...],
  "userName": "Ivan"
}
```

Response:
```json
{
  "reply": "Предлагаме широка гама от калъфи...",
  "isAI": true
}
```

## Customization

### Update Store Information

Edit the system prompt in [`app/api/chat/ai/route.ts`](../app/api/chat/ai/route.ts):

```typescript
const systemPrompt = `You are a helpful customer support assistant for Just Cases...

Store Information:
- Your store details here
- Shipping policies
- Return policies
- etc.
`;
```

### Add More Fallback Responses

Edit the `generateFallbackResponse()` function in the same file to add more rule-based responses for common questions.

### Adjust AI Behavior

Change these parameters in the API call:

```typescript
{
  temperature: 0.7,       // creativity (0-2)
  maxOutputTokens: 300,   // length of responses
  topP: 0.95,             // nucleus sampling
  topK: 40                // top-k sampling
}
```

## Cost Considerations

Using **Gemini 1.5 Flash** (recommended):
- **FREE tier**: 15 requests per minute, 1,500 requests per day
- Paid tier: Very affordable pricing
- Average cost per chat: FREE for most small stores

For a small store with 100 chats/day:
- Monthly cost: **FREE** (within free tier limits)

**Benefits of Gemini:**
- ✅ Generous free tier
- ✅ Fast responses
- ✅ Multilingual support
- ✅ No credit card required for free tier

## Troubleshooting

### Chat shows generic responses
- Check if `GEMINI_API_KEY` is set correctly
- Verify API key is valid on Google AI Studio
- Check server logs for API errors

### API rate limits
- Free tier: 15 requests/minute, 1,500/day
- Consider implementing caching for common questions
- Upgrade to paid tier if needed

### Slow responses
- Check your network connection
- Gemini API usually responds in 1-2 seconds
- Consider showing typing indicator longer

## Features Coming Soon

- [ ] Human agent handoff
- [ ] Sentiment analysis
- [ ] Order status integration
- [ ] Product recommendations
- [ ] Multi-language support expansion
- [ ] Chat analytics dashboard

## Support

For issues or questions:
- Check the [Gemini API Docs](https://ai.google.dev/docs)
- Visit [Google AI Studio](https://aistudio.google.com)
- Review server logs
- Test with fallback mode first
