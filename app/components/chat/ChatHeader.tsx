'use client'

import { PlanningMode } from '@/store'

interface ChatHeaderProps {
  planningMode: PlanningMode
  setPlanningMode: (mode: PlanningMode) => void
  messagesCount: number
  isLoading: boolean
  onClearChat: () => void
}

/**
 * Chat header with AI mode selection and controls
 */
export function ChatHeader({
  planningMode,
  setPlanningMode,
  messagesCount,
  isLoading,
  onClearChat
}: ChatHeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Left: Title */}
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold text-gray-900">AI Chat</h1>
          {messagesCount > 0 && (
            <span className="text-sm text-gray-500">
              {messagesCount} message{messagesCount !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Right: Controls */}
        <div className="flex items-center gap-4">
          {/* AI Mode Selection */}
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Mode:</label>
            <select
              value={planningMode}
              onChange={(e) => setPlanningMode(e.target.value as PlanningMode)}
              className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            >
              <option value="gemini">Gemini</option>
              <option value="openai">OpenAI</option>
              <option value="manual">Manual</option>
            </select>
          </div>

          {/* Clear Chat */}
          {messagesCount > 0 && (
            <button
              onClick={onClearChat}
              disabled={isLoading}
              className="text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50"
            >
              Clear
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
