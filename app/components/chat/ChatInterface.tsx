'use client'

import { useState, useRef, FormEvent } from 'react'
import { useChat } from '@/hooks/chat/useChat'
import { useAIManager } from '@/hooks/composed/useAIManager'
import { ChatHeader } from './ChatHeader'
import { ChatMessageList } from './ChatMessageList'
import { ChatInput } from './ChatInput'

/**
 * Main chat interface component
 * Provides a complete chat UI with AI integration
 */
export function ChatInterface() {
  const [input, setInput] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  // AI mode management
  const { planningMode, setPlanningMode, isFastMode, aiProvider } = useAIManager()

  // Chat functionality
  const { messages, isLoading, sendMessage, clearChat } = useChat(isFastMode, aiProvider ?? undefined)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    await sendMessage(input.trim())
    setInput('')
  }

  const handleQuickStart = (option: string) => {
    if (!isLoading) {
      sendMessage(option)
    }
  }

  // Quick start suggestions
  const quickStartOptions = [
    'Tell me a joke',
    'Explain quantum computing',
    'Write a haiku about coding',
    'What can you help me with?'
  ]

  return (
    <div className="h-full w-full bg-gray-50 dark:bg-gray-900 flex flex-col overflow-hidden">
      {/* Header */}
      <ChatHeader
        planningMode={planningMode}
        setPlanningMode={setPlanningMode}
        messagesCount={messages.length}
        isLoading={isLoading}
        onClearChat={clearChat}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex-1 flex flex-col min-h-0 h-full">
          {/* Chat Panel */}
          <div className="flex flex-col bg-white dark:bg-gray-800 flex-1 min-h-0 overflow-hidden">
            <div className="p-4 flex-1 overflow-y-auto min-h-0">
              <ChatMessageList
                messages={messages}
                isLoading={isLoading}
                quickStartOptions={messages.length === 0 ? quickStartOptions : []}
                onQuickStart={handleQuickStart}
              />
            </div>

            {/* Input Form */}
            <ChatInput
              input={input}
              setInput={setInput}
              isLoading={isLoading}
              onSubmit={handleSubmit}
              inputRef={inputRef}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
