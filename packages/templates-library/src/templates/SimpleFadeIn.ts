import type { ProjectData, AnimationElement, TimelineData } from '@cineform-forge/shared-types';

const simpleFadeInElements: AnimationElement[] = [
  {
    id: 'fade-target-1',
    type: 'shape',
    name: 'Fading Box',
    initialProps: {
      x: 50,
      y: 50,
      width: 80,
      height: 80,
      backgroundColor: '#3498db',
      opacity: 0,
      borderRadius: '5px',
    },
  },
];

const simpleFadeInTimeline: TimelineData = {
  duration: 1,
  version: 1,
  sequences: [
    {
      elementId: 'fade-target-1',
      keyframes: [
        { time: 0, properties: { opacity: 0 } },
        { time: 1, properties: { opacity: 1 }, easing: 'power1.inOut' },
      ],
    },
  ],
};

/**
 * A minimal fade-in animation template.
 */
export const SimpleFadeInTemplate: Omit<ProjectData, 'id' | 'metadata'> = {
  elements: simpleFadeInElements,
  timeline: simpleFadeInTimeline,
  schemaVersion: 1,
};