/**
 * API Types for Frontend-Backend Communication
 */

// MCP protocol types
export interface MCPRequest {
  jsonrpc: '2.0'
  method: string
  params?: Record<string, unknown>
  id: string | number
}

export interface MCPResponse {
  jsonrpc: '2.0'
  result?: unknown
  error?: MCPError
  id: string | number
}

export interface MCPError {
  code: number
  message: string
  data?: unknown
}

// AI API types
export interface AIRequest {
  message: string
  provider?: 'gemini' | 'openai'
  stream?: boolean
  systemPrompt?: string
}

export interface AIResponse {
  response: string
  provider: string
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
}
