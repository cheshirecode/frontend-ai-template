# Architecture Overview

This document describes the high-level architecture of the Frontend + AI Template.

## Directory Structure

```
frontend-ai-template/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   ├── ai/           # AI chat endpoint
│   │   └── mcp/          # MCP tools endpoint
│   ├── components/        # React Components
│   │   ├── chat/         # Chat UI components
│   │   ├── common/       # Shared components
│   │   ├── layout/       # Layout components
│   │   └── providers/    # React context providers
│   ├── hooks/            # Custom React hooks
│   │   ├── chat/         # Chat-specific hooks
│   │   ├── composed/     # High-level hooks
│   │   └── core/         # Core state hooks
│   ├── lib/              # Utilities & services
│   └── store/            # Jotai atoms (state)
├── types/                 # TypeScript definitions
├── e2e/                   # Playwright E2E tests
└── docs/                  # Documentation
```

## Core Concepts

### 1. State Management (Jotai)

We use Jotai for atomic state management instead of Redux or Context API.

**Why Jotai?**
- Zero boilerplate
- Automatic code splitting
- TypeScript-first
- No provider nesting required

**State Organization:**

```typescript
// Primitive atoms (base state)
export const messagesAtom = atom<Message[]>([])
export const isLoadingAtom = atom<boolean>(false)

// Derived atoms (computed state)
export const isManualModeAtom = atom(
  (get) => get(planningModeAtom) === 'manual'
)

// Action atoms (state updates)
export const addMessageAtom = atom(
  null,
  (get, set, message: Message) => {
    set(messagesAtom, [...get(messagesAtom), message])
  }
)
```

### 2. Component Architecture

Components follow a layered decomposition pattern:

```
ChatInterface (orchestrator)
├── ChatHeader (controls)
├── ChatMessageList (display)
│   ├── ChatMessage (item)
│   └── ChatQuickStart (empty state)
└── ChatInput (input form)
```

**Principles:**
- Single responsibility per component
- Props-based communication
- Hooks for shared logic
- ~200 lines max per component

### 3. AI Integration

Multi-provider AI service with abstraction layer:

```
┌─────────────────────────────────────┐
│           Chat Component            │
└─────────────────┬───────────────────┘
                  │
┌─────────────────▼───────────────────┐
│           useChat Hook              │
└─────────────────┬───────────────────┘
                  │
┌─────────────────▼───────────────────┐
│           /api/ai Route             │
└─────────────────┬───────────────────┘
                  │
┌─────────────────▼───────────────────┐
│           AI Service                │
│  ┌─────────┐      ┌─────────┐      │
│  │ Gemini  │      │ OpenAI  │      │
│  └─────────┘      └─────────┘      │
└─────────────────────────────────────┘
```

### 4. MCP Tools Architecture

Model Context Protocol for AI tool orchestration:

```typescript
// Tool Definition
const echoTool: MCPTool = {
  name: 'echo',
  description: 'Echoes back the input',
  inputSchema: {
    type: 'object',
    properties: {
      message: { type: 'string', description: 'Message to echo' }
    },
    required: ['message']
  }
}

// Tool Handler
const handleEcho: ToolHandler = async (params) => {
  return { success: true, data: { echoed: params.message } }
}
```

## Data Flow

### Chat Message Flow

```
1. User types message
   └─> ChatInput component
       └─> handleSubmit()
           └─> useChat.sendMessage()
               └─> POST /api/ai
                   └─> AI Service
                       └─> Provider API
                           └─> Response
                               └─> addMessage atom
                                   └─> ChatMessageList updates
```

### State Update Flow

```
1. User action
   └─> Component event handler
       └─> useAtom hook
           └─> Write to atom
               └─> All subscribers re-render
```

## Error Handling

Errors are handled at multiple levels:

1. **Component Level**: ErrorBoundary catches React errors
2. **Hook Level**: try/catch in async operations
3. **API Level**: Error responses with proper status codes
4. **Service Level**: Provider-specific error handling with fallbacks

## Testing Strategy

```
Unit Tests (Vitest)
├── Components (React Testing Library)
├── Hooks (renderHook)
├── Utilities (direct testing)
└── Services (mocked providers)

E2E Tests (Playwright)
├── User flows
├── API integration
└── Cross-browser testing
```

## Performance Considerations

1. **Turbopack**: Fast development builds
2. **Code Splitting**: Automatic with Next.js App Router
3. **Jotai Atoms**: Minimal re-renders via atomic updates
4. **Web Vitals**: Monitored via PerformanceMonitor component

## Security

- API keys stored in environment variables
- No client-side exposure of secrets
- Input validation on all API endpoints
- Error messages don't leak implementation details
