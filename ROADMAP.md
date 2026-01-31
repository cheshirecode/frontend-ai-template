# Prioritized Roadmap: `frontend-ai-template` Enhancements

This document outlines potential improvements and new features for the `frontend-ai-template`, prioritized based on their potential impact on user experience, code quality, and technical debt reduction.

## Priority Tier 1: Critical Fixes & High-Impact Debt Reduction

These items address immediate stability, security, or major performance bottlenecks.

1.  **Security Hardening:**
    *   **Action:** Add input validation (length, content) for user messages in `useChat.ts` and the API route (`app/api/ai/route.ts`). Add client-side rate limiting (e.g., max 3 messages per 10 seconds). Validate API key formats in `ai-service.ts`. Configure security headers (CSP, HSTS, etc.) in `next.config.ts`.
    *   **Impact:** Critical for production readiness. Prevents abuse and protects against common web vulnerabilities.
    *   **Tech Debt:** Addresses fundamental security gaps.

2.  **Stabilize E2E Tests:**
    *   **Action:** Investigate and fix the failures in `home.spec.ts` related to UI element visibility and interaction. This might involve adding explicit waits, using more robust locators, or ensuring proper test environment setup (browser, server state).
    *   **Impact:** Essential for maintaining code quality and catching regressions early. Unstable tests block development.
    *   **Tech Debt:** Reduces the risk of shipping broken UI.

3.  **Improve Error Handling & UX:**
    *   **Action:** Implement standardized error logging using the existing logger. Sanitize errors returned from the API route. Display more informative, user-friendly error messages in the UI (e.g., via a toast notification). Add a basic retry mechanism for transient API errors in `useChat.ts`.
    *   **Impact:** Significantly improves user experience by providing clarity when things go wrong and reducing frustration.
    *   **Tech Debt:** Makes debugging easier and reduces noise in logs.

## Priority Tier 2: Core Functionality Enhancements & Moderate Impact

These items improve the core user experience or code maintainability without being immediately critical.

4.  **Performance Optimizations:**
    *   **Action:** Implement virtualization for the `ChatMessageList.tsx` component using a library like `react-window` if the list becomes long. Apply `React.memo` to frequently rendered components like `ChatMessageItem` (if it existed or were split out) or `ChatMessageList` itself if its props are stable. Add `AbortController` to the fetch call in `useChat.ts`.
    *   **Impact:** Keeps the UI responsive during long conversations or heavy processing.
    *   **Tech Debt:** Makes the application scale better and feel smoother.

5.  **Code Quality & Maintainability:**
    *   **Action:** Remove unused imports. Extract magic strings (e.g., mode names 'gemini', 'openai', 'manual') into constants (e.g., `src/constants/modeConstants.ts`). Expand unit tests for `ai-service.ts`, `useChat.ts`, core hooks, and key components (aim for 70%+ coverage). Add unit tests for API routes.
    *   **Impact:** Makes the codebase easier to understand, modify, and reason about. Increases confidence in changes.
    *   **Tech Debt:** Reduces cognitive load and potential for bugs.

6.  **Basic UX Enhancements:**
    *   **Action:** Add a dark/light theme toggle using CSS variables and `prefers-color-scheme` or state management. Implement a simple "Copy Message" feature for chat messages.
    *   **Impact:** Improves user comfort and utility.
    *   **Tech Debt:** Adds standard UI affordances.

## Priority Tier 3: Advanced Features & Exploratory Ideas

These items add new capabilities or significantly enhance the AI interaction experience. They may require more research or have a lower immediate priority.

7.  **AI Interaction Enhancements:**
    *   **Action:** Implement message streaming display in `ChatMessage.tsx` to show AI responses as they arrive. Add an "Edit Message" capability allowing users to correct/modify sent messages and resend history. Implement a "Clear Chat" confirmation dialog.
    *   **Impact:** Makes the AI interaction feel more fluid and responsive. Provides more control to the user.
    *   **Tech Debt:** Lowers friction and improves perceived speed.

8.  **Advanced UI/UX Features:**
    *   **Action:** Implement conversation export (to text/JSON). Add message reactions/feedback (like/dislike). Explore integrating speech-to-text for input and text-to-speech for output using Web APIs.
    *   **Impact:** Increases utility and engagement. Explores multimodal interaction.
    *   **Tech Debt:** Expands the feature set beyond basic chat.

9.  **Frontend AI Capabilities:**
    *   **Action:** Develop a mechanism for AI-powered smart suggestions based on conversation context (requires careful prompt engineering and potentially a separate API call or tool via MCP). Explore simple inline editing assistance within the input field. Investigate client-side semantic search for chat history if implemented.
    *   **Impact:** Showcases sophisticated AI integration on the frontend, making the assistant feel more intelligent and helpful.
    *   **Tech Debt:** Requires careful design and implementation to avoid overwhelming the user.

10. **Extensibility & Integration:**
    *   **Action:** Document the MCP tool definition process clearly. Explore packaging the core chat interface as an embeddable React component/widget. Consider a plugin architecture for UI features (though this adds complexity).
    *   **Impact:** Increases the template's reusability and applicability to different projects.
    *   **Tech Debt:** Prepares for future growth and diverse use cases.

---

This roadmap provides a structured path for evolving the `frontend-ai-template`, balancing immediate needs with longer-term goals for showcasing advanced frontend AI capabilities.