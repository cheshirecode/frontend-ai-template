import { MCPTool, MCPToolResult, ToolHandler } from './types'

/**
 * Example Echo Tool
 * A simple tool that echoes back the input message
 */
export const echoTool: MCPTool = {
  name: 'echo',
  description: 'Echoes back the input message. Useful for testing MCP connectivity.',
  inputSchema: {
    type: 'object',
    properties: {
      message: {
        type: 'string',
        description: 'The message to echo back'
      },
      uppercase: {
        type: 'boolean',
        description: 'Whether to convert the message to uppercase'
      }
    },
    required: ['message']
  }
}

/**
 * Echo tool handler
 */
export const handleEcho: ToolHandler = async (params): Promise<MCPToolResult> => {
  try {
    const { message, uppercase } = params as {
      message: string
      uppercase?: boolean
    }

    if (!message) {
      return {
        success: false,
        error: 'Message is required'
      }
    }

    const response = uppercase ? message.toUpperCase() : message

    return {
      success: true,
      data: {
        original: message,
        echoed: response,
        timestamp: new Date().toISOString()
      }
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}
