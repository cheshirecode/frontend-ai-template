'use client'

import React from 'react'
import { Message } from '@/store'
import clsx from 'clsx'

interface ChatMessageProps {
  message: Message
}

/**
 * Individual chat message display
 */
export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user'
  const isSystem = message.role === 'system'

  return (
    <div
      className={clsx(
        'flex',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      <div
        className={clsx(
          'max-w-[80%] rounded-lg px-4 py-2',
          isUser && 'bg-blue-600 text-white dark:bg-blue-700',
          !isUser && !isSystem && 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100',
          isSystem && 'bg-yellow-50 text-yellow-800 border border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-200 dark:border-yellow-800'
        )}
      >
        {/* Role indicator for non-user messages */}
        {!isUser && (
          <div className="text-xs font-medium mb-1 opacity-70">
            {isSystem ? 'System' : 'AI'}
          </div>
        )}

        {/* Message content */}
        <div className="whitespace-pre-wrap break-words">
          {message.content}
        </div>

        {/* Timestamp */}
        <div
          className={clsx(
            'text-xs mt-1 opacity-50',
            isUser ? 'text-right' : 'text-left'
          )}
        >
          {new Date(message.timestamp).toLocaleTimeString()}
        </div>
      </div>
    </div>
  )
}
