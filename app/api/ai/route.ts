import { NextRequest, NextResponse } from 'next/server'
import { generateText, streamText } from 'ai'
import { getModel, AIProvider, isProviderAvailable } from '@/lib/ai-service'
import { logger } from '@/lib/logger'

interface ChatRequest {
  message: string
  provider?: AIProvider
  stream?: boolean
  systemPrompt?: string
}

/**
 * AI Chat API endpoint
 * Supports multiple providers and streaming responses
 */
export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json()
    const { message, provider = 'gemini', stream = false, systemPrompt } = body

    // Validate input
    if (!message?.trim()) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Check provider availability
    if (!isProviderAvailable(provider)) {
      logger.warn(`Provider ${provider} not available, falling back`)

      // Try fallback providers
      const fallbackProviders: AIProvider[] = ['gemini', 'openai']
      const availableProvider = fallbackProviders.find(p => isProviderAvailable(p))

      if (!availableProvider) {
        return NextResponse.json(
          { error: 'No AI provider configured. Please set GOOGLE_GENERATIVE_AI_API_KEY or OPENAI_API_KEY' },
          { status: 503 }
        )
      }
    }

    const model = getModel(provider, 'text')
    const system = systemPrompt || 'You are a helpful AI assistant. Be concise and friendly.'

    logger.info('Processing AI request', { provider, stream, messageLength: message.length })

    if (stream) {
      // Streaming response
      const result = await streamText({
        model,
        prompt: message,
        system
      })

      return result.toTextStreamResponse()
    }

    // Non-streaming response
    const result = await generateText({
      model,
      prompt: message,
      system
    })

    logger.info('AI response generated', {
      provider,
      responseLength: result.text.length
    })

    return NextResponse.json({
      response: result.text,
      provider,
      usage: result.usage
    })

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    logger.error('AI API error', { error: errorMessage })

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
