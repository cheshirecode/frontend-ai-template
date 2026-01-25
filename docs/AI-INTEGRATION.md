# AI Integration Guide

This guide covers setting up and using AI providers in your application.

## Supported Providers

| Provider | Free Tier | Best For |
|----------|-----------|----------|
| Google Gemini | Yes (generous) | Default, cost-effective |
| OpenAI | No | Advanced reasoning |

## Setup

### 1. Get API Keys

**Google Gemini** (Recommended - Free tier available):
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create a new API key
3. Add to `.env.local`:
   ```
   GOOGLE_GENERATIVE_AI_API_KEY=your_key_here
   ```

**OpenAI**:
1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create a new API key
3. Add to `.env.local`:
   ```
   OPENAI_API_KEY=sk-your_key_here
   ```

### 2. Configure Default Provider (Optional)

```bash
# .env.local
AI_DEFAULT_PROVIDER=gemini  # or 'openai'
```

## Usage

### Basic Chat

```typescript
import { useChat } from '@/hooks/chat/useChat'
import { useAIManager } from '@/hooks/composed/useAIManager'

function MyComponent() {
  const { aiProvider, isFastMode } = useAIManager()
  const { messages, sendMessage, isLoading } = useChat(isFastMode, aiProvider)

  const handleSend = async () => {
    await sendMessage('Hello, AI!')
  }

  return (
    <div>
      {messages.map(m => <p key={m.id}>{m.content}</p>)}
      <button onClick={handleSend} disabled={isLoading}>
        Send
      </button>
    </div>
  )
}
```

### Direct API Usage

```typescript
// POST /api/ai
const response = await fetch('/api/ai', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: 'What is 2 + 2?',
    provider: 'gemini',  // optional
    systemPrompt: 'You are a math tutor.'  // optional
  })
})

const data = await response.json()
console.log(data.response)  // "4"
```

### Using AIService Directly

```typescript
import { AIService } from '@/lib/ai-service'

const ai = new AIService('gemini')

// Chat
const response = await ai.chat('Hello!', 'You are a helpful assistant.')

// Summarize
const summary = await ai.summarize('Long text here...')

// Analyze
const analysis = await ai.analyze('Code or text to analyze...')
```

## Provider Selection

The system automatically selects providers based on availability:

```
1. Use explicitly requested provider
2. Fallback to Gemini (if available)
3. Fallback to OpenAI (if available)
4. Error if no providers configured
```

## Streaming Responses

For real-time streaming (not yet implemented in template):

```typescript
// POST /api/ai with stream: true
const response = await fetch('/api/ai', {
  method: 'POST',
  body: JSON.stringify({
    message: 'Tell me a story',
    stream: true
  })
})

// Use the Vercel AI SDK stream reader
const reader = response.body.getReader()
// ...process stream
```

## Adding New Providers

1. Install provider SDK:
   ```bash
   npm install @ai-sdk/anthropic
   ```

2. Update `app/lib/ai-service.ts`:
   ```typescript
   import { anthropic } from '@ai-sdk/anthropic'

   const MODELS = {
     // ...existing
     anthropic: {
       structured: 'claude-3-opus-20240229',
       text: 'claude-3-sonnet-20240229',
       fast: 'claude-3-haiku-20240307'
     }
   }

   export function isProviderAvailable(provider: AIProvider): boolean {
     switch (provider) {
       // ...existing
       case 'anthropic':
         return !!process.env.ANTHROPIC_API_KEY
     }
   }

   export function getModel(provider: AIProvider, type: ModelType) {
     switch (provider) {
       // ...existing
       case 'anthropic':
         return anthropic(MODELS.anthropic[type])
     }
   }
   ```

3. Add environment variable:
   ```bash
   ANTHROPIC_API_KEY=sk-ant-your_key_here
   ```

## Best Practices

1. **Use Gemini for development** - Free tier is generous
2. **Handle errors gracefully** - AI providers can fail
3. **Set appropriate timeouts** - Long responses can timeout
4. **Cache responses** - For repeated queries
5. **Rate limit** - Prevent abuse of paid APIs

## Troubleshooting

### "No AI provider configured"
- Ensure at least one API key is set in `.env.local`
- Restart the dev server after adding keys

### "Rate limit exceeded"
- Gemini: Wait or upgrade to paid tier
- OpenAI: Check usage dashboard

### Slow responses
- Try a faster model (e.g., gemini-2.0-flash)
- Check network connectivity
- Consider caching frequently asked questions
