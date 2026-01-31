# AGENTS.md - Frontend + AI Engineering Template

This file provides context for AI assistants working with the `frontend-ai-template` repository.

## Purpose

This repository is a **production-ready Next.js 15 template** designed for building frontend applications with integrated AI capabilities. It provides a standardized structure and foundational components for projects involving AI interactions (chat, tool calling via MCP).

- **Repository:** `cheshirecode/frontend-ai-template`
- **Framework:** Next.js 15 (App Router)
- **AI Integration:** Multi-provider (Google Gemini, OpenAI) via a service abstraction and Model Context Protocol (MCP) for tool orchestration.
- **State Management:** Jotai
- **Styling:** Tailwind CSS
- **Testing:** Vitest (unit), Playwright (E2E)

See `README.md` for detailed quick start and feature guides.
See `docs/` directory for deeper architectural information.

## Project Structure (High-Level)

- `app/`: Next.js application structure.
  - `api/ai/route.ts`: Main AI chat endpoint.
  - `api/mcp/route.ts`: Model Context Protocol server endpoint for tools.
  - `api/mcp/tools/`: Directory for MCP tool definitions (e.g., `example-tool.ts`).
  - `components/`: UI components (organized by feature: `chat/`, `layout/`, `common/`).
  - `hooks/`: React hooks (organized by scope: `chat/`, `composed/`, `core/`).
  - `lib/`: Core libraries (e.g., `ai-service.ts`, `logger.ts`, `error-handler.ts`).
  - `store/`: Jotai state atoms (`index.ts`).
- `types/`: TypeScript definitions.
- `e2e/`: Playwright E2E tests.
- `docs/`: Project documentation.
- `scripts/`: Utility scripts (e.g., `init.sh`).

## Outstanding Tasks / Areas for Improvement

Based on `IMPROVEMENTS.local.md`, here are prioritized areas for potential work:

### Priority 1: Security Hardening
- Add message length/content validation in `useChat.ts`.
- Add client-side rate limiting.
- Configure CORS origin properly in `vercel.json`.
- Add security headers in `next.config.ts`.
- Add API key format validation in `ai-service.ts`.

### Priority 2: Testing Coverage
- Expand unit tests for `ai-service.ts`, `error-handler.ts`, `logger.ts`, `store/index.ts`, hooks, and components.
- Add unit tests for API routes (`app/api/ai/route.ts`, `app/api/mcp/route.ts`).
- Improve E2E tests for chat flow, error recovery, mode switching.
- Aim for 70%+ test coverage.

### Priority 3: Performance Optimization
- Implement virtualization for the message list (`ChatMessageList.tsx`).
- Add `React.memo` where appropriate.
- Add `AbortController` for fetch requests in `useChat.ts`.

### Priority 4: Error Handling UX
- Add retry mechanisms for failed messages.
- Standardize error logging using the `logger` utility.
- Sanitize error messages returned to the client in API routes.

### Priority 5: Code Quality
- Remove unused imports (e.g., `React` in `ChatInterface.tsx`).
- Extract magic strings to constants.
- Address incomplete implementations (e.g., unused path alias for `/contexts`).

### Future Enhancements
- Dark mode toggle.
- Message streaming display.
- Copy message functionality.
- Message editing support.
- Conversation export.
- Add Storybook.
- Improve accessibility (ARIA labels, keyboard nav).

## Key Files for Reference

When working on specific aspects, these files are often relevant:
- `app/hooks/chat/useChat.ts` (Chat logic, needs rate limiting, abort controller, logging)
- `app/api/ai/route.ts` (API logic, needs error sanitization, validation)
- `app/lib/ai-service.ts` (Service logic, needs API key validation)
- `vercel.json` (Security headers, CORS)
- `next.config.ts` (Security headers)
- `app/components/chat/ChatMessageList.tsx` (Performance, needs virtualization)