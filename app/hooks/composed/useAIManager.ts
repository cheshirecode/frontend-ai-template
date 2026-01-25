'use client'

import { useAtom } from 'jotai'
import {
  planningModeAtom,
  isManualModeAtom,
  currentAIProviderAtom,
  PlanningMode
} from '@/store'
import type { AIProvider } from '@/lib/ai-service'

interface UseAIManagerReturn {
  planningMode: PlanningMode
  setPlanningMode: (mode: PlanningMode) => void
  isFastMode: boolean
  aiProvider: AIProvider | null
}

/**
 * Hook for managing AI settings and provider selection
 */
export function useAIManager(): UseAIManagerReturn {
  const [planningMode, setPlanningMode] = useAtom(planningModeAtom)
  const [isFastMode] = useAtom(isManualModeAtom)
  const [aiProvider] = useAtom(currentAIProviderAtom)

  return {
    planningMode,
    setPlanningMode,
    isFastMode,
    aiProvider
  }
}
