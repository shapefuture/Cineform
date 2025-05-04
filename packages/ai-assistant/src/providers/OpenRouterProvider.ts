import type { IAiProvider, GenerateAnimationParams, GenerateAnimationResponse } from './IAiProvider';
import type { AnimationElement, TimelineData } from '@cineform-forge/shared-types';
// @ts-ignore: OpenAI types may not resolve until dependency installed
import OpenAI from 'openai';
import { safeJsonParse } from '../utils/jsonParsing';

interface ExpectedAiResponse {
  elements: AnimationElement[];
  timeline: TimelineData;
}

/**
 * AI provider that connects to OpenRouter (OpenAI-compatible API) to generate animation data.
 */
export class OpenRouterProvider implements IAiProvider {
  private client: any = null;
  private model: string = 'openai/gpt-4o-mini';

  initialize(apiKey: string, options?: { model?: string; baseURL?: string }): void {
    if (!apiKey) throw new Error("OpenRouter API key is required.");
    this.client = new OpenAI({
      apiKey,
      baseURL: options?.baseURL ?? 'https://openrouter.ai/api/v1',
    });
    this.model = options?.model ?? this.model;
    // Optionally log model/endpoint used
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
      const parsed = safeJsonParse<ExpectedAiResponse>(rawResponse);
      if (parsed.success && parsed.data?.elements && parsed.data?.timeline) {
        if (!Array.isArray(parsed.data.elements) ||
            typeof parsed.data.timeline !== 'object' ||
            typeof parsed.data.timeline.duration !== 'number' ||
            !Array.isArray(parsed.data.timeline.sequences)
        ) {
          return { success: false, error: "Parsed JSON structure is invalid.", rawResponse };
        }
        return {
          success: true,
          elements: parsed.data.elements,
          timeline: parsed.data.timeline,
          rawResponse,
        };
      } else {
        return {
          success: false,
          error: `Failed to parse valid JSON from AI response. Parser Error: ${parsed.error}`,
          rawResponse,
        };
      }
    } catch (error: any) {
      return { success: false, error: `API Call Error: ${error.message}` };
    }
  }
}