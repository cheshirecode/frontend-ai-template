'use client'

import { useEffect, useRef, ReactNode } from 'react'
import { logger } from '@/lib/logger'

interface PerformanceMonitorProps {
  componentName: string
  threshold?: number
  children: ReactNode
}

/**
 * Performance monitoring component
 * Tracks render times and reports slow components
 */
export function PerformanceMonitor({
  componentName,
  threshold = 100,
  children
}: PerformanceMonitorProps) {
  const renderStartTime = useRef<number>()

  useEffect(() => {
    // Track component mount time
    const mountTime = performance.now()
    logger.debug(`Component ${componentName} mounted`, {
      mountTime,
      timestamp: new Date().toISOString()
    })

    return () => {
      logger.debug(`Component ${componentName} unmounted`)
    }
  }, [componentName])

  useEffect(() => {
    // Track render performance
    if (renderStartTime.current) {
      const renderDuration = performance.now() - renderStartTime.current

      if (renderDuration > threshold) {
        logger.warn('Slow render detected', {
          componentName,
          renderDuration,
          threshold
        })
      }
    }

    renderStartTime.current = performance.now()
  }, [componentName, threshold])

  return <>{children}</>
}

/**
 * Web Vitals monitoring
 */
export function WebVitalsMonitor() {
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Track Core Web Vitals
    const trackWebVital = (metric: { name: string; value: number; id: string; delta: number; rating: string }) => {
      logger.info(`Web Vital: ${metric.name}`, {
        value: metric.value,
        id: metric.id,
        delta: metric.delta,
        rating: metric.rating
      })
    }

    // Dynamically import web-vitals to avoid SSR issues
    import('web-vitals').then(({ onCLS, onFCP, onLCP, onTTFB }) => {
      onCLS(trackWebVital)
      onFCP(trackWebVital)
      onLCP(trackWebVital)
      onTTFB(trackWebVital)
    }).catch((error) => {
      logger.warn('Failed to load web-vitals', { error: String(error) })
    })

    // Track custom performance metrics
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'navigation') {
          const navEntry = entry as PerformanceNavigationTiming
          logger.info('Page load metrics', {
            loadTime: navEntry.loadEventEnd - navEntry.fetchStart,
            domContentLoaded: navEntry.domContentLoadedEventEnd - navEntry.fetchStart,
            domInteractive: navEntry.domInteractive - navEntry.fetchStart
          })
        }
      }
    })

    try {
      observer.observe({ entryTypes: ['navigation', 'paint'] })
    } catch (error) {
      logger.warn('Performance observer not supported', { error: String(error) })
    }

    return () => {
      observer.disconnect()
    }
  }, [])

  return null
}

export default PerformanceMonitor
