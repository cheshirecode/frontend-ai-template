import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const { mockOpenai, mockGoogle, mockGenerateText } = vi.hoisted(() => ({
  mockOpenai: vi.fn().mockImplementation((model: string) => ({ model })),
  mockGoogle: vi.fn().mockImplementation((model: string) => ({ model })),
  mockGenerateText: vi.fn().mockResolvedValue({
    text: 'Mocked AI response',
    usage: { completionTokens: 10, promptTokens: 5, totalTokens: 15 }
  })
}))

vi.mock('@ai-sdk/openai', () => ({ openai: mockOpenai }))
vi.mock('@ai-sdk/google', () => ({ google: mockGoogle }))
vi.mock('ai', () => ({ generateText: mockGenerateText }))

import { AIService, generateResponse, isProviderAvailable, getDefaultProvider, getModel } from './ai-service'

let originalEnv: NodeJS.ProcessEnv

beforeEach(() => {
  originalEnv = { ...process.env }
  vi.clearAllMocks()
})

afterEach(() => {
  process.env = originalEnv
})

describe('AI Service', () => {
  describe('isProviderAvailable', () => {
    it('returns true when OpenAI API key is available', () => {
      process.env.OPENAI_API_KEY = 'test-openai-key'
      process.env.GOOGLE_GENERATIVE_AI_API_KEY = ''
      expect(isProviderAvailable('openai')).toBe(true)
      expect(isProviderAvailable('gemini')).toBe(false)
    })

    it('returns true when Gemini API key is available', () => {
      process.env.GOOGLE_GENERATIVE_AI_API_KEY = 'test-gemini-key'
      process.env.OPENAI_API_KEY = ''
      expect(isProviderAvailable('gemini')).toBe(true)
      expect(isProviderAvailable('openai')).toBe(false)
    })

    it('returns false when no API key is available', () => {
      process.env.OPENAI_API_KEY = ''
      process.env.GOOGLE_GENERATIVE_AI_API_KEY = ''
      expect(isProviderAvailable('openai')).toBe(false)
      expect(isProviderAvailable('gemini')).toBe(false)
    })
  })

  describe('getDefaultProvider', () => {
    it('returns gemini when only Gemini key is available', () => {
      process.env.GOOGLE_GENERATIVE_AI_API_KEY = 'test-key'
      process.env.OPENAI_API_KEY = ''
      expect(getDefaultProvider()).toBe('gemini')
    })

    it('returns openai when only OpenAI key is available', () => {
      process.env.OPENAI_API_KEY = 'test-key'
      process.env.GOOGLE_GENERATIVE_AI_API_KEY = ''
      expect(getDefaultProvider()).toBe('openai')
    })

    it('returns gemini when both keys are available', () => {
      process.env.OPENAI_API_KEY = 'test-key'
      process.env.GOOGLE_GENERATIVE_AI_API_KEY = 'test-key'
      expect(getDefaultProvider()).toBe('gemini')
    })

    it('returns gemini as fallback when no keys are available', () => {
      process.env.OPENAI_API_KEY = ''
      process.env.GOOGLE_GENERATIVE_AI_API_KEY = ''
      expect(getDefaultProvider()).toBe('gemini')
    })
  })

  describe('getModel', () => {
    it('returns OpenAI model for OpenAI provider', () => {
      const model = getModel('openai', 'text')
      expect(mockOpenai).toHaveBeenCalledWith('gpt-3.5-turbo')
      expect(model).toEqual({ model: 'gpt-3.5-turbo' })
    })

    it('returns Gemini model for Gemini provider', () => {
      const model = getModel('gemini', 'structured')
      expect(mockGoogle).toHaveBeenCalledWith('gemini-2.0-flash')
      expect(model).toEqual({ model: 'gemini-2.0-flash' })
    })

    it('returns correct models for different types', () => {
      expect(getModel('openai', 'structured')).toEqual({ model: 'gpt-4o-mini' })
      expect(getModel('openai', 'fast')).toEqual({ model: 'gpt-3.5-turbo' })
    })
  })

  describe('generateResponse', () => {
    it('generates response with default provider', async () => {
      process.env.GOOGLE_GENERATIVE_AI_API_KEY = 'test-key'
      const response = await generateResponse('Hello, AI!')
      expect(mockGenerateText).toHaveBeenCalled()
      expect(response).toBe('Mocked AI response')
    })

    it('throws error when provider is not configured', async () => {
      process.env.OPENAI_API_KEY = ''
      process.env.GOOGLE_GENERATIVE_AI_API_KEY = ''
      await expect(generateResponse('Hello, AI!')).rejects.toThrow('not configured')
    })
  })

  describe('AIService class', () => {
    it('initializes with default provider', () => {
      process.env.GOOGLE_GENERATIVE_AI_API_KEY = 'test-key'
      expect(new AIService()).toBeInstanceOf(AIService)
    })

    it('can chat with AI', async () => {
      process.env.GOOGLE_GENERATIVE_AI_API_KEY = 'test-key'
      const service = new AIService()
      const response = await service.chat('Hello!')
      expect(response).toBe('Mocked AI response')
    })

    it('can summarize text', async () => {
      process.env.GOOGLE_GENERATIVE_AI_API_KEY = 'test-key'
      const service = new AIService()
      const response = await service.summarize('Long text')
      expect(response).toBe('Mocked AI response')
    })

    it('can analyze text', async () => {
      process.env.GOOGLE_GENERATIVE_AI_API_KEY = 'test-key'
      const service = new AIService()
      const response = await service.analyze('Text to analyze')
      expect(response).toBe('Mocked AI response')
    })
  })
})
