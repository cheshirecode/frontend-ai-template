export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

export interface LoggerConfig {
  enabled: boolean
  level: LogLevel
  component?: string
}

/**
 * Lightweight logging utility
 * Provides centralized logging for the application
 */
export class Logger {
  private config: LoggerConfig

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = {
      enabled: process.env.NODE_ENV !== 'test',
      level: (process.env.LOG_LEVEL as LogLevel) || 'info',
      ...config
    }
  }

  private getLevelPriority(level: LogLevel): number {
    const priorities = { debug: 0, info: 1, warn: 2, error: 3 }
    return priorities[level] || 1
  }

  private shouldLog(level: LogLevel): boolean {
    if (!this.config.enabled) return false
    return this.getLevelPriority(level) >= this.getLevelPriority(this.config.level)
  }

  private formatMessage(level: LogLevel, message: string): string {
    const timestamp = new Date().toISOString()
    const component = this.config.component ? `[${this.config.component}]` : ''
    return `${timestamp} [${level.toUpperCase()}]${component} ${message}`
  }

  debug(message: string, data?: Record<string, unknown>): void {
    if (!this.shouldLog('debug')) return
    console.debug(this.formatMessage('debug', message), data || '')
  }

  info(message: string, data?: Record<string, unknown>): void {
    if (!this.shouldLog('info')) return
    console.log(this.formatMessage('info', message), data || '')
  }

  warn(message: string, data?: Record<string, unknown>): void {
    if (!this.shouldLog('warn')) return
    console.warn(this.formatMessage('warn', message), data || '')
  }

  error(message: string, data?: Record<string, unknown>): void {
    if (!this.shouldLog('error')) return
    console.error(this.formatMessage('error', message), data || '')
  }

  /**
   * Create a child logger with additional context
   */
  child(context: Partial<LoggerConfig>): Logger {
    return new Logger({
      ...this.config,
      ...context
    })
  }
}

// Global logger instance
export const logger = new Logger()

// Component-specific loggers
export const createComponentLogger = (component: string) =>
  logger.child({ component })

export default logger
