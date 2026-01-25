# Frontend + AI Engineering Template

A production-ready Next.js 15 template with multi-provider AI integration, Jotai state management, and MCP tools architecture.

## Features

- **Next.js 15** with App Router and Turbopack
- **Multi-Provider AI** - Google Gemini and OpenAI support with fallback
- **Jotai State Management** - Atomic, scalable state without boilerplate
- **MCP Tools** - Model Context Protocol for AI tool orchestration
- **TypeScript** - Strict mode with comprehensive type definitions
- **Tailwind CSS** - Utility-first styling with responsive design
- **Testing** - Vitest for unit tests, Playwright for E2E
- **Code Quality** - ESLint, Lefthook, Commitlint

## Quick Start

```bash
# Clone the template
npx degit cheshirecode/frontend-ai-template my-ai-app
cd my-ai-app

# Install dependencies
npm install

# Set up environment
cp .env.example .env.local
# Add your API keys to .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your app.

## Environment Setup

At least one AI provider API key is required:

| Variable | Description | Required |
|----------|-------------|----------|
| `GOOGLE_GENERATIVE_AI_API_KEY` | Google Gemini API key | One of these |
| `OPENAI_API_KEY` | OpenAI API key | is required |
| `AI_DEFAULT_PROVIDER` | Default provider (gemini/openai) | No |

Get your keys:
- **Gemini**: [Google AI Studio](https://aistudio.google.com/app/apikey) (free tier available)
- **OpenAI**: [OpenAI Platform](https://platform.openai.com/api-keys)

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── ai/          # AI chat endpoint
│   │   └── mcp/         # MCP tools endpoint
│   │       └── tools/   # Tool definitions
│   ├── components/
│   │   ├── chat/        # Chat UI components
│   │   ├── common/      # Shared components
│   │   ├── layout/      # Layout components
│   │   └── providers/   # React providers
│   ├── hooks/
│   │   ├── chat/        # Chat hooks
│   │   ├── composed/    # High-level hooks
│   │   └── core/        # Core state hooks
│   ├── lib/
│   │   ├── ai-service.ts    # AI provider abstraction
│   │   ├── error-handler.ts # Error utilities
│   │   └── logger.ts        # Structured logging
│   └── store/           # Jotai atoms
├── types/               # TypeScript definitions
├── e2e/                 # Playwright tests
└── docs/                # Documentation
```

## Available Scripts

```bash
npm run dev          # Start dev server with Turbopack
npm run build        # Production build
npm run start        # Start production server
npm test             # Run unit tests
npm run test:e2e     # Run E2E tests
npm run lint         # Lint code
npm run type-check   # TypeScript check
```

## Customization

### Adding AI Tools

Create a new tool in `app/api/mcp/tools/`:

```typescript
// app/api/mcp/tools/my-tool.ts
import { MCPTool, MCPToolResult, ToolHandler } from './types'

export const myTool: MCPTool = {
  name: 'my_tool',
  description: 'Description of what the tool does',
  inputSchema: {
    type: 'object',
    properties: {
      input: { type: 'string', description: 'Input parameter' }
    },
    required: ['input']
  }
}

export const handleMyTool: ToolHandler = async (params) => {
  // Implementation
  return { success: true, data: result }
}
```

Register in `app/api/mcp/tools/index.ts`.

### Adding Components

Components follow the decomposition pattern:

```typescript
// app/components/feature/MyComponent.tsx
'use client'

import { useMyHook } from '@/hooks/feature/useMyHook'

interface MyComponentProps {
  title: string
}

export function MyComponent({ title }: MyComponentProps) {
  const { data, isLoading } = useMyHook()
  // ...
}
```

### Adding State

Use Jotai atoms in `app/store/`:

```typescript
import { atom } from 'jotai'

export const myAtom = atom<string>('')
export const derivedAtom = atom((get) => get(myAtom).toUpperCase())
```

## Architecture

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for detailed architecture documentation.

## Deployment

### Vercel (Recommended)

```bash
npm run deploy:vercel
```

### Other Platforms

Build and run the production server:

```bash
npm run build
npm run start
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `npm test && npm run test:e2e`
5. Submit a pull request

## License

MIT
