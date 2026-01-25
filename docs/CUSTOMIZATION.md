# Customization Guide

This guide covers how to customize the template for your specific needs.

## Branding

### 1. Update Metadata

Edit `app/layout.tsx`:

```typescript
export const metadata: Metadata = {
  title: "Your App Name",
  description: "Your app description",
}
```

### 2. Update Footer

Edit `app/components/layout/MainLayout.tsx`:

```typescript
<footer>
  <p>Built with Your Brand</p>
</footer>
```

### 3. Customize Theme

Edit `tailwind.config.js` to add brand colors:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f9ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        }
      }
    }
  }
}
```

## Adding Components

### 1. Create Component File

```typescript
// app/components/feature/MyComponent.tsx
'use client'

import { useState } from 'react'

interface MyComponentProps {
  title: string
  onAction?: () => void
}

export function MyComponent({ title, onAction }: MyComponentProps) {
  const [count, setCount] = useState(0)

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold">{title}</h2>
      <p>Count: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>
        Increment
      </button>
    </div>
  )
}
```

### 2. Export from Index

```typescript
// app/components/feature/index.ts
export { MyComponent } from './MyComponent'
```

### 3. Use in Page

```typescript
// app/page.tsx
import { MyComponent } from '@/components/feature'

export default function Home() {
  return <MyComponent title="Hello" />
}
```

## Adding State (Jotai Atoms)

### 1. Create Atom

```typescript
// app/store/myFeatureStore.ts
import { atom } from 'jotai'

export interface MyFeatureState {
  items: string[]
  isLoading: boolean
}

export const myFeatureAtom = atom<MyFeatureState>({
  items: [],
  isLoading: false
})

// Derived atom
export const itemCountAtom = atom(
  (get) => get(myFeatureAtom).items.length
)

// Action atom
export const addItemAtom = atom(
  null,
  (get, set, item: string) => {
    const current = get(myFeatureAtom)
    set(myFeatureAtom, {
      ...current,
      items: [...current.items, item]
    })
  }
)
```

### 2. Create Hook

```typescript
// app/hooks/feature/useMyFeature.ts
import { useAtom, useSetAtom } from 'jotai'
import { myFeatureAtom, addItemAtom, itemCountAtom } from '@/store/myFeatureStore'

export function useMyFeature() {
  const [state] = useAtom(myFeatureAtom)
  const addItem = useSetAtom(addItemAtom)
  const [count] = useAtom(itemCountAtom)

  return {
    items: state.items,
    isLoading: state.isLoading,
    count,
    addItem
  }
}
```

### 3. Use in Component

```typescript
import { useMyFeature } from '@/hooks/feature/useMyFeature'

function MyComponent() {
  const { items, count, addItem } = useMyFeature()

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => addItem('new item')}>Add</button>
      <ul>
        {items.map((item, i) => <li key={i}>{item}</li>)}
      </ul>
    </div>
  )
}
```

## Adding MCP Tools

### 1. Create Tool Definition

```typescript
// app/api/mcp/tools/my-tool.ts
import { MCPTool, MCPToolResult, ToolHandler } from './types'

export const myTool: MCPTool = {
  name: 'my_tool',
  description: 'Description of what the tool does',
  inputSchema: {
    type: 'object',
    properties: {
      input: {
        type: 'string',
        description: 'The input parameter'
      },
      options: {
        type: 'object',
        description: 'Optional configuration'
      }
    },
    required: ['input']
  }
}

export const handleMyTool: ToolHandler = async (params) => {
  try {
    const { input, options } = params as {
      input: string
      options?: Record<string, unknown>
    }

    // Your tool logic here
    const result = await processInput(input, options)

    return {
      success: true,
      data: result
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

async function processInput(input: string, options?: Record<string, unknown>) {
  // Implementation
  return { processed: input.toUpperCase() }
}
```

### 2. Register Tool

```typescript
// app/api/mcp/tools/index.ts
import { myTool, handleMyTool } from './my-tool'

export const tools: MCPTool[] = [
  echoTool,
  myTool,  // Add here
]

const toolHandlers: Record<string, ToolHandler> = {
  echo: handleEcho,
  my_tool: handleMyTool,  // Add here
}
```

## Adding API Routes

### 1. Create Route Handler

```typescript
// app/api/my-endpoint/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'

export async function GET(request: NextRequest) {
  try {
    const data = await fetchData()
    return NextResponse.json({ success: true, data })
  } catch (error) {
    logger.error('API error', { error })
    return NextResponse.json(
      { success: false, error: 'Internal error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate
    if (!body.required_field) {
      return NextResponse.json(
        { error: 'required_field is required' },
        { status: 400 }
      )
    }

    const result = await processData(body)
    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    logger.error('API error', { error })
    return NextResponse.json(
      { success: false, error: 'Internal error' },
      { status: 500 }
    )
  }
}
```

## Adding Tests

### Unit Test (Vitest)

```typescript
// app/components/feature/MyComponent.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MyComponent } from './MyComponent'

describe('MyComponent', () => {
  it('renders title', () => {
    render(<MyComponent title="Test" />)
    expect(screen.getByText('Test')).toBeInTheDocument()
  })

  it('calls onAction when button clicked', async () => {
    const onAction = vi.fn()
    render(<MyComponent title="Test" onAction={onAction} />)

    await userEvent.click(screen.getByRole('button'))

    expect(onAction).toHaveBeenCalled()
  })
})
```

### E2E Test (Playwright)

```typescript
// e2e/tests/my-feature.spec.ts
import { test, expect } from '@playwright/test'

test.describe('My Feature', () => {
  test('should work end to end', async ({ page }) => {
    await page.goto('/my-feature')

    await page.getByPlaceholder('Enter text').fill('Hello')
    await page.getByRole('button', { name: 'Submit' }).click()

    await expect(page.getByText('Success')).toBeVisible()
  })
})
```

## Environment Variables

Add new variables to `.env.example`:

```bash
# My Feature Configuration
MY_FEATURE_API_KEY=
MY_FEATURE_ENABLED=true
```

Access in code:

```typescript
const isEnabled = process.env.MY_FEATURE_ENABLED === 'true'
const apiKey = process.env.MY_FEATURE_API_KEY
```

## Deployment

### Vercel

1. Push to GitHub
2. Import in Vercel
3. Add environment variables
4. Deploy

### Other Platforms

```bash
# Build
npm run build

# Start
npm run start
```

Required environment variables:
- `GOOGLE_GENERATIVE_AI_API_KEY` or `OPENAI_API_KEY`
- Any custom variables your features need
