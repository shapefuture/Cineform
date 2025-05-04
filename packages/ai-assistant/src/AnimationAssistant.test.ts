import { AnimationAssistant } from './AnimationAssistant';

describe('AnimationAssistant', () => {
  const spyLog = jest.spyOn(console, 'log').mockImplementation(() => {});
  const spyWarn = jest.spyOn(console, 'warn').mockImplementation(() => {});
  const spyError = jest.spyOn(console, 'error').mockImplementation(() => {});

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with missing API key and fallback to dummy (log)', () => {
    const assistant = new AnimationAssistant('openrouter', '', {});
    expect(assistant).toBeInstanceOf(AnimationAssistant);
    expect(spyLog).toHaveBeenCalled();
  });

  it('should initialize with bad provider and fallback to dummy (log)', () => {
    // @ts-expect-no-error
    const assistant = new AnimationAssistant('notreal', '123', {});
    expect(assistant).toBeInstanceOf(AnimationAssistant);
    expect(spyLog).toHaveBeenCalledWith(
      expect.stringContaining('Unsupported AI provider'),
      expect.anything()
    );
  });

  it('should call generateAnimationStructureFromText/return error with dummy', async () => {
    const assistant = new AnimationAssistant('openrouter', '', {});
    const result = await assistant.generateAnimationStructureFromText('make a horse');
    expect(result.success).toBe(false);
    expect(result.error).toMatch(/not configured/i);
    expect(spyLog).toHaveBeenCalled();
  });

  it('should handle error in provider.generateAnimationStructure (log error)', async () => {
    // Patch the provider to throw
    class FailingProvider {
      isDummy = false;
      initialize() {}
      async generateAnimationStructure() {
        throw new Error('Simulated fail');
      }
      async generateSuggestions() {
        throw new Error('unreachable');
      }
    }
    const assistant: any = new AnimationAssistant('openrouter', 'apikey', {});
    // override for test
    assistant.provider = new FailingProvider();
    const result = await assistant.generateAnimationStructureFromText('cause error');
    expect(result.success).toBe(false);
    expect(result.error).toMatch(/Simulated/);
    expect(spyError).toHaveBeenCalled();
  });

  it('should call generateSuggestions and handle unavailable method/return error', async () => {
    // provider with no generateSuggestions
    class NoSuggestProvider {
      isDummy = false;
      initialize() {}
      async generateAnimationStructure() { return { success: true }; }
    }
    const assistant: any = new AnimationAssistant('openrouter', 'apikey', {});
    assistant.provider = new NoSuggestProvider() as any;
    const result = await assistant.generateSuggestions({ elements: [], timeline: { duration: 1, sequences: [], version: 1 } });
    expect(result.success).toBe(false);
    expect(result.error).toMatch(/suggestion support/);
  });

  it('should handle errors in generateSuggestions', async () => {
    class FailingProvider {
      isDummy = false;
      initialize() {}
      async generateAnimationStructure() { return { success: true }; }
      async generateSuggestions() { throw new Error('failSuggest'); }
    }
    const assistant: any = new AnimationAssistant('openrouter', 'apikey', {});
    assistant.provider = new FailingProvider();
    const result = await assistant.generateSuggestions({ elements: [], timeline: { duration: 1, sequences: [], version: 1 } });
    expect(result.success).toBe(false);
    expect(result.error).toMatch(/failSuggest/);
    expect(spyError).toHaveBeenCalled();
  });
});

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