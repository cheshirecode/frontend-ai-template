'use client'

import { useRef, useEffect } from 'react'
import { Message } from '@/store'
import { ChatMessage } from './ChatMessage'
import { ChatQuickStart } from './ChatQuickStart'

interface ChatMessageListProps {
  messages: Message[]
  isLoading: boolean
  quickStartOptions?: string[]
  onQuickStart?: (option: string) => void
}

/**
 * Scrollable list of chat messages
 */
export function ChatMessageList({
  messages,
  isLoading,
  quickStartOptions = [],
  onQuickStart
}: ChatMessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Empty state with quick start
  if (messages.length === 0 && quickStartOptions.length > 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <ChatQuickStart
          options={quickStartOptions}
          onSelect={onQuickStart}
          disabled={isLoading}
        />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}

      {isLoading && (
        <div className="flex items-center gap-2 text-gray-500">
          <div className="animate-pulse flex gap-1">
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
          <span className="text-sm">AI is thinking...</span>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  )
}
