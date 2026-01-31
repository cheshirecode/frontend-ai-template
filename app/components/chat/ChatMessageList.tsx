'use client'

import { useRef, useEffect, forwardRef } from 'react'
import { FixedSizeList as List } from 'react-window';
import { Message } from '@/store'
import { ChatMessage } from './ChatMessage'
import { ChatQuickStart } from './ChatQuickStart'

interface ChatMessageListProps {
  messages: Message[]
  isLoading: boolean
  quickStartOptions?: string[]
  onQuickStart?: (option: string) => void
}

// Define a fixed height for each message row
// This is an estimate; you might need to adjust based on actual content
const ROW_HEIGHT = 120; // pixels

// Row component for the virtualized list
const Row = ({ index, style, data }: { index: number; style: React.CSSProperties; data: Message[] }) => {
  const message = data[index];
  return (
    <div style={style}>
      <ChatMessage key={message.id} message={message} />
    </div>
  );
};

/**
 * Scrollable list of chat messages with virtualization
 */
export function ChatMessageList({
  messages,
  isLoading,
  quickStartOptions = [],
  onQuickStart
}: ChatMessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<List>(null); // Ref for the virtualized list

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    // For virtualized lists, scrolling behavior might need adjustment
    // Option 1: Scroll to the end using the list's scrollToItem
    if (listRef.current && messages.length > 0) {
      listRef.current.scrollToItem(messages.length - 1, 'end'); // Scroll to last item
    }
    // Option 2: Fallback to the original method if virtualized scrolling isn't smooth enough
    // messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
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
    <div className="space-y-4 h-[60vh] dark:text-white"> {/* Give the container a fixed height for the virtualized list and set text color for dark mode */}
      <List
        ref={listRef}
        height={Math.min(messages.length * ROW_HEIGHT, 600)} // Dynamic height up to a max (e.g., 600px), or use a fixed container height
        itemCount={messages.length}
        itemSize={ROW_HEIGHT} // Fixed height for each item
        width="100%" // Full width
        itemData={messages} // Pass messages as data to the Row component
      >
        {Row}
      </List>

      {isLoading && (
        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
          <div className="animate-pulse flex gap-1">
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce dark:bg-gray-500" style={{ animationDelay: '0ms' }} />
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce dark:bg-gray-500" style={{ animationDelay: '150ms' }} />
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce dark:bg-gray-500" style={{ animationDelay: '300ms' }} />
          </div>
          <span className="text-sm">AI is thinking...</span>
        </div>
      )}

      {/* Keep the anchor div for manual scrolling if needed, though less relevant with virtualization */}
      <div ref={messagesEndRef} />
    </div>
  )
}
