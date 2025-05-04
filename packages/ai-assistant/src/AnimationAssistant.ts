import type { IAiProvider, GenerateAnimationParams, GenerateAnimationResponse } from './providers/IAiProvider';
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