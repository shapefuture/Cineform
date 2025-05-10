# Cineform Forge

Cineform Forge is a modern, collaborative, AI-assisted browser animation editor. Built as a modular monorepo, it combines a powerful timeline, property editing, and AI animation tooling with persistent local/JSON storage and extensible rendering.

---

## 💡 Debug & Quality-First Codebase

Cineform Forge is engineered for maximum developer friendliness, observability, and reliability:

- **Maximum Verbose Logging**: Every function, action, and event handler logs entry, exit, arguments, results, and errors, making runtime behavior fully traceable.
- **Robust Error Handling**: All logic, event, and async flows are wrapped in try/catch with errors logged and surfaced to the UI when relevant.
- **Strict Linting & Type Safety**: Enforced monorepo-wide with the strictest ESLint/TypeScript rules. No `any`, explicit return types, strict boolean checks, and no accidental console usage outside of allowed diagnostics.
- **Exhaustive Automated Testing**: Unit and integration tests cover all UI, state, hooks, utilities, and edge/error/logging paths. Tests assert on both behavior and debug output.
- **CI-Ready**: The codebase passes all lint, typecheck, and test jobs for every workspace/package.

---

## Features

- Timeline-based animation editing
- AI assistant for animation and suggestions
- Modular rendering engine (DOM, Canvas 2D)
- Undo/redo, autosave, import/export, copy/paste
- Persistent local storage with dirty/unsaved detection
- **Maximum debug-friendliness:** All actions and errors are logged and test-covered
- Strict TypeScript, lint, and test workflows
- Monorepo architecture with workspaces for engine, AI, shared types, templates, and webapp

---

## Getting Started

### Quick Start

```bash
npm install
npm run build
npm run dev --filter webapp
```

### Lint, Typecheck, and Test

```bash
npm run lint      # Strict linting on all packages/apps
npm run typecheck # Strict TypeScript everywhere
npm run test      # Full test suite (unit/integration/log/error paths)
```

### Debugging & Diagnostics

- **Console logs**: Every core function and event logs inputs, state, and errors. Check the browser console or node output for detailed traces of all workflows.
- **Test logs**: Tests assert on log/error outputs as well as behavior.
- **Error feedback**: All user actions and async flows surface errors to the UI and logs.

---

## Monorepo Structure

- `apps/webapp/` – Main React app editor
- `packages/engine/` – Animation playback/rendering engine (DOM, Canvas2D), fully logged & tested
- `packages/ai-assistant/` – AI provider abstraction and API integration, with robust error/test handling
- `packages/shared-types/` – TypeScript contracts for all data flows
- `packages/templates-library/` – Animation templates for import/injection
- `packages/testing-utils/` – Testing helpers and config

---

## Contributing

- **Diagnostics**: Always check logs and test output for tracing and error reporting.
- **Code style**: Run `npm run lint` and `npm run typecheck` before submitting PRs.
- **Testing**: Add/expand tests to cover all behaviors, error and log outputs, and edge cases.
- **Debug-friendliness**: Retain and extend logging and error handling patterns in all new code.

---

## Documentation

- [Developer Guide](docs/DEVELOPER_GUIDE.md)
- [Shared Types Reference](docs/SHARED_TYPES.md)
- [MVP Success Criteria](docs/SUCCESS_CRITERIA_V1.md)

---

## License

MIT

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
