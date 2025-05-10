import type {
  IAiProvider,
  GenerateAnimationParams,
  GenerateAnimationResponse,
  GenerateSuggestionsParams,
  GenerateSuggestionsResponse,
} from './providers/IAiProvider';
import { OpenRouterProvider } from './providers/OpenRouterProvider';

/**
 * Main interface for text-to-animation and AI-powered features with extensive logging and error handling.
 */
export class AnimationAssistant {
  public provider: IAiProvider;

  constructor(
    providerType: 'openrouter' | 'gemini' = 'openrouter',
    apiKey: string,
    options?: Record<string, any>
  ) {
    this.log('AnimationAssistant.constructor', { providerType, apiKey: !!apiKey, options });
    try {
      if (!apiKey) {
        this.log('No API key provided, falling back to dummy provider');
        this.provider = this.createDummyProvider();
        return;
      }
      switch (providerType) {
        case 'openrouter':
          this.provider = new OpenRouterProvider();
          break;
        default:
          this.log(`Unsupported AI provider type: ${providerType}. Falling back to dummy provider`);
          this.provider = this.createDummyProvider();
          return;
      }
      this.provider.initialize(apiKey, options);
      this.log('Provider initialized', { providerType });
    } catch (error: any) {
      this.error('Failed to initialize AI provider', error);
      this.provider = this.createDummyProvider();
    }
  }

  /**
   * Generate animation data from a prompt. All errors logged and caught.
   */
  async generateAnimationStructureFromText(prompt: string): Promise<GenerateAnimationResponse> {
    this.log('generateAnimationStructureFromText called', { prompt });
    try {
      if (!this.provider || this.isDummyProvider(this.provider)) {
        this.log('Provider not configured (dummy). Returning error', {});
        return { success: false, error: 'AI Assistant is not configured or API key is missing.' };
      }
      const params: GenerateAnimationParams = { prompt };
      const result = await this.provider.generateAnimationStructure(params);
      this.log('generateAnimationStructureFromText result', { result });
      return result;
    } catch (err: any) {
      this.error('generateAnimationStructureFromText error', err);
      return { success: false, error: err?.message || String(err) };
    }
  }

  /**
   * Generate suggestions using AI. Catches/logs any errors.
   */
  async generateSuggestions(params: GenerateSuggestionsParams): Promise<GenerateSuggestionsResponse> {
    this.log('generateSuggestions called', { params });
    try {
      if (!this.provider || this.isDummyProvider(this.provider) || !this.provider.generateSuggestions) {
        this.log('Provider not configured or missing generateSuggestions. Returning error', {});
        return { success: false, error: 'AI Assistant is not configured or suggestion support missing.' };
      }
      const result = await this.provider.generateSuggestions(params);
      this.log('generateSuggestions result', { result });
      return result;
    } catch (err: any) {
      this.error('generateSuggestions error', err);
      return { success: false, error: err?.message || String(err) };
    }
  }

  private createDummyProvider(): IAiProvider {
    this.log('createDummyProvider called');
    // Add an isDummy property for type checks
    const dummy: IAiProvider & { isDummy: true } = {
      isDummy: true,
      initialize: () => this.log('DummyProvider.initialize'),
      generateAnimationStructure: async () => {
        this.log('DummyProvider.generateAnimationStructure called');
        return { success: false, error: 'AI provider is not configured.' };
      },
      generateSuggestions: async () => {
        this.log('DummyProvider.generateSuggestions called');
        return { success: false, error: 'Suggestion logic not available.' };
      }
    };
    return dummy;
  }

  private isDummyProvider(provider: IAiProvider): boolean {
    // Duck type detection for DummyProvider
    return typeof (provider as any).isDummy !== 'undefined';
  }

  private log(message: string, data?: any) {
    // eslint-disable-next-line no-console
    console.log(`[AnimationAssistant] ${message}`, data ?? '');
  }

  private error(message: string, error?: any) {
    // eslint-disable-next-line no-console
    console.error(`[AnimationAssistant] ${message}:`, error);
  }
}