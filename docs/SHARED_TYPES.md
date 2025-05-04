# Cineform Forge Shared Types

All model/data exchanged between UI, engine, and assistants conforms to these types (from `@cineform-forge/shared-types`):

---

## ProjectData

```ts
interface ProjectData {
  id: string;
  metadata: ProjectMetadata;
  elements: AnimationElement[];
  timeline: TimelineData;
  schemaVersion: number;
}
```

## ProjectMetadata

```ts
interface ProjectMetadata {
  name: string;
  createdAt: string;     // ISO8601
  lastModified: string;  // ISO8601
  author?: string;
  description?: string;
  tags?: string[];
}
```

## AnimationElement

```ts
interface AnimationElement {
  id: string;
  type: 'shape' | 'text' | 'image' | 'group' | 'audio' | 'camera';
  name: string;
  initialProps: Record<string, any>;
}
```

## TimelineData

```ts
interface TimelineData {
  duration: number;
  sequences: AnimationSequence[];
  version: number;
  [extra: string]: any;
}
```

## AnimationSequence

```ts
interface AnimationSequence {
  elementId: string;
  keyframes: Keyframe[];
}
```

## Keyframe

```ts
interface Keyframe {
  time: number;
  properties: Record<string, any>;
  easing?: string;
}
```

## RenderingOptions

```ts
interface RenderingOptions {
  target: 'dom' | 'canvas2d' | 'webgl';
  backgroundColor?: string;
  showPerformanceMonitor?: boolean;
  [extra: string]: any;
}
```

## ScrollTrigger

```ts
interface ScrollTrigger {
  trigger: string;
  start: string;
  end: string;
  scrub?: boolean | number;
  pin?: boolean;
  [extra: string]: any;
}
```

## AnimationSuggestion

```ts
type SuggestionType = 'easing' | 'timing' | 'principle' | 'performance';

interface AnimationSuggestion {
  type: SuggestionType;
  targetElementId?: string;
  targetKeyframeIndex?: number;
  suggestion: string;
  reasoning: string;
}
```

---

**See also:** each interface’s JSDoc in `packages/shared-types/src/interfaces/` for further details.