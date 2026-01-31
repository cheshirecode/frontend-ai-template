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
import { validateChatMessage } from '@/lib/utils/inputValidation'

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

    // Perform client-side validation before sending
    const validation = validateChatMessage(content);
    if (!validation.isValid) {
      // Add an error message to the chat UI
      const errorMsg = validation.error || 'Invalid message';
      addMessage({
        role: 'system',
        content: `Validation Error: ${errorMsg}`
      });
      return; // Exit early if validation fails
    }

    // Add user message
    addMessage({ role: 'user', content });

    setIsLoading(true);

    try {
      if (isFastMode) {
        // Manual mode - simple echo response
        await new Promise(resolve => setTimeout(resolve, 500));
        addMessage({
          role: 'assistant',
          content: `[Manual Mode] You said: "${content}"]`
        });
      } else {
        // AI mode - call the API
        const response = await fetch('/api/ai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: content,
            provider: aiProvider || 'gemini'
          })
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        addMessage({
          role: 'assistant',
          content: data.response || 'No response received'
        });
      }
    } catch (error) {
      let userFacingMessage = 'An unexpected error occurred.';
      let logMessage = 'Unknown error';

      if (error instanceof Error) {
        logMessage = error.message;

        // Interpret common API error statuses for user-friendliness
        if (logMessage.includes('API error: 500')) {
          userFacingMessage = 'The AI service encountered an error. Please try again.';
        } else if (logMessage.includes('API error: 400')) {
          userFacingMessage = 'Your message could not be processed. Please check your input.';
        } else if (logMessage.includes('API error:')) {
          // Generic API error message for other codes
          userFacingMessage = 'Failed to communicate with the AI service. Please try again.';
        } else {
          // For other types of errors (e.g., network issues)
          userFacingMessage = 'Failed to connect to the AI service. Please check your connection.';
        }
      }

      console.error('Chat error details:', { originalError: error, userFacingMessage, logMessage });

      addMessage({
        role: 'system',
        content: `Error: ${userFacingMessage}`
      });

      // Pass the original error object to the onError callback if provided
      options.onError?.(error instanceof Error ? error : new Error(logMessage));
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, isFastMode, aiProvider, addMessage, setIsLoading, options]);

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
