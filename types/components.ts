/**
 * Component Types
 * Centralized type definitions for React components
 */

import { ReactNode, RefObject, FormEvent, ErrorInfo } from 'react'
import { Message } from './ui'
import type { PlanningMode } from '@/store'

// Layout Components
export interface MainLayoutProps {
  children: ReactNode
}

// Chat Components
export interface ChatInterfaceProps {
  onToggleSidebar?: () => void
}

export interface ChatHeaderProps {
  planningMode: PlanningMode
  setPlanningMode: (mode: PlanningMode) => void
  messagesCount: number
  isLoading: boolean
  onClearChat: () => void
}

export interface ChatMessageListProps {
  messages: Message[]
  isLoading: boolean
  quickStartOptions?: string[]
  onQuickStart?: (option: string) => void
}

export interface ChatMessageProps {
  message: Message
}

export interface ChatInputProps {
  input: string
  setInput: (value: string) => void
  isLoading: boolean
  onSubmit: (e: FormEvent) => void
  inputRef: RefObject<HTMLInputElement | null>
  placeholder?: string
}

export interface ChatQuickStartProps {
  options: string[]
  onSelect?: (option: string) => void
  disabled?: boolean
}

// Provider Components
export interface JotaiProviderProps {
  children: ReactNode
}

export interface SWRProviderProps {
  children: ReactNode
}

// Monitoring Components
export interface PerformanceMonitorProps {
  componentName: string
  threshold?: number
  children: ReactNode
}

export interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
}

export interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}
