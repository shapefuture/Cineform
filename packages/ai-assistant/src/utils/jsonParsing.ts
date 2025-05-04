/**
 * Robust and safe JSON parsing for AI-generated output, supports ```json fenced blocks.
 * Returns error details if parsing fails.
 */
export function safeJsonParse<T>(
  jsonString: string | null | undefined
): { success: boolean; data?: T; error?: string } {
  if (jsonString === null || jsonString === undefined || jsonString.trim() === "") {
    return { success: false, error: "Input string is null, undefined, or empty." };
  }
  try {
    // Handle ```json ... ``` fence
    const match = jsonString.match(/```json\s*([\s\S]*?)\s*```/);
    const potentialJson = match ? match[1].trim() : jsonString.trim();
    if (!potentialJson) {
      return { success: false, error: "Extracted JSON string is empty." };
    }
    const data = JSON.parse(potentialJson) as T;
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: `JSON Parsing Error: ${error.message}` };
  }
}