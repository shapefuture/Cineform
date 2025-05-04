# Cineform Forge Monorepo

**Cineform Forge** is a modular, modern animation editor and engine, powered by TypeScript, TurboRepo, and AI features for smarter animation workflows.

## Project Structure

- `apps/webapp/` – Main React app frontend
- `packages/engine/` – Core animation engine (supports DOM/GSAP and Canvas2D adapters)
- `packages/ai-assistant/` – Pluggable AI provider and abstraction (OpenRouter, more soon)
- `packages/shared-types/` – Shared interfaces and data types
- `packages/templates-library/` – Animation/project templates
- `packages/testing-utils/` – (Optional/future) Shared test helpers

## Developer Experience

- Managed with Turborepo: use `npm run build`, `npm run test`, `npm run dev --filter webapp`
- End-to-end type safety and automatic test/lint enforcement via root scripts
- Easily plug in AI (OpenRouter) for animation generation and optimization
- CI powered by GitHub Actions, ready for PR validation

## Quick Start

```sh
# Install
npm install

# Build all packages/apps
npm run build

# Run tests
npm run test

# Develop webapp (with hot reload)
npm run dev --filter webapp
```

## Key Features

- GSAP and Canvas2D rendering in engine, runtime switchable
- Timeline, elements, and properties editing in the webapp
- AI-assisted animation creation and improvement
- Modular monorepo, ready for expansion (WebGL, SVG, exporter, etc.)

---

© Cineform Forge Authors
