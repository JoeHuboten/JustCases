# AI Chat Assistant Setup Guide

The live chat on Just Cases now features an AI-powered assistant that can help customers 24/7 with questions about products, shipping, returns, and orders.

## Features

✨ **Smart AI Responses**
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

### 1. Get OpenAI API Key (Optional)

The chat works without an API key, but for full AI capabilities:

1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create an account or sign in
3. Click "Create new secret key"
4. Copy the key (starts with `sk-...`)

### 2. Add to Environment Variables

Add to your `.env` or `.env.local` file:

```env
OPENAI_API_KEY="sk-your-api-key-here"
```

### 3. Test the Chat

1. Open your website
2. Click the chat button (bottom right)
3. Enter your name and email
4. Start chatting!

## How It Works

### With API Key (Full AI)
- Uses OpenAI's GPT-4o-mini model
- Context-aware responses
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
  model: 'gpt-4o-mini',  // or 'gpt-4' for better quality
  max_tokens: 300,        // length of responses
  temperature: 0.7,       // creativity (0-1)
  presence_penalty: 0.6,  // avoid repetition
  frequency_penalty: 0.3  // word variety
}
```

## Cost Considerations

Using **gpt-4o-mini** (recommended):
- ~$0.00015 per 1,000 input tokens
- ~$0.0006 per 1,000 output tokens
- Average cost per chat: $0.001-0.005

For a small store with 100 chats/day:
- Monthly cost: ~$3-15

## Troubleshooting

### Chat shows generic responses
- Check if `OPENAI_API_KEY` is set correctly
- Verify API key is valid on OpenAI platform
- Check server logs for API errors

### API rate limits
- OpenAI has rate limits based on your plan
- Consider implementing caching for common questions
- Add rate limiting to prevent abuse

### Slow responses
- Check your network connection
- OpenAI API usually responds in 1-3 seconds
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
- Check the [OpenAI API Docs](https://platform.openai.com/docs)
- Review server logs
- Test with fallback mode first
