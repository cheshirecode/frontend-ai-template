'use client'

import { SWRConfig } from 'swr'
import { ReactNode } from 'react'

interface SWRProviderProps {
  children: ReactNode
}

export function SWRProvider({ children }: SWRProviderProps) {
  return (
    <SWRConfig
      value={{
        // Global SWR configuration
        revalidateOnFocus: false,
        revalidateOnReconnect: true,
        dedupingInterval: 2000,
        focusThrottleInterval: 5000,
        errorRetryCount: 3,
        errorRetryInterval: 1000,
        onError: (error) => {
          console.error('SWR Error:', error)
        },
        onSuccess: (data, key) => {
          if (process.env.NODE_ENV === 'development') {
            console.log(`SWR Success for ${key}:`, data)
          }
        },
      }}
    >
      {children}
    </SWRConfig>
  )
}
