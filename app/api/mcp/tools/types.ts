/**
 * MCP Tool Definition
 */
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

/**
 * MCP Tool Result
 */
export interface MCPToolResult {
  success: boolean
  data?: unknown
  error?: string
}

/**
 * MCP Tool Handler Function
 */
export type ToolHandler = (
  params: Record<string, unknown>
) => Promise<MCPToolResult>
