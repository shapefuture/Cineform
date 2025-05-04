import { AnimationAssistant } from './AnimationAssistant';

describe('AnimationAssistant', () => {
  const spyLog = jest.spyOn(console, 'log').mockImplementation(() => {});
  const spyWarn = jest.spyOn(console, 'warn').mockImplementation(() => {});
  const spyError = jest.spyOn(console, 'error').mockImplementation(() => {});

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with missing API key and fallback to dummy', () => {
    // @ts-expect-no-error
    const assistant = new AnimationAssistant('openrouter', '', {});
    expect(assistant).toBeInstanceOf(AnimationAssistant);
    expect(spyLog).toHaveBeenCalled();
  });

  it('logs and uses dummy if provider type is unknown', () => {
    // @ts-expect-no-error
    const assistant = new AnimationAssistant('nothere', 'fake-key', {});
    expect(assistant).toBeInstanceOf(AnimationAssistant);
    expect(spyLog).toHaveBeenCalledWith(
      expect.stringContaining('Unsupported AI provider type: nothere'), expect.anything()
    );
  });

  it('should call log and error on provider init failure', () => {
    // simulate provider that throws from initialize
    const FakeProvider = jest.fn().mockImplementation(() => ({
      initialize: () => { throw new Error('fail!'); },
    }));
    jest.spyOn(require('./providers/OpenRouterProvider'), 'OpenRouterProvider').mockImplementation(FakeProvider);
    // @ts-expect-no-error
    const assistant = new AnimationAssistant('openrouter', 'fake', {});
    expect(assistant).toBeInstanceOf(AnimationAssistant);
    expect(spyError).toHaveBeenCalled();
    (require('./providers/OpenRouterProvider').OpenRouterProvider as any).mockRestore?.();
  });

  it('generateAnimationStructureFromText returns dummy error if not configured', async () => {
    const assistant = new AnimationAssistant('openrouter', '', {});
    const resp = await assistant.generateAnimationStructureFromText('foo');
    expect(resp.success).toBe(false);
    expect(resp.error).toMatch(/not configured/i);
    expect(spyLog).toHaveBeenCalled();
  });

  it('generateSuggestions returns dummy error if not configured', async () => {
    const assistant = new AnimationAssistant('openrouter', '', {});
    // @ts-ignore
    const resp = await assistant.generateSuggestions({ elements: [], timeline: { duration: 1, sequences: [], version: 1 } });
    expect(resp.success).toBe(false);
    expect(resp.error).toMatch(/not configured/i);
  });

  it('should log and propagate error from generateSuggestions on provider', async () => {
    const fakeProvider = {
      isDummy: false,
      initialize: () => {},
      generateAnimationStructure: async () => ({ success: true }),
      generateSuggestions: async () => { throw new Error('API fail'); },
    };
    const assistant = Object.create(AnimationAssistant.prototype) as AnimationAssistant;
    // @ts-ignore
    assistant.provider = fakeProvider;
    // @ts-expect-error
    const resp = await assistant.generateSuggestions({ elements: [], timeline: { duration: 1, sequences: [], version: 1 } });
    expect(resp.success).toBe(false);
    expect(resp.error).toMatch(/API fail/);
    expect(spyError).toHaveBeenCalled();
  });

  // Additional logic tests can be added here for edge cases.
});