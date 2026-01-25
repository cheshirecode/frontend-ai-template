# Frontend + AI Engineering Template Conversion Plan

> Converting test-keycardai to a reusable template repository

**Source**: `/home/fred/projects/test-keycardai/`
**Target**: `/home/fred/projects/frontend-ai-template/`
**Status**: Planning

---

## Overview

Transform the test-keycardai codebase into a clean, reusable template for frontend + AI engineering projects. The template should provide a solid foundation while being easy to customize.

---

## Phase 1: Analysis & Cleanup

### 1.1 Identify Template-Worthy Patterns
- [x] Project structure (app/, types/, e2e/)
- [x] AI service abstraction (multi-provider)
- [x] Jotai state management
- [x] MCP tools architecture
- [x] Component decomposition patterns
- [x] Testing setup (Vitest + Playwright)
- [x] Git hooks (Lefthook + Commitlint)

### 1.2 Identify Project-Specific Code to Remove
- [ ] KeycardAI branding and UI text
- [ ] Specific GitHub repository creation logic
- [ ] Project scaffolding business logic
- [ ] Specific MCP tools (keep structure, simplify tools)
- [ ] README content specific to KeycardAI

### 1.3 Files to Keep As-Is
- Configuration files (tsconfig, tailwind, vitest, playwright)
- Type system structure
- Hook organization pattern
- Error handling utilities
- Logger implementation

---

## Phase 2: Create Template Structure

### 2.1 Core Directory Structure
```
frontend-ai-template/
├── app/
│   ├── api/
│   │   ├── ai/                 # AI endpoint (simplified)
│   │   │   └── route.ts
│   │   └── mcp/                # MCP server (minimal tools)
│   │       ├── route.ts
│   │       └── tools/
│   │           ├── index.ts
│   │           └── example-tool.ts
│   ├── components/
│   │   ├── chat/               # Chat UI components
│   │   ├── layout/             # Layout components
│   │   └── common/             # Shared components
│   ├── hooks/
│   │   ├── chat/               # Chat hooks
│   │   ├── composed/           # High-level hooks
│   │   └── core/               # Core state hooks
│   ├── lib/
│   │   ├── ai-service.ts       # AI provider abstraction
│   │   ├── error-handler.ts    # Error handling
│   │   └── logger.ts           # Structured logging
│   ├── store/
│   │   └── index.ts            # Jotai atoms
│   ├── layout.tsx
│   └── page.tsx
├── types/
│   ├── index.ts
│   ├── api.ts
│   ├── components.ts
│   └── services.ts
├── e2e/
│   ├── pages/
│   └── tests/
├── docs/
│   ├── ARCHITECTURE.md
│   ├── AI-INTEGRATION.md
│   └── CUSTOMIZATION.md
├── .env.example
├── .gitignore
├── README.md
├── package.json
├── tsconfig.json
├── next.config.ts
├── tailwind.config.js
├── vitest.config.ts
├── playwright.config.ts
├── lefthook.yml
├── commitlint.config.js
└── eslint.config.mjs
```

### 2.2 Simplified Components

**ChatInterface** (Generic chat UI)
- Remove KeycardAI-specific features
- Keep: message list, input, settings panel
- Parameterize: branding, colors, features

**AISettings** (Provider selection)
- Keep: Gemini/OpenAI/Manual modes
- Remove: Project-specific settings

---

## Phase 3: Generalize Code

### 3.1 AI Service (Keep & Simplify)
```typescript
// Retain multi-provider architecture
// Remove project-specific operations
// Keep: generateStructured, streamResponse, analyzeRequest
// Add: Generic prompt templates
```

### 3.2 MCP Tools (Minimal Set)
```typescript
// Keep only example tools
// - echo_tool: Simple echo for testing
// - analyze_text: Basic text analysis
// - generate_response: AI response generation
// Document: How to add custom tools
```

### 3.3 State Management (Generic)
```typescript
// Keep Jotai patterns
// Simplify to:
// - planningModeAtom
// - messagesAtom
// - settingsAtom
```

