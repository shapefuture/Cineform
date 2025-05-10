/**
 * Metadata about an animation project. Editable by user.
 */
export interface ProjectMetadata {
  /**
   * Display name for this project.
   */
  name: string;
  /**
   * UTC ISO string when the project was created.
   */
  createdAt: string;
  /**
   * UTC ISO string of last modification time.
   */
  lastModified: string;
  /**
   * Project author(s).
   */
  author?: string;
  /**
   * Optional description or summary.
   */
  description?: string;
  /**
   * Tags or keywords for search.
   */
  tags?: string[];
}