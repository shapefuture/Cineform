# SUCCESS_CRITERIA_V1

## Cineform Forge MVP Completion Criteria

- **Build, lint, typecheck, and tests all pass (CI green) for root and all packages.**
- **ElementsPanel, TimelineEditor, PreviewPanel, and PropertiesPanel all function via global state/hooks ONLY (no prop drilling).**

### Editing Flows
- Adding an element adds a sequence; deleting an element deletes its sequence(s).
- Adding, editing, deleting, and moving keyframes updates both timeline and preview playback.
- Editing properties or easing on any keyframe or element reflects immediately in both the UI and the rendered preview.
- Selection of elements and sequences is kept fully synchronized in all panels.
- Undo and redo work for all editing actions.
- Copy/paste elements (with sequence) functions, with correct ID reassignment.

### Persistence and Recovery
- Autosave writes project changes to localStorage.
- "Dirty/Unsaved" badge appears when projectData is newer than localStorage.
- Save button disables and badge clears after save.
- Reloading restores the most recent project; no data loss occurs.
- Export produces a valid JSON file, import of valid JSON loads project and resets undo.

### Safety and Usability
- User is warned (browser prompt) on page close/reload when dirty/unsaved.
- Loading and saving are robust against serialization errors.
- Timeline/element state cannot drift out of sync (deleting elements or importing keeps model valid).

### AI Integration
- AI panel can generate and display suggestions (given API key).
- AI can generate new animations from a text prompt.
- All types used in model contracts match shared-types exports.

---

_Achievement of these criteria means the MVP is complete and ready for further advanced roadmap phases or public release._

Define initial, measurable goals and acceptance criteria for Cineform Forge v1.0.

- Project builds, lints, and type-checks with zero errors.
- All packages link correctly via workspace protocol.
- Shared Types used as workspace dependency in webapp, engine, ai-assistant.
- Can run `npm install` and `npm run build` from the repo root with success.
- CI passes on develop and main branches for all required stages.
- All required interfaces and exports are defined/emittable from shared-types.