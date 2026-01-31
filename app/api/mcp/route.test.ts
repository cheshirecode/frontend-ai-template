import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

const { mockGetHandler } = vi.hoisted(() => ({
  mockGetHandler: vi.fn().mockImplementation((name: string) => {
    if (name === 'test_tool') {
      return vi.fn().mockResolvedValue({ success: true, data: 'test result' })
    }
    return null
  })
}))

vi.mock('./tools', () => ({
  tools: [{ name: 'test_tool', description: 'A test tool' }],
  getHandler: mockGetHandler
}))

vi.mock('@/lib/logger', () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn() }
}))

import { POST } from './route'

describe('MCP API Route', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetHandler.mockImplementation((name: string) => {
      if (name === 'test_tool') {
        return vi.fn().mockResolvedValue({ success: true, data: 'test result' })
      }
      return null
    })
  })

  it('handles tools/list request', async () => {
    const request = new NextRequest('http://localhost/api/mcp', {
      method: 'POST',
      body: JSON.stringify({ jsonrpc: '2.0', id: '1', method: 'tools/list' }),
      headers: { 'content-type': 'application/json' }
    })
    const response = await POST(request)
    const data = await response.json()
    expect(response.status).toBe(200)
    expect(data.jsonrpc).toBe('2.0')
    expect(data.result.tools).toBeDefined()
  })

  it('handles tools/call request with valid tool', async () => {
    const request = new NextRequest('http://localhost/api/mcp', {
      method: 'POST',
      body: JSON.stringify({
        jsonrpc: '2.0', id: '2', method: 'tools/call',
        params: { name: 'test_tool', arguments: { test: 'value' } }
      }),
      headers: { 'content-type': 'application/json' }
    })
    const response = await POST(request)
    const data = await response.json()
    expect(data.result).toEqual({ success: true, data: 'test result' })
  })

  it('returns error for invalid tool', async () => {
    const request = new NextRequest('http://localhost/api/mcp', {
      method: 'POST',
      body: JSON.stringify({
        jsonrpc: '2.0', id: '3', method: 'tools/call',
        params: { name: 'invalid_tool', arguments: {} }
      }),
      headers: { 'content-type': 'application/json' }
    })
    const response = await POST(request)
    const data = await response.json()
    expect(data.error.message).toContain('Tool not found')
  })

  it('returns error for unknown method', async () => {
    const request = new NextRequest('http://localhost/api/mcp', {
      method: 'POST',
      body: JSON.stringify({ jsonrpc: '2.0', id: '4', method: 'unknown.method' }),
      headers: { 'content-type': 'application/json' }
    })
    const response = await POST(request)
    const data = await response.json()
    expect(data.error.message).toBe('Method not found')
  })

  it('handles malformed JSON', async () => {
    const request = new NextRequest('http://localhost/api/mcp', {
      method: 'POST',
      body: 'invalid json',
      headers: { 'content-type': 'application/json' }
    })
    const response = await POST(request)
    const data = await response.json()
    expect(data.error).toBeDefined()
    expect(data.id).toBe(null)
  })
})
