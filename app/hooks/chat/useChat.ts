'use client'

import { useCallback } from 'react'
import { useAtom, useSetAtom } from 'jotai'
import {
  messagesAtom,
  isLoadingAtom,
  addMessageAtom,
  clearMessagesAtom,
  Message
} from '@/store'
import { AIProvider } from '@/lib/ai-service'

interface UseChatOptions {
  onError?: (error: Error) => void
}

interface UseChatReturn {
  messages: Message[]
  isLoading: boolean
  sendMessage: (content: string) => Promise<void>
  clearChat: () => void
}

/**
 * Main chat hook for managing chat state and AI interactions
 */
export function useChat(
  isFastMode: boolean = false,
  aiProvider?: AIProvider,
  options: UseChatOptions = {}
): UseChatReturn {
  const [messages] = useAtom(messagesAtom)
  const [isLoading, setIsLoading] = useAtom(isLoadingAtom)
  const addMessage = useSetAtom(addMessageAtom)
  const clearMessages = useSetAtom(clearMessagesAtom)

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return

    // Add user message
    addMessage({ role: 'user', content })

    setIsLoading(true)

    try {
      if (isFastMode) {
        // Manual mode - simple echo response
        await new Promise(resolve => setTimeout(resolve, 500))
        addMessage({
          role: 'assistant',
          content: `[Manual Mode] You said: "${content}"`
        })
      } else {
        // AI mode - call the API
        const response = await fetch('/api/ai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: content,
            provider: aiProvider || 'gemini'
          })
        })

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`)
        }

        const data = await response.json()
        addMessage({
          role: 'assistant',
          content: data.response || 'No response received'
        })
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      console.error('Chat error:', errorMessage)

      addMessage({
        role: 'system',
        content: `Error: ${errorMessage}`
      })

      options.onError?.(error instanceof Error ? error : new Error(errorMessage))
    } finally {
      setIsLoading(false)
    }
  }, [isLoading, isFastMode, aiProvider, addMessage, setIsLoading, options])

  const clearChat = useCallback(() => {
    clearMessages()
  }, [clearMessages])

  return {
    messages,
    isLoading,
    sendMessage,
    clearChat
  }
}