### 3.4 Hooks (Template)
```typescript
// useChat - Generic chat functionality
// useAIManager - AI settings management
// useSettings - App settings
```

---

## Phase 4: Documentation

### 4.1 README.md
- Quick start guide
- Environment setup
- Available scripts
- Architecture overview
- Customization guide
- Deployment instructions

### 4.2 ARCHITECTURE.md
- Directory structure explanation
- Component relationships
- Data flow diagrams
- State management patterns

### 4.3 AI-INTEGRATION.md
- Provider setup (Gemini, OpenAI)
- Adding new providers
- Prompt engineering guide
- Structured output with Zod

### 4.4 CUSTOMIZATION.md
- Adding new components
- Creating MCP tools
- Extending state management
- Styling customization

---

## Phase 5: Template Features

### 5.1 GitHub Template Setup
```
# .github/
├── ISSUE_TEMPLATE/
│   ├── bug_report.md
│   └── feature_request.md
├── PULL_REQUEST_TEMPLATE.md
└── workflows/
    ├── ci.yml
    └── e2e.yml
```

### 5.2 Template Metadata
- Mark as GitHub template repository
- Add topics: nextjs, ai, template, typescript, react
- Create releases for versioning

### 5.3 Initialization Script
```bash
#!/bin/bash
# scripts/init.sh
# - Rename package
# - Update branding
# - Set up environment
# - Install dependencies
```

---

## Phase 6: Testing & Validation

### 6.1 Template Tests
- [ ] Fresh clone works
- [ ] npm install succeeds
- [ ] npm run dev starts
- [ ] npm run build completes
- [ ] npm test passes
- [ ] npm run test:e2e passes
- [ ] All providers work (with keys)
- [ ] Manual mode works (no keys)

### 6.2 Documentation Validation
- [ ] README instructions work
- [ ] Environment setup is clear
- [ ] All links are valid
- [ ] Code examples are correct

---

## Phase 7: Publishing

### 7.1 Repository Setup
```bash
# Create new repository
gh repo create frontend-ai-template --public --description "Production-ready Next.js + AI template"

# Push template
git init
git add .
git commit -m "feat: initial template from test-keycardai"
git remote add origin git@github.com:cheshirecode/frontend-ai-template.git
git push -u origin main

# Mark as template
gh repo edit --enable-template
```

### 7.2 Release
- Create v1.0.0 release
- Add changelog
- Include migration notes from source

---

## Files Mapping

| Source (test-keycardai) | Target (template) | Action |
|-------------------------|-------------------|--------|
| app/api/mcp/ | app/api/mcp/ | Simplify tools |
| app/components/chat/ | app/components/chat/ | Generalize |
| app/lib/ai-service.ts | app/lib/ai-service.ts | Keep |
| app/lib/github/ | - | Remove |
| app/hooks/ | app/hooks/ | Simplify |
| app/store/ | app/store/ | Simplify |
| types/ | types/ | Keep structure |
| e2e/ | e2e/ | Simplify tests |
| README.md | README.md | Rewrite |
| package.json | package.json | Update name/deps |

---

## Estimated Work

| Phase | Effort | Priority |
|-------|--------|----------|
| Phase 1: Analysis | Done | - |
| Phase 2: Structure | 2 hours | High |
| Phase 3: Generalize | 4 hours | High |
| Phase 4: Documentation | 3 hours | High |
| Phase 5: Template Features | 2 hours | Medium |
| Phase 6: Testing | 2 hours | High |
| Phase 7: Publishing | 1 hour | Medium |

**Total**: ~14 hours

---

## Success Criteria

1. **Usability**: Developer can start a new project in < 5 minutes
2. **Clarity**: Architecture is documented and understandable
3. **Flexibility**: Easy to add/remove features
4. **Quality**: All tests pass, no TypeScript errors
5. **Production-Ready**: Can deploy to Vercel immediately

---

## Next Steps

1. Copy essential files from test-keycardai
2. Remove project-specific code
3. Simplify and generalize components
4. Write documentation
5. Test fresh clone workflow
6. Publish to GitHub
