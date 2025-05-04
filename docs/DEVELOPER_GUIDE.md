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

## Core Editing Workflows

All editing, timeline, and engine state flows are powered by a unified global Zustand store (see `projectStore.ts`).

### Supported User Editing Patterns:

- **Add Element:**  
  Use the "＋" button in ElementsPanel to add a new animation element to the project. A corresponding empty animation sequence is added.
- **Remove Element:**  
  Click the 🗑️ next to an element in ElementsPanel to remove it and its timeline sequence.
- **Edit Properties:**  
  Select an element, edit its properties in PropertiesPanel; updates push to undo/redo.
- **Add Keyframe:**  
  Hit "＋" on a timeline sequence to add a keyframe at a time you specify.
- **Delete Keyframe:**  
  Click 🗑️ on a keyframe bubble to remove it from the sequence.
- **Edit Keyframe Properties:**  
  Click ✎ on a keyframe to edit its properties object as JSON.
- **Edit Keyframe Time:**  
  Use 🕑 on a keyframe to move it in time.
- **Edit Keyframe Easing:**  
  Use ∿ on a keyframe to set/change its easing string.
- **Playback/Preview:**  
  Use the playback controls in PreviewPanel to play, pause, or seek through your animation.
- **Undo/Redo:**  
  Use undo ⎌/redo ↻ buttons or keyboard shortcuts (Ctrl+Z/Ctrl+Shift+Z) for full history navigation of project state.

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
useProjectStore().setProjectData(newData, true) // For undo history
```

## Development conventions

- **Type safety:** Use `@cineform-forge/shared-types` everywhere for model objects.
- **Hooks:** Access state via custom hooks (`useTimeline`, `useSelectedElement`, etc) for reusability and clean code.
- **Headless panels:** All UI logic flows through context/hooks—avoid deep prop-passing.
- **Testing:** Write Jest/Testing Library tests in all packages.
- **Storybook:** (Optional, recommend adding for UI components.)

For more details, see code comments and each package’s README.