import { MCPTool, ToolHandler } from './types'
import { echoTool, handleEcho } from './example-tool'

/**
 * MCP Tool Registry
 * Add your custom tools here
 */

// Register all available tools
export const tools: MCPTool[] = [
  echoTool,
  // Add more tools here:
  // analyzeTextTool,
  // generateResponseTool,
]

// Map tool names to their handlers
const toolHandlers: Record<string, ToolHandler> = {
  echo: handleEcho,
  // Add more handlers here:
  // analyze_text: handleAnalyzeText,
  // generate_response: handleGenerateResponse,
}

/**
 * Get a tool definition by name
 */
export function getTool(name: string): MCPTool | undefined {
  return tools.find(t => t.name === name)
}

/**
 * Get a tool handler by name
 */
export function getHandler(name: string): ToolHandler | undefined {
  return toolHandlers[name]
}
