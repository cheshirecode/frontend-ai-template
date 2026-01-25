import { logger } from './logger'

/**
 * Simplified Error Handler
 * Provides consistent error handling across the application
 */

export interface ErrorContext {
  component?: string
  action?: string
  endpoint?: string
  data?: Record<string, unknown>
}

/**
 * Handle errors with logging
 */
export function handleError(
  error: unknown,
  context?: ErrorContext
): Error {
  const errorObj = error instanceof Error ? error : new Error(String(error))

  logger.error(errorObj.message, {
    ...context,
    stack: errorObj.stack
  })

  return errorObj
}

/**
 * Wrap async function with error handling
 */
export function withErrorHandling<T extends (...args: unknown[]) => Promise<unknown>>(
  fn: T,
  context?: ErrorContext
): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await fn(...args)
    } catch (error) {
      throw handleError(error, context)
    }
  }) as T
}

/**
 * Safe JSON parse with error handling
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T
  } catch {
    return fallback
  }
}

/**
 * Format error for user display (sanitized)
 */
export function formatUserError(error: unknown): string {
  if (error instanceof Error) {
    // Don't expose internal details in production
    if (process.env.NODE_ENV === 'production') {
      return 'An unexpected error occurred. Please try again.'
    }
    return error.message
  }
  return String(error)
}

export default { handleError, withErrorHandling, safeJsonParse, formatUserError }
