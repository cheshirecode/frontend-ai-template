import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { NextRequest } from 'next/server'

const { mockGetModel, mockIsProviderAvailable, mockValidateChatMessage, mockGenerateText, mockStreamText } = vi.hoisted(() => ({
  mockGetModel: vi.fn().mockImplementation(() => ({})),
  mockIsProviderAvailable: vi.fn().mockReturnValue(true),
  mockValidateChatMessage: vi.fn().mockReturnValue({ isValid: true, sanitizedValue: 'test message' }),
  mockGenerateText: vi.fn().mockResolvedValue({
    text: 'Mocked AI response',
    usage: { completionTokens: 10, promptTokens: 5, totalTokens: 15 }
  }),
  mockStreamText: vi.fn().mockReturnValue({
    toTextStreamResponse: vi.fn().mockReturnValue(new Response('streamed response'))
  })
}))

vi.mock('@/lib/ai-service', () => ({
  getModel: mockGetModel,
  isProviderAvailable: mockIsProviderAvailable
}))

vi.mock('@/lib/logger', () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn() }
}))

vi.mock('@/lib/utils/inputValidation', () => ({
  validateChatMessage: mockValidateChatMessage
}))

vi.mock('ai', () => ({
  generateText: mockGenerateText,
  streamText: mockStreamText
}))

import { POST } from './route'

describe('AI API Route', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockIsProviderAvailable.mockReturnValue(true)
    mockValidateChatMessage.mockReturnValue({ isValid: true, sanitizedValue: 'test message' })
    mockGenerateText.mockResolvedValue({
      text: 'Mocked AI response',
      usage: { completionTokens: 10, promptTokens: 5, totalTokens: 15 }
    })
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('handles valid chat request in normal mode', async () => {
    const request = new Request('http://localhost/api/ai', {
      method: 'POST',
      body: JSON.stringify({ message: 'Hello, AI!', provider: 'gemini' })
    }) as NextRequest

    const response = await POST(request)
    const data = await response.json()
    expect(response.status).toBe(200)
    expect(data.response).toBe('Mocked AI response')
    expect(data.provider).toBe('gemini')
  })

  it('handles valid chat request in mock mode', async () => {
    vi.stubEnv('FEAT_MOCK_MODE', 'true')
    const request = new Request('http://localhost/api/ai', {
      method: 'POST',
      body: JSON.stringify({ message: 'Hello, AI!', provider: 'gemini' })
    }) as NextRequest

    const response = await POST(request)
    const data = await response.json()
    expect(response.status).toBe(200)
    expect(data.response).toContain('Mock response to: "Hello, AI!"')
    expect(data.provider).toBe('mock')
  })

  it('returns 400 for invalid message', async () => {
    mockValidateChatMessage.mockReturnValueOnce({ isValid: false, error: 'Message is invalid' })
    const request = new Request('http://localhost/api/ai', {
      method: 'POST',
      body: JSON.stringify({ message: '', provider: 'gemini' })
    }) as NextRequest

    const response = await POST(request)
    expect(response.status).toBe(400)
    const data = await response.json()
    expect(data.error).toBe('Message is invalid')
  })

  it('returns 503 when no provider is configured', async () => {
    mockIsProviderAvailable.mockReturnValue(false)
    const request = new Request('http://localhost/api/ai', {
      method: 'POST',
      body: JSON.stringify({ message: 'Hello!', provider: 'gemini' })
    }) as NextRequest

    const response = await POST(request)
    expect(response.status).toBe(503)
  })

  it('handles API errors gracefully', async () => {
    mockGenerateText.mockRejectedValueOnce(new Error('API Error'))
    const request = new Request('http://localhost/api/ai', {
      method: 'POST',
      body: JSON.stringify({ message: 'Hello!', provider: 'gemini' })
    }) as NextRequest

    const response = await POST(request)
    expect(response.status).toBe(500)
    const data = await response.json()
    expect(data.error).toBe('An error occurred while processing your request.')
  })

  it('supports streaming responses', async () => {
    const request = new Request('http://localhost/api/ai', {
      method: 'POST',
      body: JSON.stringify({ message: 'Hello!', provider: 'gemini', stream: true })
    }) as NextRequest

    const response = await POST(request)
    expect(response.status).toBe(200)
  })
})
