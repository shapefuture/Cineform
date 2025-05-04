import { SimpleFadeInTemplate } from './SimpleFadeIn';

describe('SimpleFadeInTemplate', () => {
  it('should export elements and timeline', () => {
    expect(SimpleFadeInTemplate).toHaveProperty('elements');
    expect(SimpleFadeInTemplate).toHaveProperty('timeline');
    expect(Array.isArray(SimpleFadeInTemplate.elements)).toBe(true);
  });
});