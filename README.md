# Cineform Forge

_Cineform Forge_ is a modern, collaborative, AI-assisted browser animation editor with a monorepo architecture supporting robust, modular, and extensible development.

## Overview

- **Monorepo:** Managed via workspaces, with all apps and packages in `apps/` and `packages/`
- **Editor:** Timeline-based, WYSIWYG, in-browser, with undo/redo and AI animation suggestion/creation
- **Persistence:** Autosave, explicit save, import/export (JSON), and copy/paste for elements/timelines
- **Core packages:**  
  - `@cineform-forge/engine`: rendering/playback  
  - `@cineform-forge/shared-types`: types  
  - `@cineform-forge/ai-assistant`: LLM integration  
  - `@cineform-forge/templates-library`: starter templates  
  - `@cineform-forge/testing-utils`: for testing
  - `apps/webapp`: main React UI

## Quick Start

```sh
npm install
npm run dev --filter webapp
```

- Visit http://localhost:5173 (or the printed local address)
- All edits autosave and persist to your browser
- Export/Import project files via the UI

## Dev & Scripts

- `npm run build` – Build all packages and apps
- `npm run test` – Run the full Jest/Testing Library suite
- `npm run lint` – Lint all files
- `npm run typecheck` – TypeScript validation everywhere

## Key Documentation
- [Developer Guide](./docs/DEVELOPER_GUIDE.md)
- [Shared Types Reference](./docs/SHARED_TYPES.md)
- [Success Criteria](./docs/SUCCESS_CRITERIA_V1.md)

---

All contributions are welcome—see docs for guidelines and architecture!
