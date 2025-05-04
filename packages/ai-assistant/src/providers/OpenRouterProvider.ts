import type {
  IAiProvider,
  GenerateAnimationParams,
  GenerateAnimationResponse,
  GenerateSuggestionsParams,
  GenerateSuggestionsResponse,
} from './IAiProvider';
import OpenAI from 'openai';
import type { AnimationElement, TimelineData, AnimationSuggestion } from '@cineform-forge/shared-types';
import { safeJsonParse } from '../utils/jsonParsing';

// Define the expected structure from the AI for animation generation
interface ExpectedAiResponse {
  elements: AnimationElement[];
  timeline: TimelineData;
}

export class OpenRouterProvider implements IAiProvider {
  private client: OpenAI | null = null;
  private model: string = 'openai/gpt-4o-mini';

  initialize(apiKey: string, options?: { model?: string; baseURL?: string }): void {
    if (!apiKey) {
      throw new Error('OpenRouter API key is required.');
    }
    this.client = new OpenAI({
      apiKey: apiKey,
      baseURL: options?.baseURL ?? 'https://openrouter.ai/api/v1',
    });
    this.model = options?.model ?? this.model;
    console.log(`OpenRouter Provider Initialized with model: ${this.model}`);
  }

  async generateAnimationStructure(params: GenerateAnimationParams): Promise<GenerateAnimationResponse> {
    if (!this.client) {
      return { success: false, error: 'OpenRouter client not initialized.' };
    }

    const systemPrompt = `You are an expert animation assistant. Create animation data based on the user's request.
Output *only* a single valid JSON object matching this TypeScript structure:
\`\`\`typescript
interface Response {
  elements: Array<{ id: string; type: 'shape' | 'text' | 'image'; name: string; initialProps: Record<string, any>; }>;
  timeline: { duration: number; sequences: Array<{ elementId: string; keyframes: Array<{ time: number; properties: Record<string, any>; easing?: string; }>; }>; };
}
\`\`\`
Ensure all IDs are unique strings. Use sensible initial properties (like x:0, y:0, opacity:1). Define keyframes with time (seconds), target properties, and optional easing strings (like 'power2.out'). Provide a reasonable total duration. Focus on standard web animation properties (x, y, scale, rotation, opacity).

Example Request: "A red square fades in and moves right"
Example Output:
\`\`\`json
{
  "elements": [
    { "id": "sq1", "type": "shape", "name": "Red Square", "initialProps": { "x": 0, "y": 0, "width": 50, "height": 50, "backgroundColor": "red", "opacity": 0 } }
  ],
  "timeline": {
    "duration": 2,
    "sequences": [
      { "elementId": "sq1", "keyframes": [
        { "time": 0, "properties": { "opacity": 0, "x": 0 } },
        { "time": 1, "properties": { "opacity": 1 }, "easing": "sine.inOut" },
        { "time": 2, "properties": { "x": 100 }, "easing": "power1.out" }
      ] }
    ]
  }
}
\`\`\`
`;
    try {
      const completion = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Generate animation elements and timeline data for: "${params.prompt}"` },
        ],
      });

      const rawResponse = completion.choices[0]?.message?.content;
      console.log('AI Raw Response:', rawResponse);

      const parsed = safeJsonParse<ExpectedAiResponse>(rawResponse);

      if (parsed.success && parsed.data?.elements && parsed.data?.timeline) {
        // Basic validation
        if (
          !Array.isArray(parsed.data.elements) ||
          typeof parsed.data.timeline !== 'object' ||
          typeof parsed.data.timeline.duration !== 'number' ||
          !Array.isArray(parsed.data.timeline.sequences)
        ) {
          return { success: false, error: 'Parsed JSON structure is invalid.', rawResponse: rawResponse };
        }
        console.log('AI Parsed Data:', parsed.data);
        return { success: true, elements: parsed.data.elements, timeline: parsed.data.timeline, rawResponse: rawResponse };
      } else {
        return { success: false, error: `Failed to parse valid JSON from AI response. Parser Error: ${parsed.error}`, rawResponse: rawResponse };
      }
    } catch (error: any) {
      console.error('Error calling OpenRouter API:', error);
      return { success: false, error: `API Call Error: ${error.message}` };
    }
  }

  async generateSuggestions(params: GenerateSuggestionsParams): Promise<GenerateSuggestionsResponse> {
    if (!this.client) {
      return { success: false, error: 'OpenRouter client not initialized.' };
    }

    const systemPrompt = `You are an expert animation reviewer. Analyze the provided animation data (elements and timeline) and provide specific, actionable suggestions based on core animation principles (timing, easing, spacing, anticipation, follow-through, arcs, secondary action, appeal) and potential performance issues (e.g., animating layout properties).
Output *only* a single valid JSON array matching this TypeScript structure:
\`\`\`typescript
type SuggestionType = 'easing' | 'timing' | 'principle' | 'performance';
interface AnimationSuggestion {
  type: SuggestionType;
  targetElementId?: string; // ID of element suggestion applies to (optional)
  targetKeyframeIndex?: number; // Index of keyframe suggestion applies to (optional)
  suggestion: string; // The user-facing suggestion text
  reasoning: string; // Why this suggestion improves the animation (mention principle/performance benefit)
}
type Response = AnimationSuggestion[];
\`\`\`
Keep suggestions concise and focused. If the animation looks good, return an empty array or a positive comment suggestion.

Example Suggestion:
{ "type": "easing", "targetElementId": "sq1", "targetKeyframeIndex": 2, "suggestion": "Use an 'elastic.out(1, 0.3)' ease here.", "reasoning": "Adds more character and overshoot, enhancing appeal for the bounce effect." }
`;

    const animationDataString = JSON.stringify(
      { elements: params.elements, timeline: params.timeline },
      null,
      2
    );
    const maxInputLength = 3000;
    const truncatedData =
      animationDataString.length > maxInputLength
        ? animationDataString.substring(0, maxInputLength) + '\n... (data truncated)'
        : animationDataString;

    try {
      const completion = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Analyze this animation data and provide suggestions:\n${truncatedData}` },
        ],
      });

      const rawResponse = completion.choices[0]?.message?.content;
      // Attempt to parse suggestions array
      const parsed = safeJsonParse<AnimationSuggestion[]>(rawResponse);

      if (parsed.success && Array.isArray(parsed.data)) {
        return { success: true, suggestions: parsed.data };
      } else {
        return { success: false, error: `Failed to parse valid JSON array from AI response. Error: ${parsed.error}` };
      }
    } catch (error: any) {
      return { success: false, error: `API Call Error: ${error.message}` };
    }
  }
}