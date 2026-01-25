import { atom } from 'jotai'
import type { AIProvider } from '@/lib/ai-service'

/**
 * Message types for chat
 */
export interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: number
}

/**
 * Chat messages atom
 */
export const messagesAtom = atom<Message[]>([])

/**
 * Loading state atom
 */
export const isLoadingAtom = atom<boolean>(false)

/**
 * Planning Mode - unified control for AI provider or manual planning
 * Options:
 * - 'gemini': Use Google Gemini AI (free tier, default)
 * - 'openai': Use OpenAI models
 * - 'manual': Rule-based planning without AI (fast mode)
 */
export type PlanningMode = 'gemini' | 'openai' | 'manual'

/**
 * Planning Mode atom - combines AI provider selection and manual mode
 * Defaults to Gemini for cost efficiency
 */
export const planningModeAtom = atom<PlanningMode>('gemini')

/**
 * Derived atom: Is manual mode enabled
 */
export const isManualModeAtom = atom(
  (get) => get(planningModeAtom) === 'manual'
)

/**
 * Derived atom: Get current AI provider (null if manual mode)
 */
export const currentAIProviderAtom = atom<AIProvider | null>(
  (get) => {
    const mode = get(planningModeAtom)
    return mode === 'manual' ? null : mode
  }
)

/**
 * Settings atom for app configuration
 */
export interface AppSettings {
  theme: 'light' | 'dark' | 'system'
  fontSize: 'small' | 'medium' | 'large'
}

export const settingsAtom = atom<AppSettings>({
  theme: 'system',
  fontSize: 'medium'
})

/**
 * Add message action atom
 */
export const addMessageAtom = atom(
  null,
  (get, set, message: Omit<Message, 'id' | 'timestamp'>) => {
    const messages = get(messagesAtom)
    const newMessage: Message = {
      ...message,
      id: crypto.randomUUID(),
      timestamp: Date.now()
    }
    set(messagesAtom, [...messages, newMessage])
  }
)

/**
 * Clear messages action atom
 */
export const clearMessagesAtom = atom(
  null,
  (_get, set) => {
    set(messagesAtom, [])
  }
)
