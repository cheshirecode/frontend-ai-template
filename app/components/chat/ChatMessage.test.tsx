import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ChatMessage } from './ChatMessage'

describe('ChatMessage', () => {
  it('renders user message correctly', () => {
    const message = {
      id: '1',
      role: 'user' as const,
      content: 'Hello, AI!',
      timestamp: Date.now()
    }

    render(<ChatMessage message={message} />)

    expect(screen.getByText('Hello, AI!')).toBeInTheDocument()
  })

  it('renders assistant message correctly', () => {
    const message = {
      id: '2',
      role: 'assistant' as const,
      content: 'Hello! How can I help you?',
      timestamp: Date.now()
    }

    render(<ChatMessage message={message} />)

    expect(screen.getByText('Hello! How can I help you?')).toBeInTheDocument()
    expect(screen.getByText('AI')).toBeInTheDocument()
  })

  it('renders system message correctly', () => {
    const message = {
      id: '3',
      role: 'system' as const,
      content: 'Connection established',
      timestamp: Date.now()
    }

    render(<ChatMessage message={message} />)

    expect(screen.getByText('Connection established')).toBeInTheDocument()
    expect(screen.getByText('System')).toBeInTheDocument()
  })

  it('displays timestamp', () => {
    const timestamp = Date.now()
    const message = {
      id: '4',
      role: 'user' as const,
      content: 'Test message',
      timestamp
    }

    render(<ChatMessage message={message} />)

    const timeString = new Date(timestamp).toLocaleTimeString()
    expect(screen.getByText(timeString)).toBeInTheDocument()
  })
})
