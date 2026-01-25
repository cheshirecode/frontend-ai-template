/**
 * Service Types
 * Type definitions for service layer
 */

// AI Service types
export type AIProvider = 'gemini' | 'openai'
export type ModelType = 'structured' | 'text' | 'fast'

// MCP Tool types
export interface MCPTool {
  name: string
  description: string
  inputSchema: {
    type: 'object'
    properties: Record<string, {
      type: string
      description: string
      required?: boolean
    }>
    required: string[]
  }
}

export interface MCPToolResult {
  success: boolean
  data?: unknown
  error?: string
}

export type ToolHandler = (
  params: Record<string, unknown>
) => Promise<MCPToolResult>

// Logger types
export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

export interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  data?: Record<string, unknown>
}

// Result Types
export type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E }

export type AsyncResult<T, E = Error> = Promise<Result<T, E>>
