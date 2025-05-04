import { AnimationAssistant } from './AnimationAssistant';

describe('AnimationAssistant', () => {
  it('should initialize with missing API key and fallback to dummy', () => {
    // @ts-expect-no-error
    const assistant = new AnimationAssistant('openrouter', '', {});
    expect(assistant).toBeInstanceOf(AnimationAssistant);
  });
});