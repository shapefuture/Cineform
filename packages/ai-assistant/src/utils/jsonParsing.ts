/**
 * Robust and safe JSON parsing for AI-generated output, supports ```json fenced blocks.
 * Returns error details if parsing fails. Logs entry, output and error.
 */
export function safeJsonParse<T>(
  jsonString: string | null | undefined
): { success: boolean; data?: T; error?: string } {
  // eslint-disable-next-line no-console
  console.log(`[safeJsonParse] called. Input:`, jsonString);
  if (jsonString === null || jsonString === undefined || jsonString.trim() === "") {
    // eslint-disable-next-line no-console
    console.warn(`[safeJsonParse] Input string is null, undefined, or empty.`);
    return { success: false, error: "Input string is null, undefined, or empty." };
  }
  try {
    // Handle ```json ... ``` fence
    const match = jsonString.match(/```json\s*([\s\S]*?)\s*```/);
    const potentialJson = match ? match[1].trim() : jsonString.trim();
    if (!potentialJson) {
      // eslint-disable-next-line no-console
      console.warn(`[safeJsonParse] Extracted JSON string is empty.`);
      return { success: false, error: "Extracted JSON string is empty." };
    }
    const data = JSON.parse(potentialJson) as T;
    // eslint-disable-next-line no-console
    console.log(`[safeJsonParse] Success. Output:`, data);
    return { success: true, data };
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.error(`[safeJsonParse] JSON Parsing Error: ${error.message}`, error, jsonString);
    return { success: false, error: `JSON Parsing Error: ${error.message}` };
  }
}