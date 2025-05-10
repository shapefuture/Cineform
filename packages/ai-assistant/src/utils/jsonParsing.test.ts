import { safeJsonParse } from './jsonParsing';

describe('safeJsonParse', () => {
  const spyLog = jest.spyOn(console, 'log').mockImplementation(() => {});
  const spyWarn = jest.spyOn(console, 'warn').mockImplementation(() => {});
  const spyError = jest.spyOn(console, 'error').mockImplementation(() => {});

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('parses plain JSON', () => {
    const str = '{"foo":42}';
    const result = safeJsonParse<{ foo: number }>(str);
    expect(result.success).toBe(true);
    expect(result.data).toEqual({ foo: 42 });
  });

  it('parses ```json fenced block', () => {
    const str = "```json\n{\"bar\":true}\n```";
    const result = safeJsonParse<{ bar: boolean }>(str);
    expect(result.success).toBe(true);
    expect(result.data).toEqual({ bar: true });
  });

  it('returns error for empty input', () => {
    const result = safeJsonParse('');
    expect(result.success).toBe(false);
    expect(result.error).toMatch(/empty/);
  });

  it('returns error for malformed JSON', () => {
    const result = safeJsonParse('{"foo":   ');
    expect(result.success).toBe(false);
    expect(result.error).toMatch(/JSON Parsing Error/);
    expect(spyError).toHaveBeenCalled();
  });

  it('returns error for empty fenced block', () => {
    const result = safeJsonParse('```json\n\n```');
    expect(result.success).toBe(false);
    expect(result.error).toMatch(/empty/);
  });
});