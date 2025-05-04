# Cineform Forge Developer Guide

This document covers development workflows, project structure, and core APIs for contributors.

## Project Structure

- **apps/webapp**: Main React application (UI/UX)
- **packages/engine**: Rendering, playback, and animation logic/adapters
- **packages/shared-types**: TypeScript interfaces for animation model
- **packages/ai-assistant**: Integration with LLMs for animation and suggestion generation
- **packages/templates-library**: Animation templates for quick-start/import

## Key Dev Scripts

At the monorepo root:
- `npm install` – Installs all workspaces
- `npm run dev --filter webapp` – Starts the webapp in dev mode
- `npm run build` – Builds all packages/apps
- `npm run test` – Runs all tests
- `npm run lint` – Lints codebase

## Core APIs

### CineforgeEngine (Engine API)

```
constructor(targetEl: HTMLElement, adapter?: 'dom' | 'canvas2d')
loadTimeline(timelineData, elements)
play(), pause(), seek(time), setRate(rate)
on(event, cb), off(event, cb)
setRenderingTarget('dom' | 'canvas2d')
destroy()
```

### AnimationAssistant (AI API)

```
constructor(provider: 'openrouter', apiKey, options?)
generateAnimationStructureFromText(prompt: string)
generateSuggestions({ elements, timeline })
```

### Zustand Project Store (UI State)

```
useProjectStore().projectData
useProjectStore().selectedElementId
useProjectStore().undo(), useProjectStore().redo()
useProjectStore().play(), pause(), seek(time)
useProjectStore().generateAnimation(prompt)
useProjectStore().fetchSuggestions()
```

## Development conventions

- **Type safety:** Use `@cineform-forge/shared-types` everywhere for model objects.
- **Hooks:** Access state via custom hooks (`useTimeline`, `useSelectedElement`, etc) for reusability and clean code.
- **Headless panels:** All UI logic flows through context/hooks—avoid deep prop-passing.
- **Testing:** Write Jest/Testing Library tests in all packages.
- **Storybook:** (Optional, recommend adding for UI components.)

For more details, see code comments and each package’s README.