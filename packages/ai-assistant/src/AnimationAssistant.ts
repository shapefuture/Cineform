import type {
  IAiProvider,
  GenerateAnimationParams,
  GenerateAnimationResponse,
  GenerateSuggestionsParams,
  GenerateSuggestionsResponse,
} from './providers/IAiProvider';
import { OpenRouterProvider } from './providers/OpenRouterProvider';

export class AnimationAssistant {
  public provider: IAiProvider;

  constructor(providerType: 'openrouter' | 'gemini' = 'openrouter', apiKey: string, options?: Record<string, any>) {
    if (!apiKey) {
      console.warn('AI Provider API Key is missing. AI features will be disabled.');
      this.provider = this.createDummyProvider();
      return;
    }

    switch (providerType) {
      case 'openrouter':
        this.provider = new OpenRouterProvider();
        break;
      // case 'gemini':
      //   this.provider = new GeminiProvider();
      //   break;
      default:
        console.warn(`Unsupported AI provider type: ${providerType}. Falling back to dummy.`);
        this.provider = this.createDummyProvider();
        return;
    }
    try {
      this.provider.initialize(apiKey, options);
    } catch (error: any) {
      console.error(`Failed to initialize AI provider: ${error.message}`);
      this.provider = this.createDummyProvider();
    }
  }

  async generateAnimationStructureFromText(prompt: string): Promise<GenerateAnimationResponse> {
    if (!this.provider || this.isDummyProvider(this.provider)) {
      return { success: false, error: 'AI Assistant is not configured or API key is missing.' };
    }
    const params: GenerateAnimationParams = { prompt };
    return this.provider.generateAnimationStructure(params);
  }

  async generateSuggestions(params: GenerateSuggestionsParams): Promise<GenerateSuggestionsResponse> {
    if (!this.provider || this.isDummyProvider(this.provider) || !this.provider.generateSuggestions) {
      return { success: false, error: 'AI Assistant is not configured or suggestion support missing.' };
    }
    return this.provider.generateSuggestions(params);
  }

  private createDummyProvider(): IAiProvider {
    return {
      initialize: () => {},
      generateAnimationStructure: async () => ({ success: false, error: 'AI provider is not configured.' }),
      generateSuggestions: async () => ({ success: false, error: 'Suggestion logic not available.' }),
    };
  }
  private isDummyProvider(provider: IAiProvider): boolean {
    return typeof (provider as any).isDummy !== 'undefined';
  }
}
import { OpenRouterProvider } from './providers/OpenRouterProvider';

/**
 * Main interface for text-to-animation and AI-powered features.
 */
export class AnimationAssistant {
  private provider: IAiProvider;

  constructor(
    providerType: 'openrouter' | 'gemini' = 'openrouter',
    apiKey: string,
    options?: Record<string, any>
  ) {
    if (!apiKey) {
      this.provider = this.createDummyProvider();
      return;
    }
    switch (providerType) {
      case 'openrouter':
        this.provider = new OpenRouterProvider();
        break;
      default:
        this.provider = this.createDummyProvider();
        return;
    }
    try {
      this.provider.initialize(apiKey, options);
    } catch (error: any) {
      this.provider = this.createDummyProvider();
    }
  }

  /**
   * Generate animation data from a prompt via the configured provider.
   */
  async generateAnimationStructureFromText(prompt: string): Promise<GenerateAnimationResponse> {
    if (!this.provider || this.isDummyProvider(this.provider)) {
      return { success: false, error: "AI Assistant is not configured or API key is missing." };
    }
    const params: GenerateAnimationParams = { prompt };
    return this.provider.generateAnimationStructure(params);
  }

  private createDummyProvider(): IAiProvider {
    return {
      initialize: () => {},
      generateAnimationStructure: async () => ({
        success: false,
        error: 'AI provider is not configured.',
      }),
    };
  }
  private isDummyProvider(provider: IAiProvider): boolean {
    // Duck type detection for Dummy
    return typeof (provider as any).isDummy !== 'undefined';
  }
}