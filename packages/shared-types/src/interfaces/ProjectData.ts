import type { ProjectMetadata } from './ProjectMetadata';
import type { AnimationElement } from './AnimationElement';
import type { TimelineData } from './TimelineData';

/**
 * The root structure representing a complete animation project.
 */
export interface ProjectData {
  /**
   * The unique project ID.
   */
  id: string;

  /**
   * Metadata information about the project (name, created/modified time, etc.).
   */
  metadata: ProjectMetadata;

  /**
   * All animation elements in this project.
   */
  elements: AnimationElement[];

  /**
   * The timeline definition, including durations and sequences.
   */
  timeline: TimelineData;

  /**
   * Schema version for migrations.
   */
  schemaVersion: number;
}