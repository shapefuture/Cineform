import type { ProjectData } from './ProjectData';

describe('ProjectData interface', () => {
  it('should define the required fields', () => {
    const data: ProjectData = {
      id: 'test',
      metadata: {
        name: 'Test',
        createdAt: '2024-01-01T00:00:00.000Z',
        lastModified: '2024-01-01T00:00:00.000Z'
      },
      elements: [],
      timeline: { duration: 1, sequences: [], version: 1 },
      schemaVersion: 1
    };
    expect(data).toBeTruthy();
    expect(typeof data.id).toBe('string');
  });
});