import { generateText } from 'ai'
import { openai } from '@ai-sdk/openai'
import { google } from '@ai-sdk/google'

// AI Provider types
export type AIProvider = 'openai' | 'gemini'
export type ModelType = 'structured' | 'text' | 'fast'

// Model configurations for each provider
const MODELS = {
  openai: {
    structured: 'gpt-4o-mini',
    text: 'gpt-3.5-turbo',
    fast: 'gpt-3.5-turbo'
  },
  gemini: {
    structured: 'gemini-2.0-flash',
    text: 'gemini-2.0-flash',
    fast: 'gemini-2.0-flash'
  }
} as const

/**
 * Check if provider API key is available
 */
export function isProviderAvailable(provider: AIProvider): boolean {
  switch (provider) {
    case 'openai':
      return !!process.env.OPENAI_API_KEY
    case 'gemini':
      return !!process.env.GOOGLE_GENERATIVE_AI_API_KEY
    default:
      return false
  }
}

/**
 * Get default AI provider based on available API keys
 */
export function getDefaultProvider(): AIProvider {
  if (isProviderAvailable('gemini')) return 'gemini'
  if (isProviderAvailable('openai')) return 'openai'
  return 'gemini' // Default fallback
}

/**
 * Get model for provider and type
 */
export function getModel(provider: AIProvider, type: ModelType) {
  switch (provider) {
    case 'openai':
      return openai(MODELS.openai[type])
    case 'gemini':
      return google(MODELS.gemini[type])
    default:
      return google(MODELS.gemini[type])
  }
}

/**
 * Generate a text response from AI
 */
export async function generateResponse(
  prompt: string,
  options?: {
    provider?: AIProvider
    system?: string
  }
): Promise<string> {
  const provider = options?.provider ?? getDefaultProvider()

  if (!isProviderAvailable(provider)) {
    throw new Error(`Provider ${provider} is not configured`)
  }

  const result = await generateText({
    model: getModel(provider, 'text'),
    prompt,
    system: options?.system ?? 'You are a helpful AI assistant.'
  })

  return result.text
}

/**
 * AI Service class for more complex operations
 */
export class AIService {
  private provider: AIProvider

  constructor(provider?: AIProvider) {
    this.provider = provider ?? getDefaultProvider()
  }

  async chat(message: string, systemPrompt?: string): Promise<string> {
    return generateResponse(message, {
      provider: this.provider,
      system: systemPrompt
    })
  }

  async summarize(text: string): Promise<string> {
    return generateResponse(text, {
      provider: this.provider,
      system: 'Summarize the following text concisely.'
    })
  }

  async analyze(text: string): Promise<string> {
    return generateResponse(text, {
      provider: this.provider,
      system: 'Analyze the following text and provide insights.'
    })
  }
}
