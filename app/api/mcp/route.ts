import { NextRequest, NextResponse } from 'next/server'
import { tools, getHandler } from './tools'
import { logger } from '@/lib/logger'

interface MCPRequest {
  jsonrpc: '2.0'
  id: string | number
  method: string
  params?: Record<string, unknown>
}

/**
 * MCP (Model Context Protocol) API endpoint
 * Implements JSON-RPC 2.0 for AI tool orchestration
 */
export async function POST(request: NextRequest) {
  try {
    const body: MCPRequest = await request.json()

    logger.info('MCP request received', {
      method: body.method,
      id: body.id
    })

    switch (body.method) {
      case 'tools/list':
        return NextResponse.json({
          jsonrpc: '2.0',
          id: body.id,
          result: { tools }
        })

      case 'tools/call': {
        const { name, arguments: args } = body.params as {
          name: string
          arguments: Record<string, unknown>
        }

        const handler = getHandler(name)
        if (!handler) {
          return NextResponse.json({
            jsonrpc: '2.0',
            id: body.id,
            error: { code: -32601, message: `Tool not found: ${name}` }
          })
        }

        logger.info('Executing MCP tool', { name, args })
        const result = await handler(args)

        return NextResponse.json({
          jsonrpc: '2.0',
          id: body.id,
          result
        })
      }

      default:
        return NextResponse.json({
          jsonrpc: '2.0',
          id: body.id,
          error: { code: -32601, message: 'Method not found' }
        })
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    logger.error('MCP error', { error: errorMessage })

    return NextResponse.json({
      jsonrpc: '2.0',
      id: null,
      error: {
        code: -32603,
        message: errorMessage
      }
    })
  }
}
