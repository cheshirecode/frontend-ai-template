import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { Provider } from 'jotai/react'
import { createStore } from 'jotai'
import React from 'react'

// Mock validation before importing useChat
const mockValidate = vi.fn()
vi.mock('@/lib/utils/inputValidation', () => ({
  validateChatMessage: (...args: object[]) => mockValidate(...args)
}))

import { useChat } from './useChat'

// Mock fetch globally
const mockFetch = vi.fn()
global.fetch = mockFetch

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  const store = createStore()
  return <Provider store={store}>{children}</Provider>
}

describe('useChat', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ response: 'Mock AI response' })
    })
    mockValidate.mockImplementation((content: string) => {
      if (!content.trim()) return { isValid: false, error: 'Message cannot be empty' }
      if (content.length > 2000) return { isValid: false, error: 'Message too long' }
      return { isValid: true, sanitizedValue: content }
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('initializes with empty messages and not loading', () => {
    const { result } = renderHook(() => useChat(), { wrapper: Wrapper })
    expect(result.current.messages).toEqual([])
    expect(result.current.isLoading).toBe(false)
  })

  it('does not send empty messages', async () => {
    const { result } = renderHook(() => useChat(true), { wrapper: Wrapper })
    await act(async () => {
      await result.current.sendMessage('')
    })
    expect(result.current.messages).toEqual([])
  })

  it('does not send whitespace-only messages', async () => {
    const { result } = renderHook(() => useChat(true), { wrapper: Wrapper })
    await act(async () => {
      await result.current.sendMessage('   ')
    })
    // Empty after trim check in hook itself
    expect(result.current.messages).toEqual([])
  })

  it('clears chat messages', async () => {
    const { result } = renderHook(() => useChat(true), { wrapper: Wrapper })
    await act(async () => {
      await result.current.sendMessage('Test message')
    })
    expect(result.current.messages.length).toBeGreaterThan(0)
    act(() => {
      result.current.clearChat()
    })
    expect(result.current.messages).toEqual([])
  })

  it('handles validation errors', async () => {
    mockValidate.mockReturnValueOnce({ isValid: false, error: 'Invalid message format' })
    const { result } = renderHook(() => useChat(true), { wrapper: Wrapper })
    await act(async () => {
      await result.current.sendMessage('bad input')
    })
    // Should have a system message with the validation error
    const systemMessages = result.current.messages.filter(m => m.role === 'system')
    expect(systemMessages.length).toBe(1)
    expect(systemMessages[0].content).toContain('Validation Error')
  })

  it('shows error when API fails in non-fast mode', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'))
    const onError = vi.fn()
    const { result } = renderHook(() => useChat(false, undefined, { onError }), { wrapper: Wrapper })
    await act(async () => {
      await result.current.sendMessage('Test message')
    })
    expect(result.current.messages.length).toBeGreaterThanOrEqual(2)
    const lastMsg = result.current.messages[result.current.messages.length - 1]
    expect(lastMsg.role).toBe('system')
    expect(lastMsg.content).toContain('Error:')
    expect(onError).toHaveBeenCalled()
    expect(result.current.isLoading).toBe(false)
  })
})
