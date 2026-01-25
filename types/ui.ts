/**
 * UI and Frontend Types for Client-Side Operations
 */

// Chat message type
export interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: number
}
