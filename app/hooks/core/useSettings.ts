'use client'

import { useAtom } from 'jotai'
import { settingsAtom, AppSettings } from '@/store'

interface UseSettingsReturn {
  settings: AppSettings
  updateSettings: (updates: Partial<AppSettings>) => void
}

/**
 * Hook for managing application settings
 */
export function useSettings(): UseSettingsReturn {
  const [settings, setSettings] = useAtom(settingsAtom)

  const updateSettings = (updates: Partial<AppSettings>) => {
    setSettings((prev: AppSettings) => ({ ...prev, ...updates }))
  }

  return {
    settings,
    updateSettings
  }
}
