/**
 * Hook Types
 * Type definitions for custom React hooks
 */

import { Message } from './ui'
import type { PlanningMode } from '@/store'
import type { AIProvider } from '@/lib/ai-service'

// useChat hook
export interface UseChatReturn {
  messages: Message[]
  isLoading: boolean
  sendMessage: (content: string) => Promise<void>
  clearChat: () => void
}

export interface UseChatOptions {
  onError?: (error: Error) => void
}

// useAIManager hook
export interface UseAIManagerReturn {
  planningMode: PlanningMode
  setPlanningMode: (mode: PlanningMode) => void
  isFastMode: boolean
  aiProvider: AIProvider | null
}

// useSettings hook
export interface UseSettingsReturn {
  settings: AppSettings
  updateSettings: (updates: Partial<AppSettings>) => void
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system'
  fontSize: 'small' | 'medium' | 'large'
}
