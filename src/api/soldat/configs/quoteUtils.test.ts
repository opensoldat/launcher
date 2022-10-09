import { splitQuotedStrings } from "./quoteUtils";

describe("splitQuotedStrings", () => {
  test("Splits quoted strings", () => {
    const input = '"bind" "ALT+Keypad 8" "say test"';
    const result = splitQuotedStrings(input) as string[];

    expect(result.length).toBe(3);
    expect(result).toEqual(
      expect.arrayContaining(["bind", "ALT+Keypad 8", "say test"])
    );
  });

  test('Transforms "" blocks in a quoted string to single " character', () => {
    const input = '"quote: ""hello"""';
    const result = splitQuotedStrings(input) as string[];

    expect(result.length).toBe(1);
    expect(result).toEqual(expect.arrayContaining(['quote: "hello"']));
  });

  test('Returns empty string on "" block outside a quoted string', () => {
    const input = '""';
    const result = splitQuotedStrings(input) as string[];

    expect(result.length).toBe(1);
    expect(result).toEqual(expect.arrayContaining([""]));
  });
});
