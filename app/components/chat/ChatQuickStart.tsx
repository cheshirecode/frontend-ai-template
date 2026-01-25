'use client'

interface ChatQuickStartProps {
  options: string[]
  onSelect?: (option: string) => void
  disabled?: boolean
}

/**
 * Quick start suggestions for empty chat state
 */
export function ChatQuickStart({
  options,
  onSelect,
  disabled = false
}: ChatQuickStartProps) {
  return (
    <div className="text-center space-y-6">
      <div>
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
          <span className="text-3xl">💬</span>
        </div>
        <h2 className="mt-4 text-xl font-semibold text-gray-900">
          Start a conversation
        </h2>
        <p className="mt-2 text-gray-500">
          Try one of these suggestions or type your own message
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-2 max-w-md mx-auto">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => onSelect?.(option)}
            disabled={disabled}
            className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  )
}
